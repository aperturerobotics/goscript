package gotest

import (
	"bytes"
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/aperturerobotics/goscript/compiler"
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
			Tests:               true,
			AllDependencies:     true,
		}
		compileResult, compileErr := r.service.Compile(ctx, compileReq)
		if compileResult != nil {
			result.Diagnostics = append(result.Diagnostics, compileResult.Diagnostics...)
		}
		if compileErr != nil {
			result.Packages[idx].Action = ActionFail
			var diagnostics []compiler.Diagnostic
			if compileResult != nil {
				diagnostics = compileResult.Diagnostics
			}
			result.Packages[idx].Owner = classifyDiagnostics(diagnostics)
			result.Packages[idx].Error = compileErr.Error()
			continue
		}
	}

	if err := writePackageJSON(norm); err != nil {
		markAllFailures(result, OwnerTestRunner, err.Error())
		return result, nil
	}

	tsgo, err := findTool(norm.Dir, "tsgo")
	if err != nil {
		markAllFailures(result, OwnerTestRunner, err.Error())
		return result, nil
	}
	bun, err := findTool(norm.Dir, "bun")
	if err != nil {
		markAllFailures(result, OwnerTestRunner, err.Error())
		return result, nil
	}
	for idx := range result.Packages {
		if !shouldCompilePackage(result.Packages[idx]) {
			continue
		}
		outputRoot := packageOutputRoot(norm, idx)
		runnerFile := packageRunnerFile(idx)
		if err := writeRunnerFile(norm, runnerFile, result.Packages[idx]); err != nil {
			result.Packages[idx].Owner = OwnerTestRunner
			result.Packages[idx].Error = err.Error()
			continue
		}
		tsconfigFile := "tsconfig.json"
		if err := writeTypeScriptProject(norm, tsconfigFile, outputRoot, runnerFile); err != nil {
			result.Packages[idx].Owner = OwnerTestRunner
			result.Packages[idx].Error = err.Error()
			continue
		}
		output, err := runCommand(ctx, norm.WorkDir, tsgo, "--project", tsconfigFile)
		if err != nil {
			result.Packages[idx].Owner = classifyProcessOutput(output)
			result.Packages[idx].Error = strings.TrimSpace(output)
			continue
		}
		start := time.Now()
		output, err = runCommand(ctx, norm.WorkDir, bun, runnerFile)
		result.Packages[idx].Elapsed = time.Since(start)
		result.Packages[idx].Output = strings.TrimSpace(output)
		if err != nil {
			result.Packages[idx].Action = ActionFail
			result.Packages[idx].Owner = classifyProcessOutput(output)
			result.Packages[idx].Error = err.Error()
			continue
		}
		result.Packages[idx].Action = ActionPass
	}
	return result, nil
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
		result := PackageResult{
			PackagePath: pkg.PackagePath,
			Action:      ActionSkip,
		}
		result.Tests = append(result.Tests, packageVariantTests(pkg.SamePackageTests, runPattern)...)
		result.Tests = append(result.Tests, packageVariantTests(pkg.ExternalPackageTests, runPattern)...)
		slices.SortFunc(result.Tests, func(a, b Test) int {
			if a.Name == b.Name {
				return strings.Compare(a.PackagePath, b.PackagePath)
			}
			return strings.Compare(a.Name, b.Name)
		})
		if len(result.Tests) != 0 {
			result.TestPackagePath = result.Tests[0].PackagePath
			result.Action = ActionFail
		}
		if diagnosticsHaveErrors(pkg.Diagnostics) {
			result.Action = ActionFail
			result.Owner = OwnerPackageGraph
			result.Error = diagnosticsSummary(pkg.Diagnostics)
		}
		results = append(results, result)
	}
	return results
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
	}
}

func packageOutputRoot(req *normalizedRequest, idx int) string {
	return filepath.Join(req.OutputRoot, "package-"+strconv.Itoa(idx))
}

func packageRunnerFile(idx int) string {
	return "runner-" + strconv.Itoa(idx) + ".ts"
}

func writePackageJSON(req *normalizedRequest) error {
	if err := os.MkdirAll(req.WorkDir, 0o755); err != nil {
		return errors.Wrap(err, "create test runner directory")
	}
	return os.WriteFile(filepath.Join(req.WorkDir, "package.json"), []byte("{\"type\":\"module\"}\n"), 0o644)
}

func writeRunnerFile(req *normalizedRequest, name string, result PackageResult) error {
	if err := os.WriteFile(filepath.Join(req.WorkDir, name), []byte(renderRunner(result, req)), 0o644); err != nil {
		return errors.Wrap(err, "write TypeScript test runner")
	}
	return nil
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

func writeTypeScriptProject(req *normalizedRequest, name string, outputRoot string, runnerFile string) error {
	nodeTypeRoots := findNodeTypeRoots(req.Dir)
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
	if len(nodeTypeRoots) != 0 {
		b.WriteString("    \"types\": [\"node\"],\n")
		b.WriteString("    \"typeRoots\": [")
		for idx, root := range nodeTypeRoots {
			if idx != 0 {
				b.WriteString(", ")
			}
			b.WriteString(strconv.Quote(filepath.ToSlash(root)))
		}
		b.WriteString("],\n")
	}
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
	b.WriteString("]\n")
	b.WriteString("}\n")
	return os.WriteFile(filepath.Join(req.WorkDir, name), []byte(b.String()), 0o644)
}

func findNodeTypeRoots(dir string) []string {
	seen := make(map[string]bool)
	var roots []string
	for _, start := range []string{dir, currentWorkingDirectory()} {
		if start == "" {
			continue
		}
		for current := start; current != ""; current = filepath.Dir(current) {
			candidate := filepath.Join(current, "node_modules", "@types")
			info, err := os.Stat(candidate)
			if err == nil && info.IsDir() && !seen[candidate] {
				seen[candidate] = true
				roots = append(roots, candidate)
				break
			}
			if parent := filepath.Dir(current); parent == current {
				break
			}
		}
	}
	return roots
}

func currentWorkingDirectory() string {
	wd, err := os.Getwd()
	if err != nil {
		return ""
	}
	return wd
}

func runCommand(ctx context.Context, dir string, name string, args ...string) (string, error) {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.Dir = dir
	var output bytes.Buffer
	cmd.Stdout = &output
	cmd.Stderr = &output
	err := cmd.Run()
	return output.String(), err
}

func findTool(dir string, name string) (string, error) {
	if filepath.IsAbs(name) {
		return name, nil
	}
	for current := dir; current != ""; current = filepath.Dir(current) {
		candidate := filepath.Join(current, "node_modules", ".bin", name)
		info, err := os.Stat(candidate)
		if err == nil && !info.IsDir() {
			return candidate, nil
		}
		if parent := filepath.Dir(current); parent == current {
			break
		}
	}
	if wd, err := os.Getwd(); err == nil {
		for current := wd; current != ""; current = filepath.Dir(current) {
			candidate := filepath.Join(current, "node_modules", ".bin", name)
			info, err := os.Stat(candidate)
			if err == nil && !info.IsDir() {
				return candidate, nil
			}
			if parent := filepath.Dir(current); parent == current {
				break
			}
		}
	}
	if path, err := exec.LookPath(name); err == nil {
		return path, nil
	}
	return "", errors.New(name + " not found in PATH or ancestor node_modules/.bin")
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
