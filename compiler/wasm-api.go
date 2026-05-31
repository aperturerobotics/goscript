package compiler

import (
	"context"
	"go/ast"
	"go/parser"
	"go/scanner"
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

	program, loweringDiagnostics := service.loweringOwner.Build(ctx, model, LoweringOptions{
		DisplayRoot: ".",
	})
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

	files, emitDiagnostics := service.emitterOwner.EmitToMemory(ctx, program)
	diagnostics = append(diagnostics, emitDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		return "", NewCompileError(diagnostics)
	}
	filePath := "@goscript/" + program.packages[0].pkgPath + "/" + program.packages[0].files[0].outputName
	output, ok := files[filePath]
	if !ok {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/wasm:missing-output",
			Message:  "browser source compilation did not emit the expected TypeScript file",
			Detail:   filePath,
		})
		return "", NewCompileError(diagnostics)
	}
	return output, nil
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
			Position: browserParseDiagnosticPosition(fset, err),
		}}
	}
	if len(file.Imports) != 0 {
		return nil, []Diagnostic{browserImportsUnsupportedDiagnostic(fset, file)}
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
			diag := Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/wasm:typecheck",
				Message:  "browser source compilation failed to type-check Go source",
				Detail:   err.Error(),
			}
			diag.Position = browserTypeCheckDiagnosticPosition(fset, err)
			typeDiagnostics = append(typeDiagnostics, diag)
		},
	}
	typedPkg, err := config.Check(pkgPath, fset, []*ast.File{file}, info)
	if err != nil {
		if len(typeDiagnostics) == 0 {
			diag := Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/wasm:typecheck",
				Message:  "browser source compilation failed to type-check Go source",
				Detail:   err.Error(),
			}
			diag.Position = browserTypeCheckDiagnosticPosition(fset, err)
			typeDiagnostics = append(typeDiagnostics, diag)
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

func browserImportsUnsupportedDiagnostic(fset *token.FileSet, file *ast.File) Diagnostic {
	imports := make([]string, 0, len(file.Imports))
	var importPos token.Pos
	for _, spec := range file.Imports {
		if !importPos.IsValid() {
			importPos = spec.Pos()
		}
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
		Position: browserTokenDiagnosticPosition(fset, importPos),
	}
}

func browserParseDiagnosticPosition(fset *token.FileSet, err error) *DiagnosticPosition {
	switch typed := err.(type) {
	case scanner.ErrorList:
		if len(typed) != 0 {
			return diagnosticPositionFromSource(sourcePosFromTokenPosition(typed[0].Pos), "")
		}
	case *scanner.ErrorList:
		if typed != nil && len(*typed) != 0 {
			return diagnosticPositionFromSource(sourcePosFromTokenPosition((*typed)[0].Pos), "")
		}
	case *scanner.Error:
		if typed != nil {
			return diagnosticPositionFromSource(sourcePosFromTokenPosition(typed.Pos), "")
		}
	}
	return browserTokenDiagnosticPosition(fset, token.NoPos)
}

func browserTypeCheckDiagnosticPosition(fset *token.FileSet, err error) *DiagnosticPosition {
	switch typed := err.(type) {
	case types.Error:
		return browserTokenDiagnosticPosition(fset, typed.Pos)
	case *types.Error:
		if typed != nil {
			return browserTokenDiagnosticPosition(fset, typed.Pos)
		}
	}
	return nil
}

func browserTokenDiagnosticPosition(fset *token.FileSet, pos token.Pos) *DiagnosticPosition {
	if fset == nil || !pos.IsValid() {
		return nil
	}
	return diagnosticPositionFromSource(sourcePosFromTokenPosition(fset.Position(pos)), "")
}
