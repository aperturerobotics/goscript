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

func TestOverrideRegistryReportsMissingMetadataDependency(t *testing.T) {
	_, diagnostics := NewOverrideRegistryOwner().CopyPlan(context.Background(), &CompileRequest{
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "os",
		OverrideCandidate: true,
	}}})
	requireDiagnosticCode(t, diagnostics, "goscript/overrides:missing-package")
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
