package compiler

import "golang.org/x/tools/go/packages"

// PackageTestGraphVariant describes one Go test package variant.
type PackageTestGraphVariant struct {
	// ID is the go/packages package identity.
	ID string
	// PkgPath is the stable Go package path for this variant.
	PkgPath string
	// Name is the Go package name for this variant.
	Name string
	// ForTest is the package path this variant tests.
	ForTest string
	// GoFiles are the package source files.
	GoFiles []string
	// CompiledGoFiles are files selected by build constraints.
	CompiledGoFiles []string
	// Diagnostics are load diagnostics attached to this variant.
	Diagnostics []Diagnostic
}

func newPackageTestGraphVariant(pkg *packages.Package, diagnostics []Diagnostic) *PackageTestGraphVariant {
	return &PackageTestGraphVariant{
		ID:              pkg.ID,
		PkgPath:         packagePath(pkg),
		Name:            pkg.Name,
		ForTest:         pkg.ForTest,
		GoFiles:         append([]string(nil), pkg.GoFiles...),
		CompiledGoFiles: append([]string(nil), pkg.CompiledGoFiles...),
		Diagnostics:     append([]Diagnostic(nil), diagnostics...),
	}
}
