package compiler

import (
	"path/filepath"
	"strconv"
	"strings"
)

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
	// Position is the optional source point that caused the diagnostic.
	Position *DiagnosticPosition
}

// DiagnosticPosition identifies the source point that caused a diagnostic.
type DiagnosticPosition struct {
	// File is the raw file identity from the compiler source owner.
	File string
	// DisplayFile is the request-relative file identity for human output.
	DisplayFile string
	// Line is the 1-based source line.
	Line int
	// Column is the 1-based source column.
	Column int
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

	return FormatDiagnostics(e.Diagnostics)
}

// FormatDiagnostics returns the canonical human-readable diagnostic summary.
func FormatDiagnostics(diagnostics []Diagnostic) string {
	var b strings.Builder
	for i, diag := range diagnostics {
		if i != 0 {
			b.WriteString("; ")
		}
		b.WriteString(FormatDiagnostic(diag))
	}
	return b.String()
}

// FormatDiagnostic returns the canonical human-readable form of one diagnostic.
func FormatDiagnostic(diag Diagnostic) string {
	var b strings.Builder
	if pos := formatDiagnosticPosition(diag.Position); pos != "" {
		b.WriteString(pos)
		b.WriteString(": ")
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
	return b.String()
}

func formatDiagnosticPosition(pos *DiagnosticPosition) string {
	if pos == nil || pos.Line <= 0 {
		return ""
	}
	file := strings.TrimSpace(pos.DisplayFile)
	if file == "" {
		file = strings.TrimSpace(pos.File)
	}
	if file == "" {
		return ""
	}
	var b strings.Builder
	b.WriteString(filepath.ToSlash(file))
	b.WriteString(":")
	b.WriteString(strconv.Itoa(pos.Line))
	if pos.Column > 0 {
		b.WriteString(":")
		b.WriteString(strconv.Itoa(pos.Column))
	}
	return b.String()
}

func diagnosticPositionFromSource(pos sourcePosition, displayRoot string) *DiagnosticPosition {
	if pos.line <= 0 {
		return nil
	}
	file := strings.TrimSpace(pos.file)
	return &DiagnosticPosition{
		File:        file,
		DisplayFile: diagnosticDisplayFile(file, displayRoot),
		Line:        pos.line,
		Column:      pos.column,
	}
}

func diagnosticDisplayFile(file string, displayRoot string) string {
	file = strings.TrimSpace(file)
	if file == "" {
		return ""
	}
	displayRoot = strings.TrimSpace(displayRoot)
	if displayRoot == "" {
		return filepath.ToSlash(file)
	}
	root := displayRoot
	if absRoot, err := filepath.Abs(root); err == nil {
		root = absRoot
	}
	candidate := file
	if !filepath.IsAbs(candidate) {
		candidate = filepath.Join(root, candidate)
	}
	if rel, err := filepath.Rel(root, candidate); err == nil && rel != "." && rel != ".." && !strings.HasPrefix(rel, ".."+string(filepath.Separator)) {
		return filepath.ToSlash(rel)
	}
	return filepath.ToSlash(file)
}

func diagnosticsHaveErrors(diagnostics []Diagnostic) bool {
	for _, diag := range diagnostics {
		if diag.Severity == DiagnosticSeverityError {
			return true
		}
	}
	return false
}
