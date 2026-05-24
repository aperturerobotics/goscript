package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func TestPackageGraphOwnerLoadTestGraphFacts(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/testgraph\n\ngo 1.25.3\n",
		"same/value.go": strings.Join([]string{
			"package same",
			"",
			"func Add(a int, b int) int {",
			"\treturn a + b",
			"}",
			"",
		}, "\n"),
		"same/value_test.go": strings.Join([]string{
			"package same",
			"",
			"import testpkg \"testing\"",
			"",
			"func TestAdd(t *testpkg.T) {}",
			"func TestIgnoredBadSignature(t *badT) {}",
			"type badT struct{}",
			"",
		}, "\n"),
		"external/value.go": strings.Join([]string{
			"package external",
			"",
			"func Name() string {",
			"\treturn \"external\"",
			"}",
			"",
		}, "\n"),
		"external/value_test.go": strings.Join([]string{
			"package external_test",
			"",
			"import (",
			"\t\"testing\"",
			"",
			"\texternal \"example.test/testgraph/external\"",
			")",
			"",
			"func TestName(t *testing.T) {",
			"\t_ = external.Name()",
			"}",
			"",
		}, "\n"),
		"notests/value.go": "package notests\nconst Value = 1\n",
	})

	graph, diagnostics := loadPackageTestGraph(t, &CompileRequest{
		Patterns:            []string{"./..."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("test graph load failed: %#v", diagnostics)
	}

	if len(graph.Packages) != 3 {
		t.Fatalf("expected three requested packages, got %#v", graph.Packages)
	}
	same := graph.PackageByPath("example.test/testgraph/same")
	if same == nil || same.SamePackageTests == nil || same.ExternalPackageTests != nil || !same.HasTests() {
		t.Fatalf("unexpected same-package facts: %#v", same)
	}
	if len(same.SamePackageTests.Tests) != 1 || same.SamePackageTests.Tests[0].Name != "TestAdd" {
		t.Fatalf("same-package test discovery should keep only ordinary tests: %#v", same.SamePackageTests.Tests)
	}
	external := graph.PackageByPath("example.test/testgraph/external")
	if external == nil || external.ExternalPackageTests == nil || external.SamePackageTests != nil || !external.HasTests() {
		t.Fatalf("unexpected external-package facts: %#v", external)
	}
	notests := graph.PackageByPath("example.test/testgraph/notests")
	if notests == nil || notests.HasTests() {
		t.Fatalf("unexpected no-test package facts: %#v", notests)
	}
}

func TestPackageGraphOwnerLoadTestGraphScopesDiagnostics(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/testgraphdiag\n\ngo 1.25.3\n",
		"clean/value.go": strings.Join([]string{
			"package clean",
			"",
			"func Value() int {",
			"\treturn 1",
			"}",
			"",
		}, "\n"),
		"clean/value_test.go": strings.Join([]string{
			"package clean",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {}",
			"",
		}, "\n"),
		"broken/value.go": "package broken\nconst Value = 1\n",
		"broken/value_test.go": strings.Join([]string{
			"package broken",
			"",
			"import \"testing\"",
			"",
			"func TestBroken(t *testing.T) {",
			"\tMissing()",
			"}",
			"",
		}, "\n"),
	})

	graph, diagnostics := loadPackageTestGraph(t, &CompileRequest{
		Patterns:            []string{"./..."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	requireDiagnosticCode(t, diagnostics, "goscript/package-graph:load-error")

	clean := graph.PackageByPath("example.test/testgraphdiag/clean")
	if clean == nil || len(clean.Diagnostics) != 0 {
		t.Fatalf("clean package should not inherit broken diagnostics: %#v", clean)
	}
	broken := graph.PackageByPath("example.test/testgraphdiag/broken")
	if broken == nil || len(broken.Diagnostics) == 0 {
		t.Fatalf("broken package should carry load diagnostics: %#v", broken)
	}
	if broken.SamePackageTests == nil || len(broken.SamePackageTests.Diagnostics) == 0 {
		t.Fatalf("broken same-package test variant should carry diagnostics: %#v", broken)
	}
}

func loadPackageTestGraph(t *testing.T, req *CompileRequest) (*PackageTestGraph, []Diagnostic) {
	t.Helper()

	diagnostics := NewCompileRequestOwner().Validate(req)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("request validation failed: %#v", diagnostics)
	}
	return NewPackageGraphOwner().LoadTestGraph(context.Background(), req)
}
