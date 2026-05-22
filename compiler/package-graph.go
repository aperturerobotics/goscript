package compiler

import (
	"context"
	"os"
	"slices"
	"strings"

	"golang.org/x/tools/go/packages"
)

// PackageGraph is the immutable package graph produced for a compile request.
type PackageGraph struct {
	// RequestedPatterns are the package patterns from the compile request.
	RequestedPatterns []string
	// RequestedPackagePaths are the loaded package paths for requested patterns.
	RequestedPackagePaths []string
	// Nodes are the deterministic package graph nodes.
	Nodes []*PackageGraphNode
	// NodesByPackagePath maps package path to graph node.
	NodesByPackagePath map[string]*PackageGraphNode

	packagesByPath map[string]*packages.Package
}

// PackageGraphNode is one package in the loaded graph.
type PackageGraphNode struct {
	// ID is the go/packages package identity.
	ID string
	// PkgPath is the stable Go package path.
	PkgPath string
	// Name is the Go package name.
	Name string
	// ModulePath is the owning module path when known.
	ModulePath string
	// ModuleDir is the owning module directory when known.
	ModuleDir string
	// ForTest is the package path under test for Go test variants.
	ForTest string
	// GoFiles are the package source files.
	GoFiles []string
	// CompiledGoFiles are files selected by build constraints.
	CompiledGoFiles []string
	// Imports are imported package paths.
	Imports []string
	// Requested marks packages matched by request patterns.
	Requested bool
	// OverrideCandidate marks packages with a matching GoScript override package.
	OverrideCandidate bool
}

// PackageGraphOwner owns Go package loading and graph identity.
type PackageGraphOwner struct {
	overrideOwner *OverrideRegistryOwner
}

// NewPackageGraphOwner creates the package graph owner.
func NewPackageGraphOwner(overrideOwners ...*OverrideRegistryOwner) *PackageGraphOwner {
	overrideOwner := NewOverrideRegistryOwner()
	if len(overrideOwners) != 0 && overrideOwners[0] != nil {
		overrideOwner = overrideOwners[0]
	}
	return &PackageGraphOwner{overrideOwner: overrideOwner}
}

// Load builds the package graph for a validated request.
func (o *PackageGraphOwner) Load(ctx context.Context, req *CompileRequest) (*PackageGraph, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}

	cfg := &packages.Config{
		Context:    ctx,
		Dir:        req.Dir,
		Env:        append(os.Environ(), "GOOS=js", "GOARCH=wasm"),
		BuildFlags: goScriptBuildFlags(req.BuildFlags),
		Tests:      req.Tests,
		Mode: packages.NeedName |
			packages.NeedFiles |
			packages.NeedCompiledGoFiles |
			packages.NeedImports |
			packages.NeedDeps |
			packages.NeedExportFile |
			packages.NeedTypes |
			packages.NeedSyntax |
			packages.NeedTypesInfo |
			packages.NeedTypesSizes |
			packages.NeedForTest |
			packages.NeedModule,
	}
	pkgs, err := packages.Load(cfg, req.Patterns...)
	if err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:load",
			Message:  "failed to load Go packages",
			Detail:   err.Error(),
		}}
	}
	if len(pkgs) == 0 {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:no-packages",
			Message:  "package patterns did not match any packages",
		}}
	}
	overrideFacts, overrideDiagnostics := o.overrideOwner.Facts(ctx)
	if diagnosticsHaveErrors(overrideDiagnostics) {
		return nil, overrideDiagnostics
	}

	graph := &PackageGraph{
		RequestedPatterns:     append([]string(nil), req.Patterns...),
		NodesByPackagePath:    make(map[string]*PackageGraphNode),
		packagesByPath:        make(map[string]*packages.Package),
		RequestedPackagePaths: make([]string, 0, len(pkgs)),
	}

	requested := make(map[string]bool)
	for _, pkg := range pkgs {
		if isTestMainPackage(pkg) {
			continue
		}
		path := packagePath(pkg)
		requested[path] = true
		graph.RequestedPackagePaths = append(graph.RequestedPackagePaths, path)
	}
	slices.Sort(graph.RequestedPackagePaths)

	var diagnostics []Diagnostic
	seen := make(map[string]bool)
	for _, pkg := range pkgs {
		if isTestMainPackage(pkg) {
			continue
		}
		o.collect(graph, pkg, req.DependencyMode, requested, overrideFacts, seen)
		diagnostics = append(diagnostics, packageDiagnostics(pkg)...)
	}
	slices.SortFunc(graph.Nodes, func(a, b *PackageGraphNode) int {
		if a.PkgPath == b.PkgPath {
			return strings.Compare(a.ID, b.ID)
		}
		return strings.Compare(a.PkgPath, b.PkgPath)
	})
	if len(graph.Nodes) == 0 {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:no-nodes",
			Message:  "package graph did not contain any package nodes",
		})
	}
	return graph, diagnostics
}

func (o *PackageGraphOwner) collect(
	graph *PackageGraph,
	pkg *packages.Package,
	mode DependencyMode,
	requested map[string]bool,
	overrideFacts *OverrideFacts,
	seen map[string]bool,
) {
	if pkg == nil || seen[pkg.ID] {
		return
	}
	if pkg.ForTest != "" && !requested[pkg.ForTest] {
		if prod := pkg.Imports[pkg.ForTest]; prod != nil {
			o.collect(graph, prod, mode, requested, overrideFacts, seen)
		}
		return
	}
	seen[pkg.ID] = true

	path := packagePath(pkg)
	node := newPackageGraphNode(pkg, requested[path], overrideFacts)
	graph.Nodes = append(graph.Nodes, node)
	graph.NodesByPackagePath[path] = node
	graph.packagesByPath[path] = pkg

	if mode != DependencyModeAll || node.OverrideCandidate {
		return
	}
	imports := make([]string, 0, len(pkg.Imports))
	for importPath := range pkg.Imports {
		imports = append(imports, importPath)
	}
	slices.Sort(imports)
	for _, importPath := range imports {
		o.collect(graph, pkg.Imports[importPath], mode, requested, overrideFacts, seen)
	}
}

func newPackageGraphNode(pkg *packages.Package, requested bool, overrideFacts *OverrideFacts) *PackageGraphNode {
	imports := make([]string, 0, len(pkg.Imports))
	for importPath := range pkg.Imports {
		imports = append(imports, importPath)
	}
	slices.Sort(imports)

	var modulePath string
	var moduleDir string
	if pkg.Module != nil {
		modulePath = pkg.Module.Path
		moduleDir = pkg.Module.Dir
	}

	return &PackageGraphNode{
		ID:                pkg.ID,
		PkgPath:           packagePath(pkg),
		Name:              pkg.Name,
		ModulePath:        modulePath,
		ModuleDir:         moduleDir,
		ForTest:           pkg.ForTest,
		GoFiles:           append([]string(nil), pkg.GoFiles...),
		CompiledGoFiles:   append([]string(nil), pkg.CompiledGoFiles...),
		Imports:           imports,
		Requested:         requested,
		OverrideCandidate: overrideFacts.HasPackage(packagePath(pkg)),
	}
}

func isTestMainPackage(pkg *packages.Package) bool {
	return pkg != nil && pkg.ForTest == "" && pkg.Name == "main" && strings.HasSuffix(packagePath(pkg), ".test")
}

func packagePath(pkg *packages.Package) string {
	if pkg == nil {
		return ""
	}
	if pkg.PkgPath != "" {
		return pkg.PkgPath
	}
	return pkg.ID
}

func packageDiagnostics(pkg *packages.Package) []Diagnostic {
	if pkg == nil || len(pkg.Errors) == 0 {
		return nil
	}
	diagnostics := make([]Diagnostic, 0, len(pkg.Errors))
	for _, pkgErr := range pkg.Errors {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:load-error",
			Message:  "Go package contains load errors",
			Detail:   pkgErr.Msg,
		})
	}
	return diagnostics
}
