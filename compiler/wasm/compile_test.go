package wasm

import (
	"errors"
	"testing"

	"github.com/aperturerobotics/goscript/compiler"
)

func TestCompileSourceReportsUnsupportedSingleFile(t *testing.T) {
	_, err := CompileSource("package main\nfunc main() {}\n", "main")
	if err == nil {
		t.Fatal("expected compile error")
	}
	var compileErr *compiler.CompileError
	if !errors.As(err, &compileErr) {
		t.Fatalf("expected CompileError, got %T: %v", err, err)
	}
	if len(compileErr.Diagnostics) != 1 {
		t.Fatalf("expected one diagnostic, got %d", len(compileErr.Diagnostics))
	}
	diag := compileErr.Diagnostics[0]
	if diag.Code != "goscript/wasm:single-file-unsupported" {
		t.Fatalf("expected single-file diagnostic, got %s", diag.Code)
	}
	if diag.Severity != compiler.DiagnosticSeverityError {
		t.Fatalf("expected error severity, got %s", diag.Severity)
	}
}
