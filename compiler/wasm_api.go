package compiler

import (
	"bytes"
	"fmt"
	"go/ast"
	"go/importer"
	"go/parser"
	"go/token"
	"go/types"
	"io"

	"golang.org/x/tools/go/packages"
)

// CompileSourceToTypeScript compiles Go source code directly to TypeScript.
// This is a WASM-friendly API that bypasses filesystem operations.
// It takes the source code as a string and returns the generated TypeScript.
func CompileSourceToTypeScript(source string, packageName string) (string, error) {
	if packageName == "" {
		packageName = "main"
	}

	// Create a new file set for position information
	fset := token.NewFileSet()

	// Parse the source code
	astFile, err := parser.ParseFile(fset, "main.go", source, parser.ParseComments)
	if err != nil {
		return "", fmt.Errorf("parse error: %w", err)
	}

	// Create type checker configuration with a custom importer
	var typeErrors []error
	conf := types.Config{
		Importer: &wasmImporter{
			defaultImporter: importer.Default(),
			cache:           make(map[string]*types.Package),
		},
		Error: func(err error) {
			// Collect errors but don't fail immediately
			typeErrors = append(typeErrors, err)
		},
	}

	// Type check the package
	info := &types.Info{
		Types:      make(map[ast.Expr]types.TypeAndValue),
		Defs:       make(map[*ast.Ident]types.Object),
		Uses:       make(map[*ast.Ident]types.Object),
		Implicits:  make(map[ast.Node]types.Object),
		Selections: make(map[*ast.SelectorExpr]*types.Selection),
		Scopes:     make(map[ast.Node]*types.Scope),
		Instances:  make(map[*ast.Ident]types.Instance),
	}

	pkg, _ := conf.Check(packageName, fset, []*ast.File{astFile}, info)
	// We continue even with type check errors for playground flexibility

	// Create a packages.Package compatible structure
	pkgData := &packages.Package{
		ID:              packageName,
		Name:            astFile.Name.Name,
		PkgPath:         packageName,
		Fset:            fset,
		Syntax:          []*ast.File{astFile},
		Types:           pkg,
		TypesInfo:       info,
		CompiledGoFiles: []string{"main.go"},
	}

	// Create an empty map for all packages (we only have one)
	allPackages := map[string]*packages.Package{
		packageName: pkgData,
	}

	// Perform package-level analysis
	packageAnalysis := AnalyzePackageImports(pkgData)
	analysis := AnalyzePackageFiles(pkgData, allPackages)

	// Create a buffer to capture the output
	var buf bytes.Buffer

	// Create the file compiler
	fileCompiler := &FileCompiler{
		compilerConfig:  &Config{},
		pkg:             pkgData,
		ast:             astFile,
		fullPath:        "main.go",
		Analysis:        analysis,
		PackageAnalysis: packageAnalysis,
	}

	// Compile to the buffer
	if err := fileCompiler.CompileToWriter(&buf); err != nil {
		return "", fmt.Errorf("compilation error: %w", err)
	}

	return buf.String(), nil
}

// CompileToWriter compiles the Go file and writes TypeScript to the given writer.
// This is used for WASM compilation where we don't want file I/O.
func (c *FileCompiler) CompileToWriter(w io.Writer) error {
	f := c.ast

	c.codeWriter = NewTSCodeWriter(w)

	// Pass analysis to compiler
	goWriter := NewGoToTSCompiler(c.codeWriter, c.pkg, c.Analysis, c.fullPath)

	// Add import for the goscript runtime using namespace import and alias
	c.codeWriter.WriteLinef("import * as $ from %q", "@goscript/builtin/index.js")

	c.codeWriter.WriteLine("") // Add a newline after imports

	if err := goWriter.WriteDecls(f.Decls); err != nil {
		return fmt.Errorf("failed to write declarations: %w", err)
	}

	return nil
}

// wasmImporter provides import resolution for WASM compilation.
// It wraps the default importer and provides stubs for common packages.
type wasmImporter struct {
	defaultImporter types.Importer
	cache           map[string]*types.Package
}

func (i *wasmImporter) Import(path string) (*types.Package, error) {
	if pkg, ok := i.cache[path]; ok {
		return pkg, nil
	}

	// Try the default importer first (works for stdlib packages)
	pkg, err := i.defaultImporter.Import(path)
	if err == nil {
		i.cache[path] = pkg
		return pkg, nil
	}

	// For unknown packages, create an empty stub package
	// This allows compilation to proceed even if dependencies aren't available
	stubPkg := types.NewPackage(path, pathToName(path))
	stubPkg.MarkComplete()
	i.cache[path] = stubPkg
	return stubPkg, nil
}

// pathToName extracts a package name from an import path
func pathToName(path string) string {
	// Find the last component of the path
	for i := len(path) - 1; i >= 0; i-- {
		if path[i] == '/' {
			return path[i+1:]
		}
	}
	return path
}
