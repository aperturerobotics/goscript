package compiler

import (
	"go/ast"
	"go/types"
	"slices"
	"strings"
	"unicode"

	"golang.org/x/tools/go/packages"
)

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
	// Imports are packages imported directly by this test variant.
	Imports []string
	// Diagnostics are load diagnostics attached to this variant.
	Diagnostics []Diagnostic
	// Tests are ordinary TestXxx functions discovered in this variant.
	Tests []PackageTestFunction
}

func newPackageTestGraphVariant(pkg *packages.Package, diagnostics []Diagnostic) *PackageTestGraphVariant {
	imports := make([]string, 0, len(pkg.Imports))
	for importPath := range pkg.Imports {
		imports = append(imports, importPath)
	}
	slices.Sort(imports)
	return &PackageTestGraphVariant{
		ID:              pkg.ID,
		PkgPath:         packagePath(pkg),
		Name:            pkg.Name,
		ForTest:         pkg.ForTest,
		GoFiles:         append([]string(nil), pkg.GoFiles...),
		CompiledGoFiles: append([]string(nil), pkg.CompiledGoFiles...),
		Imports:         imports,
		Diagnostics:     append([]Diagnostic(nil), diagnostics...),
		Tests:           discoverPackageTestFunctions(pkg),
	}
}

func discoverPackageTestFunctions(pkg *packages.Package) []PackageTestFunction {
	if pkg == nil {
		return nil
	}
	var tests []PackageTestFunction
	for _, file := range pkg.Syntax {
		for _, decl := range file.Decls {
			fn, ok := decl.(*ast.FuncDecl)
			if !ok || fn.Recv != nil || !isTestName(fn.Name.Name) {
				continue
			}
			obj, _ := pkg.TypesInfo.Defs[fn.Name].(*types.Func)
			if !isOrdinaryTestFunc(obj) {
				continue
			}
			tests = append(tests, PackageTestFunction{
				Name:        fn.Name.Name,
				PackagePath: packagePath(pkg),
			})
		}
	}
	return tests
}

func isOrdinaryTestFunc(fn *types.Func) bool {
	if fn == nil {
		return false
	}
	sig, _ := fn.Type().(*types.Signature)
	if sig == nil || sig.Params().Len() != 1 || sig.Results().Len() != 0 {
		return false
	}
	ptr, _ := sig.Params().At(0).Type().(*types.Pointer)
	if ptr == nil {
		return false
	}
	named, _ := ptr.Elem().(*types.Named)
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return false
	}
	return named.Obj().Name() == "T" && named.Obj().Pkg().Path() == "testing"
}

func isTestName(name string) bool {
	if !strings.HasPrefix(name, "Test") || name == "Test" {
		return false
	}
	for _, r := range strings.TrimPrefix(name, "Test") {
		return !unicode.IsLower(r)
	}
	return false
}
