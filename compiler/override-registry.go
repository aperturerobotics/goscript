package compiler

import (
	"context"
	"os"
	"path/filepath"
	"slices"
	"strings"
)

// OverrideMetadata describes compiler-visible facts from a package override.
type OverrideMetadata struct {
	// Dependencies are override package dependencies.
	Dependencies []string
	// AsyncFunctions maps package-level function names to async status.
	AsyncFunctions map[string]bool
	// AsyncMethods maps Type.Method keys to async status.
	AsyncMethods map[string]bool
}

// OverrideRegistryOwner owns GoScript override package metadata and copy plans.
type OverrideRegistryOwner struct {
	overrideDirs []string
	facts        *OverrideFacts
}

// NewOverrideRegistryOwner creates the override registry owner.
func NewOverrideRegistryOwner(overrideDirs ...string) *OverrideRegistryOwner {
	return &OverrideRegistryOwner{overrideDirs: slices.Clone(overrideDirs)}
}

// Facts returns the immutable compiler-visible override facts.
func (o *OverrideRegistryOwner) Facts(ctx context.Context) (*OverrideFacts, []Diagnostic) {
	if o == nil {
		o = NewOverrideRegistryOwner()
	}
	if o.facts != nil {
		return o.facts, nil
	}
	facts, diagnostics := buildOverrideFacts(ctx, o.overrideDirs)
	if diagnosticsHaveErrors(diagnostics) {
		return facts, diagnostics
	}
	o.facts = facts
	return facts, diagnostics
}

// Metadata returns compiler-visible override metadata for a package path.
func (o *OverrideRegistryOwner) Metadata(pkgPath string) (*OverrideMetadata, error) {
	facts, diagnostics := o.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		return nil, NewCompileError(diagnostics)
	}
	metadata := facts.Metadata(pkgPath)
	return &metadata, nil
}

// CopyPlan builds the ordered override package copy plan for a request.
func (o *OverrideRegistryOwner) CopyPlan(
	ctx context.Context,
	req *CompileRequest,
	graph *PackageGraph,
) (*overrideCopyPlan, []Diagnostic) {
	if o == nil {
		o = NewOverrideRegistryOwner()
	}
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	plan := &overrideCopyPlan{}
	if req == nil || req.RuntimeEmissionMode == RuntimeEmissionModeReference {
		return plan, nil
	}
	if graph == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:no-graph",
			Message:  "override copy planning requires a package graph",
		}}
	}
	facts, diagnostics := o.Facts(ctx)
	if diagnosticsHaveErrors(diagnostics) {
		return nil, diagnostics
	}

	visiting := make(map[string]bool)
	visited := make(map[string]bool)
	diagnostics = append(diagnostics, o.addPackageToPlan(ctx, facts, plan, "builtin", visiting, visited)...)
	for _, node := range graph.Nodes {
		if node.OverrideCandidate {
			diagnostics = append(diagnostics, o.addPackageToPlan(ctx, facts, plan, node.PkgPath, visiting, visited)...)
		}
	}
	if diagnosticsHaveErrors(diagnostics) {
		return nil, diagnostics
	}
	return plan, diagnostics
}

// CopyPackages writes override packages from a copy plan to the request output tree.
func (o *OverrideRegistryOwner) CopyPackages(
	ctx context.Context,
	req *CompileRequest,
	plan *overrideCopyPlan,
) ([]string, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if req == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:no-request",
			Message:  "override package copying requires a compile request",
		}}
	}
	if plan == nil || len(plan.packages) == 0 {
		return nil, nil
	}

	var copied []string
	var diagnostics []Diagnostic
	for _, pkg := range plan.packages {
		if err := ctx.Err(); err != nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/context:canceled",
				Message:  err.Error(),
			})
			break
		}
		for _, file := range pkg.files {
			dest := filepath.Join(req.OutputPath, "@goscript", filepath.FromSlash(file.path))
			if err := os.MkdirAll(filepath.Dir(dest), 0o755); err != nil {
				diagnostics = append(diagnostics, overrideError("create override output", file.path, err))
				continue
			}
			if err := os.WriteFile(dest, file.data, 0o644); err != nil {
				diagnostics = append(diagnostics, overrideError("write override file", file.path, err))
			}
		}
		copied = append(copied, pkg.path)
	}
	if diagnosticsHaveErrors(diagnostics) {
		return copied, diagnostics
	}
	return copied, diagnostics
}

// IsMethodAsync returns true when override metadata marks a method async.
func (o *OverrideRegistryOwner) IsMethodAsync(pkgPath, method string) (bool, error) {
	facts, diagnostics := o.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		return false, NewCompileError(diagnostics)
	}
	return facts.IsMethodAsync(pkgPath, method), nil
}

// IsFunctionAsync returns true when override metadata marks a package-level function async.
func (o *OverrideRegistryOwner) IsFunctionAsync(pkgPath, function string) (bool, error) {
	facts, diagnostics := o.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		return false, NewCompileError(diagnostics)
	}
	return facts.IsFunctionAsync(pkgPath, function), nil
}

type overrideCopyPlan struct {
	packages []overrideCopyPackage
}

type overrideCopyPackage struct {
	path  string
	files []overrideCopyFile
}

type overrideCopyFile struct {
	path string
	data []byte
}

func (o *OverrideRegistryOwner) addPackageToPlan(
	ctx context.Context,
	facts *OverrideFacts,
	plan *overrideCopyPlan,
	pkgPath string,
	visiting map[string]bool,
	visited map[string]bool,
) []Diagnostic {
	if err := ctx.Err(); err != nil {
		return []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if visited[pkgPath] {
		return nil
	}
	if visiting[pkgPath] {
		return []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:dependency-cycle",
			Message:  "override package dependencies contain a cycle",
			Detail:   pkgPath,
		}}
	}

	pkg, dependencies, ok := facts.copyPackage(pkgPath)
	if !ok {
		return []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:missing-package",
			Message:  "override package does not exist",
			Detail:   pkgPath,
		}}
	}
	visiting[pkgPath] = true
	var diagnostics []Diagnostic
	for _, dependency := range dependencies {
		diagnostics = append(diagnostics, o.addPackageToPlan(ctx, facts, plan, dependency, visiting, visited)...)
	}
	delete(visiting, pkgPath)
	if diagnosticsHaveErrors(diagnostics) {
		return diagnostics
	}

	visited[pkgPath] = true
	plan.packages = append(plan.packages, pkg)
	return diagnostics
}

func isOverrideSourceFile(filePath string) bool {
	return strings.HasSuffix(filePath, ".ts") && !strings.HasSuffix(filePath, ".test.ts")
}

func scanOverrideImports(data string) []string {
	imports := make(map[string]bool)
	for line := range strings.SplitSeq(data, "\n") {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "//") {
			continue
		}
		for _, quote := range []string{"\"", "'"} {
			prefix := quote + "@goscript/"
			remaining := line
			for {
				idx := strings.Index(remaining, prefix)
				if idx < 0 {
					break
				}
				remaining = remaining[idx+len(quote):]
				end := strings.Index(remaining, quote)
				if end < 0 {
					break
				}
				imports[remaining[:end]] = true
				remaining = remaining[end+len(quote):]
			}
		}
	}
	result := make([]string, 0, len(imports))
	for imported := range imports {
		result = append(result, imported)
	}
	slices.Sort(result)
	return result
}

func overrideError(action, detail string, err error) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/overrides:io",
		Message:  "failed to " + action,
		Detail:   strings.TrimSpace(detail + " " + err.Error()),
	}
}
