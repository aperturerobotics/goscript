package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func TestOverrideParityVerifierRequiresBehaviorTestForRealFunction(t *testing.T) {
	result, err := compileBehaviorParityFixture(t, false)
	if err == nil {
		t.Fatalf("expected compile to fail without behavior test")
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-missing-behavior-test")

	result, err = compileBehaviorParityFixture(t, true)
	if err != nil {
		t.Fatalf("expected compile with behavior test to pass: %v\n%#v", err, result.Diagnostics)
	}
}

func compileBehaviorParityFixture(t *testing.T, withBehaviorTest bool) (*CompilationResult, error) {
	t.Helper()

	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/behaviorparity\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/behaviorparity/lib\"",
			"func main() { lib.Present() }",
			"",
		}, "\n"),
		"lib/lib.go": strings.Join([]string{
			"package lib",
			"func Present() {}",
			"",
		}, "\n"),
	})
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/behaviorparity/lib/index.ts", "export function Present(): void {}\n")
	if withBehaviorTest {
		writeFixtureFile(t, overrideDir, "example.test/behaviorparity/lib/index.test.ts", "import { Present } from './index.js'\nPresent()\n")
	}
	writeFixtureFile(t, overrideDir, "example.test/behaviorparity/lib/parity.json", parityFixtureJSON(t, map[string]overrideParityEntry{
		"Present": {Status: overrideParityStatusReal},
	}))

	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      filepath.Join(t.TempDir(), "out"),
		OverrideDirs:    []string{overrideDir},
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}
	return comp.CompilePackages(context.Background(), ".")
}
