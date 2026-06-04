package compiler

import (
	"cmp"
	"context"
	"fmt"
	"go/ast"
	"go/constant"
	"go/token"
	"go/types"
	"maps"
	"os"
	"path"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"unicode/utf8"
)

// LoweringOwner owns conversion from the semantic model to compiler IR.
type LoweringOwner struct {
	runtimeOwner  *RuntimeContractOwner
	overrideOwner *OverrideRegistryOwner
}

// LoweringOptions are request-scoped lowering switches.
type LoweringOptions struct {
	// SourceRoot is the request source root that may contain sibling protobuf TypeScript files.
	SourceRoot string
	// DisplayRoot is the request root used to format source file names in diagnostics.
	DisplayRoot string
	// OutputPath is the TypeScript output root used for generated relative imports.
	OutputPath string
	// ProtobufTypeScriptBinding binds .pb.go files to sibling .pb.ts files.
	ProtobufTypeScriptBinding bool
}

// NewLoweringOwner creates the lowering owner.
func NewLoweringOwner(runtimeOwner *RuntimeContractOwner, overrideOwner *OverrideRegistryOwner) *LoweringOwner {
	if runtimeOwner == nil {
		runtimeOwner = NewRuntimeContractOwner()
	}
	if overrideOwner == nil {
		overrideOwner = NewOverrideRegistryOwner()
	}
	return &LoweringOwner{
		runtimeOwner:  runtimeOwner,
		overrideOwner: overrideOwner,
	}
}

// Build converts the semantic model into the compiler IR.
func (o *LoweringOwner) Build(ctx context.Context, model *SemanticModel, opts ...LoweringOptions) (*LoweredProgram, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if model == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/lowering:no-model",
			Message:  "lowering requires a semantic model",
		}}
	}

	var options LoweringOptions
	if len(opts) != 0 {
		options = opts[0]
	}

	program := &LoweredProgram{}
	lazyPackageVars := make(map[string]map[types.Object]bool, len(model.packages))
	runtimeMethodSets := make(runtimeMethodSetCache)
	semPkgs := make([]*semanticPackage, 0, len(model.packages))
	for _, semPkg := range model.packages {
		semPkgs = append(semPkgs, semPkg)
	}
	slices.SortFunc(semPkgs, func(a, b *semanticPackage) int {
		return cmp.Compare(a.pkgPath, b.pkgPath)
	})

	var diagnostics []Diagnostic
	for _, semPkg := range semPkgs {
		if semPkg.source == nil {
			diagnostics = append(diagnostics, loweringUnsupported("package", semPkg.pkgPath, "missing semantic source package"))
			continue
		}
		loweredPkg, pkgDiagnostics := o.lowerPackage(model, semPkg, lazyPackageVars, runtimeMethodSets, options)
		diagnostics = append(diagnostics, pkgDiagnostics...)
		if loweredPkg != nil {
			program.packages = append(program.packages, loweredPkg)
		}
	}
	if diagnosticsHaveErrors(diagnostics) {
		return nil, diagnostics
	}
	return program, nil
}

func (o *LoweringOwner) lowerPackage(
	model *SemanticModel,
	semPkg *semanticPackage,
	lazyPackageVarsByPkg map[string]map[types.Object]bool,
	runtimeMethodSets runtimeMethodSetCache,
	options LoweringOptions,
) (*loweredPackage, []Diagnostic) {
	loweredPkg := &loweredPackage{
		pkgPath: semPkg.pkgPath,
		name:    semPkg.name,
	}
	declFiles := packageDeclFiles(semPkg)
	outputNames := packageOutputNames(semPkg)
	protobufBindings, bindingDiagnostics := protobufTypeScriptBindings(semPkg, options)
	for sourcePath, binding := range protobufBindings {
		outputNames[sourcePath] = binding.outputName
	}
	lazyPackageVars := o.packageLazyVars(semPkg, lazyPackageVarsByPkg, declFiles)
	diagnostics := append([]Diagnostic(nil), bindingDiagnostics...)
	for idx, file := range semPkg.source.Syntax {
		sourcePath := sourceFilePath(semPkg, idx, file)
		if options.ProtobufTypeScriptBinding && protobufSRPCHasGoScriptReplacement(sourcePath) {
			stub, stubDiagnostics := lowerProtobufSRPCTypeScriptBindingStub(semPkg, sourcePath, options)
			diagnostics = append(diagnostics, stubDiagnostics...)
			if stub != nil {
				loweredPkg.files = append(loweredPkg.files, stub)
			}
			continue
		}
		if binding, ok := protobufBindings[sourcePath]; ok {
			protobufAdapter := !binding.hasOneof && !strings.HasSuffix(filepath.Base(binding.sourcePath), "_srpc.pb.go")
			loweredFile, fileDiagnostics := o.lowerFile(
				model,
				semPkg,
				file,
				sourcePath,
				declFiles,
				outputNames,
				lazyPackageVars,
				lazyPackageVarsByPkg,
				runtimeMethodSets,
				protobufAdapter,
				options.DisplayRoot,
			)
			diagnostics = append(diagnostics, fileDiagnostics...)
			rewriteProtobufTypeScriptBindingFile(loweredFile, binding)
			if loweredFile != nil {
				loweredPkg.files = append(loweredPkg.files, loweredFile)
			}
			continue
		}
		loweredFile, fileDiagnostics := o.lowerFile(
			model,
			semPkg,
			file,
			sourcePath,
			declFiles,
			outputNames,
			lazyPackageVars,
			lazyPackageVarsByPkg,
			runtimeMethodSets,
			false,
			options.DisplayRoot,
		)
		diagnostics = append(diagnostics, fileDiagnostics...)
		if loweredFile != nil {
			loweredPkg.files = append(loweredPkg.files, loweredFile)
		}
	}
	slices.SortFunc(loweredPkg.files, func(a, b *loweredFile) int {
		return cmp.Compare(a.outputName, b.outputName)
	})
	return loweredPkg, diagnostics
}

func sourceFilePath(semPkg *semanticPackage, idx int, file *ast.File) string {
	if idx < len(semPkg.source.CompiledGoFiles) {
		return semPkg.source.CompiledGoFiles[idx]
	}
	pos := sourcePos(semPkg.source, file.Package)
	return pos.file
}

func sourceOutputName(sourcePath string) string {
	return strings.TrimSuffix(filepath.Base(sourcePath), ".go") + ".gs.ts"
}

func (o *LoweringOwner) lowerFile(
	model *SemanticModel,
	semPkg *semanticPackage,
	file *ast.File,
	sourcePath string,
	declFiles map[types.Object]string,
	outputNames map[string]string,
	lazyPackageVars map[types.Object]bool,
	lazyPackageVarsByPkg map[string]map[types.Object]bool,
	runtimeMethodSets runtimeMethodSetCache,
	protobufTypeScriptAdapter bool,
	displayRoot string,
) (*loweredFile, []Diagnostic) {
	associatedMethods := o.methodDeclsForFileTypes(semPkg, file)
	relevantImportFiles := map[string]bool{sourcePath: true}
	for _, methodDecl := range associatedMethods {
		methodPath := sourcePos(semPkg.source, methodDecl.Pos()).file
		if methodPath != "" {
			relevantImportFiles[methodPath] = true
		}
	}
	loweredFile := &loweredFile{
		sourcePath: sourcePath,
		outputName: sourceOutputName(sourcePath),
		imports: []loweredImport{{
			alias:  o.runtimeOwner.BuiltinImport().Alias,
			source: o.runtimeOwner.BuiltinImport().Source,
		}},
	}
	importAliases := make(map[string]string)
	importPaths := make(map[string]string)
	importNames := make(map[string]string)
	importObjects := make(map[*types.PkgName]string)
	localRefs := o.analyzeLocalFileReferences(semPkg, file, sourcePath, associatedMethods, declFiles, outputNames, runtimeMethodSets)
	reservedImportAliases := localRefs.reservedNames
	seenImport := make(map[string]bool)
	for idx, importFile := range semPkg.source.Syntax {
		importSourcePath := sourceFilePath(semPkg, idx, importFile)
		if !relevantImportFiles[importSourcePath] {
			continue
		}
		for _, importSpec := range importFile.Imports {
			pkgName, _ := semPkg.source.TypesInfo.Implicits[importSpec].(*types.PkgName)
			if importSpec.Name != nil {
				pkgName, _ = semPkg.source.TypesInfo.Defs[importSpec.Name].(*types.PkgName)
			}
			if pkgName == nil || pkgName.Imported() == nil {
				continue
			}
			name := pkgName.Name()
			if importSpec.Name != nil {
				name = importSpec.Name.Name
			}
			if name == "." || name == "_" {
				continue
			}
			alias := uniqueImportAlias(safeIdentifier(name), pkgName.Imported().Path(), importAliases, reservedImportAliases)
			source := "@goscript/" + pkgName.Imported().Path() + "/index.js"
			importKey := alias + "\x00" + source
			if seenImport[importKey] {
				continue
			}
			seenImport[importKey] = true
			importAliases[alias] = pkgName.Imported().Path()
			importPaths[pkgName.Imported().Path()] = alias
			importNames[name] = alias
			importObjects[pkgName] = alias
			loweredFile.imports = append(loweredFile.imports, loweredImport{
				alias:      alias,
				source:     source,
				sideEffect: true,
			})
		}
	}
	implicitImportPaths := make([]string, 0, len(localRefs.implicitImports))
	for pkgPath := range localRefs.implicitImports {
		if pkgPath != "" && pkgPath != semPkg.pkgPath {
			implicitImportPaths = append(implicitImportPaths, pkgPath)
		}
	}
	slices.Sort(implicitImportPaths)
	for _, pkgPath := range implicitImportPaths {
		o.addGeneratedImportPath(
			model,
			pkgPath,
			loweredFile,
			importAliases,
			importPaths,
			reservedImportAliases,
			seenImport,
			!localRefs.implicitRuntime[pkgPath],
		)
	}
	for importSourcePath := range relevantImportFiles {
		o.addGeneratedTypeImports(model, semPkg, importSourcePath, loweredFile, importAliases, importPaths, reservedImportAliases, seenImport)
	}
	localImports := make([]loweredImport, 0, len(localRefs.aliases))
	seenLocalImport := make(map[string]bool)
	for _, alias := range localRefs.aliases {
		if seenLocalImport[alias] {
			continue
		}
		seenLocalImport[alias] = true
		source := localRefs.aliasSources[alias]
		typeOnly := !localRefs.runtimeAliases[alias]
		localImports = append(localImports, loweredImport{
			alias:      alias,
			source:     source,
			sideEffect: !typeOnly,
			typeOnly:   typeOnly,
		})
	}
	slices.SortFunc(localImports, func(a, b loweredImport) int {
		return cmp.Compare(a.alias, b.alias)
	})
	loweredFile.imports = append(loweredFile.imports, localImports...)

	ctx := lowerFileContext{
		model:                model,
		semPkg:               semPkg,
		file:                 file,
		importAliases:        importAliases,
		importPaths:          importPaths,
		importNames:          importNames,
		importObjects:        importObjects,
		sourcePath:           sourcePath,
		localAliases:         localRefs.aliases,
		lazyPackageVars:      lazyPackageVars,
		lazyPackageVarsByPkg: lazyPackageVarsByPkg,
		tempNames:            newTempNameOwner(),
		topLevel:             true,
		protobufTSAdapter:    protobufTypeScriptAdapter,
		displayRoot:          displayRoot,
	}
	var diagnostics []Diagnostic
	var packageInitCalls []string
	appendDecls := func(decls []loweredDecl) {
		for _, decl := range decls {
			if decl.packageInitCall != "" {
				packageInitCalls = append(packageInitCalls, decl.packageInitCall)
				continue
			}
			loweredFile.decls = append(loweredFile.decls, decl)
			if decl.indexExport != "" {
				loweredFile.exports = append(loweredFile.exports, decl.indexExport)
			}
			if decl.typeIndexExport != "" {
				loweredFile.typeExports = append(loweredFile.typeExports, decl.typeIndexExport)
			}
			if decl.sideEffect {
				loweredFile.sideEffect = true
			}
			if decl.function != nil && decl.function.indexExported && decl.function.name != "main" {
				loweredFile.exports = append(loweredFile.exports, decl.function.name)
			}
			if decl.structType != nil && decl.structType.indexExported {
				loweredFile.exports = append(loweredFile.exports, decl.structType.name)
			}
		}
	}
	lowerDecl := func(decl ast.Decl) {
		loweredDecls, declDiagnostics := o.lowerDecl(ctx, decl)
		diagnostics = append(diagnostics, declDiagnostics...)
		appendDecls(loweredDecls)
	}
	for _, decl := range file.Decls {
		if isConstGenDecl(decl) {
			lowerDecl(decl)
		}
	}
	for _, decl := range file.Decls {
		if !isConstGenDecl(decl) {
			lowerDecl(decl)
		}
	}
	for _, call := range packageInitCalls {
		loweredFile.decls = append(loweredFile.decls, loweredDecl{code: "await " + call})
	}
	for _, decl := range loweredFile.decls {
		if decl.function == nil || !decl.function.init {
			continue
		}
		call := decl.function.name + "()"
		if decl.function.async {
			call = "await " + call
		}
		loweredFile.decls = append(loweredFile.decls, loweredDecl{code: call})
	}
	return loweredFile, diagnostics
}

func (o *LoweringOwner) addGeneratedTypeImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	sourcePath string,
	loweredFile *loweredFile,
	importAliases map[string]string,
	importPaths map[string]string,
	reservedImportAliases map[string]bool,
	seenImport map[string]bool,
) {
	generatedImports := semPkg.generatedImports[sourcePath]
	if len(generatedImports) == 0 {
		return
	}
	pkgPaths := make([]string, 0, len(generatedImports))
	for pkgPath := range generatedImports {
		if pkgPath != "" && pkgPath != semPkg.pkgPath {
			pkgPaths = append(pkgPaths, pkgPath)
		}
	}
	slices.Sort(pkgPaths)
	for _, pkgPath := range pkgPaths {
		o.addGeneratedImportPath(model, pkgPath, loweredFile, importAliases, importPaths, reservedImportAliases, seenImport, true)
	}
}

func (o *LoweringOwner) addGeneratedImportPath(
	model *SemanticModel,
	pkgPath string,
	loweredFile *loweredFile,
	importAliases map[string]string,
	importPaths map[string]string,
	reservedImportAliases map[string]bool,
	seenImport map[string]bool,
	typeOnly bool,
) {
	if !o.hasGeneratedImportPackage(model, pkgPath) {
		return
	}
	if importPaths[pkgPath] != "" {
		return
	}
	alias := generatedImportAlias(model, pkgPath)
	alias = uniqueImportAlias(alias, pkgPath, importAliases, reservedImportAliases)
	source := "@goscript/" + pkgPath + "/index.js"
	importKey := alias + "\x00" + source
	if seenImport[importKey] {
		return
	}
	seenImport[importKey] = true
	importAliases[alias] = pkgPath
	importPaths[pkgPath] = alias
	loweredFile.imports = append(loweredFile.imports, loweredImport{
		alias:      alias,
		source:     source,
		sideEffect: !typeOnly,
		typeOnly:   typeOnly,
	})
}

func (o *LoweringOwner) hasGeneratedImportPackage(model *SemanticModel, pkgPath string) bool {
	if model != nil && model.packages[pkgPath] != nil {
		return true
	}
	return o.overrideFacts().HasPackage(pkgPath)
}

func generatedImportAlias(model *SemanticModel, pkgPath string) string {
	if model != nil {
		if semPkg := model.packages[pkgPath]; semPkg != nil && semPkg.name != "" {
			return safeIdentifier(semPkg.name)
		}
	}
	return safeIdentifier(path.Base(pkgPath))
}

func uniqueImportAlias(alias string, pkgPath string, importAliases map[string]string, reservedAliases map[string]bool) string {
	if !reservedAliases[alias] && (importAliases[alias] == "" || importAliases[alias] == pkgPath) {
		return alias
	}
	base := alias
	for idx := 2; ; idx++ {
		candidate := base + strconv.Itoa(idx)
		if !reservedAliases[candidate] && (importAliases[candidate] == "" || importAliases[candidate] == pkgPath) {
			return candidate
		}
	}
}

func (o *LoweringOwner) methodDeclsForFileTypes(semPkg *semanticPackage, file *ast.File) []*ast.FuncDecl {
	if semPkg == nil || semPkg.source == nil || file == nil {
		return nil
	}
	fileTypes := make(map[*types.Named]bool)
	for _, decl := range file.Decls {
		genDecl, ok := decl.(*ast.GenDecl)
		if !ok {
			continue
		}
		for _, spec := range genDecl.Specs {
			typeSpec, ok := spec.(*ast.TypeSpec)
			if !ok {
				continue
			}
			typeName, _ := semPkg.source.TypesInfo.Defs[typeSpec.Name].(*types.TypeName)
			if typeName == nil {
				continue
			}
			named, _ := typeName.Type().(*types.Named)
			if named != nil {
				fileTypes[named.Origin()] = true
			}
		}
	}
	if len(fileTypes) == 0 {
		return nil
	}
	var methods []*ast.FuncDecl
	for _, syntax := range semPkg.source.Syntax {
		for _, decl := range syntax.Decls {
			funcDecl, ok := decl.(*ast.FuncDecl)
			if !ok || funcDecl.Recv == nil {
				continue
			}
			fnObj, _ := semPkg.source.TypesInfo.Defs[funcDecl.Name].(*types.Func)
			if fnObj == nil {
				continue
			}
			signature, _ := fnObj.Type().(*types.Signature)
			if signature == nil || signature.Recv() == nil {
				continue
			}
			receiver := receiverNamedType(signature.Recv().Type())
			if receiver != nil && fileTypes[receiver.Origin()] {
				methods = append(methods, funcDecl)
			}
		}
	}
	return methods
}

type localFileReferenceAnalysis struct {
	reservedNames   map[string]bool
	aliases         map[types.Object]string
	aliasSources    map[string]string
	runtimeAliases  map[string]bool
	implicitImports map[string]bool
	implicitRuntime map[string]bool
}

type runtimeMethodSetCache map[*types.Named][]types.Object

func (c runtimeMethodSetCache) methods(named *types.Named) []types.Object {
	if named == nil {
		return nil
	}
	if methods, ok := c[named]; ok {
		return methods
	}
	methodSet := types.NewMethodSet(types.NewPointer(named))
	methods := make([]types.Object, 0, methodSet.Len())
	for method := range methodSet.Methods() {
		methods = append(methods, method.Obj())
	}
	c[named] = methods
	return methods
}

func (o *LoweringOwner) analyzeLocalFileReferences(
	semPkg *semanticPackage,
	file *ast.File,
	sourcePath string,
	associatedMethods []*ast.FuncDecl,
	declFiles map[types.Object]string,
	outputNames map[string]string,
	runtimeMethodSets runtimeMethodSetCache,
) localFileReferenceAnalysis {
	analysis := localFileReferenceAnalysis{
		reservedNames:   make(map[string]bool),
		aliases:         make(map[types.Object]string),
		aliasSources:    make(map[string]string),
		runtimeAliases:  make(map[string]bool),
		implicitImports: make(map[string]bool),
		implicitRuntime: make(map[string]bool),
	}
	seenObjects := make(map[types.Object]bool)
	seenTypes := make(map[types.Type]bool)
	seenRuntimeTypes := make(map[types.Type]bool)
	seenRuntimeOwnerTypes := make(map[types.Type]bool)
	var addTypeDeps func(typ types.Type)
	var addRuntimeTypeDeps func(typ types.Type)
	var addRuntimeTypeOwnerDeps func(typ types.Type)
	var addObject func(obj types.Object, runtime bool)
	addObject = func(obj types.Object, runtime bool) {
		if obj == nil || obj.Pkg() == nil {
			return
		}
		if obj.Pkg().Path() != semPkg.pkgPath {
			if runtime {
				analysis.implicitImports[obj.Pkg().Path()] = true
				analysis.implicitRuntime[obj.Pkg().Path()] = true
			}
			return
		}
		declFile := declFiles[obj]
		if declFile == "" {
			if fn, ok := obj.(*types.Func); ok {
				if decl := functionDeclForObject(semPkg, fn); decl != nil {
					declFile = sourcePos(semPkg.source, decl.Pos()).file
				}
			}
		}
		if declFile != "" && declFile != sourcePath {
			outputName := outputNames[declFile]
			if outputName != "" {
				alias := "__goscript_" + safeIdentifier(strings.TrimSuffix(outputName, ".gs.ts"))
				analysis.aliases[obj] = alias
				analysis.aliasSources[alias] = "./" + outputName
				if runtime {
					analysis.runtimeAliases[alias] = true
				}
			}
		}
		if runtime {
			if alias := analysis.aliases[obj]; alias != "" {
				analysis.runtimeAliases[alias] = true
			}
		}
		if seenObjects[obj] {
			return
		}
		seenObjects[obj] = true
		switch typed := obj.(type) {
		case *types.TypeName:
			addTypeDeps(typed.Type())
			if named, ok := types.Unalias(typed.Type()).(*types.Named); ok {
				if structType := structUnderlyingType(named); structType != nil {
					for field := range structType.Fields() {
						addRuntimeTypeDeps(field.Type())
					}
				}
			}
			if named, ok := types.Unalias(typed.Type()).(*types.Named); ok {
				for method := range named.Methods() {
					addObject(method, false)
				}
			}
		case *types.Var:
			addTypeDeps(typed.Type())
		case *types.Const:
			addTypeDeps(typed.Type())
		case *types.Func:
			signature, _ := typed.Type().(*types.Signature)
			if signature == nil {
				return
			}
			if receiver := signature.Recv(); receiver != nil {
				addTypeDeps(receiver.Type())
			}
			if params := signature.Params(); params != nil {
				for param := range params.Variables() {
					addTypeDeps(param.Type())
				}
			}
			if results := signature.Results(); results != nil {
				for result := range results.Variables() {
					addTypeDeps(result.Type())
				}
			}
		}
	}
	addTypeDeps = func(typ types.Type) {
		if typ == nil || seenTypes[typ] {
			return
		}
		seenTypes[typ] = true
		if alias, ok := typ.(*types.Alias); ok {
			if obj := alias.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() != semPkg.pkgPath {
				analysis.implicitImports[obj.Pkg().Path()] = true
				if args := alias.TypeArgs(); args != nil {
					for t := range args.Types() {
						addTypeDeps(t)
					}
				}
				addTypeDeps(alias.Rhs())
				return
			}
			addObject(alias.Obj(), false)
			if args := alias.TypeArgs(); args != nil {
				for t := range args.Types() {
					addTypeDeps(t)
				}
			}
			addTypeDeps(alias.Rhs())
			return
		}
		if named, ok := types.Unalias(typ).(*types.Named); ok {
			if obj := named.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() != semPkg.pkgPath {
				analysis.implicitImports[obj.Pkg().Path()] = true
				if args := named.TypeArgs(); args != nil {
					for t := range args.Types() {
						addTypeDeps(t)
					}
				}
				return
			}
			addObject(named.Obj(), false)
			if args := named.TypeArgs(); args != nil {
				for t := range args.Types() {
					addTypeDeps(t)
				}
			}
			addTypeDeps(named.Underlying())
			return
		}
		switch typed := types.Unalias(typ).Underlying().(type) {
		case *types.Pointer:
			addTypeDeps(typed.Elem())
		case *types.Slice:
			addTypeDeps(typed.Elem())
		case *types.Array:
			addTypeDeps(typed.Elem())
		case *types.Map:
			addTypeDeps(typed.Key())
			addTypeDeps(typed.Elem())
		case *types.Chan:
			addTypeDeps(typed.Elem())
		case *types.Struct:
			for field := range typed.Fields() {
				addTypeDeps(field.Type())
			}
		case *types.Signature:
			if params := typed.Params(); params != nil {
				for param := range params.Variables() {
					addTypeDeps(param.Type())
				}
			}
			if results := typed.Results(); results != nil {
				for result := range results.Variables() {
					addTypeDeps(result.Type())
				}
			}
		case *types.Interface:
			typed.Complete()
			for method := range typed.Methods() {
				addTypeDeps(method.Type())
			}
			for etyp := range typed.EmbeddedTypes() {
				addTypeDeps(etyp)
			}
		}
	}
	addRuntimeTypeDeps = func(typ types.Type) {
		if typ == nil {
			return
		}
		if seenRuntimeTypes[typ] {
			return
		}
		seenRuntimeTypes[typ] = true
		if alias, ok := typ.(*types.Alias); ok {
			addObject(alias.Obj(), true)
			if args := alias.TypeArgs(); args != nil {
				for t := range args.Types() {
					addRuntimeTypeDeps(t)
				}
			}
			addRuntimeTypeDeps(alias.Rhs())
			return
		}
		if named, ok := types.Unalias(typ).(*types.Named); ok {
			addObject(named.Obj(), true)
			for method := range named.Methods() {
				addObject(method, true)
			}
			for _, method := range runtimeMethodSets.methods(named) {
				addObject(method, true)
			}
			if args := named.TypeArgs(); args != nil {
				for t := range args.Types() {
					addRuntimeTypeDeps(t)
				}
			}
			return
		}
		switch typed := types.Unalias(typ).Underlying().(type) {
		case *types.Pointer:
			addRuntimeTypeDeps(typed.Elem())
		case *types.Slice:
			addRuntimeTypeDeps(typed.Elem())
		case *types.Array:
			addRuntimeTypeDeps(typed.Elem())
		case *types.Map:
			addRuntimeTypeDeps(typed.Key())
			addRuntimeTypeDeps(typed.Elem())
		case *types.Chan:
			addRuntimeTypeDeps(typed.Elem())
		}
	}
	addRuntimeTypeOwnerDeps = func(typ types.Type) {
		if typ == nil {
			return
		}
		if seenRuntimeOwnerTypes[typ] {
			return
		}
		seenRuntimeOwnerTypes[typ] = true
		if alias, ok := typ.(*types.Alias); ok {
			addObject(alias.Obj(), true)
			if args := alias.TypeArgs(); args != nil {
				for t := range args.Types() {
					addRuntimeTypeOwnerDeps(t)
				}
			}
			addRuntimeTypeOwnerDeps(alias.Rhs())
			return
		}
		if named, ok := types.Unalias(typ).(*types.Named); ok {
			addObject(named.Obj(), true)
			if args := named.TypeArgs(); args != nil {
				for t := range args.Types() {
					addRuntimeTypeOwnerDeps(t)
				}
			}
			return
		}
		switch typed := types.Unalias(typ).Underlying().(type) {
		case *types.Pointer:
			addRuntimeTypeOwnerDeps(typed.Elem())
		case *types.Slice:
			addRuntimeTypeOwnerDeps(typed.Elem())
		case *types.Array:
			addRuntimeTypeOwnerDeps(typed.Elem())
		case *types.Map:
			addRuntimeTypeOwnerDeps(typed.Key())
			addRuntimeTypeOwnerDeps(typed.Elem())
		case *types.Chan:
			addRuntimeTypeOwnerDeps(typed.Elem())
		}
	}
	inspect := func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.ValueSpec:
			if len(typed.Values) == 0 && typed.Type != nil {
				addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(typed.Type))
			}
		case *ast.Ident:
			if obj := semPkg.source.TypesInfo.Defs[typed]; obj != nil {
				if _, ok := obj.(*types.PkgName); !ok {
					name := safeIdentifier(obj.Name())
					if name != "_" {
						analysis.reservedNames[name] = true
					}
				}
			}
			if tv, ok := semPkg.source.TypesInfo.Types[typed]; ok && tv.IsValue() {
				addObject(semPkg.source.TypesInfo.Uses[typed], true)
			}
			addTypeDeps(semPkg.source.TypesInfo.TypeOf(typed))
		case *ast.SelectorExpr:
			if selection := semPkg.source.TypesInfo.Selections[typed]; selection != nil {
				switch selection.Kind() {
				case types.FieldVal, types.MethodVal, types.MethodExpr:
					addObject(selection.Obj(), true)
					if selection.Kind() != types.FieldVal {
						addRuntimeTypeOwnerDeps(selection.Recv())
					}
				default:
					addObject(selection.Obj(), false)
				}
				addTypeDeps(selection.Obj().Type())
			} else if obj := semPkg.source.TypesInfo.Uses[typed.Sel]; obj != nil {
				if tv, ok := semPkg.source.TypesInfo.Types[typed]; ok && tv.IsValue() {
					addObject(obj, true)
				}
				addTypeDeps(obj.Type())
			}
			if pointer, ok := types.Unalias(semPkg.source.TypesInfo.TypeOf(typed.X)).Underlying().(*types.Pointer); ok {
				addTypeDeps(pointer.Elem())
			}
		case *ast.CompositeLit:
			addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(typed))
			addCompositeInterfaceValueDeps(semPkg.source.TypesInfo, typed, addRuntimeTypeDeps)
		case *ast.CallExpr:
			if ident, ok := ast.Unparen(typed.Fun).(*ast.Ident); ok && ident.Name == "new" {
				for _, arg := range typed.Args {
					addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(arg))
				}
			}
			if ident, ok := ast.Unparen(typed.Fun).(*ast.Ident); ok && ident.Name == "make" && len(typed.Args) != 0 {
				addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(typed.Args[0]))
			}
			addReflectTypeForRuntimeDeps(semPkg.source.TypesInfo, typed, addRuntimeTypeDeps)
			addInterfaceArgumentRuntimeDeps(semPkg.source.TypesInfo, typed, addRuntimeTypeDeps)
			addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(typed.Fun))
		}
		return true
	}
	ast.Inspect(file, inspect)
	for _, methodDecl := range associatedMethods {
		if sourcePos(semPkg.source, methodDecl.Pos()).file == sourcePath {
			continue
		}
		ast.Inspect(methodDecl, inspect)
	}
	return analysis
}

func addInterfaceArgumentRuntimeDeps(
	info *types.Info,
	call *ast.CallExpr,
	addRuntimeTypeDeps func(types.Type),
) {
	if info == nil || call == nil {
		return
	}
	signature, _ := types.Unalias(info.TypeOf(call.Fun)).(*types.Signature)
	if signature == nil || signature.Params() == nil {
		return
	}
	params := signature.Params()
	for idx, arg := range call.Args {
		paramIdx := idx
		if signature.Variadic() && paramIdx >= params.Len()-1 {
			paramIdx = params.Len() - 1
		}
		if paramIdx < 0 || paramIdx >= params.Len() {
			continue
		}
		paramType := params.At(paramIdx).Type()
		if signature.Variadic() && idx >= params.Len()-1 {
			if slice, ok := types.Unalias(paramType).Underlying().(*types.Slice); ok {
				paramType = slice.Elem()
			}
		}
		if typeIsInterface(paramType) {
			addRuntimeTypeDeps(info.TypeOf(arg))
		}
	}
}

func addReflectTypeForRuntimeDeps(
	info *types.Info,
	call *ast.CallExpr,
	addRuntimeTypeDeps func(types.Type),
) {
	if info == nil || call == nil || !isReflectTypeForExpr(info, call.Fun) {
		return
	}
	switch typed := ast.Unparen(call.Fun).(type) {
	case *ast.IndexExpr:
		addRuntimeTypeDeps(info.TypeOf(typed.Index))
	case *ast.IndexListExpr:
		for _, index := range typed.Indices {
			addRuntimeTypeDeps(info.TypeOf(index))
		}
	}
}

func isReflectTypeForExpr(info *types.Info, expr ast.Expr) bool {
	var base ast.Expr
	switch typed := ast.Unparen(expr).(type) {
	case *ast.IndexExpr:
		base = typed.X
	case *ast.IndexListExpr:
		base = typed.X
	default:
		return false
	}
	selector, ok := ast.Unparen(base).(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "TypeFor" {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := info.Uses[ident].(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "reflect"
}

func addCompositeInterfaceValueDeps(
	info *types.Info,
	lit *ast.CompositeLit,
	addRuntimeTypeDeps func(types.Type),
) {
	if info == nil || lit == nil {
		return
	}
	typ := types.Unalias(info.TypeOf(lit))
	if pointer, ok := typ.Underlying().(*types.Pointer); ok {
		typ = types.Unalias(pointer.Elem())
	}
	switch typed := typ.Underlying().(type) {
	case *types.Array:
		addCompositeElementsRuntimeDeps(info, lit.Elts, typed.Elem(), addRuntimeTypeDeps)
	case *types.Slice:
		addCompositeElementsRuntimeDeps(info, lit.Elts, typed.Elem(), addRuntimeTypeDeps)
	case *types.Map:
		for _, elt := range lit.Elts {
			keyValue, ok := elt.(*ast.KeyValueExpr)
			if !ok {
				continue
			}
			if typeIsInterface(typed.Key()) {
				addRuntimeTypeDeps(info.TypeOf(keyValue.Key))
			}
			if typeIsInterface(typed.Elem()) {
				addRuntimeTypeDeps(info.TypeOf(keyValue.Value))
			}
		}
	case *types.Struct:
		nextField := 0
		for _, elt := range lit.Elts {
			fieldIdx := nextField
			value := elt
			if keyValue, ok := elt.(*ast.KeyValueExpr); ok {
				value = keyValue.Value
				if ident, ok := keyValue.Key.(*ast.Ident); ok {
					for idx := range typed.NumFields() {
						if typed.Field(idx).Name() == ident.Name {
							fieldIdx = idx
							break
						}
					}
				}
			} else {
				nextField++
			}
			if fieldIdx < 0 || fieldIdx >= typed.NumFields() {
				continue
			}
			if typeIsInterface(typed.Field(fieldIdx).Type()) {
				addRuntimeTypeDeps(info.TypeOf(value))
			}
		}
	}
}

func addCompositeElementsRuntimeDeps(
	info *types.Info,
	elements []ast.Expr,
	elemType types.Type,
	addRuntimeTypeDeps func(types.Type),
) {
	if !typeIsInterface(elemType) {
		return
	}
	for _, elt := range elements {
		if keyValue, ok := elt.(*ast.KeyValueExpr); ok {
			elt = keyValue.Value
		}
		addRuntimeTypeDeps(info.TypeOf(elt))
	}
}

func typeIsInterface(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Interface)
	return ok
}

func safeIdentifier(value string) string {
	var b strings.Builder
	for idx, r := range value {
		valid := r == '_' || r >= 'a' && r <= 'z' || r >= 'A' && r <= 'Z' || idx != 0 && r >= '0' && r <= '9'
		if valid {
			b.WriteRune(r)
			continue
		}
		if r > 127 {
			b.WriteString("_u")
			b.WriteString(strconv.FormatInt(int64(r), 16))
			continue
		}
		b.WriteByte('_')
	}
	if b.Len() == 0 {
		return "_"
	}
	identifier := b.String()
	switch identifier {
	case "abstract", "any", "arguments", "as", "asserts", "async", "await", "boolean",
		"break", "case", "catch", "class", "const", "constructor", "continue", "debugger",
		"declare", "default", "delete", "do", "else", "enum", "export", "extends", "false",
		"finally", "for", "from", "function", "get", "if", "implements", "import", "in",
		"infer", "instanceof", "interface", "is", "keyof", "let", "module", "namespace",
		"never", "new", "null", "number", "object", "of", "package", "private", "protected",
		"public", "readonly", "require", "return", "set", "static", "string", "super",
		"switch", "symbol", "this", "throw", "true", "try", "type", "typeof", "undefined",
		"unique", "unknown", "var", "void", "while", "with", "yield":
		return "_" + identifier
	default:
		return identifier
	}
}

func methodMemberName(value string) string {
	if safeIdentifier(value) == value {
		return value
	}
	return "[" + strconv.Quote(value) + "]"
}

func safeParamName(param *types.Var, idx int) string {
	if param == nil || param.Name() == "" || param.Name() == "_" {
		return "_p" + strconv.Itoa(idx)
	}
	return safeIdentifier(param.Name())
}

type lowerFileContext struct {
	model                *SemanticModel
	semPkg               *semanticPackage
	file                 *ast.File
	importAliases        map[string]string
	importPaths          map[string]string
	importNames          map[string]string
	importObjects        map[*types.PkgName]string
	sourcePath           string
	localAliases         map[types.Object]string
	lazyPackageVars      map[types.Object]bool
	lazyPackageVarsByPkg map[string]map[types.Object]bool
	identAliases         map[types.Object]string
	identAliasRefs       map[types.Object]bool
	tempNames            *tempNameOwner
	signature            *types.Signature
	typeParams           map[string]bool
	staticTypeParams     map[string]bool
	asyncFunction        bool
	functionTypeDepth    int
	deferState           *loweredDeferState
	rangeBranch          *loweredRangeBranch
	rangeBreak           bool
	rangeContinue        bool
	gotoLabels           map[string]bool
	forwardGotos         map[string]bool
	gotoStateLabels      map[string]bool
	gotoStateVar         string
	gotoStateLoop        string
	functionScopedDecls  bool
	loopLabel            string
	switchBreak          bool
	topLevel             bool
	protobufTSAdapter    bool
	displayRoot          string
}

func (ctx lowerFileContext) diagnosticPosition(pos token.Pos) *DiagnosticPosition {
	if ctx.semPkg == nil {
		return nil
	}
	return diagnosticPositionFromSource(sourcePos(ctx.semPkg.source, pos), ctx.displayRoot)
}

func loweringUnsupportedAt(ctx lowerFileContext, node ast.Node, kind string, subject string, detail string) Diagnostic {
	diag := loweringUnsupported(kind, subject, detail)
	if node != nil {
		diag.Position = ctx.diagnosticPosition(node.Pos())
	}
	return diag
}

func loweringUnsupportedPos(ctx lowerFileContext, pos token.Pos, kind string, subject string, detail string) Diagnostic {
	diag := loweringUnsupported(kind, subject, detail)
	diag.Position = ctx.diagnosticPosition(pos)
	return diag
}

type tempNameOwner struct {
	counters map[string]int
}

func (ctx lowerFileContext) canReferenceNamedType(named *types.Named) bool {
	if named == nil || named.Obj() == nil {
		return true
	}
	return ctx.canReferenceObjectPackage(named.Obj())
}

func (ctx lowerFileContext) canReferenceObjectPackage(obj types.Object) bool {
	if obj == nil || obj.Pkg() == nil || ctx.semPkg == nil {
		return true
	}
	pkgPath := obj.Pkg().Path()
	if pkgPath == "" || pkgPath == ctx.semPkg.pkgPath {
		return true
	}
	if ctx.importPaths[pkgPath] != "" {
		return true
	}
	if ctx.localAliases[obj] != "" {
		return true
	}
	return false
}

func newTempNameOwner() *tempNameOwner {
	return &tempNameOwner{counters: make(map[string]int)}
}

func (ctx lowerFileContext) tempName(prefix string) string {
	if ctx.tempNames == nil {
		return "__goscript" + prefix + "0"
	}
	return ctx.tempNames.next(prefix)
}

func (ctx lowerFileContext) withIdentAliases(aliases map[types.Object]string) lowerFileContext {
	if len(aliases) == 0 {
		return ctx
	}
	if len(ctx.identAliases) != 0 {
		merged := make(map[types.Object]string, len(ctx.identAliases)+len(aliases))
		maps.Copy(merged, ctx.identAliases)
		maps.Copy(merged, aliases)
		ctx.identAliases = merged
		return ctx
	}
	ctx.identAliases = aliases
	return ctx
}

func (ctx lowerFileContext) withIdentRefAliases(aliases map[types.Object]string) lowerFileContext {
	if len(aliases) == 0 {
		return ctx
	}
	ctx = ctx.withIdentAliases(aliases)
	refs := make(map[types.Object]bool, len(ctx.identAliasRefs)+len(aliases))
	maps.Copy(refs, ctx.identAliasRefs)
	for obj := range aliases {
		refs[obj] = true
	}
	ctx.identAliasRefs = refs
	return ctx
}

func (o *tempNameOwner) next(prefix string) string {
	idx := o.counters[prefix]
	o.counters[prefix] = idx + 1
	return "__goscript" + prefix + strconv.Itoa(idx)
}

func (o *LoweringOwner) lowerDecl(ctx lowerFileContext, decl ast.Decl) ([]loweredDecl, []Diagnostic) {
	switch typed := decl.(type) {
	case *ast.GenDecl:
		if typed.Tok == token.IMPORT {
			return nil, nil
		}
		return o.lowerGenDecl(ctx, typed)
	case *ast.FuncDecl:
		if typed.Recv != nil {
			if receiver := receiverNamedTypeFromDecl(ctx, typed); receiver != nil && namedStructType(receiver) == nil {
				fn, diagnostics := o.lowerNamedReceiverMethodDecl(ctx, typed, receiver)
				if fn == nil {
					return nil, []Diagnostic{loweringUnsupportedAt(ctx, typed, "function", typed.Name.Name, "missing type information")}
				}
				return []loweredDecl{{function: fn}}, diagnostics
			}
			return nil, nil
		}
		fn, diagnostics := o.lowerFuncDecl(ctx, typed)
		if fn == nil {
			return nil, []Diagnostic{loweringUnsupportedAt(ctx, typed, "function", typed.Name.Name, "missing type information")}
		}
		return []loweredDecl{{function: fn}}, diagnostics
	default:
		return nil, []Diagnostic{loweringUnsupportedAt(ctx, decl, "declaration", ctx.semPkg.pkgPath, "unsupported declaration kind")}
	}
}

func isConstGenDecl(decl ast.Decl) bool {
	genDecl, ok := decl.(*ast.GenDecl)
	return ok && genDecl.Tok == token.CONST
}

func (o *LoweringOwner) lowerGenDecl(ctx lowerFileContext, decl *ast.GenDecl) ([]loweredDecl, []Diagnostic) {
	decls := make([]loweredDecl, 0, len(decl.Specs))
	var diagnostics []Diagnostic
	for _, spec := range decl.Specs {
		switch typed := spec.(type) {
		case *ast.TypeSpec:
			decl, specDiagnostics := o.lowerTypeSpec(ctx, typed)
			diagnostics = append(diagnostics, specDiagnostics...)
			if decl.code != "" || decl.structType != nil {
				decls = append(decls, decl)
			}
		case *ast.ValueSpec:
			embedPatterns := goEmbedPatterns(decl.Doc, typed.Doc)
			if len(typed.Values) == 1 && len(typed.Names) > 1 && tupleResultTypes(ctx, typed.Values[0]) != nil {
				tupleDecls, tupleDiagnostics := o.lowerTupleValueSpec(ctx, decl, typed)
				diagnostics = append(diagnostics, tupleDiagnostics...)
				decls = append(decls, tupleDecls...)
				continue
			}
			for idx, name := range typed.Names {
				if name.Name == "_" && ctx.topLevel && idx < len(typed.Values) &&
					!initializerMayHaveRuntimeEffects(ctx, typed.Values[idx]) {
					continue
				}
				obj := ctx.semPkg.source.TypesInfo.Defs[name]
				if obj == nil {
					continue
				}
				value := o.lowerDeclarationZeroValueExpr(ctx, obj.Type())
				if constObj, ok := obj.(*types.Const); ok {
					if constValue, ok := lowerConstantValue(constObj.Val()); ok {
						value = constValue
					}
				} else if idx < len(typed.Values) {
					lowered, exprDiagnostics := o.lowerExpr(ctx, typed.Values[idx])
					diagnostics = append(diagnostics, exprDiagnostics...)
					value = o.lowerValueForTarget(ctx, typed.Values[idx], obj.Type(), lowered)
					value = o.lowerTopLevelInitializerValue(ctx, typed.Values[idx], value)
				} else if len(embedPatterns) != 0 {
					embedded, embedDiagnostics := o.lowerGoEmbedValue(ctx, typed.Pos(), obj.Type(), embedPatterns)
					diagnostics = append(diagnostics, embedDiagnostics...)
					if embedded != "" {
						value = embedded
					}
				}
				if _, ok := obj.(*types.Const); !ok && ctx.model.needsVarRef[obj] {
					value = o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")"
				}
				keyword := strings.TrimSpace(declarationKeyword(ctx))
				if _, ok := obj.(*types.Const); ok || decl.Tok == token.CONST {
					keyword = "const"
				}
				variableType := o.tsVariableTypeFor(ctx, obj.Type(), ctx.model.needsVarRef[obj])
				if signature := unnamedSignatureForType(obj.Type()); signature != nil {
					variableType = o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
					if ctx.model.needsVarRef[obj] {
						variableType = "$.VarRef<" + variableType + ">"
					}
				}
				declName := o.lowerIdent(ctx, name, true)
				if name.Name == "_" {
					declName = ctx.tempName("Blank")
				}
				lazy := ctx.topLevel && ctx.lazyPackageVars[obj]
				code := keyword + " " + declName + ": " + variableType + " = " + value
				if lazy {
					keyword = "var"
					code = "var " + declName + ": " + variableType
				}
				indexExport := ""
				if ctx.topLevel && name.Name != "_" {
					code = "export " + code
					if ast.IsExported(name.Name) {
						indexExport = name.Name
					}
				}
				decls = append(decls, loweredDecl{code: code, indexExport: indexExport})
				if lazy {
					getterName := packageVarGetterName(name.Name)
					initName := packageVarInitName(name.Name)
					initIndexExport := ""
					if ast.IsExported(name.Name) {
						initIndexExport = initName
					}
					getterCode := "export function " + getterName + "(): " + variableType + " {\n\t"
					if strings.Contains(value, "await ") {
						initCode := "export async function " + initName + "(): globalThis.Promise<void> {\n\t" +
							"if (((" + declName + ") as any) === undefined) {\n\t\t" +
							declName + " = " + value + "\n\t}\n}"
						decls = append(decls, loweredDecl{code: initCode, indexExport: initIndexExport})
						decls = append(decls, loweredDecl{packageInitCall: initName + "()"})
						getterCode += "if (((" + declName + ") as any) === undefined) {\n\t\t" +
							"throw new Error(" + strconv.Quote("goscript package variable "+name.Name+" read before initialization") + ")\n\t}\n"
					} else {
						initCode := "export function " + initName + "(): void {\n\t" +
							"if (((" + declName + ") as any) === undefined) {\n\t\t" +
							declName + " = " + value + "\n\t}\n}"
						decls = append(decls, loweredDecl{code: initCode, indexExport: initIndexExport})
						getterCode += "if (((" + declName + ") as any) === undefined) {\n\t\t" +
							initName + "()\n\t}\n"
					}
					getterCode += "\treturn " + declName + "\n}"
					getterIndexExport := ""
					if ast.IsExported(name.Name) {
						getterIndexExport = getterName
					}
					decls = append(decls, loweredDecl{code: getterCode, indexExport: getterIndexExport})
				}
				if ctx.topLevel && name.Name != "_" && keyword != "const" {
					setterName := packageVarSetterName(name.Name)
					setterType := o.tsPackageVarSetterValueTypeFor(ctx, obj.Type())
					setterTarget := declName
					if ctx.model.needsVarRef[obj] {
						if lazy {
							setterTarget = packageVarGetterName(name.Name) + "().value"
						} else {
							setterTarget += ".value"
						}
					}
					setterValue := "__goscriptValue"
					setterCode := "export function " + setterName + "(" + setterValue + ": " + setterType + "): void {\n\t" +
						setterTarget + " = " + setterValue + "\n}"
					setterIndexExport := ""
					if ast.IsExported(name.Name) {
						setterIndexExport = setterName
					}
					decls = append(decls, loweredDecl{code: setterCode, indexExport: setterIndexExport})
				}
			}
		default:
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, typed, "declaration", ctx.semPkg.pkgPath, "unsupported general declaration"))
		}
	}
	return decls, diagnostics
}

func (o *LoweringOwner) lowerTopLevelInitializerValue(ctx lowerFileContext, expr ast.Expr, value string) string {
	if !ctx.topLevel || strings.HasPrefix(value, "await ") {
		return value
	}
	if !o.topLevelInitializerNeedsAwait(ctx, expr) {
		return value
	}
	return "await " + value
}

func (o *LoweringOwner) topLevelInitializerNeedsAwait(ctx lowerFileContext, expr ast.Expr) bool {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok {
		return false
	}
	if o.callNeedsAwait(ctx, call.Fun) {
		return true
	}
	if o.callUsesOverridePackage(ctx, call.Fun) {
		return false
	}
	fn := calledFunction(ctx.semPkg.source, call.Fun)
	if fn == nil || fn.Pkg() == nil || fn.Pkg().Path() == ctx.semPkg.pkgPath {
		return false
	}
	return true
}

func initializerMayHaveRuntimeEffects(ctx lowerFileContext, expr ast.Expr) bool {
	hasEffects := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if hasEffects {
			return false
		}
		switch typed := node.(type) {
		case *ast.CallExpr:
			if isEffectFreePackageInitializerCall(ctx, typed) {
				return true
			}
			if callTargetSignature(ctx, typed.Fun) != nil {
				hasEffects = true
				return false
			}
		case *ast.UnaryExpr:
			if typed.Op == token.ARROW {
				hasEffects = true
				return false
			}
		}
		return true
	})
	return hasEffects
}

func isEffectFreePackageInitializerCall(ctx lowerFileContext, call *ast.CallExpr) bool {
	if call == nil {
		return false
	}
	if isEffectFreePackageInitializerBuiltin(ctx, call.Fun) {
		return true
	}
	if isReflectTypeOfCall(ctx, call) {
		return true
	}
	if isReflectTypeForCall(ctx, call) {
		return true
	}
	if isMathBigNewIntCall(ctx, call) {
		return true
	}
	selector, ok := ast.Unparen(call.Fun).(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "Elem" {
		return false
	}
	receiver, ok := ast.Unparen(selector.X).(*ast.CallExpr)
	return ok && isReflectTypeOfCall(ctx, receiver)
}

func isEffectFreePackageInitializerBuiltin(ctx lowerFileContext, expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	if !ok {
		return false
	}
	if ident.Name != "make" && ident.Name != "new" {
		return false
	}
	_, ok = objectForIdent(ctx, ident).(*types.Builtin)
	return ok
}

func isReflectTypeOfCall(ctx lowerFileContext, call *ast.CallExpr) bool {
	selector, ok := ast.Unparen(call.Fun).(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "TypeOf" {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "reflect"
}

func isReflectTypeForCall(ctx lowerFileContext, call *ast.CallExpr) bool {
	fun := ast.Unparen(call.Fun)
	switch typed := fun.(type) {
	case *ast.IndexExpr:
		fun = ast.Unparen(typed.X)
	case *ast.IndexListExpr:
		fun = ast.Unparen(typed.X)
	}
	selector, ok := fun.(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "TypeFor" {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "reflect"
}

func isMathBigNewIntCall(ctx lowerFileContext, call *ast.CallExpr) bool {
	selector, ok := ast.Unparen(call.Fun).(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "NewInt" {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "math/big"
}

func packageDeclFiles(semPkg *semanticPackage) map[types.Object]string {
	if semPkg == nil || semPkg.source == nil {
		return nil
	}
	if len(semPkg.source.Syntax) <= 1 {
		return nil
	}
	declFiles := make(map[types.Object]string, len(semPkg.declarations))
	for _, decl := range semPkg.declarations {
		if decl.object != nil && decl.position.file != "" {
			declFiles[decl.object] = decl.position.file
		}
	}
	return declFiles
}

func packageOutputNames(semPkg *semanticPackage) map[string]string {
	if semPkg == nil || semPkg.source == nil {
		return nil
	}
	outputNames := make(map[string]string, len(semPkg.source.Syntax))
	for idx, syntax := range semPkg.source.Syntax {
		outputSourcePath := sourceFilePath(semPkg, idx, syntax)
		outputNames[outputSourcePath] = sourceOutputName(outputSourcePath)
	}
	return outputNames
}

func (o *LoweringOwner) packageLazyVars(
	semPkg *semanticPackage,
	cache map[string]map[types.Object]bool,
	declFiles map[types.Object]string,
) map[types.Object]bool {
	if semPkg == nil {
		return nil
	}
	if cache == nil {
		if declFiles == nil {
			declFiles = packageDeclFiles(semPkg)
		}
		return o.lazyPackageVars(semPkg, declFiles)
	}
	if lazy, ok := cache[semPkg.pkgPath]; ok {
		return lazy
	}
	if declFiles == nil {
		declFiles = packageDeclFiles(semPkg)
	}
	lazy := o.lazyPackageVars(semPkg, declFiles)
	cache[semPkg.pkgPath] = lazy
	return lazy
}

func (o *LoweringOwner) lazyPackageVars(semPkg *semanticPackage, declFiles map[types.Object]string) map[types.Object]bool {
	if semPkg == nil || semPkg.source == nil {
		return nil
	}
	varOrder := make(map[types.Object]int)
	for idx, obj := range semPkg.initOrder {
		varOrder[obj] = idx
	}
	funcRefs := packageVarsReferencedFromOtherFileTopLevelCalls(semPkg, declFiles)
	lazy := make(map[types.Object]bool)
	for idx, file := range semPkg.source.Syntax {
		sourcePath := sourceFilePath(semPkg, idx, file)
		for _, decl := range file.Decls {
			genDecl, ok := decl.(*ast.GenDecl)
			if !ok || genDecl.Tok != token.VAR {
				continue
			}
			for _, spec := range genDecl.Specs {
				valueSpec, ok := spec.(*ast.ValueSpec)
				if !ok {
					continue
				}
				for valueIdx, name := range valueSpec.Names {
					obj, _ := semPkg.source.TypesInfo.Defs[name].(*types.Var)
					if obj == nil {
						continue
					}
					if valueIdx < len(valueSpec.Values) &&
						initializerReferencesLaterPackageVar(semPkg, varOrder, obj, valueSpec.Values[valueIdx]) {
						lazy[obj] = true
						continue
					}
					if valueIdx < len(valueSpec.Values) &&
						initializerReferencesOtherFileObject(semPkg, declFiles, sourcePath, valueSpec.Values[valueIdx]) {
						lazy[obj] = true
						continue
					}
					if valueIdx < len(valueSpec.Values) &&
						initializerCallsFunctionReferencingLaterPackageVar(semPkg, varOrder, obj, valueSpec.Values[valueIdx]) {
						lazy[obj] = true
						continue
					}
					if valueIdx >= len(valueSpec.Values) &&
						zeroValueReferencesOtherFileObject(semPkg, declFiles, sourcePath, obj.Type()) {
						lazy[obj] = true
						continue
					}
					if funcRefs[obj] &&
						(valueIdx >= len(valueSpec.Values) ||
							!initializerMayHaveRuntimeEffects(lowerFileContext{semPkg: semPkg}, valueSpec.Values[valueIdx])) {
						lazy[obj] = true
					}
				}
			}
		}
	}
	return lazy
}

func packageVarsReferencedFromOtherFileTopLevelCalls(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
) map[*types.Var]bool {
	refs := make(map[*types.Var]bool)
	if semPkg == nil || semPkg.source == nil || semPkg.source.TypesInfo == nil {
		return refs
	}
	var collectFuncRefs func(rootSource string, fn *types.Func, seen map[*types.Func]bool)
	collectFuncRefs = func(rootSource string, fn *types.Func, seen map[*types.Func]bool) {
		if fn == nil || seen[fn] {
			return
		}
		seen[fn] = true
		decl := functionDeclForObject(semPkg, fn)
		if decl == nil || decl.Body == nil {
			return
		}
		ast.Inspect(decl.Body, func(node ast.Node) bool {
			switch typed := node.(type) {
			case *ast.Ident:
				obj, _ := semPkg.source.TypesInfo.Uses[typed].(*types.Var)
				if obj == nil || obj.Pkg() == nil || obj.Pkg().Path() != semPkg.pkgPath {
					return true
				}
				if declFiles[obj] != "" && declFiles[obj] != rootSource {
					refs[obj] = true
				}
			case *ast.CallExpr:
				called := calledFunction(semPkg.source, typed.Fun)
				if called != nil && called.Pkg() != nil && called.Pkg().Path() == semPkg.pkgPath {
					collectFuncRefs(rootSource, called, seen)
				}
			}
			return true
		})
	}
	for _, file := range semPkg.source.Syntax {
		sourcePath := sourcePos(semPkg.source, file.Pos()).file
		for _, decl := range file.Decls {
			switch typed := decl.(type) {
			case *ast.GenDecl:
				if typed.Tok != token.VAR {
					continue
				}
				for _, spec := range typed.Specs {
					valueSpec, ok := spec.(*ast.ValueSpec)
					if !ok {
						continue
					}
					for _, value := range valueSpec.Values {
						collectTopLevelRefs(semPkg, declFiles, refs, sourcePath, value, collectFuncRefs)
					}
				}
			case *ast.FuncDecl:
				if typed.Name.Name == "init" && typed.Body != nil {
					collectTopLevelRefs(semPkg, declFiles, refs, sourcePath, typed.Body, collectFuncRefs)
				}
			}
		}
	}
	return refs
}

func collectTopLevelRefs(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	refs map[*types.Var]bool,
	sourcePath string,
	node ast.Node,
	collectFuncRefs func(string, *types.Func, map[*types.Func]bool),
) {
	ast.Inspect(node, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.Ident:
			obj, _ := semPkg.source.TypesInfo.Uses[typed].(*types.Var)
			if obj == nil || obj.Pkg() == nil || obj.Pkg().Path() != semPkg.pkgPath {
				return true
			}
			if declFiles[obj] != "" && declFiles[obj] != sourcePath {
				refs[obj] = true
			}
		case *ast.CallExpr:
			called := calledFunction(semPkg.source, typed.Fun)
			if called == nil || called.Pkg() == nil || called.Pkg().Path() != semPkg.pkgPath {
				return true
			}
			collectFuncRefs(sourcePath, called, make(map[*types.Func]bool))
		}
		return true
	})
}

func (o *LoweringOwner) packageVarIsLazy(ctx lowerFileContext, obj *types.Var) bool {
	if obj == nil {
		return false
	}
	if ctx.lazyPackageVars[obj] {
		return true
	}
	if ctx.model == nil || obj.Pkg() == nil {
		return false
	}
	semPkg := ctx.model.packages[obj.Pkg().Path()]
	if semPkg == nil {
		return false
	}
	for lazyObj := range o.packageLazyVars(semPkg, ctx.lazyPackageVarsByPkg, nil) {
		if lazyObj != nil && lazyObj.Name() == obj.Name() &&
			lazyObj.Pkg() != nil && lazyObj.Pkg().Path() == obj.Pkg().Path() {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) packageVarNameIsLazy(ctx lowerFileContext, pkgPath, name string) bool {
	if ctx.model == nil || pkgPath == "" || name == "" {
		return false
	}
	semPkg := ctx.model.packages[pkgPath]
	if semPkg == nil {
		return false
	}
	for lazyObj := range o.packageLazyVars(semPkg, ctx.lazyPackageVarsByPkg, nil) {
		if lazyObj != nil && lazyObj.Name() == name {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) packageVarHasAsyncLazyInit(ctx lowerFileContext, obj types.Object) bool {
	varObj, _ := obj.(*types.Var)
	if varObj == nil || varObj.Pkg() == nil {
		return false
	}
	return o.packageVarNameHasAsyncLazyInit(ctx, varObj.Pkg().Path(), varObj.Name())
}

func (o *LoweringOwner) packageVarNameHasAsyncLazyInit(ctx lowerFileContext, pkgPath, name string) bool {
	if ctx.model == nil || pkgPath == "" || name == "" {
		return false
	}
	semPkg := ctx.model.packages[pkgPath]
	if semPkg == nil || semPkg.source == nil {
		return false
	}
	initCtx := lowerFileContext{model: ctx.model, semPkg: semPkg, topLevel: true}
	for _, file := range semPkg.source.Syntax {
		for _, decl := range file.Decls {
			genDecl, ok := decl.(*ast.GenDecl)
			if !ok || genDecl.Tok != token.VAR {
				continue
			}
			for _, spec := range genDecl.Specs {
				valueSpec, ok := spec.(*ast.ValueSpec)
				if !ok {
					continue
				}
				for idx, ident := range valueSpec.Names {
					if ident.Name != name || idx >= len(valueSpec.Values) {
						continue
					}
					return o.topLevelInitializerNeedsAwait(initCtx, valueSpec.Values[idx])
				}
			}
		}
	}
	return false
}

func initializerReferencesLaterPackageVar(
	semPkg *semanticPackage,
	varOrder map[types.Object]int,
	current types.Object,
	expr ast.Expr,
) bool {
	currentIdx, ok := varOrder[current]
	if !ok {
		return false
	}
	references := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if references {
			return false
		}
		if _, ok := node.(*ast.FuncLit); ok {
			return false
		}
		ident, ok := node.(*ast.Ident)
		if !ok {
			return true
		}
		obj, ok := semPkg.source.TypesInfo.Uses[ident].(*types.Var)
		if !ok || obj.Pkg() == nil || obj.Pkg().Path() != semPkg.pkgPath {
			return true
		}
		if idx, ok := varOrder[obj]; ok && idx > currentIdx {
			references = true
			return false
		}
		return true
	})
	return references
}

func initializerCallsFunctionReferencingLaterPackageVar(
	semPkg *semanticPackage,
	varOrder map[types.Object]int,
	current types.Object,
	expr ast.Expr,
) bool {
	currentIdx, ok := varOrder[current]
	if !ok {
		return false
	}
	references := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if references {
			return false
		}
		call, ok := node.(*ast.CallExpr)
		if !ok {
			return true
		}
		fn := calledFunction(semPkg.source, call.Fun)
		if fn == nil || fn.Pkg() == nil || fn.Pkg().Path() != semPkg.pkgPath {
			return true
		}
		if functionReferencesLaterPackageVar(semPkg, varOrder, currentIdx, fn, nil) {
			references = true
			return false
		}
		return true
	})
	return references
}

func functionReferencesLaterPackageVar(
	semPkg *semanticPackage,
	varOrder map[types.Object]int,
	currentIdx int,
	fn *types.Func,
	seen map[*types.Func]bool,
) bool {
	if fn == nil {
		return false
	}
	if seen == nil {
		seen = make(map[*types.Func]bool)
	}
	if seen[fn] {
		return false
	}
	seen[fn] = true
	fnDecl := functionDeclForObject(semPkg, fn)
	if fnDecl == nil || fnDecl.Body == nil {
		return false
	}
	references := false
	ast.Inspect(fnDecl.Body, func(node ast.Node) bool {
		if references {
			return false
		}
		if _, ok := node.(*ast.FuncLit); ok {
			return false
		}
		if ident, ok := node.(*ast.Ident); ok {
			if obj, ok := semPkg.source.TypesInfo.Uses[ident].(*types.Var); ok &&
				obj.Pkg() != nil && obj.Pkg().Path() == semPkg.pkgPath {
				if idx, ok := varOrder[obj]; ok && idx > currentIdx {
					references = true
					return false
				}
			}
		}
		if call, ok := node.(*ast.CallExpr); ok {
			called := calledFunction(semPkg.source, call.Fun)
			if called != nil && called.Pkg() != nil && called.Pkg().Path() == semPkg.pkgPath &&
				functionReferencesLaterPackageVar(semPkg, varOrder, currentIdx, called, seen) {
				references = true
				return false
			}
		}
		return true
	})
	return references
}

func functionDeclForObject(semPkg *semanticPackage, fn *types.Func) *ast.FuncDecl {
	if semPkg == nil || semPkg.source == nil || fn == nil {
		return nil
	}
	for _, file := range semPkg.source.Syntax {
		for _, decl := range file.Decls {
			fnDecl, ok := decl.(*ast.FuncDecl)
			if ok && semPkg.source.TypesInfo.Defs[fnDecl.Name] == fn {
				return fnDecl
			}
		}
	}
	return nil
}

func initializerReferencesOtherFileObject(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	sourcePath string,
	expr ast.Expr,
) bool {
	references := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if references {
			return false
		}
		ident, ok := node.(*ast.Ident)
		if !ok {
			return true
		}
		obj := semPkg.source.TypesInfo.Uses[ident]
		if obj == nil || obj.Pkg() == nil || obj.Pkg().Path() != semPkg.pkgPath {
			return true
		}
		if declFile := declFiles[obj]; declFile != "" && declFile != sourcePath {
			references = true
			return false
		}
		return true
	})
	return references
}

func zeroValueReferencesOtherFileObject(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	sourcePath string,
	typ types.Type,
) bool {
	return zeroValueReferencesOtherFileObjectSeen(semPkg, declFiles, sourcePath, typ, make(map[types.Type]bool))
}

func zeroValueReferencesOtherFileObjectSeen(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	sourcePath string,
	typ types.Type,
	seen map[types.Type]bool,
) bool {
	if typ == nil || seen[typ] {
		return false
	}
	seen[typ] = true
	if named := namedStructType(typ); named != nil {
		if obj := named.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() == semPkg.pkgPath {
			if declFile := declFiles[obj]; declFile != "" && declFile != sourcePath {
				return true
			}
		}
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Array:
		return zeroValueReferencesOtherFileObjectSeen(semPkg, declFiles, sourcePath, typed.Elem(), seen)
	case *types.Struct:
		for field := range typed.Fields() {
			if zeroValueReferencesOtherFileObjectSeen(semPkg, declFiles, sourcePath, field.Type(), seen) {
				return true
			}
		}
	}
	return false
}

func (o *LoweringOwner) lowerTupleValueSpec(
	ctx lowerFileContext,
	decl *ast.GenDecl,
	spec *ast.ValueSpec,
) ([]loweredDecl, []Diagnostic) {
	right, diagnostics := o.lowerTupleExpr(ctx, spec.Values[0])
	tempName := ctx.tempName("Tuple")
	lazyTuple := false
	if ctx.topLevel {
		for _, name := range spec.Names {
			obj := ctx.semPkg.source.TypesInfo.Defs[name]
			if obj != nil && ctx.lazyPackageVars[obj] {
				lazyTuple = true
				break
			}
		}
	}
	var decls []loweredDecl
	tupleExpr := tempName
	if lazyTuple {
		tupleGetterName := packageVarGetterName(tempName)
		decls = append(decls, loweredDecl{code: "var " + tempName + ": any = undefined as any"})
		decls = append(decls, loweredDecl{code: "function " + tupleGetterName + "(): any {\n\t" +
			"if (((" + tempName + ") as any) === undefined) {\n\t\t" +
			tempName + " = " + right + "\n\t}\n\treturn " + tempName + "\n}"})
		tupleExpr = tupleGetterName + "()"
	} else {
		decls = append(decls, loweredDecl{code: "const " + tempName + " = " + right})
	}
	for idx, name := range spec.Names {
		if name.Name == "_" {
			continue
		}
		obj := ctx.semPkg.source.TypesInfo.Defs[name]
		if obj == nil {
			continue
		}
		value := o.lowerDeclaredValue(ctx, name, tupleExpr+"["+strconv.Itoa(idx)+"]")
		keyword := "let"
		if _, ok := obj.(*types.Const); ok || decl.Tok == token.CONST {
			keyword = "const"
		}
		variableType := o.tsVariableTypeFor(ctx, obj.Type(), ctx.model.needsVarRef[obj])
		code := keyword + " " + o.lowerIdent(ctx, name, true) + ": " + variableType + " = " + value
		lazy := lazyTuple || ctx.topLevel && ctx.lazyPackageVars[obj]
		if lazy {
			keyword = "var"
			code = "var " + o.lowerIdent(ctx, name, true) + ": " + variableType + " = undefined as unknown as " + variableType
		}
		indexExport := ""
		if ctx.topLevel {
			code = "export " + code
			if ast.IsExported(name.Name) {
				indexExport = name.Name
			}
		}
		decls = append(decls, loweredDecl{code: code, indexExport: indexExport})
		if lazy {
			getterName := packageVarGetterName(name.Name)
			getterCode := "export function " + getterName + "(): " + variableType + " {\n\t" +
				"if (((" + o.lowerIdent(ctx, name, true) + ") as any) === undefined) {\n\t\t" +
				o.lowerIdent(ctx, name, true) + " = " + value + "\n\t}\n\treturn " + o.lowerIdent(ctx, name, true) + "\n}"
			getterIndexExport := ""
			if ast.IsExported(name.Name) {
				getterIndexExport = getterName
			}
			decls = append(decls, loweredDecl{code: getterCode, indexExport: getterIndexExport})
		}
	}
	return decls, diagnostics
}

func lowerConstantValue(value constant.Value) (string, bool) {
	if value == nil {
		return "", false
	}
	switch value.Kind() {
	case constant.Bool:
		return strconv.FormatBool(constant.BoolVal(value)), true
	case constant.String:
		return lowerGoStringLiteral(constant.StringVal(value)), true
	case constant.Int:
		if intValue, ok := constant.Int64Val(value); ok {
			return strconv.FormatInt(intValue, 10), true
		}
		if uintValue, ok := constant.Uint64Val(value); ok {
			return strconv.FormatUint(uintValue, 10), true
		}
		return value.ExactString(), true
	case constant.Float:
		return value.ExactString(), true
	case constant.Complex:
		real := constant.Real(value).ExactString()
		imag := constant.Imag(value).ExactString()
		return "$.complex(" + real + ", " + imag + ")", true
	default:
		return "", false
	}
}

func lowerLargeIntegerConstantValue(value constant.Value) (string, bool) {
	if value == nil || value.Kind() != constant.Int || constant.BitLen(value) <= 53 {
		return "", false
	}
	return value.ExactString(), true
}

func lowerWideIntegerConstantValue(value constant.Value) (string, bool) {
	if value == nil || value.Kind() != constant.Int || constant.BitLen(value) <= 53 {
		return "", false
	}
	return value.ExactString(), true
}

func lowerConstantStringByteSlice(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	if value == nil || value.Kind() != constant.String {
		return "", false
	}
	return byteSliceLiteral([]byte(constant.StringVal(value))), true
}

func lowerConstantStringLen(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	if value == nil || value.Kind() != constant.String {
		return "", false
	}
	return strconv.Itoa(len([]byte(constant.StringVal(value)))), true
}

func goEmbedPatterns(groups ...*ast.CommentGroup) []string {
	var patterns []string
	for _, group := range groups {
		if group == nil {
			continue
		}
		for _, comment := range group.List {
			text := strings.TrimSpace(comment.Text)
			if after, ok := strings.CutPrefix(text, "//"); ok {
				text = strings.TrimSpace(after)
			}
			if after, ok := strings.CutPrefix(text, "/*"); ok {
				text = strings.TrimSpace(strings.TrimSuffix(after, "*/"))
			}
			if !strings.HasPrefix(text, "go:embed") {
				continue
			}
			patterns = append(patterns, strings.Fields(strings.TrimSpace(strings.TrimPrefix(text, "go:embed")))...)
		}
	}
	return patterns
}

func (o *LoweringOwner) lowerGoEmbedValue(
	ctx lowerFileContext,
	diagPos token.Pos,
	typ types.Type,
	patterns []string,
) (string, []Diagnostic) {
	if isEmbedFSType(typ) {
		return o.lowerGoEmbedFSValue(ctx, diagPos, patterns)
	}
	if len(patterns) != 1 {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern list")}
	}
	cleanPattern, diagnostics := cleanGoEmbedFilePattern(ctx, diagPos, patterns[0])
	if len(diagnostics) != 0 {
		return "", diagnostics
	}
	data, diagnostics := readGoEmbedFile(ctx, cleanPattern)
	if len(diagnostics) != 0 {
		return "", diagnostics
	}
	if isStringType(typ) {
		return strconv.Quote(string(data)), nil
	}
	if slice, ok := types.Unalias(typ).Underlying().(*types.Slice); ok && isByteType(slice.Elem()) {
		return byteSliceLiteral(data), nil
	}
	diag := loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed target type")
	diag.Detail = "target type: " + types.TypeString(typ, func(pkg *types.Package) string {
		if pkg == nil {
			return ""
		}
		return pkg.Path()
	})
	return "", []Diagnostic{diag}
}

func (o *LoweringOwner) lowerGoEmbedFSValue(ctx lowerFileContext, diagPos token.Pos, patterns []string) (string, []Diagnostic) {
	embedAlias := ctx.importPaths["embed"]
	if embedAlias == "" {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed FS import")}
	}
	if len(patterns) == 0 {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern list")}
	}

	filesByPath := make(map[string][]byte)
	for _, pattern := range patterns {
		files, diagnostics := expandGoEmbedPattern(ctx, diagPos, pattern)
		if len(diagnostics) != 0 {
			return "", diagnostics
		}
		for _, file := range files {
			filesByPath[file.path] = file.data
		}
	}
	paths := make([]string, 0, len(filesByPath))
	for path := range filesByPath {
		paths = append(paths, path)
	}
	slices.Sort(paths)
	entries := make([]string, 0, len(paths))
	for _, path := range paths {
		entries = append(entries, "["+strconv.Quote(path)+", "+byteSliceLiteral(filesByPath[path])+"]")
	}
	builtinAlias := o.runtimeOwner.BuiltinImport().Alias
	return builtinAlias + ".markAsStructValue(new " + embedAlias + ".FS(new Map<string, Uint8Array>([" + strings.Join(entries, ", ") + "])))", nil
}

type goEmbedFile struct {
	path string
	data []byte
}

func cleanGoEmbedFilePattern(ctx lowerFileContext, diagPos token.Pos, pattern string) (string, []Diagnostic) {
	cleanPattern, _, diagnostics := cleanGoEmbedPattern(ctx, diagPos, pattern)
	if len(diagnostics) != 0 {
		return "", diagnostics
	}
	if strings.Contains(cleanPattern, "*") {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern")}
	}
	info, err := os.Stat(filepath.Join(filepath.Dir(ctx.sourcePath), filepath.FromSlash(cleanPattern)))
	if err != nil {
		return "", []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	if info.IsDir() {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed directory target")}
	}
	return cleanPattern, nil
}

func cleanGoEmbedPattern(ctx lowerFileContext, diagPos token.Pos, pattern string) (string, bool, []Diagnostic) {
	pattern = strings.Trim(pattern, "`\"")
	all := false
	if strings.HasPrefix(pattern, "all:") {
		all = true
		pattern = strings.TrimPrefix(pattern, "all:")
	}
	cleanPattern := path.Clean(pattern)
	if pattern == "" ||
		path.IsAbs(pattern) ||
		cleanPattern == "." ||
		cleanPattern == ".." ||
		strings.HasPrefix(cleanPattern, "../") {
		return "", false, []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern")}
	}
	return cleanPattern, all, nil
}

func expandGoEmbedPattern(ctx lowerFileContext, diagPos token.Pos, pattern string) ([]goEmbedFile, []Diagnostic) {
	cleanPattern, all, diagnostics := cleanGoEmbedPattern(ctx, diagPos, pattern)
	if len(diagnostics) != 0 {
		return nil, diagnostics
	}
	pkgDir := filepath.Dir(ctx.sourcePath)
	paths := []string{filepath.Join(pkgDir, filepath.FromSlash(cleanPattern))}
	if strings.Contains(cleanPattern, "*") {
		matches, err := filepath.Glob(filepath.Join(pkgDir, filepath.FromSlash(cleanPattern)))
		if err != nil {
			return nil, []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern")}
		}
		if len(matches) == 0 {
			return nil, []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "go:embed pattern matched no files")}
		}
		paths = matches
	}

	var files []goEmbedFile
	for _, path := range paths {
		collected, diagnostics := collectGoEmbedPath(ctx, diagPos, pkgDir, path, all)
		if len(diagnostics) != 0 {
			return nil, diagnostics
		}
		files = append(files, collected...)
	}
	slices.SortFunc(files, func(a, b goEmbedFile) int {
		return cmp.Compare(a.path, b.path)
	})
	return files, nil
}

func collectGoEmbedPath(ctx lowerFileContext, diagPos token.Pos, pkgDir, absPath string, all bool) ([]goEmbedFile, []Diagnostic) {
	info, err := os.Stat(absPath)
	if err != nil {
		return nil, []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	if !info.IsDir() {
		file, diagnostics := readGoEmbedAbsFile(ctx, pkgDir, absPath)
		if len(diagnostics) != 0 {
			return nil, diagnostics
		}
		return []goEmbedFile{file}, nil
	}

	var files []goEmbedFile
	if err := filepath.WalkDir(absPath, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path != absPath && !all && (strings.HasPrefix(entry.Name(), ".") || strings.HasPrefix(entry.Name(), "_")) {
			if entry.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if entry.IsDir() {
			return nil
		}
		file, diagnostics := readGoEmbedAbsFile(ctx, pkgDir, path)
		if len(diagnostics) != 0 {
			return fmt.Errorf("%s", diagnostics[0].Detail)
		}
		files = append(files, file)
		return nil
	}); err != nil {
		return nil, []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	if len(files) == 0 {
		return nil, []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "go:embed directory matched no files")}
	}
	return files, nil
}

func readGoEmbedFile(ctx lowerFileContext, cleanPattern string) ([]byte, []Diagnostic) {
	file, diagnostics := readGoEmbedAbsFile(ctx, filepath.Dir(ctx.sourcePath), filepath.Join(filepath.Dir(ctx.sourcePath), filepath.FromSlash(cleanPattern)))
	if len(diagnostics) != 0 {
		return nil, diagnostics
	}
	return file.data, nil
}

func readGoEmbedAbsFile(ctx lowerFileContext, pkgDir, absPath string) (goEmbedFile, []Diagnostic) {
	relPath, err := filepath.Rel(pkgDir, absPath)
	if err != nil {
		return goEmbedFile{}, []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	data, err := os.ReadFile(absPath)
	if err != nil {
		return goEmbedFile{}, []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	return goEmbedFile{path: filepath.ToSlash(relPath), data: data}, nil
}

func goEmbedReadDiagnostic(ctx lowerFileContext, err error) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/lowering:embed",
		Message:  "failed to read go:embed file",
		Detail:   ctx.semPkg.pkgPath + ": " + err.Error(),
	}
}

func isEmbedFSType(typ types.Type) bool {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return false
	}
	return named.Obj().Pkg().Path() == "embed" && named.Obj().Name() == "FS"
}

func byteSliceLiteral(data []byte) string {
	values := make([]string, 0, len(data))
	for _, value := range data {
		values = append(values, strconv.FormatUint(uint64(value), 10))
	}
	return "new Uint8Array([" + strings.Join(values, ", ") + "])"
}

func lowerGoStringLiteral(value string) string {
	if utf8.ValidString(value) {
		return strconv.Quote(value)
	}
	return "$.bytesToString(" + byteSliceLiteral([]byte(value)) + ")"
}

func (o *LoweringOwner) lowerTypeSpec(ctx lowerFileContext, spec *ast.TypeSpec) (loweredDecl, []Diagnostic) {
	obj, _ := ctx.semPkg.source.TypesInfo.Defs[spec.Name].(*types.TypeName)
	if obj == nil {
		return loweredDecl{}, nil
	}
	if alias, ok := obj.Type().(*types.Alias); ok {
		loweredType := o.tsTypeFor(ctx, alias.Rhs())
		if signature, ok := types.Unalias(alias.Rhs()).Underlying().(*types.Signature); ok {
			loweredType = o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
		}
		code := "type " + obj.Name() + " = " + loweredType
		typeIndexExport := ""
		if ctx.topLevel {
			code = "export " + code
			if ast.IsExported(obj.Name()) {
				typeIndexExport = obj.Name()
			}
		}
		return loweredDecl{code: code, typeIndexExport: typeIndexExport}, nil
	}
	named, _ := obj.Type().(*types.Named)
	if named == nil {
		return loweredDecl{}, nil
	}
	semType := ctx.model.types[named]
	if semType == nil {
		return loweredDecl{}, nil
	}
	if _, ok := named.Underlying().(*types.Struct); ok {
		lowered, diagnostics := o.lowerStructType(ctx, semType)
		return loweredDecl{structType: lowered}, diagnostics
	}
	if iface, ok := named.Underlying().(*types.Interface); ok {
		return o.lowerInterfaceType(ctx, semType, iface), nil
	}
	loweredType := o.tsTypeFor(ctx, named.Underlying())
	if signature, ok := named.Underlying().(*types.Signature); ok {
		loweredType = o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
	}
	typeName := safeIdentifier(semType.name)
	code := "type " + typeName + " = " + loweredType
	typeIndexExport := ""
	if ctx.topLevel {
		code = "export " + code
		if ast.IsExported(semType.name) {
			typeIndexExport = typeName
		}
	}
	return loweredDecl{code: code, typeIndexExport: typeIndexExport}, nil
}

func (o *LoweringOwner) lowerInterfaceType(ctx lowerFileContext, semType *semanticType, iface *types.Interface) loweredDecl {
	iface.Complete()
	typeName := safeIdentifier(semType.name)
	code := "type " + typeName + " = " + o.tsInterfaceType(ctx, iface)
	typeIndexExport := ""
	if ctx.topLevel {
		code = "export " + code
		if ast.IsExported(semType.name) {
			typeIndexExport = typeName
		}
	}
	code = code + "\n\n" + o.runtimeOwner.QualifiedHelper(RuntimeHelperRegisterInterfaceType) +
		"(\n\t" + strconv.Quote(runtimeNamedTypeName(semType.named)) +
		",\n\tnull,\n\t" + o.runtimeMethodSignatures(iface) + "\n);"
	return loweredDecl{code: code, typeIndexExport: typeIndexExport, sideEffect: true}
}

func (o *LoweringOwner) tsInterfaceType(ctx lowerFileContext, iface *types.Interface) string {
	if iface.NumMethods() == 0 {
		return "any"
	}
	methods := make([]string, 0, iface.NumMethods())
	for method := range iface.Methods() {
		methods = append(methods, o.tsMethodSignature(ctx, method))
	}
	return "{\n\t" + strings.Join(methods, "\n\t") + "\n}"
}

func (o *LoweringOwner) tsMethodSignature(ctx lowerFileContext, method *types.Func) string {
	signature, _ := method.Type().(*types.Signature)
	if signature == nil {
		return method.Name() + "(): unknown"
	}
	async := o.functionAsync(ctx, method)
	return method.Name() + "(" + o.tsSignatureParamsFor(ctx, signature, async) + "): " +
		asyncCompatibleMethodResultType(o.tsSignatureResultFor(ctx, signature), async)
}

func (o *LoweringOwner) runtimeMethodSignatures(iface *types.Interface) string {
	return o.runtimeMethodSignaturesWithSeen(iface, make(map[types.Type]bool))
}

func (o *LoweringOwner) runtimeMethodSignaturesWithSeen(iface *types.Interface, seen map[types.Type]bool) string {
	methods := make([]string, 0, iface.NumMethods())
	for method := range iface.Methods() {
		methods = append(methods, o.runtimeMethodSignature(method, seen))
	}
	return "[" + strings.Join(methods, ", ") + "]"
}

func (o *LoweringOwner) runtimeMethodSignature(method *types.Func, seen map[types.Type]bool) string {
	signature, _ := method.Type().(*types.Signature)
	if signature == nil {
		return "{ name: " + strconv.Quote(method.Name()) + ", args: [], returns: [] }"
	}
	return "{ name: " + strconv.Quote(method.Name()) +
		", args: " + o.runtimeMethodArgs(signature.Params(), seen) +
		", returns: " + o.runtimeMethodReturns(signature.Results(), seen) + " }"
}

func (o *LoweringOwner) runtimeMethodArgs(tuple *types.Tuple, seen map[types.Type]bool) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	args := make([]string, 0, tuple.Len())
	for idx := range tuple.Len() {
		param := tuple.At(idx)
		name := param.Name()
		if name == "" {
			name = "_p" + strconv.Itoa(idx)
		}
		args = append(args, "{ name: "+strconv.Quote(name)+", type: "+o.runtimeTypeInfoExprWithSeen(param.Type(), seen)+" }")
	}
	return "[" + strings.Join(args, ", ") + "]"
}

func (o *LoweringOwner) runtimeMethodReturns(tuple *types.Tuple, seen map[types.Type]bool) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	results := make([]string, 0, tuple.Len())
	for idx := range tuple.Len() {
		result := tuple.At(idx)
		name := result.Name()
		if name == "" {
			name = "_r" + strconv.Itoa(idx)
		}
		results = append(results, "{ name: "+strconv.Quote(name)+", type: "+o.runtimeTypeInfoExprWithSeen(result.Type(), seen)+" }")
	}
	return "[" + strings.Join(results, ", ") + "]"
}

func (o *LoweringOwner) lowerStructType(ctx lowerFileContext, semType *semanticType) (*loweredStruct, []Diagnostic) {
	lowered := &loweredStruct{
		exported:             ctx.topLevel,
		indexExported:        ctx.topLevel && ast.IsExported(semType.name),
		protobufPreserveJSON: ctx.protobufTSAdapter && o.protobufTypeScriptAdapterPreserveJSON(ctx, semType, make(map[*types.Named]bool)),
		name:                 safeIdentifier(semType.name),
		typeName:             runtimeNamedTypeName(semType.named),
		cloneMethod:          "clone",
		fields:               make([]loweredStructField, 0, len(semType.fields)),
	}
	for idx, field := range semType.fields {
		structValue := isStructValueType(field.typ)
		if named := namedStructType(field.typ); named != nil && crossPackageUnexportedNamedType(ctx, named) {
			structValue = false
		}
		fieldName := tsStructFieldName(field.name, idx)
		runtimeName := ""
		if fieldName != field.name {
			runtimeName = field.name
		}
		lowered.fields = append(lowered.fields, loweredStructField{
			name:        fieldName,
			runtimeName: runtimeName,
			typ:         o.tsStructFieldTypeFor(ctx, field.typ),
			zero:        o.lowerZeroValueExprFor(ctx, field.typ),
			runtimeType: o.runtimeTypeInfoExpr(field.typ),
			doc:         field.doc,
			tag:         field.tag,
			pkgPath:     field.pkgPath,
			index:       field.index,
			offset:      field.offset,
			anonymous:   field.embedded,
			exported:    field.exported,
			structValue: structValue,
			arrayValue:  isArrayType(field.typ),
		})
	}

	methodDecls := o.methodDeclsForType(ctx, semType.named)
	explicitMethods := make(map[string]bool, len(methodDecls))
	if len(methodDecls) != 0 {
		lowered.methods = make([]loweredFunction, 0, len(methodDecls))
		for _, methodDecl := range methodDecls {
			if methodDecl != nil {
				explicitMethods[methodDecl.Name.Name] = true
			}
		}
	}
	var diagnostics []Diagnostic
	for _, methodDecl := range methodDecls {
		lowerDecl := methodDecl
		methodSourcePath := sourcePos(ctx.semPkg.source, methodDecl.Pos()).file
		if ctx.protobufTSAdapter &&
			methodSourcePath == ctx.sourcePath &&
			protobufTypeScriptBindingReplacesMethodName(methodDecl.Name.Name) &&
			!(lowered.protobufPreserveJSON && protobufTypeScriptBindingJSONMethodName(methodDecl.Name.Name)) {
			bodyless := *methodDecl
			bodyless.Body = nil
			lowerDecl = &bodyless
		}
		method, methodDiagnostics := o.lowerFuncDecl(ctx, lowerDecl)
		diagnostics = append(diagnostics, methodDiagnostics...)
		if method != nil {
			if method.name == "clone" {
				lowered.cloneMethod = "__goscriptClone"
			}
			lowered.methods = append(lowered.methods, *method)
		}
	}
	for _, field := range semType.fields {
		methods := o.lowerEmbeddedMethodForwarders(ctx, field, explicitMethods)
		lowered.methods = append(lowered.methods, methods...)
	}
	return lowered, diagnostics
}

func (o *LoweringOwner) protobufTypeScriptAdapterPreserveJSON(
	ctx lowerFileContext,
	semType *semanticType,
	seen map[*types.Named]bool,
) bool {
	if semType == nil || semType.named == nil {
		return false
	}
	named := semType.named.Origin()
	if named == nil || seen[named] {
		return false
	}
	seen[named] = true
	for _, methodDecl := range o.methodDeclsForType(ctx, named) {
		if methodDecl == nil || !protobufTypeScriptBindingJSONMethodName(methodDecl.Name.Name) {
			continue
		}
		if sourcePos(ctx.semPkg.source, methodDecl.Pos()).file != ctx.sourcePath {
			return true
		}
	}
	for _, field := range semType.fields {
		if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, field.typ, seen) {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) protobufTypeScriptAdapterTypeHasCustomJSON(
	ctx lowerFileContext,
	typ types.Type,
	seen map[*types.Named]bool,
) bool {
	if typ == nil {
		return false
	}
	if alias, ok := typ.(*types.Alias); ok {
		if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, alias.Rhs(), seen) {
			return true
		}
		if args := alias.TypeArgs(); args != nil {
			for t := range args.Types() {
				if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, t, seen) {
					return true
				}
			}
		}
		return false
	}
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if o.protobufTypeScriptAdapterNamedTypeHasCustomJSON(ctx, named) {
			return true
		}
		if obj := named.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() == ctx.semPkg.pkgPath {
			semType := ctx.model.types[named]
			if semType == nil {
				semType = ctx.model.types[named.Origin()]
			}
			if semType != nil && o.protobufTypeScriptAdapterPreserveJSON(ctx, semType, seen) {
				return true
			}
		}
		origin := named.Origin()
		if origin != nil {
			if seen[origin] {
				return false
			}
			seen[origin] = true
		}
		if args := named.TypeArgs(); args != nil {
			for t := range args.Types() {
				if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, t, seen) {
					return true
				}
			}
		}
		if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, named.Underlying(), seen) {
			return true
		}
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Pointer:
		return o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Elem(), seen)
	case *types.Slice:
		return o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Elem(), seen)
	case *types.Array:
		return o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Elem(), seen)
	case *types.Map:
		return o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Key(), seen) ||
			o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Elem(), seen)
	case *types.Struct:
		for field := range typed.Fields() {
			if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, field.Type(), seen) {
				return true
			}
		}
	}
	return false
}

func (o *LoweringOwner) protobufTypeScriptAdapterNamedTypeHasCustomJSON(
	ctx lowerFileContext,
	named *types.Named,
) bool {
	if named == nil {
		return false
	}
	methodSet := types.NewMethodSet(types.NewPointer(named))
	for _, name := range []string{"MarshalJSON", "MarshalProtoJSON", "UnmarshalJSON", "UnmarshalProtoJSON"} {
		selection := methodSet.Lookup(nil, name)
		if selection == nil {
			continue
		}
		method, ok := selection.Obj().(*types.Func)
		if !ok {
			continue
		}
		sourcePath := sourcePos(ctx.semPkg.source, method.Pos()).file
		if sourcePath == "" || strings.HasSuffix(sourcePath, ".pb.go") {
			continue
		}
		return true
	}
	return false
}

func (o *LoweringOwner) lowerEmbeddedMethodForwarders(
	ctx lowerFileContext,
	field semanticField,
	explicitMethods map[string]bool,
) []loweredFunction {
	if !field.embedded {
		return nil
	}
	methodSetType := field.typ
	if named := namedStructType(field.typ); named != nil {
		methodSetType = types.NewPointer(field.typ)
	} else if pointerToNamedStructType(field.typ) != nil {
		methodSetType = field.typ
	} else if _, ok := types.Unalias(field.typ).Underlying().(*types.Interface); !ok {
		return nil
	}
	methodSet := types.NewMethodSet(methodSetType)
	if methodSet.Len() == 0 {
		return nil
	}
	var methods []loweredFunction
	for selection := range methodSet.Methods() {
		method, _ := selection.Obj().(*types.Func)
		if method == nil || explicitMethods[method.Name()] {
			continue
		}
		if !ast.IsExported(method.Name()) && method.Pkg() != nil && method.Pkg().Path() != ctx.semPkg.pkgPath {
			continue
		}
		signature, _ := method.Type().(*types.Signature)
		if signature == nil {
			continue
		}
		async := o.functionAsync(ctx, method)
		targetType := o.tsEmbeddedForwarderTargetType(ctx, field.typ)
		lowered := loweredFunction{
			async:            async,
			sourcePath:       ctx.sourcePath,
			name:             methodMemberName(method.Name()),
			runtimeName:      method.Name(),
			runtimeSignature: o.runtimeMethodSignature(method, make(map[types.Type]bool)),
			result:           asyncResultType("any", async),
			deferState:       &loweredDeferState{},
		}
		args := make([]string, 0, signature.Params().Len())
		for idx := range signature.Params().Len() {
			param := signature.Params().At(idx)
			name := safeParamName(param, idx)
			args = append(args, name)
			lowered.params = append(lowered.params, loweredParam{name: name, typ: "any"})
		}
		target := o.embeddedForwarderTargetExpr(ctx, field, selection, targetType)
		call := target + "." + method.Name() + "(" + strings.Join(args, ", ") + ")"
		if async {
			call = "await " + call
		}
		lowered.body = []loweredStmt{{text: "return " + call}}
		methods = append(methods, lowered)
		explicitMethods[method.Name()] = true
	}
	return methods
}

func (o *LoweringOwner) embeddedForwarderTargetExpr(
	ctx lowerFileContext,
	field semanticField,
	selection *types.Selection,
	targetType string,
) string {
	pointerValue := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue)
	expr := pointerValue + "<" + targetType + ">(this." + tsStructFieldName(field.name, 0) + ")"
	if selection == nil || len(selection.Index()) <= 1 {
		return expr
	}

	typ := field.typ
	for _, index := range selection.Index()[:len(selection.Index())-1] {
		structType, ok := types.Unalias(derefPointerType(typ)).Underlying().(*types.Struct)
		if !ok || index < 0 || index >= structType.NumFields() {
			return expr
		}
		field := structType.Field(index)
		expr += "." + tsStructFieldName(field.Name(), index)
		typ = field.Type()
		expr = o.embeddedForwarderSelectableExpr(ctx, typ, expr)
	}
	return expr
}

func (o *LoweringOwner) embeddedForwarderSelectableExpr(ctx lowerFileContext, typ types.Type, expr string) string {
	pointerValue := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue)
	if named := pointerToNamedStructType(typ); named != nil {
		return pointerValue + "<any>(" + expr + ")"
	}
	if _, ok := types.Unalias(typ).Underlying().(*types.Interface); ok {
		return pointerValue + "<any>(" + expr + ")"
	}
	return expr
}

func (o *LoweringOwner) tsEmbeddedForwarderTargetType(ctx lowerFileContext, typ types.Type) string {
	if named := pointerToNamedStructType(typ); named != nil {
		return o.namedTypeExpr(ctx, named)
	}
	if named := namedStructType(typ); named != nil {
		return o.namedTypeExpr(ctx, named)
	}
	return "Exclude<" + o.tsStructFieldTypeFor(ctx, typ) + ", null>"
}

func (o *LoweringOwner) methodDeclsForType(ctx lowerFileContext, named *types.Named) []*ast.FuncDecl {
	if named == nil {
		return nil
	}
	var methods []*ast.FuncDecl
	for _, file := range ctx.semPkg.source.Syntax {
		for _, decl := range file.Decls {
			fnDecl, ok := decl.(*ast.FuncDecl)
			if !ok || fnDecl.Recv == nil {
				continue
			}
			fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[fnDecl.Name].(*types.Func)
			if fnObj == nil {
				continue
			}
			signature, _ := fnObj.Type().(*types.Signature)
			if signature == nil || signature.Recv() == nil {
				continue
			}
			if sameNamedTypeOrigin(receiverNamedType(signature.Recv().Type()), named) {
				methods = append(methods, fnDecl)
			}
		}
	}
	slices.SortFunc(methods, func(a, b *ast.FuncDecl) int {
		return cmp.Compare(a.Name.Name, b.Name.Name)
	})
	return methods
}

func receiverNamedTypeFromDecl(ctx lowerFileContext, decl *ast.FuncDecl) *types.Named {
	if decl == nil || decl.Recv == nil {
		return nil
	}
	fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[decl.Name].(*types.Func)
	if fnObj == nil {
		return nil
	}
	signature, _ := fnObj.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return nil
	}
	return receiverNamedType(signature.Recv().Type())
}

func (o *LoweringOwner) lowerNamedReceiverMethodDecl(
	ctx lowerFileContext,
	decl *ast.FuncDecl,
	receiver *types.Named,
) (*loweredFunction, []Diagnostic) {
	fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[decl.Name].(*types.Func)
	if fnObj == nil {
		return nil, nil
	}
	signature, _ := fnObj.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return nil, nil
	}
	async := o.functionAsync(ctx, fnObj)
	functionCtx := ctx.withSignature(signature)
	resultCtx := functionCtx.withAsyncFunction(async)
	result := o.tsSignatureResultFor(resultCtx, signature)
	receiverName := "recv"
	if len(decl.Recv.List) != 0 && len(decl.Recv.List[0].Names) != 0 {
		receiverName = safeIdentifier(decl.Recv.List[0].Names[0].Name)
	}
	deferState := &loweredDeferState{}
	lowered := &loweredFunction{
		exported:      ctx.topLevel,
		indexExported: ctx.topLevel && (ast.IsExported(receiver.Obj().Name()) || ast.IsExported(decl.Name.Name)),
		async:         async,
		sourcePath:    sourcePos(ctx.semPkg.source, decl.Pos()).file,
		name:          methodFunctionName(receiver, decl.Name.Name),
		result:        asyncResultType(result, async),
		deferState:    deferState,
		params: []loweredParam{{
			name: receiverName,
			typ:  o.tsReceiverTypeFor(ctx, signature.Recv().Type()),
		}},
		namedResults: o.lowerNamedResults(ctx, signature),
	}
	if len(decl.Recv.List) != 0 && len(decl.Recv.List[0].Names) != 0 {
		receiverObj := ctx.semPkg.source.TypesInfo.Defs[decl.Recv.List[0].Names[0]]
		if _, receiverPointer := signature.Recv().Type().(*types.Pointer); !receiverPointer && receiverObj != nil && ctx.model.needsVarRef[receiverObj] {
			rawName := ctx.tempName("Receiver")
			lowered.params[0].name = rawName
			lowered.paramBindings = append(lowered.paramBindings, loweredStmt{
				text: "let " + receiverName + ": " + o.tsVariableTypeFor(ctx, receiverObj.Type(), true) + " = " +
					o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + rawName + ")",
			})
		}
	}
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		lowered.params, lowered.paramBindings = o.appendLoweredParam(ctx, lowered.params, lowered.paramBindings, param, idx, decl.Body == nil || async)
	}
	if decl.Body != nil {
		body, diagnostics := o.lowerBlock(ctx.withSignature(signature).withAsyncFunction(async).withDeferState(deferState), decl.Body)
		lowered.body = body
		if deferState.async && !lowered.async {
			lowered.async = true
			lowered.result = asyncResultType(o.tsSignatureResultFor(ctx.withAsyncFunction(true), signature), true)
		}
		return lowered, diagnostics
	}
	if zeroReturn, ok := o.lowerBodylessReturnStmt(ctx, signature); ok {
		lowered.body = []loweredStmt{{text: zeroReturn}}
	}
	return lowered, nil
}

func (o *LoweringOwner) lowerFuncDecl(ctx lowerFileContext, decl *ast.FuncDecl) (*loweredFunction, []Diagnostic) {
	fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[decl.Name].(*types.Func)
	if fnObj == nil {
		return nil, nil
	}
	signature, _ := fnObj.Type().(*types.Signature)
	if signature == nil {
		return nil, nil
	}
	async := o.functionAsync(ctx, fnObj)
	if decl.Name.Name == "main" {
		async = true
	}
	functionCtx := ctx.withSignature(signature)
	resultCtx := functionCtx.withAsyncFunction(async)
	result := o.tsSignatureResultFor(resultCtx, signature)
	deferState := &loweredDeferState{}
	name := safeIdentifier(decl.Name.Name)
	blankName := decl.Name.Name == "_"
	initFunc := ctx.topLevel && decl.Name.Name == "init" && decl.Recv == nil
	if blankName {
		name = ctx.tempName("BlankFunc")
	} else if initFunc {
		name = ctx.tempName("Init")
	}
	runtimeName := ""
	if decl.Recv != nil && !blankName {
		name = methodMemberName(decl.Name.Name)
		runtimeName = decl.Name.Name
	}
	lowered := &loweredFunction{
		exported:      ctx.topLevel && !blankName && !initFunc,
		indexExported: ctx.topLevel && !blankName && !initFunc && (ast.IsExported(decl.Name.Name) || decl.Name.Name == "main"),
		init:          initFunc,
		async:         async,
		sourcePath:    sourcePos(ctx.semPkg.source, decl.Pos()).file,
		name:          name,
		runtimeName:   runtimeName,
		result:        asyncResultType(result, async),
		deferState:    deferState,
		namedResults:  o.lowerNamedResults(functionCtx, signature),
	}
	if decl.Recv != nil {
		lowered.runtimeSignature = o.runtimeMethodSignature(fnObj, make(map[types.Type]bool))
	}
	if signature.TypeParams() != nil && signature.TypeParams().Len() != 0 {
		lowered.typeParams = signatureTypeParamNames(signature)
		lowered.params = append(lowered.params, loweredParam{
			name: "__typeArgs",
			typ:  "$.GenericTypeArgs | undefined",
		})
	}
	if decl.Recv != nil && len(decl.Recv.List) != 0 && len(decl.Recv.List[0].Names) != 0 {
		receiverName := decl.Recv.List[0].Names[0]
		lowered.receiverAlias = safeIdentifier(receiverName.Name)
		lowered.receiverValue = "this"
		recvObj := ctx.semPkg.source.TypesInfo.Defs[receiverName]
		lowered.receiverMutable = objectAssignedInBlock(ctx, recvObj, decl.Body)
		_, receiverPointer := signature.Recv().Type().(*types.Pointer)
		if receiverPointer {
			lowered.receiverType = o.tsReceiverTypeFor(ctx, signature.Recv().Type())
		} else if lowered.receiverMutable {
			lowered.receiverType = o.tsReceiverTypeFor(ctx, signature.Recv().Type())
		}
		if recvObj != nil && ctx.model.needsVarRef[recvObj] {
			lowered.receiverType = ""
			lowered.receiverValue = o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(this)"
		}
	}
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		lowered.params, lowered.paramBindings = o.appendLoweredParam(functionCtx, lowered.params, lowered.paramBindings, param, idx, decl.Body == nil || async)
	}
	if decl.Body != nil {
		body, diagnostics := o.lowerBlock(functionCtx.withAsyncFunction(async).withDeferState(deferState), decl.Body)
		lowered.body = body
		if deferState.async && !lowered.async {
			lowered.async = true
			lowered.result = asyncResultType(o.tsSignatureResultFor(functionCtx.withAsyncFunction(true), signature), true)
		}
		return lowered, diagnostics
	}
	if zeroReturn, ok := o.lowerBodylessReturnStmt(functionCtx, signature); ok {
		lowered.body = []loweredStmt{{text: zeroReturn}}
	}
	return lowered, nil
}

func objectAssignedInBlock(ctx lowerFileContext, obj types.Object, body *ast.BlockStmt) bool {
	if obj == nil || body == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	assigned := false
	ast.Inspect(body, func(node ast.Node) bool {
		if assigned {
			return false
		}
		switch typed := node.(type) {
		case *ast.FuncLit:
			return false
		case *ast.AssignStmt:
			for _, lhs := range typed.Lhs {
				if expressionUsesObject(ctx, lhs, obj) {
					assigned = true
					return false
				}
			}
		case *ast.IncDecStmt:
			if expressionUsesObject(ctx, typed.X, obj) {
				assigned = true
				return false
			}
		case *ast.RangeStmt:
			if expressionUsesObject(ctx, typed.Key, obj) || expressionUsesObject(ctx, typed.Value, obj) {
				assigned = true
				return false
			}
		}
		return true
	})
	return assigned
}

func rangeBindingAssignedInBody(ctx lowerFileContext, expr ast.Expr, body *ast.BlockStmt) bool {
	ident, ok := expr.(*ast.Ident)
	if !ok || ident.Name == "_" || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	obj := ctx.semPkg.source.TypesInfo.Defs[ident]
	if obj == nil {
		obj = ctx.semPkg.source.TypesInfo.Uses[ident]
	}
	return objectAssignedInBlock(ctx, obj, body)
}

func (o *LoweringOwner) lowerMapRangeBinding(
	ctx lowerFileContext,
	expr ast.Expr,
	name string,
	fallback string,
	tempPrefix string,
	declare bool,
) (string, []loweredStmt, []Diagnostic) {
	if expr == nil {
		return fallback, nil, nil
	}
	if ident, ok := expr.(*ast.Ident); ok && ident.Name == "_" {
		return fallback, nil, nil
	}
	if declare {
		obj := rangeBindingObject(ctx, expr)
		if name == "" || obj == nil || !ctx.model.needsVarRef[obj] {
			if name != "" {
				return name, nil, nil
			}
			return fallback, nil, nil
		}
		rawName := ctx.tempName(tempPrefix)
		value := rawName
		if isStructValueType(obj.Type()) {
			value = o.lowerStructClone(value)
		}
		return rawName, []loweredStmt{{
			text: "let " + name + ": " + o.tsVariableTypeFor(ctx, obj.Type(), true) + " = " +
				o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")",
		}}, nil
	}
	rawName := ctx.tempName(tempPrefix)
	left, diagnostics := o.lowerAssignmentTarget(ctx, expr, false)
	return rawName, []loweredStmt{{text: left + " = " + rawName}}, diagnostics
}

func rangeBindingObject(ctx lowerFileContext, expr ast.Expr) types.Object {
	ident, ok := expr.(*ast.Ident)
	if !ok || ident.Name == "_" || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	if obj := ctx.semPkg.source.TypesInfo.Defs[ident]; obj != nil {
		return obj
	}
	return ctx.semPkg.source.TypesInfo.Uses[ident]
}

func expressionUsesObject(ctx lowerFileContext, expr ast.Expr, obj types.Object) bool {
	if expr == nil || obj == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	if ident, ok := ast.Unparen(expr).(*ast.Ident); ok {
		return ctx.semPkg.source.TypesInfo.Uses[ident] == obj || ctx.semPkg.source.TypesInfo.Defs[ident] == obj
	}
	uses := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if uses {
			return false
		}
		ident, ok := node.(*ast.Ident)
		if !ok {
			return true
		}
		if ctx.semPkg.source.TypesInfo.Uses[ident] == obj || ctx.semPkg.source.TypesInfo.Defs[ident] == obj {
			uses = true
			return false
		}
		return true
	})
	return uses
}

func (o *LoweringOwner) appendLoweredParam(
	ctx lowerFileContext,
	params []loweredParam,
	bindings []loweredStmt,
	param *types.Var,
	idx int,
	asyncCompatible bool,
) ([]loweredParam, []loweredStmt) {
	name := safeParamName(param, idx)
	if param == nil {
		return append(params, loweredParam{name: name, typ: "unknown"}), bindings
	}
	typ := o.tsFuncParamTypeFor(ctx, param.Type(), asyncCompatible)
	if param.Name() == "" || param.Name() == "_" || !ctx.model.needsVarRef[param] {
		return append(params, loweredParam{name: name, typ: typ}), bindings
	}
	rawName := ctx.tempName("Param")
	params = append(params, loweredParam{name: rawName, typ: typ})
	bindings = append(bindings, loweredStmt{
		text: "let " + name + ": " + o.tsVariableTypeFor(ctx, param.Type(), true) + " = " +
			o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + rawName + ")",
	})
	return params, bindings
}

func (ctx lowerFileContext) withSignature(signature *types.Signature) lowerFileContext {
	ctx.signature = signature
	if signature != nil && signature.TypeParams() != nil && signature.TypeParams().Len() != 0 {
		next := make(map[string]bool, len(ctx.typeParams)+signature.TypeParams().Len())
		maps.Copy(next, ctx.typeParams)
		nextStatic := make(map[string]bool, len(ctx.staticTypeParams)+signature.TypeParams().Len())
		maps.Copy(nextStatic, ctx.staticTypeParams)
		for typeParam := range signature.TypeParams().TypeParams() {
			next[typeParam.Obj().Name()] = true
			if signatureUsesTypeParamAsSliceElem(signature, typeParam) {
				nextStatic[typeParam.Obj().Name()] = true
			}
		}
		ctx.typeParams = next
		ctx.staticTypeParams = nextStatic
	}
	return ctx
}

func (ctx lowerFileContext) withAsyncFunction(async bool) lowerFileContext {
	ctx.asyncFunction = async
	return ctx
}

func (ctx lowerFileContext) withFunctionTypeDepth(depth int) lowerFileContext {
	ctx.functionTypeDepth = depth
	return ctx
}

func (ctx lowerFileContext) withDeferState(deferState *loweredDeferState) lowerFileContext {
	ctx.deferState = deferState
	return ctx
}

func (ctx lowerFileContext) withLocalScope() lowerFileContext {
	ctx.topLevel = false
	ctx.functionScopedDecls = false
	return ctx
}

func (ctx lowerFileContext) withFunctionScopedDecls() lowerFileContext {
	ctx.functionScopedDecls = true
	return ctx
}

func declarationKeyword(ctx lowerFileContext) string {
	if ctx.functionScopedDecls {
		return "var "
	}
	return "let "
}

func (ctx lowerFileContext) withRangeBranch(branch *loweredRangeBranch) lowerFileContext {
	ctx.rangeBranch = branch
	ctx.rangeBreak = true
	ctx.rangeContinue = true
	return ctx
}

func (ctx lowerFileContext) withoutRangeBranch() lowerFileContext {
	ctx.rangeBranch = nil
	ctx.rangeBreak = false
	ctx.rangeContinue = false
	return ctx
}

func (ctx lowerFileContext) withoutRangeLoopBranches() lowerFileContext {
	ctx.rangeBreak = false
	ctx.rangeContinue = false
	return ctx
}

func (ctx lowerFileContext) withoutRangeBreak() lowerFileContext {
	ctx.rangeBreak = false
	return ctx
}

func (ctx lowerFileContext) withGotoLabels(labels map[string]bool) lowerFileContext {
	if len(ctx.gotoLabels) == 0 {
		ctx.gotoLabels = labels
		return ctx
	}
	merged := make(map[string]bool, len(ctx.gotoLabels)+len(labels))
	for label := range ctx.gotoLabels {
		merged[label] = true
	}
	for label := range labels {
		merged[label] = true
	}
	ctx.gotoLabels = merged
	return ctx
}

func (ctx lowerFileContext) withForwardGotos(labels map[string]bool) lowerFileContext {
	if len(ctx.forwardGotos) == 0 {
		ctx.forwardGotos = labels
		return ctx
	}
	merged := make(map[string]bool, len(ctx.forwardGotos)+len(labels))
	for label := range ctx.forwardGotos {
		merged[label] = true
	}
	for label := range labels {
		merged[label] = true
	}
	ctx.forwardGotos = merged
	return ctx
}

func (ctx lowerFileContext) withGotoState(labels map[string]bool, stateVar string, loopLabel string) lowerFileContext {
	ctx.gotoStateLabels = labels
	ctx.gotoStateVar = stateVar
	ctx.gotoStateLoop = loopLabel
	return ctx
}

func (ctx lowerFileContext) withLoopLabel(label string) lowerFileContext {
	ctx.loopLabel = label
	return ctx
}

func (ctx lowerFileContext) withoutLoopLabel() lowerFileContext {
	ctx.loopLabel = ""
	return ctx
}

func (ctx lowerFileContext) withSwitchBreak() lowerFileContext {
	ctx.switchBreak = true
	return ctx
}

func (o *LoweringOwner) lowerBlock(ctx lowerFileContext, block *ast.BlockStmt) ([]loweredStmt, []Diagnostic) {
	if block == nil {
		return nil, nil
	}
	return o.lowerStmtListAfter(ctx.withLocalScope(), block.List, sourceLine(ctx, block.Lbrace))
}

func (o *LoweringOwner) lowerStmt(ctx lowerFileContext, stmt ast.Stmt) ([]loweredStmt, []Diagnostic) {
	return o.lowerStmtInto(ctx, stmt, nil)
}

func (o *LoweringOwner) lowerStmtInto(ctx lowerFileContext, stmt ast.Stmt, out []loweredStmt) ([]loweredStmt, []Diagnostic) {
	switch typed := stmt.(type) {
	case *ast.DeclStmt:
		decls, diagnostics := o.lowerDecl(ctx, typed.Decl)
		stmts := make([]loweredStmt, 0, len(decls))
		for _, decl := range decls {
			if decl.code != "" {
				stmts = append(stmts, loweredStmt{text: decl.code})
				continue
			}
			if decl.structType != nil {
				var b strings.Builder
				renderStruct(&b, decl.structType, o.runtimeOwner)
				stmts = append(stmts, loweredStmt{text: strings.TrimRight(b.String(), "\n")})
			}
		}
		return append(out, stmts...), diagnostics
	case *ast.BlockStmt:
		body, diagnostics := o.lowerBlock(ctx, typed)
		return append(out, loweredStmt{hasBlock: true, children: body}), diagnostics
	case *ast.AssignStmt:
		stmts, diagnostics := o.lowerAssignStmt(ctx, typed)
		return append(out, stmts...), diagnostics
	case *ast.SendStmt:
		text, diagnostics := o.lowerSendStmt(ctx, typed)
		return append(out, loweredStmt{text: text}), diagnostics
	case *ast.GoStmt:
		text, diagnostics := o.lowerGoStmt(ctx, typed)
		return append(out, loweredStmt{text: text}), diagnostics
	case *ast.DeferStmt:
		text, diagnostics := o.lowerDeferStmt(ctx, typed)
		return append(out, loweredStmt{text: text}), diagnostics
	case *ast.ExprStmt:
		text, diagnostics := o.lowerExpr(ctx, typed.X)
		return append(out, loweredStmt{text: expressionStmtText(text)}), diagnostics
	case *ast.ReturnStmt:
		text, diagnostics := o.lowerReturnStmt(ctx, typed)
		return append(out, loweredStmt{text: text}), diagnostics
	case *ast.IfStmt:
		var diagnostics []Diagnostic
		var init []loweredStmt
		var initPrelude []loweredStmt
		initCtx := ctx
		scopeCtx := ctx
		if typed.Init != nil {
			if stmtCtx, nextCtx, prelude, ok := o.lowerShortDeclStatementContext(ctx, typed.Init); ok {
				initCtx = stmtCtx
				scopeCtx = nextCtx
				initPrelude = append(initPrelude, prelude...)
			}
			initStmts, initDiagnostics := o.lowerStmt(initCtx, typed.Init)
			diagnostics = append(diagnostics, initDiagnostics...)
			init = append(init, initStmts...)
		}
		cond, condDiagnostics := o.lowerExpr(scopeCtx, typed.Cond)
		diagnostics = append(diagnostics, condDiagnostics...)
		body, bodyDiagnostics := o.lowerBlock(scopeCtx, typed.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		stmt := loweredStmt{
			hasBlock: true,
			text:     "if (" + cond + ")",
			children: body,
		}
		if typed.Else != nil {
			elseBody, elseDiagnostics := o.lowerElse(scopeCtx, typed.Else)
			diagnostics = append(diagnostics, elseDiagnostics...)
			stmt.elseBody = elseBody
		}
		if len(init) != 0 {
			init = append(init, stmt)
			initPrelude = append(initPrelude, loweredStmt{children: init})
			return append(out, initPrelude...), diagnostics
		}
		return append(out, stmt), diagnostics
	case *ast.ForStmt:
		lowered, diagnostics := o.lowerForStmt(ctx, typed)
		return append(out, lowered), diagnostics
	case *ast.RangeStmt:
		lowered, diagnostics := o.lowerRangeStmt(ctx, typed)
		return append(out, lowered), diagnostics
	case *ast.SelectStmt:
		lowered, diagnostics := o.lowerSelectStmt(ctx, typed)
		return append(out, loweredStmt{selectStmt: lowered}), diagnostics
	case *ast.SwitchStmt:
		stmts, diagnostics := o.lowerSwitchStmt(ctx, typed)
		return append(out, stmts...), diagnostics
	case *ast.TypeSwitchStmt:
		stmts, diagnostics := o.lowerTypeSwitchStmt(ctx, typed)
		return append(out, stmts...), diagnostics
	case *ast.LabeledStmt:
		lowered, diagnostics := o.lowerStmt(ctx, typed.Stmt)
		if len(lowered) != 0 {
			label := safeIdentifier(typed.Label.Name)
			if lowered[0].text == "" {
				return append(out, loweredStmt{text: label + ":", children: lowered}), diagnostics
			}
			if labeledTextCannotPrefix(lowered[0].text) {
				out = append(out, loweredStmt{text: label + ":;"})
				return append(out, lowered...), diagnostics
			}
			lowered[0].text = label + ": " + lowered[0].text
		}
		return append(out, lowered...), diagnostics
	case *ast.IncDecStmt:
		if star, ok := unwrapParenExpr(typed.X).(*ast.StarExpr); ok {
			expr, diagnostics := o.lowerPointerStorageExpr(ctx, star.X)
			return append(out, loweredStmt{text: expr + typed.Tok.String()}), diagnostics
		}
		if index, ok := unwrapParenExpr(typed.X).(*ast.IndexExpr); ok && isMapType(ctx.semPkg.source.TypesInfo.TypeOf(index.X)) {
			right := "1"
			tok := token.ADD_ASSIGN
			if typed.Tok == token.DEC {
				tok = token.SUB_ASSIGN
			}
			stmts, diagnostics := o.lowerMapIndexUpdateStmts(ctx, index, tok, right, ctx.semPkg.source.TypesInfo.TypeOf(typed.X))
			return append(out, stmts...), diagnostics
		}
		if setter, ok := o.packageVarSetterForAssignment(ctx, typed.X); ok {
			expr, diagnostics := o.lowerExpr(ctx, typed.X)
			op := "+"
			if typed.Tok == token.DEC {
				op = "-"
			}
			return append(out, loweredStmt{text: setter + "(" + expr + " " + op + " 1)"}), diagnostics
		}
		expr, diagnostics := o.lowerExpr(ctx, typed.X)
		return append(out, loweredStmt{text: expr + typed.Tok.String()}), diagnostics
	case *ast.BranchStmt:
		if typed.Label != nil {
			switch typed.Tok {
			case token.BREAK, token.CONTINUE:
				return append(out, loweredStmt{text: typed.Tok.String() + " " + safeIdentifier(typed.Label.Name)}), nil
			case token.GOTO:
				label := safeIdentifier(typed.Label.Name)
				if ctx.gotoStateLabels[label] {
					return append(out,
						loweredStmt{text: ctx.gotoStateVar + " = " + strconv.Quote(label)},
						loweredStmt{text: "continue " + ctx.gotoStateLoop},
					), nil
				}
				if ctx.forwardGotos[label] {
					return append(out, loweredStmt{text: "break " + label}), nil
				}
				if ctx.gotoLabels[label] {
					return append(out, loweredStmt{text: "continue " + label}), nil
				}
				return out, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported goto branch to "+label)}
			default:
				return out, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported labeled branch")}
			}
		}
		switch typed.Tok {
		case token.BREAK, token.CONTINUE:
			if typed.Tok == token.BREAK && ctx.loopLabel != "" && !ctx.switchBreak {
				return append(out, loweredStmt{text: "break " + ctx.loopLabel}), nil
			}
			if typed.Tok == token.CONTINUE && ctx.loopLabel != "" {
				return append(out, loweredStmt{text: "continue " + ctx.loopLabel}), nil
			}
			if typed.Tok == token.BREAK && ctx.rangeBranch != nil && ctx.rangeBreak {
				return append(out, loweredStmt{text: "return false"}), nil
			}
			if typed.Tok == token.CONTINUE && ctx.rangeBranch != nil && ctx.rangeContinue {
				return append(out, loweredStmt{text: "return true"}), nil
			}
			return append(out, loweredStmt{text: typed.Tok.String()}), nil
		case token.FALLTHROUGH:
			return append(out, loweredStmt{text: "fallthrough"}), nil
		default:
			return out, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported branch")}
		}
	case *ast.EmptyStmt:
		return out, nil
	default:
		return out, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported statement kind")}
	}
}

func expressionStmtText(text string) string {
	trimmed := strings.TrimLeft(text, " \t")
	if strings.HasPrefix(trimmed, "(") || strings.HasPrefix(trimmed, "[") {
		return "void " + text
	}
	return text
}

func packageVarSetterName(name string) string {
	return "__goscript_set_" + safeIdentifier(name)
}

func packageVarGetterName(name string) string {
	return "__goscript_get_" + safeIdentifier(name)
}

func packageVarInitName(name string) string {
	return "__goscript_init_" + safeIdentifier(name)
}

func (o *LoweringOwner) lowerElse(ctx lowerFileContext, stmt ast.Stmt) ([]loweredStmt, []Diagnostic) {
	switch typed := stmt.(type) {
	case *ast.BlockStmt:
		return o.lowerBlock(ctx, typed)
	case *ast.IfStmt:
		return o.lowerStmt(ctx, typed)
	default:
		return nil, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported else statement")}
	}
}

func (o *LoweringOwner) lowerStmtList(ctx lowerFileContext, stmts []ast.Stmt) ([]loweredStmt, []Diagnostic) {
	return o.lowerStmtListAfter(ctx, stmts, 0)
}

func (o *LoweringOwner) lowerStmtListAfter(
	ctx lowerFileContext,
	stmts []ast.Stmt,
	prevEndLine int,
) ([]loweredStmt, []Diagnostic) {
	lowered := make([]loweredStmt, 0, len(stmts))
	var diagnostics []Diagnostic
	hasGoto := stmtListHasGoto(stmts)
	var gotoSpans map[string]int
	var gotoLabels map[string]bool
	var forwardStarts map[int]forwardGotoLabelSpan
	if hasGoto {
		gotoSpans = backwardGotoLabelSpans(stmts)
		gotoLabels = make(map[string]bool, len(gotoSpans))
		for label := range gotoSpans {
			gotoLabels[label] = true
		}
		forwardSpans := forwardGotoLabelSpans(stmts, gotoSpans)
		forwardStarts = make(map[int]forwardGotoLabelSpan, len(forwardSpans))
		for label, span := range forwardSpans {
			span.label = label
			group := forwardStarts[span.start]
			if group.forwardLabels == nil {
				group.forwardLabels = make(map[string]bool)
			}
			group.forwardLabels[label] = true
			if group.label == "" || span.labelIdx > group.labelIdx {
				group.label = span.label
				group.start = span.start
				group.labelIdx = span.labelIdx
			}
			forwardStarts[span.start] = group
		}
	}
	for idx := 0; idx < len(stmts); idx++ {
		stmt := stmts[idx]
		startLine := sourceLine(ctx, stmt.Pos())
		leading := leadingStmtLines(ctx, prevEndLine, startLine)
		if hasGoto {
			if cluster, ok := gotoStateClusterAt(stmts, idx); ok {
				clusterLowered, clusterDiagnostics := o.lowerGotoStateCluster(ctx, stmts, cluster, leading)
				diagnostics = append(diagnostics, clusterDiagnostics...)
				lowered = append(lowered, clusterLowered...)
				if endLine := sourceLine(ctx, stmts[cluster.endIdx].End()); endLine != 0 {
					prevEndLine = endLine
				}
				idx = cluster.endIdx
				continue
			}
			if span, ok := leadingGotoBackwardLoopSpan(stmts, idx, gotoSpans); ok {
				loop, loopDiagnostics := o.lowerBackwardGotoLoop(
					ctx,
					gotoLabels,
					span.label,
					span.labelIdx,
					span.endIdx,
					span.forwardLabel,
					stmts,
					leading,
				)
				diagnostics = append(diagnostics, loopDiagnostics...)
				lowered = append(lowered, loop...)
				if endLine := sourceLine(ctx, stmts[span.endIdx].End()); endLine != 0 {
					prevEndLine = endLine
				}
				idx = span.endIdx
				continue
			}
			if span, ok := forwardStarts[idx]; ok {
				bodyStmts := stmts[idx:span.labelIdx]
				body, bodyDiagnostics := o.lowerStmtListAfter(
					ctx.withForwardGotos(span.forwardLabels),
					bodyStmts,
					prevEndLine,
				)
				diagnostics = append(diagnostics, bodyDiagnostics...)
				block := loweredStmt{hasBlock: true, text: span.label + ":", children: body}
				if len(leading) != 0 {
					block.leading = append(leading, block.leading...)
				}
				lowered = append(lowered, block)
				if labeled, ok := stmts[span.labelIdx].(*ast.LabeledStmt); ok {
					labelLowered, labelDiagnostics := o.lowerStmt(ctx, labeled.Stmt)
					diagnostics = append(diagnostics, labelDiagnostics...)
					lowered = append(lowered, labelLowered...)
					if endLine := sourceLine(ctx, labeled.End()); endLine != 0 {
						prevEndLine = endLine
					}
				}
				idx = span.labelIdx
				continue
			}
			if labeled, ok := stmt.(*ast.LabeledStmt); ok {
				label := safeIdentifier(labeled.Label.Name)
				if endIdx, ok := gotoSpans[label]; ok {
					loop, loopDiagnostics := o.lowerBackwardGotoLoop(
						ctx,
						gotoLabels,
						label,
						idx,
						endIdx,
						"",
						stmts,
						leading,
					)
					diagnostics = append(diagnostics, loopDiagnostics...)
					lowered = append(lowered, loop...)
					if endLine := sourceLine(ctx, stmts[endIdx].End()); endLine != 0 {
						prevEndLine = endLine
					}
					idx = endIdx
					continue
				}
			}
		}
		if stmtCtx, nextCtx, ok := o.lowerDeclStatementContext(ctx, stmt); ok {
			start := len(lowered)
			var stmtDiagnostics []Diagnostic
			lowered, stmtDiagnostics = o.lowerStmtInto(stmtCtx, stmt, lowered)
			diagnostics = append(diagnostics, stmtDiagnostics...)
			if len(lowered) > start && len(leading) != 0 {
				lowered[start].leading = append(leading, lowered[start].leading...)
			}
			ctx = nextCtx
			if endLine := sourceLine(ctx, stmt.End()); endLine != 0 {
				prevEndLine = endLine
			}
			continue
		}
		if stmtCtx, nextCtx, prelude, ok := o.lowerShortDeclStatementContext(ctx, stmt); ok {
			stmtLowered, stmtDiagnostics := o.lowerStmt(stmtCtx, stmt)
			diagnostics = append(diagnostics, stmtDiagnostics...)
			if len(prelude) != 0 {
				if len(leading) != 0 {
					prelude[0].leading = append(leading, prelude[0].leading...)
				}
				lowered = append(lowered, prelude...)
			} else if len(stmtLowered) != 0 && len(leading) != 0 {
				stmtLowered[0].leading = append(leading, stmtLowered[0].leading...)
			}
			lowered = append(lowered, stmtLowered...)
			ctx = nextCtx
			if endLine := sourceLine(ctx, stmt.End()); endLine != 0 {
				prevEndLine = endLine
			}
			continue
		}
		start := len(lowered)
		var stmtDiagnostics []Diagnostic
		lowered, stmtDiagnostics = o.lowerStmtInto(ctx, stmt, lowered)
		diagnostics = append(diagnostics, stmtDiagnostics...)
		if len(lowered) > start && len(leading) != 0 {
			lowered[start].leading = append(leading, lowered[start].leading...)
		}
		if endLine := sourceLine(ctx, stmt.End()); endLine != 0 {
			prevEndLine = endLine
		}
	}
	return lowered, diagnostics
}

func (o *LoweringOwner) lowerDeclStatementContext(
	ctx lowerFileContext,
	stmt ast.Stmt,
) (lowerFileContext, lowerFileContext, bool) {
	declStmt, ok := stmt.(*ast.DeclStmt)
	if !ok {
		return ctx, ctx, false
	}
	genDecl, ok := declStmt.Decl.(*ast.GenDecl)
	if !ok || genDecl.Tok != token.VAR {
		return ctx, ctx, false
	}
	aliases := make(map[types.Object]string)
	for _, spec := range genDecl.Specs {
		valueSpec, ok := spec.(*ast.ValueSpec)
		if !ok {
			continue
		}
		for _, name := range valueSpec.Names {
			if name.Name == "_" {
				continue
			}
			def := ctx.semPkg.source.TypesInfo.Defs[name]
			if def == nil || aliases[def] != "" {
				continue
			}
			if shortDeclDefShadowsOuterName(ctx, name.Name, def) || valueSpecUsesOuterName(ctx, valueSpec, name.Name, def) {
				aliases[def] = ctx.tempName("Shadow")
			}
		}
	}
	if len(aliases) == 0 {
		return ctx, ctx, false
	}
	nextCtx := ctx.withIdentRefAliases(aliases)
	return nextCtx, nextCtx, true
}

type gotoStateCluster struct {
	startIdx      int
	firstLabelIdx int
	endIdx        int
	labels        []gotoStateLabel
}

type gotoStateLabel struct {
	name string
	idx  int
}

func gotoStateClusterAt(stmts []ast.Stmt, idx int) (gotoStateCluster, bool) {
	labelIndexes := make(map[string]int)
	for stmtIdx, stmt := range stmts {
		labeled, ok := stmt.(*ast.LabeledStmt)
		if !ok {
			continue
		}
		labelIndexes[safeIdentifier(labeled.Label.Name)] = stmtIdx
	}
	if len(labelIndexes) == 0 {
		return gotoStateCluster{}, false
	}

	startIdx := len(stmts)
	firstLabelIdx := len(stmts)
	endIdx := -1
	hasBackward := false
	for stmtIdx, stmt := range stmts {
		ast.Inspect(stmt, func(node ast.Node) bool {
			branch, ok := node.(*ast.BranchStmt)
			if !ok || branch.Tok != token.GOTO || branch.Label == nil {
				return true
			}
			labelIdx, ok := labelIndexes[safeIdentifier(branch.Label.Name)]
			if !ok {
				return true
			}
			if stmtIdx < startIdx {
				startIdx = stmtIdx
			}
			if labelIdx < firstLabelIdx {
				firstLabelIdx = labelIdx
			}
			if labelIdx > endIdx {
				endIdx = labelIdx
			}
			if stmtIdx > endIdx {
				endIdx = stmtIdx
			}
			if stmtIdx > labelIdx {
				hasBackward = true
			}
			return true
		})
	}
	if !hasBackward || startIdx != idx || endIdx < firstLabelIdx || firstLabelIdx == len(stmts) {
		return gotoStateCluster{}, false
	}

	var labels []gotoStateLabel
	for stmtIdx := firstLabelIdx; stmtIdx <= endIdx; stmtIdx++ {
		labeled, ok := stmts[stmtIdx].(*ast.LabeledStmt)
		if !ok {
			continue
		}
		labels = append(labels, gotoStateLabel{name: safeIdentifier(labeled.Label.Name), idx: stmtIdx})
	}
	if len(labels) == 0 {
		return gotoStateCluster{}, false
	}
	return gotoStateCluster{
		startIdx:      startIdx,
		firstLabelIdx: firstLabelIdx,
		endIdx:        endIdx,
		labels:        labels,
	}, true
}

func (o *LoweringOwner) lowerGotoStateCluster(
	ctx lowerFileContext,
	stmts []ast.Stmt,
	cluster gotoStateCluster,
	leading []string,
) ([]loweredStmt, []Diagnostic) {
	stateVar := ctx.tempName("GotoState")
	loopLabel := ctx.tempName("GotoLoop")
	labels := make(map[string]bool, len(cluster.labels))
	for _, label := range cluster.labels {
		labels[label.name] = true
	}
	stateCtx := ctx.withGotoState(labels, stateVar, loopLabel).withFunctionScopedDecls()

	var diagnostics []Diagnostic
	initialState := cluster.labels[0].name
	var cases []loweredSwitchCase
	if cluster.startIdx < cluster.firstLabelIdx {
		initialState = "__entry"
		body, bodyDiagnostics := o.lowerStmtListAfter(stateCtx, stmts[cluster.startIdx:cluster.firstLabelIdx], 0)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		body = append(body,
			loweredStmt{text: stateVar + " = " + strconv.Quote(cluster.labels[0].name)},
			loweredStmt{text: "continue " + loopLabel},
		)
		cases = append(cases, loweredSwitchCase{
			values: []string{strconv.Quote(initialState)},
			body:   body,
		})
	}

	for idx, label := range cluster.labels {
		nextIdx := cluster.endIdx + 1
		nextState := ""
		if idx+1 < len(cluster.labels) {
			nextIdx = cluster.labels[idx+1].idx
			nextState = cluster.labels[idx+1].name
		}
		labeled, _ := stmts[label.idx].(*ast.LabeledStmt)
		segment := make([]ast.Stmt, 0, nextIdx-label.idx)
		segment = append(segment, labeled.Stmt)
		segment = append(segment, stmts[label.idx+1:nextIdx]...)
		body, bodyDiagnostics := o.lowerStmtListAfter(stateCtx, segment, sourceLine(ctx, labeled.Label.End()))
		diagnostics = append(diagnostics, bodyDiagnostics...)
		if nextState != "" {
			body = append(body,
				loweredStmt{text: stateVar + " = " + strconv.Quote(nextState)},
				loweredStmt{text: "continue " + loopLabel},
			)
		} else {
			body = append(body, loweredStmt{text: "break " + loopLabel})
		}
		cases = append(cases, loweredSwitchCase{
			values: []string{strconv.Quote(label.name)},
			body:   body,
		})
	}

	dispatch := loweredStmt{
		hasBlock: true,
		text:     loopLabel + ": while (true)",
		children: []loweredStmt{
			{switchStmt: &loweredSwitch{value: stateVar, cases: cases}},
			{text: "break"},
		},
	}
	init := loweredStmt{text: "let " + stateVar + " = " + strconv.Quote(initialState)}
	if len(leading) != 0 {
		init.leading = append(leading, init.leading...)
	}
	return []loweredStmt{init, dispatch}, diagnostics
}

func (o *LoweringOwner) lowerShortDeclStatementContext(
	ctx lowerFileContext,
	stmt ast.Stmt,
) (lowerFileContext, lowerFileContext, []loweredStmt, bool) {
	assign, ok := stmt.(*ast.AssignStmt)
	if !ok || assign.Tok != token.DEFINE {
		return ctx, ctx, nil, false
	}
	oldAliases, prelude := o.lowerShortDeclShadowAliases(ctx, assign)
	newAliases := o.lowerShortDeclNewShadowAliases(ctx, assign)
	if len(oldAliases) == 0 && len(newAliases) == 0 {
		return ctx, ctx, nil, false
	}
	stmtCtx := ctx.withIdentAliases(oldAliases).withIdentRefAliases(newAliases)
	return stmtCtx, ctx.withIdentRefAliases(newAliases), prelude, true
}

func (o *LoweringOwner) lowerBackwardGotoLoop(
	ctx lowerFileContext,
	gotoLabels map[string]bool,
	label string,
	labelIdx int,
	endIdx int,
	initialForwardLabel string,
	stmts []ast.Stmt,
	leading []string,
) ([]loweredStmt, []Diagnostic) {
	labeled, ok := stmts[labelIdx].(*ast.LabeledStmt)
	if !ok {
		return nil, nil
	}

	var lowered []loweredStmt
	var body []loweredStmt
	var diagnostics []Diagnostic
	bodyCtx := ctx.withGotoLabels(gotoLabels).withFunctionScopedDecls()
	if initialForwardLabel != "" {
		skipVar := ctx.tempName("Skip")
		init := loweredStmt{text: "let " + skipVar + " = true"}
		if len(leading) != 0 {
			init.leading = append(leading, init.leading...)
		}
		lowered = append(lowered, init)
		first, firstDiagnostics := o.lowerStmt(bodyCtx, labeled.Stmt)
		diagnostics = append(diagnostics, firstDiagnostics...)
		body = append(body, loweredStmt{hasBlock: true, text: "if (!" + skipVar + ")", children: first})
		body = append(body, loweredStmt{text: skipVar + " = false"})
	} else {
		first, firstDiagnostics := o.lowerStmt(bodyCtx, labeled.Stmt)
		diagnostics = append(diagnostics, firstDiagnostics...)
		body = append(body, first...)
	}
	rest, restDiagnostics := o.lowerStmtListAfter(
		bodyCtx,
		stmts[labelIdx+1:endIdx+1],
		sourceLine(ctx, labeled.Label.End()),
	)
	diagnostics = append(diagnostics, restDiagnostics...)
	body = append(body, rest...)
	body = append(body, loweredStmt{text: "break"})
	loop := loweredStmt{hasBlock: true, text: label + ": while (true)", children: body}
	if initialForwardLabel == "" && len(leading) != 0 {
		loop.leading = append(leading, loop.leading...)
	}
	lowered = append(lowered, loop)
	return lowered, diagnostics
}

type forwardGotoLabelSpan struct {
	label         string
	start         int
	labelIdx      int
	forwardLabels map[string]bool
}

type leadingGotoBackwardLoop struct {
	label        string
	labelIdx     int
	endIdx       int
	forwardLabel string
}

func stmtListNeedsLoopBranchLabel(stmts []ast.Stmt) bool {
	if !stmtListHasGoto(stmts) {
		return false
	}
	return len(backwardGotoLabelSpans(stmts)) != 0
}

func stmtListHasGoto(stmts []ast.Stmt) bool {
	for _, stmt := range stmts {
		hasGoto := false
		ast.Inspect(stmt, func(node ast.Node) bool {
			branch, ok := node.(*ast.BranchStmt)
			if ok && branch.Tok == token.GOTO && branch.Label != nil {
				hasGoto = true
				return false
			}
			return !hasGoto
		})
		if hasGoto {
			return true
		}
	}
	return false
}

func backwardGotoLabelSpans(stmts []ast.Stmt) map[string]int {
	seenLabels := make(map[string]bool)
	spans := make(map[string]int)
	for idx, stmt := range stmts {
		if labeled, ok := stmt.(*ast.LabeledStmt); ok {
			seenLabels[safeIdentifier(labeled.Label.Name)] = true
		}
		ast.Inspect(stmt, func(node ast.Node) bool {
			branch, ok := node.(*ast.BranchStmt)
			if !ok || branch.Tok != token.GOTO || branch.Label == nil {
				return true
			}
			label := safeIdentifier(branch.Label.Name)
			if seenLabels[label] {
				spans[label] = idx
			}
			return true
		})
	}
	for label, idx := range spans {
		if idx+1 < len(stmts) {
			if _, ok := stmts[idx+1].(*ast.ReturnStmt); ok {
				spans[label] = idx + 1
			}
		}
	}
	return spans
}

func leadingGotoBackwardLoopSpan(stmts []ast.Stmt, idx int, backwardSpans map[string]int) (leadingGotoBackwardLoop, bool) {
	if idx+1 >= len(stmts) {
		return leadingGotoBackwardLoop{}, false
	}
	branch, ok := stmts[idx].(*ast.BranchStmt)
	if !ok || branch.Tok != token.GOTO || branch.Label == nil {
		return leadingGotoBackwardLoop{}, false
	}
	nextLabel, ok := stmts[idx+1].(*ast.LabeledStmt)
	if !ok {
		return leadingGotoBackwardLoop{}, false
	}
	label := safeIdentifier(nextLabel.Label.Name)
	endIdx, ok := backwardSpans[label]
	if !ok {
		return leadingGotoBackwardLoop{}, false
	}
	forwardLabel := safeIdentifier(branch.Label.Name)
	for labelIdx := idx + 1; labelIdx <= endIdx; labelIdx++ {
		labeled, ok := stmts[labelIdx].(*ast.LabeledStmt)
		if !ok || safeIdentifier(labeled.Label.Name) != forwardLabel {
			continue
		}
		return leadingGotoBackwardLoop{
			label:        label,
			labelIdx:     idx + 1,
			endIdx:       endIdx,
			forwardLabel: forwardLabel,
		}, true
	}
	return leadingGotoBackwardLoop{}, false
}

func forwardGotoLabelSpans(stmts []ast.Stmt, backwardSpans map[string]int) map[string]forwardGotoLabelSpan {
	labelIndexes := make(map[string]int)
	for idx, stmt := range stmts {
		labeled, ok := stmt.(*ast.LabeledStmt)
		if !ok {
			continue
		}
		label := safeIdentifier(labeled.Label.Name)
		if _, isBackward := backwardSpans[label]; isBackward {
			continue
		}
		labelIndexes[label] = idx
	}
	spans := make(map[string]forwardGotoLabelSpan)
	for idx, stmt := range stmts {
		ast.Inspect(stmt, func(node ast.Node) bool {
			branch, ok := node.(*ast.BranchStmt)
			if !ok || branch.Tok != token.GOTO || branch.Label == nil {
				return true
			}
			label := safeIdentifier(branch.Label.Name)
			labelIdx, ok := labelIndexes[label]
			if !ok || labelIdx <= idx {
				return true
			}
			span, ok := spans[label]
			if !ok || idx < span.start {
				spans[label] = forwardGotoLabelSpan{
					start:    idx,
					labelIdx: labelIdx,
				}
			}
			return true
		})
	}
	return spans
}

func leadingStmtLines(ctx lowerFileContext, prevEndLine int, startLine int) []string {
	if prevEndLine == 0 || startLine == 0 || startLine <= prevEndLine+1 {
		return nil
	}
	if ctx.file == nil || ctx.semPkg == nil || ctx.semPkg.source == nil || ctx.semPkg.source.Fset == nil {
		return []string{""}
	}

	var lines []string
	lastLine := prevEndLine
	for _, group := range ctx.file.Comments {
		groupStart := sourceLine(ctx, group.Pos())
		groupEnd := sourceLine(ctx, group.End())
		if groupStart <= prevEndLine || groupEnd >= startLine {
			continue
		}
		if groupStart > lastLine+1 {
			lines = append(lines, "")
		}
		for _, comment := range group.List {
			for line := range strings.SplitSeq(comment.Text, "\n") {
				lines = append(lines, line)
			}
		}
		lastLine = groupEnd
	}
	if startLine > lastLine+1 {
		lines = append(lines, "")
	}
	return lines
}

func sourceLine(ctx lowerFileContext, pos token.Pos) int {
	if ctx.semPkg == nil || ctx.semPkg.source == nil || ctx.semPkg.source.Fset == nil || !pos.IsValid() {
		return 0
	}
	return ctx.semPkg.source.Fset.Position(pos).Line
}

func (o *LoweringOwner) lowerSendStmt(ctx lowerFileContext, stmt *ast.SendStmt) (string, []Diagnostic) {
	channel, channelDiagnostics := o.lowerExpr(ctx, stmt.Chan)
	value, valueDiagnostics := o.lowerExpr(ctx, stmt.Value)
	diagnostics := append(channelDiagnostics, valueDiagnostics...)
	if channelType, _ := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(stmt.Chan)).Underlying().(*types.Chan); channelType != nil {
		value = o.lowerValueForTarget(ctx, stmt.Value, channelType.Elem(), value)
	}
	return "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanSend) + "(" + channel + ", " + value + ")", diagnostics
}

func (o *LoweringOwner) lowerGoStmt(ctx lowerFileContext, stmt *ast.GoStmt) (string, []Diagnostic) {
	goCtx := ctx
	goCtx.deferState = nil
	call, diagnostics := o.lowerCallExpr(goCtx, stmt.Call)
	return "queueMicrotask(async () => { " + call + " })", diagnostics
}

func (o *LoweringOwner) lowerDeferStmt(ctx lowerFileContext, stmt *ast.DeferStmt) (string, []Diagnostic) {
	if nestedCall, ok := stmt.Call.Fun.(*ast.CallExpr); ok {
		callee, diagnostics := o.lowerCallExpr(ctx, nestedCall)
		args, argDiagnostics := o.lowerCallArgs(ctx, stmt.Call, callTargetSignature(ctx, stmt.Call.Fun))
		diagnostics = append(diagnostics, argDiagnostics...)
		calleeTemp := ctx.tempName("DeferCallee")
		call := o.lowerCallableExpr(ctx, stmt.Call.Fun, calleeTemp) + "(" + strings.Join(args, ", ") + ")"
		call = o.awaitCallIfNeeded(ctx, stmt.Call.Fun, call)
		async := strings.Contains(callee, "await ") || strings.Contains(call, "await ")
		if ctx.deferState != nil {
			ctx.deferState.used = true
			if async {
				ctx.deferState.async = true
			}
		}
		if async {
			return "const " + calleeTemp + " = " + callee + "\n__defer.defer(async () => { " + call + " })", diagnostics
		}
		return "const " + calleeTemp + " = " + callee + "\n__defer.defer(() => { " + call + " })", diagnostics
	}
	call, diagnostics := o.lowerCallExpr(ctx, stmt.Call)
	async := strings.Contains(call, "await ")
	if ctx.deferState != nil {
		ctx.deferState.used = true
		if async {
			ctx.deferState.async = true
		}
	}
	if async {
		return "__defer.defer(async () => { " + call + " })", diagnostics
	}
	return "__defer.defer(() => { " + call + " })", diagnostics
}

func (o *LoweringOwner) lowerAssignStmt(ctx lowerFileContext, stmt *ast.AssignStmt) ([]loweredStmt, []Diagnostic) {
	if len(stmt.Rhs) == 1 && isChannelReceiveExpr(stmt.Rhs[0]) {
		return o.lowerChannelReceiveAssignStmt(ctx, stmt)
	}
	if len(stmt.Lhs) == 1 && len(stmt.Rhs) == 1 {
		if ident, ok := stmt.Lhs[0].(*ast.Ident); ok && ident.Name == "_" {
			right, diagnostics := o.lowerExpr(ctx, stmt.Rhs[0])
			return []loweredStmt{{text: right}}, diagnostics
		}
	}
	if len(stmt.Rhs) == 1 && len(stmt.Lhs) > 1 {
		if allBlankIdents(stmt.Lhs) {
			right, diagnostics := o.lowerTupleExpr(ctx, stmt.Rhs[0])
			return []loweredStmt{{text: right}}, diagnostics
		}
		right, diagnostics := o.lowerTupleExpr(ctx, stmt.Rhs[0])
		lefts := make([]string, 0, len(stmt.Lhs))
		for _, lhs := range stmt.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
				lefts = append(lefts, "")
				continue
			}
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, stmt.Tok == token.DEFINE)
			diagnostics = append(diagnostics, leftDiagnostics...)
			lefts = append(lefts, left)
		}
		prefix := ""
		if stmt.Tok == token.DEFINE {
			prefix = declarationKeyword(ctx)
			if !allShortAssignTargetsNew(ctx, stmt.Lhs) || o.tupleDeclarationNeedsElementStatements(ctx, stmt) {
				return o.lowerTupleReassignmentStmt(ctx, stmt, right, diagnostics)
			}
			return []loweredStmt{{text: prefix + "[" + strings.Join(lefts, ", ") + "] = " + right}}, diagnostics
		}
		return o.lowerTupleReassignmentStmt(ctx, stmt, right, diagnostics)
	}
	if len(stmt.Rhs) > 1 && len(stmt.Lhs) == len(stmt.Rhs) && stmt.Tok == token.ASSIGN {
		return o.lowerParallelAssignStmt(ctx, stmt)
	}

	stmts := make([]loweredStmt, 0, len(stmt.Lhs))
	var diagnostics []Diagnostic
	for idx, lhs := range stmt.Lhs {
		if idx >= len(stmt.Rhs) {
			break
		}
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		isShortDecl := stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs)
		right, rightDiagnostics := o.lowerExpr(ctx, stmt.Rhs[idx])
		diagnostics = append(diagnostics, rightDiagnostics...)
		targetType := assignmentTargetType(ctx, lhs)
		right = o.lowerValueForTarget(ctx, stmt.Rhs[idx], targetType, right)
		if targetType != nil && genericCallResultUsesTypeParam(ctx, stmt.Rhs[idx]) {
			right = "(" + right + " as " + o.tsTypeFor(ctx, targetType) + ")"
		}
		if setter, ok := o.packageVarSetterForAssignment(ctx, lhs); ok {
			value, ok := o.packageVarAssignmentValue(ctx, lhs, targetType, right, stmt.Tok)
			if !ok {
				value = right
			}
			stmts = append(stmts, loweredStmt{text: setter + "(" + value + ")"})
			continue
		}
		if index, ok := lhs.(*ast.IndexExpr); ok && isMapType(ctx.semPkg.source.TypesInfo.TypeOf(index.X)) && stmt.Tok != token.DEFINE {
			update, updateDiagnostics := o.lowerMapIndexUpdateStmts(ctx, index, stmt.Tok, right, targetType)
			diagnostics = append(diagnostics, updateDiagnostics...)
			stmts = append(stmts, update...)
			continue
		}
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, isShortDecl)
		diagnostics = append(diagnostics, leftDiagnostics...)
		star, starTarget := unwrapParenExpr(lhs).(*ast.StarExpr)
		if starTarget && stmt.Tok == token.ASSIGN && isStructValueType(targetType) {
			pointer, pointerDiagnostics := o.lowerPointerValueExpr(ctx, star.X)
			diagnostics = append(diagnostics, pointerDiagnostics...)
			stmts = append(stmts, loweredStmt{text: o.runtimeOwner.QualifiedHelper(RuntimeHelperAssignStruct) + "(" + pointer + ", " + right + ")"})
			continue
		}
		if starTarget && stmt.Tok == token.ASSIGN {
			pointer, pointerDiagnostics := o.lowerPointerStorageExpr(ctx, star.X)
			diagnostics = append(diagnostics, pointerDiagnostics...)
			stmts = append(stmts, loweredStmt{text: pointer + " = " + right})
			continue
		}
		if starTarget && stmt.Tok != token.DEFINE {
			pointer, pointerDiagnostics := o.lowerPointerStorageExpr(ctx, star.X)
			diagnostics = append(diagnostics, pointerDiagnostics...)
			if value, ok := integerQuotientAssignExpr(targetType, pointer, right, stmt.Tok); ok {
				stmts = append(stmts, loweredStmt{text: value})
				continue
			}
			stmts = append(stmts, loweredStmt{text: pointer + " = " + lowerCompoundAssignValue(o.runtimeOwner, targetType, pointer, right, stmt.Tok)})
			continue
		}
		if isShortDecl {
			if ident, ok := lhs.(*ast.Ident); ok {
				right = o.lowerDeclaredValue(ctx, ident, right)
			}
			stmts = append(stmts, loweredStmt{text: declarationKeyword(ctx) + left + o.shortDeclTypeAnnotation(ctx, lhs, stmt.Rhs[idx]) + " = " + right})
			continue
		}
		if helper, ok := wideIntegerAssignHelper(targetType, stmt.Tok); ok {
			stmts = append(stmts, loweredStmt{text: left + " = " + o.runtimeOwner.QualifiedHelper(helper) + "(" + left + ", " + right + ")"})
			continue
		}
		if value, ok := integerQuotientAssignExpr(targetType, left, right, stmt.Tok); ok {
			stmts = append(stmts, loweredStmt{text: value})
			continue
		}
		op := stmt.Tok.String()
		if stmt.Tok == token.DEFINE {
			op = "="
		}
		if stmt.Tok != token.ASSIGN && stmt.Tok != token.DEFINE {
			stmts = append(stmts, loweredStmt{text: left + " = " + lowerCompoundAssignValue(o.runtimeOwner, targetType, left, right, stmt.Tok)})
			continue
		}
		stmts = append(stmts, loweredStmt{text: left + " " + op + " " + right})
	}
	return stmts, diagnostics
}

func (o *LoweringOwner) lowerMapIndexUpdateStmts(
	ctx lowerFileContext,
	index *ast.IndexExpr,
	tok token.Token,
	right string,
	targetType types.Type,
) ([]loweredStmt, []Diagnostic) {
	mapExpr, mapDiagnostics := o.lowerExpr(ctx, index.X)
	keyExpr, keyDiagnostics := o.lowerExpr(ctx, index.Index)
	diagnostics := append(mapDiagnostics, keyDiagnostics...)
	if tok == token.ASSIGN {
		return []loweredStmt{{text: o.runtimeOwner.QualifiedHelper(RuntimeHelperMapSet) + "(" + mapExpr + ", " + keyExpr + ", " + right + ")"}}, diagnostics
	}
	mapTemp := ctx.tempName("Map")
	keyTemp := ctx.tempName("MapKey")
	current := o.lowerMapGetValue(ctx, index, mapTemp, keyTemp)
	value := lowerCompoundAssignValue(o.runtimeOwner, targetType, current, right, tok)
	return []loweredStmt{
		{text: "const " + mapTemp + " = " + mapExpr},
		{text: "const " + keyTemp + " = " + keyExpr},
		{text: o.runtimeOwner.QualifiedHelper(RuntimeHelperMapSet) + "(" + mapTemp + ", " + keyTemp + ", " + value + ")"},
	}, diagnostics
}

func lowerCompoundAssignValue(
	runtimeOwner *RuntimeContractOwner,
	targetType types.Type,
	left string,
	right string,
	tok token.Token,
) string {
	if helper, ok := wideIntegerAssignHelper(targetType, tok); ok {
		return runtimeOwner.QualifiedHelper(helper) + "(" + left + ", " + right + ")"
	}
	if value, ok := integerQuotientAssignValueExpr(targetType, left, right, tok); ok {
		return value
	}
	right = "(" + right + ")"
	switch tok {
	case token.ADD_ASSIGN:
		return left + " + " + right
	case token.SUB_ASSIGN:
		return left + " - " + right
	case token.MUL_ASSIGN:
		return left + " * " + right
	case token.QUO_ASSIGN:
		return left + " / " + right
	case token.REM_ASSIGN:
		return left + " % " + right
	case token.AND_ASSIGN:
		return left + " & " + right
	case token.OR_ASSIGN:
		return left + " | " + right
	case token.XOR_ASSIGN:
		return left + " ^ " + right
	case token.SHL_ASSIGN:
		return left + " << " + right
	case token.SHR_ASSIGN:
		if bits, ok := unsignedIntegerBits(targetType); ok && bits <= 32 {
			return "(" + left + " >>> " + right + ") >>> 0"
		}
		return left + " >> " + right
	case token.AND_NOT_ASSIGN:
		return left + " & ~(" + right + ")"
	default:
		return right
	}
}

func integerQuotientAssignExpr(targetType types.Type, left string, right string, tok token.Token) (string, bool) {
	value, ok := integerQuotientAssignValueExpr(targetType, left, right, tok)
	if !ok {
		return "", false
	}
	return left + " = " + value, true
}

func assignmentTargetType(ctx lowerFileContext, lhs ast.Expr) types.Type {
	if ident, ok := lhs.(*ast.Ident); ok {
		if obj := ctx.semPkg.source.TypesInfo.Defs[ident]; obj != nil {
			return obj.Type()
		}
	}
	return ctx.semPkg.source.TypesInfo.TypeOf(lhs)
}

func integerQuotientAssignValueExpr(targetType types.Type, left string, right string, tok token.Token) (string, bool) {
	if tok != token.QUO_ASSIGN || !isIntegerType(targetType) {
		return "", false
	}
	if bits, ok := unsignedIntegerBits(targetType); ok && bits <= 32 {
		return "(" + left + " / " + right + ") >>> 0", true
	}
	return "Math.trunc(" + left + " / " + right + ")", true
}

func wideIntegerAssignHelper(targetType types.Type, tok token.Token) (RuntimeHelper, bool) {
	if !isRuntimeWideIntegerType(targetType) {
		return "", false
	}
	signed := isFixedSignedWideIntegerType(targetType)
	switch tok {
	case token.SHL_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Shl, RuntimeHelperInt64Shl), true
	case token.SHR_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Shr, RuntimeHelperInt64Shr), true
	case token.MUL_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Mul, RuntimeHelperInt64Mul), true
	case token.QUO_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Div, RuntimeHelperInt64Div), true
	case token.REM_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Mod, RuntimeHelperInt64Mod), true
	case token.ADD_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Add, RuntimeHelperInt64Add), true
	case token.SUB_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Sub, RuntimeHelperInt64Sub), true
	case token.AND_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64And, RuntimeHelperInt64And), true
	case token.OR_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Or, RuntimeHelperInt64Or), true
	case token.XOR_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Xor, RuntimeHelperInt64Xor), true
	default:
		return "", false
	}
}

func (o *LoweringOwner) lowerChannelReceiveAssignStmt(
	ctx lowerFileContext,
	stmt *ast.AssignStmt,
) ([]loweredStmt, []Diagnostic) {
	if len(stmt.Rhs) != 1 {
		return nil, nil
	}
	receive, ok := stmt.Rhs[0].(*ast.UnaryExpr)
	if !ok || receive.Op != token.ARROW {
		return nil, nil
	}
	channel, diagnostics := o.lowerExpr(ctx, receive.X)
	if len(stmt.Lhs) == 1 {
		if ident, ok := stmt.Lhs[0].(*ast.Ident); ok && ident.Name == "_" {
			return []loweredStmt{{text: "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecv) + "(" + channel + ")"}}, diagnostics
		}
		value := "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecv) + "(" + channel + ")"
		if stmt.Tok != token.DEFINE {
			if targetStmt, targetDiagnostics, ok := o.lowerStarTargetAssignmentStmt(ctx, stmt.Lhs[0], value); ok {
				diagnostics = append(diagnostics, targetDiagnostics...)
				return []loweredStmt{targetStmt}, diagnostics
			}
		}
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, stmt.Lhs[0], stmt.Tok == token.DEFINE)
		diagnostics = append(diagnostics, leftDiagnostics...)
		prefix := ""
		if stmt.Tok == token.DEFINE {
			prefix = declarationKeyword(ctx)
			left += o.shortDeclTypeAnnotation(ctx, stmt.Lhs[0], nil)
			value = o.lowerDeclaredValue(ctx, stmt.Lhs[0], value)
		}
		return []loweredStmt{{text: prefix + left + " = " + value}}, diagnostics
	}
	tempName := ctx.tempName("Recv")
	stmts := []loweredStmt{{text: "let " + tempName + " = await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecvWithOk) + "(" + channel + ")"}}
	if allBlankIdents(stmt.Lhs) {
		return stmts, diagnostics
	}
	fields := []string{".value", ".ok"}
	for idx, lhs := range stmt.Lhs {
		if idx >= len(fields) {
			break
		}
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		declare := stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs)
		value := tempName + fields[idx]
		targetStmt, targetDiagnostics := o.lowerTupleTargetAssignmentStmt(ctx, lhs, value, declare)
		diagnostics = append(diagnostics, targetDiagnostics...)
		stmts = append(stmts, targetStmt)
	}
	return stmts, diagnostics
}

func (o *LoweringOwner) shortDeclTypeAnnotation(ctx lowerFileContext, lhs ast.Expr, rhs ast.Expr) string {
	ident, ok := lhs.(*ast.Ident)
	if !ok {
		return ""
	}
	obj := ctx.semPkg.source.TypesInfo.Defs[ident]
	if obj == nil {
		return ""
	}
	if signature := unnamedSignatureForType(obj.Type()); signature != nil {
		typ := o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
		if ctx.model.needsVarRef[obj] {
			typ = "$.VarRef<" + typ + ">"
		}
		return ": " + typ
	}
	if rhs != nil && isIdentLikeExpr(rhs) && isInterfaceType(obj.Type()) {
		return ": " + o.tsVariableTypeFor(ctx, obj.Type(), ctx.model.needsVarRef[obj])
	}
	if !shortDeclNeedsTypeAnnotation(obj.Type()) {
		return ""
	}
	return ": " + o.tsVariableTypeFor(ctx, obj.Type(), ctx.model.needsVarRef[obj])
}

func isIdentLikeExpr(expr ast.Expr) bool {
	_, ok := ast.Unparen(expr).(*ast.Ident)
	return ok
}

func shortDeclNeedsTypeAnnotation(typ types.Type) bool {
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Pointer:
		_, pointsToArray := types.Unalias(typed.Elem()).Underlying().(*types.Array)
		return pointsToArray || namedStructType(typed.Elem()) != nil || namedNonStructType(typed.Elem()) != nil
	case *types.Map:
		return true
	case *types.Slice:
		return true
	default:
		return false
	}
}

func rhsIsMethodValue(ctx lowerFileContext, expr ast.Expr) bool {
	selector, ok := expr.(*ast.SelectorExpr)
	if !ok || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	selection := ctx.semPkg.source.TypesInfo.Selections[selector]
	return selection != nil && selection.Kind() == types.MethodVal
}

func (o *LoweringOwner) lowerTupleTargetAssignmentStmt(
	ctx lowerFileContext,
	lhs ast.Expr,
	value string,
	declare bool,
) (loweredStmt, []Diagnostic) {
	if !declare {
		if index, ok := unwrapParenExpr(lhs).(*ast.IndexExpr); ok && isMapType(ctx.semPkg.source.TypesInfo.TypeOf(index.X)) {
			targetType := assignmentTargetType(ctx, lhs)
			value = o.lowerValueForTarget(ctx, lhs, targetType, value)
			stmts, diagnostics := o.lowerMapIndexUpdateStmts(ctx, index, token.ASSIGN, value, targetType)
			if len(stmts) != 0 {
				return stmts[0], diagnostics
			}
			return loweredStmt{}, diagnostics
		}
		if stmt, diagnostics, ok := o.lowerStarTargetAssignmentStmt(ctx, lhs, value); ok {
			return stmt, diagnostics
		}
	}
	left, diagnostics := o.lowerAssignmentTarget(ctx, lhs, declare)
	prefix := ""
	if declare {
		prefix = declarationKeyword(ctx)
		left += o.shortDeclTypeAnnotation(ctx, lhs, nil)
		value = o.lowerDeclaredValue(ctx, lhs, value)
	}
	return loweredStmt{text: prefix + left + " = " + value}, diagnostics
}

func (o *LoweringOwner) lowerStarTargetAssignmentStmt(
	ctx lowerFileContext,
	lhs ast.Expr,
	right string,
) (loweredStmt, []Diagnostic, bool) {
	star, ok := unwrapParenExpr(lhs).(*ast.StarExpr)
	if !ok {
		return loweredStmt{}, nil, false
	}
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(lhs)
	if isStructValueType(targetType) {
		pointer, diagnostics := o.lowerPointerValueExpr(ctx, star.X)
		return loweredStmt{text: o.runtimeOwner.QualifiedHelper(RuntimeHelperAssignStruct) + "(" + pointer + ", " + right + ")"}, diagnostics, true
	}
	pointer, diagnostics := o.lowerPointerStorageExpr(ctx, star.X)
	return loweredStmt{text: pointer + " = " + right}, diagnostics, true
}

func (o *LoweringOwner) lowerTupleReassignmentStmt(
	ctx lowerFileContext,
	stmt *ast.AssignStmt,
	right string,
	diagnostics []Diagnostic,
) ([]loweredStmt, []Diagnostic) {
	tempName := ctx.tempName("Tuple")
	stmts := []loweredStmt{{text: "let " + tempName + ": any = " + right}}
	for idx, lhs := range stmt.Lhs {
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		declare := stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs)
		value := tempName + "[" + strconv.Itoa(idx) + "]"
		value = o.lowerTupleAssignmentValueForTarget(ctx, stmt, lhs, idx, value)
		targetStmt, targetDiagnostics := o.lowerTupleTargetAssignmentStmt(ctx, lhs, value, declare)
		diagnostics = append(diagnostics, targetDiagnostics...)
		stmts = append(stmts, targetStmt)
	}
	return stmts, diagnostics
}

func (o *LoweringOwner) lowerShortDeclShadowAliases(
	ctx lowerFileContext,
	stmt ast.Stmt,
) (map[types.Object]string, []loweredStmt) {
	assign, ok := stmt.(*ast.AssignStmt)
	if !ok || assign.Tok != token.DEFINE {
		return nil, nil
	}
	names := make(map[string]bool)
	for _, expr := range assign.Lhs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" || ctx.semPkg.source.TypesInfo.Defs[ident] == nil {
			continue
		}
		names[ident.Name] = true
	}
	if len(names) == 0 {
		return nil, nil
	}
	aliases := make(map[types.Object]string)
	var prelude []loweredStmt
	for _, rhs := range assign.Rhs {
		nonValueIdents := shortDeclShadowNonValueIdents(ctx, rhs)
		ast.Inspect(rhs, func(node ast.Node) bool {
			ident, ok := node.(*ast.Ident)
			if !ok || nonValueIdents[ident] || !names[ident.Name] {
				return true
			}
			obj := ctx.semPkg.source.TypesInfo.Uses[ident]
			if _, ok := obj.(*types.PkgName); ok {
				return true
			}
			if obj == nil || aliases[obj] != "" || objectDeclaredInAssignRHS(obj, assign) {
				return true
			}
			alias := ctx.tempName("Shadow")
			value := o.lowerIdent(ctx, ident, false)
			aliases[obj] = alias
			prelude = append(prelude, loweredStmt{text: "let " + alias + " = " + value})
			return true
		})
	}
	return aliases, prelude
}

func (o *LoweringOwner) lowerShortDeclNewShadowAliases(
	ctx lowerFileContext,
	assign *ast.AssignStmt,
) map[types.Object]string {
	type shortDeclDef struct {
		name string
		def  types.Object
	}

	defsByName := make(map[string]types.Object)
	var defs []shortDeclDef
	for _, expr := range assign.Lhs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" {
			continue
		}
		obj := ctx.semPkg.source.TypesInfo.Defs[ident]
		if obj != nil {
			defsByName[ident.Name] = obj
			defs = append(defs, shortDeclDef{name: ident.Name, def: obj})
		}
	}
	if len(defsByName) == 0 {
		return nil
	}
	aliases := make(map[types.Object]string)
	for _, rhs := range assign.Rhs {
		nonValueIdents := shortDeclShadowNonValueIdents(ctx, rhs)
		ast.Inspect(rhs, func(node ast.Node) bool {
			ident, ok := node.(*ast.Ident)
			if !ok || nonValueIdents[ident] {
				return true
			}
			def := defsByName[ident.Name]
			if def == nil || aliases[def] != "" {
				return true
			}
			if used := ctx.semPkg.source.TypesInfo.Uses[ident]; used != nil && used != def && !objectDeclaredInAssignRHS(used, assign) {
				aliases[def] = ctx.tempName("Shadow")
			}
			return true
		})
		for _, entry := range defs {
			if entry.def == nil || aliases[entry.def] != "" {
				continue
			}
			if o.mapIndexDefaultUsesShortDeclName(ctx, rhs, entry.name) {
				aliases[entry.def] = ctx.tempName("Shadow")
			}
		}
	}
	for _, entry := range defs {
		if entry.def == nil || aliases[entry.def] != "" {
			continue
		}
		if shortDeclDefShadowsOuterName(ctx, entry.name, entry.def) {
			aliases[entry.def] = ctx.tempName("Shadow")
		}
	}
	return aliases
}

func shortDeclShadowNonValueIdents(ctx lowerFileContext, expr ast.Expr) map[*ast.Ident]bool {
	idents := make(map[*ast.Ident]bool)
	ast.Inspect(expr, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.CallExpr:
			if ident, ok := typed.Fun.(*ast.Ident); ok {
				if _, ok := ctx.semPkg.source.TypesInfo.Uses[ident].(*types.TypeName); ok {
					idents[ident] = true
				}
			}
		case *ast.SelectorExpr:
			idents[typed.Sel] = true
		case *ast.KeyValueExpr:
			if ident, ok := typed.Key.(*ast.Ident); ok {
				idents[ident] = true
			}
		}
		return true
	})
	return idents
}

func shortDeclDefShadowsOuterName(ctx lowerFileContext, name string, def types.Object) bool {
	for scope := def.Parent(); scope != nil; scope = scope.Parent() {
		if scope == def.Parent() {
			continue
		}
		obj := scope.Lookup(name)
		if scope.Parent() == types.Universe {
			if obj == nil {
				return false
			}
			if _, isTypeName := obj.(*types.TypeName); isTypeName {
				return true
			}
			if _, isFunc := obj.(*types.Func); isFunc {
				return sameSourceFile(ctx, obj.Pos(), def.Pos()) && obj.Pos() < def.Pos()
			}
			return false
		}
		if obj != nil && obj.Pos().IsValid() && obj.Pos() < def.Pos() {
			return true
		}
	}
	return false
}

func sameSourceFile(ctx lowerFileContext, left token.Pos, right token.Pos) bool {
	if !left.IsValid() || !right.IsValid() || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	leftPos := sourcePos(ctx.semPkg.source, left)
	rightPos := sourcePos(ctx.semPkg.source, right)
	return leftPos.file != "" && leftPos.file == rightPos.file
}

func valueSpecUsesOuterName(ctx lowerFileContext, spec *ast.ValueSpec, name string, def types.Object) bool {
	if spec == nil || name == "" || def == nil {
		return false
	}
	usesOuter := false
	for _, value := range spec.Values {
		ast.Inspect(value, func(node ast.Node) bool {
			ident, ok := node.(*ast.Ident)
			if !ok || ident.Name != name {
				return true
			}
			obj := ctx.semPkg.source.TypesInfo.Uses[ident]
			if obj != nil && obj != def {
				usesOuter = true
				return false
			}
			return true
		})
		if usesOuter {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) mapIndexDefaultUsesShortDeclName(
	ctx lowerFileContext,
	rhs ast.Expr,
	name string,
) bool {
	index, ok := unwrapParenExpr(rhs).(*ast.IndexExpr)
	if !ok || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	mapType, _ := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(index.X)).Underlying().(*types.Map)
	if mapType == nil {
		return false
	}
	named := namedStructType(mapType.Elem())
	if named == nil || named.Obj() == nil {
		return false
	}
	return safeIdentifier(named.Obj().Name()) == safeIdentifier(name) &&
		!strings.Contains(o.namedTypeExpr(ctx, named), ".")
}

func objectDeclaredInAssignRHS(obj types.Object, assign *ast.AssignStmt) bool {
	if obj == nil || assign == nil {
		return false
	}
	pos := obj.Pos()
	return pos.IsValid() && assign.Pos() < pos && pos < assign.End()
}

func (o *LoweringOwner) lowerDeclaredValue(ctx lowerFileContext, lhs ast.Expr, value string) string {
	ident, ok := lhs.(*ast.Ident)
	if !ok {
		return value
	}
	obj := ctx.semPkg.source.TypesInfo.Defs[ident]
	if obj == nil || !ctx.model.needsVarRef[obj] {
		return value
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")"
}

func (o *LoweringOwner) lowerParallelAssignStmt(ctx lowerFileContext, stmt *ast.AssignStmt) ([]loweredStmt, []Diagnostic) {
	stmts := make([]loweredStmt, 0, len(stmt.Rhs)*2)
	var diagnostics []Diagnostic
	tempPrefix := ctx.tempName("Assign") + "_"
	for idx, rhs := range stmt.Rhs {
		right, rightDiagnostics := o.lowerExpr(ctx, rhs)
		diagnostics = append(diagnostics, rightDiagnostics...)
		typeAnnotation := ""
		if idx < len(stmt.Lhs) {
			targetType := ctx.semPkg.source.TypesInfo.TypeOf(stmt.Lhs[idx])
			if targetType != nil {
				right = o.lowerValueForTarget(ctx, rhs, targetType, right)
				typeAnnotation = ": " + o.tsVariableTypeFor(ctx, targetType, false)
			}
		}
		stmts = append(stmts, loweredStmt{text: "let " + tempPrefix + strconv.Itoa(idx) + typeAnnotation + " = " + right})
	}
	for idx, lhs := range stmt.Lhs {
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		targetStmt, targetDiagnostics := o.lowerTupleTargetAssignmentStmt(ctx, lhs, tempPrefix+strconv.Itoa(idx), false)
		diagnostics = append(diagnostics, targetDiagnostics...)
		stmts = append(stmts, targetStmt)
	}
	return stmts, diagnostics
}

func allShortAssignTargetsNew(ctx lowerFileContext, exprs []ast.Expr) bool {
	for _, expr := range exprs {
		if ident, ok := expr.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		if !isShortAssignTargetNew(ctx, expr) {
			return false
		}
	}
	return true
}

func (o *LoweringOwner) tupleDeclarationNeedsElementStatements(ctx lowerFileContext, stmt *ast.AssignStmt) bool {
	return tupleDeclarationNeedsElementStatements(ctx, stmt.Lhs) ||
		tupleDeclarationRHSUsesNewName(ctx, stmt.Lhs, stmt.Rhs[0]) ||
		o.tupleAssignmentNeedsTargetConversion(ctx, stmt)
}

func tupleDeclarationNeedsElementStatements(ctx lowerFileContext, exprs []ast.Expr) bool {
	for _, expr := range exprs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" {
			continue
		}
		obj := ctx.semPkg.source.TypesInfo.Defs[ident]
		if obj != nil && (ctx.model.needsVarRef[obj] || shortDeclNeedsTypeAnnotation(obj.Type())) {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) tupleAssignmentNeedsTargetConversion(ctx lowerFileContext, stmt *ast.AssignStmt) bool {
	sourceResults := tupleResultTypes(ctx, stmt.Rhs[0])
	if sourceResults == nil {
		return false
	}
	genericResults := genericCallTupleResultTypeParamIndexes(ctx, stmt.Rhs[0])
	for idx, lhs := range stmt.Lhs {
		if idx >= sourceResults.Len() {
			break
		}
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		targetType := ctx.semPkg.source.TypesInfo.TypeOf(lhs)
		if targetType == nil {
			continue
		}
		if genericResults[idx] {
			return true
		}
		value := "__tupleValue"
		if o.lowerValueForTargetTypes(ctx, targetType, sourceResults.At(idx).Type(), value, false) != value {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) lowerTupleAssignmentValueForTarget(
	ctx lowerFileContext,
	stmt *ast.AssignStmt,
	lhs ast.Expr,
	idx int,
	value string,
) string {
	sourceResults := tupleResultTypes(ctx, stmt.Rhs[0])
	if sourceResults == nil || idx >= sourceResults.Len() {
		return value
	}
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(lhs)
	if targetType == nil {
		return value
	}
	value = o.lowerValueForTargetTypes(ctx, targetType, sourceResults.At(idx).Type(), value, false)
	if genericCallTupleResultTypeParamIndexes(ctx, stmt.Rhs[0])[idx] {
		return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")"
	}
	return value
}

func tupleDeclarationRHSUsesNewName(ctx lowerFileContext, lhs []ast.Expr, rhs ast.Expr) bool {
	names := make(map[string]bool)
	for _, expr := range lhs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" || ctx.semPkg.source.TypesInfo.Defs[ident] == nil {
			continue
		}
		names[ident.Name] = true
	}
	if len(names) == 0 {
		return false
	}
	usesName := false
	ast.Inspect(rhs, func(node ast.Node) bool {
		ident, ok := node.(*ast.Ident)
		if ok && names[ident.Name] {
			usesName = true
			return false
		}
		return true
	})
	return usesName
}

func isShortAssignTargetNew(ctx lowerFileContext, expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	if !ok {
		return false
	}
	return ctx.semPkg.source.TypesInfo.Defs[ident] != nil
}

func allBlankIdents(exprs []ast.Expr) bool {
	if len(exprs) == 0 {
		return false
	}
	for _, expr := range exprs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name != "_" {
			return false
		}
	}
	return true
}

func labeledTextCannotPrefix(text string) bool {
	return strings.HasPrefix(text, "let ") || strings.HasPrefix(text, "const ") || strings.HasPrefix(text, "class ")
}

func isChannelReceiveExpr(expr ast.Expr) bool {
	receive, ok := expr.(*ast.UnaryExpr)
	return ok && receive.Op == token.ARROW
}

func (o *LoweringOwner) lowerReturnStmt(ctx lowerFileContext, stmt *ast.ReturnStmt) (string, []Diagnostic) {
	if ctx.rangeBranch != nil {
		return o.lowerRangeFuncReturnStmt(ctx, stmt)
	}
	if o.returnNeedsNamedResultDefer(ctx) {
		return o.lowerNamedResultDeferReturnStmt(ctx, stmt)
	}
	if len(stmt.Results) == 0 {
		if result, ok := o.lowerNamedResultReturn(ctx); ok {
			return "return " + result, nil
		}
		return "return", nil
	}
	if len(stmt.Results) == 1 {
		expr, diagnostics := o.lowerExpr(ctx, stmt.Results[0])
		if result, ok := o.lowerTupleReturnExpr(ctx, stmt.Results[0], expr); ok {
			return result, diagnostics
		}
		if returnType := singleReturnType(ctx); returnType != nil {
			expr = o.lowerValueForTarget(ctx, stmt.Results[0], returnType, expr)
			if genericCallResultUsesTypeParam(ctx, stmt.Results[0]) {
				expr = "(" + expr + " as " + o.tsTypeFor(ctx, returnType) + ")"
			}
		}
		return "return " + expr, diagnostics
	}
	parts := make([]string, 0, len(stmt.Results))
	var diagnostics []Diagnostic
	for idx, result := range stmt.Results {
		expr, exprDiagnostics := o.lowerExpr(ctx, result)
		diagnostics = append(diagnostics, exprDiagnostics...)
		if ctx.signature != nil && ctx.signature.Results() != nil && idx < ctx.signature.Results().Len() {
			expr = o.lowerValueForTarget(ctx, result, ctx.signature.Results().At(idx).Type(), expr)
		}
		parts = append(parts, expr)
	}
	return "return [" + strings.Join(parts, ", ") + "]", diagnostics
}

func (o *LoweringOwner) returnNeedsNamedResultDefer(ctx lowerFileContext) bool {
	if ctx.deferState == nil || !ctx.deferState.used || ctx.signature == nil || ctx.signature.Results() == nil {
		return false
	}
	for result := range ctx.signature.Results().Variables() {
		if result.Name() != "" {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) lowerNamedResultDeferReturnStmt(ctx lowerFileContext, stmt *ast.ReturnStmt) (string, []Diagnostic) {
	var diagnostics []Diagnostic
	var lines []string
	explicitTemp := ""
	if len(stmt.Results) != 0 {
		var value string
		var values []string
		if len(stmt.Results) == 1 && ctx.signature.Results().Len() > 1 {
			expr, exprDiagnostics := o.lowerExpr(ctx, stmt.Results[0])
			diagnostics = append(diagnostics, exprDiagnostics...)
			if prefix, tuple, ok := o.lowerTupleReturnValue(ctx, stmt.Results[0], expr); ok {
				lines = append(lines, prefix)
				value = tuple
			} else {
				value = expr
			}
		} else {
			values = make([]string, 0, len(stmt.Results))
			for idx, result := range stmt.Results {
				expr, exprDiagnostics := o.lowerExpr(ctx, result)
				diagnostics = append(diagnostics, exprDiagnostics...)
				if idx < ctx.signature.Results().Len() {
					expr = o.lowerValueForTarget(ctx, result, ctx.signature.Results().At(idx).Type(), expr)
				}
				values = append(values, expr)
			}
		}
		temp := ctx.tempName("Return")
		explicitTemp = temp
		tempType := o.tsSignatureResultFor(ctx, ctx.signature)
		if value != "" {
			lines = append(lines, "const "+temp+": "+tempType+" = "+value)
		} else if len(values) == 1 {
			lines = append(lines, "const "+temp+": "+tempType+" = "+values[0])
		} else {
			lines = append(lines, "const "+temp+": "+tempType+" = ["+strings.Join(values, ", ")+"]")
		}
		for idx := range ctx.signature.Results().Len() {
			result := ctx.signature.Results().At(idx)
			name := result.Name()
			if name == "" || name == "_" {
				continue
			}
			target := safeIdentifier(name)
			if ctx.model.needsVarRef[result] {
				target += ".value"
			}
			source := temp
			if ctx.signature.Results().Len() > 1 {
				source += "[" + strconv.Itoa(idx) + "]"
			}
			lines = append(lines, target+" = "+source)
		}
	}
	lines = append(lines, o.lowerDeferDisposeStmt(ctx))
	if result, ok := o.lowerNamedResultReturnWithExplicitTemp(ctx, explicitTemp); ok {
		lines = append(lines, "return "+result)
	} else {
		lines = append(lines, "return")
	}
	return strings.Join(lines, "\n"), diagnostics
}

func (o *LoweringOwner) lowerNamedResultReturnWithExplicitTemp(ctx lowerFileContext, explicitTemp string) (string, bool) {
	if explicitTemp == "" {
		return o.lowerNamedResultReturn(ctx)
	}
	parts := make([]string, 0, ctx.signature.Results().Len())
	hasNamedResult := false
	multi := ctx.signature.Results().Len() > 1
	for idx := range ctx.signature.Results().Len() {
		result := ctx.signature.Results().At(idx)
		name := result.Name()
		if name == "" || name == "_" {
			source := explicitTemp
			if multi {
				source += "[" + strconv.Itoa(idx) + "]"
			}
			parts = append(parts, source)
			if name != "" {
				hasNamedResult = true
			}
			continue
		}
		hasNamedResult = true
		returnExpr := safeIdentifier(name)
		if ctx.model.needsVarRef[result] {
			returnExpr += ".value"
		}
		parts = append(parts, returnExpr)
	}
	if !hasNamedResult {
		return "", false
	}
	if len(parts) == 1 {
		return parts[0], true
	}
	return "[" + strings.Join(parts, ", ") + "]", true
}

func (o *LoweringOwner) lowerDeferDisposeStmt(ctx lowerFileContext) string {
	if ctx.deferState != nil && ctx.deferState.async {
		return "await __defer[Symbol.asyncDispose]()"
	}
	return "__defer[Symbol.dispose]()"
}

func (o *LoweringOwner) lowerBodylessReturnStmt(ctx lowerFileContext, signature *types.Signature) (string, bool) {
	if signature.Results().Len() == 0 {
		return "", false
	}
	if signature.Results().Len() == 1 {
		result := signature.Results().At(0)
		return "return " + o.lowerDeclarationZeroValueExpr(ctx, result.Type()), true
	}
	results := make([]string, 0, signature.Results().Len())
	for result := range signature.Results().Variables() {
		results = append(results, o.lowerDeclarationZeroValueExpr(ctx, result.Type()))
	}
	return "return [" + strings.Join(results, ", ") + "]", true
}

func (o *LoweringOwner) lowerRangeFuncReturnStmt(ctx lowerFileContext, stmt *ast.ReturnStmt) (string, []Diagnostic) {
	if len(stmt.Results) == 0 {
		if result, ok := o.lowerNamedResultReturn(ctx); ok {
			return ctx.rangeBranch.hasReturn + " = true\n" + ctx.rangeBranch.value + " = " + result + "\nreturn false", nil
		}
		return ctx.rangeBranch.hasReturn + " = true\nreturn false", nil
	}
	if len(stmt.Results) == 1 {
		expr, diagnostics := o.lowerExpr(ctx.withoutRangeBranch(), stmt.Results[0])
		if result, ok := o.lowerTupleRangeReturnExpr(ctx, stmt.Results[0], expr); ok {
			return result, diagnostics
		}
		if returnType := singleReturnType(ctx); returnType != nil {
			expr = o.lowerValueForTarget(ctx, stmt.Results[0], returnType, expr)
		}
		return ctx.rangeBranch.hasReturn + " = true\n" + ctx.rangeBranch.value + " = " + expr + "\nreturn false", diagnostics
	}
	parts := make([]string, 0, len(stmt.Results))
	var diagnostics []Diagnostic
	for idx, result := range stmt.Results {
		expr, exprDiagnostics := o.lowerExpr(ctx.withoutRangeBranch(), result)
		diagnostics = append(diagnostics, exprDiagnostics...)
		if ctx.signature != nil && ctx.signature.Results() != nil && idx < ctx.signature.Results().Len() {
			expr = o.lowerValueForTarget(ctx.withoutRangeBranch(), result, ctx.signature.Results().At(idx).Type(), expr)
		}
		parts = append(parts, expr)
	}
	return ctx.rangeBranch.hasReturn + " = true\n" + ctx.rangeBranch.value + " = [" + strings.Join(parts, ", ") + "]\nreturn false", diagnostics
}

func singleReturnType(ctx lowerFileContext) types.Type {
	if ctx.signature == nil || ctx.signature.Results() == nil || ctx.signature.Results().Len() != 1 {
		return nil
	}
	return ctx.signature.Results().At(0).Type()
}

func (o *LoweringOwner) lowerTupleReturnExpr(ctx lowerFileContext, expr ast.Expr, value string) (string, bool) {
	prefix, tuple, ok := o.lowerTupleReturnValue(ctx, expr, value)
	if !ok {
		return "", false
	}
	return prefix + "\nreturn " + tuple, true
}

func (o *LoweringOwner) lowerTupleRangeReturnExpr(ctx lowerFileContext, expr ast.Expr, value string) (string, bool) {
	prefix, tuple, ok := o.lowerTupleReturnValue(ctx.withoutRangeBranch(), expr, value)
	if !ok {
		return "", false
	}
	return prefix + "\n" + ctx.rangeBranch.hasReturn + " = true\n" +
		ctx.rangeBranch.value + " = " + tuple + "\nreturn false", true
}

func (o *LoweringOwner) lowerTupleReturnValue(ctx lowerFileContext, expr ast.Expr, value string) (string, string, bool) {
	if ctx.signature == nil || ctx.signature.Results() == nil || ctx.signature.Results().Len() < 2 {
		return "", "", false
	}
	sourceResults := tupleResultTypes(ctx, expr)
	if sourceResults == nil || sourceResults.Len() != ctx.signature.Results().Len() {
		return "", "", false
	}
	temp := ctx.tempName("Return")
	genericResults := genericCallTupleResultTypeParamIndexes(ctx, expr)
	parts := make([]string, 0, sourceResults.Len())
	changed := false
	for idx := range sourceResults.Len() {
		part := temp + "[" + strconv.Itoa(idx) + "]"
		targetType := ctx.signature.Results().At(idx).Type()
		converted := o.lowerValueForTargetTypes(ctx, targetType, sourceResults.At(idx).Type(), part, false)
		if genericResults[idx] {
			converted = "(" + converted + " as " + o.tsTypeFor(ctx, targetType) + ")"
		}
		if converted != part {
			changed = true
		}
		part = converted
		parts = append(parts, part)
	}
	if !changed {
		return "", "", false
	}
	return "const " + temp + " = " + value, "[" + strings.Join(parts, ", ") + "]", true
}

func tupleResultTypes(ctx lowerFileContext, expr ast.Expr) *types.Tuple {
	if tuple, ok := ctx.semPkg.source.TypesInfo.TypeOf(expr).(*types.Tuple); ok {
		return tuple
	}
	call, ok := ast.Unparen(expr).(*ast.CallExpr)
	if !ok {
		return nil
	}
	signature := callTargetSignature(ctx, call.Fun)
	if signature == nil || signature.Results() == nil || signature.Results().Len() < 2 {
		return nil
	}
	return signature.Results()
}

func genericCallResultUsesTypeParam(ctx lowerFileContext, expr ast.Expr) bool {
	call, ok := ast.Unparen(expr).(*ast.CallExpr)
	if !ok {
		return false
	}
	signature := genericFunctionSignatureForCall(ctx, call.Fun)
	if signature == nil {
		signature = sourceFunctionSignatureForCall(ctx, call.Fun)
	}
	if signature == nil || signature.Results() == nil || signature.Results().Len() != 1 {
		return false
	}
	return typeContainsTypeParam(signature.Results().At(0).Type())
}

func genericCallTupleResultTypeParamIndexes(ctx lowerFileContext, expr ast.Expr) map[int]bool {
	call, ok := ast.Unparen(expr).(*ast.CallExpr)
	if !ok {
		return nil
	}
	signature := genericFunctionSignatureForCall(ctx, call.Fun)
	if signature == nil {
		signature = sourceFunctionSignatureForCall(ctx, call.Fun)
	}
	if signature == nil || signature.Results() == nil || signature.Results().Len() < 2 {
		return nil
	}
	indexes := make(map[int]bool)
	for idx := range signature.Results().Len() {
		if typeContainsTypeParam(signature.Results().At(idx).Type()) {
			indexes[idx] = true
		}
	}
	return indexes
}

func genericFunctionSignatureForCall(ctx lowerFileContext, fun ast.Expr) *types.Signature {
	for {
		switch typed := ast.Unparen(fun).(type) {
		case *ast.IndexExpr:
			fun = typed.X
		case *ast.IndexListExpr:
			fun = typed.X
		default:
			return genericFunctionSignature(ctx, fun)
		}
	}
}

func sourceFunctionSignatureForCall(ctx lowerFileContext, fun ast.Expr) *types.Signature {
	for {
		switch typed := ast.Unparen(fun).(type) {
		case *ast.IndexExpr:
			fun = typed.X
		case *ast.IndexListExpr:
			fun = typed.X
		default:
			if ctx.semPkg == nil || ctx.semPkg.source == nil {
				return nil
			}
			fn := calledFunction(ctx.semPkg.source, fun)
			if fn == nil {
				return nil
			}
			if origin := fn.Origin(); origin != nil {
				fn = origin
			}
			signature, _ := fn.Type().(*types.Signature)
			return signature
		}
	}
}

func typeContainsTypeParam(typ types.Type) bool {
	return typeContainsTypeParamSeen(typ, make(map[types.Type]bool))
}

func typeContainsTypeParamSeen(typ types.Type, seen map[types.Type]bool) bool {
	if typ == nil {
		return false
	}
	if seen[typ] {
		return false
	}
	seen[typ] = true
	if _, ok := types.Unalias(typ).(*types.TypeParam); ok {
		return true
	}
	switch typed := types.Unalias(typ).(type) {
	case *types.Named:
		if args := typed.TypeArgs(); args != nil {
			for t := range args.Types() {
				if typeContainsTypeParamSeen(t, seen) {
					return true
				}
			}
		}
	case *types.Alias:
		if args := typed.TypeArgs(); args != nil {
			for t := range args.Types() {
				if typeContainsTypeParamSeen(t, seen) {
					return true
				}
			}
		}
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Array:
		return typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Slice:
		return typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Map:
		return typeContainsTypeParamSeen(typed.Key(), seen) || typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Chan:
		return typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Pointer:
		return typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Signature:
		return tupleContainsTypeParamSeen(typed.Params(), seen) || tupleContainsTypeParamSeen(typed.Results(), seen)
	case *types.Struct:
		for field := range typed.Fields() {
			if typeContainsTypeParamSeen(field.Type(), seen) {
				return true
			}
		}
		return false
	default:
		return false
	}
}

func tupleContainsTypeParamSeen(tuple *types.Tuple, seen map[types.Type]bool) bool {
	if tuple == nil {
		return false
	}
	for v := range tuple.Variables() {
		if typeContainsTypeParamSeen(v.Type(), seen) {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) lowerNamedResults(ctx lowerFileContext, signature *types.Signature) []loweredNamedResult {
	if signature == nil || signature.Results() == nil {
		return nil
	}
	results := make([]loweredNamedResult, 0, signature.Results().Len())
	for result := range signature.Results().Variables() {
		name := result.Name()
		if name == "" || name == "_" {
			continue
		}
		needsVarRef := ctx.model.needsVarRef[result]
		zero := o.lowerDeclarationZeroValueExpr(ctx, result.Type())
		returnExpr := safeIdentifier(name)
		if needsVarRef {
			zero = o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + zero + ")"
			returnExpr += ".value"
		}
		results = append(results, loweredNamedResult{
			name:       safeIdentifier(name),
			typ:        o.tsVariableTypeFor(ctx, result.Type(), needsVarRef),
			zero:       zero,
			returnExpr: returnExpr,
		})
	}
	return results
}

func (o *LoweringOwner) lowerNamedResultReturn(ctx lowerFileContext) (string, bool) {
	if ctx.signature == nil || ctx.signature.Results() == nil || ctx.signature.Results().Len() == 0 {
		return "", false
	}
	parts := make([]string, 0, ctx.signature.Results().Len())
	hasNamedResult := false
	for result := range ctx.signature.Results().Variables() {
		name := result.Name()
		if name == "" {
			parts = append(parts, o.lowerDeclarationZeroValueExpr(ctx, result.Type()))
			continue
		}
		hasNamedResult = true
		if name == "_" {
			parts = append(parts, o.lowerDeclarationZeroValueExpr(ctx, result.Type()))
			continue
		}
		returnExpr := safeIdentifier(name)
		if ctx.model.needsVarRef[result] {
			returnExpr += ".value"
		}
		parts = append(parts, returnExpr)
	}
	if !hasNamedResult {
		return "", false
	}
	if len(parts) == 1 {
		return parts[0], true
	}
	return "[" + strings.Join(parts, ", ") + "]", true
}

func (o *LoweringOwner) lowerForStmt(ctx lowerFileContext, stmt *ast.ForStmt) (loweredStmt, []Diagnostic) {
	bodyCtx := ctx.withoutRangeLoopBranches().withoutLoopLabel()
	loopLabel := ""
	if stmtListNeedsLoopBranchLabel(stmt.Body.List) {
		loopLabel = ctx.tempName("Loop")
		bodyCtx = bodyCtx.withLoopLabel(loopLabel)
	}
	initCtx := ctx
	loopCtx := ctx
	var initPrelude []loweredStmt
	if assign, ok := stmt.Init.(*ast.AssignStmt); ok && assign.Tok == token.DEFINE {
		oldAliases, prelude := o.lowerShortDeclShadowAliases(ctx, assign)
		newAliases := o.lowerShortDeclNewShadowAliases(ctx, assign)
		if len(oldAliases) != 0 || len(newAliases) != 0 {
			initCtx = ctx.withIdentAliases(oldAliases).withIdentRefAliases(newAliases)
			loopCtx = ctx.withIdentRefAliases(newAliases)
			bodyCtx = bodyCtx.withIdentRefAliases(newAliases)
			initPrelude = prelude
		}
	}
	if stmt.Init == nil && stmt.Post == nil {
		cond := "true"
		var diagnostics []Diagnostic
		if stmt.Cond != nil {
			var condDiagnostics []Diagnostic
			cond, condDiagnostics = o.lowerExpr(ctx, stmt.Cond)
			diagnostics = append(diagnostics, condDiagnostics...)
		}
		body, bodyDiagnostics := o.lowerBlock(bodyCtx, stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		text := "while (" + cond + ")"
		if loopLabel != "" {
			text = loopLabel + ": " + text
		}
		return loweredStmt{
			hasBlock: true,
			text:     text,
			children: body,
		}, diagnostics
	}

	init := ""
	var diagnostics []Diagnostic
	if stmt.Init != nil {
		lowered, initDiagnostics := o.lowerForInitStmt(initCtx, stmt.Init)
		diagnostics = append(diagnostics, initDiagnostics...)
		init = lowered
	}
	cond := ""
	if stmt.Cond != nil {
		var condDiagnostics []Diagnostic
		cond, condDiagnostics = o.lowerExpr(loopCtx, stmt.Cond)
		diagnostics = append(diagnostics, condDiagnostics...)
	}
	post := ""
	if stmt.Post != nil {
		lowered, postDiagnostics := o.lowerForPostStmt(loopCtx, stmt.Post)
		diagnostics = append(diagnostics, postDiagnostics...)
		post = lowered
	}
	body, bodyDiagnostics := o.lowerBlock(bodyCtx, stmt.Body)
	diagnostics = append(diagnostics, bodyDiagnostics...)
	text := "for (" + init + "; " + cond + "; " + post + ")"
	if loopLabel != "" {
		text = loopLabel + ": " + text
	}
	forStmt := loweredStmt{
		hasBlock: true,
		text:     text,
		children: body,
	}
	if len(initPrelude) != 0 {
		return loweredStmt{children: append(initPrelude, forStmt)}, diagnostics
	}
	return forStmt, diagnostics
}

func (o *LoweringOwner) lowerForInitStmt(ctx lowerFileContext, stmt ast.Stmt) (string, []Diagnostic) {
	assign, ok := stmt.(*ast.AssignStmt)
	if !ok {
		lowered, diagnostics := o.lowerStmt(ctx, stmt)
		if len(lowered) == 0 {
			return "", diagnostics
		}
		return strings.TrimSuffix(lowered[0].text, ";"), diagnostics
	}
	if assign.Tok == token.DEFINE && len(assign.Rhs) > 1 && len(assign.Lhs) == len(assign.Rhs) {
		parts := make([]string, 0, len(assign.Lhs))
		var diagnostics []Diagnostic
		for idx, lhs := range assign.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
				continue
			}
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, true)
			right, rightDiagnostics := o.lowerExpr(ctx, assign.Rhs[idx])
			diagnostics = append(diagnostics, leftDiagnostics...)
			diagnostics = append(diagnostics, rightDiagnostics...)
			right = o.lowerDeclaredValue(ctx, lhs, right)
			parts = append(parts, left+" = "+right)
		}
		return "let " + strings.Join(parts, ", "), diagnostics
	}
	if len(assign.Rhs) == 1 && len(assign.Lhs) > 1 {
		right, diagnostics := o.lowerTupleExpr(ctx, assign.Rhs[0])
		lefts := make([]string, 0, len(assign.Lhs))
		for _, lhs := range assign.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
				lefts = append(lefts, "")
				continue
			}
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, assign.Tok == token.DEFINE)
			diagnostics = append(diagnostics, leftDiagnostics...)
			lefts = append(lefts, left)
		}
		if assign.Tok == token.DEFINE {
			if allShortAssignTargetsNew(ctx, assign.Lhs) && !o.tupleDeclarationNeedsElementStatements(ctx, assign) {
				return "let [" + strings.Join(lefts, ", ") + "] = " + right, diagnostics
			}
			tempName := ctx.tempName("Tuple")
			parts := []string{tempName + " = " + right}
			for idx, lhs := range assign.Lhs {
				if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
					continue
				}
				value := o.lowerTupleAssignmentValueForTarget(ctx, assign, lhs, idx, tempName+"["+strconv.Itoa(idx)+"]")
				value = o.lowerDeclaredValue(ctx, lhs, value)
				parts = append(parts, lefts[idx]+" = "+value)
			}
			return "let " + strings.Join(parts, ", "), diagnostics
		}
		return "[" + strings.Join(lefts, ", ") + "] = " + right, diagnostics
	}
	lowered, diagnostics := o.lowerStmt(ctx, stmt)
	if len(lowered) == 0 {
		return "", diagnostics
	}
	return strings.TrimSuffix(lowered[0].text, ";"), diagnostics
}

func (o *LoweringOwner) lowerForPostStmt(ctx lowerFileContext, stmt ast.Stmt) (string, []Diagnostic) {
	if assign, ok := stmt.(*ast.AssignStmt); ok && len(assign.Rhs) == 1 && len(assign.Lhs) > 1 {
		right, diagnostics := o.lowerTupleExpr(ctx, assign.Rhs[0])
		lefts := make([]string, 0, len(assign.Lhs))
		for _, lhs := range assign.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
				lefts = append(lefts, "")
				continue
			}
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, false)
			diagnostics = append(diagnostics, leftDiagnostics...)
			lefts = append(lefts, left)
		}
		return "[" + strings.Join(lefts, ", ") + "] = " + right, diagnostics
	}
	if assign, ok := stmt.(*ast.AssignStmt); ok && assign.Tok == token.ASSIGN && len(assign.Rhs) > 1 && len(assign.Rhs) == len(assign.Lhs) {
		lefts := make([]string, 0, len(assign.Lhs))
		rights := make([]string, 0, len(assign.Rhs))
		var diagnostics []Diagnostic
		for _, lhs := range assign.Lhs {
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, false)
			diagnostics = append(diagnostics, leftDiagnostics...)
			lefts = append(lefts, left)
		}
		for idx, rhs := range assign.Rhs {
			right, rightDiagnostics := o.lowerExpr(ctx, rhs)
			diagnostics = append(diagnostics, rightDiagnostics...)
			if idx < len(assign.Lhs) {
				targetType := ctx.semPkg.source.TypesInfo.TypeOf(assign.Lhs[idx])
				right = o.lowerValueForTarget(ctx, rhs, targetType, right)
			}
			rights = append(rights, right)
		}
		return "[" + strings.Join(lefts, ", ") + "] = [" + strings.Join(rights, ", ") + "]", diagnostics
	}
	lowered, diagnostics := o.lowerStmt(ctx, stmt)
	if len(lowered) == 0 {
		return "", diagnostics
	}
	return strings.TrimSuffix(lowered[0].text, ";"), diagnostics
}

func (o *LoweringOwner) lowerRangeStmt(ctx lowerFileContext, stmt *ast.RangeStmt) (loweredStmt, []Diagnostic) {
	rangeValue, diagnostics := o.lowerExpr(ctx, stmt.X)
	aliases := o.lowerRangeDeclShadowAliases(ctx, stmt)
	bodyCtx := ctx.withoutLoopLabel()
	if len(aliases) != 0 {
		bodyCtx = bodyCtx.withIdentAliases(aliases)
	}

	keyName := rangeKeyNameFor(ctx, stmt.Key, aliases)
	valueName := rangeKeyNameFor(ctx, stmt.Value, aliases)
	rangeType := ctx.semPkg.source.TypesInfo.TypeOf(stmt.X)
	if isChannelType(rangeType) {
		body, bodyDiagnostics := o.lowerBlock(bodyCtx.withoutRangeLoopBranches(), stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		tempName := ctx.tempName("Range")
		children := []loweredStmt{
			{text: "let " + tempName + " = await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecvWithOk) + "(" + rangeValue + ")"},
			{text: "if (!" + tempName + ".ok)", children: []loweredStmt{{text: "break"}}},
		}
		if keyName != "" {
			prefix := ""
			if stmt.Tok == token.DEFINE {
				prefix = "let "
			}
			children = append(children, loweredStmt{text: prefix + keyName + " = " + tempName + ".value"})
		}
		children = append(children, body...)
		return loweredStmt{
			hasBlock: true,
			text:     "while (true)",
			children: children,
		}, diagnostics
	}
	if isIntegerRangeType(rangeType) {
		body, bodyDiagnostics := o.lowerBlock(bodyCtx.withoutRangeLoopBranches(), stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		if keyName == "" {
			keyName = "__rangeIndex"
		}
		return loweredStmt{
			hasBlock: true,
			text:     "for (let " + keyName + " = 0; " + keyName + " < " + rangeValue + "; " + keyName + "++)",
			children: body,
		}, diagnostics
	}
	if isMapType(rangeType) {
		body, bodyDiagnostics := o.lowerBlock(bodyCtx.withoutRangeLoopBranches(), stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		rangeTarget := rangeValue
		if strings.HasPrefix(rangeTarget, "await ") {
			rangeTarget = "(" + rangeTarget + ")"
		}
		key, keyBindings, keyDiagnostics := o.lowerMapRangeBinding(ctx, stmt.Key, keyName, "__rangeKey", "RangeKey", stmt.Tok == token.DEFINE)
		value, valueBindings, valueDiagnostics := o.lowerMapRangeBinding(ctx, stmt.Value, valueName, "__rangeValue", "RangeValue", stmt.Tok == token.DEFINE)
		diagnostics = append(diagnostics, keyDiagnostics...)
		diagnostics = append(diagnostics, valueDiagnostics...)
		binding := "const"
		if rangeBindingAssignedInBody(ctx, stmt.Key, stmt.Body) ||
			rangeBindingAssignedInBody(ctx, stmt.Value, stmt.Body) {
			binding = "let"
		}
		children := append(keyBindings, valueBindings...)
		children = append(children, body...)
		return loweredStmt{
			hasBlock: true,
			text:     "for (" + binding + " [" + key + ", " + value + "] of " + rangeTarget + "?.entries() ?? [])",
			children: children,
		}, diagnostics
	}
	if isStringType(rangeType) {
		body, bodyDiagnostics := o.lowerBlock(bodyCtx.withoutRangeLoopBranches(), stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		key := keyName
		if key == "" {
			key = "__rangeIndex"
		}
		value := valueName
		if value == "" {
			value = "__rangeRune"
		}
		binding := "const"
		if rangeBindingAssignedInBody(ctx, stmt.Key, stmt.Body) ||
			rangeBindingAssignedInBody(ctx, stmt.Value, stmt.Body) {
			binding = "let"
		}
		return loweredStmt{
			hasBlock: true,
			text:     "for (" + binding + " [" + key + ", " + value + "] of " + o.runtimeOwner.QualifiedHelper(RuntimeHelperRangeString) + "(" + rangeValue + "))",
			children: body,
		}, diagnostics
	}
	if isFunctionType(rangeType) {
		signature := rangeFunctionSignature(rangeType)
		if signature == nil {
			return loweredStmt{}, append(diagnostics, loweringUnsupportedAt(ctx, stmt, "statement", ctx.semPkg.pkgPath, "unsupported function range signature"))
		}
		lowered, funcDiagnostics := o.lowerRangeFuncStmt(ctx, stmt, rangeValue, signature)
		diagnostics = append(diagnostics, funcDiagnostics...)
		return lowered, diagnostics
	}

	body, bodyDiagnostics := o.lowerBlock(bodyCtx.withoutRangeLoopBranches(), stmt.Body)
	diagnostics = append(diagnostics, bodyDiagnostics...)
	rangeTarget := ctx.tempName("RangeTarget")
	rangeTargetValue := o.lowerArrayPointerTarget(ctx, rangeValue, rangeType)
	indexTarget := rangeTarget
	if isNilableType(rangeType) {
		indexTarget += "!"
	}
	indexName := keyName
	if indexName == "" {
		indexName = "__rangeIndex"
	}
	children := body
	if valueName != "" {
		value := indexTarget + "[" + indexName + "]"
		if stmt.Tok == token.DEFINE {
			value = o.lowerDeclaredValue(ctx, stmt.Value, value)
		}
		children = append([]loweredStmt{{text: "let " + valueName + " = " + value}}, body...)
	}
	return loweredStmt{
		hasBlock: true,
		text:     "for (let " + rangeTarget + " = " + rangeTargetValue + ", " + indexName + " = 0; " + indexName + " < " + o.runtimeOwner.QualifiedHelper(RuntimeHelperLen) + "(" + rangeTarget + "); " + indexName + "++)",
		children: children,
	}, diagnostics
}

func (o *LoweringOwner) lowerRangeDeclShadowAliases(
	ctx lowerFileContext,
	stmt *ast.RangeStmt,
) map[types.Object]string {
	if stmt.Tok != token.DEFINE {
		return nil
	}
	defsByName := make(map[string]types.Object)
	for _, expr := range []ast.Expr{stmt.Key, stmt.Value} {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" {
			continue
		}
		if def := ctx.semPkg.source.TypesInfo.Defs[ident]; def != nil {
			defsByName[ident.Name] = def
		}
	}
	if len(defsByName) == 0 {
		return nil
	}
	aliases := make(map[types.Object]string)
	ast.Inspect(stmt.X, func(node ast.Node) bool {
		ident, ok := node.(*ast.Ident)
		if !ok {
			return true
		}
		def := defsByName[ident.Name]
		if def == nil || aliases[def] != "" {
			return true
		}
		if used := ctx.semPkg.source.TypesInfo.Uses[ident]; used != nil && used != def {
			aliases[def] = ctx.tempName("RangeShadow")
		}
		return true
	})
	return aliases
}

func (o *LoweringOwner) lowerRangeFuncStmt(
	ctx lowerFileContext,
	stmt *ast.RangeStmt,
	rangeValue string,
	signature *types.Signature,
) (loweredStmt, []Diagnostic) {
	yieldSignature, ok := types.Unalias(signature.Params().At(0).Type()).Underlying().(*types.Signature)
	if !ok {
		return loweredStmt{}, []Diagnostic{loweringUnsupportedAt(ctx, stmt, "statement", ctx.semPkg.pkgPath, "unsupported function range yield signature")}
	}
	keyName := rangeKeyName(stmt.Key)
	valueName := rangeKeyName(stmt.Value)
	paramKeyName := keyName
	paramValueName := valueName
	if stmt.Tok != token.DEFINE {
		paramKeyName = ""
		paramValueName = ""
	}
	paramNames := rangeFuncParamNames(paramKeyName, paramValueName, yieldSignature.Params().Len(), ctx.tempName("Range"))

	parentBranch := ctx.rangeBranch
	rangeBranch := &loweredRangeBranch{hasReturn: ctx.tempName("RangeReturn")}
	if ctx.signature != nil && ctx.signature.Results() != nil && ctx.signature.Results().Len() != 0 {
		rangeBranch.value = ctx.tempName("RangeReturnValue")
		rangeBranch.resultType = o.tsSignatureResultFor(ctx, ctx.signature)
	}
	body, diagnostics := o.lowerBlock(ctx.withoutLoopLabel().withRangeBranch(rangeBranch), stmt.Body)
	if stmt.Tok != token.DEFINE {
		assignments, assignmentDiagnostics := o.lowerRangeFuncAssignments(ctx, stmt, paramNames)
		diagnostics = append(diagnostics, assignmentDiagnostics...)
		body = append(assignments, body...)
	}
	async := ctx.asyncFunction || stmtsContainAwait(body) || o.rangeFunctionValueNeedsAwait(ctx, stmt.X)

	return loweredStmt{rangeFunc: &loweredRangeFunc{
		value:        rangeValue,
		params:       paramNames,
		body:         body,
		async:        async,
		returnBranch: rangeBranch,
		parentBranch: parentBranch,
	}}, diagnostics
}

func (o *LoweringOwner) rangeFunctionValueNeedsAwait(ctx lowerFileContext, expr ast.Expr) bool {
	if call, ok := ast.Unparen(expr).(*ast.CallExpr); ok {
		if signatureForType(ctx.semPkg.source.TypesInfo.TypeOf(call)) != nil {
			return false
		}
	}
	return o.callNeedsAwait(ctx, expr)
}

func (o *LoweringOwner) lowerRangeFuncAssignments(
	ctx lowerFileContext,
	stmt *ast.RangeStmt,
	paramNames []string,
) ([]loweredStmt, []Diagnostic) {
	var diagnostics []Diagnostic
	var assignments []loweredStmt
	for idx, expr := range []ast.Expr{stmt.Key, stmt.Value} {
		if expr == nil || idx >= len(paramNames) {
			continue
		}
		if ident, ok := expr.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, expr, false)
		diagnostics = append(diagnostics, leftDiagnostics...)
		assignments = append(assignments, loweredStmt{text: left + " = " + paramNames[idx]})
	}
	return assignments, diagnostics
}

func (o *LoweringOwner) lowerSelectStmt(ctx lowerFileContext, stmt *ast.SelectStmt) (*loweredSelect, []Diagnostic) {
	resultType := "void"
	if ctx.signature != nil {
		resultType = o.tsSignatureResultFor(ctx, ctx.signature)
	}
	selectName := ctx.tempName("Select")
	lowered := &loweredSelect{
		hasReturn:  selectName + "HasReturn",
		value:      selectName + "Value",
		result:     selectName + "Result",
		resultType: resultType,
	}
	var diagnostics []Diagnostic
	caseID := 0
	for _, raw := range stmt.Body.List {
		clause, ok := raw.(*ast.CommClause)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, raw, "statement", ctx.semPkg.pkgPath, "unsupported select clause"))
			continue
		}
		switch comm := clause.Comm.(type) {
		case nil:
			body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak(), clause.Body)
			diagnostics = append(diagnostics, bodyDiagnostics...)
			lowered.hasDefault = true
			lowered.cases = append(lowered.cases, loweredSelectCase{
				id:      -1,
				channel: "null",
				body:    body,
			})
		case *ast.SendStmt:
			channel, channelDiagnostics := o.lowerExpr(ctx, comm.Chan)
			value, valueDiagnostics := o.lowerExpr(ctx, comm.Value)
			body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak(), clause.Body)
			diagnostics = append(diagnostics, channelDiagnostics...)
			diagnostics = append(diagnostics, valueDiagnostics...)
			diagnostics = append(diagnostics, bodyDiagnostics...)
			lowered.cases = append(lowered.cases, loweredSelectCase{
				id:      caseID,
				isSend:  true,
				channel: channel,
				value:   value,
				body:    body,
			})
			caseID++
		case *ast.ExprStmt:
			channel, prelude, receiveDiagnostics := o.lowerSelectReceiveComm(ctx, nil, comm.X, lowered.result)
			body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak(), clause.Body)
			diagnostics = append(diagnostics, receiveDiagnostics...)
			diagnostics = append(diagnostics, bodyDiagnostics...)
			lowered.cases = append(lowered.cases, loweredSelectCase{
				id:      caseID,
				channel: channel,
				prelude: prelude,
				body:    body,
			})
			caseID++
		case *ast.AssignStmt:
			channel, prelude, receiveDiagnostics := o.lowerSelectReceiveComm(ctx, comm, nil, lowered.result)
			body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak(), clause.Body)
			diagnostics = append(diagnostics, receiveDiagnostics...)
			diagnostics = append(diagnostics, bodyDiagnostics...)
			lowered.cases = append(lowered.cases, loweredSelectCase{
				id:      caseID,
				channel: channel,
				prelude: prelude,
				body:    body,
			})
			caseID++
		default:
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, comm, "statement", ctx.semPkg.pkgPath, "unsupported select communication"))
		}
	}
	lowered.returns = selectCasesReturn(lowered.cases)
	lowered.external = selectCasesNeedExternalBody(lowered.cases)
	return lowered, diagnostics
}

func selectCasesNeedExternalBody(cases []loweredSelectCase) bool {
	for _, switchCase := range cases {
		if stmtsContainLoopJump(switchCase.body) {
			return true
		}
	}
	return false
}

func selectCasesReturn(cases []loweredSelectCase) bool {
	if len(cases) == 0 {
		return false
	}
	for _, switchCase := range cases {
		if !stmtsEndInReturn(switchCase.body) {
			return false
		}
	}
	return true
}

func stmtsEndInReturn(stmts []loweredStmt) bool {
	if len(stmts) == 0 {
		return false
	}
	last := stmts[len(stmts)-1]
	return stmtEndsInReturn(last)
}

func stmtEndsInReturn(stmt loweredStmt) bool {
	trimmed := strings.TrimSpace(stmt.text)
	if strings.HasPrefix(trimmed, "return") {
		return true
	}
	if stmt.selectStmt != nil {
		return stmt.selectStmt.returns
	}
	if trimmed == "" && (stmt.hasBlock || len(stmt.children) != 0) {
		return stmtsEndInReturn(stmt.children)
	}
	if strings.HasPrefix(trimmed, "if ") && len(stmt.elseBody) != 0 {
		return stmtsEndInReturn(stmt.children) && stmtsEndInReturn(stmt.elseBody)
	}
	return false
}

func stmtsContainLoopJump(stmts []loweredStmt) bool {
	for _, stmt := range stmts {
		if stmtTextContainsLoopJump(stmt.text) {
			return true
		}
		if stmt.selectStmt != nil && stmtsContainSelectLoopJump(stmt.selectStmt) {
			return true
		}
		if stmtsContainLoopJump(stmt.children) || stmtsContainLoopJump(stmt.elseBody) {
			return true
		}
	}
	return false
}

func stmtTextContainsLoopJump(text string) bool {
	for line := range strings.SplitSeq(text, "\n") {
		trimmed := strings.TrimSpace(line)
		if trimmed == "break" || trimmed == "continue" ||
			strings.HasPrefix(trimmed, "break ") || strings.HasPrefix(trimmed, "continue ") {
			return true
		}
	}
	return false
}

func stmtsContainSelectLoopJump(stmt *loweredSelect) bool {
	if stmt == nil {
		return false
	}
	for _, switchCase := range stmt.cases {
		if stmtsContainLoopJump(switchCase.body) {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) lowerSelectReceiveComm(
	ctx lowerFileContext,
	assign *ast.AssignStmt,
	expr ast.Expr,
	resultName string,
) (string, []loweredStmt, []Diagnostic) {
	receiveExpr := expr
	if assign != nil && len(assign.Rhs) == 1 {
		receiveExpr = assign.Rhs[0]
	}
	receive, ok := receiveExpr.(*ast.UnaryExpr)
	if !ok || receive.Op != token.ARROW {
		return "null", nil, []Diagnostic{loweringUnsupportedAt(ctx, receiveExpr, "statement", ctx.semPkg.pkgPath, "unsupported select receive")}
	}
	channel, diagnostics := o.lowerExpr(ctx, receive.X)
	if assign == nil {
		return channel, nil, diagnostics
	}
	prelude := make([]loweredStmt, 0, len(assign.Lhs))
	fields := []string{".value", ".ok"}
	for idx, lhs := range assign.Lhs {
		if idx >= len(fields) {
			break
		}
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, assign.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs))
		diagnostics = append(diagnostics, leftDiagnostics...)
		prefix := ""
		if assign.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs) {
			prefix = "let "
		}
		prelude = append(prelude, loweredStmt{text: prefix + left + " = " + resultName + fields[idx]})
	}
	return channel, prelude, diagnostics
}

func (o *LoweringOwner) lowerSwitchStmt(ctx lowerFileContext, stmt *ast.SwitchStmt) ([]loweredStmt, []Diagnostic) {
	var diagnostics []Diagnostic
	var init []loweredStmt
	if stmt.Init != nil {
		lowered, initDiagnostics := o.lowerStmt(ctx, stmt.Init)
		diagnostics = append(diagnostics, initDiagnostics...)
		init = append(init, lowered...)
	}

	value := "true"
	var tagType types.Type
	if stmt.Tag != nil {
		var valueDiagnostics []Diagnostic
		value, valueDiagnostics = o.lowerExpr(ctx, stmt.Tag)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = lowerConstantComparableValue(ctx, stmt.Tag, value)
		tagType = ctx.semPkg.source.TypesInfo.TypeOf(stmt.Tag)
	} else if switchHasConstantCaseExpr(ctx, stmt) {
		value = "(true as boolean)"
	}

	compareCases := tagType != nil && isInterfaceType(tagType)
	compareValue := value
	if compareCases {
		compareValue = ctx.tempName("Switch")
		init = append(init, loweredStmt{text: "let " + compareValue + " = " + value})
		value = "true"
	}
	switchIR := &loweredSwitch{value: value}
	for _, raw := range stmt.Body.List {
		clause, ok := raw.(*ast.CaseClause)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, raw, "statement", ctx.semPkg.pkgPath, "unsupported switch clause"))
			continue
		}
		bodyStmts := clause.Body
		fallsThrough := false
		if len(bodyStmts) != 0 {
			if branch, ok := bodyStmts[len(bodyStmts)-1].(*ast.BranchStmt); ok && branch.Tok == token.FALLTHROUGH {
				bodyStmts = bodyStmts[:len(bodyStmts)-1]
				fallsThrough = true
			}
		}
		body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak().withSwitchBreak(), bodyStmts)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		values := make([]string, 0, len(clause.List))
		for _, expr := range clause.List {
			lowered, exprDiagnostics := o.lowerExpr(ctx, expr)
			diagnostics = append(diagnostics, exprDiagnostics...)
			if compareCases {
				sourceType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
				lowered = o.lowerValueForTargetTypes(ctx, tagType, sourceType, lowered, shouldCloneStructValue(expr))
				lowered = o.runtimeOwner.QualifiedHelper(RuntimeHelperComparableEqual) + "(" + compareValue + ", " + lowered + ")"
			}
			values = append(values, lowered)
		}
		switchIR.cases = append(switchIR.cases, loweredSwitchCase{
			defaultCase:  len(clause.List) == 0,
			values:       values,
			body:         body,
			fallsThrough: fallsThrough,
		})
	}

	lowered := loweredStmt{switchStmt: switchIR}
	if len(init) == 0 {
		return []loweredStmt{lowered}, diagnostics
	}
	init = append(init, lowered)
	return []loweredStmt{{children: init}}, diagnostics
}

func switchHasConstantCaseExpr(ctx lowerFileContext, stmt *ast.SwitchStmt) bool {
	for _, raw := range stmt.Body.List {
		clause, ok := raw.(*ast.CaseClause)
		if !ok {
			continue
		}
		for _, expr := range clause.List {
			if constantComparableType(ctx, expr) != "" {
				return true
			}
		}
	}
	return false
}

func lowerConstantComparableValue(ctx lowerFileContext, expr ast.Expr, value string) string {
	if typ := constantComparableType(ctx, expr); typ != "" {
		return "(" + value + " as " + typ + ")"
	}
	return value
}

func constantComparableType(ctx lowerFileContext, expr ast.Expr) string {
	tv, ok := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)]
	if !ok || tv.Value == nil {
		return ""
	}
	basic, ok := types.Unalias(tv.Type).Underlying().(*types.Basic)
	if !ok {
		return ""
	}
	switch {
	case basic.Info()&types.IsBoolean != 0:
		return "boolean"
	case basic.Info()&types.IsString != 0:
		return "string"
	case basic.Info()&types.IsNumeric != 0 && basic.Info()&types.IsComplex == 0:
		return "number"
	default:
		return ""
	}
}

func (o *LoweringOwner) lowerTypeSwitchStmt(ctx lowerFileContext, stmt *ast.TypeSwitchStmt) ([]loweredStmt, []Diagnostic) {
	var lowered []loweredStmt
	var diagnostics []Diagnostic
	if stmt.Init != nil {
		init, initDiagnostics := o.lowerStmt(ctx, stmt.Init)
		diagnostics = append(diagnostics, initDiagnostics...)
		lowered = append(lowered, init...)
	}

	valueExpr, varName, varRef, assignDiagnostics := o.lowerTypeSwitchAssign(ctx, stmt.Assign)
	diagnostics = append(diagnostics, assignDiagnostics...)
	if valueExpr == "" {
		return lowered, append(diagnostics, loweringUnsupportedAt(ctx, stmt.Assign, "statement", ctx.semPkg.pkgPath, "unsupported type switch assignment"))
	}

	switchIR := &loweredTypeSwitch{
		value:   valueExpr,
		varName: varName,
		varRef:  varRef,
	}
	for _, clauseStmt := range stmt.Body.List {
		clause, ok := clauseStmt.(*ast.CaseClause)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, clauseStmt, "statement", ctx.semPkg.pkgPath, "unsupported type switch clause"))
			continue
		}
		body, bodyDiagnostics := o.lowerStmtList(ctx.withoutRangeBreak().withSwitchBreak(), clause.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		if len(clause.List) == 0 {
			switchIR.defaultBody = body
			switchIR.defaultRef = varRef || loweredStmtsUseVarRefName(body, varName)
			continue
		}
		types := make([]string, 0, len(clause.List))
		tsTypes := make([]string, 0, len(clause.List))
		for _, expr := range clause.List {
			typ := ctx.semPkg.source.TypesInfo.TypeOf(expr)
			types = append(types, o.runtimeTypeInfoExpr(typ))
			if typ == nil {
				tsTypes = append(tsTypes, "any")
			} else {
				tsTypes = append(tsTypes, o.tsTypeSwitchCaseTypeFor(ctx, typ))
			}
		}
		switchIR.cases = append(switchIR.cases, loweredTypeSwitchCase{
			types:   types,
			tsTypes: tsTypes,
			varRef:  varRef || loweredStmtsUseVarRefName(body, varName),
			body:    body,
		})
	}
	lowered = append(lowered, loweredStmt{typeSwitch: switchIR})
	return lowered, diagnostics
}

func (o *LoweringOwner) tsTypeSwitchCaseTypeFor(ctx lowerFileContext, typ types.Type) string {
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if _, ok := named.Underlying().(*types.Interface); ok {
			return o.tsNonNilTypeFor(ctx, named)
		}
	}
	return o.tsTypeFor(ctx, typ)
}

func loweredStmtsUseVarRefName(stmts []loweredStmt, name string) bool {
	if name == "" {
		return false
	}
	needle := name + ".value"
	for _, stmt := range stmts {
		if strings.Contains(stmt.text, needle) {
			return true
		}
		if loweredStmtsUseVarRefName(stmt.children, name) {
			return true
		}
		if stmt.switchStmt != nil {
			for _, switchCase := range stmt.switchStmt.cases {
				if loweredStmtsUseVarRefName(switchCase.body, name) {
					return true
				}
			}
		}
		if stmt.typeSwitch != nil {
			for _, switchCase := range stmt.typeSwitch.cases {
				if loweredStmtsUseVarRefName(switchCase.body, name) {
					return true
				}
			}
			if loweredStmtsUseVarRefName(stmt.typeSwitch.defaultBody, name) {
				return true
			}
		}
	}
	return false
}

func (o *LoweringOwner) lowerTypeSwitchAssign(ctx lowerFileContext, stmt ast.Stmt) (string, string, bool, []Diagnostic) {
	switch typed := stmt.(type) {
	case *ast.ExprStmt:
		return o.lowerTypeSwitchGuard(ctx, typed.X, "")
	case *ast.AssignStmt:
		if len(typed.Lhs) != 1 || len(typed.Rhs) != 1 {
			return "", "", false, nil
		}
		varName := ""
		varRef := false
		if ident, ok := typed.Lhs[0].(*ast.Ident); ok && ident.Name != "_" {
			varName = safeIdentifier(ident.Name)
			if obj := ctx.semPkg.source.TypesInfo.Defs[ident]; obj != nil {
				varRef = ctx.model.needsVarRef[obj]
			} else if obj := ctx.semPkg.source.TypesInfo.Uses[ident]; obj != nil {
				varRef = ctx.model.needsVarRef[obj]
			}
		}
		value, name, _, diagnostics := o.lowerTypeSwitchGuard(ctx, typed.Rhs[0], varName)
		return value, name, varRef, diagnostics
	default:
		return "", "", false, nil
	}
}

func (o *LoweringOwner) lowerTypeSwitchGuard(ctx lowerFileContext, expr ast.Expr, varName string) (string, string, bool, []Diagnostic) {
	assertion, ok := expr.(*ast.TypeAssertExpr)
	if !ok || assertion.Type != nil {
		return "", "", false, nil
	}
	value, diagnostics := o.lowerExpr(ctx, assertion.X)
	return value, varName, false, diagnostics
}

func rangeKeyName(expr ast.Expr) string {
	ident, ok := expr.(*ast.Ident)
	if !ok || ident.Name == "_" {
		return ""
	}
	return safeIdentifier(ident.Name)
}

func rangeKeyNameFor(ctx lowerFileContext, expr ast.Expr, aliases map[types.Object]string) string {
	if ident, ok := expr.(*ast.Ident); ok && ident.Name != "_" {
		if alias := aliases[ctx.semPkg.source.TypesInfo.Defs[ident]]; alias != "" {
			return alias
		}
	}
	return rangeKeyName(expr)
}

func rangeFunctionSignature(typ types.Type) *types.Signature {
	signature, ok := types.Unalias(typ).Underlying().(*types.Signature)
	if !ok || signature.Params() == nil || signature.Params().Len() != 1 {
		return nil
	}
	yieldSignature, ok := types.Unalias(signature.Params().At(0).Type()).Underlying().(*types.Signature)
	if !ok || yieldSignature.Params() == nil || yieldSignature.Results() == nil {
		return nil
	}
	if yieldSignature.Params().Len() > 2 || yieldSignature.Results().Len() != 1 {
		return nil
	}
	if !isBoolType(yieldSignature.Results().At(0).Type()) {
		return nil
	}
	return signature
}

func isFunctionType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Signature)
	return ok
}

func isBoolType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Kind() == types.Bool
}

func isUntypedNilType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Kind() == types.UntypedNil
}

func rangeFuncParamNames(keyName, valueName string, arity int, fallback string) []string {
	names := make([]string, 0, arity)
	if arity >= 1 {
		name := keyName
		if name == "" {
			name = fallback + "_0"
		}
		names = append(names, name)
	}
	if arity >= 2 {
		name := valueName
		if name == "" {
			name = fallback + "_1"
		}
		names = append(names, name)
	}
	return names
}

func isIntegerRangeType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Info()&types.IsInteger != 0
}

func isEqualityOperator(op token.Token) bool {
	return op == token.EQL || op == token.NEQ
}

func isArrayType(typ types.Type) bool {
	_, ok := types.Unalias(typ).Underlying().(*types.Array)
	return ok
}

func (o *LoweringOwner) lowerEqualityOperands(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, string) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if constantComparableType(ctx, expr.X) != "" && constantComparableType(ctx, expr.X) == constantComparableType(ctx, expr.Y) {
		left = lowerConstantComparableValue(ctx, expr.X, left)
	}
	if isNumericType(leftType) && isNumericType(rightType) {
		left = o.lowerValueForTarget(ctx, expr.X, rightType, left)
		right = o.lowerValueForTarget(ctx, expr.Y, leftType, right)
	}
	if isStringType(leftType) && isStringType(rightType) {
		leftLiteral := isStringLiteralExpr(expr.X)
		rightLiteral := isStringLiteralExpr(expr.Y)
		if leftLiteral && !rightLiteral {
			right = "(" + right + " as string)"
		}
		if rightLiteral && !leftLiteral {
			left = "(" + left + " as string)"
		}
	}
	if isInterfaceType(leftType) && !isInterfaceType(rightType) {
		right = o.lowerValueForTargetTypes(ctx, leftType, rightType, right, false)
	}
	if isInterfaceType(rightType) && !isInterfaceType(leftType) {
		left = o.lowerValueForTargetTypes(ctx, rightType, leftType, left, false)
	}
	return left, right
}

func (o *LoweringOwner) lowerArrayEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isArrayType(leftType) || !isArrayType(rightType) {
		return "", false
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayEqual) + "(" + left + ", " + right + ")"
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

func (o *LoweringOwner) lowerComplexEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isComplexType(leftType) || !isComplexType(rightType) {
		return "", false
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayEqual) + "(" + left + ", " + right + ")"
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

func (o *LoweringOwner) lowerStructEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isStructComparableType(leftType) || !isStructComparableType(rightType) {
		return "", false
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperComparableEqual) + "(" + left + ", " + right + ")"
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

func (o *LoweringOwner) lowerStringEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isStringType(leftType) || !isStringType(rightType) {
		return "", false
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperStringEqual) + "(" + left + ", " + right + ")"
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

func (o *LoweringOwner) lowerInterfaceEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	if isNilExpr(expr.X) || isNilExpr(expr.Y) {
		return "", false
	}
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isInterfaceType(leftType) && !isInterfaceType(rightType) {
		return "", false
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperComparableEqual) + "(" + left + ", " + right + ")"
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

func (o *LoweringOwner) lowerStringOrderExpr(
	ctx lowerFileContext,
	expr *ast.BinaryExpr,
	left string,
	right string,
	leftDiagnostics []Diagnostic,
	rightDiagnostics []Diagnostic,
) (string, []Diagnostic, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isStringType(leftType) || !isStringType(rightType) {
		return "", nil, false
	}
	left, leftDiagnostics = o.lowerStringOrderOperand(ctx, expr.X, left, leftDiagnostics)
	right, rightDiagnostics = o.lowerStringOrderOperand(ctx, expr.Y, right, rightDiagnostics)
	compare := o.runtimeOwner.QualifiedHelper(RuntimeHelperStringCompare) + "(" + left + ", " + right + ")"
	switch expr.Op {
	case token.LSS:
		return compare + " < 0", append(leftDiagnostics, rightDiagnostics...), true
	case token.LEQ:
		return compare + " <= 0", append(leftDiagnostics, rightDiagnostics...), true
	case token.GTR:
		return compare + " > 0", append(leftDiagnostics, rightDiagnostics...), true
	case token.GEQ:
		return compare + " >= 0", append(leftDiagnostics, rightDiagnostics...), true
	default:
		return "", nil, false
	}
}

func (o *LoweringOwner) lowerStringOrderOperand(
	ctx lowerFileContext,
	expr ast.Expr,
	fallback string,
	fallbackDiagnostics []Diagnostic,
) (string, []Diagnostic) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return fallback, fallbackDiagnostics
	}
	targetType := typeFromExpr(ctx, call.Fun)
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])
	if targetType == nil || sourceType == nil || !isStringType(targetType) || !isByteSliceType(sourceType) {
		return fallback, fallbackDiagnostics
	}
	return o.lowerExpr(ctx, call.Args[0])
}

func binaryOperandUsesTypeParam(ctx lowerFileContext, expr ast.Expr) bool {
	typ := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	_, ok := types.Unalias(typ).(*types.TypeParam)
	return ok
}

func (o *LoweringOwner) lowerExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value; value != nil && value.Kind() == constant.Complex {
		if constantValue, ok := lowerConstantValue(value); ok {
			return constantValue, nil
		}
	}
	switch typed := expr.(type) {
	case *ast.BasicLit:
		return lowerBasicLit(typed), nil
	case *ast.Ident:
		return o.lowerIdent(ctx, typed, false), nil
	case *ast.BinaryExpr:
		if value := ctx.semPkg.source.TypesInfo.Types[typed].Value; value != nil {
			if (typed.Op == token.SHL || typed.Op == token.SHR) && (value.Kind() == constant.Int || value.Kind() == constant.Float) {
				if constantValue, ok := lowerConstantValue(value); ok {
					return constantValue, nil
				}
			}
			if constantValue, ok := lowerLargeIntegerConstantValue(value); ok {
				return constantValue, nil
			}
		}
		if isEqualityOperator(typed.Op) {
			if value, diagnostics, ok := o.lowerAddressEqualityExpr(ctx, typed); ok {
				return value, diagnostics
			}
		}
		left, leftDiagnostics := o.lowerExpr(ctx, typed.X)
		right, rightDiagnostics := o.lowerExpr(ctx, typed.Y)
		if _, ok := typed.X.(*ast.BinaryExpr); ok {
			left = "(" + left + ")"
		}
		if _, ok := typed.Y.(*ast.BinaryExpr); ok {
			right = "(" + right + ")"
		}
		if typed.Op == token.AND_NOT {
			return left + " & ~(" + right + ")", append(leftDiagnostics, rightDiagnostics...)
		}
		if isEqualityOperator(typed.Op) {
			if value, ok := o.lowerArrayEqualityExpr(ctx, typed, left, right); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
			if value, ok := o.lowerComplexEqualityExpr(ctx, typed, left, right); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
			if value, ok := o.lowerStructEqualityExpr(ctx, typed, left, right); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
			if value, ok := o.lowerStringEqualityExpr(ctx, typed, left, right); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
			if value, ok := o.lowerInterfaceEqualityExpr(ctx, typed, left, right); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
			left, right = o.lowerEqualityOperands(ctx, typed, left, right)
		}
		if value, ok := o.lowerWideIntegerBinaryExpr(ctx, typed, left, right); ok {
			return value, append(leftDiagnostics, rightDiagnostics...)
		}
		if typed.Op == token.QUO && isIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(typed)) {
			return "Math.trunc(" + left + " / " + right + ")", append(leftDiagnostics, rightDiagnostics...)
		}
		if typed.Op == token.SHR {
			if bits, ok := unsignedIntegerBits(ctx.semPkg.source.TypesInfo.TypeOf(typed.X)); ok && bits <= 32 {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperUintShr) +
					"(" + left + ", " + right + ", " + strconv.Itoa(bits) + ")", append(leftDiagnostics, rightDiagnostics...)
			}
		}
		if value, diagnostics, ok := o.lowerStringOrderExpr(ctx, typed, left, right, leftDiagnostics, rightDiagnostics); ok {
			return value, diagnostics
		}
		if binaryOperandUsesTypeParam(ctx, typed.X) {
			left = "(" + left + " as any)"
		}
		if binaryOperandUsesTypeParam(ctx, typed.Y) {
			right = "(" + right + " as any)"
		}
		return left + " " + typed.Op.String() + " " + right, append(leftDiagnostics, rightDiagnostics...)
	case *ast.UnaryExpr:
		if typed.Op == token.AND {
			return o.lowerAddressExpr(ctx, typed.X)
		}
		if typed.Op == token.ARROW {
			value, diagnostics := o.lowerExpr(ctx, typed.X)
			return "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecv) + "(" + value + ")", diagnostics
		}
		value, diagnostics := o.lowerExpr(ctx, typed.X)
		if typed.Op == token.NOT || typed.Op == token.SUB || typed.Op == token.ADD {
			return lowerPrefixUnaryExpr(typed.Op, value), diagnostics
		}
		if typed.Op == token.XOR {
			if bits, ok := unsignedIntegerBits(ctx.semPkg.source.TypesInfo.TypeOf(typed)); ok {
				if bits <= 32 {
					return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) +
						"(~" + value + ", " + strconv.Itoa(bits) + ")", diagnostics
				}
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint64Xor) +
					"(" + value + ", -1n)", diagnostics
			}
			if bits, ok := signedIntegerBits(ctx.semPkg.source.TypesInfo.TypeOf(typed)); ok && bits > 32 {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt64Xor) +
					"(" + value + ", -1n)", diagnostics
			}
			return "~" + value, diagnostics
		}
		return value, append(diagnostics, loweringUnsupportedAt(ctx, typed, "expression", ctx.semPkg.pkgPath, "unsupported unary operator"))
	case *ast.StarExpr:
		return o.lowerPointerValueExpr(ctx, typed.X)
	case *ast.ParenExpr:
		value, diagnostics := o.lowerExpr(ctx, typed.X)
		return "(" + value + ")", diagnostics
	case *ast.CallExpr:
		return o.lowerCallExpr(ctx, typed)
	case *ast.FuncLit:
		value, _, diagnostics := o.lowerFuncLit(ctx, typed)
		return value, diagnostics
	case *ast.SelectorExpr:
		return o.lowerSelectorExpr(ctx, typed)
	case *ast.IndexExpr:
		return o.lowerIndexExpr(ctx, typed)
	case *ast.SliceExpr:
		return o.lowerSliceExpr(ctx, typed)
	case *ast.CompositeLit:
		return o.lowerCompositeLit(ctx, typed, true)
	case *ast.TypeAssertExpr:
		return o.lowerTypeAssertExpr(ctx, typed)
	case *ast.IndexListExpr:
		return o.lowerExpr(ctx, typed.X)
	default:
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, typed, "expression", ctx.semPkg.pkgPath, "unsupported expression kind")}
	}
}

func lowerBasicLit(lit *ast.BasicLit) string {
	if lit.Kind == token.CHAR {
		value, err := strconv.Unquote(lit.Value)
		if err != nil || value == "" {
			return "0"
		}
		return strconv.FormatInt(int64([]rune(value)[0]), 10)
	}
	if lit.Kind == token.STRING {
		value, err := strconv.Unquote(lit.Value)
		if err != nil {
			return strconv.Quote(lit.Value)
		}
		return lowerGoStringLiteral(value)
	}
	if lit.Kind == token.INT && isLegacyOctalLiteral(lit.Value) {
		digits := strings.TrimLeft(strings.ReplaceAll(lit.Value, "_", ""), "0")
		if digits == "" {
			digits = "0"
		}
		return "0o" + digits
	}
	return lit.Value
}

func isStringLiteralExpr(expr ast.Expr) bool {
	lit, ok := unwrapParenExpr(expr).(*ast.BasicLit)
	return ok && lit.Kind == token.STRING
}

func isLegacyOctalLiteral(value string) bool {
	if len(value) < 2 || value[0] != '0' {
		return false
	}
	if len(value) >= 2 {
		switch value[1] {
		case 'x', 'X', 'o', 'O', 'b', 'B':
			return false
		}
	}
	for _, char := range value[1:] {
		if char == '_' {
			continue
		}
		return char >= '0' && char <= '7'
	}
	return false
}

func (o *LoweringOwner) lowerFuncLit(ctx lowerFileContext, lit *ast.FuncLit) (string, bool, []Diagnostic) {
	signature, _ := ctx.semPkg.source.TypesInfo.TypeOf(lit).(*types.Signature)
	deferState := &loweredDeferState{}
	bodyCtx := ctx.withSignature(signature).withAsyncFunction(false).withDeferState(deferState).withoutRangeBranch()
	asyncCompatibleParams := funcLiteralNeedsAsyncFunctionParamCalls(signature)
	if asyncCompatibleParams || funcLiteralUsesFunctionIdentifierCall(ctx, lit) {
		bodyCtx = bodyCtx.withAsyncFunction(true)
	}
	var params []loweredParam
	var paramBindings []loweredStmt
	if signature != nil && signature.Params() != nil {
		for idx := range signature.Params().Len() {
			param := signature.Params().At(idx)
			params, paramBindings = o.appendLoweredParam(ctx, params, paramBindings, param, idx, asyncCompatibleParams)
		}
	}
	body, diagnostics := o.lowerBlock(bodyCtx, lit.Body)
	var rendered strings.Builder
	renderStmts(&rendered, paramBindings, 1)
	renderNamedResults(&rendered, o.lowerNamedResults(ctx, signature), 1)
	renderDeferStack(&rendered, deferState, 1)
	renderStmts(&rendered, body, 1)
	async := stmtsContainAwait(body) || deferState.async
	prefix := ""
	if async {
		prefix = "async "
	}
	function := prefix + "(" + renderLoweredParams(params) + "): " +
		asyncResultType(o.tsSignatureResultFor(ctx, signature), async) + " => {\n" +
		rendered.String() + "}"
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFunctionValue) +
		"(" + function + ", " + o.runtimeFunctionTypeInfo(signature, "") + ")", async, diagnostics
}

func renderLoweredParams(params []loweredParam) string {
	if len(params) == 0 {
		return ""
	}
	rendered := make([]string, 0, len(params))
	for _, param := range params {
		rendered = append(rendered, param.name+": "+param.typ)
	}
	return strings.Join(rendered, ", ")
}

func funcLiteralUsesFunctionIdentifierCall(ctx lowerFileContext, lit *ast.FuncLit) bool {
	if lit == nil || lit.Body == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	uses := false
	ast.Inspect(lit.Body, func(node ast.Node) bool {
		if uses {
			return false
		}
		if nested, ok := node.(*ast.FuncLit); ok && nested != lit {
			return false
		}
		call, ok := node.(*ast.CallExpr)
		if !ok {
			return true
		}
		uses = callUsesFunctionIdentifier(ctx.semPkg.source, call.Fun)
		return !uses
	})
	return uses
}

func stmtsContainAwait(stmts []loweredStmt) bool {
	for _, stmt := range stmts {
		if strings.Contains(stmt.text, "await ") ||
			stmtsContainAwait(stmt.children) ||
			stmtsContainAwait(stmt.elseBody) {
			return true
		}
		if stmt.rangeFunc != nil && (stmt.rangeFunc.async || stmtsContainAwait(stmt.rangeFunc.body)) {
			return true
		}
		if stmt.selectStmt != nil {
			return true
		}
		if stmt.switchStmt != nil {
			for _, switchCase := range stmt.switchStmt.cases {
				if stmtsContainAwait(switchCase.body) {
					return true
				}
			}
		}
		if stmt.typeSwitch != nil {
			for _, switchCase := range stmt.typeSwitch.cases {
				if stmtsContainAwait(switchCase.body) {
					return true
				}
			}
			if stmtsContainAwait(stmt.typeSwitch.defaultBody) {
				return true
			}
		}
	}
	return false
}

func lowerIdent(ident *ast.Ident) string {
	switch ident.Name {
	case "nil":
		return "null"
	case "true", "false":
		return ident.Name
	default:
		return safeIdentifier(ident.Name)
	}
}

func (o *LoweringOwner) lowerIdent(ctx lowerFileContext, ident *ast.Ident, raw bool) string {
	value := lowerIdent(ident)
	if ident.Name == "nil" || ident.Name == "true" || ident.Name == "false" {
		return value
	}
	obj := objectForIdent(ctx, ident)
	if alias := ctx.identAliases[obj]; alias != "" {
		if !raw && obj != nil && ctx.identAliasRefs[obj] && ctx.model.needsVarRef[obj] {
			return alias + ".value"
		}
		return alias
	}
	if constObj, ok := obj.(*types.Const); ok && !raw {
		if constValue, ok := lowerConstantValue(constObj.Val()); ok {
			return constValue
		}
	}
	if alias := ctx.localAliases[obj]; alias != "" {
		if ctx.lazyPackageVars[obj] {
			lazyValue := alias + "." + packageVarGetterName(value) + "()"
			if (ctx.asyncFunction || ctx.topLevel) && o.packageVarHasAsyncLazyInit(ctx, obj) {
				lazyValue = "(await " + alias + "." + packageVarInitName(value) + "(), " + lazyValue + ")"
			}
			if raw {
				return lazyValue
			}
			return o.lowerPackageVarReadValue(ctx, obj, lazyValue)
		}
		if raw {
			return alias + "." + value
		}
		return o.lowerPackageVarReadValue(ctx, obj, alias+"."+value)
	}
	if raw {
		return value
	}
	if ctx.lazyPackageVars[obj] {
		lazyValue := packageVarGetterName(value) + "()"
		if (ctx.asyncFunction || ctx.topLevel) && o.packageVarHasAsyncLazyInit(ctx, obj) {
			lazyValue = "(await " + packageVarInitName(value) + "(), " + lazyValue + ")"
		}
		return o.lowerPackageVarReadValue(ctx, obj, lazyValue)
	}
	if obj != nil && ctx.model.needsVarRef[obj] {
		return value + ".value"
	}
	return value
}

func (o *LoweringOwner) lowerPackageVarReadValue(ctx lowerFileContext, obj types.Object, value string) string {
	if obj == nil || ctx.model == nil || !ctx.model.needsVarRef[obj] {
		return value
	}
	if varObj, ok := obj.(*types.Var); ok && packageVarReadNeedsPointerValue(varObj.Type()) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
			"<" + o.tsNonNilTypeFor(ctx, varObj.Type()) + ">(" + value + ")"
	}
	return value + ".value"
}

func objectForIdent(ctx lowerFileContext, ident *ast.Ident) types.Object {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	if obj := ctx.semPkg.source.TypesInfo.Uses[ident]; obj != nil {
		return obj
	}
	return ctx.semPkg.source.TypesInfo.Defs[ident]
}

func objectForValueExpr(ctx lowerFileContext, expr ast.Expr) types.Object {
	switch typed := expr.(type) {
	case *ast.Ident:
		return objectForIdent(ctx, typed)
	case *ast.SelectorExpr:
		if ctx.semPkg == nil || ctx.semPkg.source == nil {
			return nil
		}
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil {
			return nil
		}
		return ctx.semPkg.source.TypesInfo.Uses[typed.Sel]
	default:
		return nil
	}
}

func objectNeedsVarRef(ctx lowerFileContext, obj types.Object) bool {
	if obj == nil || ctx.model == nil {
		return false
	}
	if ctx.model.needsVarRef[obj] {
		return true
	}
	if obj.Pkg() == nil {
		return false
	}
	semPkg := ctx.model.packages[obj.Pkg().Path()]
	if semPkg == nil {
		return false
	}
	for _, value := range semPkg.values {
		if value.name == obj.Name() && ctx.model.needsVarRef[value.object] {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) lowerCallExpr(ctx lowerFileContext, expr *ast.CallExpr) (string, []Diagnostic) {
	if ident, ok := expr.Fun.(*ast.Ident); ok && isBuiltinCallTarget(ctx, ident) {
		switch ident.Name {
		case "make":
			return o.lowerMakeExpr(ctx, expr)
		case "new":
			return o.lowerNewExpr(ctx, expr)
		}
	}
	if targetType := typeFromExpr(ctx, expr.Fun); targetType != nil {
		return o.lowerConversionExpr(ctx, expr, targetType)
	}

	args, diagnostics := o.lowerCallArgs(ctx, expr, callTargetSignature(ctx, expr.Fun))

	switch fun := expr.Fun.(type) {
	case *ast.Ident:
		if isBuiltinCallTarget(ctx, fun) {
			switch fun.Name {
			case "println", "print":
				helper := RuntimeHelperPrintln
				if fun.Name == "print" {
					helper = RuntimeHelperPrint
				}
				return o.runtimeOwner.QualifiedHelper(helper) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "append":
				if len(expr.Args) > 0 {
					if slice, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0])).Underlying().(*types.Slice); ok {
						for idx := 1; idx < len(args); idx++ {
							if expr.Ellipsis != token.NoPos && idx == len(args)-1 {
								continue
							}
							args[idx] = o.lowerValueForTargetTypes(
								ctx,
								slice.Elem(),
								ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[idx]),
								args[idx],
								false,
							)
						}
					}
				}
				if expr.Ellipsis != token.NoPos && len(args) > 1 {
					last := len(args) - 1
					spread := args[last]
					if isStringType(ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[len(expr.Args)-1])) {
						spread = o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToBytes) + "(" + spread + ")"
					}
					args[last] = "...(" + spread + " ?? [])"
				}
				appendHelper := o.runtimeOwner.QualifiedHelper(RuntimeHelperAppend)
				if len(args) > 0 && args[0] == "null" {
					if slice, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr)).Underlying().(*types.Slice); ok {
						appendHelper += "<" + o.tsTypeFor(ctx, slice.Elem()) + ">"
					}
				}
				return appendHelper + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "cap":
				if len(expr.Args) == 1 {
					args[0] = o.lowerArrayPointerTarget(ctx, args[0], ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0]))
				}
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperCap) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "clear":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperClear) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "copy":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperCopy) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "delete":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperDeleteMapEntry) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "len":
				if len(expr.Args) == 1 {
					if literalLen, ok := lowerConstantStringLen(ctx, expr.Args[0]); ok {
						return literalLen, diagnostics
					}
					args[0] = o.lowerArrayPointerTarget(ctx, args[0], ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0]))
				}
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperLen) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "max":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperMax) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "min":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperMin) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "complex":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "real":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperReal) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "imag":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperImag) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "panic":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperPanic) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "recover":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperRecover) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "close":
				if len(args) != 1 {
					return "undefined", append(diagnostics, loweringUnsupportedAt(ctx, expr, "call", ctx.semPkg.pkgPath, "close requires one argument"))
				}
				return args[0] + "!.close()", diagnostics
			}
		}
		if signature := genericFunctionSignature(ctx, fun); signature != nil {
			args = append([]string{o.inferredGenericTypeArgsExpr(ctx, signature, expr.Args)}, args...)
		}
		callee := o.lowerCallableExpr(ctx, fun, o.lowerIdent(ctx, fun, false))
		call := callee + "(" + strings.Join(args, ", ") + ")"
		return o.awaitCallIfNeeded(ctx, fun, call), diagnostics
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[fun]; selection != nil && selection.Kind() == types.MethodVal {
			if typeParam := receiverTypeParam(selection.Recv()); typeParam != nil {
				receiverExpr, receiverDiagnostics := o.lowerExpr(ctx, fun.X)
				diagnostics = append(diagnostics, receiverDiagnostics...)
				if !typeParamInScope(ctx, typeParam) {
					call := receiverExpr + "." + fun.Sel.Name + "(" + strings.Join(args, ", ") + ")"
					return o.awaitCallIfNeeded(ctx, fun, call), diagnostics
				}
				methodArgs := append([]string{"__typeArgs", strconv.Quote(typeParam.Obj().Name()), strconv.Quote(fun.Sel.Name), receiverExpr}, args...)
				call := o.runtimeOwner.QualifiedHelper(RuntimeHelperCallGenericMethod) + "(" + strings.Join(methodArgs, ", ") + ")"
				return o.awaitCallIfNeeded(ctx, fun, call), diagnostics
			}
			receiver := methodReceiverNamedType(selection.Obj())
			if receiver == nil {
				receiver = receiverNamedType(selection.Recv())
			}
			if namedNonInterfaceNonStructType(receiver) {
				return o.lowerNamedReceiverMethodCall(ctx, fun, args, diagnostics)
			}
			if call, callDiagnostics, ok := o.lowerPointerReceiverMethodCall(ctx, fun, selection, args); ok {
				return o.awaitCallIfNeeded(ctx, fun, call), append(diagnostics, callDiagnostics...)
			}
			receiverExpr, receiverDiagnostics := o.lowerMethodReceiverExpr(ctx, fun.X, selection)
			diagnostics = append(diagnostics, receiverDiagnostics...)
			call := receiverExpr + "." + fun.Sel.Name + "(" + strings.Join(args, ", ") + ")"
			return o.awaitCallIfNeeded(ctx, fun, call), diagnostics
		}
		selector, selectorDiagnostics := o.lowerSelectorExpr(ctx, fun)
		if signature := genericFunctionSignature(ctx, fun); signature != nil && !o.callUsesOverridePackage(ctx, fun) {
			args = append([]string{o.inferredGenericTypeArgsExpr(ctx, signature, expr.Args)}, args...)
		}
		call := o.lowerCallableExpr(ctx, fun, selector) + "(" + strings.Join(args, ", ") + ")"
		if unsafePackageFunction(ctx, fun, "Slice") {
			call = "(" + call + " as " + o.tsTypeFor(ctx, ctx.semPkg.source.TypesInfo.TypeOf(expr)) + ")"
		}
		return o.awaitCallIfNeeded(ctx, fun, call), append(diagnostics, selectorDiagnostics...)
	case *ast.IndexExpr:
		if signature := callTargetSignature(ctx, fun); signature != nil {
			if callTargetSignature(ctx, fun.X) != nil {
				callee, calleeDiagnostics := o.lowerExpr(ctx, fun.X)
				args = append([]string{o.genericTypeArgsExpr(ctx, fun.X, []ast.Expr{fun.Index})}, args...)
				call := o.lowerCallableExpr(ctx, fun.X, callee) + "(" + strings.Join(args, ", ") + ")"
				return o.awaitCallIfNeeded(ctx, fun, call), append(diagnostics, calleeDiagnostics...)
			}
			callee, calleeDiagnostics := o.lowerExpr(ctx, fun)
			call := o.lowerCallableExpr(ctx, fun, callee) + "(" + strings.Join(args, ", ") + ")"
			return o.awaitCallIfNeeded(ctx, fun, call), append(diagnostics, calleeDiagnostics...)
		}
	case *ast.IndexListExpr:
		if signature, _ := ctx.semPkg.source.TypesInfo.TypeOf(fun).(*types.Signature); signature != nil {
			callee, calleeDiagnostics := o.lowerExpr(ctx, fun.X)
			args = append([]string{o.genericTypeArgsExpr(ctx, fun.X, fun.Indices)}, args...)
			call := o.lowerCallableExpr(ctx, fun.X, callee) + "(" + strings.Join(args, ", ") + ")"
			return o.awaitCallIfNeeded(ctx, fun, call), append(diagnostics, calleeDiagnostics...)
		}
	case *ast.CallExpr:
		callee, calleeDiagnostics := o.lowerCallExpr(ctx, fun)
		if strings.HasPrefix(callee, "await ") {
			callee = "(" + callee + ")"
		}
		callee = o.lowerCallableExpr(ctx, fun, callee)
		call := callee + "(" + strings.Join(args, ", ") + ")"
		if strings.HasPrefix(callee, "(await ") && ctx.deferState != nil {
			ctx.deferState.async = true
		}
		return o.awaitCallIfNeeded(ctx, fun, call), append(diagnostics, calleeDiagnostics...)
	case *ast.FuncLit:
		callee, async, calleeDiagnostics := o.lowerFuncLit(ctx, fun)
		call := "(" + callee + ")(" + strings.Join(args, ", ") + ")"
		if async {
			call = "await " + call
			if ctx.deferState != nil {
				ctx.deferState.async = true
			}
		}
		return call, append(diagnostics, calleeDiagnostics...)
	default:
		if callTargetSignature(ctx, expr.Fun) != nil {
			callee, calleeDiagnostics := o.lowerExpr(ctx, expr.Fun)
			if strings.HasPrefix(callee, "await ") {
				callee = "(" + callee + ")"
			}
			call := o.lowerCallableExpr(ctx, expr.Fun, callee) + "(" + strings.Join(args, ", ") + ")"
			return o.awaitCallIfNeeded(ctx, expr.Fun, call), append(diagnostics, calleeDiagnostics...)
		}
		return "undefined", append(diagnostics, loweringUnsupportedAt(ctx, expr.Fun, "call", ctx.semPkg.pkgPath, fmt.Sprintf("unsupported call target %T", expr.Fun)))
	}
	return "undefined", append(diagnostics, loweringUnsupportedAt(ctx, expr.Fun, "call", ctx.semPkg.pkgPath, fmt.Sprintf("unsupported call target %T", expr.Fun)))
}

func (o *LoweringOwner) lowerCallableExpr(ctx lowerFileContext, expr ast.Expr, callee string) string {
	if callTargetNeedsNonNull(ctx, expr) {
		return callee + "!"
	}
	return callee
}

func (o *LoweringOwner) lowerCallArgs(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	signature *types.Signature,
) ([]string, []Diagnostic) {
	overrideCall := o.callUsesOverridePackage(ctx, expr.Fun)
	if args, diagnostics, ok := o.lowerTupleCallArgs(ctx, expr, signature, overrideCall); ok {
		return args, diagnostics
	}
	if signature != nil && signature.Variadic() && overrideCall && !isBuiltinCallTarget(ctx, expr.Fun) {
		params := signature.Params()
		if params == nil || params.Len() == 0 {
			return o.lowerFixedCallArgs(ctx, expr.Args, signature, overrideCall)
		}
		fixedCount := params.Len() - 1
		targetType := params.At(fixedCount).Type()
		if slice, ok := types.Unalias(targetType).Underlying().(*types.Slice); ok {
			targetType = slice.Elem()
		}
		args := make([]string, 0, len(expr.Args))
		var diagnostics []Diagnostic
		for idx, arg := range expr.Args {
			lowered, argDiagnostics := o.lowerExpr(ctx, arg)
			diagnostics = append(diagnostics, argDiagnostics...)
			if idx < fixedCount {
				lowered = o.lowerCallArgForTarget(ctx, arg, params.At(idx).Type(), lowered, overrideCall)
			} else if expr.Ellipsis != token.NoPos && idx == len(expr.Args)-1 {
				lowered = o.lowerCallArgForTarget(ctx, arg, params.At(fixedCount).Type(), lowered, overrideCall)
				lowered = "...(" + lowered + " ?? [])"
			} else {
				lowered = o.lowerCallArgForTarget(ctx, arg, targetType, lowered, overrideCall)
			}
			args = append(args, lowered)
		}
		return args, diagnostics
	}
	if signature == nil || !signature.Variadic() ||
		isBuiltinCallTarget(ctx, expr.Fun) ||
		overrideCall {
		return o.lowerFixedCallArgs(ctx, expr.Args, signature, overrideCall)
	}
	params := signature.Params()
	if params == nil || params.Len() == 0 {
		return o.lowerFixedCallArgs(ctx, expr.Args, signature, overrideCall)
	}

	fixedCount := params.Len() - 1
	args := make([]string, 0, params.Len())
	var variadicArgs []string
	var diagnostics []Diagnostic
	for idx, arg := range expr.Args {
		lowered, argDiagnostics := o.lowerExpr(ctx, arg)
		diagnostics = append(diagnostics, argDiagnostics...)
		if idx < fixedCount {
			lowered = o.lowerCallArgForTarget(ctx, arg, params.At(idx).Type(), lowered, overrideCall)
			args = append(args, lowered)
			continue
		}
		if expr.Ellipsis != token.NoPos && idx == len(expr.Args)-1 {
			lowered = o.lowerCallArgForTarget(ctx, arg, params.At(fixedCount).Type(), lowered, overrideCall)
			args = append(args, lowered)
			continue
		}
		if slice, ok := types.Unalias(params.At(fixedCount).Type()).Underlying().(*types.Slice); ok {
			lowered = o.lowerCallArgForTarget(ctx, arg, slice.Elem(), lowered, overrideCall)
		}
		variadicArgs = append(variadicArgs, lowered)
	}
	if len(expr.Args) < fixedCount || (expr.Ellipsis != token.NoPos && len(args) == params.Len()) {
		return args, diagnostics
	}
	if len(variadicArgs) == 0 {
		args = append(args, "null")
		return args, diagnostics
	}

	elemType := "any"
	if slice, ok := types.Unalias(params.At(fixedCount).Type()).Underlying().(*types.Slice); ok {
		elemType = o.tsTypeFor(ctx, slice.Elem())
	}
	args = append(args, o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayToSlice)+
		"<"+elemType+">(["+strings.Join(variadicArgs, ", ")+"])")
	return args, diagnostics
}

func (o *LoweringOwner) lowerTupleCallArgs(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	signature *types.Signature,
	overrideCall bool,
) ([]string, []Diagnostic, bool) {
	if signature == nil || signature.Variadic() || len(expr.Args) != 1 ||
		isBuiltinCallTarget(ctx, expr.Fun) || overrideCall {
		return nil, nil, false
	}
	params := signature.Params()
	sourceResults := tupleResultTypes(ctx, expr.Args[0])
	if params == nil || sourceResults == nil || sourceResults.Len() != params.Len() || sourceResults.Len() < 2 {
		return nil, nil, false
	}
	value, diagnostics := o.lowerTupleExpr(ctx, expr.Args[0])
	parts := make([]string, 0, sourceResults.Len())
	changed := false
	for idx := range sourceResults.Len() {
		part := "__goscriptTupleArg[" + strconv.Itoa(idx) + "]"
		converted := o.lowerValueForTargetTypes(ctx, params.At(idx).Type(), sourceResults.At(idx).Type(), part, false)
		if converted != part {
			changed = true
		}
		parts = append(parts, converted)
	}
	if !changed {
		return []string{"...(" + o.parenthesizedTupleCast(ctx, value, params) + ")"}, diagnostics, true
	}
	temp := ctx.tempName("TupleArg")
	for idx, part := range parts {
		parts[idx] = strings.ReplaceAll(part, "__goscriptTupleArg", temp)
	}
	body := "const " + temp + " = " + value + "; return " + o.tupleLiteralCast(ctx, params, parts)
	if strings.Contains(value, "await ") {
		return []string{"...(await (async () => { " + body + " })())"}, diagnostics, true
	}
	return []string{"...(() => { " + body + " })()"}, diagnostics, true
}

func (o *LoweringOwner) parenthesizedTupleCast(ctx lowerFileContext, value string, params *types.Tuple) string {
	if strings.HasPrefix(value, "await ") {
		return "(" + value + ") as " + o.tupleTypeForParams(ctx, params)
	}
	return value + " as " + o.tupleTypeForParams(ctx, params)
}

func (o *LoweringOwner) tupleLiteralCast(ctx lowerFileContext, params *types.Tuple, parts []string) string {
	return "[" + strings.Join(parts, ", ") + "] as " + o.tupleTypeForParams(ctx, params)
}

func (o *LoweringOwner) tupleTypeForParams(ctx lowerFileContext, params *types.Tuple) string {
	if params == nil || params.Len() == 0 {
		return "[]"
	}
	parts := make([]string, 0, params.Len())
	for v := range params.Variables() {
		parts = append(parts, o.tsTypeFor(ctx, v.Type()))
	}
	return "[" + strings.Join(parts, ", ") + "]"
}

func (o *LoweringOwner) lowerFixedCallArgs(
	ctx lowerFileContext,
	exprs []ast.Expr,
	signature *types.Signature,
	overrideCall bool,
) ([]string, []Diagnostic) {
	var params *types.Tuple
	if signature != nil {
		params = signature.Params()
	}
	args := make([]string, 0, len(exprs))
	var diagnostics []Diagnostic
	for idx, expr := range exprs {
		lowered, exprDiagnostics := o.lowerExpr(ctx, expr)
		diagnostics = append(diagnostics, exprDiagnostics...)
		if params != nil && idx < params.Len() {
			lowered = o.lowerCallArgForTarget(ctx, expr, params.At(idx).Type(), lowered, overrideCall)
		}
		args = append(args, lowered)
	}
	return args, diagnostics
}

func (o *LoweringOwner) lowerCallArgForTarget(
	ctx lowerFileContext,
	expr ast.Expr,
	targetType types.Type,
	value string,
	overrideCall bool,
) string {
	value = o.lowerValueForTarget(ctx, expr, targetType, value)
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if overrideCall && isNonEmptyInterfaceType(targetType) && (isInterfaceType(sourceType) || isNilableType(sourceType)) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValueOrNil) + "(" + value + ")!"
	}
	return value
}

func (o *LoweringOwner) lowerExprList(ctx lowerFileContext, exprs []ast.Expr) ([]string, []Diagnostic) {
	args := make([]string, 0, len(exprs))
	var diagnostics []Diagnostic
	for _, expr := range exprs {
		lowered, exprDiagnostics := o.lowerExpr(ctx, expr)
		diagnostics = append(diagnostics, exprDiagnostics...)
		args = append(args, lowered)
	}
	return args, diagnostics
}

func callTargetSignature(ctx lowerFileContext, expr ast.Expr) *types.Signature {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	typ := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if typ == nil {
		return nil
	}
	if signature, ok := typ.(*types.Signature); ok {
		return signature
	}
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	return signature
}

func callTargetNeedsNonNull(ctx lowerFileContext, expr ast.Expr) bool {
	if callTargetSignature(ctx, expr) == nil {
		return false
	}
	switch typed := expr.(type) {
	case *ast.FuncLit:
		return false
	case *ast.Ident:
		switch objectForIdent(ctx, typed).(type) {
		case *types.Func, *types.Builtin:
			return false
		default:
			return true
		}
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil && selection.Kind() == types.MethodVal {
			return false
		}
		if _, ok := objectForIdent(ctx, typed.Sel).(*types.Func); ok {
			return false
		}
		return true
	default:
		return true
	}
}

func isBuiltinCallTarget(ctx lowerFileContext, expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	if !ok {
		return false
	}
	_, ok = objectForIdent(ctx, ident).(*types.Builtin)
	return ok
}

func (o *LoweringOwner) callUsesOverridePackage(ctx lowerFileContext, expr ast.Expr) bool {
	if o.overrideOwner == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	fn := calledFunction(ctx.semPkg.source, expr)
	if fn == nil || fn.Pkg() == nil {
		return false
	}
	if ctx.model != nil && ctx.model.functions[fn] != nil {
		return false
	}
	return o.overrideFacts().HasPackage(fn.Pkg().Path())
}

func unsafePackageFunction(ctx lowerFileContext, expr ast.Expr, name string) bool {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	selector, ok := expr.(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != name {
		return false
	}
	ident, ok := selector.X.(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "unsafe"
}

func (o *LoweringOwner) lowerMakeExpr(ctx lowerFileContext, expr *ast.CallExpr) (string, []Diagnostic) {
	if len(expr.Args) < 1 {
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr, "call", ctx.semPkg.pkgPath, "make requires a type argument")}
	}
	targetType := typeFromExpr(ctx, expr.Args[0])
	if targetType == nil {
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr.Args[0], "call", ctx.semPkg.pkgPath, "make requires a type expression")}
	}
	switch typed := types.Unalias(targetType).Underlying().(type) {
	case *types.Slice:
		length := "0"
		capacity := ""
		var diagnostics []Diagnostic
		if len(expr.Args) >= 2 {
			var lengthDiagnostics []Diagnostic
			length, lengthDiagnostics = o.lowerExpr(ctx, expr.Args[1])
			diagnostics = append(diagnostics, lengthDiagnostics...)
		}
		if len(expr.Args) >= 3 {
			var capacityDiagnostics []Diagnostic
			capacity, capacityDiagnostics = o.lowerExpr(ctx, expr.Args[2])
			diagnostics = append(diagnostics, capacityDiagnostics...)
		}
		args := []string{length}
		if capacity != "" {
			args = append(args, capacity)
		}
		if hint := sliceTypeHint(typed.Elem()); hint != "" {
			if capacity == "" {
				args = append(args, "undefined")
			}
			args = append(args, strconv.Quote(hint))
		}
		if namedStructType(typed.Elem()) != nil && isStructValueType(typed.Elem()) {
			if capacity == "" {
				args = append(args, "undefined")
			}
			if len(args) < 3 {
				args = append(args, "undefined")
			}
			args = append(args, "() => "+o.lowerZeroValueExprFor(ctx, typed.Elem()))
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMakeSlice) +
			"<" + o.tsSliceElemTypeFor(ctx, typed.Elem()) + ">(" + strings.Join(args, ", ") + ")", diagnostics
	case *types.Map:
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMakeMap) +
			"<" + o.tsTypeFor(ctx, typed.Key()) + ", " + o.tsTypeFor(ctx, typed.Elem()) + ">()", nil
	case *types.Chan:
		capacity := "0"
		var diagnostics []Diagnostic
		if len(expr.Args) >= 2 {
			var capacityDiagnostics []Diagnostic
			capacity, capacityDiagnostics = o.lowerExpr(ctx, expr.Args[1])
			diagnostics = append(diagnostics, capacityDiagnostics...)
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMakeChannel) +
			"<" + o.tsTypeFor(ctx, typed.Elem()) + ">(" + capacity + ", " +
			o.lowerZeroValueExprFor(ctx, typed.Elem()) + ", " + strconv.Quote(channelDirectionString(typed.Dir())) + ")", diagnostics
	default:
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr.Args[0], "call", ctx.semPkg.pkgPath, "unsupported make type")}
	}
}

func (o *LoweringOwner) lowerNewExpr(ctx lowerFileContext, expr *ast.CallExpr) (string, []Diagnostic) {
	if len(expr.Args) != 1 {
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr, "call", ctx.semPkg.pkgPath, "new requires one type argument")}
	}
	typ := typeFromExpr(ctx, expr.Args[0])
	if named := namedStructType(typ); named != nil {
		return "new " + o.namedTypeExpr(ctx, named) + "()", nil
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) +
		"<" + o.tsTypeFor(ctx, typ) + ">(" + o.lowerDeclarationZeroValueExpr(ctx, typ) + ")", nil
}

func (o *LoweringOwner) lowerConversionExpr(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	targetType types.Type,
) (string, []Diagnostic) {
	if len(expr.Args) != 1 {
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr, "call", ctx.semPkg.pkgPath, "unsupported conversion arity")}
	}
	value, diagnostics := o.lowerExpr(ctx, expr.Args[0])
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0])
	if isNumericType(targetType) && isUnsafePointerType(sourceType) {
		if value, addressDiagnostics, ok := o.lowerUnsafePointerIntegerExpr(ctx, expr.Args[0]); ok {
			return value, append(diagnostics, addressDiagnostics...)
		}
	}
	if helper, addressDiagnostics, ok := o.lowerReflectHeaderPointerConversion(ctx, targetType, expr.Args[0]); ok {
		return helper, append(diagnostics, addressDiagnostics...)
	}
	if helper, addressDiagnostics, ok := o.lowerUnsafeArrayPointerConversion(ctx, targetType, expr.Args[0]); ok {
		return helper, append(diagnostics, addressDiagnostics...)
	}
	if isUnsafePointerType(targetType) {
		return "(" + value + " as any)", diagnostics
	}
	if isNilExpr(expr.Args[0]) && isPointerType(targetType) {
		return "null", diagnostics
	}
	if isInterfaceType(targetType) {
		return o.lowerValueForTarget(ctx, expr.Args[0], targetType, value), diagnostics
	}
	if isStringType(targetType) {
		switch {
		case isRuneSliceType(sourceType):
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperRunesToString) + "(" + value + ")", diagnostics
		case isByteSliceType(sourceType):
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperBytesToString) + "(" + value + ")", diagnostics
		case overrideNamedStringType(ctx, o, sourceType):
			return "String(" + value + ")", diagnostics
		case isStringType(sourceType):
			return value, diagnostics
		case isNumericType(sourceType):
			return "String.fromCodePoint(" + value + ")", diagnostics
		default:
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericBytesOrStringToString) + "(" + value + ")", diagnostics
		}
	}
	if isRuneSliceType(targetType) && isStringType(sourceType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToRunes) + "(" + value + ")", diagnostics
	}
	if isByteSliceType(targetType) && isStringType(sourceType) {
		if literal, ok := lowerConstantStringByteSlice(ctx, expr.Args[0]); ok {
			return literal, diagnostics
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToBytes) + "(" + value + ")", diagnostics
	}
	if array := pointerToArrayType(targetType); array != nil {
		if slice, ok := types.Unalias(sourceType).Underlying().(*types.Slice); ok && types.Identical(array.Elem(), slice.Elem()) {
			result := o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceToArrayPointer) +
				"<" + o.tsTypeFor(ctx, array.Elem()) + ">(" +
				value + ", " + strconv.FormatInt(array.Len(), 10)
			if isByteType(array.Elem()) {
				result += `, "byte"`
			}
			result += ")"
			if isByteType(array.Elem()) {
				result = "(" + result + " as unknown as " + o.tsTypeFor(ctx, targetType) + ")"
			}
			return result, diagnostics
		}
	}
	if array, ok := types.Unalias(targetType).Underlying().(*types.Array); ok {
		if slice, ok := types.Unalias(sourceType).Underlying().(*types.Slice); ok && types.Identical(array.Elem(), slice.Elem()) {
			result := o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceToArray) +
				"<" + o.tsTypeFor(ctx, array.Elem()) + ">(" +
				value + ", " + strconv.FormatInt(array.Len(), 10)
			if isByteType(array.Elem()) {
				result += `, "byte"`
			}
			result += ")"
			if isByteType(array.Elem()) {
				result = "(" + result + " as unknown as " + o.tsTypeFor(ctx, targetType) + ")"
			}
			return result, diagnostics
		}
	}
	if target := pointerToNamedStructType(targetType); target != nil {
		source := pointerToNamedStructType(sourceType)
		if source != nil && !types.Identical(target, source) &&
			types.IdenticalIgnoreTags(target.Underlying(), source.Underlying()) {
			return "(" + value + " as unknown as " + o.tsTypeFor(ctx, targetType) + ")", diagnostics
		}
	}
	if conversion, ok := o.lowerNamedStructConversion(ctx, expr.Args[0], targetType, sourceType, value); ok {
		return renderNamedStructConversion(conversion), diagnostics
	}
	if isNumericType(targetType) {
		if constantValue, ok := o.lowerNumericConstantExprForTarget(ctx, expr.Args[0], targetType); ok {
			return constantValue, diagnostics
		}
	}
	if named := namedFunctionType(targetType); named != nil {
		typeName := runtimeNamedTypeName(named)
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperNamedFunction) +
			"(" + value + ", " + strconv.Quote(typeName) + ", " +
			o.runtimeFunctionTypeInfo(named.Underlying().(*types.Signature), typeName) + ")", diagnostics
	}
	if named := namedNonStructType(targetType); named != nil {
		if _, ok := named.Underlying().(*types.Slice); ok {
			return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")", diagnostics
		}
		return value, diagnostics
	}
	if isNumericType(targetType) {
		if isFloatType(targetType) {
			return value, diagnostics
		}
		if bits, ok := unsignedIntegerBits(targetType); ok {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) +
				"(" + value + ", " + strconv.Itoa(bits) + ")", diagnostics
		}
		if bits, ok := signedIntegerBits(targetType); ok && bits < 64 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) +
				"(" + value + ", " + strconv.Itoa(bits) + ")", diagnostics
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) + "(" + value + ")", diagnostics
	}
	return value, diagnostics
}

func (o *LoweringOwner) lowerWideIntegerBinaryExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	resultWide := isRuntimeWideIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(expr))
	leftWide := isRuntimeWideIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(expr.X))
	if !resultWide && !leftWide {
		return "", false
	}
	signed := isFixedSignedWideIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) ||
		isFixedSignedWideIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(expr.X))
	switch expr.Op {
	case token.SHL, token.SHR:
		helper := RuntimeHelperUint64Shr
		if expr.Op == token.SHL {
			helper = RuntimeHelperUint64Shl
		}
		if signed {
			helper = RuntimeHelperInt64Shr
			if expr.Op == token.SHL {
				helper = RuntimeHelperInt64Shl
			}
		}
		if _, ok := constantShiftAmount(ctx, expr.Y); !ok {
			return o.runtimeOwner.QualifiedHelper(helper) + "(" + left + ", " + right + ")", true
		}
		amount, ok := constantShiftAmount(ctx, expr.Y)
		if ok && amount >= 32 && expr.Op == token.SHL && !signed {
			base := o.lowerWideShiftLeftOperand(ctx, expr.X, left)
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint64Mul) +
				"(" + base + ", " + shiftMultiplier(amount) + ")", true
		}
		return o.runtimeOwner.QualifiedHelper(helper) + "(" + left + ", " + right + ")", true
	case token.MUL:
		return o.runtimeOwner.QualifiedHelper(wideIntegerHelper(signed, RuntimeHelperUint64Mul, RuntimeHelperInt64Mul)) + "(" + left + ", " + right + ")", true
	case token.QUO:
		return o.runtimeOwner.QualifiedHelper(wideIntegerHelper(signed, RuntimeHelperUint64Div, RuntimeHelperInt64Div)) + "(" + left + ", " + right + ")", true
	case token.REM:
		return o.runtimeOwner.QualifiedHelper(wideIntegerHelper(signed, RuntimeHelperUint64Mod, RuntimeHelperInt64Mod)) + "(" + left + ", " + right + ")", true
	case token.ADD:
		return o.runtimeOwner.QualifiedHelper(wideIntegerHelper(signed, RuntimeHelperUint64Add, RuntimeHelperInt64Add)) + "(" + left + ", " + right + ")", true
	case token.SUB:
		return o.runtimeOwner.QualifiedHelper(wideIntegerHelper(signed, RuntimeHelperUint64Sub, RuntimeHelperInt64Sub)) + "(" + left + ", " + right + ")", true
	case token.AND:
		return o.runtimeOwner.QualifiedHelper(wideIntegerHelper(signed, RuntimeHelperUint64And, RuntimeHelperInt64And)) + "(" + left + ", " + right + ")", true
	case token.XOR:
		return o.runtimeOwner.QualifiedHelper(wideIntegerHelper(signed, RuntimeHelperUint64Xor, RuntimeHelperInt64Xor)) + "(" + left + ", " + right + ")", true
	case token.OR:
		shift, ok := wideLeftShiftExpr(ctx, expr.X)
		if ok && !signed {
			if bits, ok := lowIntegerBits(ctx, expr.Y); ok && bits <= shift {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint64Add) + "(" + left + ", " + right + ")", true
			}
		}
		return o.runtimeOwner.QualifiedHelper(wideIntegerHelper(signed, RuntimeHelperUint64Or, RuntimeHelperInt64Or)) + "(" + left + ", " + right + ")", true
	default:
		return "", false
	}
}

func wideIntegerHelper(signed bool, unsigned RuntimeHelper, signedHelper RuntimeHelper) RuntimeHelper {
	if signed {
		return signedHelper
	}
	return unsigned
}

func (o *LoweringOwner) lowerWideShiftLeftOperand(ctx lowerFileContext, expr ast.Expr, fallback string) string {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return fallback
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if bits, ok := unsignedIntegerBits(targetType); !ok || bits < 64 {
		return fallback
	}
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])
	if _, ok := signedIntegerBits(sourceType); !ok {
		return fallback
	}
	value, _ := o.lowerExpr(ctx, call.Args[0])
	return value
}

func constantShiftAmount(ctx lowerFileContext, expr ast.Expr) (int, bool) {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	if value == nil {
		return 0, false
	}
	amount, ok := constant.Int64Val(value)
	if !ok || amount < 0 || amount > int64(strconv.IntSize) {
		return 0, false
	}
	return int(amount), true
}

func wideLeftShiftExpr(ctx lowerFileContext, expr ast.Expr) (int, bool) {
	binary, ok := unwrapParenExpr(expr).(*ast.BinaryExpr)
	if !ok || binary.Op != token.SHL || !isWideIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(binary.X)) {
		return 0, false
	}
	amount, ok := constantShiftAmount(ctx, binary.Y)
	if !ok || amount < 32 {
		return 0, false
	}
	return amount, true
}

func lowIntegerBits(ctx lowerFileContext, expr ast.Expr) (int, bool) {
	if call, ok := unwrapParenExpr(expr).(*ast.CallExpr); ok && len(call.Args) == 1 {
		if bits, ok := integerBits(ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])); ok {
			return bits, true
		}
	}
	return integerBits(ctx.semPkg.source.TypesInfo.TypeOf(expr))
}

func shiftMultiplier(amount int) string {
	return "(2 ** " + strconv.Itoa(amount) + ")"
}

func (o *LoweringOwner) lowerNamedStructConversion(
	ctx lowerFileContext,
	sourceExpr ast.Expr,
	targetType types.Type,
	sourceType types.Type,
	value string,
) (*loweredNamedStructConversionExpr, bool) {
	target := namedStructType(targetType)
	source := namedStructType(sourceType)
	if target == nil || source == nil || types.Identical(target, source) ||
		!types.IdenticalIgnoreTags(target.Underlying(), source.Underlying()) {
		return nil, false
	}
	if o.typeUsesOverride(target) || o.typeUsesOverride(source) {
		return &loweredNamedStructConversionExpr{
			value: loweredExpr{
				text:  value,
				async: o.conversionValueNeedsAwait(ctx, sourceExpr),
			},
			castOnly:   true,
			castTarget: o.tsTypeFor(ctx, targetType),
		}, true
	}
	structType, _ := target.Underlying().(*types.Struct)
	temp := ctx.tempName("Convert")
	fields := make([]loweredConversionField, 0, structType.NumFields())
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fields = append(fields, loweredConversionField{name: tsStructFieldName(field.Name(), idx)})
	}
	return &loweredNamedStructConversionExpr{
		value: loweredExpr{
			text:  value,
			async: o.conversionValueNeedsAwait(ctx, sourceExpr),
		},
		target: o.namedTypeExpr(ctx, target),
		temp:   temp,
		helper: o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue),
		fields: fields,
	}, true
}

func (o *LoweringOwner) conversionValueNeedsAwait(ctx lowerFileContext, expr ast.Expr) bool {
	switch typed := expr.(type) {
	case *ast.CallExpr:
		if o.callNeedsAwait(ctx, typed.Fun) || o.conversionValueNeedsAwait(ctx, typed.Fun) {
			return true
		}
		for _, arg := range typed.Args {
			if o.conversionValueNeedsAwait(ctx, arg) {
				return true
			}
		}
		return false
	case *ast.ParenExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X)
	case *ast.UnaryExpr:
		return typed.Op == token.ARROW || o.conversionValueNeedsAwait(ctx, typed.X)
	case *ast.BinaryExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X) || o.conversionValueNeedsAwait(ctx, typed.Y)
	case *ast.CompositeLit:
		for _, elt := range typed.Elts {
			if o.conversionValueNeedsAwait(ctx, elt) {
				return true
			}
		}
		return false
	case *ast.FuncLit:
		return ctx.model != nil && ctx.semPkg != nil && ctx.semPkg.source != nil &&
			exprMayNeedAwait(ctx.model, ctx.semPkg.source, typed)
	case *ast.IndexExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X) || o.conversionValueNeedsAwait(ctx, typed.Index)
	case *ast.IndexListExpr:
		if o.conversionValueNeedsAwait(ctx, typed.X) {
			return true
		}
		for _, index := range typed.Indices {
			if o.conversionValueNeedsAwait(ctx, index) {
				return true
			}
		}
		return false
	case *ast.KeyValueExpr:
		return o.conversionValueNeedsAwait(ctx, typed.Key) || o.conversionValueNeedsAwait(ctx, typed.Value)
	case *ast.SelectorExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X)
	case *ast.SliceExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X) ||
			o.conversionValueNeedsAwait(ctx, typed.Low) ||
			o.conversionValueNeedsAwait(ctx, typed.High) ||
			o.conversionValueNeedsAwait(ctx, typed.Max)
	case *ast.StarExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X)
	case *ast.TypeAssertExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X)
	default:
		return false
	}
}

func (o *LoweringOwner) typeUsesOverride(named *types.Named) bool {
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil || o.overrideOwner == nil {
		return false
	}
	return o.overrideFacts().HasPackage(named.Obj().Pkg().Path())
}

func (o *LoweringOwner) lowerNamedReceiverMethodCall(
	ctx lowerFileContext,
	selector *ast.SelectorExpr,
	args []string,
	diagnostics []Diagnostic,
) (string, []Diagnostic) {
	selection := ctx.semPkg.source.TypesInfo.Selections[selector]
	receiver := methodReceiverNamedType(selection.Obj())
	if receiver == nil {
		receiver = selectedReceiverNamedType(ctx.semPkg.source, selector, selection)
	}
	receiverExpr, receiverDiagnostics := o.lowerNamedReceiverForMethod(ctx, selector.X, selection)
	diagnostics = append(diagnostics, receiverDiagnostics...)
	allArgs := append([]string{receiverExpr}, args...)
	call := o.methodFunctionExpr(ctx, receiver, selection.Obj(), selector.Sel.Name) + "(" + strings.Join(allArgs, ", ") + ")"
	return o.awaitCallIfNeeded(ctx, selector, call), diagnostics
}

func (o *LoweringOwner) lowerPointerReceiverMethodCall(
	ctx lowerFileContext,
	selector *ast.SelectorExpr,
	selection *types.Selection,
	args []string,
) (string, []Diagnostic, bool) {
	if len(selection.Index()) != 1 || !isPointerToStructType(ctx.semPkg.source.TypesInfo.TypeOf(selector.X)) {
		return "", nil, false
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return "", nil, false
	}
	signature, _ := method.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return "", nil, false
	}
	if !isPointerToStructType(signature.Recv().Type()) {
		return "", nil, false
	}
	receiver := receiverNamedType(signature.Recv().Type())
	if receiver == nil {
		return "", nil, false
	}
	receiverExpr, diagnostics := o.lowerExpr(ctx, selector.X)
	if o.receiverUsesOverridePackage(signature.Recv().Type()) {
		receiverExpr = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
			"<" + o.tsTypeFor(ctx, signature.Recv().Type().(*types.Pointer).Elem()) + ">(" + receiverExpr + ")"
	}
	if receiverExpr == o.namedTypeExpr(ctx, receiver) {
		call := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
			"<" + o.namedTypeExpr(ctx, receiver) + ">(" + receiverExpr + ")." +
			methodMemberName(selector.Sel.Name) + "(" + strings.Join(args, ", ") + ")"
		return call, diagnostics, true
	}
	if crossPackageUnexportedNamedType(ctx, receiver) {
		call := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
			"<any>(" + receiverExpr + ")." + methodMemberName(selector.Sel.Name) +
			"(" + strings.Join(args, ", ") + ")"
		return call, diagnostics, true
	}
	callArgs := append([]string{receiverExpr}, args...)
	call := o.namedTypeExpr(ctx, receiver) + ".prototype." + selector.Sel.Name + ".call(" + strings.Join(callArgs, ", ") + ")"
	return call, diagnostics, true
}

func methodAllowsNilReceiver(ctx lowerFileContext, method *types.Func) bool {
	if method == nil || method.Pkg() == nil {
		return false
	}
	semPkg := ctx.semPkg
	if semPkg == nil || semPkg.pkgPath != method.Pkg().Path() {
		if ctx.model == nil {
			return false
		}
		semPkg = ctx.model.packages[method.Pkg().Path()]
	}
	if semPkg == nil || semPkg.source == nil {
		return false
	}
	for _, file := range semPkg.source.Syntax {
		for _, decl := range file.Decls {
			fnDecl, ok := decl.(*ast.FuncDecl)
			if !ok || fnDecl.Body == nil || semPkg.source.TypesInfo.Defs[fnDecl.Name] != method {
				continue
			}
			if fnDecl.Recv == nil || len(fnDecl.Recv.List) == 0 || len(fnDecl.Recv.List[0].Names) == 0 {
				return false
			}
			receiverName := fnDecl.Recv.List[0].Names[0].Name
			checksNil := false
			directDeref := false
			ast.Inspect(fnDecl.Body, func(node ast.Node) bool {
				if checksNil || directDeref {
					return false
				}
				if _, ok := node.(*ast.FuncLit); ok {
					return false
				}
				if star, ok := node.(*ast.StarExpr); ok && identName(star.X) == receiverName {
					directDeref = true
					return false
				}
				if selector, ok := node.(*ast.SelectorExpr); ok && identName(selector.X) == receiverName {
					if selection := semPkg.source.TypesInfo.Selections[selector]; selection != nil &&
						selection.Kind() == types.FieldVal {
						directDeref = true
						return false
					}
				}
				binary, ok := node.(*ast.BinaryExpr)
				if !ok || (binary.Op != token.EQL && binary.Op != token.NEQ) {
					return true
				}
				if identName(binary.X) == receiverName && isNilExpr(binary.Y) ||
					identName(binary.Y) == receiverName && isNilExpr(binary.X) {
					checksNil = true
					return false
				}
				return true
			})
			return checksNil || !directDeref
		}
	}
	return false
}

func identName(expr ast.Expr) string {
	ident, _ := ast.Unparen(expr).(*ast.Ident)
	if ident == nil {
		return ""
	}
	return ident.Name
}

func (o *LoweringOwner) lowerNamedReceiverForMethod(
	ctx lowerFileContext,
	expr ast.Expr,
	selection *types.Selection,
) (string, []Diagnostic) {
	method, _ := selection.Obj().(*types.Func)
	receiverPointer := false
	var receiverType types.Type
	if method != nil {
		signature, _ := method.Type().(*types.Signature)
		if signature != nil && signature.Recv() != nil {
			receiverType = signature.Recv().Type()
			_, receiverPointer = receiverType.(*types.Pointer)
		}
	}
	if receiverPointer {
		if isPointerType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
			return o.lowerExpr(ctx, expr)
		}
		if ident, ok := expr.(*ast.Ident); ok {
			if obj := objectForIdent(ctx, ident); obj != nil && ctx.model.needsVarRef[obj] {
				return o.lowerIdent(ctx, ident, true), nil
			}
		}
		return o.lowerAddressExpr(ctx, expr)
	}
	receiver, diagnostics := o.lowerMethodReceiverExpr(ctx, expr, selection)
	selectedType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if index := selection.Index(); len(index) > 1 && !o.receiverUsesOverridePackage(selectedType) {
		selectedType = promotedMethodReceiverType(selectedType, index[:len(index)-1])
	}
	if receiverType != nil && isPointerType(selectedType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + "<" + o.tsTypeFor(ctx, receiverType) + ">(" + receiver + ")", diagnostics
	}
	return receiver, diagnostics
}

func (o *LoweringOwner) lowerSelectorExpr(ctx lowerFileContext, expr *ast.SelectorExpr) (string, []Diagnostic) {
	if ident, ok := expr.X.(*ast.Ident); ok {
		if pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName); pkgName != nil {
			if alias := importAliasForPkgName(ctx, pkgName); alias != "" {
				value := alias + "." + expr.Sel.Name
				obj, _ := ctx.semPkg.source.TypesInfo.Uses[expr.Sel].(*types.Var)
				if o.packageVarIsLazy(ctx, obj) ||
					o.packageVarNameIsLazy(ctx, pkgName.Imported().Path(), expr.Sel.Name) {
					value = alias + "." + packageVarGetterName(expr.Sel.Name) + "()"
					if (ctx.asyncFunction || ctx.topLevel) &&
						o.packageVarNameHasAsyncLazyInit(ctx, pkgName.Imported().Path(), expr.Sel.Name) {
						value = "(await " + alias + "." + packageVarInitName(expr.Sel.Name) + "(), " + value + ")"
					}
				}
				if obj != nil && packageVarReadNeedsPointerValue(obj.Type()) {
					value = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
						"<" + o.tsNonNilTypeFor(ctx, obj.Type()) + ">(" + value + ")"
				}
				return value, nil
			}
		}
	}
	if selection := ctx.semPkg.source.TypesInfo.Selections[expr]; selection != nil {
		switch selection.Kind() {
		case types.MethodVal:
			namedReceiver := methodReceiverNamedType(selection.Obj())
			if namedReceiver == nil {
				namedReceiver = selectedReceiverNamedType(ctx.semPkg.source, expr, selection)
			}
			if namedNonInterfaceNonStructType(namedReceiver) {
				receiverExpr, diagnostics := o.lowerNamedReceiverForMethod(ctx, expr.X, selection)
				methodExpr := o.methodFunctionExpr(ctx, namedReceiver, selection.Obj(), expr.Sel.Name)
				return o.lowerMethodValueClosure(ctx, selection, receiverExpr, methodExpr, true), diagnostics
			}
			receiver, diagnostics := o.lowerMethodReceiverExpr(ctx, expr.X, selection)
			return o.lowerMethodValueClosure(ctx, selection, receiver, "__receiver."+expr.Sel.Name, false), diagnostics
		case types.MethodExpr:
			if receiver := receiverNamedType(selection.Recv()); namedNonInterfaceNonStructType(receiver) {
				return o.methodFunctionExpr(ctx, receiver, selection.Obj(), expr.Sel.Name), nil
			}
			return o.lowerMethodExpressionClosure(ctx, selection), nil
		case types.FieldVal:
			return o.lowerFieldSelectionExpr(ctx, expr, selection, false)
		}
	}
	left, diagnostics := o.lowerExpr(ctx, expr.X)
	left = parenthesizeAwaitedExpr(left)
	return left + "." + expr.Sel.Name, diagnostics
}

func packageVarSelectorNeedsPointerValue(ctx lowerFileContext, expr ast.Expr) bool {
	selector, ok := ast.Unparen(expr).(*ast.SelectorExpr)
	if !ok || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	if selection := ctx.semPkg.source.TypesInfo.Selections[selector]; selection != nil {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	if importAliasForPkgName(ctx, pkgName) == "" {
		return false
	}
	obj, _ := ctx.semPkg.source.TypesInfo.Uses[selector.Sel].(*types.Var)
	return obj != nil && packageVarReadNeedsPointerValue(obj.Type())
}

func packageVarReadNeedsPointerValue(typ types.Type) bool {
	if typ == nil || isPointerType(typ) {
		return false
	}
	if isStructValueType(typ) {
		return true
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Array)
	return ok
}

func (o *LoweringOwner) packageVarSetterForAssignment(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	if ident, ok := unwrapParenExpr(expr).(*ast.Ident); ok {
		obj, _ := objectForIdent(ctx, ident).(*types.Var)
		if obj == nil {
			return "", false
		}
		alias := ctx.localAliases[obj]
		if alias != "" {
			return alias + "." + packageVarSetterName(ident.Name), true
		}
		if ctx.lazyPackageVars[obj] {
			return packageVarSetterName(ident.Name), true
		}
		return "", false
	}
	selector, ok := unwrapParenExpr(expr).(*ast.SelectorExpr)
	if !ok {
		return "", false
	}
	ident, ok := selector.X.(*ast.Ident)
	if !ok {
		return "", false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	if pkgName == nil {
		return "", false
	}
	alias := importAliasForPkgName(ctx, pkgName)
	if alias == "" {
		return "", false
	}
	obj, _ := ctx.semPkg.source.TypesInfo.Uses[selector.Sel].(*types.Var)
	if obj == nil || obj.Pkg() == nil {
		return "", false
	}
	return alias + "." + packageVarSetterName(selector.Sel.Name), true
}

func (o *LoweringOwner) packageVarAssignmentValue(
	ctx lowerFileContext,
	lhs ast.Expr,
	targetType types.Type,
	right string,
	tok token.Token,
) (string, bool) {
	if tok == token.ASSIGN {
		return right, true
	}
	left, diagnostics := o.lowerExpr(ctx, lhs)
	if len(diagnostics) != 0 {
		return "", false
	}
	if tok == token.AND_NOT_ASSIGN {
		return left + " & ~(" + right + ")", true
	}
	if helper, ok := wideIntegerAssignHelper(targetType, tok); ok {
		return o.runtimeOwner.QualifiedHelper(helper) + "(" + left + ", " + right + ")", true
	}
	if value, ok := integerQuotientAssignValueExpr(targetType, left, right, tok); ok {
		return value, true
	}
	op := tok.String()
	if before, ok := strings.CutSuffix(op, "="); ok {
		op = before
	}
	return left + " " + op + " " + right, true
}

func (o *LoweringOwner) tsPackageVarSetterValueTypeFor(ctx lowerFileContext, typ types.Type) string {
	if signature := unnamedSignatureForType(typ); signature != nil {
		return o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
	}
	return o.tsTypeFor(ctx, typ)
}

func (o *LoweringOwner) lowerFieldSelectionExpr(
	ctx lowerFileContext,
	expr *ast.SelectorExpr,
	selection *types.Selection,
	address bool,
) (string, []Diagnostic) {
	receiver, diagnostics := o.lowerFieldReceiverExpr(ctx, expr.X)
	receiver = parenthesizeAwaitedExpr(receiver)
	index := selection.Index()
	if len(index) == 0 {
		fieldName := tsStructFieldName(expr.Sel.Name, 0)
		if address {
			return o.lowerFieldAddressExpr(ctx, receiver, ctx.semPkg.source.TypesInfo.TypeOf(expr.X), fieldName), diagnostics
		}
		return receiver + "." + fieldName, diagnostics
	}

	typ := derefPointerType(ctx.semPkg.source.TypesInfo.TypeOf(expr.X))
	for idx, fieldIndex := range index {
		structType := structUnderlyingType(typ)
		if structType == nil || fieldIndex < 0 || fieldIndex >= structType.NumFields() {
			fieldName := tsStructFieldName(expr.Sel.Name, 0)
			if address {
				return receiver + "._fields." + fieldName, diagnostics
			}
			return receiver + "." + fieldName, diagnostics
		}
		field := structType.Field(fieldIndex)
		name := tsStructFieldName(field.Name(), fieldIndex)
		if idx == len(index)-1 {
			if address {
				return o.lowerFieldAddressExpr(ctx, receiver, typ, name), diagnostics
			}
			return receiver + "." + name, diagnostics
		}

		receiver += "." + name
		typ = field.Type()
		if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
			receiver = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
				"<" + o.tsTypeFor(ctx, pointer.Elem()) + ">(" + receiver + ")"
			typ = pointer.Elem()
		}
	}

	if address {
		return o.lowerFieldAddressExpr(ctx, receiver, typ, tsStructFieldName(expr.Sel.Name, 0)), diagnostics
	}
	return receiver + "." + tsStructFieldName(expr.Sel.Name, 0), diagnostics
}

func (o *LoweringOwner) lowerFieldAddressExpr(ctx lowerFileContext, receiver string, typ types.Type, fieldName string) string {
	if namedStructType(derefPointerType(typ)) != nil {
		return receiver + "._fields." + fieldName
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFieldRef) + "(" + receiver + ", " + strconv.Quote(fieldName) + ")"
}

func (o *LoweringOwner) lowerMethodValueClosure(
	ctx lowerFileContext,
	selection *types.Selection,
	receiver string,
	callee string,
	includeReceiver bool,
) string {
	signature, _ := selection.Type().(*types.Signature)
	var params []string
	var args []string
	if signature != nil && signature.Params() != nil {
		params = make([]string, 0, signature.Params().Len())
		args = make([]string, 0, signature.Params().Len())
		for idx := range signature.Params().Len() {
			param := signature.Params().At(idx)
			name := safeParamName(param, idx)
			params = append(params, name+": "+o.tsTypeFor(ctx, param.Type()))
			args = append(args, name)
		}
	}
	if includeReceiver {
		args = append([]string{"__receiver"}, args...)
	}
	return "((__receiver) => (" + strings.Join(params, ", ") + ") => " + callee + "(" + strings.Join(args, ", ") + "))(" + receiver + ")"
}

func (o *LoweringOwner) lowerMethodExpressionClosure(ctx lowerFileContext, selection *types.Selection) string {
	signature, _ := selection.Type().(*types.Signature)
	if signature == nil || signature.Params() == nil || signature.Params().Len() == 0 {
		return "undefined"
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return "undefined"
	}
	receiver := receiverNamedType(selection.Recv())
	receiverName := safeParamName(signature.Params().At(0), 0)
	args := make([]string, 0, signature.Params().Len()-1)
	for idx := 1; idx < signature.Params().Len(); idx++ {
		args = append(args, safeParamName(signature.Params().At(idx), idx))
	}
	call := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
		"<" + o.namedTypeExpr(ctx, receiver) + ">(" + receiverName + ")." +
		method.Name() + "(" + strings.Join(args, ", ") + ")"
	async := o.functionAsync(ctx, method)
	prefix := ""
	if async {
		prefix = "async "
		call = "await " + call
	}
	functionCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	function := prefix + "(" + o.tsSignatureParamsFor(functionCtx, signature, async) + "): " +
		asyncResultType(o.tsSignatureResultFor(functionCtx, signature), async) + " => " + call
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFunctionValue) +
		"(" + function + ", " + o.runtimeFunctionTypeInfo(signature, "") + ")"
}

func (o *LoweringOwner) lowerFieldReceiverExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if isPointerToStructType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
		return o.lowerPointerValueExpr(ctx, expr)
	}
	value, diagnostics := o.lowerExpr(ctx, expr)
	value = parenthesizeAwaitedExpr(value)
	if obj := objectForValueExpr(ctx, expr); obj != nil &&
		objectNeedsVarRef(ctx, obj) &&
		isStructValueType(obj.Type()) &&
		!packageVarSelectorNeedsPointerValue(ctx, expr) &&
		fieldReceiverNeedsVarRefValue(ctx, expr, obj) {
		return value + ".value", diagnostics
	}
	return value, diagnostics
}

func fieldReceiverNeedsVarRefValue(ctx lowerFileContext, expr ast.Expr, obj types.Object) bool {
	if _, ok := expr.(*ast.Ident); !ok {
		return true
	}
	if ctx.identAliases[obj] != "" {
		return !ctx.identAliasRefs[obj]
	}
	if ctx.localAliases[obj] != "" {
		if varObj, ok := obj.(*types.Var); ok && packageVarReadNeedsPointerValue(varObj.Type()) {
			return false
		}
		return !ctx.lazyPackageVars[obj]
	}
	return false
}

func (o *LoweringOwner) lowerMethodReceiverExpr(
	ctx lowerFileContext,
	expr ast.Expr,
	selection *types.Selection,
) (string, []Diagnostic) {
	fn, _ := selection.Obj().(*types.Func)
	receiverPointer := false
	if fn != nil {
		signature, _ := fn.Type().(*types.Signature)
		if signature != nil && signature.Recv() != nil {
			_, receiverPointer = signature.Recv().Type().(*types.Pointer)
		}
	}

	var receiver string
	var diagnostics []Diagnostic
	if isPointerToStructType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
		receiver, diagnostics = o.lowerPointerValueExpr(ctx, expr)
	} else {
		receiver, diagnostics = o.lowerExpr(ctx, expr)
		receiver = parenthesizeAwaitedExpr(receiver)
	}
	receiverType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if !receiverPointer {
		if obj := objectForValueExpr(ctx, expr); obj != nil &&
			objectNeedsVarRef(ctx, obj) &&
			isStructValueType(obj.Type()) &&
			!packageVarSelectorNeedsPointerValue(ctx, expr) &&
			fieldReceiverNeedsVarRefValue(ctx, expr, obj) {
			receiver += ".value"
		}
	}
	if index := selection.Index(); len(index) > 1 && !o.receiverUsesOverridePackage(receiverType) {
		receiver, receiverType = o.lowerPromotedMethodReceiver(ctx, receiver, receiverType, index[:len(index)-1])
	}
	if receiverPointer {
		if obj := objectForValueExpr(ctx, expr); obj != nil &&
			objectNeedsVarRef(ctx, obj) &&
			isStructValueType(obj.Type()) &&
			fieldReceiverNeedsVarRefValue(ctx, expr, obj) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
				"<" + o.tsNonNilTypeFor(ctx, receiverType) + ">(" + receiver + ")", diagnostics
		}
		return receiver, diagnostics
	}
	if isStructValueType(receiverType) || isPointerToStructType(receiverType) {
		return o.lowerStructClone(receiver), diagnostics
	}
	if isInterfaceType(receiverType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
			"<" + o.tsNonNilTypeFor(ctx, receiverType) + ">(" + receiver + ")", diagnostics
	}
	return receiver, diagnostics
}

func (o *LoweringOwner) receiverUsesOverridePackage(typ types.Type) bool {
	if o.overrideOwner == nil {
		return false
	}
	named, _ := types.Unalias(derefPointerType(typ)).(*types.Named)
	return named != nil && named.Obj() != nil && named.Obj().Pkg() != nil &&
		o.overrideFacts().HasPackage(named.Obj().Pkg().Path())
}

func (o *LoweringOwner) lowerPromotedMethodReceiver(
	ctx lowerFileContext,
	receiver string,
	typ types.Type,
	index []int,
) (string, types.Type) {
	typ = derefPointerType(typ)
	for _, fieldIndex := range index {
		structType := structUnderlyingType(typ)
		if structType == nil || fieldIndex < 0 || fieldIndex >= structType.NumFields() {
			return receiver, typ
		}
		field := structType.Field(fieldIndex)
		receiver += "." + field.Name()
		typ = field.Type()
		if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
			receiver = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
				"<" + o.tsTypeFor(ctx, pointer.Elem()) + ">(" + receiver + ")"
			typ = pointer.Elem()
		}
	}
	return receiver, typ
}

func promotedMethodReceiverType(typ types.Type, index []int) types.Type {
	typ = derefPointerType(typ)
	for _, fieldIndex := range index {
		structType := structUnderlyingType(typ)
		if structType == nil || fieldIndex < 0 || fieldIndex >= structType.NumFields() {
			return typ
		}
		typ = structType.Field(fieldIndex).Type()
		if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
			typ = pointer.Elem()
		}
	}
	return typ
}

func (o *LoweringOwner) lowerAssignmentTarget(
	ctx lowerFileContext,
	expr ast.Expr,
	declare bool,
) (string, []Diagnostic) {
	switch typed := unwrapParenExpr(expr).(type) {
	case *ast.Ident:
		if declare {
			return o.lowerIdent(ctx, typed, true), nil
		}
		if obj := objectForIdent(ctx, typed); obj != nil && ctx.lazyPackageVars[obj] {
			target := o.lowerIdent(ctx, typed, true)
			if ctx.model.needsVarRef[obj] {
				target += ".value"
			}
			return target, nil
		}
		return o.lowerIdent(ctx, typed, false), nil
	case *ast.StarExpr:
		return o.lowerPointerValueExpr(ctx, typed.X)
	default:
		return o.lowerExpr(ctx, expr)
	}
}

func (o *LoweringOwner) lowerAddressExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if value, ok := o.lowerPackageVarAddressExpr(ctx, expr); ok {
		return value, nil
	}
	switch typed := unwrapParenExpr(expr).(type) {
	case *ast.Ident:
		return o.lowerIdent(ctx, typed, true), nil
	case *ast.CompositeLit:
		value, diagnostics := o.lowerCompositeLit(ctx, typed, false)
		if namedStructType(ctx.semPkg.source.TypesInfo.TypeOf(typed)) != nil {
			return value, diagnostics
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")", diagnostics
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil && selection.Kind() == types.FieldVal {
			return o.lowerFieldSelectionExpr(ctx, typed, selection, true)
		}
		receiver, diagnostics := o.lowerFieldReceiverExpr(ctx, typed.X)
		return receiver + "._fields." + typed.Sel.Name, diagnostics
	case *ast.IndexExpr:
		return o.lowerIndexAddressExpr(ctx, typed)
	default:
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, typed, "expression", ctx.semPkg.pkgPath, "unsupported address expression")}
	}
}

func (o *LoweringOwner) lowerPackageVarAddressExpr(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	switch typed := unwrapParenExpr(expr).(type) {
	case *ast.Ident:
		obj, _ := objectForIdent(ctx, typed).(*types.Var)
		if obj == nil || !objectNeedsVarRef(ctx, obj) {
			return "", false
		}
		return o.lowerIdent(ctx, typed, true), true
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil {
			return "", false
		}
		ident, ok := unwrapParenExpr(typed.X).(*ast.Ident)
		if !ok {
			return "", false
		}
		pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
		if pkgName == nil {
			return "", false
		}
		alias := importAliasForPkgName(ctx, pkgName)
		if alias == "" {
			return "", false
		}
		obj, _ := ctx.semPkg.source.TypesInfo.Uses[typed.Sel].(*types.Var)
		if obj == nil || !objectNeedsVarRef(ctx, obj) {
			return "", false
		}
		return alias + "." + typed.Sel.Name, true
	default:
		return "", false
	}
}

func importAliasForPkgName(ctx lowerFileContext, pkgName *types.PkgName) string {
	if pkgName == nil {
		return ""
	}
	if alias := ctx.importObjects[pkgName]; alias != "" {
		return alias
	}
	if imported := pkgName.Imported(); imported != nil {
		if alias := ctx.importPaths[imported.Path()]; alias != "" {
			return alias
		}
	}
	return ctx.importNames[pkgName.Name()]
}

func (o *LoweringOwner) lowerIndexAddressExpr(ctx lowerFileContext, expr *ast.IndexExpr) (string, []Diagnostic) {
	target, targetDiagnostics := o.lowerExpr(ctx, expr.X)
	index, indexDiagnostics := o.lowerExpr(ctx, expr.Index)
	diagnostics := append(targetDiagnostics, indexDiagnostics...)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	if isStringType(targetType) || isMapType(targetType) {
		return "undefined", append(diagnostics, loweringUnsupportedAt(ctx, expr, "expression", ctx.semPkg.pkgPath, "unsupported address expression"))
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexRef) + "(" + o.lowerIndexTarget(ctx, target, targetType) + ", " + index + ")", diagnostics
}

func (o *LoweringOwner) lowerAddressEqualityExpr(
	ctx lowerFileContext,
	expr *ast.BinaryExpr,
) (string, []Diagnostic, bool) {
	left, leftDiagnostics, leftOK := o.lowerIndexAddressIntegerExpr(ctx, expr.X)
	if !leftOK {
		return "", nil, false
	}
	right, rightDiagnostics, rightOK := o.lowerIndexAddressIntegerExpr(ctx, expr.Y)
	if !rightOK {
		return "", nil, false
	}
	return left + " " + expr.Op.String() + " " + right, append(leftDiagnostics, rightDiagnostics...), true
}

func (o *LoweringOwner) lowerUnsafePointerIntegerExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, call.Fun)) {
		return "", nil, false
	}
	return o.lowerIndexByteAddressIntegerExpr(ctx, call.Args[0])
}

func (o *LoweringOwner) lowerIndexAddressIntegerExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	address, ok := unwrapParenExpr(expr).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, false
	}
	indexExpr, ok := unwrapParenExpr(address.X).(*ast.IndexExpr)
	if !ok {
		return "", nil, false
	}
	target, targetDiagnostics := o.lowerExpr(ctx, indexExpr.X)
	index, indexDiagnostics := o.lowerExpr(ctx, indexExpr.Index)
	diagnostics := append(targetDiagnostics, indexDiagnostics...)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(indexExpr.X)
	if isStringType(targetType) || isMapType(targetType) {
		return "", diagnostics, false
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexAddress) +
		"(" + o.lowerIndexTarget(ctx, target, targetType) + ", " + index + ")", diagnostics, true
}

func (o *LoweringOwner) lowerIndexByteAddressIntegerExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	address, ok := unwrapParenExpr(expr).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, false
	}
	indexExpr, ok := unwrapParenExpr(address.X).(*ast.IndexExpr)
	if !ok {
		return "", nil, false
	}
	target, targetDiagnostics := o.lowerExpr(ctx, indexExpr.X)
	index, indexDiagnostics := o.lowerExpr(ctx, indexExpr.Index)
	diagnostics := append(targetDiagnostics, indexDiagnostics...)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(indexExpr.X)
	if isStringType(targetType) || isMapType(targetType) {
		return "", diagnostics, false
	}
	elementSize := goScriptElementByteSize(ctx, indexElementType(targetType))
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexByteAddress) +
		"(" + o.lowerIndexTarget(ctx, target, targetType) + ", " + index + ", " + strconv.FormatInt(elementSize, 10) + ")", diagnostics, true
}

func (o *LoweringOwner) lowerPointerValueExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if value, diagnostics, ok := o.lowerUnsafeStringPointerValue(ctx, expr); ok {
		return value, diagnostics
	}
	if value, diagnostics, ok := o.lowerUnsafeStringByteSlicePointerValue(ctx, expr); ok {
		return value, diagnostics
	}
	if ref, diagnostics, ok := o.lowerUnsafeArrayPointerRefExpr(ctx, expr); ok {
		return ref + "!.value", diagnostics
	}
	if ref, diagnostics, ok := o.lowerUnsafePointerRefExpr(ctx, expr); ok {
		return ref + ".value", diagnostics
	}
	base, diagnostics := o.lowerExpr(ctx, expr)
	typeArg := ""
	if pointer, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr)).Underlying().(*types.Pointer); ok {
		typeArg = "<" + o.tsTypeFor(ctx, pointer.Elem()) + ">"
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + typeArg + "(" + base + ")", diagnostics
}

func (o *LoweringOwner) lowerUnsafeStringPointerValue(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if targetType == nil {
		return "", nil, false
	}
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil || !isStringType(targetPointer.Elem()) {
		return "", nil, false
	}
	unsafeCall, ok := unwrapParenExpr(call.Args[0]).(*ast.CallExpr)
	unsafeTargetType := typeFromExpr(ctx, unsafeCall.Fun)
	if !ok || len(unsafeCall.Args) != 1 || unsafeTargetType == nil || !isUnsafePointerType(unsafeTargetType) {
		return "", nil, false
	}
	address, ok := unwrapParenExpr(unsafeCall.Args[0]).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND || !isByteSliceType(ctx.semPkg.source.TypesInfo.TypeOf(address.X)) {
		return "", nil, false
	}
	value, diagnostics := o.lowerExpr(ctx, address.X)
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperBytesToString) + "(" + value + ")", diagnostics, true
}

func (o *LoweringOwner) lowerUnsafeStringByteSlicePointerValue(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if targetType == nil {
		return "", nil, false
	}
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil || !isByteSliceType(targetPointer.Elem()) {
		return "", nil, false
	}
	unsafeCall, ok := unwrapParenExpr(call.Args[0]).(*ast.CallExpr)
	unsafeTargetType := typeFromExpr(ctx, unsafeCall.Fun)
	if !ok || len(unsafeCall.Args) != 1 || unsafeTargetType == nil || !isUnsafePointerType(unsafeTargetType) {
		return "", nil, false
	}
	address, ok := unwrapParenExpr(unsafeCall.Args[0]).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, false
	}
	source, ok := localStringSliceHeaderSource(ctx, address.X)
	if !ok {
		return "", nil, false
	}
	value, diagnostics := o.lowerExpr(ctx, source)
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToBytes) + "(" + value + ")", diagnostics, true
}

func (o *LoweringOwner) lowerReflectHeaderPointerConversion(
	ctx lowerFileContext,
	targetType types.Type,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil {
		return "", nil, false
	}
	header, _ := types.Unalias(targetPointer.Elem()).(*types.Named)
	if header == nil || header.Obj() == nil || header.Obj().Pkg() == nil || header.Obj().Pkg().Path() != "reflect" {
		return "", nil, false
	}
	unsafeCall, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(unsafeCall.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, unsafeCall.Fun)) {
		return "", nil, false
	}
	address, ok := unwrapParenExpr(unsafeCall.Args[0]).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, false
	}
	switch header.Obj().Name() {
	case "StringHeader":
		if !isStringType(ctx.semPkg.source.TypesInfo.TypeOf(address.X)) {
			return "", nil, false
		}
		value, diagnostics := o.lowerAddressedValueRef(ctx, address.X)
		helper := o.runtimeOwner.QualifiedHelper(RuntimeHelperStringHeaderRef) + "(" + value + ")"
		return "(" + helper + " as unknown as " + o.tsTypeFor(ctx, targetType) + ")", diagnostics, true
	case "SliceHeader":
		if !isByteSliceType(ctx.semPkg.source.TypesInfo.TypeOf(address.X)) {
			return "", nil, false
		}
		value, diagnostics := o.lowerAddressedValueRef(ctx, address.X)
		helper := o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceHeaderRef) + "(" + value + ")"
		return "(" + helper + " as unknown as " + o.tsTypeFor(ctx, targetType) + ")", diagnostics, true
	default:
		return "", nil, false
	}
}

func (o *LoweringOwner) lowerUnsafeArrayPointerConversion(
	ctx lowerFileContext,
	targetType types.Type,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil {
		return "", nil, false
	}
	array, _ := types.Unalias(targetPointer.Elem()).Underlying().(*types.Array)
	if array == nil {
		return "", nil, false
	}
	unsafeCall, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(unsafeCall.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, unsafeCall.Fun)) {
		return "", nil, false
	}
	address, ok := unwrapParenExpr(unsafeCall.Args[0]).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, false
	}
	index, ok := unwrapParenExpr(address.X).(*ast.IndexExpr)
	if !ok {
		return "", nil, false
	}
	ref, diagnostics := o.lowerAddressExpr(ctx, index)
	sourceElementSize := goScriptElementByteSize(ctx, indexElementType(ctx.semPkg.source.TypesInfo.TypeOf(index.X)))
	targetElementSize := goScriptElementByteSize(ctx, array.Elem())
	helper := o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayPointerFromIndexRef) +
		"<" + o.tsTypeFor(ctx, array.Elem()) + ">(" + ref + ", " +
		strconv.FormatInt(array.Len(), 10) + ", " +
		strconv.FormatInt(sourceElementSize, 10) + ", " +
		strconv.FormatInt(targetElementSize, 10) + ")"
	return "(" + helper + " as unknown as " + o.tsTypeFor(ctx, targetType) + ")", diagnostics, true
}

func (o *LoweringOwner) lowerAddressedValueRef(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if ident, ok := unwrapParenExpr(expr).(*ast.Ident); ok {
		if obj := objectForIdent(ctx, ident); obj != nil && ctx.model.needsVarRef[obj] {
			return o.lowerIdent(ctx, ident, true), nil
		}
	}
	value, diagnostics := o.lowerExpr(ctx, expr)
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")", diagnostics
}

func localStringSliceHeaderSource(ctx lowerFileContext, expr ast.Expr) (ast.Expr, bool) {
	lit, ok := unwrapParenExpr(expr).(*ast.CompositeLit)
	if !ok {
		return nil, false
	}
	structType, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(lit)).Underlying().(*types.Struct)
	if !ok || structType.NumFields() != 2 {
		return nil, false
	}
	if !isStringType(structType.Field(0).Type()) || !isIntegerType(structType.Field(1).Type()) {
		return nil, false
	}
	var source ast.Expr
	var capacity ast.Expr
	for idx, elt := range lit.Elts {
		fieldIndex := idx
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			ident, ok := keyed.Key.(*ast.Ident)
			if !ok {
				return nil, false
			}
			fieldIndex = -1
			for index := range structType.NumFields() {
				if structType.Field(index).Name() == ident.Name {
					fieldIndex = index
					break
				}
			}
			if fieldIndex < 0 {
				return nil, false
			}
		}
		switch fieldIndex {
		case 0:
			source = valueExpr
		case 1:
			capacity = valueExpr
		}
	}
	if source == nil || capacity == nil {
		return nil, false
	}
	if !isStringType(ctx.semPkg.source.TypesInfo.TypeOf(source)) ||
		!isIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(capacity)) {
		return nil, false
	}
	if !isLenCallOfExpr(ctx, capacity, source) {
		return nil, false
	}
	return source, true
}

func isLenCallOfExpr(ctx lowerFileContext, expr ast.Expr, target ast.Expr) bool {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return false
	}
	ident, ok := unwrapParenExpr(call.Fun).(*ast.Ident)
	if !ok || ident.Name != "len" {
		return false
	}
	if objectForIdent(ctx, ident) != types.Universe.Lookup("len") {
		return false
	}
	return sameLoweredSourceExpr(ctx, call.Args[0], target)
}

func sameLoweredSourceExpr(ctx lowerFileContext, left ast.Expr, right ast.Expr) bool {
	left = unwrapParenExpr(left)
	right = unwrapParenExpr(right)
	if leftIdent, ok := left.(*ast.Ident); ok {
		rightIdent, ok := right.(*ast.Ident)
		return ok && objectForIdent(ctx, leftIdent) == objectForIdent(ctx, rightIdent)
	}
	return false
}

func (o *LoweringOwner) lowerPointerStorageExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if ref, diagnostics, ok := o.lowerUnsafeArrayPointerRefExpr(ctx, expr); ok {
		return ref + "!.value", diagnostics
	}
	if ref, diagnostics, ok := o.lowerUnsafePointerRefExpr(ctx, expr); ok {
		return ref + ".value", diagnostics
	}
	if ref, diagnostics, ok := o.lowerUnsafePointerStorageExpr(ctx, expr); ok {
		return ref, diagnostics
	}
	base, diagnostics := o.lowerExpr(ctx, expr)
	return base + "!.value", diagnostics
}

func (o *LoweringOwner) lowerUnsafeArrayPointerRefExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if targetType == nil {
		return "", nil, false
	}
	return o.lowerUnsafeArrayPointerConversion(ctx, targetType, call.Args[0])
}

func (o *LoweringOwner) lowerUnsafePointerRefExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if targetType == nil {
		return "", nil, false
	}
	pointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if pointer == nil || !isUnsafePointerType(ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])) {
		return "", nil, false
	}
	value, diagnostics := o.lowerExpr(ctx, call.Args[0])
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsafePointerRef) +
		"<" + o.tsTypeFor(ctx, pointer.Elem()) + ">(" + value + ")", diagnostics, true
}

func (o *LoweringOwner) lowerUnsafePointerStorageExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	pointer, _ := types.Unalias(typeFromExpr(ctx, call.Fun)).Underlying().(*types.Pointer)
	if pointer == nil || !exprContainsUnsafePointerConversion(ctx, call.Args[0]) {
		return "", nil, false
	}
	_, diagnostics := o.lowerExpr(ctx, call.Args[0])
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsupportedPointerRef) +
		"<" + o.tsTypeFor(ctx, pointer.Elem()) + ">(undefined).value", diagnostics, true
}

func exprContainsUnsafePointerConversion(ctx lowerFileContext, expr ast.Expr) bool {
	found := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if found {
			return false
		}
		call, ok := node.(*ast.CallExpr)
		if !ok {
			return true
		}
		if isUnsafePointerType(typeFromExpr(ctx, call.Fun)) {
			found = true
			return false
		}
		return true
	})
	return found
}

func (o *LoweringOwner) lowerIndexExpr(ctx lowerFileContext, expr *ast.IndexExpr) (string, []Diagnostic) {
	if signature := genericFunctionSignature(ctx, expr.X); signature != nil {
		return o.lowerGenericFunctionValue(ctx, expr.X, []ast.Expr{expr.Index}, signature)
	}
	target, targetDiagnostics := o.lowerExpr(ctx, expr.X)
	index, indexDiagnostics := o.lowerExpr(ctx, expr.Index)
	diagnostics := append(targetDiagnostics, indexDiagnostics...)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	switch {
	case isStringType(targetType):
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexStringOrBytes) + "(" + target + ", " + index + ")", diagnostics
	case isMapType(targetType):
		return o.lowerMapGetValue(ctx, expr, target, index), diagnostics
	default:
		return o.lowerIndexTarget(ctx, target, targetType) + "[" + index + "]", diagnostics
	}
}

func (o *LoweringOwner) lowerGenericFunctionValue(
	ctx lowerFileContext,
	callee ast.Expr,
	typeArgExprs []ast.Expr,
	signature *types.Signature,
) (string, []Diagnostic) {
	calleeExpr, diagnostics := o.lowerExpr(ctx, callee)
	typeArgs := o.genericTypeArgsExpr(ctx, callee, typeArgExprs)
	signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	params := o.tsSignatureParamsFor(signatureCtx, signature, false)
	args := []string{typeArgs}
	if signature.Params() != nil {
		for idx := range signature.Params().Len() {
			args = append(args, safeParamName(signature.Params().At(idx), idx))
		}
	}
	call := o.lowerCallableExpr(ctx, callee, calleeExpr) + "(" + strings.Join(args, ", ") + ")"
	async := o.callNeedsAwait(ctx, callee)
	prefix := ""
	body := call
	if async {
		prefix = "async "
		body = "await " + call
	}
	function := prefix + "(" + params + "): " +
		asyncResultType(o.tsSignatureResultFor(signatureCtx, signature), async) +
		" => " + body
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFunctionValue) +
		"(" + function + ", " + o.runtimeFunctionTypeInfo(signature, "") + ")", diagnostics
}

func (o *LoweringOwner) lowerIndexTarget(ctx lowerFileContext, target string, typ types.Type) string {
	if strings.HasPrefix(target, "await ") {
		target = "(" + target + ")"
	}
	if array := pointerToArrayType(typ); array != nil {
		return o.lowerArrayPointerTarget(ctx, target, typ)
	}
	if isNilableType(typ) {
		return target + "!"
	}
	return target
}

func (o *LoweringOwner) lowerArrayPointerTarget(ctx lowerFileContext, target string, typ types.Type) string {
	array := pointerToArrayType(typ)
	if array == nil {
		return target
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
		"<" + o.tsTypeFor(ctx, array) + ">(" + target + ")"
}

func (o *LoweringOwner) lowerSliceExpr(ctx lowerFileContext, expr *ast.SliceExpr) (string, []Diagnostic) {
	target, diagnostics := o.lowerExpr(ctx, expr.X)
	low, lowDiagnostics := o.lowerOptionalExpr(ctx, expr.Low)
	high, highDiagnostics := o.lowerOptionalExpr(ctx, expr.High)
	max, maxDiagnostics := o.lowerOptionalExpr(ctx, expr.Max)
	diagnostics = append(diagnostics, lowDiagnostics...)
	diagnostics = append(diagnostics, highDiagnostics...)
	diagnostics = append(diagnostics, maxDiagnostics...)
	helper := RuntimeHelperGoSlice
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	if isStringType(targetType) {
		helper = RuntimeHelperSliceStringOrBytes
	} else {
		target = o.lowerArrayPointerTarget(ctx, target, targetType)
	}
	args := []string{target, low, high}
	if expr.Slice3 {
		args = append(args, max)
	}
	return o.runtimeOwner.QualifiedHelper(helper) + "(" + strings.Join(args, ", ") + ")", diagnostics
}

func (o *LoweringOwner) lowerOptionalExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if expr == nil {
		return "undefined", nil
	}
	return o.lowerExpr(ctx, expr)
}

func (o *LoweringOwner) lowerCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	markStruct bool,
) (string, []Diagnostic) {
	if len(lit.Elts) == 0 {
		if typeParam, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(lit)).(*types.TypeParam); ok {
			if typeParamInScope(ctx, typeParam) {
				return o.lowerDeclarationZeroValueExpr(ctx, typeParam), nil
			}
		}
	}
	named := namedStructType(ctx.semPkg.source.TypesInfo.TypeOf(lit))
	if named != nil {
		return o.lowerStructCompositeLit(ctx, lit, named, markStruct)
	}
	if ptr, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(lit)).Underlying().(*types.Pointer); ok {
		if named := namedStructType(ptr.Elem()); named != nil {
			return o.lowerStructCompositeLit(ctx, lit, named, false)
		}
	}
	if structType, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(lit)).Underlying().(*types.Struct); ok {
		return o.lowerAnonymousStructCompositeLit(ctx, lit, structType)
	}
	if array, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(lit)).Underlying().(*types.Array); ok {
		return o.lowerArrayCompositeLit(ctx, lit, array)
	}
	if slice, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(lit)).Underlying().(*types.Slice); ok {
		return o.lowerSliceCompositeLit(ctx, lit, slice)
	}
	if mapType, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(lit)).Underlying().(*types.Map); ok {
		return o.lowerMapCompositeLit(ctx, lit, mapType)
	}
	detail := "unsupported composite literal"
	if typ := ctx.semPkg.source.TypesInfo.TypeOf(lit); typ != nil {
		detail += " of type " + typ.String()
	}
	return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, lit, "expression", ctx.semPkg.pkgPath, detail)}
}

func (o *LoweringOwner) lowerStructCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	named *types.Named,
	markStruct bool,
) (string, []Diagnostic) {
	structType, _ := named.Underlying().(*types.Struct)
	fields := make([]string, 0, len(lit.Elts))
	var prelude []string
	var diagnostics []Diagnostic
	for idx, elt := range lit.Elts {
		fieldName := ""
		fieldType := types.Type(nil)
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			if ident, ok := keyed.Key.(*ast.Ident); ok {
				for index := range structType.NumFields() {
					field := structType.Field(index)
					if field.Name() == ident.Name {
						fieldName = tsStructFieldName(field.Name(), index)
						fieldType = field.Type()
						break
					}
				}
			}
		} else if idx < structType.NumFields() {
			field := structType.Field(idx)
			fieldName = tsStructFieldName(field.Name(), idx)
			fieldType = field.Type()
		}
		if fieldName == "" {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, elt, "expression", ctx.semPkg.pkgPath, "unsupported struct literal field"))
			continue
		}
		value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = o.lowerValueForTarget(ctx, valueExpr, fieldType, value)
		if compositeLiteralFieldNeedsPreEval(ctx, valueExpr) {
			temp := ctx.tempName("LiteralField")
			prelude = append(prelude, "const "+temp+" = "+value)
			value = temp
		}
		fields = append(fields, fieldName+": "+value)
	}

	expr := "new " + o.namedTypeExpr(ctx, named) + "()"
	if len(fields) != 0 {
		expr = "new " + o.namedTypeExpr(ctx, named) + "({" + strings.Join(fields, ", ") + "})"
	}
	if markStruct {
		expr = o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(" + expr + ")"
	}
	if len(prelude) != 0 {
		body := strings.Join(prelude, "; ") + "; return " + expr
		if strings.Contains(body, "await ") {
			return "(await (async () => { " + body + " })())", diagnostics
		}
		return "(() => { " + body + " })()", diagnostics
	}
	return expr, diagnostics
}

func compositeLiteralFieldNeedsPreEval(ctx lowerFileContext, expr ast.Expr) bool {
	switch typed := unwrapParenExpr(expr).(type) {
	case *ast.CallExpr:
		for _, arg := range typed.Args {
			if compositeLiteralFieldNeedsPreEval(ctx, arg) {
				return true
			}
		}
		if ident, ok := typed.Fun.(*ast.Ident); ok && isBuiltinCallTarget(ctx, ident) {
			return false
		}
		return typeFromExpr(ctx, typed.Fun) == nil
	case *ast.UnaryExpr:
		return typed.Op == token.ARROW || compositeLiteralFieldNeedsPreEval(ctx, typed.X)
	case *ast.BinaryExpr:
		return compositeLiteralFieldNeedsPreEval(ctx, typed.X) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.Y)
	case *ast.IndexExpr:
		return compositeLiteralFieldNeedsPreEval(ctx, typed.X) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.Index)
	case *ast.IndexListExpr:
		if compositeLiteralFieldNeedsPreEval(ctx, typed.X) {
			return true
		}
		for _, index := range typed.Indices {
			if compositeLiteralFieldNeedsPreEval(ctx, index) {
				return true
			}
		}
		return false
	case *ast.SliceExpr:
		return compositeLiteralFieldNeedsPreEval(ctx, typed.X) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.Low) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.High) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.Max)
	case *ast.StarExpr:
		return compositeLiteralFieldNeedsPreEval(ctx, typed.X)
	default:
		return false
	}
}

func (o *LoweringOwner) lowerAnonymousStructCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	structType *types.Struct,
) (string, []Diagnostic) {
	fields := make([]string, structType.NumFields())
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fields[idx] = tsStructFieldName(field.Name(), idx) + ": (" +
			o.lowerZeroValueExprFor(ctx, field.Type()) + " as " + o.tsStructFieldTypeFor(ctx, field.Type()) + ")"
	}
	var diagnostics []Diagnostic
	for idx, elt := range lit.Elts {
		fieldName := ""
		fieldType := types.Type(nil)
		fieldIndex := -1
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			if ident, ok := keyed.Key.(*ast.Ident); ok {
				for index := range structType.NumFields() {
					field := structType.Field(index)
					if field.Name() == ident.Name {
						fieldName = tsStructFieldName(field.Name(), index)
						fieldIndex = index
						fieldType = field.Type()
						break
					}
				}
			}
		}
		if fieldName == "" && idx < structType.NumFields() {
			field := structType.Field(idx)
			fieldName = tsStructFieldName(field.Name(), idx)
			fieldIndex = idx
			fieldType = field.Type()
		}
		if fieldName == "" {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, elt, "expression", ctx.semPkg.pkgPath, "unsupported anonymous struct literal field"))
			continue
		}
		value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = o.lowerValueForTarget(ctx, valueExpr, fieldType, value)
		field := fieldName + ": " + value
		if fieldIndex >= 0 {
			fields[fieldIndex] = field
			continue
		}
		fields = append(fields, field)
	}
	return "{" + strings.Join(fields, ", ") + "}", diagnostics
}

func (o *LoweringOwner) lowerArrayCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	array *types.Array,
) (string, []Diagnostic) {
	if len(lit.Elts) == 0 && isByteType(array.Elem()) {
		return "new Uint8Array(" + strconv.FormatInt(array.Len(), 10) + ")", nil
	}
	values := make([]string, int(array.Len()))
	for idx := range values {
		values[idx] = o.lowerZeroValueExprFor(ctx, array.Elem())
	}
	nextIndex := 0
	var diagnostics []Diagnostic
	for _, elt := range lit.Elts {
		index := nextIndex
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			parsed, keyConst := constIntExpr(ctx, keyed.Key)
			if keyConst {
				index = parsed
			}
			if !keyConst {
				key, keyDiagnostics := o.lowerExpr(ctx, keyed.Key)
				diagnostics = append(diagnostics, keyDiagnostics...)
				parsed, err := strconv.Atoi(key)
				if err == nil {
					index = parsed
				}
			}
		}
		if index >= 0 && index < len(values) {
			value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
			diagnostics = append(diagnostics, valueDiagnostics...)
			values[index] = o.lowerValueForTarget(ctx, valueExpr, array.Elem(), value)
		}
		nextIndex = index + 1
	}
	if isByteType(array.Elem()) {
		return "new Uint8Array([" + strings.Join(values, ", ") + "])", diagnostics
	}
	return "[" + strings.Join(values, ", ") + "]", diagnostics
}

func (o *LoweringOwner) lowerSliceCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	slice *types.Slice,
) (string, []Diagnostic) {
	values := make([]string, 0, len(lit.Elts))
	nextIndex := 0
	var diagnostics []Diagnostic
	for _, elt := range lit.Elts {
		index := nextIndex
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			parsed, keyConst := constIntExpr(ctx, keyed.Key)
			if keyConst {
				index = parsed
			}
			if !keyConst {
				key, keyDiagnostics := o.lowerExpr(ctx, keyed.Key)
				diagnostics = append(diagnostics, keyDiagnostics...)
				parsed, err := strconv.Atoi(key)
				if err == nil {
					index = parsed
				}
			}
		}
		for len(values) <= index {
			values = append(values, o.lowerZeroValueExprFor(ctx, slice.Elem()))
		}
		value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
		diagnostics = append(diagnostics, valueDiagnostics...)
		values[index] = o.lowerValueForTarget(ctx, valueExpr, slice.Elem(), value)
		nextIndex = index + 1
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayToSlice) +
		"<" + o.tsSliceElemTypeFor(ctx, slice.Elem()) + ">([" + strings.Join(values, ", ") + "])", diagnostics
}

func (o *LoweringOwner) lowerMapCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	mapType *types.Map,
) (string, []Diagnostic) {
	entries := make([]string, 0, len(lit.Elts))
	var diagnostics []Diagnostic
	for _, elt := range lit.Elts {
		keyed, ok := elt.(*ast.KeyValueExpr)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, elt, "expression", ctx.semPkg.pkgPath, "unsupported map literal entry"))
			continue
		}
		key, keyDiagnostics := o.lowerExpr(ctx, keyed.Key)
		value, valueDiagnostics := o.lowerExpr(ctx, keyed.Value)
		diagnostics = append(diagnostics, keyDiagnostics...)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = o.lowerValueForTarget(ctx, keyed.Value, mapType.Elem(), value)
		entries = append(entries, "["+key+", "+value+"]")
	}
	return "new Map<" + o.tsTypeFor(ctx, mapType.Key()) + ", " + o.tsTypeFor(ctx, mapType.Elem()) + ">([" + strings.Join(entries, ", ") + "])", diagnostics
}

func (o *LoweringOwner) lowerTypeAssertExpr(ctx lowerFileContext, expr *ast.TypeAssertExpr) (string, []Diagnostic) {
	value, diagnostics := o.lowerExpr(ctx, expr.X)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Type)
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperMustTypeAssert) +
		"<" + o.tsTypeAssertionTypeFor(ctx, targetType) + ">(" +
		value + ", " + o.runtimeTypeAssertInfoExpr(ctx, targetType) + ")", diagnostics
}

func (o *LoweringOwner) lowerTupleExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	switch typed := expr.(type) {
	case *ast.TypeAssertExpr:
		value, diagnostics := o.lowerExpr(ctx, typed.X)
		targetType := ctx.semPkg.source.TypesInfo.TypeOf(typed.Type)
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeAssertTuple) +
			"<" + o.tsTypeAssertionTypeFor(ctx, targetType) + ">(" +
			value + ", " + o.runtimeTypeAssertInfoExpr(ctx, targetType) + ")", diagnostics
	case *ast.IndexExpr:
		if isMapType(ctx.semPkg.source.TypesInfo.TypeOf(typed.X)) {
			target, targetDiagnostics := o.lowerExpr(ctx, typed.X)
			index, indexDiagnostics := o.lowerExpr(ctx, typed.Index)
			return o.lowerMapGetTuple(ctx, typed, target, index), append(targetDiagnostics, indexDiagnostics...)
		}
	}
	return o.lowerExpr(ctx, expr)
}

func (o *LoweringOwner) lowerMapGetValue(ctx lowerFileContext, expr *ast.IndexExpr, target string, index string) string {
	return o.lowerMapGetTuple(ctx, expr, target, index) + "[0]"
}

func (o *LoweringOwner) lowerMapGetTuple(ctx lowerFileContext, expr *ast.IndexExpr, target string, index string) string {
	mapType, _ := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr.X)).Underlying().(*types.Map)
	defaultValue := "undefined"
	if mapType != nil {
		defaultValue = o.lowerZeroValueExprFor(ctx, mapType.Elem())
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperMapGet) + "(" + target + ", " + index + ", " + defaultValue + ")"
}

func (o *LoweringOwner) lowerValueForTarget(
	ctx lowerFileContext,
	expr ast.Expr,
	targetType types.Type,
	value string,
) string {
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if isComplexType(targetType) {
		if isComplexType(sourceType) {
			return value
		}
		if isRealNumericConstantExpr(ctx, expr) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex) + "(" + value + ", 0)"
		}
	}
	if isNumericType(targetType) {
		if constantValue, ok := o.lowerNumericConstantExprForTarget(ctx, expr, targetType); ok {
			return constantValue
		}
	}
	return o.lowerValueForTargetTypes(ctx, targetType, sourceType, value, shouldCloneStructValue(expr))
}

func lowerRealNumericConstantExpr(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return "", false
	}
	if _, ok := objectForValueExpr(ctx, expr).(*types.Const); !ok {
		return "", false
	}
	tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]
	if !ok || tv.Value == nil {
		return "", false
	}
	switch tv.Value.Kind() {
	case constant.Int:
		if constant.BitLen(tv.Value) <= 53 {
			return "", false
		}
		return lowerConstantValue(tv.Value)
	default:
		return "", false
	}
}

func (o *LoweringOwner) lowerNumericConstantExprForTarget(ctx lowerFileContext, expr ast.Expr, targetType types.Type) (string, bool) {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return "", false
	}
	tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]
	if ok && tv.Value != nil {
		if bits, ok := unsignedIntegerBits(targetType); ok && bits >= 64 {
			if value, ok := lowerWideIntegerConstantValue(tv.Value); ok {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) + "(" +
					strconv.Quote(value) + ", 64)", true
			}
		}
		if bits, ok := signedIntegerBits(targetType); ok && bits >= 64 {
			if value, ok := lowerWideIntegerConstantValue(tv.Value); ok {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) + "(" +
					strconv.Quote(value) + ", 64)", true
			}
		}
	}
	return lowerRealNumericConstantExpr(ctx, expr)
}

func isRealNumericConstantExpr(ctx lowerFileContext, expr ast.Expr) bool {
	if ctx.semPkg != nil && ctx.semPkg.source != nil {
		if tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]; ok && tv.Value != nil {
			switch tv.Value.Kind() {
			case constant.Int, constant.Float:
				return true
			}
		}
	}
	switch typed := expr.(type) {
	case *ast.BasicLit:
		return typed.Kind == token.INT || typed.Kind == token.FLOAT || typed.Kind == token.CHAR
	case *ast.UnaryExpr:
		return (typed.Op == token.ADD || typed.Op == token.SUB) && isRealNumericConstantExpr(ctx, typed.X)
	default:
		return false
	}
}

func lowerPrefixUnaryExpr(op token.Token, value string) string {
	prefix := op.String()
	if (op == token.SUB && strings.HasPrefix(value, "-")) || (op == token.ADD && strings.HasPrefix(value, "+")) {
		return prefix + "(" + value + ")"
	}
	return prefix + value
}

func (o *LoweringOwner) lowerValueForTargetTypes(
	ctx lowerFileContext,
	targetType types.Type,
	sourceType types.Type,
	value string,
	cloneStructValue bool,
) string {
	if targetType == nil || sourceType == nil {
		return value
	}
	if isFunctionType(targetType) && isUntypedNilType(sourceType) {
		return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")"
	}
	if isBuiltinErrorType(targetType) {
		if wrapper := o.lowerPrimitiveErrorWrapper(ctx, sourceType, value); wrapper != "" {
			return wrapper
		}
	}
	if wrapper := o.lowerNumericInterfaceWrapper(ctx, targetType, sourceType, value); wrapper != "" {
		return wrapper
	}
	if isInterfaceType(targetType) && isStructValueType(sourceType) {
		if cloneStructValue {
			value = o.lowerStructClone(value)
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperInterfaceValue) +
			"<" + o.tsTypeFor(ctx, targetType) + ">(" + value + ", " + strconv.Quote(goRuntimeTypeString(sourceType)) + ")"
	}
	if wrapper := o.lowerNamedValueInterfaceWrapper(ctx, targetType, sourceType, value); wrapper != "" {
		return wrapper
	}
	if isInterfaceType(targetType) && !isInterfaceType(sourceType) && isNilableType(sourceType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperInterfaceValue) +
			"<" + o.tsTypeFor(ctx, targetType) + ">(" + value + ", " + strconv.Quote(goRuntimeTypeString(sourceType)) + ")"
	}
	if isInterfaceType(targetType) && isInterfaceType(sourceType) &&
		!types.Identical(targetType, sourceType) && types.AssignableTo(sourceType, targetType) {
		return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")"
	}
	if isStructValueType(targetType) && cloneStructValue {
		return o.lowerStructClone(value)
	}
	if isIntegerType(targetType) && isIntegerType(sourceType) {
		if isBasicFixedWideIntegerType(targetType) {
			if bits, ok := unsignedIntegerBits(targetType); ok {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) +
					"(" + value + ", " + strconv.Itoa(bits) + ")"
			}
			if _, ok := signedIntegerBits(targetType); ok {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) + "(" + value + ")"
			}
		}
		if bits, ok := unsignedIntegerBits(targetType); ok && bits < 64 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) +
				"(" + value + ", " + strconv.Itoa(bits) + ")"
		}
		if bits, ok := signedIntegerBits(targetType); ok && bits < 64 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) +
				"(" + value + ", " + strconv.Itoa(bits) + ")"
		}
	}
	if named := namedNonStructType(targetType); named != nil {
		if _, ok := named.Underlying().(*types.Slice); ok {
			return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")"
		}
	}
	return value
}

func (o *LoweringOwner) lowerNumericInterfaceWrapper(
	ctx lowerFileContext,
	targetType types.Type,
	sourceType types.Type,
	value string,
) string {
	if targetType == nil || sourceType == nil || !isInterfaceType(targetType) || isInterfaceType(sourceType) {
		return ""
	}
	basic, ok := types.Unalias(sourceType).(*types.Basic)
	if !ok || basic.Info()&types.IsNumeric == 0 || basic.Info()&types.IsUntyped != 0 {
		return ""
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperNamedValueInterfaceValue) +
		"<" + o.tsTypeFor(ctx, targetType) + ">(" + value + ", " +
		strconv.Quote(goRuntimeTypeString(sourceType)) + ", {}, " +
		o.runtimeTypeInfoExpr(sourceType) + ")"
}

func isBasicFixedWideIntegerType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).(*types.Basic)
	if !ok {
		return false
	}
	switch basic.Kind() {
	case types.Int64, types.Uint64, types.Uintptr:
		return true
	default:
		return false
	}
}

func (o *LoweringOwner) lowerNamedValueInterfaceWrapper(
	ctx lowerFileContext,
	targetType types.Type,
	sourceType types.Type,
	value string,
) string {
	if targetType == nil || sourceType == nil {
		return ""
	}
	if !isInterfaceType(targetType) || isInterfaceType(sourceType) {
		return ""
	}
	targetInterface, _ := types.Unalias(targetType).Underlying().(*types.Interface)
	if targetInterface == nil || !types.Implements(sourceType, targetInterface) {
		return ""
	}
	receiver, methodSetType := namedNonStructMethodSetType(sourceType)
	if receiver == nil {
		return ""
	}
	methods := o.genericMethodDescriptorsForType(ctx, receiver, methodSetType)
	if methods == "" {
		return ""
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperNamedValueInterfaceValue) +
		"<" + o.tsTypeFor(ctx, targetType) + ">(" + value + ", " +
		strconv.Quote(goRuntimeTypeString(sourceType)) + ", " + methods + ", " +
		o.runtimeTypeInfoExpr(sourceType) + ")"
}

func (o *LoweringOwner) lowerPrimitiveErrorWrapper(ctx lowerFileContext, sourceType types.Type, value string) string {
	named, _ := types.Unalias(sourceType).(*types.Named)
	if named == nil || named.Obj() == nil {
		return ""
	}
	if _, ok := types.Unalias(named.Underlying()).(*types.Basic); !ok {
		return ""
	}
	errorType, _ := types.Universe.Lookup("error").Type().Underlying().(*types.Interface)
	if errorType == nil || !types.Implements(named, errorType) {
		return ""
	}
	method, _, _ := types.LookupFieldOrMethod(named, true, named.Obj().Pkg(), "Error")
	fn, _ := method.(*types.Func)
	if fn == nil {
		return ""
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperNamedValueInterfaceValue) +
		"<$.GoError>(" + value + ", " + strconv.Quote(goRuntimeTypeString(sourceType)) +
		", {\"Error\": " + o.methodFunctionExpr(ctx, named, fn, "Error") + "}, " +
		o.runtimeTypeInfoExpr(sourceType) + ")"
}

func (o *LoweringOwner) lowerStructClone(value string) string {
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(" +
		o.runtimeOwner.QualifiedHelper(RuntimeHelperCloneStructValue) + "(" + value + "))"
}

func (o *LoweringOwner) lowerZeroValueExpr(typ types.Type) string {
	if named := namedStructType(typ); named != nil && isStructValueType(typ) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(new " + safeIdentifier(named.Obj().Name()) + "())"
	}
	return zeroValueExpr(typ)
}

func (o *LoweringOwner) lowerZeroValueExprFor(ctx lowerFileContext, typ types.Type) string {
	if named := namedStructType(typ); named != nil && isStructValueType(typ) {
		if crossPackageUnexportedNamedType(ctx, named) {
			return "undefined as any"
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(new " + o.namedTypeExpr(ctx, named) + "())"
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		if typed.Kind() == types.UnsafePointer {
			return "null"
		}
		if typed.Info()&types.IsComplex != 0 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex) + "(0, 0)"
		}
		if typed.Info()&types.IsBoolean != 0 {
			return "false"
		}
		if typed.Info()&types.IsString != 0 {
			return "\"\""
		}
		if typed.Info()&types.IsNumeric != 0 {
			return "0"
		}
		return "undefined"
	case *types.Array:
		if isByteType(typed.Elem()) {
			return "new Uint8Array(" + strconv.FormatInt(typed.Len(), 10) + ")"
		}
		elem := o.lowerZeroValueExprFor(ctx, typed.Elem())
		return "Array.from({ length: " + strconv.FormatInt(typed.Len(), 10) + " }, () => " + arrowBodyExpr(elem) + ")"
	case *types.Struct:
		return anonymousStructZeroValueExpr(typed, func(fieldType types.Type) string {
			return o.lowerZeroValueExprFor(ctx, fieldType)
		})
	default:
		return "null"
	}
}

func (o *LoweringOwner) lowerDeclarationZeroValueExpr(ctx lowerFileContext, typ types.Type) string {
	if isFunctionType(typ) {
		return "null as unknown as " + o.tsFunctionZeroValueTypeFor(ctx, typ)
	}
	typeParam, ok := types.Unalias(typ).(*types.TypeParam)
	if !ok {
		value := o.lowerZeroValueExprFor(ctx, typ)
		if value == "null" {
			return "null as " + o.tsTypeFor(ctx, typ)
		}
		return value
	}
	if !typeParamInScope(ctx, typeParam) {
		return zeroValueExpr(typ)
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericZero) +
		"(__typeArgs, " + strconv.Quote(typeParam.Obj().Name()) + ", " + zeroValueExpr(typ) + ")"
}

func (o *LoweringOwner) tsFunctionZeroValueTypeFor(ctx lowerFileContext, typ types.Type) string {
	if signature := unnamedSignatureForType(typ); signature != nil {
		return o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
	}
	return o.tsTypeFor(ctx, typ)
}

func (o *LoweringOwner) runtimeTypeInfoExpr(typ types.Type) string {
	return o.runtimeTypeInfoExprWithSeen(typ, make(map[types.Type]bool))
}

func (o *LoweringOwner) runtimeTypeAssertInfoExpr(ctx lowerFileContext, typ types.Type) string {
	typeParam, ok := types.Unalias(typ).(*types.TypeParam)
	if !ok || !typeParamInScope(ctx, typeParam) {
		return o.runtimeTypeInfoExpr(typ)
	}
	return "__typeArgs?.[" + strconv.Quote(typeParam.Obj().Name()) + "]?.type ?? " +
		o.runtimeTypeInfoExpr(typ)
}

func (o *LoweringOwner) runtimeTypeInfoExprWithSeen(typ types.Type, seen map[types.Type]bool) string {
	typeKind := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeKind)
	if typ == nil {
		return "{ kind: " + typeKind + ".Basic, name: \"unknown\" }"
	}
	typeKey := types.Unalias(typ)
	if typeKey != nil {
		if seen[typeKey] {
			return o.shallowRuntimeTypeInfoExpr(typ)
		}
		seen[typeKey] = true
		defer delete(seen, typeKey)
	}
	if named := namedStructType(typ); named != nil {
		return strconv.Quote(runtimeNamedTypeName(named))
	}
	if named := namedFunctionType(typ); named != nil {
		return o.runtimeFunctionTypeInfoWithSeen(named.Underlying().(*types.Signature), runtimeNamedTypeName(named), seen)
	}
	if named := namedNonStructType(typ); named != nil {
		if basic, ok := types.Unalias(named.Underlying()).(*types.Basic); ok {
			return runtimeBasicTypeInfoExpr(typeKind, basic, runtimeNamedTypeName(named))
		}
		return strconv.Quote(runtimeNamedTypeName(named))
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		return runtimeBasicTypeInfoExpr(typeKind, typed, "")
	case *types.Pointer:
		return "{ kind: " + typeKind + ".Pointer, elemType: " + o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen) + " }"
	case *types.Struct:
		return "{ kind: " + typeKind + ".Struct, methods: [], fields: " + o.runtimeStructFieldsExpr(typed, seen) + " }"
	case *types.Slice:
		return "{ kind: " + typeKind + ".Slice, elemType: " + o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen) + " }"
	case *types.Array:
		return "{ kind: " + typeKind + ".Array, elemType: " + o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen) + ", length: " + strconv.FormatInt(typed.Len(), 10) + " }"
	case *types.Map:
		return "{ kind: " + typeKind + ".Map, keyType: " + o.runtimeTypeInfoExprWithSeen(typed.Key(), seen) + ", elemType: " + o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen) + " }"
	case *types.Chan:
		return "{ kind: " + typeKind + ".Channel, direction: " + strconv.Quote(channelDirectionString(typed.Dir())) + ", elemType: " + o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen) + " }"
	case *types.Interface:
		typed.Complete()
		return "{ kind: " + typeKind + ".Interface, methods: " + o.runtimeMethodSignaturesWithSeen(typed, seen) + " }"
	case *types.Signature:
		return o.runtimeFunctionTypeInfoWithSeen(typed, "", seen)
	default:
		return "{ kind: " + typeKind + ".Basic, name: \"unknown\" }"
	}
}

func runtimeBasicTypeInfoExpr(typeKind string, basic *types.Basic, typeName string) string {
	name := "unknown"
	switch {
	case basic.Info()&types.IsBoolean != 0:
		name = "bool"
	case basic.Info()&types.IsString != 0:
		name = "string"
	case basic.Info()&types.IsNumeric != 0:
		name = basicRuntimeName(basic)
	}
	parts := []string{"kind: " + typeKind + ".Basic", "name: " + strconv.Quote(name)}
	if typeName != "" {
		parts = append(parts, "typeName: "+strconv.Quote(typeName))
	}
	return "{ " + strings.Join(parts, ", ") + " }"
}

func (o *LoweringOwner) shallowRuntimeTypeInfoExpr(typ types.Type) string {
	typeKind := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeKind)
	switch types.Unalias(typ).Underlying().(type) {
	case *types.Interface:
		return "{ kind: " + typeKind + ".Interface, methods: [] }"
	case *types.Signature:
		return "{ kind: " + typeKind + ".Function, params: [], results: [] }"
	case *types.Pointer:
		return "{ kind: " + typeKind + ".Pointer, elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" } }"
	case *types.Struct:
		return "{ kind: " + typeKind + ".Struct, methods: [], fields: [] }"
	case *types.Slice:
		return "{ kind: " + typeKind + ".Slice, elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" } }"
	case *types.Array:
		return "{ kind: " + typeKind + ".Array, elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" }, length: 0 }"
	case *types.Map:
		return "{ kind: " + typeKind + ".Map, keyType: { kind: " + typeKind + ".Basic, name: \"unknown\" }, elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" } }"
	case *types.Chan:
		return "{ kind: " + typeKind + ".Channel, direction: \"both\", elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" } }"
	default:
		return "{ kind: " + typeKind + ".Basic, name: \"unknown\" }"
	}
}

func (o *LoweringOwner) runtimeStructFieldsExpr(structType *types.Struct, seen map[types.Type]bool) string {
	fields := make([]string, 0, structType.NumFields())
	var vars []*types.Var
	for field := range structType.Fields() {
		vars = append(vars, field)
	}
	offsets := structFieldOffsets(goScriptTypeSizes(), vars)
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fieldName := tsStructFieldName(field.Name(), idx)
		runtimeName := ""
		if fieldName != field.Name() {
			runtimeName = field.Name()
		}
		pkgPath := ""
		if !field.Exported() && field.Pkg() != nil {
			pkgPath = field.Pkg().Path()
		}
		fieldInfo := runtimeStructFieldInfoExpr(
			o.runtimeTypeInfoExprWithSeen(field.Type(), seen),
			fieldName,
			runtimeName,
			structType.Tag(idx),
			pkgPath,
			field.Embedded(),
			[]int{idx},
			offsets[idx],
			field.Exported(),
		)
		fields = append(fields, fieldInfo)
	}
	return "[" + strings.Join(fields, ", ") + "]"
}

func runtimeStructFieldInfoExpr(
	runtimeType string,
	storageKey string,
	runtimeName string,
	tag string,
	pkgPath string,
	anonymous bool,
	index []int,
	offset int64,
	exported bool,
) string {
	name := runtimeName
	if name == "" {
		name = storageKey
	}
	fields := []string{
		"name: " + strconv.Quote(name),
		"key: " + strconv.Quote(storageKey),
		"type: " + runtimeType,
	}
	if runtimeName != "" {
		fields = append(fields, "pkgPath: "+strconv.Quote(pkgPath))
	} else if pkgPath != "" {
		fields = append(fields, "pkgPath: "+strconv.Quote(pkgPath))
	}
	if tag != "" {
		fields = append(fields, "tag: "+strconv.Quote(tag))
	}
	if anonymous {
		fields = append(fields, "anonymous: true")
	}
	fields = append(fields, "index: "+runtimeStructFieldIndexExpr(index))
	fields = append(fields, "offset: "+strconv.FormatInt(offset, 10))
	fields = append(fields, "exported: "+strconv.FormatBool(exported))
	return "{ " + strings.Join(fields, ", ") + " }"
}

func runtimeStructFieldIndexExpr(index []int) string {
	values := make([]string, 0, len(index))
	for _, value := range index {
		values = append(values, strconv.Itoa(value))
	}
	return "[" + strings.Join(values, ", ") + "]"
}

func (o *LoweringOwner) runtimeFunctionTypeInfo(signature *types.Signature, name string) string {
	return o.runtimeFunctionTypeInfoWithSeen(signature, name, make(map[types.Type]bool))
}

func (o *LoweringOwner) runtimeFunctionTypeInfoWithSeen(signature *types.Signature, name string, seen map[types.Type]bool) string {
	typeKind := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeKind)
	parts := []string{"kind: " + typeKind + ".Function"}
	if name != "" {
		parts = append(parts, "name: "+strconv.Quote(name))
	}
	parts = append(parts, "params: "+o.runtimeSignatureTypes(signature.Params(), seen))
	parts = append(parts, "results: "+o.runtimeSignatureTypes(signature.Results(), seen))
	if signature.Variadic() {
		parts = append(parts, "isVariadic: true")
	}
	runtimePackage := strings.TrimSuffix(typeKind, ".TypeKind")
	return "({ " + strings.Join(parts, ", ") + " } as " + runtimePackage + ".FunctionTypeInfo)"
}

func (o *LoweringOwner) runtimeSignatureTypes(tuple *types.Tuple, seen map[types.Type]bool) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	types := make([]string, 0, tuple.Len())
	for v := range tuple.Variables() {
		types = append(types, o.runtimeTypeInfoExprWithSeen(v.Type(), seen))
	}
	return "[" + strings.Join(types, ", ") + "]"
}

func tsStructFieldName(name string, idx int) string {
	if name == "_" {
		return "_blank" + strconv.Itoa(idx)
	}
	return safeIdentifier(name)
}

func shouldCloneStructValue(expr ast.Expr) bool {
	switch expr.(type) {
	case *ast.CompositeLit:
		return false
	default:
		return true
	}
}

func constIntExpr(ctx lowerFileContext, expr ast.Expr) (int, bool) {
	tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]
	if !ok || tv.Value == nil {
		return 0, false
	}
	value, ok := constant.Int64Val(tv.Value)
	if !ok {
		return 0, false
	}
	return int(value), true
}

func (o *LoweringOwner) tsSignatureParamsFor(ctx lowerFileContext, signature *types.Signature, asyncCompatibleFunctionParams bool) string {
	if signature == nil || signature.Params() == nil || signature.Params().Len() == 0 {
		return ""
	}
	params := make([]string, 0, signature.Params().Len())
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		params = append(params, safeParamName(param, idx)+": "+o.tsFuncParamTypeFor(ctx, param.Type(), asyncCompatibleFunctionParams))
	}
	return strings.Join(params, ", ")
}

func (o *LoweringOwner) tsSignatureResultFor(ctx lowerFileContext, signature *types.Signature) string {
	if signature == nil || signature.Results() == nil || signature.Results().Len() == 0 {
		return "void"
	}
	if signature.Results().Len() == 1 {
		return o.tsSignatureResultTypeFor(ctx, signature.Results().At(0).Type())
	}
	results := make([]string, 0, signature.Results().Len())
	for result := range signature.Results().Variables() {
		results = append(results, o.tsSignatureResultTypeFor(ctx, result.Type()))
	}
	return "[" + strings.Join(results, ", ") + "]"
}

func (o *LoweringOwner) tsSignatureResultTypeFor(ctx lowerFileContext, typ types.Type) string {
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if _, ok := types.Unalias(named.Underlying()).(*types.Signature); ok {
			return o.tsTypeFor(ctx, typ)
		}
	}
	if signature := signatureForType(typ); ctx.functionTypeDepth == 0 && signature != nil {
		return o.tsAsyncCompatibleFunctionResultTypeFor(ctx, signature)
	}
	return o.tsTypeFor(ctx, typ)
}

func funcSignatureNeedsAsyncFunctionParamCalls(signature *types.Signature) bool {
	if signature == nil || signature.Params() == nil {
		return false
	}
	for param := range signature.Params().Variables() {
		paramSignature := signatureForType(param.Type())
		if paramSignature != nil && paramSignature.Results() != nil && paramSignature.Results().Len() != 0 {
			return true
		}
	}
	return false
}

func funcLiteralNeedsAsyncFunctionParamCalls(signature *types.Signature) bool {
	if signature == nil || signature.Params() == nil {
		return false
	}
	if signature.Results() == nil || signature.Results().Len() == 0 {
		return false
	}
	return funcSignatureNeedsAsyncFunctionParamCalls(signature)
}

func unnamedSignatureForType(typ types.Type) *types.Signature {
	if typ == nil {
		return nil
	}
	if _, ok := types.Unalias(typ).(*types.Named); ok {
		return nil
	}
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	return signature
}

func exprIsAsyncCompatibleFuncLit(ctx lowerFileContext, expr ast.Expr) bool {
	funcLit, ok := expr.(*ast.FuncLit)
	if !ok || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	signature, _ := ctx.semPkg.source.TypesInfo.TypeOf(funcLit).(*types.Signature)
	return funcLiteralNeedsAsyncFunctionParamCalls(signature)
}

func asyncResultType(result string, async bool) string {
	if !async {
		return result
	}
	return tsPromiseType(result)
}

func asyncCompatibleResultType(result string) string {
	if result == "void" {
		return result
	}
	return result + " | " + tsPromiseType(result)
}

func asyncCompatibleMethodResultType(result string, async bool) string {
	if !async {
		return result
	}
	return asyncCompatibleResultType(result)
}

func tsPromiseType(result string) string {
	return "globalThis.Promise<" + result + ">"
}

func (o *LoweringOwner) tsVariableTypeFor(ctx lowerFileContext, typ types.Type, needsVarRef bool) string {
	valueType := o.tsTypeFor(ctx, typ)
	if needsVarRef {
		return "$.VarRef<" + valueType + ">"
	}
	return valueType
}

func (o *LoweringOwner) tsFuncParamTypeFor(ctx lowerFileContext, typ types.Type, asyncCompatible bool) string {
	if !asyncCompatible {
		return o.tsTypeFor(ctx, typ)
	}
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	if signature == nil {
		return o.tsTypeFor(ctx, typ)
	}
	signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	return "((" + o.tsSignatureParamsFor(signatureCtx, signature, false) + ") => " +
		asyncCompatibleResultType(o.tsSignatureResultFor(signatureCtx, signature)) + ") | null"
}

func (o *LoweringOwner) tsTypeAssertionTypeFor(ctx lowerFileContext, typ types.Type) string {
	if signature := signatureForType(typ); signature != nil {
		return o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
	}
	return o.tsTypeFor(ctx, typ)
}

func (o *LoweringOwner) tsAsyncCompatibleFunctionTypeFor(ctx lowerFileContext, signature *types.Signature) string {
	signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	return "((" + o.tsSignatureParamsFor(signatureCtx, signature, true) + ") => " +
		asyncCompatibleResultType(o.tsSignatureResultFor(signatureCtx, signature)) + ") | null"
}

func (o *LoweringOwner) tsAsyncCompatibleFunctionResultTypeFor(ctx lowerFileContext, signature *types.Signature) string {
	signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	return "((" + o.tsSignatureParamsFor(signatureCtx, signature, false) + ") => " +
		asyncCompatibleResultType(o.tsSignatureResultFor(signatureCtx, signature)) + ") | null"
}

func (o *LoweringOwner) tsTypeFor(ctx lowerFileContext, typ types.Type) string {
	if typ == nil {
		return "unknown"
	}
	if alias, ok := typ.(*types.Alias); ok {
		return o.aliasTypeExpr(ctx, alias)
	}
	if isBuiltinErrorType(typ) {
		return "$.GoError"
	}
	if isUnsafePointerType(typ) {
		return "any"
	}
	if _, ok := types.Unalias(typ).(*types.TypeParam); ok {
		return "any"
	}
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if crossPackageUnexportedNamedType(ctx, named) {
			return "any"
		}
		if !ctx.canReferenceNamedType(named) {
			return "any"
		}
		name := o.namedTypeExpr(ctx, named)
		if _, ok := named.Underlying().(*types.Interface); ok {
			return name + " | null"
		}
		if _, ok := types.Unalias(named.Underlying()).(*types.Signature); ok {
			return name + " | null"
		}
		return name
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		if typed.Kind() == types.UntypedNil {
			return "null"
		}
		if typed.Info()&types.IsComplex != 0 {
			return "$.Complex"
		}
		if typed.Info()&types.IsBoolean != 0 {
			return "boolean"
		}
		if typed.Info()&types.IsString != 0 {
			return "string"
		}
		if typed.Info()&types.IsNumeric != 0 {
			return "number"
		}
		return "unknown"
	case *types.Array:
		if isByteType(typed.Elem()) {
			return "Uint8Array"
		}
		return tsArrayType(o.tsTypeFor(ctx, typed.Elem()))
	case *types.Slice:
		return "$.Slice<" + o.tsSliceElemTypeFor(ctx, typed.Elem()) + ">"
	case *types.Map:
		return "Map<" + o.tsTypeFor(ctx, typed.Key()) + ", " + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
	case *types.Chan:
		return "$.Channel<" + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
	case *types.Struct:
		return o.tsAnonymousStructTypeFor(ctx, typed)
	case *types.Pointer:
		if isBuiltinErrorType(typed.Elem()) {
			return "$.VarRef<$.GoError> | null"
		}
		if _, ok := types.Unalias(typed.Elem()).(*types.TypeParam); ok {
			return "any"
		}
		if named := namedNonStructType(typed.Elem()); named != nil {
			if crossPackageUnexportedNamedType(ctx, named) {
				return "any"
			}
			if !ctx.canReferenceNamedType(named) {
				return "any"
			}
			return "$.VarRef<" + o.namedTypeExpr(ctx, named) + "> | null"
		}
		if named := namedStructType(typed.Elem()); named != nil {
			if crossPackageUnexportedNamedType(ctx, named) {
				return "any"
			}
			if !ctx.canReferenceNamedType(named) {
				return "any"
			}
			name := o.namedTypeExpr(ctx, named)
			return name + " | $.VarRef<" + name + "> | null"
		}
		return "$.VarRef<" + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
	case *types.Interface:
		return "any"
	case *types.Signature:
		signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
		return "((" + o.tsSignatureParamsFor(signatureCtx, typed, true) + ") => " +
			asyncCompatibleResultType(o.tsSignatureResultFor(signatureCtx, typed)) + ") | null"
	default:
		return "unknown"
	}
}

func (o *LoweringOwner) tsSliceElemTypeFor(ctx lowerFileContext, typ types.Type) string {
	if typeParam, ok := types.Unalias(typ).(*types.TypeParam); ok && staticTypeParamInScope(ctx, typeParam) {
		return safeIdentifier(typeParam.Obj().Name())
	}
	if pointer, ok := types.Unalias(typ).(*types.Pointer); ok {
		if typeParam, ok := types.Unalias(pointer.Elem()).(*types.TypeParam); ok && staticTypeParamInScope(ctx, typeParam) {
			name := safeIdentifier(typeParam.Obj().Name())
			return name + " | $.VarRef<" + name + "> | null"
		}
	}
	return o.tsTypeFor(ctx, typ)
}

func (o *LoweringOwner) tsNonNilTypeFor(ctx lowerFileContext, typ types.Type) string {
	if isBuiltinErrorType(typ) {
		return "Exclude<$.GoError, null>"
	}
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if _, ok := named.Underlying().(*types.Interface); ok {
			if !ctx.canReferenceNamedType(named) {
				return "any"
			}
			return "Exclude<" + o.namedTypeExpr(ctx, named) + ", null>"
		}
	}
	return strings.TrimSuffix(o.tsTypeFor(ctx, typ), " | null")
}

func (o *LoweringOwner) aliasTypeExpr(ctx lowerFileContext, alias *types.Alias) string {
	if alias == nil || alias.Obj() == nil {
		return "unknown"
	}
	if !ctx.canReferenceObjectPackage(alias.Obj()) {
		return "any"
	}
	if alias.Obj().Pkg() == nil {
		return o.tsTypeFor(ctx, alias.Rhs())
	}
	baseName := alias.Obj().Name()
	if localAlias := ctx.localAliases[alias.Obj()]; localAlias != "" {
		baseName = localAlias + "." + baseName
	} else if importAlias := ctx.importPaths[alias.Obj().Pkg().Path()]; importAlias != "" {
		baseName = importAlias + "." + baseName
	}
	return baseName
}

func crossPackageUnexportedNamedType(ctx lowerFileContext, named *types.Named) bool {
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil || ctx.semPkg == nil {
		return false
	}
	return named.Obj().Pkg().Path() != ctx.semPkg.pkgPath && !ast.IsExported(named.Obj().Name())
}

func tsArrayType(elem string) string {
	if strings.Contains(elem, "|") {
		return "(" + elem + ")[]"
	}
	return elem + "[]"
}

func (o *LoweringOwner) tsAnonymousStructTypeFor(ctx lowerFileContext, structType *types.Struct) string {
	fields := make([]string, 0, structType.NumFields())
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fields = append(fields, strconv.Quote(tsStructFieldName(field.Name(), idx))+": "+o.tsStructFieldTypeFor(ctx, field.Type()))
	}
	return "{" + strings.Join(fields, ", ") + "}"
}

func (o *LoweringOwner) tsStructFieldTypeFor(ctx lowerFileContext, typ types.Type) string {
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	if signature == nil {
		return o.tsTypeFor(ctx, typ)
	}
	return "((" + o.tsSignatureParamsFor(ctx, signature, true) + ") => " +
		asyncCompatibleResultType(o.tsSignatureResultFor(ctx, signature)) + ") | null"
}

func zeroValueExpr(typ types.Type) string {
	if typ == nil {
		return "undefined"
	}
	if named := namedStructType(typ); named != nil && isStructValueType(typ) {
		return "new " + safeIdentifier(named.Obj().Name()) + "()"
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		if typed.Kind() == types.UnsafePointer {
			return "null"
		}
		if typed.Info()&types.IsComplex != 0 {
			return "({ real: 0, imag: 0 })"
		}
		if typed.Info()&types.IsBoolean != 0 {
			return "false"
		}
		if typed.Info()&types.IsString != 0 {
			return "\"\""
		}
		if typed.Info()&types.IsNumeric != 0 {
			return "0"
		}
		return "undefined"
	case *types.Array:
		if isByteType(typed.Elem()) {
			return "new Uint8Array(" + strconv.FormatInt(typed.Len(), 10) + ")"
		}
		elem := zeroValueExpr(typed.Elem())
		return "Array.from({ length: " + strconv.FormatInt(typed.Len(), 10) + " }, () => " + arrowBodyExpr(elem) + ")"
	case *types.Struct:
		return anonymousStructZeroValueExpr(typed, zeroValueExpr)
	default:
		return "null"
	}
}

func anonymousStructZeroValueExpr(structType *types.Struct, zero func(types.Type) string) string {
	fields := make([]string, 0, structType.NumFields())
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fields = append(fields, strconv.Quote(tsStructFieldName(field.Name(), idx))+": "+zero(field.Type()))
	}
	return "{" + strings.Join(fields, ", ") + "}"
}

func arrowBodyExpr(expr string) string {
	if strings.HasPrefix(expr, "{") {
		return "(" + expr + ")"
	}
	return expr
}

func namedStructType(typ types.Type) *types.Named {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil {
		return nil
	}
	if _, ok := named.Underlying().(*types.Struct); !ok {
		return nil
	}
	return named
}

func pointerToNamedStructType(typ types.Type) *types.Named {
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return nil
	}
	return namedStructType(pointer.Elem())
}

func namedNonStructType(typ types.Type) *types.Named {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil {
		return nil
	}
	if _, ok := named.Underlying().(*types.Struct); ok {
		return nil
	}
	return named
}

func namedFunctionType(typ types.Type) *types.Named {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil {
		return nil
	}
	if _, ok := named.Underlying().(*types.Signature); !ok {
		return nil
	}
	return named
}

func overrideNamedStringType(ctx lowerFileContext, owner *LoweringOwner, typ types.Type) bool {
	named, _ := types.Unalias(typ).(*types.Named)
	return named != nil && isStringType(named) && owner.typeUsesOverride(named)
}

func isBuiltinErrorType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil || named.Obj() == nil {
		return false
	}
	return named.Obj().Pkg() == nil && named.Obj().Name() == "error"
}

func receiverTypeParam(typ types.Type) *types.TypeParam {
	for {
		pointer, ok := typ.(*types.Pointer)
		if !ok {
			break
		}
		typ = pointer.Elem()
	}
	typeParam, _ := types.Unalias(typ).(*types.TypeParam)
	return typeParam
}

func signatureHasTypeParam(signature *types.Signature, target *types.TypeParam) bool {
	if signature == nil || target == nil {
		return false
	}
	typeParams := signature.TypeParams()
	if typeParams == nil {
		return false
	}
	for typeParam := range typeParams.TypeParams() {
		if typeParam == target || typeParam.Obj() == target.Obj() {
			return true
		}
	}
	return false
}

func typeParamInScope(ctx lowerFileContext, target *types.TypeParam) bool {
	if target == nil {
		return false
	}
	if signatureHasTypeParam(ctx.signature, target) {
		return true
	}
	return ctx.typeParams[target.Obj().Name()]
}

func staticTypeParamInScope(ctx lowerFileContext, target *types.TypeParam) bool {
	if target == nil || !typeParamInScope(ctx, target) {
		return false
	}
	return ctx.staticTypeParams[target.Obj().Name()]
}

func typeParamConstraintIsAny(typeParam *types.TypeParam) bool {
	if typeParam == nil {
		return false
	}
	iface, ok := typeParam.Constraint().Underlying().(*types.Interface)
	if !ok {
		return false
	}
	return iface.NumMethods() == 0 && iface.NumEmbeddeds() == 0
}

func signatureTypeParamNames(signature *types.Signature) []string {
	if signature == nil || signature.TypeParams() == nil {
		return nil
	}
	typeParams := signature.TypeParams()
	names := make([]string, 0, typeParams.Len())
	for typeParam := range typeParams.TypeParams() {
		if !signatureUsesTypeParamAsSliceElem(signature, typeParam) {
			continue
		}
		names = append(names, safeIdentifier(typeParam.Obj().Name()))
	}
	return names
}

func signatureUsesTypeParamAsSliceElem(signature *types.Signature, target *types.TypeParam) bool {
	if signature == nil || target == nil {
		return false
	}
	return tupleUsesTypeParamAsSliceElem(signature.Params(), target) ||
		tupleUsesTypeParamAsSliceElem(signature.Results(), target)
}

func tupleUsesTypeParamAsSliceElem(tuple *types.Tuple, target *types.TypeParam) bool {
	if tuple == nil {
		return false
	}
	for variable := range tuple.Variables() {
		if typeUsesTypeParamAsSliceElem(variable.Type(), target) {
			return true
		}
	}
	return false
}

func typeUsesTypeParamAsSliceElem(typ types.Type, target *types.TypeParam) bool {
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Slice:
		if typeParam, ok := types.Unalias(typed.Elem()).(*types.TypeParam); ok &&
			(typeParam == target || typeParam.Obj() == target.Obj()) {
			return true
		}
		return typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Array:
		return typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Pointer:
		return typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Map:
		return typeUsesTypeParamAsSliceElem(typed.Key(), target) ||
			typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Chan:
		return typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Signature:
		return tupleUsesTypeParamAsSliceElem(typed.Params(), target) ||
			tupleUsesTypeParamAsSliceElem(typed.Results(), target)
	default:
		return false
	}
}

func sameNamedTypeOrigin(a *types.Named, b *types.Named) bool {
	if a == nil || b == nil {
		return false
	}
	return a == b || a.Origin() == b.Origin()
}

func namedNonInterfaceNonStructType(named *types.Named) bool {
	if named == nil {
		return false
	}
	switch named.Underlying().(type) {
	case *types.Interface, *types.Struct:
		return false
	default:
		return true
	}
}

func isStructValueType(typ types.Type) bool {
	return namedStructType(typ) != nil
}

func isStructComparableType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	if _, ok := types.Unalias(typ).Underlying().(*types.Struct); !ok {
		return false
	}
	return types.Comparable(typ)
}

func isPointerToStructType(typ types.Type) bool {
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return false
	}
	return namedStructType(pointer.Elem()) != nil
}

func derefPointerType(typ types.Type) types.Type {
	if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
		return pointer.Elem()
	}
	return typ
}

func structUnderlyingType(typ types.Type) *types.Struct {
	typed, _ := types.Unalias(typ).Underlying().(*types.Struct)
	return typed
}

func pointerToArrayType(typ types.Type) *types.Array {
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return nil
	}
	array, _ := types.Unalias(pointer.Elem()).Underlying().(*types.Array)
	return array
}

func isMapType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Map)
	return ok
}

func indexElementType(typ types.Type) types.Type {
	if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
		typ = pointer.Elem()
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Slice:
		return typed.Elem()
	case *types.Array:
		return typed.Elem()
	default:
		return nil
	}
}

func goScriptElementByteSize(ctx lowerFileContext, typ types.Type) int64 {
	if typ == nil {
		return 1
	}
	if sizes := ctx.semPkg.source.TypesSizes; sizes != nil {
		if size := sizes.Sizeof(typ); size > 0 {
			return size
		}
	}
	if bits, ok := integerBits(typ); ok && bits > 0 {
		return int64((bits + 7) / 8)
	}
	if isFloatType(typ) {
		basic, _ := types.Unalias(typ).Underlying().(*types.Basic)
		if basic != nil && basic.Kind() == types.Float32 {
			return 4
		}
		return 8
	}
	return 1
}

func isChannelType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Chan)
	return ok
}

func isComplexType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Info()&types.IsComplex != 0
}

func isPointerType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	return ok
}

func isUnsafePointerType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Kind() == types.UnsafePointer
}

func channelDirectionString(dir types.ChanDir) string {
	switch dir {
	case types.SendOnly:
		return "send"
	case types.RecvOnly:
		return "receive"
	default:
		return "both"
	}
}

func isNilExpr(expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	return ok && ident.Name == "nil"
}

func unwrapParenExpr(expr ast.Expr) ast.Expr {
	for {
		paren, ok := expr.(*ast.ParenExpr)
		if !ok {
			return expr
		}
		expr = paren.X
	}
}

func isStringType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Info()&types.IsString != 0
}

func isNumericType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Info()&types.IsNumeric != 0
}

func isIntegerType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Info()&types.IsInteger != 0
}

func isFloatType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Info()&types.IsFloat != 0
}

func unsignedIntegerBits(typ types.Type) (int, bool) {
	if typ == nil {
		return 0, false
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	if !ok || basic.Info()&types.IsUnsigned == 0 {
		return 0, false
	}
	switch basic.Kind() {
	case types.Uint8:
		return 8, true
	case types.Uint16:
		return 16, true
	case types.Uint32:
		return 32, true
	default:
		return 64, true
	}
}

func signedIntegerBits(typ types.Type) (int, bool) {
	if typ == nil {
		return 0, false
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	if !ok || basic.Info()&types.IsInteger == 0 || basic.Info()&types.IsUnsigned != 0 {
		return 0, false
	}
	switch basic.Kind() {
	case types.Int8:
		return 8, true
	case types.Int16:
		return 16, true
	case types.Int32:
		return 32, true
	default:
		return 64, true
	}
}

func integerBits(typ types.Type) (int, bool) {
	if bits, ok := unsignedIntegerBits(typ); ok {
		return bits, true
	}
	return signedIntegerBits(typ)
}

func isWideIntegerType(typ types.Type) bool {
	bits, ok := integerBits(typ)
	return ok && bits > 32
}

func isFixedWideIntegerType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	if !ok {
		return false
	}
	switch basic.Kind() {
	case types.Int64, types.Uint64, types.Uintptr:
		return true
	default:
		return false
	}
}

func isFixedSignedWideIntegerType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Kind() == types.Int64
}

func isRuntimeWideIntegerType(typ types.Type) bool {
	if isFixedWideIntegerType(typ) {
		return true
	}
	bits, ok := unsignedIntegerBits(typ)
	return ok && bits > 32
}

func isRuneSliceType(typ types.Type) bool {
	slice, ok := types.Unalias(typ).Underlying().(*types.Slice)
	return ok && isRuneType(slice.Elem())
}

func isByteSliceType(typ types.Type) bool {
	slice, ok := types.Unalias(typ).Underlying().(*types.Slice)
	return ok && isByteType(slice.Elem())
}

func isRuneType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Kind() == types.Int32
}

func isByteType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Kind() == types.Uint8
}

func sliceTypeHint(typ types.Type) string {
	switch {
	case isByteType(typ):
		return "byte"
	case isStringType(typ):
		return "string"
	case isNumericType(typ):
		return "number"
	case isBoolType(typ):
		return "boolean"
	default:
		return ""
	}
}

func typeFromExpr(ctx lowerFileContext, expr ast.Expr) types.Type {
	if expr == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	if tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]; ok && tv.IsType() {
		return tv.Type
	}
	return nil
}

func genericFunctionSignature(ctx lowerFileContext, expr ast.Expr) *types.Signature {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	var fn *types.Func
	switch typed := expr.(type) {
	case *ast.Ident:
		fn, _ = ctx.semPkg.source.TypesInfo.Uses[typed].(*types.Func)
	case *ast.SelectorExpr:
		fn, _ = ctx.semPkg.source.TypesInfo.Uses[typed.Sel].(*types.Func)
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil {
			fn, _ = selection.Obj().(*types.Func)
		}
	}
	if fn == nil {
		return nil
	}
	signature, _ := fn.Type().(*types.Signature)
	if signature == nil || signature.TypeParams() == nil || signature.TypeParams().Len() == 0 {
		return nil
	}
	return signature
}

func selectorUsesGeneratedPackage(ctx lowerFileContext, expr *ast.SelectorExpr) bool {
	if ctx.model == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	fn := calledFunction(ctx.semPkg.source, expr)
	if fn == nil || fn.Pkg() == nil {
		return false
	}
	_, ok := ctx.model.packages[fn.Pkg().Path()]
	return ok
}

func (o *LoweringOwner) functionAsync(ctx lowerFileContext, fn *types.Func) bool {
	if fn == nil || ctx.model == nil {
		return false
	}
	return ctx.model.functionAsync(fn)
}

func (o *LoweringOwner) callNeedsAwait(ctx lowerFileContext, fun ast.Expr) bool {
	for {
		switch typed := fun.(type) {
		case *ast.IndexExpr:
			if signatureForType(ctx.semPkg.source.TypesInfo.TypeOf(typed.X)) == nil {
				break
			}
			fun = typed.X
		case *ast.IndexListExpr:
			if signatureForType(ctx.semPkg.source.TypesInfo.TypeOf(typed.X)) == nil {
				break
			}
			fun = typed.X
		default:
			if ctx.semPkg == nil || ctx.semPkg.source == nil {
				return false
			}
			return o.functionAsync(ctx, calledFunction(ctx.semPkg.source, fun)) ||
				o.overrideCallNeedsAwait(ctx, fun) ||
				callUsesFunctionValue(ctx.semPkg.source, fun) ||
				(ctx.asyncFunction && callUsesFunctionIdentifier(ctx.semPkg.source, fun))
		}
		if ctx.semPkg == nil || ctx.semPkg.source == nil {
			return false
		}
		return o.functionAsync(ctx, calledFunction(ctx.semPkg.source, fun)) ||
			o.overrideCallNeedsAwait(ctx, fun) ||
			callUsesFunctionValue(ctx.semPkg.source, fun) ||
			(ctx.asyncFunction && callUsesFunctionIdentifier(ctx.semPkg.source, fun))
	}
}

func (o *LoweringOwner) overrideCallNeedsAwait(ctx lowerFileContext, fun ast.Expr) bool {
	if o.overrideOwner == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	if fn := calledFunction(ctx.semPkg.source, fun); fn != nil && fn.Pkg() != nil &&
		o.overrideFacts().IsFunctionAsync(fn.Pkg().Path(), fn.Name()) {
		return true
	}
	selector, ok := fun.(*ast.SelectorExpr)
	if !ok {
		return false
	}
	selection := ctx.semPkg.source.TypesInfo.Selections[selector]
	if selection == nil {
		return false
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return false
	}
	named := selectedReceiverNamedType(ctx.semPkg.source, selector, selection)
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return false
	}
	return o.overrideFacts().IsMethodAsync(
		named.Obj().Pkg().Path(),
		named.Obj().Name()+"."+method.Name(),
	)
}

func (o *LoweringOwner) awaitCallIfNeeded(ctx lowerFileContext, fun ast.Expr, call string) string {
	if o.callNeedsAwait(ctx, fun) {
		return "await " + call
	}
	return call
}

func parenthesizeAwaitedExpr(expr string) string {
	if strings.HasPrefix(expr, "await ") {
		return "(" + expr + ")"
	}
	return expr
}

func (o *LoweringOwner) genericTypeArgsExpr(ctx lowerFileContext, callee ast.Expr, typeArgExprs []ast.Expr) string {
	signature := genericFunctionSignature(ctx, callee)
	if signature == nil {
		return "undefined"
	}
	typeParams := signature.TypeParams()
	entries := make([]string, 0, typeParams.Len())
	for idx := range typeParams.Len() {
		if idx >= len(typeArgExprs) {
			break
		}
		typ := ctx.semPkg.source.TypesInfo.TypeOf(typeArgExprs[idx])
		if typ == nil {
			continue
		}
		entries = append(entries, typeParams.At(idx).Obj().Name()+": "+o.genericTypeDescriptorExpr(ctx, typ))
	}
	if len(entries) == 0 {
		return "undefined"
	}
	return "{" + strings.Join(entries, ", ") + "}"
}

func (o *LoweringOwner) inferredGenericTypeArgsExpr(
	ctx lowerFileContext,
	signature *types.Signature,
	args []ast.Expr,
) string {
	typeParams := signature.TypeParams()
	if typeParams == nil || typeParams.Len() == 0 {
		return "undefined"
	}
	inferred := make(map[*types.TypeParam]types.Type)
	params := signature.Params()
	if params != nil {
		for idx := range params.Len() {
			if idx >= len(args) {
				break
			}
			o.inferGenericTypeArg(inferred, params.At(idx).Type(), ctx.semPkg.source.TypesInfo.TypeOf(args[idx]))
		}
	}
	entries := make([]string, 0, typeParams.Len())
	for typeParam := range typeParams.TypeParams() {
		typ := inferred[typeParam]
		if typ == nil {
			continue
		}
		entries = append(entries, typeParam.Obj().Name()+": "+o.genericTypeDescriptorExpr(ctx, typ))
	}
	if len(entries) == 0 {
		return "undefined"
	}
	return "{" + strings.Join(entries, ", ") + "}"
}

func (o *LoweringOwner) inferGenericTypeArg(
	inferred map[*types.TypeParam]types.Type,
	paramType types.Type,
	argType types.Type,
) {
	if paramType == nil || argType == nil {
		return
	}
	if typeParam, ok := types.Unalias(paramType).(*types.TypeParam); ok {
		if inferred[typeParam] == nil {
			inferred[typeParam] = argType
		}
		return
	}
	if paramNamed, ok := types.Unalias(paramType).(*types.Named); ok {
		if argNamed, ok := types.Unalias(argType).(*types.Named); ok &&
			namedOriginsEqual(paramNamed, argNamed) {
			paramArgs := paramNamed.TypeArgs()
			argArgs := argNamed.TypeArgs()
			if paramArgs != nil && argArgs != nil {
				for idx := range min(paramArgs.Len(), argArgs.Len()) {
					o.inferGenericTypeArg(inferred, paramArgs.At(idx), argArgs.At(idx))
				}
			}
		}
	}
	switch param := types.Unalias(paramType).Underlying().(type) {
	case *types.Slice:
		if arg, ok := types.Unalias(argType).Underlying().(*types.Slice); ok {
			o.inferGenericTypeArg(inferred, param.Elem(), arg.Elem())
		}
	case *types.Pointer:
		if arg, ok := types.Unalias(argType).Underlying().(*types.Pointer); ok {
			o.inferGenericTypeArg(inferred, param.Elem(), arg.Elem())
		}
	}
}

func namedOriginsEqual(a, b *types.Named) bool {
	if a == nil || b == nil {
		return false
	}
	aOrigin := a.Origin()
	if aOrigin == nil {
		aOrigin = a
	}
	bOrigin := b.Origin()
	if bOrigin == nil {
		bOrigin = b
	}
	if aOrigin.Obj() == nil || bOrigin.Obj() == nil {
		return aOrigin == bOrigin
	}
	return aOrigin.Obj() == bOrigin.Obj()
}

func (o *LoweringOwner) genericTypeDescriptorExpr(ctx lowerFileContext, typ types.Type) string {
	if typeParam, ok := types.Unalias(typ).(*types.TypeParam); ok && typeParamInScope(ctx, typeParam) {
		return "__typeArgs?.[" + strconv.Quote(typeParam.Obj().Name()) + "] ?? { type: " +
			o.runtimeTypeInfoExpr(typ) + ", zero: () => " + o.lowerZeroValueExprFor(ctx, typ) + " }"
	}
	parts := []string{
		"type: " + o.runtimeTypeInfoExpr(typ),
		"zero: () => " + o.lowerZeroValueExprFor(ctx, typ),
	}
	if methods := o.genericMethodDescriptors(ctx, typ); methods != "" {
		parts = append(parts, "methods: "+methods)
		if signatures := o.genericMethodSignatureDescriptors(typ); signatures != "" &&
			genericTypeDescriptorNeedsMethodSignatures(typ) {
			parts = append(parts, "methodSignatures: "+signatures)
		}
	}
	return "{ " + strings.Join(parts, ", ") + " }"
}

func genericTypeDescriptorNeedsMethodSignatures(typ types.Type) bool {
	named, _ := genericMethodSetDescriptorTarget(typ)
	if named == nil {
		return false
	}
	return namedStructType(named) == nil && !isInterfaceType(named)
}

func (o *LoweringOwner) genericMethodDescriptors(ctx lowerFileContext, typ types.Type) string {
	named, methodSetType := genericMethodSetDescriptorTarget(typ)
	if named == nil {
		return ""
	}
	return o.genericMethodDescriptorsForType(ctx, named, methodSetType)
}

func (o *LoweringOwner) genericMethodDescriptorsForType(
	ctx lowerFileContext,
	named *types.Named,
	methodSetType types.Type,
) string {
	methodSet := types.NewMethodSet(methodSetType)
	methods := make([]string, 0, methodSet.Len())
	for method := range methodSet.Methods() {
		method, _ := method.Obj().(*types.Func)
		if method == nil {
			continue
		}
		if namedStructType(named) != nil || isInterfaceType(named) {
			methods = append(methods, method.Name()+": (receiver: any, ...args: any[]) => receiver."+method.Name()+"(...args)")
			continue
		}
		receiver := "receiver"
		if sig, _ := method.Type().(*types.Signature); sig != nil {
			if recv := sig.Recv(); recv != nil {
				if _, ok := types.Unalias(recv.Type()).Underlying().(*types.Pointer); !ok {
					if _, ok := types.Unalias(methodSetType).Underlying().(*types.Pointer); ok {
						receiver = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + "(receiver)"
					} else {
						receiver = "(" + o.runtimeOwner.QualifiedHelper(RuntimeHelperIsVarRef) +
							"(receiver) ? receiver.value : receiver)"
					}
				}
			}
		}
		methods = append(methods, method.Name()+": (receiver: any, ...args: any[]) => "+
			"("+o.methodFunctionExpr(ctx, named.Origin(), method, method.Name())+" as any)("+receiver+", ...args)")
	}
	if len(methods) == 0 {
		return ""
	}
	return "{" + strings.Join(methods, ", ") + "}"
}

func (o *LoweringOwner) genericMethodSignatureDescriptors(typ types.Type) string {
	_, methodSetType := genericMethodSetDescriptorTarget(typ)
	if methodSetType == nil {
		return ""
	}
	methodSet := types.NewMethodSet(methodSetType)
	methods := make([]string, 0, methodSet.Len())
	for method := range methodSet.Methods() {
		fn, _ := method.Obj().(*types.Func)
		if fn != nil {
			methods = append(methods, o.runtimeMethodSignature(fn, make(map[types.Type]bool)))
		}
	}
	if len(methods) == 0 {
		return ""
	}
	return "[" + strings.Join(methods, ", ") + "]"
}

func genericMethodSetDescriptorTarget(typ types.Type) (*types.Named, types.Type) {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil {
		return namedNonStructMethodSetType(typ)
	}
	return named, named
}

func namedNonStructMethodSetType(typ types.Type) (*types.Named, types.Type) {
	if named := namedNonStructType(typ); named != nil {
		return named, named
	}
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return nil, nil
	}
	named := namedNonStructType(pointer.Elem())
	if named == nil {
		return nil, nil
	}
	return named, typ
}

func methodFunctionName(receiver *types.Named, method string) string {
	if receiver == nil || receiver.Obj() == nil {
		return safeIdentifier(method)
	}
	return safeIdentifier(receiver.Obj().Name()) + "_" + safeIdentifier(method)
}

func methodReceiverNamedType(obj types.Object) *types.Named {
	fn, _ := obj.(*types.Func)
	if fn == nil {
		return nil
	}
	signature, _ := fn.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return nil
	}
	return receiverNamedType(signature.Recv().Type())
}

func (o *LoweringOwner) methodFunctionExpr(
	ctx lowerFileContext,
	receiver *types.Named,
	obj types.Object,
	method string,
) string {
	name := methodFunctionName(receiver, method)
	if alias := ctx.localAliases[obj]; alias != "" {
		return alias + "." + name
	}
	if receiver != nil && receiver.Obj() != nil && receiver.Obj().Pkg() != nil {
		if alias := ctx.importPaths[receiver.Obj().Pkg().Path()]; alias != "" {
			return alias + "." + name
		}
	}
	return name
}

func (o *LoweringOwner) namedTypeExpr(ctx lowerFileContext, named *types.Named) string {
	if named == nil || named.Obj() == nil {
		return "unknown"
	}
	baseName := safeIdentifier(named.Obj().Name())
	if alias := ctx.localAliases[named.Obj()]; alias != "" {
		baseName = alias + "." + baseName
	} else if named.Obj().Pkg() != nil {
		if alias := ctx.importPaths[named.Obj().Pkg().Path()]; alias != "" {
			baseName = alias + "." + baseName
		}
	}
	if args := o.overrideTypeArgsExpr(ctx, named); args != "" {
		return baseName + "<" + args + ">"
	}
	return baseName
}

func (o *LoweringOwner) overrideTypeArgsExpr(ctx lowerFileContext, named *types.Named) string {
	if o.overrideOwner == nil || named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return ""
	}
	args := named.TypeArgs()
	if args == nil || args.Len() == 0 {
		return ""
	}
	if !o.overrideFacts().HasPackage(named.Obj().Pkg().Path()) {
		return ""
	}
	parts := make([]string, 0, args.Len())
	for typ := range args.Types() {
		parts = append(parts, o.tsTypeFor(ctx, typ))
	}
	return strings.Join(parts, ", ")
}

func (o *LoweringOwner) overrideFacts() *OverrideFacts {
	if o.overrideOwner == nil {
		return nil
	}
	facts, diagnostics := o.overrideOwner.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		return nil
	}
	return facts
}

func (o *LoweringOwner) tsReceiverTypeFor(ctx lowerFileContext, typ types.Type) string {
	if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
		if named := namedNonStructType(pointer.Elem()); named != nil {
			return "$.VarRef<" + o.namedTypeExpr(ctx, named) + "> | null"
		}
	}
	return o.tsTypeFor(ctx, typ)
}

func runtimeNamedTypeName(named *types.Named) string {
	if named == nil || named.Obj() == nil {
		return ""
	}
	if named.Obj().Pkg() == nil {
		return named.Obj().Name()
	}
	return named.Obj().Pkg().Name() + "." + named.Obj().Name()
}

func goRuntimeTypeString(typ types.Type) string {
	return types.TypeString(runtimeIdentityType(typ), func(pkg *types.Package) string {
		return pkg.Name()
	})
}

func runtimeIdentityType(typ types.Type) types.Type {
	switch typed := typ.(type) {
	case *types.Alias:
		return runtimeIdentityType(types.Unalias(typed))
	case *types.Pointer:
		return types.NewPointer(runtimeIdentityType(typed.Elem()))
	case *types.Slice:
		return types.NewSlice(runtimeIdentityType(typed.Elem()))
	case *types.Array:
		return types.NewArray(runtimeIdentityType(typed.Elem()), typed.Len())
	case *types.Map:
		return types.NewMap(runtimeIdentityType(typed.Key()), runtimeIdentityType(typed.Elem()))
	case *types.Chan:
		return types.NewChan(typed.Dir(), runtimeIdentityType(typed.Elem()))
	default:
		return typ
	}
}

func basicRuntimeName(basic *types.Basic) string {
	if basic == nil {
		return "unknown"
	}
	switch basic.Kind() {
	case types.Bool:
		return "bool"
	case types.String:
		return "string"
	case types.Int:
		return "int"
	case types.Int8:
		return "int8"
	case types.Int16:
		return "int16"
	case types.Int32:
		return "int32"
	case types.Int64:
		return "int64"
	case types.Uint:
		return "uint"
	case types.Uint8:
		return "uint8"
	case types.Uint16:
		return "uint16"
	case types.Uint32:
		return "uint32"
	case types.Uint64:
		return "uint64"
	case types.Uintptr:
		return "uintptr"
	case types.Float32:
		return "float32"
	case types.Float64:
		return "float64"
	case types.Complex64:
		return "complex64"
	case types.Complex128:
		return "complex128"
	default:
		if basic.Info()&types.IsNumeric != 0 {
			return "int"
		}
		return basic.Name()
	}
}

func loweringUnsupported(kind string, subject string, detail string) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/lowering:unsupported",
		Message:  "unsupported " + kind + " in v2 lowering seed",
		Detail:   subject + ": " + detail,
	}
}
