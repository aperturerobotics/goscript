package compiler

import (
	"go/ast"
	"slices"
	"strconv"
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
		testingAliases := fileTestingAliases(file)
		for _, decl := range file.Decls {
			fn, _ := decl.(*ast.FuncDecl)
			if !isOrdinaryTestFuncDecl(fn, testingAliases) {
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

func isOrdinaryTestFuncDecl(fn *ast.FuncDecl, testingAliases map[string]bool) bool {
	if fn == nil || fn.Recv != nil || !isTestName(fn.Name.Name) || fn.Type == nil {
		return false
	}
	if fn.Type.Results != nil && len(fn.Type.Results.List) != 0 {
		return false
	}
	if fn.Type.Params == nil || len(fn.Type.Params.List) != 1 {
		return false
	}
	param := fn.Type.Params.List[0]
	if len(param.Names) > 1 {
		return false
	}
	ptr, ok := param.Type.(*ast.StarExpr)
	return ok && isTestingT(ptr.X, testingAliases)
}

func fileTestingAliases(file *ast.File) map[string]bool {
	aliases := make(map[string]bool)
	for _, imp := range file.Imports {
		path, err := strconv.Unquote(imp.Path.Value)
		if err != nil || path != "testing" {
			continue
		}
		name := "testing"
		if imp.Name != nil {
			name = imp.Name.Name
		}
		aliases[name] = true
	}
	return aliases
}

func isTestingT(expr ast.Expr, aliases map[string]bool) bool {
	switch typed := expr.(type) {
	case *ast.SelectorExpr:
		base, _ := typed.X.(*ast.Ident)
		return base != nil && aliases[base.Name] && typed.Sel.Name == "T"
	case *ast.Ident:
		return aliases["."] && typed.Name == "T"
	default:
		return false
	}
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
