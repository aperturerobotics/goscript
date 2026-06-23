package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func TestOverrideParityVerifierWarnsForMissingBehaviorTest(t *testing.T) {
	result, err := compileBehaviorParityFixture(t, "")
	if err != nil {
		t.Fatalf("expected compile without behavior test to warn, not fail: %v\n%#v", err, result.Diagnostics)
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-missing-behavior-test")
	requireDiagnosticSeverity(t, result.Diagnostics, "goscript/overrides:parity-missing-behavior-test", DiagnosticSeverityWarning)

	result, err = compileBehaviorParityFixture(t, strings.Join([]string{
		"import { Present } from './index.js'",
		"Present()",
		"",
	}, "\n"))
	if err != nil {
		t.Fatalf("expected compile with behavior test to pass: %v\n%#v", err, result.Diagnostics)
	}
}

func TestOverrideParityVerifierIgnoresImportOnlyBehaviorReference(t *testing.T) {
	result, err := compileBehaviorParityFixture(t, strings.Join([]string{
		"import { Present } from './index.js'",
		"const name = 'Present'",
		"void name",
		"",
	}, "\n"))
	if err != nil {
		t.Fatalf("expected import-only behavior test to warn, not fail: %v\n%#v", err, result.Diagnostics)
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-missing-behavior-test")
	requireDiagnosticSeverity(t, result.Diagnostics, "goscript/overrides:parity-missing-behavior-test", DiagnosticSeverityWarning)
}

func TestOverrideParityVerifierAcceptsNamespaceBehaviorReference(t *testing.T) {
	result, err := compileBehaviorParityFixture(t, strings.Join([]string{
		"import * as lib from './index.js'",
		"lib.Present()",
		"",
	}, "\n"))
	if err != nil {
		t.Fatalf("expected namespace behavior test to pass: %v\n%#v", err, result.Diagnostics)
	}
}

func compileBehaviorParityFixture(t *testing.T, behaviorTest string) (*CompilationResult, error) {
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
	if behaviorTest != "" {
		writeFixtureFile(t, overrideDir, "example.test/behaviorparity/lib/index.test.ts", behaviorTest)
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

func requireDiagnosticSeverity(t *testing.T, diagnostics []Diagnostic, code string, severity DiagnosticSeverity) {
	t.Helper()

	for _, diagnostic := range diagnostics {
		if diagnostic.Code == code && diagnostic.Severity == severity {
			return
		}
	}
	t.Fatalf("missing diagnostic %q with severity %q in %#v", code, severity, diagnostics)
}
