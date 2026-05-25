package gotest

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/aperturerobotics/goscript/compiler"
	"github.com/aperturerobotics/goscript/compiler/tsworkspace"
	"github.com/pkg/errors"
)

const combinedRuntimeResultPrefix = "__GOSCRIPT_PACKAGE_RESULT__"

// Runner owns GoScript package-test loading, compilation, typecheck, and execution.
type Runner struct {
	service *compiler.CompileService
}

// NewRunner creates a package-test runner.
func NewRunner() *Runner {
	return &Runner{service: compiler.NewCompileService()}
}

// Run executes package tests through the GoScript compiler and TypeScript runtime.
func (r *Runner) Run(ctx context.Context, req *Request) (*Result, error) {
	if r == nil {
		r = NewRunner()
	}
	norm, err := req.normalize()
	if err != nil {
		return nil, err
	}
	r.service = compiler.NewCompileService(norm.OverrideDirs...)
	if norm.Timeout != 0 {
		var cancel context.CancelFunc
		ctx, cancel = context.WithTimeout(ctx, norm.Timeout)
		defer cancel()
	}
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	if norm.WorkDir == "" {
		workRoot := filepath.Join(norm.Dir, ".tmp")
		if err := os.MkdirAll(workRoot, 0o755); err != nil {
			return nil, errors.Wrap(err, "create goscript test work root")
		}
		norm.WorkDir, err = os.MkdirTemp(workRoot, "goscript-test-")
		if err != nil {
			return nil, errors.Wrap(err, "create goscript test work directory")
		}
	}
	if norm.OutputRoot == "" {
		norm.OutputRoot = filepath.Join(norm.WorkDir, "output")
	}

	result := &Result{
		WorkDir:    norm.WorkDir,
		OutputRoot: norm.OutputRoot,
	}
	workspace := tsworkspace.NewOwner(norm.WorkDir, norm.Dir)

	runPattern, err := compileRunPattern(norm.Run)
	if err != nil {
		diag := compiler.Diagnostic{
			Severity: compiler.DiagnosticSeverityError,
			Code:     "goscript/gotest:run-pattern",
			Message:  "invalid -run pattern",
			Detail:   err.Error(),
		}
		result.Diagnostics = append(result.Diagnostics, diag)
		markAllFailures(result, OwnerPackageGraph, compiler.NewCompileError([]compiler.Diagnostic{diag}).Error())
		return result, nil
	}

	testGraphReq := &compiler.CompileRequest{
		Patterns:            append([]string(nil), norm.Patterns...),
		Dir:                 norm.Dir,
		OutputPath:          norm.OutputRoot,
		BuildFlags:          append([]string(nil), norm.BuildFlags...),
		OverrideDirs:        append([]string(nil), norm.OverrideDirs...),
		DependencyMode:      compiler.DependencyModeRequested,
		RuntimeEmissionMode: compiler.RuntimeEmissionModeEmit,
		Tests:               true,
	}
	testGraph, loadDiagnostics := r.service.PackageGraphOwner().LoadTestGraph(ctx, testGraphReq)
	result.Diagnostics = append(result.Diagnostics, loadDiagnostics...)
	result.Packages = packageResults(testGraph, runPattern)
	if diagnosticsHaveErrors(loadDiagnostics) && len(result.Packages) == 0 {
		markAllFailures(result, OwnerPackageGraph, diagnosticsSummary(loadDiagnostics))
		return result, nil
	}

	outputRoots := r.compilePackageOutputs(ctx, norm, result)

	if phase := workspace.EnsurePackageJSON(); phase.Failed() {
		markAllFailures(result, OwnerTestRunner, phase.Error)
		return result, nil
	}
	nodeTypesAvailable := tsworkspace.NodeTypesPresent(norm.WorkDir, norm.Dir)
	if phase := workspace.EnsureNodeAmbientTypes(); phase.Failed() {
		markAllFailures(result, OwnerTestRunner, phase.Error)
		return result, nil
	}
	if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, "tsconfig.json", renderRuntimeTypeScriptProject(norm, outputRoots, nodeTypesAvailable)); phase.Failed() {
		markAllFailures(result, OwnerTestRunner, phase.Error)
		return result, nil
	}
	r.runPackageTools(ctx, norm, workspace, result, outputRoots, nodeTypesAvailable)
	return result, nil
}

func (r *Runner) runPackageTools(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	outputRoots []string,
	nodeTypesAvailable bool,
) {
	indexes := r.preparePackageWorkspaces(req, workspace, result, outputRoots, nodeTypesAvailable)
	if len(indexes) == 0 {
		return
	}
	if len(indexes) == 1 {
		r.runPackageTypeCheckAndRuntime(ctx, req, workspace, result, indexes[0])
		return
	}
	typecheck := workspace.RunTool(ctx, tsworkspace.PhaseTypeCheck, req.WorkDir, "tsgo", "--project", "tsconfig.json")
	if typecheck.Failed() {
		if owner, ok := aggregateTypeCheckFailureOwner(typecheck.Output); ok {
			markTypeCheckFailures(result, owner, processErrorText(typecheck))
			return
		}
		r.runPackageTypeChecksAndRuntimes(ctx, req, workspace, result, indexes)
		return
	}
	for _, idx := range indexes {
		result.Packages[idx].Phases.TypeCheck = PhaseStatusPass
	}
	r.runPackageRuntimes(ctx, req, workspace, result, indexes)
}

func (r *Runner) preparePackageWorkspaces(
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	outputRoots []string,
	nodeTypesAvailable bool,
) []int {
	var indexes []int
	for idx := range result.Packages {
		if !shouldCompilePackage(result.Packages[idx]) {
			continue
		}
		if r.preparePackageWorkspace(req, workspace, result, outputRoots, nodeTypesAvailable, idx) {
			indexes = append(indexes, idx)
		}
	}
	return indexes
}

func (r *Runner) preparePackageWorkspace(
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	outputRoots []string,
	nodeTypesAvailable bool,
	idx int,
) bool {
	result.Packages[idx].Phases.Workspace = PhaseStatusPass
	outputRoot := outputRoots[idx]
	runnerFile := packageRunnerFile(idx)
	if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, runnerFile, renderRunner(result.Packages[idx], req)); phase.Failed() {
		result.Packages[idx].Owner = OwnerTestRunner
		result.Packages[idx].Phases.Workspace = PhaseStatusFail
		result.Packages[idx].Error = phase.Error
		return false
	}
	tsconfigFile := packageTSConfigFile(idx)
	if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, tsconfigFile, renderTypeScriptProject(req, outputRoot, runnerFile, tsconfigFile, nodeTypesAvailable)); phase.Failed() {
		result.Packages[idx].Owner = OwnerTestRunner
		result.Packages[idx].Phases.Workspace = PhaseStatusFail
		result.Packages[idx].Error = phase.Error
		return false
	}
	return true
}

func (r *Runner) runPackageTypeChecksAndRuntimes(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	indexes []int,
) {
	parallelism := max(req.Parallelism, 1)
	sem := make(chan struct{}, parallelism)
	var wg sync.WaitGroup
	for _, idx := range packageExecutionIndexes(result, indexes) {
		wg.Go(func() {
			select {
			case sem <- struct{}{}:
				defer func() { <-sem }()
			case <-ctx.Done():
				result.Packages[idx].Owner = OwnerTestRunner
				result.Packages[idx].Phases.TypeCheck = PhaseStatusFail
				result.Packages[idx].Error = ctx.Err().Error()
				return
			}
			r.runPackageTypeCheckAndRuntime(ctx, req, workspace, result, idx)
		})
	}
	wg.Wait()
}

func (r *Runner) runPackageTypeCheckAndRuntime(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	idx int,
) {
	if !r.runPackageTypeCheck(ctx, req, workspace, result, idx) {
		return
	}
	r.runPackageRuntime(ctx, req, workspace, result, idx)
}

func (r *Runner) runPackageTypeCheck(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	idx int,
) bool {
	typecheck := workspace.RunTool(ctx, tsworkspace.PhaseTypeCheck, req.WorkDir, "tsgo", "--project", packageTSConfigFile(idx))
	if typecheck.Failed() {
		result.Packages[idx].Owner = classifyProcessOutput(typecheck.Output)
		result.Packages[idx].Phases.TypeCheck = PhaseStatusFail
		result.Packages[idx].Error = processErrorText(typecheck)
		return false
	}
	result.Packages[idx].Phases.TypeCheck = PhaseStatusPass
	return true
}

func (r *Runner) runPackageRuntimes(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	indexes []int,
) {
	if len(indexes) > 1 &&
		(req.RuntimeGroups || req.Parallelism == 1) &&
		r.runCombinedPackageRuntimes(ctx, req, workspace, result, indexes) {
		return
	}
	r.runPackageRuntimesIndividually(ctx, req, workspace, result, indexes)
}

func (r *Runner) runPackageRuntimesIndividually(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	indexes []int,
) {
	parallelism := max(req.Parallelism, 1)
	sem := make(chan struct{}, parallelism)
	var wg sync.WaitGroup
	for _, idx := range packageExecutionIndexes(result, indexes) {
		wg.Go(func() {
			select {
			case sem <- struct{}{}:
				defer func() { <-sem }()
			case <-ctx.Done():
				result.Packages[idx].Owner = OwnerTestRunner
				result.Packages[idx].Phases.Runtime = PhaseStatusFail
				result.Packages[idx].Error = ctx.Err().Error()
				return
			}
			r.runPackageRuntime(ctx, req, workspace, result, idx)
		})
	}
	wg.Wait()
}

func (r *Runner) runCombinedPackageRuntimes(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	indexes []int,
) bool {
	ordered := packageExecutionIndexes(result, indexes)
	chunks := packageRuntimeChunks(ordered, max(req.Parallelism, 1))
	if len(chunks) == 0 {
		return true
	}
	if len(chunks) == 1 {
		return r.runCombinedPackageRuntime(ctx, req, workspace, result, "runner-all.ts", chunks[0])
	}

	var mu sync.Mutex
	ok := true
	var wg sync.WaitGroup
	for chunkIdx, chunk := range chunks {
		runnerFile := "runner-all-" + strconv.Itoa(chunkIdx) + ".ts"
		wg.Go(func() {
			if r.runCombinedPackageRuntime(ctx, req, workspace, result, runnerFile, chunk) {
				return
			}
			mu.Lock()
			ok = false
			mu.Unlock()
		})
	}
	wg.Wait()
	return ok
}

func packageRuntimeChunks(indexes []int, parallelism int) [][]int {
	if len(indexes) == 0 {
		return nil
	}
	if parallelism < 1 {
		parallelism = 1
	}
	if parallelism > len(indexes) {
		parallelism = len(indexes)
	}
	chunks := make([][]int, parallelism)
	for idx, packageIdx := range indexes {
		chunks[idx%parallelism] = append(chunks[idx%parallelism], packageIdx)
	}
	return chunks
}

func (r *Runner) runCombinedPackageRuntime(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	runnerFile string,
	indexes []int,
) bool {
	if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, runnerFile, renderCombinedRunner(result, indexes, req)); phase.Failed() {
		return false
	}
	runtime := workspace.RunTool(ctx, tsworkspace.PhaseRuntime, req.WorkDir, "bun", runnerFile)
	if runtime.Failed() {
		return false
	}
	records, ok := parseCombinedRuntimeRecords(runtime.Output)
	if !ok {
		return false
	}
	byPath := make(map[string]combinedRuntimeRecord, len(records))
	for _, record := range records {
		byPath[record.PackagePath] = record
	}
	for _, idx := range indexes {
		record, ok := byPath[result.Packages[idx].PackagePath]
		if !ok {
			return false
		}
		result.Packages[idx].Elapsed = time.Duration(record.ElapsedMS) * time.Millisecond
		result.Packages[idx].Output = strings.TrimSpace(record.Output)
		if record.OK {
			result.Packages[idx].Phases.Runtime = PhaseStatusPass
			result.Packages[idx].Action = ActionPass
			continue
		}
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = classifyProcessOutput(record.Output)
		result.Packages[idx].Phases.Runtime = PhaseStatusFail
		result.Packages[idx].Error = strings.TrimSpace(record.Output)
		if result.Packages[idx].Error == "" {
			result.Packages[idx].Error = "goscript test failed"
		}
	}
	return true
}

func (r *Runner) runPackageRuntime(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	idx int,
) {
	runtime := workspace.RunTool(ctx, tsworkspace.PhaseRuntime, req.WorkDir, "bun", packageRunnerFile(idx))
	result.Packages[idx].Elapsed = runtime.Elapsed
	result.Packages[idx].Output = strings.TrimSpace(runtime.Output)
	if runtime.Failed() {
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = classifyProcessOutput(runtime.Output)
		result.Packages[idx].Phases.Runtime = PhaseStatusFail
		result.Packages[idx].Error = runtime.Error
		return
	}
	result.Packages[idx].Phases.Runtime = PhaseStatusPass
	result.Packages[idx].Action = ActionPass
}

func (r *Runner) compileTestImports(
	ctx context.Context,
	req *normalizedRequest,
	outputRoot string,
	pkg *PackageResult,
	result *Result,
) bool {
	imports := append([]string(nil), pkg.TestImports...)
	slices.Sort(imports)
	imports = slices.Compact(imports)
	for _, importPath := range imports {
		if importPath == "" || importPath == pkg.PackagePath {
			continue
		}
		compileReq := &compiler.CompileRequest{
			Patterns:            []string{importPath},
			Dir:                 req.Dir,
			OutputPath:          outputRoot,
			BuildFlags:          append([]string(nil), req.BuildFlags...),
			OverrideDirs:        append([]string(nil), req.OverrideDirs...),
			DependencyMode:      compiler.DependencyModeAll,
			RuntimeEmissionMode: compiler.RuntimeEmissionModeEmit,
			Tests:               false,
			AllDependencies:     true,
		}
		compileResult, compileErr := r.service.Compile(ctx, compileReq)
		if compileResult != nil {
			result.Diagnostics = append(result.Diagnostics, compileResult.Diagnostics...)
		}
		if compileErr != nil {
			pkg.Action = ActionFail
			if compileResult != nil {
				pkg.Owner = classifyDiagnostics(compileResult.Diagnostics)
			}
			markCompilePhase(pkg, compileResult, false)
			pkg.Error = compileErr.Error()
			return false
		}
		markCompilePhase(pkg, compileResult, true)
	}
	return true
}

func (r *Runner) compilePackageOutputs(ctx context.Context, req *normalizedRequest, result *Result) []string {
	outputRoots := make([]string, len(result.Packages))
	if r.compilePackageBatch(ctx, req, result, outputRoots) {
		return outputRoots
	}
	return r.compilePackageOutputsIndividually(ctx, req, result)
}

func (r *Runner) compilePackageBatch(ctx context.Context, req *normalizedRequest, result *Result, outputRoots []string) bool {
	packagePaths := runnablePackagePaths(result.Packages)
	if len(packagePaths) == 0 {
		return true
	}
	testCompileReq := &compiler.CompileRequest{
		Patterns:            packagePaths,
		Dir:                 req.Dir,
		OutputPath:          req.OutputRoot,
		BuildFlags:          append([]string(nil), req.BuildFlags...),
		OverrideDirs:        append([]string(nil), req.OverrideDirs...),
		DependencyMode:      compiler.DependencyModeAll,
		RuntimeEmissionMode: compiler.RuntimeEmissionModeEmit,
		Tests:               true,
		AllDependencies:     true,
	}
	testCompileResult, testCompileErr := r.service.Compile(ctx, testCompileReq)
	if testCompileErr != nil {
		return false
	}
	if testCompileResult != nil {
		result.Diagnostics = append(result.Diagnostics, testCompileResult.Diagnostics...)
	}
	for idx := range result.Packages {
		if !shouldCompilePackage(result.Packages[idx]) {
			continue
		}
		outputRoots[idx] = req.OutputRoot
		markCompilePhase(&result.Packages[idx], testCompileResult, true)
	}
	return true
}

func (r *Runner) compilePackageOutputsIndividually(ctx context.Context, req *normalizedRequest, result *Result) []string {
	outputRoots := make([]string, len(result.Packages))
	for idx := range result.Packages {
		if !shouldCompilePackage(result.Packages[idx]) {
			continue
		}
		outputRoot := packageOutputRoot(req, idx)
		outputRoots[idx] = outputRoot
		compileReq := &compiler.CompileRequest{
			Patterns:            []string{result.Packages[idx].PackagePath},
			Dir:                 req.Dir,
			OutputPath:          outputRoot,
			BuildFlags:          append([]string(nil), req.BuildFlags...),
			OverrideDirs:        append([]string(nil), req.OverrideDirs...),
			DependencyMode:      compiler.DependencyModeAll,
			RuntimeEmissionMode: compiler.RuntimeEmissionModeEmit,
			Tests:               false,
			AllDependencies:     true,
		}
		if compileResult, compileErr := r.service.Compile(ctx, compileReq); compileErr != nil {
			result.Packages[idx].Action = ActionFail
			if compileResult != nil {
				result.Diagnostics = append(result.Diagnostics, compileResult.Diagnostics...)
				result.Packages[idx].Owner = classifyDiagnostics(compileResult.Diagnostics)
			}
			markCompilePhase(&result.Packages[idx], compileResult, false)
			result.Packages[idx].Error = compileErr.Error()
			continue
		} else if compileResult != nil {
			result.Diagnostics = append(result.Diagnostics, compileResult.Diagnostics...)
			markCompilePhase(&result.Packages[idx], compileResult, true)
		}
		if !r.compileTestImports(ctx, req, outputRoot, &result.Packages[idx], result) {
			continue
		}
		testCompileReq := &compiler.CompileRequest{
			Patterns:            []string{result.Packages[idx].PackagePath},
			Dir:                 req.Dir,
			OutputPath:          outputRoot,
			BuildFlags:          append([]string(nil), req.BuildFlags...),
			OverrideDirs:        append([]string(nil), req.OverrideDirs...),
			DependencyMode:      compiler.DependencyModeAll,
			RuntimeEmissionMode: compiler.RuntimeEmissionModeEmit,
			Tests:               true,
			AllDependencies:     true,
		}
		if compileResult, compileErr := r.service.Compile(ctx, testCompileReq); compileErr != nil {
			result.Packages[idx].Action = ActionFail
			if compileResult != nil {
				result.Diagnostics = append(result.Diagnostics, compileResult.Diagnostics...)
				result.Packages[idx].Owner = classifyDiagnostics(compileResult.Diagnostics)
			}
			markCompilePhase(&result.Packages[idx], compileResult, false)
			result.Packages[idx].Error = compileErr.Error()
			continue
		} else if compileResult != nil {
			result.Diagnostics = append(result.Diagnostics, compileResult.Diagnostics...)
			markCompilePhase(&result.Packages[idx], compileResult, true)
		}
	}
	return outputRoots
}

func compileRunPattern(pattern string) (*regexp.Regexp, error) {
	pattern = strings.TrimSpace(pattern)
	if pattern == "" {
		return nil, nil
	}
	return regexp.Compile(pattern)
}

func packageResults(testGraph *compiler.PackageTestGraph, runPattern *regexp.Regexp) []PackageResult {
	if testGraph == nil {
		return nil
	}
	results := make([]PackageResult, 0, len(testGraph.Packages))
	for _, pkg := range testGraph.Packages {
		result := newSkippedPackageResult(pkg.PackagePath)
		result.SourceDir = packageSourceDir(pkg)
		result.Tests = append(result.Tests, packageVariantTests(pkg.SamePackageTests, runPattern)...)
		result.Tests = append(result.Tests, packageVariantTests(pkg.ExternalPackageTests, runPattern)...)
		result.TestImports = packageTestImports(pkg)
		slices.SortFunc(result.Tests, func(a, b Test) int {
			if a.Name == b.Name {
				return strings.Compare(a.PackagePath, b.PackagePath)
			}
			return strings.Compare(a.Name, b.Name)
		})
		if len(result.Tests) != 0 {
			result.TestPackagePath = result.Tests[0].PackagePath
			result.Action = ActionFail
			result.Phases = PackagePhases{}
		}
		if diagnosticsHaveErrors(pkg.Diagnostics) {
			result.Action = ActionFail
			result.Owner = OwnerPackageGraph
			result.Error = diagnosticsSummary(pkg.Diagnostics)
			result.Phases = failurePhases(OwnerPackageGraph)
		}
		results = append(results, result)
	}
	return results
}

func packageSourceDir(pkg *compiler.PackageTestGraphPackage) string {
	if pkg == nil {
		return ""
	}
	for _, files := range [][]string{
		pkg.CompiledGoFiles,
		pkg.GoFiles,
		testVariantCompiledGoFiles(pkg.SamePackageTests),
		testVariantGoFiles(pkg.SamePackageTests),
		testVariantCompiledGoFiles(pkg.ExternalPackageTests),
		testVariantGoFiles(pkg.ExternalPackageTests),
	} {
		if len(files) != 0 && files[0] != "" {
			return filepath.Dir(files[0])
		}
	}
	return ""
}

func testVariantCompiledGoFiles(variant *compiler.PackageTestGraphVariant) []string {
	if variant == nil {
		return nil
	}
	return variant.CompiledGoFiles
}

func testVariantGoFiles(variant *compiler.PackageTestGraphVariant) []string {
	if variant == nil {
		return nil
	}
	return variant.GoFiles
}

func newSkippedPackageResult(packagePath string) PackageResult {
	return PackageResult{
		PackagePath: packagePath,
		Action:      ActionSkip,
		Phases: PackagePhases{
			Workspace: PhaseStatusSkip,
			Compile:   PhaseStatusSkip,
			Emit:      PhaseStatusSkip,
			TypeCheck: PhaseStatusSkip,
			Runtime:   PhaseStatusSkip,
		},
	}
}

func packageTestImports(pkg *compiler.PackageTestGraphPackage) []string {
	importSet := make(map[string]bool)
	for _, variant := range []*compiler.PackageTestGraphVariant{pkg.SamePackageTests, pkg.ExternalPackageTests} {
		if variant == nil {
			continue
		}
		for _, importPath := range variant.Imports {
			importSet[importPath] = true
		}
	}
	imports := make([]string, 0, len(importSet))
	for importPath := range importSet {
		imports = append(imports, importPath)
	}
	slices.Sort(imports)
	return imports
}

func packageVariantTests(variant *compiler.PackageTestGraphVariant, runPattern *regexp.Regexp) []Test {
	if variant == nil {
		return nil
	}
	tests := make([]Test, 0, len(variant.Tests))
	for _, test := range variant.Tests {
		if runPattern != nil && !runPattern.MatchString(test.Name) {
			continue
		}
		tests = append(tests, Test{
			Name:        test.Name,
			PackagePath: test.PackagePath,
		})
	}
	return tests
}

func shouldCompilePackage(result PackageResult) bool {
	return result.Action != ActionSkip && result.Owner == "" && result.Error == ""
}

func runnablePackagePaths(results []PackageResult) []string {
	seen := make(map[string]bool)
	paths := make([]string, 0, len(results))
	for _, result := range results {
		if !shouldCompilePackage(result) {
			continue
		}
		if result.PackagePath == "" || seen[result.PackagePath] {
			continue
		}
		seen[result.PackagePath] = true
		paths = append(paths, result.PackagePath)
	}
	slices.Sort(paths)
	return paths
}

func packageExecutionIndexes(result *Result, indexes []int) []int {
	ordered := append([]int(nil), indexes...)
	slices.SortFunc(ordered, func(a, b int) int {
		var aPkg, bPkg PackageResult
		if result != nil {
			if a >= 0 && a < len(result.Packages) {
				aPkg = result.Packages[a]
			}
			if b >= 0 && b < len(result.Packages) {
				bPkg = result.Packages[b]
			}
		}
		if len(aPkg.Tests) != len(bPkg.Tests) {
			return len(bPkg.Tests) - len(aPkg.Tests)
		}
		return strings.Compare(aPkg.PackagePath, bPkg.PackagePath)
	})
	return ordered
}

func markAllFailures(result *Result, owner Owner, message string) {
	message = strings.TrimSpace(message)
	if result == nil {
		return
	}
	if len(result.Packages) == 0 {
		result.Packages = append(result.Packages, PackageResult{
			PackagePath: "package-patterns",
			Action:      ActionFail,
			Owner:       owner,
			Error:       message,
			Phases:      failurePhases(owner),
		})
		return
	}
	for idx := range result.Packages {
		if result.Packages[idx].Action == ActionSkip {
			continue
		}
		if result.Packages[idx].Action == ActionFail && (result.Packages[idx].Owner != "" || result.Packages[idx].Error != "") {
			continue
		}
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = owner
		result.Packages[idx].Error = message
		result.Packages[idx].Phases = failurePhases(owner)
	}
}

func markTypeCheckFailures(result *Result, owner Owner, message string) {
	message = strings.TrimSpace(message)
	if result == nil {
		return
	}
	for idx := range result.Packages {
		if !shouldCompilePackage(result.Packages[idx]) {
			continue
		}
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = owner
		result.Packages[idx].Error = message
		result.Packages[idx].Phases.TypeCheck = PhaseStatusFail
		result.Packages[idx].Phases.Runtime = PhaseStatusSkip
	}
}

func failurePhases(owner Owner) PackagePhases {
	if owner == OwnerPackageGraph {
		return PackagePhases{
			Workspace: PhaseStatusSkip,
			Compile:   PhaseStatusFail,
			Emit:      PhaseStatusSkip,
			TypeCheck: PhaseStatusSkip,
			Runtime:   PhaseStatusSkip,
		}
	}
	return PackagePhases{
		Workspace: PhaseStatusFail,
		Compile:   PhaseStatusSkip,
		Emit:      PhaseStatusSkip,
		TypeCheck: PhaseStatusSkip,
		Runtime:   PhaseStatusSkip,
	}
}

func packageOutputRoot(req *normalizedRequest, idx int) string {
	return filepath.Join(req.OutputRoot, "package-"+strconv.Itoa(idx))
}

func packageRunnerFile(idx int) string {
	return "runner-" + strconv.Itoa(idx) + ".ts"
}

func packageTSConfigFile(idx int) string {
	return "tsconfig-" + strconv.Itoa(idx) + ".json"
}

func renderRunner(result PackageResult, req *normalizedRequest) string {
	var b strings.Builder
	b.WriteString("import { runTests } from \"@goscript/testing/index.js\"\n")
	imports := runnerImports(result.Tests)
	for idx, packagePath := range imports {
		b.WriteString("import * as pkg")
		b.WriteString(strconv.Itoa(idx))
		b.WriteString(" from ")
		b.WriteString(strconv.Quote("@goscript/" + packagePath + "/index.js"))
		b.WriteString("\n")
	}
	b.WriteString("\n")
	writeProcessChdir(&b, result.SourceDir)
	b.WriteString("const result = await runTests(")
	b.WriteString(strconv.Quote(result.PackagePath))
	b.WriteString(", [\n")
	for idx, test := range result.Tests {
		b.WriteString("\t{ name: ")
		b.WriteString(strconv.Quote(test.Name))
		b.WriteString(", fn: async (t) => await pkg")
		b.WriteString(strconv.Itoa(slices.Index(imports, test.PackagePath)))
		b.WriteString(".")
		b.WriteString(test.Name)
		b.WriteString("(t) }")
		if idx != len(result.Tests)-1 {
			b.WriteString(",")
		}
		b.WriteString("\n")
	}
	b.WriteString("], { verbose: ")
	if req.Verbose {
		b.WriteString("true")
	} else {
		b.WriteString("false")
	}
	b.WriteString(", count: ")
	b.WriteString(strconv.Itoa(req.Count))
	b.WriteString(", short: ")
	if req.Short {
		b.WriteString("true")
	} else {
		b.WriteString("false")
	}
	b.WriteString(" })\n")
	b.WriteString("if (!result.ok) {\n\tthrow new Error(\"goscript test failed\")\n}\n")
	b.WriteString("if (typeof process !== \"undefined\" && process.exit) {\n\tprocess.exit(0)\n}\n")
	return b.String()
}

type combinedRuntimeRecord struct {
	PackagePath string `json:"packagePath"`
	OK          bool   `json:"ok"`
	ElapsedMS   int64  `json:"elapsedMs"`
	Output      string `json:"output"`
}

func parseCombinedRuntimeRecords(output string) ([]combinedRuntimeRecord, bool) {
	var records []combinedRuntimeRecord
	for line := range strings.SplitSeq(output, "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, combinedRuntimeResultPrefix) {
			continue
		}
		var record combinedRuntimeRecord
		if err := json.Unmarshal([]byte(strings.TrimPrefix(line, combinedRuntimeResultPrefix)), &record); err != nil {
			return nil, false
		}
		if record.PackagePath == "" {
			return nil, false
		}
		records = append(records, record)
	}
	return records, len(records) != 0
}

func renderCombinedRunner(result *Result, indexes []int, req *normalizedRequest) string {
	aliases := runnerImportAliases(result, indexes)
	var imports []string
	for packagePath := range aliases {
		imports = append(imports, packagePath)
	}
	slices.Sort(imports)

	var b strings.Builder
	b.WriteString("import { runTests } from \"@goscript/testing/index.js\"\n")
	for _, packagePath := range imports {
		b.WriteString("import * as ")
		b.WriteString(aliases[packagePath])
		b.WriteString(" from ")
		b.WriteString(strconv.Quote("@goscript/" + packagePath + "/index.js"))
		b.WriteString("\n")
	}
	b.WriteString("\n")
	b.WriteString("const __goscriptResultPrefix = ")
	b.WriteString(strconv.Quote(combinedRuntimeResultPrefix))
	b.WriteString("\n")
	b.WriteString("const __goscriptOriginalLog = console.log\n")
	b.WriteString("async function __goscriptRunPackage(packagePath, packageDir, tests) {\n")
	b.WriteString("\tif (packageDir && typeof process !== \"undefined\" && process.chdir) {\n")
	b.WriteString("\t\tprocess.chdir(packageDir)\n")
	b.WriteString("\t}\n")
	b.WriteString("\tconst logs = []\n")
	b.WriteString("\tconst startedAt = Date.now()\n")
	b.WriteString("\tlet ok = false\n")
	b.WriteString("\tconsole.log = (...args) => logs.push(args.map((arg) => String(arg)).join(' '))\n")
	b.WriteString("\ttry {\n")
	b.WriteString("\t\tconst result = await runTests(packagePath, tests, { verbose: ")
	if req.Verbose {
		b.WriteString("true")
	} else {
		b.WriteString("false")
	}
	b.WriteString(", count: ")
	b.WriteString(strconv.Itoa(req.Count))
	b.WriteString(", short: ")
	if req.Short {
		b.WriteString("true")
	} else {
		b.WriteString("false")
	}
	b.WriteString(" })\n")
	b.WriteString("\t\tok = result.ok\n")
	b.WriteString("\t} catch (err) {\n")
	b.WriteString("\t\tok = false\n")
	b.WriteString("\t\tlogs.push(err && err.stack ? String(err.stack) : String(err))\n")
	b.WriteString("\t} finally {\n")
	b.WriteString("\t\tconsole.log = __goscriptOriginalLog\n")
	b.WriteString("\t}\n")
	b.WriteString("\t__goscriptOriginalLog(__goscriptResultPrefix + JSON.stringify({ packagePath, ok, elapsedMs: Date.now() - startedAt, output: logs.join('\\n') }))\n")
	b.WriteString("}\n\n")
	for _, idx := range indexes {
		pkg := result.Packages[idx]
		b.WriteString("await __goscriptRunPackage(")
		b.WriteString(strconv.Quote(pkg.PackagePath))
		b.WriteString(", ")
		b.WriteString(strconv.Quote(pkg.SourceDir))
		b.WriteString(", [\n")
		for testIdx, test := range pkg.Tests {
			b.WriteString("\t{ name: ")
			b.WriteString(strconv.Quote(test.Name))
			b.WriteString(", fn: async (t) => await ")
			b.WriteString(aliases[test.PackagePath])
			b.WriteString(".")
			b.WriteString(test.Name)
			b.WriteString("(t) }")
			if testIdx != len(pkg.Tests)-1 {
				b.WriteString(",")
			}
			b.WriteString("\n")
		}
		b.WriteString("])\n")
	}
	b.WriteString("if (typeof process !== \"undefined\" && process.exit) {\n\tprocess.exit(0)\n}\n")
	return b.String()
}

func writeProcessChdir(b *strings.Builder, dir string) {
	if dir == "" {
		return
	}
	b.WriteString("if (typeof process !== \"undefined\" && process.chdir) {\n")
	b.WriteString("\tprocess.chdir(")
	b.WriteString(strconv.Quote(dir))
	b.WriteString(")\n")
	b.WriteString("}\n")
}

func runnerImportAliases(result *Result, indexes []int) map[string]string {
	seen := make(map[string]bool)
	var imports []string
	for _, idx := range indexes {
		if result == nil || idx < 0 || idx >= len(result.Packages) {
			continue
		}
		for _, packagePath := range runnerImports(result.Packages[idx].Tests) {
			if seen[packagePath] {
				continue
			}
			seen[packagePath] = true
			imports = append(imports, packagePath)
		}
	}
	slices.Sort(imports)
	aliases := make(map[string]string, len(imports))
	for idx, packagePath := range imports {
		aliases[packagePath] = "pkg" + strconv.Itoa(idx)
	}
	return aliases
}

func runnerImports(tests []Test) []string {
	seen := make(map[string]bool)
	var imports []string
	for _, test := range tests {
		if test.PackagePath == "" || seen[test.PackagePath] {
			continue
		}
		seen[test.PackagePath] = true
		imports = append(imports, test.PackagePath)
	}
	slices.Sort(imports)
	return imports
}

func processErrorText(result tsworkspace.Result) string {
	output := strings.TrimSpace(result.Output)
	if output != "" {
		return output
	}
	return result.Error
}

func aggregateTypeCheckFailureOwner(output string) (Owner, bool) {
	owner := classifyProcessOutput(output)
	// Package-scoped fallback is worth paying for package-local emitted
	// TypeScript errors. Shared override package failures are independent of
	// the runner file, so rerunning tsgo per package only repeats the same
	// expensive project error.
	if owner == OwnerOverridePackage {
		return owner, true
	}
	return "", false
}

func renderTypeScriptProject(req *normalizedRequest, outputRoot string, runnerFile string, projectFile string, nodeTypesAvailable bool) string {
	var b strings.Builder
	b.WriteString("{\n")
	b.WriteString("  \"compilerOptions\": {\n")
	b.WriteString("    \"target\": \"ES2022\",\n")
	b.WriteString("    \"module\": \"ESNext\",\n")
	b.WriteString("    \"moduleResolution\": \"Bundler\",\n")
	b.WriteString("    \"lib\": [\"ESNext\", \"DOM\"],\n")
	b.WriteString("    \"strict\": true,\n")
	b.WriteString("    \"allowImportingTsExtensions\": true,\n")
	if req.IncrementalTypeCheck {
		b.WriteString("    \"incremental\": true,\n")
		b.WriteString("    \"tsBuildInfoFile\": ")
		b.WriteString(strconv.Quote(typeScriptBuildInfoFile(projectFile)))
		b.WriteString(",\n")
	}
	b.WriteString("    \"noEmit\": true,\n")
	if nodeTypesAvailable {
		b.WriteString("    \"types\": [\"node\"],\n")
	} else {
		b.WriteString("    \"types\": [],\n")
	}
	b.WriteString("    \"paths\": {\n")
	b.WriteString("      \"*\": [\"./*\"],\n")
	b.WriteString("      \"@goscript/*\": [")
	b.WriteString(strconv.Quote("./" + typeScriptOutputAlias(req, outputRoot)))
	b.WriteString("]\n")
	b.WriteString("    }\n")
	b.WriteString("  },\n")
	b.WriteString("  \"include\": [")
	b.WriteString(strconv.Quote(runnerFile))
	b.WriteString(", ")
	b.WriteString(strconv.Quote(tsworkspace.NodeAmbientTypesFile))
	b.WriteString("]\n")
	b.WriteString("}\n")
	return b.String()
}

func renderRuntimeTypeScriptProject(req *normalizedRequest, outputRoots []string, nodeTypesAvailable bool) string {
	var aliases []string
	seen := make(map[string]bool)
	for _, outputRoot := range outputRoots {
		if outputRoot == "" {
			continue
		}
		alias := "./" + typeScriptOutputAlias(req, outputRoot)
		if !seen[alias] {
			seen[alias] = true
			aliases = append(aliases, alias)
		}
	}
	if len(aliases) == 0 && req.OutputRoot != "" {
		aliases = append(aliases, "./"+typeScriptOutputAlias(req, req.OutputRoot))
	}
	var b strings.Builder
	b.WriteString("{\n")
	b.WriteString("  \"compilerOptions\": {\n")
	b.WriteString("    \"target\": \"ES2022\",\n")
	b.WriteString("    \"module\": \"ESNext\",\n")
	b.WriteString("    \"moduleResolution\": \"Bundler\",\n")
	b.WriteString("    \"lib\": [\"ESNext\", \"DOM\"],\n")
	b.WriteString("    \"strict\": true,\n")
	b.WriteString("    \"allowImportingTsExtensions\": true,\n")
	if req.IncrementalTypeCheck {
		b.WriteString("    \"incremental\": true,\n")
		b.WriteString("    \"tsBuildInfoFile\": ")
		b.WriteString(strconv.Quote(typeScriptBuildInfoFile("tsconfig.json")))
		b.WriteString(",\n")
	}
	b.WriteString("    \"noEmit\": true,\n")
	if nodeTypesAvailable {
		b.WriteString("    \"types\": [\"node\"],\n")
	} else {
		b.WriteString("    \"types\": [],\n")
	}
	b.WriteString("    \"paths\": {\n")
	b.WriteString("      \"*\": [\"./*\"],\n")
	b.WriteString("      \"@goscript/*\": [")
	for idx, alias := range aliases {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(strconv.Quote(alias))
	}
	b.WriteString("]\n")
	b.WriteString("    }\n")
	b.WriteString("  },\n")
	b.WriteString("  \"include\": [\"runner-*.ts\", ")
	b.WriteString(strconv.Quote(tsworkspace.NodeAmbientTypesFile))
	b.WriteString("]\n")
	b.WriteString("}\n")
	return b.String()
}

func typeScriptBuildInfoFile(projectFile string) string {
	name := strings.TrimSuffix(projectFile, filepath.Ext(projectFile))
	if name == "" {
		name = "tsconfig"
	}
	return ".goscript/" + name + ".tsbuildinfo"
}

func typeScriptOutputPattern(req *normalizedRequest, outputRoot string) string {
	if rel, err := filepath.Rel(req.WorkDir, outputRoot); err == nil {
		return filepath.ToSlash(rel)
	}
	return filepath.ToSlash(outputRoot)
}

func typeScriptOutputAlias(req *normalizedRequest, outputRoot string) string {
	return filepath.ToSlash(filepath.Join(typeScriptOutputPattern(req, outputRoot), "@goscript", "*"))
}

func markCompilePhase(pkg *PackageResult, result *compiler.CompilationResult, passed bool) {
	if pkg == nil {
		return
	}
	if passed {
		pkg.Phases.Compile = PhaseStatusPass
		pkg.Phases.Emit = PhaseStatusPass
		return
	}
	if classifyDiagnostics(resultDiagnostics(result)) == OwnerTypeScriptEmitter {
		pkg.Phases.Compile = PhaseStatusPass
		pkg.Phases.Emit = PhaseStatusFail
		return
	}
	pkg.Phases.Compile = PhaseStatusFail
	pkg.Phases.Emit = PhaseStatusSkip
}

func resultDiagnostics(result *compiler.CompilationResult) []compiler.Diagnostic {
	if result == nil {
		return nil
	}
	return result.Diagnostics
}

func classifyDiagnostics(diagnostics []compiler.Diagnostic) Owner {
	for _, diagnostic := range diagnostics {
		switch {
		case strings.HasPrefix(diagnostic.Code, "goscript/package-graph"):
			return OwnerPackageGraph
		case strings.HasPrefix(diagnostic.Code, "goscript/semantic"):
			return OwnerSemanticModel
		case strings.HasPrefix(diagnostic.Code, "goscript/lowering"):
			return OwnerLowering
		case strings.HasPrefix(diagnostic.Code, "goscript/emitter"):
			return OwnerTypeScriptEmitter
		case strings.HasPrefix(diagnostic.Code, "goscript/overrides"):
			return OwnerOverridePackage
		case strings.HasPrefix(diagnostic.Code, "goscript/runtime"):
			return OwnerRuntimePackage
		}
	}
	return OwnerTestRunner
}

func classifyProcessOutput(output string) Owner {
	switch {
	case strings.Contains(output, "@goscript/testing") || strings.Contains(output, "@goscript/"):
		return OwnerOverridePackage
	case strings.Contains(output, "TypeScript") || strings.Contains(output, "TS"):
		return OwnerTypeScriptEmitter
	case strings.Contains(output, "panic") || strings.Contains(output, "runtime"):
		return OwnerRuntimePackage
	default:
		return OwnerTestRunner
	}
}

func diagnosticsHaveErrors(diagnostics []compiler.Diagnostic) bool {
	for _, diagnostic := range diagnostics {
		if diagnostic.Severity == compiler.DiagnosticSeverityError {
			return true
		}
	}
	return false
}

func diagnosticsSummary(diagnostics []compiler.Diagnostic) string {
	var b strings.Builder
	for idx, diagnostic := range diagnostics {
		if idx != 0 {
			b.WriteString("; ")
		}
		if diagnostic.Code != "" {
			b.WriteString(diagnostic.Code)
			b.WriteString(": ")
		}
		b.WriteString(diagnostic.Message)
		if diagnostic.Detail != "" {
			b.WriteString(" (")
			b.WriteString(diagnostic.Detail)
			b.WriteString(")")
		}
	}
	return b.String()
}
