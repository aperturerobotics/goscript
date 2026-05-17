package compiler

import "golang.org/x/tools/go/packages"

// PackageTestGraphPackage describes one requested package under test.
type PackageTestGraphPackage struct {
	// PackagePath is the package under test.
	PackagePath string
	// PackageName is the base package name.
	PackageName string
	// PackageID is the go/packages package identity for the package under test.
	PackageID string
	// GoFiles are the package source files.
	GoFiles []string
	// CompiledGoFiles are files selected by build constraints.
	CompiledGoFiles []string
	// SamePackageTests is the same-package test variant when present.
	SamePackageTests *PackageTestGraphVariant
	// ExternalPackageTests is the external-package test variant when present.
	ExternalPackageTests *PackageTestGraphVariant
	// Diagnostics are package or variant load diagnostics attached to this package.
	Diagnostics []Diagnostic
}

// HasTests returns true when the package has any loaded test variant.
func (p *PackageTestGraphPackage) HasTests() bool {
	return p != nil && (p.SamePackageTests != nil || p.ExternalPackageTests != nil)
}

func (p *PackageTestGraphPackage) appendDiagnostics(diagnostics []Diagnostic) {
	p.Diagnostics = append(p.Diagnostics, diagnostics...)
}

func (p *PackageTestGraphPackage) setPackage(pkg *packages.Package) {
	p.PackagePath = packagePath(pkg)
	p.PackageName = pkg.Name
	p.PackageID = pkg.ID
	p.GoFiles = append([]string(nil), pkg.GoFiles...)
	p.CompiledGoFiles = append([]string(nil), pkg.CompiledGoFiles...)
}
