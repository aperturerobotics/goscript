package compiler

import (
	"context"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

func TestOverrideRegistryPlansRuntimeAndOverrideDependencies(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	plan, diagnostics := owner.CopyPlan(context.Background(), &CompileRequest{
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "fmt",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}

	var packages []string
	for _, pkg := range plan.packages {
		packages = append(packages, pkg.path)
	}
	for _, pkg := range []string{"builtin", "errors", "fmt"} {
		if !slices.Contains(packages, pkg) {
			t.Fatalf("missing %s in copy plan: %v", pkg, packages)
		}
	}
	if slices.Index(packages, "errors") > slices.Index(packages, "fmt") {
		t.Fatalf("dependency order is wrong: %v", packages)
	}
}

func TestOverrideRegistryFactsAreImmutable(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	facts, diagnostics := owner.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("override facts failed: %#v", diagnostics)
	}

	metadata := facts.Metadata("sync")
	if !metadata.AsyncMethods["Map.Load"] {
		t.Fatalf("expected sync Map.Load async metadata")
	}
	metadata.AsyncMethods["Map.Load"] = false
	metadata.Dependencies = append(metadata.Dependencies, "mutated")

	metadata = facts.Metadata("sync")
	if !metadata.AsyncMethods["Map.Load"] {
		t.Fatalf("override metadata mutation leaked back into facts")
	}
	if slices.Contains(metadata.Dependencies, "mutated") {
		t.Fatalf("override dependency mutation leaked back into facts: %v", metadata.Dependencies)
	}

	pkg, dependencies, ok := facts.copyPackage("fmt")
	if !ok {
		t.Fatalf("missing fmt copy package facts")
	}
	if !slices.Contains(dependencies, "errors") {
		t.Fatalf("expected fmt dependency on errors, got %v", dependencies)
	}
	dependencies = append(dependencies, "mutated")
	if len(pkg.files) == 0 {
		t.Fatalf("expected fmt copy files")
	}
	pkg.files[0].data[0] = '!'

	pkg, dependencies, ok = facts.copyPackage("fmt")
	if !ok {
		t.Fatalf("missing fmt copy package facts after mutation")
	}
	if slices.Contains(dependencies, "mutated") {
		t.Fatalf("copy dependency mutation leaked back into facts: %v", dependencies)
	}
	if len(pkg.files) == 0 || pkg.files[0].data[0] == '!' {
		t.Fatalf("copy file mutation leaked back into facts")
	}
}

func TestOverrideRegistryCopiesRuntimeAndOverrides(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	req := &CompileRequest{
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}
	plan, diagnostics := owner.CopyPlan(context.Background(), req, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "fmt",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}
	copied, diagnostics := owner.CopyPackages(context.Background(), req, plan)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy failed: %#v", diagnostics)
	}
	for _, pkg := range []string{"builtin", "errors", "fmt"} {
		if !slices.Contains(copied, pkg) {
			t.Fatalf("missing copied package %s in %v", pkg, copied)
		}
	}
	for _, path := range []string{
		"@goscript/builtin/index.ts",
		"@goscript/errors/index.ts",
		"@goscript/fmt/index.ts",
	} {
		if _, err := os.Stat(filepath.Join(req.OutputPath, filepath.FromSlash(path))); err != nil {
			t.Fatalf("expected copied file %s: %v", path, err)
		}
	}
	if _, err := os.Stat(filepath.Join(req.OutputPath, "@goscript", "fmt", "fmt.test.ts")); !os.IsNotExist(err) {
		t.Fatalf("override copy should not include test files")
	}
}

func TestOverrideRegistryCopiesExternalOverride(t *testing.T) {
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/lib/index.ts", strings.Join([]string{
		"import * as helper from '@goscript/example.test/helper/index.js'",
		"export function Run(): void { helper.Run() }",
		"",
	}, "\n"))
	writeFixtureFile(t, overrideDir, "example.test/lib/meta.json", `{"dependencies":["example.test/helper"]}`)
	writeFixtureFile(t, overrideDir, "example.test/helper/index.ts", "export function Run(): void {}\n")

	owner := NewOverrideRegistryOwner(overrideDir)
	req := &CompileRequest{
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}
	plan, diagnostics := owner.CopyPlan(context.Background(), req, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "example.test/lib",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}
	copied, diagnostics := owner.CopyPackages(context.Background(), req, plan)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy failed: %#v", diagnostics)
	}
	for _, pkg := range []string{"builtin", "example.test/helper", "example.test/lib"} {
		if !slices.Contains(copied, pkg) {
			t.Fatalf("missing copied package %s in %v", pkg, copied)
		}
	}
	for _, path := range []string{
		"@goscript/example.test/helper/index.ts",
		"@goscript/example.test/lib/index.ts",
	} {
		if _, err := os.Stat(filepath.Join(req.OutputPath, filepath.FromSlash(path))); err != nil {
			t.Fatalf("expected copied file %s: %v", path, err)
		}
	}
}

func TestOverrideRegistryReportsMissingOverridePackage(t *testing.T) {
	_, diagnostics := NewOverrideRegistryOwner().CopyPlan(context.Background(), &CompileRequest{
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "does/not/exist",
		OverrideCandidate: true,
	}}})
	requireDiagnosticCode(t, diagnostics, "goscript/overrides:missing-package")
}

func TestOverrideRegistryPlansOsOverrideDependencies(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	plan, diagnostics := owner.CopyPlan(context.Background(), &CompileRequest{
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "os",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}

	var packages []string
	for _, pkg := range plan.packages {
		packages = append(packages, pkg.path)
	}
	if !slices.Contains(packages, "os") {
		t.Fatalf("missing os in copy plan: %v", packages)
	}
	if slices.Contains(packages, "internal/poll") {
		t.Fatalf("os copy plan includes stale internal/poll dependency: %v", packages)
	}
}

func TestOverrideRegistryPlansNestedOverrideMetadataDependencies(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	plan, diagnostics := owner.CopyPlan(context.Background(), &CompileRequest{
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "github.com/aperturerobotics/wasivm/wazero/kernel/runtime/browser",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}

	var packages []string
	for _, pkg := range plan.packages {
		packages = append(packages, pkg.path)
	}

	runtimePkg := "github.com/aperturerobotics/wasivm/wazero/kernel/runtime"
	browserPkg := "github.com/aperturerobotics/wasivm/wazero/kernel/runtime/browser"
	for _, pkg := range []string{"builtin", runtimePkg, browserPkg} {
		if !slices.Contains(packages, pkg) {
			t.Fatalf("missing %s in copy plan: %v", pkg, packages)
		}
	}
	if slices.Index(packages, runtimePkg) > slices.Index(packages, browserPkg) {
		t.Fatalf("nested override dependency order is wrong: %v", packages)
	}
}

func TestCompilePackagesCopiesRuntimeOverrides(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/overridecopy\n\ngo 1.25.3\n",
		"main.go": "package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"ok\") }\n",
	})
	out := filepath.Join(t.TempDir(), "out")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      out,
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	result, err := comp.CompilePackages(context.Background(), ".")
	if err != nil {
		t.Fatalf("compile failed: %v\n%#v", err, result.Diagnostics)
	}
	for _, pkg := range []string{"builtin", "errors", "fmt"} {
		if !slices.Contains(result.CopiedPackages, pkg) {
			t.Fatalf("missing copied package %s in %#v", pkg, result.CopiedPackages)
		}
	}
	for _, path := range []string{
		"@goscript/example.test/overridecopy/main.gs.ts",
		"@goscript/builtin/index.ts",
		"@goscript/fmt/index.ts",
	} {
		if _, err := os.Stat(filepath.Join(out, filepath.FromSlash(path))); err != nil {
			t.Fatalf("expected output file %s: %v", path, err)
		}
	}
}

func TestCompilePackagesAwaitsOverrideAsyncMethods(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/overrideasync\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"sync\"",
			"func main() {",
			"  var m sync.Map",
			"  if value, ok := m.Load(\"key\"); ok {",
			"    println(value)",
			"  }",
			"}",
			"",
		}, "\n"),
	})
	out := filepath.Join(t.TempDir(), "out")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      out,
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	content, err := os.ReadFile(filepath.Join(out, "@goscript", "example.test", "overrideasync", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(content), "let [value, ok] = await m.value.Load(\"key\")") {
		t.Fatalf("override async method call was not awaited:\n%s", string(content))
	}
}
