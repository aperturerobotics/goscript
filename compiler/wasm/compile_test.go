package wasm

import (
	"errors"
	"strings"
	"testing"

	"github.com/s4wave/goscript/compiler"
)

func TestCompileSourceCompilesSingleFile(t *testing.T) {
	output, err := CompileSource(strings.Join([]string{
		"package main",
		"",
		"type Counter struct {",
		"    value int",
		"}",
		"",
		"func (c *Counter) Increment() {",
		"    c.value++",
		"}",
		"",
		"func main() {",
		"    c := &Counter{}",
		"    c.Increment()",
		"    println(\"Count:\", c.value)",
		"}",
		"",
	}, "\n"), "main")
	if err != nil {
		t.Fatal(err.Error())
	}
	for _, want := range []string{
		"import * as $ from \"@goscript/builtin/index.js\"",
		"class Counter",
		"public Increment(): void",
		"export async function main(): globalThis.Promise<void>",
		"$.println(\"Count:\", $.pointerValue<Counter>(c).value)",
		"await main()",
	} {
		if !strings.Contains(output, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, output)
		}
	}
}

func TestCompileSourceReportsParseErrors(t *testing.T) {
	_, err := CompileSource("package main\nfunc main( {\n", "main")
	if err == nil {
		t.Fatal("expected compile error")
	}
	diag := requireCompileDiagnostic(t, err, "goscript/wasm:parse")
	requireDiagnosticPosition(t, diag, "main.go", 2, 12)
}

func TestCompileSourceReportsUnsupportedImports(t *testing.T) {
	_, err := CompileSource("package main\n\nimport \"fmt\"\n\nfunc main() { fmt.Println(\"hi\") }\n", "main")
	if err == nil {
		t.Fatal("expected compile error")
	}
	diag := requireCompileDiagnostic(t, err, "goscript/wasm:imports-unsupported")
	requireDiagnosticPosition(t, diag, "main.go", 3, 8)
}

func TestCompileSourceReportsTypecheckPositions(t *testing.T) {
	_, err := CompileSource(strings.Join([]string{
		"package main",
		"",
		"func main() {",
		"    missing()",
		"}",
		"",
	}, "\n"), "main")
	if err == nil {
		t.Fatal("expected compile error")
	}
	diag := requireCompileDiagnostic(t, err, "goscript/wasm:typecheck")
	requireDiagnosticPosition(t, diag, "main.go", 4, 5)
}

func requireCompileDiagnostic(t *testing.T, err error, code string) compiler.Diagnostic {
	t.Helper()

	var compileErr *compiler.CompileError
	if !errors.As(err, &compileErr) {
		t.Fatalf("expected CompileError, got %T: %v", err, err)
	}
	for _, diag := range compileErr.Diagnostics {
		if diag.Code == code {
			if diag.Severity != compiler.DiagnosticSeverityError {
				t.Fatalf("expected error severity, got %s", diag.Severity)
			}
			return diag
		}
	}
	t.Fatalf("missing diagnostic %q in %#v", code, compileErr.Diagnostics)
	return compiler.Diagnostic{}
}

func requireDiagnosticPosition(t *testing.T, diag compiler.Diagnostic, displayFile string, line int, column int) {
	t.Helper()

	if diag.Position == nil {
		t.Fatalf("expected position in %#v", diag)
	}
	if diag.Position.DisplayFile != displayFile {
		t.Fatalf("DisplayFile = %q, want %q", diag.Position.DisplayFile, displayFile)
	}
	if diag.Position.Line != line || diag.Position.Column != column {
		t.Fatalf("position = %d:%d, want %d:%d", diag.Position.Line, diag.Position.Column, line, column)
	}
}
