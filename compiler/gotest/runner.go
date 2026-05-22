package gotest

import (
	"context"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strconv"
	"strings"

	"github.com/aperturerobotics/goscript/compiler"
	"github.com/aperturerobotics/goscript/compiler/tsworkspace"
	"github.com/pkg/errors"
)

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

	for idx := range result.Packages {
		if !shouldCompilePackage(result.Packages[idx]) {
			continue
		}
		outputRoot := packageOutputRoot(norm, idx)
		compileReq := &compiler.CompileRequest{
			Patterns:            []string{result.Packages[idx].PackagePath},
			Dir:                 norm.Dir,
			OutputPath:          outputRoot,
			BuildFlags:          append([]string(nil), norm.BuildFlags...),
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
		if !r.compileTestImports(ctx, norm, outputRoot, &result.Packages[idx], result) {
			continue
		}
		testCompileReq := &compiler.CompileRequest{
			Patterns:            []string{result.Packages[idx].PackagePath},
			Dir:                 norm.Dir,
			OutputPath:          outputRoot,
			BuildFlags:          append([]string(nil), norm.BuildFlags...),
			DependencyMode:      compiler.DependencyModeRequested,
			RuntimeEmissionMode: compiler.RuntimeEmissionModeEmit,
			Tests:               true,
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

	if phase := workspace.EnsurePackageJSON(); phase.Failed() {
		markAllFailures(result, OwnerTestRunner, phase.Error)
		return result, nil
	}
	if phase := workspace.EnsureNodeAmbientTypes(); phase.Failed() {
		markAllFailures(result, OwnerTestRunner, phase.Error)
		return result, nil
	}
	for idx := range result.Packages {
		if !shouldCompilePackage(result.Packages[idx]) {
			continue
		}
		result.Packages[idx].Phases.Workspace = PhaseStatusPass
		outputRoot := packageOutputRoot(norm, idx)
		runnerFile := packageRunnerFile(idx)
		if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, runnerFile, renderRunner(result.Packages[idx], norm)); phase.Failed() {
			result.Packages[idx].Owner = OwnerTestRunner
			result.Packages[idx].Phases.Workspace = PhaseStatusFail
			result.Packages[idx].Error = phase.Error
			continue
		}
		tsconfigFile := "tsconfig.json"
		if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, tsconfigFile, renderTypeScriptProject(norm, outputRoot, runnerFile)); phase.Failed() {
			result.Packages[idx].Owner = OwnerTestRunner
			result.Packages[idx].Phases.Workspace = PhaseStatusFail
			result.Packages[idx].Error = phase.Error
			continue
		}
		typecheck := workspace.RunTool(ctx, tsworkspace.PhaseTypeCheck, norm.WorkDir, "tsgo", "--project", tsconfigFile)
		if typecheck.Failed() {
			result.Packages[idx].Owner = classifyProcessOutput(typecheck.Output)
			result.Packages[idx].Phases.TypeCheck = PhaseStatusFail
			result.Packages[idx].Error = processErrorText(typecheck)
			continue
		}
		result.Packages[idx].Phases.TypeCheck = PhaseStatusPass
		runtime := workspace.RunTool(ctx, tsworkspace.PhaseRuntime, norm.WorkDir, "bun", runnerFile)
		result.Packages[idx].Elapsed = runtime.Elapsed
		result.Packages[idx].Output = strings.TrimSpace(runtime.Output)
		if runtime.Failed() {
			result.Packages[idx].Action = ActionFail
			result.Packages[idx].Owner = classifyProcessOutput(runtime.Output)
			result.Packages[idx].Phases.Runtime = PhaseStatusFail
			result.Packages[idx].Error = runtime.Error
			continue
		}
		result.Packages[idx].Phases.Runtime = PhaseStatusPass
		result.Packages[idx].Action = ActionPass
	}
	return result, nil
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
	b.WriteString(" })\n")
	b.WriteString("if (!result.ok) {\n\tthrow new Error(\"goscript test failed\")\n}\n")
	return b.String()
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

func renderTypeScriptProject(req *normalizedRequest, outputRoot string, runnerFile string) string {
	outputPattern := filepath.ToSlash(outputRoot)
	outputAlias := filepath.ToSlash(filepath.Join(outputRoot, "@goscript", "*"))
	if rel, err := filepath.Rel(req.WorkDir, outputRoot); err == nil {
		outputPattern = filepath.ToSlash(rel)
		outputAlias = filepath.ToSlash(filepath.Join(rel, "@goscript", "*"))
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
	b.WriteString("    \"noEmit\": true,\n")
	b.WriteString("    \"types\": [],\n")
	b.WriteString("    \"paths\": {\n")
	b.WriteString("      \"*\": [\"./*\"],\n")
	b.WriteString("      \"@goscript/*\": [")
	b.WriteString(strconv.Quote("./" + outputAlias))
	b.WriteString("]\n")
	b.WriteString("    }\n")
	b.WriteString("  },\n")
	b.WriteString("  \"include\": [")
	b.WriteString(strconv.Quote(outputPattern + "/**/*.ts"))
	b.WriteString(", ")
	b.WriteString(strconv.Quote(runnerFile))
	b.WriteString(", ")
	b.WriteString(strconv.Quote(tsworkspace.NodeAmbientTypesFile))
	b.WriteString("]\n")
	b.WriteString("}\n")
	return b.String()
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
