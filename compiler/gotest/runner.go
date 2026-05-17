package gotest

import (
	"bytes"
	"context"
	"go/ast"
	"go/types"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/aperturerobotics/goscript/compiler"
	"github.com/pkg/errors"
	"golang.org/x/tools/go/packages"
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
	testPackages, loadDiagnostics := loadTestPackages(ctx, norm)
	result.Diagnostics = append(result.Diagnostics, loadDiagnostics...)
	result.Packages = packageResults(testPackages)
	if diagnosticsHaveErrors(loadDiagnostics) {
		markAllFailures(result, OwnerPackageGraph, diagnosticsSummary(loadDiagnostics))
		return result, nil
	}

	compileReq := &compiler.CompileRequest{
		Patterns:            append([]string(nil), norm.Patterns...),
		Dir:                 norm.Dir,
		OutputPath:          norm.OutputRoot,
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
		markAllFailures(result, classifyDiagnostics(result.Diagnostics), compileErr.Error())
		return result, nil
	}

	runnerFiles, err := writeRunnerFiles(norm, result.Packages)
	if err != nil {
		markAllFailures(result, OwnerTestRunner, err.Error())
		return result, nil
	}
	if len(runnerFiles) == 0 {
		return result, nil
	}
	if err := writeTypeScriptProject(norm); err != nil {
		markAllFailures(result, OwnerTestRunner, err.Error())
		return result, nil
	}

	tsgo, err := findTool(norm.Dir, "tsgo")
	if err != nil {
		markAllFailures(result, OwnerTestRunner, err.Error())
		return result, nil
	}
	output, err := runCommand(ctx, norm.WorkDir, tsgo, "--project", "tsconfig.json")
	if err != nil {
		markAllFailures(result, classifyProcessOutput(output), strings.TrimSpace(output))
		return result, nil
	}

	bun, err := findTool(norm.Dir, "bun")
	if err != nil {
		markAllFailures(result, OwnerTestRunner, err.Error())
		return result, nil
	}
	for idx := range result.Packages {
		if result.Packages[idx].Action == ActionSkip {
			continue
		}
		start := time.Now()
		output, err := runCommand(ctx, norm.WorkDir, bun, runnerFiles[idx])
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

type loadedTestPackage struct {
	packagePath     string
	testPackagePath string
	tests           []Test
}

func loadTestPackages(ctx context.Context, req *normalizedRequest) ([]loadedTestPackage, []compiler.Diagnostic) {
	cfg := &packages.Config{
		Context:    ctx,
		Dir:        req.Dir,
		Env:        append(os.Environ(), "GOOS=js", "GOARCH=wasm"),
		BuildFlags: append([]string(nil), req.BuildFlags...),
		Tests:      true,
		Mode: packages.NeedName |
			packages.NeedFiles |
			packages.NeedCompiledGoFiles |
			packages.NeedImports |
			packages.NeedDeps |
			packages.NeedExportFile |
			packages.NeedTypes |
			packages.NeedSyntax |
			packages.NeedTypesInfo |
			packages.NeedTypesSizes |
			packages.NeedForTest |
			packages.NeedModule,
	}
	pkgs, err := packages.Load(cfg, req.Patterns...)
	if err != nil {
		return nil, []compiler.Diagnostic{{
			Severity: compiler.DiagnosticSeverityError,
			Code:     "goscript/gotest:load",
			Message:  "failed to load Go test packages",
			Detail:   err.Error(),
		}}
	}

	runPattern, err := compileRunPattern(req.Run)
	if err != nil {
		return nil, []compiler.Diagnostic{{
			Severity: compiler.DiagnosticSeverityError,
			Code:     "goscript/gotest:run-pattern",
			Message:  "test run pattern is invalid",
			Detail:   err.Error(),
		}}
	}

	requested := make(map[string]bool)
	byPackage := make(map[string]*loadedTestPackage)
	var diagnostics []compiler.Diagnostic
	for _, pkg := range pkgs {
		if isTestMainPackage(pkg) {
			continue
		}
		diagnostics = append(diagnostics, packageDiagnostics(pkg)...)
		if pkg.ForTest == "" {
			path := packagePath(pkg)
			if strings.TrimSpace(path) != "" {
				requested[path] = true
				if byPackage[path] == nil {
					byPackage[path] = &loadedTestPackage{packagePath: path}
				}
			}
			continue
		}
		path := pkg.ForTest
		requested[path] = true
		loaded := byPackage[path]
		if loaded == nil {
			loaded = &loadedTestPackage{packagePath: path}
			byPackage[path] = loaded
		}
		loaded.testPackagePath = packagePath(pkg)
		for _, test := range discoverTests(pkg, runPattern) {
			loaded.tests = append(loaded.tests, test)
		}
	}

	packagePaths := make([]string, 0, len(requested))
	for path := range requested {
		packagePaths = append(packagePaths, path)
	}
	slices.Sort(packagePaths)

	result := make([]loadedTestPackage, 0, len(packagePaths))
	for _, path := range packagePaths {
		loaded := byPackage[path]
		if loaded == nil {
			loaded = &loadedTestPackage{packagePath: path}
		}
		slices.SortFunc(loaded.tests, func(a, b Test) int {
			return strings.Compare(a.Name, b.Name)
		})
		result = append(result, *loaded)
	}
	return result, diagnostics
}

func compileRunPattern(pattern string) (*regexp.Regexp, error) {
	pattern = strings.TrimSpace(pattern)
	if pattern == "" {
		return nil, nil
	}
	return regexp.Compile(pattern)
}

func discoverTests(pkg *packages.Package, runPattern *regexp.Regexp) []Test {
	var tests []Test
	for _, file := range pkg.Syntax {
		for _, decl := range file.Decls {
			fn, ok := decl.(*ast.FuncDecl)
			if !ok || fn.Recv != nil || !isTestName(fn.Name.Name) {
				continue
			}
			if runPattern != nil && !runPattern.MatchString(fn.Name.Name) {
				continue
			}
			obj, _ := pkg.TypesInfo.Defs[fn.Name].(*types.Func)
			if !isOrdinaryTestFunc(obj) {
				continue
			}
			tests = append(tests, Test{
				Name:        fn.Name.Name,
				PackagePath: packagePath(pkg),
			})
		}
	}
	return tests
}

func isOrdinaryTestFunc(fn *types.Func) bool {
	if fn == nil {
		return false
	}
	sig, _ := fn.Type().(*types.Signature)
	if sig == nil || sig.Params().Len() != 1 || sig.Results().Len() != 0 {
		return false
	}
	ptr, _ := sig.Params().At(0).Type().(*types.Pointer)
	if ptr == nil {
		return false
	}
	named, _ := ptr.Elem().(*types.Named)
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return false
	}
	return named.Obj().Name() == "T" && named.Obj().Pkg().Path() == "testing"
}

func isTestName(name string) bool {
	if !strings.HasPrefix(name, "Test") || name == "Test" {
		return false
	}
	for _, r := range strings.TrimPrefix(name, "Test") {
		return !unicode.IsLower(r)
	}
	return false
}

func packageResults(testPackages []loadedTestPackage) []PackageResult {
	results := make([]PackageResult, 0, len(testPackages))
	for _, pkg := range testPackages {
		result := PackageResult{
			PackagePath:     pkg.packagePath,
			TestPackagePath: pkg.testPackagePath,
			Tests:           append([]Test(nil), pkg.tests...),
			Action:          ActionSkip,
		}
		if len(pkg.tests) != 0 {
			result.Action = ActionFail
		}
		results = append(results, result)
	}
	return results
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
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = owner
		result.Packages[idx].Error = message
	}
}

func writeRunnerFiles(req *normalizedRequest, results []PackageResult) (map[int]string, error) {
	if err := os.MkdirAll(req.WorkDir, 0o755); err != nil {
		return nil, errors.Wrap(err, "create test runner directory")
	}
	runnerFiles := make(map[int]string)
	for idx, result := range results {
		if len(result.Tests) == 0 {
			continue
		}
		name := "runner-" + strconv.Itoa(idx) + ".ts"
		if err := os.WriteFile(filepath.Join(req.WorkDir, name), []byte(renderRunner(result, req)), 0o644); err != nil {
			return nil, errors.Wrap(err, "write TypeScript test runner")
		}
		runnerFiles[idx] = name
	}
	return runnerFiles, nil
}

func renderRunner(result PackageResult, req *normalizedRequest) string {
	var b strings.Builder
	b.WriteString("import { runTests } from \"@goscript/testing/index.js\"\n")
	b.WriteString("import * as pkg from ")
	b.WriteString(strconv.Quote("@goscript/" + result.TestPackagePath + "/index.js"))
	b.WriteString("\n\n")
	b.WriteString("const result = await runTests(")
	b.WriteString(strconv.Quote(result.PackagePath))
	b.WriteString(", [\n")
	for idx, test := range result.Tests {
		b.WriteString("\t{ name: ")
		b.WriteString(strconv.Quote(test.Name))
		b.WriteString(", fn: async (t) => await pkg.")
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

func writeTypeScriptProject(req *normalizedRequest) error {
	if err := os.WriteFile(filepath.Join(req.WorkDir, "package.json"), []byte("{\"type\":\"module\"}\n"), 0o644); err != nil {
		return errors.Wrap(err, "write package.json")
	}
	nodeTypeRoots := findNodeTypeRoots(req.Dir)
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
	b.WriteString("      \"@goscript/*\": [\"./output/@goscript/*\"]\n")
	b.WriteString("    }\n")
	b.WriteString("  },\n")
	b.WriteString("  \"include\": [\"output/**/*.ts\", \"runner-*.ts\"]\n")
	b.WriteString("}\n")
	return os.WriteFile(filepath.Join(req.WorkDir, "tsconfig.json"), []byte(b.String()), 0o644)
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

func packageDiagnostics(pkg *packages.Package) []compiler.Diagnostic {
	if pkg == nil || len(pkg.Errors) == 0 {
		return nil
	}
	diagnostics := make([]compiler.Diagnostic, 0, len(pkg.Errors))
	for _, pkgErr := range pkg.Errors {
		diagnostics = append(diagnostics, compiler.Diagnostic{
			Severity: compiler.DiagnosticSeverityError,
			Code:     "goscript/gotest:load-error",
			Message:  "Go test package contains load errors",
			Detail:   pkgErr.Msg,
		})
	}
	return diagnostics
}

func packagePath(pkg *packages.Package) string {
	if pkg == nil {
		return ""
	}
	if pkg.PkgPath != "" {
		return pkg.PkgPath
	}
	return pkg.ID
}

func isTestMainPackage(pkg *packages.Package) bool {
	return pkg != nil && pkg.ForTest == "" && pkg.Name == "main" && strings.HasSuffix(packagePath(pkg), ".test")
}
