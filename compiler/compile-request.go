package compiler

import (
	"os"
	"path/filepath"
	"strings"
)

// DependencyMode describes how much of the loaded package graph to keep.
type DependencyMode string

const (
	// DependencyModeRequested keeps only requested package nodes.
	DependencyModeRequested DependencyMode = "requested"
	// DependencyModeAll keeps reachable dependency package nodes.
	DependencyModeAll DependencyMode = "all"
)

// RuntimeEmissionMode describes how runtime packages should be handled.
type RuntimeEmissionMode string

const (
	// RuntimeEmissionModeEmit emits required runtime packages with output.
	RuntimeEmissionModeEmit RuntimeEmissionMode = "emit"
	// RuntimeEmissionModeReference references runtime packages without emitting them.
	RuntimeEmissionModeReference RuntimeEmissionMode = "reference"
)

// CompileRequest describes one compiler invocation after adapter normalization.
type CompileRequest struct {
	// Patterns are the Go package patterns requested by the caller.
	Patterns []string
	// Dir is the working directory for package loading.
	Dir string
	// OutputPath is the root where TypeScript output would be written.
	OutputPath string
	// BuildFlags are forwarded to the Go package loader.
	BuildFlags []string
	// DependencyMode controls whether dependencies are included in the graph.
	DependencyMode DependencyMode
	// RuntimeEmissionMode controls runtime package emission policy.
	RuntimeEmissionMode RuntimeEmissionMode
	// Tests controls whether package loading includes Go package-test variants.
	Tests bool
	// AllDependencies controls whether the package graph should include deps.
	AllDependencies bool
	// DisableEmitBuiltin controls whether runtime packages are emitted.
	DisableEmitBuiltin bool
}

// CompileRequestOwner owns adapter input normalization and validation.
type CompileRequestOwner struct{}

// NewCompileRequestOwner creates a compile request owner.
func NewCompileRequestOwner() *CompileRequestOwner {
	return &CompileRequestOwner{}
}

// NewRequest builds a request from public compiler config and package patterns.
func (o *CompileRequestOwner) NewRequest(conf Config, patterns []string) *CompileRequest {
	dir := conf.Dir
	if dir == "" {
		dir = "."
	}

	dependencyMode := DependencyModeRequested
	if conf.AllDependencies {
		dependencyMode = DependencyModeAll
	}
	runtimeEmissionMode := RuntimeEmissionModeEmit
	if conf.DisableEmitBuiltin {
		runtimeEmissionMode = RuntimeEmissionModeReference
	}

	return &CompileRequest{
		Patterns:            normalizePatterns(patterns),
		Dir:                 strings.TrimSpace(dir),
		OutputPath:          strings.TrimSpace(conf.OutputPath),
		BuildFlags:          append([]string(nil), conf.BuildFlags...),
		DependencyMode:      dependencyMode,
		RuntimeEmissionMode: runtimeEmissionMode,
		AllDependencies:     conf.AllDependencies,
		DisableEmitBuiltin:  conf.DisableEmitBuiltin,
	}
}

// Validate returns request diagnostics that must stop compilation before output.
func (o *CompileRequestOwner) Validate(req *CompileRequest) []Diagnostic {
	if req == nil {
		return []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:nil",
			Message:  "compile request is nil",
		}}
	}

	var diagnostics []Diagnostic
	if len(req.Patterns) == 0 {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:no-packages",
			Message:  "at least one Go package pattern is required",
			Detail:   "Use goscript compile --package . from inside a Go module.",
		})
	}
	if strings.TrimSpace(req.OutputPath) == "" {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:no-output",
			Message:  "output path root must be specified",
		})
	}
	if strings.TrimSpace(req.Dir) == "" {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:no-working-dir",
			Message:  "working directory must be specified",
		})
	} else {
		info, err := os.Stat(req.Dir)
		switch {
		case err != nil:
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:working-dir",
				Message:  "working directory is not readable",
				Detail:   err.Error(),
			})
		case !info.IsDir():
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:working-dir",
				Message:  "working directory must be a directory",
			})
		case !hasGoMod(req.Dir):
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:no-module",
				Message:  "working directory is not inside a Go module",
				Detail:   "Run goscript from a directory containing go.mod, or pass --dir for a module directory.",
			})
		}
	}
	if req.DependencyMode != DependencyModeRequested && req.DependencyMode != DependencyModeAll {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:dependency-mode",
			Message:  "dependency mode is invalid",
		})
	}
	if req.RuntimeEmissionMode != RuntimeEmissionModeEmit &&
		req.RuntimeEmissionMode != RuntimeEmissionModeReference {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:runtime-emission-mode",
			Message:  "runtime emission mode is invalid",
		})
	}
	for _, flag := range req.BuildFlags {
		if strings.TrimSpace(flag) == "" {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:empty-build-flag",
				Message:  "build flags must not contain empty values",
			})
		}
	}

	for _, pattern := range req.Patterns {
		trimmed := strings.TrimSpace(pattern)
		if trimmed == "" {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:empty-package",
				Message:  "package pattern must not be empty",
			})
			continue
		}
		if strings.HasSuffix(filepath.Base(trimmed), ".go") {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:single-file-unsupported",
				Message:  "single-file compilation is not supported by the v2 compiler",
				Detail:   "Use a package pattern such as . or ./path from inside a Go module.",
			})
		}
	}

	return diagnostics
}

func normalizePatterns(patterns []string) []string {
	if len(patterns) == 0 {
		return nil
	}

	normalized := make([]string, 0, len(patterns))
	for _, pattern := range patterns {
		normalized = append(normalized, strings.TrimSpace(pattern))
	}
	return normalized
}

func hasGoMod(dir string) bool {
	abs, err := filepath.Abs(dir)
	if err != nil {
		return false
	}

	for {
		if _, err := os.Stat(filepath.Join(abs, "go.mod")); err == nil {
			return true
		}
		parent := filepath.Dir(abs)
		if parent == abs {
			return false
		}
		abs = parent
	}
}
