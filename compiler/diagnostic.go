package compiler

import "strings"

// DiagnosticSeverity is the severity of a compiler diagnostic.
type DiagnosticSeverity string

const (
	// DiagnosticSeverityError marks a diagnostic that stops compilation.
	DiagnosticSeverityError DiagnosticSeverity = "error"
	// DiagnosticSeverityWarning marks a diagnostic that does not stop compilation.
	DiagnosticSeverityWarning DiagnosticSeverity = "warning"
)

// Diagnostic is a structured compiler message surfaced by every adapter.
type Diagnostic struct {
	// Severity is the diagnostic severity.
	Severity DiagnosticSeverity
	// Code is a stable machine-readable diagnostic code.
	Code string
	// Message is the short human-readable diagnostic.
	Message string
	// Detail carries optional longer guidance.
	Detail string
}

// CompileError wraps structured diagnostics for ordinary Go error paths.
type CompileError struct {
	// Diagnostics are the structured compiler diagnostics.
	Diagnostics []Diagnostic
}

// NewCompileError creates a compile error from diagnostics.
func NewCompileError(diagnostics []Diagnostic) *CompileError {
	return &CompileError{Diagnostics: append([]Diagnostic(nil), diagnostics...)}
}

// Error returns the human-readable diagnostic summary.
func (e *CompileError) Error() string {
	if e == nil || len(e.Diagnostics) == 0 {
		return "goscript: compile failed"
	}

	var b strings.Builder
	for i, diag := range e.Diagnostics {
		if i != 0 {
			b.WriteString("; ")
		}
		if diag.Code != "" {
			b.WriteString(diag.Code)
			b.WriteString(": ")
		}
		b.WriteString(diag.Message)
		if diag.Detail != "" {
			b.WriteString(" (")
			b.WriteString(diag.Detail)
			b.WriteString(")")
		}
	}
	return b.String()
}

func diagnosticsHaveErrors(diagnostics []Diagnostic) bool {
	for _, diag := range diagnostics {
		if diag.Severity == DiagnosticSeverityError {
			return true
		}
	}
	return false
}
