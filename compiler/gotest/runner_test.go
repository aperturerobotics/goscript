package gotest

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestRunnerRunsOrdinaryPackageTest(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/gotest\n\ngo 1.25.3\n",
		"value.go": strings.Join([]string{
			"package gotest",
			"",
			"func Add(a int, b int) int {",
			"\treturn a + b",
			"}",
			"",
		}, "\n"),
		"value_test.go": strings.Join([]string{
			"package gotest",
			"",
			"import \"testing\"",
			"",
			"func TestAdd(t *testing.T) {",
			"\tif Add(1, 2) != 3 {",
			"\t\tt.Fatalf(\"unexpected sum\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
		Verbose:  true,
	})
	if err != nil {
		t.Fatalf("run package test: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package test to pass: %#v", result.Packages)
	}
	if len(result.Packages) != 1 || len(result.Packages[0].Tests) != 1 {
		t.Fatalf("unexpected package results: %#v", result.Packages)
	}
	if result.Packages[0].Tests[0].Name != "TestAdd" {
		t.Fatalf("unexpected test discovery: %#v", result.Packages[0].Tests)
	}
}

func TestRunnerRunsExternalPackageTest(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/external\n\ngo 1.25.3\n",
		"value.go": strings.Join([]string{
			"package external",
			"",
			"func Add(a int, b int) int {",
			"\treturn a + b",
			"}",
			"",
		}, "\n"),
		"value_test.go": strings.Join([]string{
			"package external_test",
			"",
			"import (",
			"\t\"testing\"",
			"",
			"\texternal \"example.test/external\"",
			")",
			"",
			"func TestExternalAdd(t *testing.T) {",
			"\tif external.Add(4, 5) != 9 {",
			"\t\tt.Fatalf(\"unexpected sum\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run external package test: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected external package test to pass: %#v", result.Packages)
	}
	if len(result.Packages) != 1 || len(result.Packages[0].Tests) != 1 {
		t.Fatalf("unexpected package results: %#v", result.Packages)
	}
	if result.Packages[0].TestPackagePath == "" {
		t.Fatalf("expected test package path: %#v", result.Packages[0])
	}
}

func TestRunnerRejectsInvalidRunPattern(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod":   "module example.test/badrun\n\ngo 1.25.3\n",
		"value.go": "package badrun\n",
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Run:      "[",
	})
	if err != nil {
		t.Fatalf("run package test: %v", err)
	}
	if result.Passed() {
		t.Fatalf("expected invalid run pattern to fail")
	}
	if result.Packages[0].Owner != OwnerPackageGraph {
		t.Fatalf("unexpected owner classification: %#v", result.Packages[0])
	}
	if len(result.Diagnostics) != 1 || result.Diagnostics[0].Code != "goscript/gotest:run-pattern" {
		t.Fatalf("expected structured run-pattern diagnostic: %#v", result.Diagnostics)
	}
}

func TestRunnerFailsPackagePatternsWhenGraphHasOnlyDiagnostics(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod":   "module example.test/missing\n\ngo 1.25.3\n",
		"value.go": "package missing\n",
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./does-not-exist"},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run missing package test: %v", err)
	}
	if result.Passed() {
		t.Fatalf("expected missing package pattern to fail")
	}
	if len(result.Packages) != 1 || result.Packages[0].Owner != OwnerPackageGraph {
		t.Fatalf("unexpected package graph failure: %#v", result.Packages)
	}
}

func TestMarkAllFailuresPreservesExistingPackageOwners(t *testing.T) {
	result := &Result{Packages: []PackageResult{
		{
			PackagePath: "example.test/broken",
			Action:      ActionFail,
			Owner:       OwnerPackageGraph,
			Error:       "load failed",
		},
		{
			PackagePath: "example.test/run",
			Action:      ActionFail,
		},
		{
			PackagePath: "example.test/notests",
			Action:      ActionSkip,
		},
	}}

	markAllFailures(result, OwnerTestRunner, "typecheck failed")

	if result.Packages[0].Owner != OwnerPackageGraph || result.Packages[0].Error != "load failed" {
		t.Fatalf("package graph failure was overwritten: %#v", result.Packages[0])
	}
	if result.Packages[1].Owner != OwnerTestRunner || result.Packages[1].Error != "typecheck failed" {
		t.Fatalf("unowned failure was not marked: %#v", result.Packages[1])
	}
	if result.Packages[2].Action != ActionSkip || result.Packages[2].Owner != "" {
		t.Fatalf("skipped package should stay skipped: %#v", result.Packages[2])
	}
}

func TestRunnerScopesPackageLoadErrors(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/mixed\n\ngo 1.25.3\n",
		"clean/value.go": strings.Join([]string{
			"package clean",
			"",
			"func Value() int { return 11 }",
			"",
		}, "\n"),
		"clean/value_test.go": strings.Join([]string{
			"package clean",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {",
			"\tif Value() != 11 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"broken/value.go": "package broken\nfunc Value() int { return 12 }\n",
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
		"notests/value.go": "package notests\nfunc Value() int { return 13 }\n",
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./..."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run mixed package tests: %v", err)
	}

	clean := requirePackageResult(t, result, "example.test/mixed/clean")
	if clean.Action != ActionPass {
		t.Fatalf("clean package should pass independently: %#v", clean)
	}
	broken := requirePackageResult(t, result, "example.test/mixed/broken")
	if broken.Action != ActionFail || broken.Owner != OwnerPackageGraph {
		t.Fatalf("broken package should carry package graph failure: %#v", broken)
	}
	if !strings.Contains(broken.Error, "Missing") {
		t.Fatalf("broken package error should preserve load diagnostic: %#v", broken)
	}
	noTests := requirePackageResult(t, result, "example.test/mixed/notests")
	if noTests.Action != ActionSkip {
		t.Fatalf("no-test package should stay skipped: %#v", noTests)
	}
}

func TestRunnerScopesPackageCompileErrors(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/mixedcompile\n\ngo 1.25.3\n",
		"clean/value.go": strings.Join([]string{
			"package clean",
			"",
			"func Value() int { return 11 }",
			"",
		}, "\n"),
		"clean/value_test.go": strings.Join([]string{
			"package clean",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {",
			"\tif Value() != 11 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"broken/value.go": strings.Join([]string{
			"package broken",
			"",
			"func Value() int {",
			"\ttotal := 0",
			"\tfor total < 2 {",
			"\t\ttotal++",
			"\t\tgoto skip",
			"\tcheck:",
			"\t\tif total > 1 {",
			"\t\t\tcontinue",
			"\t\t}",
			"\tskip:",
			"\t\tswitch total {",
			"\t\tcase 1:",
			"\t\t\tgoto check",
			"\t\t}",
			"\t\tbreak",
			"\t}",
			"\treturn total",
			"}",
			"",
		}, "\n"),
		"broken/value_test.go": strings.Join([]string{
			"package broken",
			"",
			"import \"testing\"",
			"",
			"func TestBroken(t *testing.T) {",
			"\tif Value() == 0 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./..."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run mixed compile test: %v", err)
	}

	clean := requirePackageResult(t, result, "example.test/mixedcompile/clean")
	if clean.Action != ActionPass {
		t.Fatalf("clean package should pass independently: %#v", clean)
	}
	broken := requirePackageResult(t, result, "example.test/mixedcompile/broken")
	if broken.Action != ActionFail || broken.Owner != OwnerLowering {
		t.Fatalf("broken package should carry lowering failure: %#v", broken)
	}
	if !strings.Contains(broken.Error, "unsupported goto branch") {
		t.Fatalf("broken package error should preserve compile diagnostic: %#v", broken)
	}
}

func TestRunnerDoesNotCompileDependencyTests(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/deptest\n\ngo 1.25.3\n",
		"dep/value.go": strings.Join([]string{
			"package dep",
			"",
			"func Value() int { return 11 }",
			"",
		}, "\n"),
		"dep/value_test.go": strings.Join([]string{
			"package dep",
			"",
			"import \"testing\"",
			"",
			"func TestDependencyOnly(t *testing.T) {",
			"Loop:",
			"\tfor {",
			"\t\tbreak Loop",
			"\t}",
			"}",
			"",
		}, "\n"),
		"app/value.go": strings.Join([]string{
			"package app",
			"",
			"import \"example.test/deptest/dep\"",
			"",
			"func Value() int { return dep.Value() }",
			"",
		}, "\n"),
		"app/value_test.go": strings.Join([]string{
			"package app",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {",
			"\tif Value() != 11 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./app"},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run dependency test isolation fixture: %v", err)
	}

	app := requirePackageResult(t, result, "example.test/deptest/app")
	if app.Action != ActionPass {
		t.Fatalf("package under test should ignore dependency-only tests: %#v", app)
	}
}

func TestRunnerScopesPackageTypecheckErrors(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/mixedtypecheck\n\ngo 1.25.3\n",
		"clean/value.go": strings.Join([]string{
			"package clean",
			"",
			"func Value() int { return 11 }",
			"",
		}, "\n"),
		"clean/value_test.go": strings.Join([]string{
			"package clean",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {",
			"\tif Value() != 11 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"bad/value.go": strings.Join([]string{
			"package bad",
			"",
			"func Value() int { return 12 }",
			"",
		}, "\n"),
		"bad/value_test.go": strings.Join([]string{
			"package bad",
			"",
			"import \"testing\"",
			"",
			"func TestBad(t *testing.T) {",
			"\tif Value() != 12 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "tsgo"), strings.Join([]string{
		"#!/bin/sh",
		"project=",
		"while [ \"$#\" -gt 0 ]; do",
		"\tif [ \"$1\" = \"--project\" ]; then",
		"\t\tshift",
		"\t\tproject=\"$1\"",
		"\tfi",
		"\tshift || break",
		"done",
		"runner=$(sed -n 's/.*\"\\(runner-[0-9][0-9]*\\.ts\\)\".*/\\1/p' \"$project\" | head -n 1)",
		"if grep -q 'example.test/mixedtypecheck/bad' \"$runner\"; then",
		"\techo 'TypeScript TS9000: bad package'",
		"\texit 1",
		"fi",
		"exit 0",
		"",
	}, "\n"))
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "bun"), strings.Join([]string{
		"#!/bin/sh",
		"exit 0",
		"",
	}, "\n"))

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./..."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run mixed typecheck test: %v", err)
	}

	clean := requirePackageResult(t, result, "example.test/mixedtypecheck/clean")
	if clean.Action != ActionPass {
		t.Fatalf("clean package should pass independently: %#v", clean)
	}
	bad := requirePackageResult(t, result, "example.test/mixedtypecheck/bad")
	if bad.Action != ActionFail || bad.Owner != OwnerTypeScriptEmitter {
		t.Fatalf("bad package should carry typecheck failure: %#v", bad)
	}
	if !strings.Contains(bad.Error, "TS9000") {
		t.Fatalf("bad package error should preserve typecheck output: %#v", bad)
	}
}

func requirePackageResult(t *testing.T, result *Result, packagePath string) PackageResult {
	t.Helper()

	if result != nil {
		for _, pkg := range result.Packages {
			if pkg.PackagePath == packagePath {
				return pkg
			}
		}
	}
	t.Fatalf("missing package result %q in %#v", packagePath, result)
	return PackageResult{}
}

func writeFixture(t *testing.T, files map[string]string) string {
	t.Helper()

	dir := t.TempDir()
	for name, contents := range files {
		path := filepath.Join(dir, name)
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatal(err.Error())
		}
		if err := os.WriteFile(path, []byte(contents), 0o644); err != nil {
			t.Fatal(err.Error())
		}
	}
	return dir
}

func writeExecutable(t *testing.T, path string, contents string) {
	t.Helper()

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err.Error())
	}
	if err := os.WriteFile(path, []byte(contents), 0o755); err != nil {
		t.Fatal(err.Error())
	}
}
