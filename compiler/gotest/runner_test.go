package gotest

import (
	"context"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strconv"
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
	if result.Packages[0].Phases.Workspace != PhaseStatusPass ||
		result.Packages[0].Phases.Compile != PhaseStatusPass ||
		result.Packages[0].Phases.Emit != PhaseStatusPass ||
		result.Packages[0].Phases.TypeCheck != PhaseStatusPass ||
		result.Packages[0].Phases.Runtime != PhaseStatusPass {
		t.Fatalf("unexpected phase status: %#v", result.Packages[0].Phases)
	}
}

func TestRunnerReportsShortMode(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/short\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package short",
			"",
			"import \"testing\"",
			"",
			"func TestShort(t *testing.T) {",
			"\tif !testing.Short() {",
			"\t\tt.Fatalf(\"expected short mode\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Short:    true,
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run short package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected short package to pass: %#v", result.Packages)
	}
}

func TestRunnerRunsAsyncSubtest(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/asyncsubtest\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package asyncsubtest",
			"",
			"import \"testing\"",
			"",
			"func TestAsyncSubtest(t *testing.T) {",
			"\tt.Run(\"child\", func(t *testing.T) {",
			"\t\tch := make(chan string, 1)",
			"\t\tch <- \"ok\"",
			"\t\tif <-ch != \"ok\" {",
			"\t\t\tt.Fatalf(\"unexpected channel value\")",
			"\t\t}",
			"\t})",
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
		t.Fatalf("run async subtest package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected async subtest to pass: %#v", result.Packages)
	}
}

func TestRunnerAwaitsAsyncDependencyCallsInTests(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/asyncdep\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package asyncdep",
			"",
			"import (",
			"\t\"math/rand\"",
			"\t\"testing\"",
			")",
			"",
			"func TestAsyncDependencyCall(t *testing.T) {",
			"\tr := rand.New(rand.NewSource(1))",
			"\t_ = uint8(r.Intn(256))",
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
		t.Fatalf("run async dependency package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected async dependency package to pass: %#v", result.Packages)
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

func TestRunnerAppliesOverridesToTestImports(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/testoverride\n\ngo 1.25.3\n",
		"dep/value.go": strings.Join([]string{
			"package dep",
			"",
			"func Value() int {",
			"\tx := 41",
			"\t_ = &x",
			"\treturn x + 1",
			"}",
			"",
		}, "\n"),
		"app/value.go": "package app\n",
		"app/value_test.go": strings.Join([]string{
			"package app",
			"",
			"import (",
			"\t\"testing\"",
			"",
			"\t\"example.test/testoverride/dep\"",
			")",
			"",
			"func TestOverrideImport(t *testing.T) {",
			"\tif dep.Value() != 42 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	overrideDir := filepath.Join(moduleDir, "gs")
	if err := os.MkdirAll(filepath.Join(overrideDir, "example.test", "testoverride", "dep"), 0o755); err != nil {
		t.Fatal(err.Error())
	}
	if err := os.WriteFile(
		filepath.Join(overrideDir, "example.test", "testoverride", "dep", "index.ts"),
		[]byte("export function Value(): number { return 42 }\n"),
		0o644,
	); err != nil {
		t.Fatal(err.Error())
	}

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:          moduleDir,
		Patterns:     []string{"./app"},
		OverrideDirs: []string{overrideDir},
		Timeout:      30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run override import package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package test to pass with override import: %#v", result.Packages)
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
	if broken.Phases.Compile != PhaseStatusFail {
		t.Fatalf("broken package should carry compile phase failure: %#v", broken)
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
			"\tx := 1",
			"\tp := &x",
			"\t_ = &(*p)",
			"\treturn x",
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
	if !strings.Contains(broken.Error, "unsupported address expression") {
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
		"if [ \"$project\" = \"tsconfig.json\" ]; then",
		"\tif grep -q 'example.test/mixedtypecheck/bad' runner-*.ts; then",
		"\t\techo 'TypeScript TS9000: bad package'",
		"\t\texit 1",
		"\tfi",
		"\texit 0",
		"fi",
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

func TestRunnerDoesNotRepeatSharedOverrideTypecheckFailure(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/sharedoverride\n\ngo 1.25.3\n",
		"one/value.go": strings.Join([]string{
			"package one",
			"",
			"func Value() int { return 1 }",
			"",
		}, "\n"),
		"one/value_test.go": strings.Join([]string{
			"package one",
			"",
			"import \"testing\"",
			"",
			"func TestOne(t *testing.T) {",
			"\tif Value() != 1 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/value.go": strings.Join([]string{
			"package two",
			"",
			"func Value() int { return 2 }",
			"",
		}, "\n"),
		"two/value_test.go": strings.Join([]string{
			"package two",
			"",
			"import \"testing\"",
			"",
			"func TestTwo(t *testing.T) {",
			"\tif Value() != 2 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	workDir := filepath.Join(moduleDir, "work")
	projectLog := filepath.Join(moduleDir, "projects.log")
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
		"printf '%s\\n' \"$project\" >> " + strconv.Quote(projectLog),
		"echo 'output/@goscript/example.test/override/index.ts(1,1): error TS2305: Module has no exported member Thing'",
		"exit 1",
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
		WorkDir:  workDir,
	})
	if err != nil {
		t.Fatalf("run shared override typecheck fixture: %v", err)
	}

	one := requirePackageResult(t, result, "example.test/sharedoverride/one")
	two := requirePackageResult(t, result, "example.test/sharedoverride/two")
	for _, pkg := range []PackageResult{one, two} {
		if pkg.Action != ActionFail || pkg.Owner != OwnerOverridePackage {
			t.Fatalf("package should carry aggregate override failure: %#v", pkg)
		}
		if pkg.Phases.TypeCheck != PhaseStatusFail || pkg.Phases.Runtime != PhaseStatusSkip {
			t.Fatalf("package should fail at aggregate typecheck without runtime: %#v", pkg)
		}
	}
	data, err := os.ReadFile(projectLog)
	if err != nil {
		t.Fatalf("read project log: %v", err)
	}
	projects := strings.Fields(string(data))
	if len(projects) != 1 || projects[0] != "tsconfig.json" {
		t.Fatalf("expected only aggregate typecheck, got:\n%s", data)
	}
}

func TestRunnerUsesBatchTypeScriptProject(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/packageprojects\n\ngo 1.25.3\n",
		"one/value.go": strings.Join([]string{
			"package one",
			"",
			"func Value() int { return 1 }",
			"",
		}, "\n"),
		"one/value_test.go": strings.Join([]string{
			"package one",
			"",
			"import \"testing\"",
			"",
			"func TestOne(t *testing.T) {",
			"\tif Value() != 1 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/value.go": strings.Join([]string{
			"package two",
			"",
			"func Value() int { return 2 }",
			"",
		}, "\n"),
		"two/value_test.go": strings.Join([]string{
			"package two",
			"",
			"import \"testing\"",
			"",
			"func TestTwo(t *testing.T) {",
			"\tif Value() != 2 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	workDir := filepath.Join(moduleDir, ".tmp", "package-projects")
	projectLog := filepath.Join(moduleDir, "projects.log")
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
		"printf '%s\\n' \"$project\" >> " + strconv.Quote(projectLog),
		"exit 0",
		"",
	}, "\n"))
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "bun"), strings.Join([]string{
		"#!/bin/sh",
		"exit 0",
		"",
	}, "\n"))

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:         moduleDir,
		Patterns:    []string{"./..."},
		Timeout:     30 * time.Second,
		WorkDir:     workDir,
		Parallelism: 2,
	})
	if err != nil {
		t.Fatalf("run package projects fixture: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package projects fixture to pass: %#v", result.Packages)
	}
	data, err := os.ReadFile(projectLog)
	if err != nil {
		t.Fatalf("read project log: %v", err)
	}
	projects := string(data)
	if strings.TrimSpace(projects) != "tsconfig.json" {
		t.Fatalf("expected aggregate tsconfig project, got:\n%s", projects)
	}
}

func TestRunnerRunsCombinedRuntimeChunks(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/runtimechunks\n\ngo 1.25.3\n",
		"one/value.go": strings.Join([]string{
			"package one",
			"",
			"func Value() int { return 1 }",
			"",
		}, "\n"),
		"one/value_test.go": strings.Join([]string{
			"package one",
			"",
			"import \"testing\"",
			"",
			"func TestOne(t *testing.T) {",
			"\tif Value() != 1 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/value.go": strings.Join([]string{
			"package two",
			"",
			"func Value() int { return 2 }",
			"",
		}, "\n"),
		"two/value_test.go": strings.Join([]string{
			"package two",
			"",
			"import \"testing\"",
			"",
			"func TestTwo(t *testing.T) {",
			"\tif Value() != 2 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	workDir := filepath.Join(moduleDir, ".tmp", "runtime-chunks")
	runtimeLog := filepath.Join(moduleDir, "runtime.log")
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "tsgo"), strings.Join([]string{
		"#!/bin/sh",
		"exit 0",
		"",
	}, "\n"))
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "bun"), strings.Join([]string{
		"#!/bin/sh",
		"runner=\"$1\"",
		"printf '%s\\n' \"$runner\" >> " + strconv.Quote(runtimeLog),
		"case \"$runner\" in",
		"runner-all-*)",
		"\tsed -n 's/.*await __goscriptRunPackage(\"\\([^\"]*\\)\".*/\\1/p' \"$runner\" | while IFS= read -r pkg; do",
		"\t\tprintf '" + combinedRuntimeResultPrefix + "{\"packagePath\":\"%s\",\"ok\":true,\"elapsedMs\":1,\"output\":\"\"}\\n' \"$pkg\"",
		"\tdone",
		"\texit 0",
		"\t;;",
		"*)",
		"\texit 1",
		"\t;;",
		"esac",
		"",
	}, "\n"))

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:           moduleDir,
		Patterns:      []string{"./..."},
		Timeout:       30 * time.Second,
		WorkDir:       workDir,
		Parallelism:   2,
		RuntimeGroups: true,
	})
	if err != nil {
		t.Fatalf("run runtime chunks fixture: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected runtime chunks fixture to pass: %#v", result.Packages)
	}
	data, err := os.ReadFile(runtimeLog)
	if err != nil {
		t.Fatalf("read runtime log: %v", err)
	}
	runners := strings.Fields(string(data))
	slices.Sort(runners)
	if strings.Join(runners, "\n") != "runner-all-0.ts\nrunner-all-1.ts" {
		t.Fatalf("expected chunked combined runners, got:\n%s", data)
	}
}

func TestRunnerFallsBackToPackageScopedTypeScriptProjects(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/packageprojects\n\ngo 1.25.3\n",
		"one/value.go": strings.Join([]string{
			"package one",
			"",
			"func Value() int { return 1 }",
			"",
		}, "\n"),
		"one/value_test.go": strings.Join([]string{
			"package one",
			"",
			"import \"testing\"",
			"",
			"func TestOne(t *testing.T) {",
			"\tif Value() != 1 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/value.go": strings.Join([]string{
			"package two",
			"",
			"func Value() int { return 2 }",
			"",
		}, "\n"),
		"two/value_test.go": strings.Join([]string{
			"package two",
			"",
			"import \"testing\"",
			"",
			"func TestTwo(t *testing.T) {",
			"\tif Value() != 2 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	workDir := filepath.Join(moduleDir, ".tmp", "package-projects")
	projectLog := filepath.Join(moduleDir, "projects.log")
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
		"printf '%s\\n' \"$project\" >> " + strconv.Quote(projectLog),
		"if [ \"$project\" = \"tsconfig.json\" ]; then",
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
		Dir:         moduleDir,
		Patterns:    []string{"./..."},
		Timeout:     30 * time.Second,
		WorkDir:     workDir,
		Parallelism: 2,
	})
	if err != nil {
		t.Fatalf("run package projects fixture: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package projects fixture to pass: %#v", result.Packages)
	}
	data, err := os.ReadFile(projectLog)
	if err != nil {
		t.Fatalf("read project log: %v", err)
	}
	projects := string(data)
	if !strings.Contains(projects, "tsconfig.json") ||
		!strings.Contains(projects, "tsconfig-0.json") ||
		!strings.Contains(projects, "tsconfig-1.json") {
		t.Fatalf("expected aggregate project and package-scoped fallback, got:\n%s", projects)
	}
}

func TestDefaultParallelismCapsAtEight(t *testing.T) {
	previous := runtime.GOMAXPROCS(16)
	t.Cleanup(func() { runtime.GOMAXPROCS(previous) })

	if got := DefaultParallelism(); got != 8 {
		t.Fatalf("expected default parallelism cap 8, got %d", got)
	}
}

func TestNormalizeKeepsIncrementalTypeCheckExplicit(t *testing.T) {
	norm, err := (&Request{
		Patterns: []string{"./..."},
		WorkDir:  t.TempDir(),
	}).normalize()
	if err != nil {
		t.Fatalf("normalize request: %v", err)
	}
	if norm.IncrementalTypeCheck {
		t.Fatalf("expected explicit workdir alone to skip incremental typecheck cache")
	}

	norm, err = (&Request{
		Patterns:             []string{"./..."},
		IncrementalTypeCheck: true,
	}).normalize()
	if err != nil {
		t.Fatalf("normalize incremental request: %v", err)
	}
	if !norm.IncrementalTypeCheck {
		t.Fatalf("expected incremental flag to enable typecheck cache")
	}
}

func TestPackageExecutionIndexesPrioritizesLargerTestPackages(t *testing.T) {
	result := &Result{Packages: []PackageResult{
		{
			PackagePath: "example.test/small",
			Tests:       []Test{{Name: "TestSmall"}},
		},
		{
			PackagePath: "example.test/large",
			Tests: []Test{
				{Name: "TestLargeA"},
				{Name: "TestLargeB"},
				{Name: "TestLargeC"},
			},
		},
		{
			PackagePath: "example.test/medium-b",
			Tests: []Test{
				{Name: "TestMediumB1"},
				{Name: "TestMediumB2"},
			},
		},
		{
			PackagePath: "example.test/medium-a",
			Tests: []Test{
				{Name: "TestMediumA1"},
				{Name: "TestMediumA2"},
			},
		},
	}}

	got := packageExecutionIndexes(result, []int{0, 1, 2, 3})
	want := []int{1, 3, 2, 0}
	if !slices.Equal(got, want) {
		t.Fatalf("expected execution indexes %v, got %v", want, got)
	}
}

func TestRenderRunnerChangesToPackageSourceDir(t *testing.T) {
	req := &normalizedRequest{}
	runner := renderRunner(PackageResult{
		PackagePath: "example.test/pkg",
		SourceDir:   "/workspace/pkg",
		Tests: []Test{{
			Name:        "TestCwd",
			PackagePath: "example.test/pkg",
		}},
	}, req)

	if !strings.Contains(runner, "process.chdir(\"/workspace/pkg\")") {
		t.Fatalf("expected runner to chdir to package source dir: %s", runner)
	}
	if !strings.Contains(runner, "await runTests(\"example.test/pkg\"") {
		t.Fatalf("expected runner to execute package tests: %s", runner)
	}
}

func TestRenderCombinedRunnerChangesToEachPackageSourceDir(t *testing.T) {
	req := &normalizedRequest{}
	runner := renderCombinedRunner(&Result{Packages: []PackageResult{
		{
			PackagePath: "example.test/one",
			SourceDir:   "/workspace/one",
			Tests: []Test{{
				Name:        "TestOne",
				PackagePath: "example.test/one",
			}},
		},
		{
			PackagePath: "example.test/two",
			SourceDir:   "/workspace/two",
			Tests: []Test{{
				Name:        "TestTwo",
				PackagePath: "example.test/two",
			}},
		},
	}}, []int{0, 1}, req)

	if !strings.Contains(runner, "await __goscriptRunPackage(\"example.test/one\", \"/workspace/one\"") {
		t.Fatalf("expected combined runner to pass first package source dir: %s", runner)
	}
	if !strings.Contains(runner, "await __goscriptRunPackage(\"example.test/two\", \"/workspace/two\"") {
		t.Fatalf("expected combined runner to pass second package source dir: %s", runner)
	}
	if !strings.Contains(runner, "process.chdir(packageDir)") {
		t.Fatalf("expected combined runner to chdir before each package: %s", runner)
	}
}

func TestRenderTypeScriptProjectDisablesAmbientTypePackages(t *testing.T) {
	req := &normalizedRequest{
		WorkDir: "/work",
	}

	tsconfig := renderTypeScriptProject(req, "/work/output/package-0", "runner-0.ts", "tsconfig-0.json", false)
	if !strings.Contains(tsconfig, "\"types\": []") {
		t.Fatalf("expected generated tsconfig to disable ambient @types packages: %s", tsconfig)
	}
	if !strings.Contains(tsconfig, "\"goscript-node.d.ts\"") {
		t.Fatalf("expected generated tsconfig to include GoScript node ambient declarations: %s", tsconfig)
	}
	if strings.Contains(tsconfig, "\"incremental\": true") || strings.Contains(tsconfig, "\"tsBuildInfoFile\"") {
		t.Fatalf("expected generated tsconfig to keep one-shot typecheck by default: %s", tsconfig)
	}
	if strings.Contains(tsconfig, "output/package-0/**/*.ts") {
		t.Fatalf("expected generated tsconfig to typecheck from runner roots, not output globs: %s", tsconfig)
	}
}

func TestRenderTypeScriptProjectUsesNodeTypesWhenAvailable(t *testing.T) {
	req := &normalizedRequest{
		WorkDir: "/work",
	}

	tsconfig := renderTypeScriptProject(req, "/work/output/package-0", "runner-0.ts", "tsconfig-0.json", true)
	if !strings.Contains(tsconfig, "\"types\": [\"node\"]") {
		t.Fatalf("expected generated tsconfig to opt into node types: %s", tsconfig)
	}
}

func TestRenderRuntimeTypeScriptProjectDisablesEmit(t *testing.T) {
	req := &normalizedRequest{
		WorkDir: "/work",
	}

	tsconfig := renderRuntimeTypeScriptProject(req, []string{"/work/output"}, false)
	if !strings.Contains(tsconfig, "\"noEmit\": true") {
		t.Fatalf("expected aggregate tsconfig to disable emit: %s", tsconfig)
	}
	if strings.Contains(tsconfig, "\"incremental\": true") || strings.Contains(tsconfig, "\"tsBuildInfoFile\"") {
		t.Fatalf("expected aggregate tsconfig to keep one-shot typecheck by default: %s", tsconfig)
	}
	if !strings.Contains(tsconfig, "\"runner-*.ts\"") {
		t.Fatalf("expected aggregate tsconfig to typecheck generated runner roots: %s", tsconfig)
	}
	if !strings.Contains(tsconfig, "./output/@goscript/*") {
		t.Fatalf("expected aggregate tsconfig path aliases to reference output root: %s", tsconfig)
	}
	if strings.Contains(tsconfig, "output/**/*.ts") {
		t.Fatalf("expected aggregate tsconfig to typecheck from runner roots, not output globs: %s", tsconfig)
	}
}

func TestRenderTypeScriptProjectsCanUseIncrementalBuildInfo(t *testing.T) {
	req := &normalizedRequest{
		WorkDir:              "/work",
		IncrementalTypeCheck: true,
	}

	packageTSConfig := renderTypeScriptProject(req, "/work/output/package-0", "runner-0.ts", "tsconfig-0.json", false)
	if !strings.Contains(packageTSConfig, "\"incremental\": true") ||
		!strings.Contains(packageTSConfig, "\"tsBuildInfoFile\": \".goscript/tsconfig-0.tsbuildinfo\"") {
		t.Fatalf("expected package tsconfig to cache package typecheck state: %s", packageTSConfig)
	}

	aggregateTSConfig := renderRuntimeTypeScriptProject(req, []string{"/work/output"}, false)
	if !strings.Contains(aggregateTSConfig, "\"incremental\": true") ||
		!strings.Contains(aggregateTSConfig, "\"tsBuildInfoFile\": \".goscript/tsconfig.tsbuildinfo\"") {
		t.Fatalf("expected aggregate tsconfig to cache typecheck state: %s", aggregateTSConfig)
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
