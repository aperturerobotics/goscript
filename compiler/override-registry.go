package compiler

import (
	"context"
	"errors"
	"io"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"slices"
	"strings"

	gs "github.com/aperturerobotics/goscript"
	jsoniter "github.com/aperturerobotics/json-iterator-lite"
)

// OverrideMetadata describes compiler-visible facts from a package override.
type OverrideMetadata struct {
	// Dependencies are override package dependencies.
	Dependencies []string
	// AsyncMethods maps Type.Method keys to async status.
	AsyncMethods map[string]bool
}

// OverrideRegistryOwner owns GoScript override package metadata and copy plans.
type OverrideRegistryOwner struct {
	metadata         map[string]*OverrideMetadata
	packageRootCache map[string]bool
}

// NewOverrideRegistryOwner creates the override registry owner.
func NewOverrideRegistryOwner() *OverrideRegistryOwner {
	return &OverrideRegistryOwner{
		metadata: make(map[string]*OverrideMetadata),
	}
}

// Metadata returns compiler-visible override metadata for a package path.
func (o *OverrideRegistryOwner) Metadata(pkgPath string) (*OverrideMetadata, error) {
	if o == nil {
		o = NewOverrideRegistryOwner()
	}
	if metadata := o.metadata[pkgPath]; metadata != nil {
		return metadata, nil
	}

	metadata := &OverrideMetadata{
		AsyncMethods: make(map[string]bool),
	}
	data, err := gs.GsOverrides.ReadFile("gs/" + pkgPath + "/meta.json")
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			o.metadata[pkgPath] = metadata
			return metadata, nil
		}
		return nil, err
	}

	iter := jsoniter.ParseBytes(data)
	for field := iter.ReadObject(); field != ""; field = iter.ReadObject() {
		switch field {
		case "dependencies":
			for iter.ReadArray() {
				metadata.Dependencies = append(metadata.Dependencies, iter.ReadString())
			}
		case "asyncMethods":
			for method := iter.ReadObject(); method != ""; method = iter.ReadObject() {
				metadata.AsyncMethods[method] = iter.ReadBool()
			}
		default:
			iter.Skip()
		}
	}
	if iter.Error != nil && !errors.Is(iter.Error, io.EOF) {
		return nil, iter.Error
	}

	o.metadata[pkgPath] = metadata
	return metadata, nil
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
	if _, err := o.packageRoots(); err != nil {
		return nil, []Diagnostic{overrideError("discover override packages", "", err)}
	}

	var diagnostics []Diagnostic
	visiting := make(map[string]bool)
	visited := make(map[string]bool)
	diagnostics = append(diagnostics, o.addPackageToPlan(ctx, plan, "builtin", visiting, visited)...)
	for _, node := range graph.Nodes {
		if node.OverrideCandidate {
			diagnostics = append(diagnostics, o.addPackageToPlan(ctx, plan, node.PkgPath, visiting, visited)...)
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
	metadata, err := o.Metadata(pkgPath)
	if err != nil {
		return false, err
	}
	return metadata.AsyncMethods[method], nil
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

	pkg, dependencies, diagnostics := o.loadCopyPackage(pkgPath)
	if diagnosticsHaveErrors(diagnostics) {
		return diagnostics
	}
	visiting[pkgPath] = true
	for _, dependency := range dependencies {
		diagnostics = append(diagnostics, o.addPackageToPlan(ctx, plan, dependency, visiting, visited)...)
	}
	delete(visiting, pkgPath)
	if diagnosticsHaveErrors(diagnostics) {
		return diagnostics
	}

	visited[pkgPath] = true
	plan.packages = append(plan.packages, pkg)
	return diagnostics
}

func (o *OverrideRegistryOwner) loadCopyPackage(pkgPath string) (overrideCopyPackage, []string, []Diagnostic) {
	roots, err := o.packageRoots()
	if err != nil {
		return overrideCopyPackage{}, nil, []Diagnostic{overrideError("discover override packages", "", err)}
	}
	if !roots[pkgPath] {
		return overrideCopyPackage{}, nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:missing-package",
			Message:  "override package does not exist",
			Detail:   pkgPath,
		}}
	}

	metadata, err := o.Metadata(pkgPath)
	if err != nil {
		return overrideCopyPackage{}, nil, []Diagnostic{overrideError("read override metadata", pkgPath, err)}
	}

	copyPackage := overrideCopyPackage{path: pkgPath}
	dependencySet := make(map[string]bool)
	for _, dependency := range metadata.Dependencies {
		dependency = strings.TrimSpace(dependency)
		if dependency != "" && dependency != pkgPath {
			dependencySet[dependency] = true
		}
	}

	root := "gs/" + pkgPath
	err = fs.WalkDir(gs.GsOverrides, root, func(filePath string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			nestedPkg := strings.TrimPrefix(filePath, "gs/")
			if nestedPkg != pkgPath && roots[nestedPkg] {
				return fs.SkipDir
			}
			return nil
		}
		if !isOverrideSourceFile(filePath) {
			return nil
		}
		data, readErr := gs.GsOverrides.ReadFile(filePath)
		if readErr != nil {
			return readErr
		}
		rel := strings.TrimPrefix(filePath, "gs/")
		copyPackage.files = append(copyPackage.files, overrideCopyFile{
			path: rel,
			data: data,
		})
		for _, imported := range scanOverrideImports(string(data)) {
			dependency, ok := o.importPackageRoot(imported)
			if ok && dependency != "builtin" && dependency != pkgPath {
				dependencySet[dependency] = true
			}
		}
		return nil
	})
	if err != nil {
		return overrideCopyPackage{}, nil, []Diagnostic{overrideError("read override package", pkgPath, err)}
	}

	if len(copyPackage.files) == 0 {
		return overrideCopyPackage{}, nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:empty-package",
			Message:  "override package does not contain TypeScript source files",
			Detail:   pkgPath,
		}}
	}
	slices.SortFunc(copyPackage.files, func(a, b overrideCopyFile) int {
		return strings.Compare(a.path, b.path)
	})

	dependencies := make([]string, 0, len(dependencySet))
	for dependency := range dependencySet {
		dependencies = append(dependencies, dependency)
	}
	slices.Sort(dependencies)
	return copyPackage, dependencies, nil
}

func (o *OverrideRegistryOwner) packageRoots() (map[string]bool, error) {
	if o.packageRootCache != nil {
		return o.packageRootCache, nil
	}
	roots := make(map[string]bool)
	if err := fs.WalkDir(gs.GsOverrides, "gs", func(filePath string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() || path.Base(filePath) != "index.ts" {
			return nil
		}
		pkgPath := strings.TrimPrefix(path.Dir(filePath), "gs/")
		if pkgPath != "." && pkgPath != "" {
			roots[pkgPath] = true
		}
		return nil
	}); err != nil {
		return nil, err
	}
	o.packageRootCache = roots
	return roots, nil
}

func (o *OverrideRegistryOwner) importPackageRoot(importPath string) (string, bool) {
	roots, err := o.packageRoots()
	if err != nil {
		return "", false
	}
	importPath = strings.TrimPrefix(importPath, "@goscript/")
	importPath = strings.TrimSuffix(importPath, ".js")
	importPath = strings.TrimSuffix(importPath, ".ts")
	if before, ok := strings.CutSuffix(importPath, "/index"); ok {
		importPath = before
	}
	parts := strings.Split(importPath, "/")
	for idx := len(parts); idx > 0; idx-- {
		candidate := strings.Join(parts[:idx], "/")
		if roots[candidate] {
			return candidate, true
		}
	}
	return "", false
}

func (o *OverrideRegistryOwner) hasPackage(pkgPath string) bool {
	roots, err := o.packageRoots()
	return err == nil && roots[pkgPath]
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
