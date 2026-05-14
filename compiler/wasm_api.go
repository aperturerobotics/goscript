package compiler

import (
	"context"
	"go/ast"
	"go/parser"
	"go/token"
	"go/types"
	"strconv"
	"strings"

	"golang.org/x/tools/go/packages"
)

const browserSourceFileName = "main.go"

// CompileSourceToTypeScript is the WASM adapter for browser source compilation.
func CompileSourceToTypeScript(source string, packageName string) (string, error) {
	graph, diagnostics := browserSourceGraph(source, packageName)
	if diagnosticsHaveErrors(diagnostics) {
		return "", NewCompileError(diagnostics)
	}

	ctx := context.Background()
	service := NewCompileService()
	model, modelDiagnostics := service.semanticOwner.Build(ctx, graph)
	diagnostics = append(diagnostics, modelDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		return "", NewCompileError(diagnostics)
	}

	program, loweringDiagnostics := service.loweringOwner.Build(ctx, model)
	diagnostics = append(diagnostics, loweringDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		return "", NewCompileError(diagnostics)
	}
	if program == nil || len(program.packages) != 1 || len(program.packages[0].files) != 1 {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/wasm:invalid-output",
			Message:  "browser source compilation produced an invalid output shape",
		})
		return "", NewCompileError(diagnostics)
	}

	return service.emitterOwner.renderLoweredFile(program.packages[0], program.packages[0].files[0]), nil
}

func browserSourceGraph(source string, packageName string) (*PackageGraph, []Diagnostic) {
	if strings.TrimSpace(source) == "" {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/wasm:empty-source",
			Message:  "browser source compilation requires Go source code",
		}}
	}

	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, browserSourceFileName, source, parser.ParseComments)
	if err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/wasm:parse",
			Message:  "browser source compilation failed to parse Go source",
			Detail:   err.Error(),
		}}
	}
	if len(file.Imports) != 0 {
		return nil, []Diagnostic{browserImportsUnsupportedDiagnostic(file)}
	}

	pkgPath := strings.TrimSpace(packageName)
	if pkgPath == "" {
		pkgPath = file.Name.Name
	}
	info := &types.Info{
		Types:      make(map[ast.Expr]types.TypeAndValue),
		Defs:       make(map[*ast.Ident]types.Object),
		Uses:       make(map[*ast.Ident]types.Object),
		Implicits:  make(map[ast.Node]types.Object),
		Selections: make(map[*ast.SelectorExpr]*types.Selection),
		Scopes:     make(map[ast.Node]*types.Scope),
	}
	sizes := types.SizesFor("gc", "wasm")
	if sizes == nil {
		sizes = types.SizesFor("gc", "amd64")
	}

	var typeDiagnostics []Diagnostic
	config := types.Config{
		Sizes: sizes,
		Error: func(err error) {
			typeDiagnostics = append(typeDiagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/wasm:typecheck",
				Message:  "browser source compilation failed to type-check Go source",
				Detail:   err.Error(),
			})
		},
	}
	typedPkg, err := config.Check(pkgPath, fset, []*ast.File{file}, info)
	if err != nil {
		if len(typeDiagnostics) == 0 {
			typeDiagnostics = append(typeDiagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/wasm:typecheck",
				Message:  "browser source compilation failed to type-check Go source",
				Detail:   err.Error(),
			})
		}
		return nil, typeDiagnostics
	}

	node := &PackageGraphNode{
		ID:              pkgPath,
		PkgPath:         pkgPath,
		Name:            file.Name.Name,
		GoFiles:         []string{browserSourceFileName},
		CompiledGoFiles: []string{browserSourceFileName},
		Requested:       true,
	}
	pkg := &packages.Package{
		ID:              pkgPath,
		Name:            file.Name.Name,
		PkgPath:         pkgPath,
		GoFiles:         []string{browserSourceFileName},
		CompiledGoFiles: []string{browserSourceFileName},
		Imports:         make(map[string]*packages.Package),
		Types:           typedPkg,
		Fset:            fset,
		Syntax:          []*ast.File{file},
		TypesInfo:       info,
		TypesSizes:      sizes,
	}
	return &PackageGraph{
		RequestedPatterns:     []string{pkgPath},
		RequestedPackagePaths: []string{pkgPath},
		Nodes:                 []*PackageGraphNode{node},
		NodesByPackagePath: map[string]*PackageGraphNode{
			pkgPath: node,
		},
		packagesByPath: map[string]*packages.Package{
			pkgPath: pkg,
		},
	}, nil
}

func browserImportsUnsupportedDiagnostic(file *ast.File) Diagnostic {
	imports := make([]string, 0, len(file.Imports))
	for _, spec := range file.Imports {
		importPath := spec.Path.Value
		if unquoted, err := strconv.Unquote(importPath); err == nil {
			importPath = unquoted
		}
		imports = append(imports, importPath)
	}
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/wasm:imports-unsupported",
		Message:  "browser source compilation does not support imports yet",
		Detail:   "Use goscript compile --package . from inside a Go module for imported packages. Imports: " + strings.Join(imports, ", "),
	}
}
