package compiler

import (
	"context"
	"os"
	"slices"
	"strings"

	"golang.org/x/tools/go/packages"
)

// PackageTestGraph is the package-scoped graph used by GoScript test runners.
type PackageTestGraph struct {
	// RequestedPatterns are the package patterns from the compile request.
	RequestedPatterns []string
	// Packages are deterministic package-test facts keyed by package under test.
	Packages []*PackageTestGraphPackage

	packagesByPath map[string]*PackageTestGraphPackage
}

// PackageByPath returns the package facts for a package under test.
func (g *PackageTestGraph) PackageByPath(path string) *PackageTestGraphPackage {
	if g == nil {
		return nil
	}
	return g.packagesByPath[path]
}

// LoadTestGraph builds package-scoped test graph facts for a validated request.
func (o *PackageGraphOwner) LoadTestGraph(ctx context.Context, req *CompileRequest) (*PackageTestGraph, []Diagnostic) {
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
		Tests:      true,
		Mode: packages.NeedName |
			packages.NeedFiles |
			packages.NeedCompiledGoFiles |
			packages.NeedImports |
			packages.NeedDeps |
			packages.NeedTypes |
			packages.NeedTypesSizes |
			packages.NeedSyntax |
			packages.NeedForTest |
			packages.NeedModule,
	}
	pkgs, err := packages.Load(cfg, req.Patterns...)
	if err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:load",
			Message:  "failed to load Go test packages",
			Detail:   err.Error(),
		}}
	}

	graph := &PackageTestGraph{
		RequestedPatterns: append([]string(nil), req.Patterns...),
		packagesByPath:    make(map[string]*PackageTestGraphPackage),
	}
	var diagnostics []Diagnostic
	for _, pkg := range pkgs {
		if pkg == nil || isTestMainPackage(pkg) {
			continue
		}
		pkgDiagnostics := packageDiagnostics(pkg)
		diagnostics = append(diagnostics, pkgDiagnostics...)
		if pkg.ForTest == "" {
			facts := graph.packageFacts(packagePath(pkg))
			facts.setPackage(pkg)
			facts.appendDiagnostics(pkgDiagnostics)
			continue
		}
		facts := graph.packageFacts(pkg.ForTest)
		variant := newPackageTestGraphVariant(pkg, pkgDiagnostics)
		if strings.HasSuffix(pkg.Name, "_test") {
			facts.ExternalPackageTests = variant
		} else {
			facts.SamePackageTests = variant
		}
		facts.appendDiagnostics(pkgDiagnostics)
	}
	if len(graph.Packages) == 0 {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:no-test-packages",
			Message:  "package patterns did not match any test packages",
		})
	}
	slices.SortFunc(graph.Packages, func(a, b *PackageTestGraphPackage) int {
		return strings.Compare(a.PackagePath, b.PackagePath)
	})
	return graph, diagnostics
}

func (g *PackageTestGraph) packageFacts(path string) *PackageTestGraphPackage {
	facts := g.packagesByPath[path]
	if facts != nil {
		return facts
	}
	facts = &PackageTestGraphPackage{PackagePath: path}
	g.packagesByPath[path] = facts
	g.Packages = append(g.Packages, facts)
	return facts
}
