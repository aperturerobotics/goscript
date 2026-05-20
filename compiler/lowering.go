package compiler

import (
	"cmp"
	"context"
	"go/ast"
	"go/constant"
	"go/token"
	"go/types"
	"os"
	"path"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
)

// LoweringOwner owns conversion from the semantic model to compiler IR.
type LoweringOwner struct {
	runtimeOwner  *RuntimeContractOwner
	overrideOwner *OverrideRegistryOwner
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
func (o *LoweringOwner) Build(ctx context.Context, model *SemanticModel) (*LoweredProgram, []Diagnostic) {
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

	program := &LoweredProgram{}
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
		loweredPkg, pkgDiagnostics := o.lowerPackage(model, semPkg)
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

func (o *LoweringOwner) lowerPackage(model *SemanticModel, semPkg *semanticPackage) (*loweredPackage, []Diagnostic) {
	loweredPkg := &loweredPackage{
		pkgPath: semPkg.pkgPath,
		name:    semPkg.name,
	}
	var diagnostics []Diagnostic
	for idx, file := range semPkg.source.Syntax {
		sourcePath := sourceFilePath(semPkg, idx, file)
		loweredFile, fileDiagnostics := o.lowerFile(model, semPkg, file, sourcePath)
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
			alias := pkgName.Name()
			if importSpec.Name != nil {
				alias = importSpec.Name.Name
			}
			if alias == "." || alias == "_" {
				continue
			}
			source := "@goscript/" + pkgName.Imported().Path() + "/index.js"
			importKey := alias + "\x00" + source
			if seenImport[importKey] {
				continue
			}
			seenImport[importKey] = true
			importAliases[alias] = pkgName.Imported().Path()
			importPaths[pkgName.Imported().Path()] = alias
			loweredFile.imports = append(loweredFile.imports, loweredImport{
				alias:  alias,
				source: source,
			})
		}
	}
	o.addGeneratedTypeImports(model, semPkg, sourcePath, loweredFile, importAliases, importPaths, seenImport)
	localAliases, localAliasSources := o.localFileAliases(semPkg, file, sourcePath, associatedMethods)
	localImports := make([]loweredImport, 0, len(localAliases))
	seenLocalImport := make(map[string]bool)
	for _, alias := range localAliases {
		if seenLocalImport[alias] {
			continue
		}
		seenLocalImport[alias] = true
		source := localAliasSources[alias]
		localImports = append(localImports, loweredImport{alias: alias, source: source})
	}
	slices.SortFunc(localImports, func(a, b loweredImport) int {
		return cmp.Compare(a.alias, b.alias)
	})
	loweredFile.imports = append(loweredFile.imports, localImports...)

	ctx := lowerFileContext{
		model:         model,
		semPkg:        semPkg,
		file:          file,
		importAliases: importAliases,
		importPaths:   importPaths,
		sourcePath:    sourcePath,
		localAliases:  localAliases,
		tempNames:     newTempNameOwner(),
		topLevel:      true,
	}
	var diagnostics []Diagnostic
	for _, decl := range file.Decls {
		loweredDecls, declDiagnostics := o.lowerDecl(ctx, decl)
		diagnostics = append(diagnostics, declDiagnostics...)
		for _, decl := range loweredDecls {
			loweredFile.decls = append(loweredFile.decls, decl)
			if decl.indexExport != "" {
				loweredFile.exports = append(loweredFile.exports, decl.indexExport)
			}
			if decl.typeIndexExport != "" {
				loweredFile.typeExports = append(loweredFile.typeExports, decl.typeIndexExport)
			}
			if decl.function != nil && decl.function.indexExported && decl.function.name != "main" {
				loweredFile.exports = append(loweredFile.exports, decl.function.name)
			}
			if decl.structType != nil && decl.structType.indexExported {
				loweredFile.exports = append(loweredFile.exports, decl.structType.name)
			}
		}
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
		if !o.hasGeneratedImportPackage(model, pkgPath) {
			continue
		}
		if importPaths[pkgPath] != "" {
			continue
		}
		alias := generatedImportAlias(model, pkgPath)
		alias = uniqueImportAlias(alias, pkgPath, importAliases)
		source := "@goscript/" + pkgPath + "/index.js"
		importKey := alias + "\x00" + source
		if seenImport[importKey] {
			continue
		}
		seenImport[importKey] = true
		importAliases[alias] = pkgPath
		importPaths[pkgPath] = alias
		loweredFile.imports = append(loweredFile.imports, loweredImport{
			alias:  alias,
			source: source,
		})
	}
}

func (o *LoweringOwner) hasGeneratedImportPackage(model *SemanticModel, pkgPath string) bool {
	if model != nil && model.packages[pkgPath] != nil {
		return true
	}
	roots, err := o.overrideOwner.packageRoots()
	return err == nil && roots[pkgPath]
}

func generatedImportAlias(model *SemanticModel, pkgPath string) string {
	if model != nil {
		if semPkg := model.packages[pkgPath]; semPkg != nil && semPkg.name != "" {
			return safeIdentifier(semPkg.name)
		}
	}
	return safeIdentifier(path.Base(pkgPath))
}

func uniqueImportAlias(alias string, pkgPath string, importAliases map[string]string) string {
	if importAliases[alias] == "" || importAliases[alias] == pkgPath {
		return alias
	}
	base := alias
	for idx := 2; ; idx++ {
		candidate := base + strconv.Itoa(idx)
		if importAliases[candidate] == "" || importAliases[candidate] == pkgPath {
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

func (o *LoweringOwner) localFileAliases(
	semPkg *semanticPackage,
	file *ast.File,
	sourcePath string,
	associatedMethods []*ast.FuncDecl,
) (map[types.Object]string, map[string]string) {
	declFiles := make(map[types.Object]string)
	for _, decl := range semPkg.declarations {
		if decl.object == nil || decl.position.file == "" {
			continue
		}
		declFiles[decl.object] = decl.position.file
	}
	outputNames := make(map[string]string)
	for idx, syntax := range semPkg.source.Syntax {
		outputSourcePath := sourceFilePath(semPkg, idx, syntax)
		outputNames[outputSourcePath] = sourceOutputName(outputSourcePath)
	}
	aliases := make(map[types.Object]string)
	aliasSources := make(map[string]string)
	seenTypes := make(map[types.Type]bool)
	var addTypeDeps func(typ types.Type)
	addObject := func(obj types.Object) {
		if obj == nil || obj.Pkg() == nil || obj.Pkg().Path() != semPkg.pkgPath {
			return
		}
		declFile := declFiles[obj]
		if declFile == "" || declFile == sourcePath {
			return
		}
		outputName := outputNames[declFile]
		if outputName == "" {
			return
		}
		alias := "__goscript_" + safeIdentifier(strings.TrimSuffix(outputName, ".gs.ts"))
		aliases[obj] = alias
		aliasSources[alias] = "./" + outputName
		if typeName, ok := obj.(*types.TypeName); ok {
			addTypeDeps(typeName.Type())
		}
	}
	addTypeDeps = func(typ types.Type) {
		if typ == nil || seenTypes[typ] {
			return
		}
		seenTypes[typ] = true
		if named, ok := types.Unalias(typ).(*types.Named); ok {
			addObject(named.Obj())
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
		}
	}
	inspect := func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.Ident:
			addObject(semPkg.source.TypesInfo.Uses[typed])
		case *ast.SelectorExpr:
			if selection := semPkg.source.TypesInfo.Selections[typed]; selection != nil {
				addObject(selection.Obj())
			}
		}
		return true
	}
	ast.Inspect(file, inspect)
	for _, methodDecl := range associatedMethods {
		ast.Inspect(methodDecl, inspect)
	}
	return aliases, aliasSources
}

func safeIdentifier(value string) string {
	var b strings.Builder
	for idx, r := range value {
		valid := r == '_' || r >= 'a' && r <= 'z' || r >= 'A' && r <= 'Z' || idx != 0 && r >= '0' && r <= '9'
		if valid {
			b.WriteRune(r)
			continue
		}
		b.WriteByte('_')
	}
	if b.Len() == 0 {
		return "_"
	}
	identifier := b.String()
	switch identifier {
	case "abstract", "any", "as", "asserts", "async", "await", "boolean", "break", "case",
		"catch", "class", "const", "constructor", "continue", "debugger", "declare", "default",
		"delete", "do", "else", "enum", "export", "extends", "false", "finally", "for",
		"from", "function", "get", "if", "implements", "import", "in", "infer", "instanceof",
		"interface", "is", "keyof", "let", "module", "namespace", "never", "new", "null",
		"number", "object", "of", "package", "private", "protected", "public", "readonly",
		"require", "return", "set", "static", "string", "super", "switch", "symbol", "this",
		"throw", "true", "try", "type", "typeof", "undefined", "unique", "unknown", "var",
		"void", "while", "with", "yield":
		return "_" + identifier
	default:
		return identifier
	}
}

func safeParamName(param *types.Var, idx int) string {
	if param == nil || param.Name() == "" {
		return "_p" + strconv.Itoa(idx)
	}
	return safeIdentifier(param.Name())
}

type lowerFileContext struct {
	model         *SemanticModel
	semPkg        *semanticPackage
	file          *ast.File
	importAliases map[string]string
	importPaths   map[string]string
	sourcePath    string
	localAliases  map[types.Object]string
	tempNames     *tempNameOwner
	signature     *types.Signature
	deferState    *loweredDeferState
	rangeBranch   *loweredRangeBranch
	rangeBreak    bool
	rangeContinue bool
	gotoLabels    map[string]bool
	topLevel      bool
}

type tempNameOwner struct {
	counters map[string]int
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
					return nil, []Diagnostic{loweringUnsupported("function", typed.Name.Name, "missing type information")}
				}
				return []loweredDecl{{function: fn}}, diagnostics
			}
			return nil, nil
		}
		fn, diagnostics := o.lowerFuncDecl(ctx, typed)
		if fn == nil {
			return nil, []Diagnostic{loweringUnsupported("function", typed.Name.Name, "missing type information")}
		}
		return []loweredDecl{{function: fn}}, diagnostics
	default:
		return nil, []Diagnostic{loweringUnsupported("declaration", ctx.semPkg.pkgPath, "unsupported declaration kind")}
	}
}

func (o *LoweringOwner) lowerGenDecl(ctx lowerFileContext, decl *ast.GenDecl) ([]loweredDecl, []Diagnostic) {
	var decls []loweredDecl
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
			for idx, name := range typed.Names {
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
				} else if len(embedPatterns) != 0 {
					embedded, embedDiagnostics := o.lowerGoEmbedValue(ctx, obj.Type(), embedPatterns)
					diagnostics = append(diagnostics, embedDiagnostics...)
					if embedded != "" {
						value = embedded
					}
				}
				if _, ok := obj.(*types.Const); !ok && ctx.model.needsVarRef[obj] {
					value = o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")"
				}
				keyword := "let"
				if _, ok := obj.(*types.Const); ok || decl.Tok == token.CONST {
					keyword = "const"
				}
				code := keyword + " " + o.lowerIdent(ctx, name, true) + ": " + o.tsVariableTypeFor(ctx, obj.Type(), ctx.model.needsVarRef[obj]) + " = " + value
				indexExport := ""
				if ctx.topLevel {
					code = "export " + code
					if ast.IsExported(name.Name) {
						indexExport = name.Name
					}
				}
				decls = append(decls, loweredDecl{code: code, indexExport: indexExport})
			}
		default:
			diagnostics = append(diagnostics, loweringUnsupported("declaration", ctx.semPkg.pkgPath, "unsupported general declaration"))
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
		return strconv.Quote(constant.StringVal(value)), true
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
	typ types.Type,
	patterns []string,
) (string, []Diagnostic) {
	if len(patterns) != 1 {
		return "", []Diagnostic{loweringUnsupported("declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern list")}
	}
	pattern := strings.Trim(patterns[0], "`\"")
	cleanPattern := path.Clean(pattern)
	if pattern == "" ||
		strings.Contains(pattern, "*") ||
		path.IsAbs(pattern) ||
		cleanPattern == "." ||
		cleanPattern == ".." ||
		strings.HasPrefix(cleanPattern, "../") {
		return "", []Diagnostic{loweringUnsupported("declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern")}
	}
	data, err := os.ReadFile(filepath.Join(filepath.Dir(ctx.sourcePath), filepath.FromSlash(cleanPattern)))
	if err != nil {
		return "", []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/lowering:embed",
			Message:  "failed to read go:embed file",
			Detail:   ctx.semPkg.pkgPath + ": " + err.Error(),
		}}
	}
	if isStringType(typ) {
		return strconv.Quote(string(data)), nil
	}
	if slice, ok := types.Unalias(typ).Underlying().(*types.Slice); ok && isByteType(slice.Elem()) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToBytes) + "(" + strconv.Quote(string(data)) + ")", nil
	}
	return "", []Diagnostic{loweringUnsupported("declaration", ctx.semPkg.pkgPath, "unsupported go:embed target type")}
}

func (o *LoweringOwner) lowerTypeSpec(ctx lowerFileContext, spec *ast.TypeSpec) (loweredDecl, []Diagnostic) {
	obj, _ := ctx.semPkg.source.TypesInfo.Defs[spec.Name].(*types.TypeName)
	if obj == nil {
		return loweredDecl{}, nil
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
	code := "type " + semType.name + " = " + o.tsTypeFor(ctx, named.Underlying())
	typeIndexExport := ""
	if ctx.topLevel {
		code = "export " + code
		if ast.IsExported(semType.name) {
			typeIndexExport = semType.name
		}
	}
	return loweredDecl{code: code, typeIndexExport: typeIndexExport}, nil
}

func (o *LoweringOwner) lowerInterfaceType(ctx lowerFileContext, semType *semanticType, iface *types.Interface) loweredDecl {
	iface.Complete()
	code := "type " + semType.name + " = " + o.tsInterfaceType(ctx, iface)
	typeIndexExport := ""
	if ctx.topLevel {
		code = "export " + code
		if ast.IsExported(semType.name) {
			typeIndexExport = semType.name
		}
	}
	code = code + "\n\n" + o.runtimeOwner.QualifiedHelper(RuntimeHelperRegisterInterfaceType) +
		"(\n\t" + strconv.Quote(runtimeNamedTypeName(semType.named)) +
		",\n\tnull,\n\t" + o.runtimeMethodSignatures(iface) + "\n)"
	return loweredDecl{code: code, typeIndexExport: typeIndexExport}
}

func (o *LoweringOwner) tsInterfaceType(ctx lowerFileContext, iface *types.Interface) string {
	if iface.NumMethods() == 0 {
		return "any"
	}
	methods := make([]string, 0, iface.NumMethods())
	for method := range iface.Methods() {
		methods = append(methods, o.tsMethodSignature(ctx, method))
	}
	return "null | {\n\t" + strings.Join(methods, "\n\t") + "\n}"
}

func (o *LoweringOwner) tsMethodSignature(ctx lowerFileContext, method *types.Func) string {
	signature, _ := method.Type().(*types.Signature)
	if signature == nil {
		return method.Name() + "(): unknown"
	}
	async := o.functionAsync(ctx, method)
	return method.Name() + "(" + o.tsSignatureParamsFor(ctx, signature) + "): " +
		asyncResultType(o.tsSignatureResultFor(ctx, signature), async)
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
		exported:      ctx.topLevel,
		indexExported: ctx.topLevel && ast.IsExported(semType.name),
		name:          semType.name,
		typeName:      runtimeNamedTypeName(semType.named),
	}
	for _, field := range semType.fields {
		lowered.fields = append(lowered.fields, loweredStructField{
			name:        field.name,
			typ:         o.tsTypeFor(ctx, field.typ),
			zero:        o.lowerZeroValueExprFor(ctx, field.typ),
			runtimeType: o.runtimeTypeInfoExpr(field.typ),
			doc:         field.doc,
			tag:         field.tag,
			structValue: isStructValueType(field.typ),
		})
	}

	methodDecls := o.methodDeclsForType(ctx, semType.named)
	var diagnostics []Diagnostic
	for _, methodDecl := range methodDecls {
		method, methodDiagnostics := o.lowerFuncDecl(ctx, methodDecl)
		diagnostics = append(diagnostics, methodDiagnostics...)
		if method != nil {
			lowered.methods = append(lowered.methods, *method)
		}
	}
	return lowered, diagnostics
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
	result := o.tsSignatureResultFor(ctx, signature)
	async := ctx.model.functions[fnObj] != nil && ctx.model.functions[fnObj].async
	receiverName := "recv"
	if len(decl.Recv.List) != 0 && len(decl.Recv.List[0].Names) != 0 {
		receiverName = safeIdentifier(decl.Recv.List[0].Names[0].Name)
	}
	deferState := &loweredDeferState{}
	lowered := &loweredFunction{
		exported:      ctx.topLevel,
		indexExported: ctx.topLevel && (ast.IsExported(receiver.Obj().Name()) || ast.IsExported(decl.Name.Name)),
		async:         async,
		name:          methodFunctionName(receiver, decl.Name.Name),
		result:        asyncResultType(result, async),
		deferState:    deferState,
		params: []loweredParam{{
			name: receiverName,
			typ:  o.tsReceiverTypeFor(ctx, signature.Recv().Type()),
		}},
		namedResults: o.lowerNamedResults(ctx, signature),
	}
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		lowered.params = append(lowered.params, loweredParam{
			name: safeParamName(param, idx),
			typ:  o.tsTypeFor(ctx, param.Type()),
		})
	}
	if decl.Body != nil {
		body, diagnostics := o.lowerBlock(ctx.withSignature(signature).withDeferState(deferState), decl.Body)
		lowered.body = body
		if deferState.async && !lowered.async {
			lowered.async = true
			lowered.result = asyncResultType(result, true)
		}
		return lowered, diagnostics
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
	result := o.tsSignatureResultFor(ctx, signature)
	async := ctx.model.functions[fnObj] != nil && ctx.model.functions[fnObj].async
	deferState := &loweredDeferState{}
	lowered := &loweredFunction{
		exported:      ctx.topLevel,
		indexExported: ctx.topLevel && (ast.IsExported(decl.Name.Name) || decl.Name.Name == "main"),
		async:         async,
		name:          decl.Name.Name,
		result:        asyncResultType(result, async),
		deferState:    deferState,
		namedResults:  o.lowerNamedResults(ctx, signature),
	}
	if signature.TypeParams() != nil && signature.TypeParams().Len() != 0 {
		lowered.params = append(lowered.params, loweredParam{
			name: "__typeArgs",
			typ:  "$.GenericTypeArgs | undefined",
		})
	}
	if decl.Recv != nil && len(decl.Recv.List) != 0 && len(decl.Recv.List[0].Names) != 0 {
		receiverName := decl.Recv.List[0].Names[0]
		lowered.receiverAlias = safeIdentifier(receiverName.Name)
		lowered.receiverValue = "this"
		_, receiverPointer := signature.Recv().Type().(*types.Pointer)
		if receiverPointer {
			lowered.receiverType = o.tsReceiverTypeFor(ctx, signature.Recv().Type())
		}
		recvObj := ctx.semPkg.source.TypesInfo.Defs[receiverName]
		if recvObj != nil && ctx.model.needsVarRef[recvObj] {
			lowered.receiverType = ""
			lowered.receiverValue = o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(this)"
		}
	}
	if decl.Name.Name == "main" {
		lowered.async = true
		lowered.result = asyncResultType(result, true)
	}
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		lowered.params = append(lowered.params, loweredParam{
			name: safeParamName(param, idx),
			typ:  o.tsTypeFor(ctx, param.Type()),
		})
	}
	if decl.Body != nil {
		body, diagnostics := o.lowerBlock(ctx.withSignature(signature).withDeferState(deferState), decl.Body)
		lowered.body = body
		if deferState.async && !lowered.async {
			lowered.async = true
			lowered.result = asyncResultType(result, true)
		}
		return lowered, diagnostics
	}
	return lowered, nil
}

func (ctx lowerFileContext) withSignature(signature *types.Signature) lowerFileContext {
	ctx.signature = signature
	return ctx
}

func (ctx lowerFileContext) withDeferState(deferState *loweredDeferState) lowerFileContext {
	ctx.deferState = deferState
	return ctx
}

func (ctx lowerFileContext) withLocalScope() lowerFileContext {
	ctx.topLevel = false
	return ctx
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
	ctx.gotoLabels = labels
	return ctx
}

func (o *LoweringOwner) lowerBlock(ctx lowerFileContext, block *ast.BlockStmt) ([]loweredStmt, []Diagnostic) {
	if block == nil {
		return nil, nil
	}
	return o.lowerStmtListAfter(ctx.withLocalScope(), block.List, sourceLine(ctx, block.Lbrace))
}

func (o *LoweringOwner) lowerStmt(ctx lowerFileContext, stmt ast.Stmt) ([]loweredStmt, []Diagnostic) {
	switch typed := stmt.(type) {
	case *ast.DeclStmt:
		decls, diagnostics := o.lowerDecl(ctx, typed.Decl)
		stmts := make([]loweredStmt, 0, len(decls))
		for _, decl := range decls {
			if decl.code != "" {
				stmts = append(stmts, loweredStmt{text: decl.code})
			}
		}
		return stmts, diagnostics
	case *ast.AssignStmt:
		return o.lowerAssignStmt(ctx, typed)
	case *ast.SendStmt:
		text, diagnostics := o.lowerSendStmt(ctx, typed)
		return []loweredStmt{{text: text}}, diagnostics
	case *ast.GoStmt:
		text, diagnostics := o.lowerGoStmt(ctx, typed)
		return []loweredStmt{{text: text}}, diagnostics
	case *ast.DeferStmt:
		text, diagnostics := o.lowerDeferStmt(ctx, typed)
		return []loweredStmt{{text: text}}, diagnostics
	case *ast.ExprStmt:
		text, diagnostics := o.lowerExpr(ctx, typed.X)
		return []loweredStmt{{text: text}}, diagnostics
	case *ast.ReturnStmt:
		text, diagnostics := o.lowerReturnStmt(ctx, typed)
		return []loweredStmt{{text: text}}, diagnostics
	case *ast.IfStmt:
		var diagnostics []Diagnostic
		var init []loweredStmt
		if typed.Init != nil {
			initStmts, initDiagnostics := o.lowerStmt(ctx, typed.Init)
			diagnostics = append(diagnostics, initDiagnostics...)
			init = append(init, initStmts...)
		}
		cond, condDiagnostics := o.lowerExpr(ctx, typed.Cond)
		diagnostics = append(diagnostics, condDiagnostics...)
		body, bodyDiagnostics := o.lowerBlock(ctx, typed.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		stmt := loweredStmt{
			text:     "if (" + cond + ")",
			children: body,
		}
		if typed.Else != nil {
			elseBody, elseDiagnostics := o.lowerElse(ctx, typed.Else)
			diagnostics = append(diagnostics, elseDiagnostics...)
			stmt.elseBody = elseBody
		}
		if len(init) != 0 {
			init = append(init, stmt)
			return []loweredStmt{{children: init}}, diagnostics
		}
		return []loweredStmt{stmt}, diagnostics
	case *ast.ForStmt:
		lowered, diagnostics := o.lowerForStmt(ctx, typed)
		return []loweredStmt{lowered}, diagnostics
	case *ast.RangeStmt:
		lowered, diagnostics := o.lowerRangeStmt(ctx, typed)
		return []loweredStmt{lowered}, diagnostics
	case *ast.SelectStmt:
		lowered, diagnostics := o.lowerSelectStmt(ctx, typed)
		return []loweredStmt{{selectStmt: lowered}}, diagnostics
	case *ast.SwitchStmt:
		return o.lowerSwitchStmt(ctx, typed)
	case *ast.TypeSwitchStmt:
		return o.lowerTypeSwitchStmt(ctx, typed)
	case *ast.LabeledStmt:
		lowered, diagnostics := o.lowerStmt(ctx, typed.Stmt)
		if len(lowered) != 0 {
			label := safeIdentifier(typed.Label.Name)
			if lowered[0].text == "" {
				return []loweredStmt{{text: label + ":", children: lowered}}, diagnostics
			}
			lowered[0].text = label + ": " + lowered[0].text
		}
		return lowered, diagnostics
	case *ast.IncDecStmt:
		expr, diagnostics := o.lowerExpr(ctx, typed.X)
		return []loweredStmt{{text: expr + typed.Tok.String()}}, diagnostics
	case *ast.BranchStmt:
		if typed.Label != nil {
			switch typed.Tok {
			case token.BREAK, token.CONTINUE:
				return []loweredStmt{{text: typed.Tok.String() + " " + safeIdentifier(typed.Label.Name)}}, nil
			case token.GOTO:
				if ctx.gotoLabels[safeIdentifier(typed.Label.Name)] {
					return []loweredStmt{{text: "continue " + safeIdentifier(typed.Label.Name)}}, nil
				}
				return nil, []Diagnostic{loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported goto branch")}
			default:
				return nil, []Diagnostic{loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported labeled branch")}
			}
		}
		switch typed.Tok {
		case token.BREAK, token.CONTINUE:
			if typed.Tok == token.BREAK && ctx.rangeBranch != nil && ctx.rangeBreak {
				return []loweredStmt{{text: "return false"}}, nil
			}
			if typed.Tok == token.CONTINUE && ctx.rangeBranch != nil && ctx.rangeContinue {
				return []loweredStmt{{text: "return true"}}, nil
			}
			return []loweredStmt{{text: typed.Tok.String()}}, nil
		case token.FALLTHROUGH:
			return []loweredStmt{{text: "fallthrough"}}, nil
		default:
			return nil, []Diagnostic{loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported branch")}
		}
	case *ast.EmptyStmt:
		return nil, nil
	default:
		return nil, []Diagnostic{loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported statement kind")}
	}
}

func (o *LoweringOwner) lowerElse(ctx lowerFileContext, stmt ast.Stmt) ([]loweredStmt, []Diagnostic) {
	switch typed := stmt.(type) {
	case *ast.BlockStmt:
		return o.lowerBlock(ctx, typed)
	case *ast.IfStmt:
		return o.lowerStmt(ctx, typed)
	default:
		return nil, []Diagnostic{loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported else statement")}
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
	gotoSpans := backwardGotoLabelSpans(stmts)
	gotoLabels := make(map[string]bool, len(gotoSpans))
	for label := range gotoSpans {
		gotoLabels[label] = true
	}
	for idx := 0; idx < len(stmts); idx++ {
		stmt := stmts[idx]
		startLine := sourceLine(ctx, stmt.Pos())
		leading := leadingStmtLines(ctx, prevEndLine, startLine)
		if labeled, ok := stmt.(*ast.LabeledStmt); ok {
			label := safeIdentifier(labeled.Label.Name)
			if endIdx, ok := gotoSpans[label]; ok {
				bodyStmts := make([]ast.Stmt, 0, endIdx-idx+1)
				bodyStmts = append(bodyStmts, labeled.Stmt)
				bodyStmts = append(bodyStmts, stmts[idx+1:endIdx+1]...)
				body, bodyDiagnostics := o.lowerStmtListAfter(
					ctx.withGotoLabels(gotoLabels),
					bodyStmts,
					sourceLine(ctx, labeled.Label.End()),
				)
				diagnostics = append(diagnostics, bodyDiagnostics...)
				body = append(body, loweredStmt{text: "break"})
				loop := loweredStmt{text: label + ": while (true)", children: body}
				if len(leading) != 0 {
					loop.leading = append(leading, loop.leading...)
				}
				lowered = append(lowered, loop)
				if endLine := sourceLine(ctx, stmts[endIdx].End()); endLine != 0 {
					prevEndLine = endLine
				}
				idx = endIdx
				continue
			}
		}
		stmtLowered, stmtDiagnostics := o.lowerStmt(ctx, stmt)
		diagnostics = append(diagnostics, stmtDiagnostics...)
		if len(stmtLowered) != 0 && len(leading) != 0 {
			stmtLowered[0].leading = append(leading, stmtLowered[0].leading...)
		}
		lowered = append(lowered, stmtLowered...)
		if endLine := sourceLine(ctx, stmt.End()); endLine != 0 {
			prevEndLine = endLine
		}
	}
	return lowered, diagnostics
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
	return "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanSend) + "(" + channel + ", " + value + ")", diagnostics
}

func (o *LoweringOwner) lowerGoStmt(ctx lowerFileContext, stmt *ast.GoStmt) (string, []Diagnostic) {
	call, diagnostics := o.lowerCallExpr(ctx, stmt.Call)
	return "queueMicrotask(async () => { " + call + " })", diagnostics
}

func (o *LoweringOwner) lowerDeferStmt(ctx lowerFileContext, stmt *ast.DeferStmt) (string, []Diagnostic) {
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
			prefix = "let "
			if !allShortAssignTargetsNew(ctx, stmt.Lhs) || tupleDeclarationNeedsElementStatements(ctx, stmt.Lhs) {
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
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, stmt.Tok == token.DEFINE)
		right, rightDiagnostics := o.lowerExpr(ctx, stmt.Rhs[idx])
		diagnostics = append(diagnostics, leftDiagnostics...)
		diagnostics = append(diagnostics, rightDiagnostics...)
		targetType := ctx.semPkg.source.TypesInfo.TypeOf(lhs)
		right = o.lowerValueForTarget(ctx, stmt.Rhs[idx], targetType, right)
		if index, ok := lhs.(*ast.IndexExpr); ok && isMapType(ctx.semPkg.source.TypesInfo.TypeOf(index.X)) && stmt.Tok == token.ASSIGN {
			mapExpr, mapDiagnostics := o.lowerExpr(ctx, index.X)
			keyExpr, keyDiagnostics := o.lowerExpr(ctx, index.Index)
			diagnostics = append(diagnostics, mapDiagnostics...)
			diagnostics = append(diagnostics, keyDiagnostics...)
			stmts = append(stmts, loweredStmt{text: o.runtimeOwner.QualifiedHelper(RuntimeHelperMapSet) + "(" + mapExpr + ", " + keyExpr + ", " + right + ")"})
			continue
		}
		if star, ok := lhs.(*ast.StarExpr); ok && stmt.Tok == token.ASSIGN && isStructValueType(targetType) {
			pointer, pointerDiagnostics := o.lowerPointerValueExpr(ctx, star.X)
			diagnostics = append(diagnostics, pointerDiagnostics...)
			stmts = append(stmts, loweredStmt{text: o.runtimeOwner.QualifiedHelper(RuntimeHelperAssignStruct) + "(" + pointer + ", " + right + ")"})
			continue
		}
		if star, ok := lhs.(*ast.StarExpr); ok && stmt.Tok == token.ASSIGN {
			pointer, pointerDiagnostics := o.lowerPointerStorageExpr(ctx, star.X)
			diagnostics = append(diagnostics, pointerDiagnostics...)
			stmts = append(stmts, loweredStmt{text: pointer + " = " + right})
			continue
		}
		if stmt.Tok == token.DEFINE {
			if ident, ok := lhs.(*ast.Ident); ok {
				right = o.lowerDeclaredValue(ctx, ident, right)
			}
			stmts = append(stmts, loweredStmt{text: "let " + left + " = " + right})
			continue
		}
		if stmt.Tok == token.AND_NOT_ASSIGN {
			stmts = append(stmts, loweredStmt{text: left + " = " + left + " & ~(" + right + ")"})
			continue
		}
		stmts = append(stmts, loweredStmt{text: left + " " + stmt.Tok.String() + " " + right})
	}
	return stmts, diagnostics
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
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, stmt.Lhs[0], stmt.Tok == token.DEFINE)
		diagnostics = append(diagnostics, leftDiagnostics...)
		prefix := ""
		value := "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecv) + "(" + channel + ")"
		if stmt.Tok == token.DEFINE {
			prefix = "let "
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
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs))
		diagnostics = append(diagnostics, leftDiagnostics...)
		prefix := ""
		value := tempName + fields[idx]
		if stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs) {
			prefix = "let "
			value = o.lowerDeclaredValue(ctx, lhs, value)
		}
		stmts = append(stmts, loweredStmt{text: prefix + left + " = " + value})
	}
	return stmts, diagnostics
}

func (o *LoweringOwner) lowerTupleReassignmentStmt(
	ctx lowerFileContext,
	stmt *ast.AssignStmt,
	right string,
	diagnostics []Diagnostic,
) ([]loweredStmt, []Diagnostic) {
	tempName := ctx.tempName("Tuple")
	stmts := []loweredStmt{{text: "let " + tempName + " = " + right}}
	for idx, lhs := range stmt.Lhs {
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs))
		diagnostics = append(diagnostics, leftDiagnostics...)
		prefix := ""
		value := tempName + "[" + strconv.Itoa(idx) + "]"
		if stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs) {
			prefix = "let "
			value = o.lowerDeclaredValue(ctx, lhs, value)
		}
		stmts = append(stmts, loweredStmt{text: prefix + left + " = " + value})
	}
	return stmts, diagnostics
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
		stmts = append(stmts, loweredStmt{text: "let " + tempPrefix + strconv.Itoa(idx) + " = " + right})
	}
	for idx, lhs := range stmt.Lhs {
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, false)
		diagnostics = append(diagnostics, leftDiagnostics...)
		stmts = append(stmts, loweredStmt{text: left + " = " + tempPrefix + strconv.Itoa(idx)})
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

func tupleDeclarationNeedsElementStatements(ctx lowerFileContext, exprs []ast.Expr) bool {
	for _, expr := range exprs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" {
			continue
		}
		obj := ctx.semPkg.source.TypesInfo.Defs[ident]
		if obj != nil && ctx.model.needsVarRef[obj] {
			return true
		}
	}
	return false
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

func isChannelReceiveExpr(expr ast.Expr) bool {
	receive, ok := expr.(*ast.UnaryExpr)
	return ok && receive.Op == token.ARROW
}

func (o *LoweringOwner) lowerReturnStmt(ctx lowerFileContext, stmt *ast.ReturnStmt) (string, []Diagnostic) {
	if ctx.rangeBranch != nil {
		return o.lowerRangeFuncReturnStmt(ctx, stmt)
	}
	if len(stmt.Results) == 0 {
		if result, ok := o.lowerNamedResultReturn(ctx); ok {
			return "return " + result, nil
		}
		return "return", nil
	}
	if len(stmt.Results) == 1 {
		expr, diagnostics := o.lowerExpr(ctx, stmt.Results[0])
		if returnType := singleReturnType(ctx); returnType != nil {
			expr = o.lowerValueForTarget(ctx, stmt.Results[0], returnType, expr)
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

func (o *LoweringOwner) lowerRangeFuncReturnStmt(ctx lowerFileContext, stmt *ast.ReturnStmt) (string, []Diagnostic) {
	if len(stmt.Results) == 0 {
		if result, ok := o.lowerNamedResultReturn(ctx); ok {
			return ctx.rangeBranch.hasReturn + " = true\n" + ctx.rangeBranch.value + " = " + result + "\nreturn false", nil
		}
		return ctx.rangeBranch.hasReturn + " = true\nreturn false", nil
	}
	if len(stmt.Results) == 1 {
		expr, diagnostics := o.lowerExpr(ctx.withoutRangeBranch(), stmt.Results[0])
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
	results := o.lowerNamedResults(ctx, ctx.signature)
	if len(results) == 0 {
		return "", false
	}
	if len(results) == 1 {
		return results[0].returnExpr, true
	}
	parts := make([]string, 0, len(results))
	for _, result := range results {
		parts = append(parts, result.returnExpr)
	}
	return "[" + strings.Join(parts, ", ") + "]", true
}

func (o *LoweringOwner) lowerForStmt(ctx lowerFileContext, stmt *ast.ForStmt) (loweredStmt, []Diagnostic) {
	if stmt.Init == nil && stmt.Post == nil {
		cond := "true"
		var diagnostics []Diagnostic
		if stmt.Cond != nil {
			var condDiagnostics []Diagnostic
			cond, condDiagnostics = o.lowerExpr(ctx, stmt.Cond)
			diagnostics = append(diagnostics, condDiagnostics...)
		}
		body, bodyDiagnostics := o.lowerBlock(ctx.withoutRangeLoopBranches(), stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		return loweredStmt{
			text:     "while (" + cond + ")",
			children: body,
		}, diagnostics
	}

	init := ""
	var diagnostics []Diagnostic
	if stmt.Init != nil {
		lowered, initDiagnostics := o.lowerStmt(ctx, stmt.Init)
		diagnostics = append(diagnostics, initDiagnostics...)
		if len(lowered) != 0 {
			init = strings.TrimSuffix(lowered[0].text, ";")
		}
	}
	cond := ""
	if stmt.Cond != nil {
		var condDiagnostics []Diagnostic
		cond, condDiagnostics = o.lowerExpr(ctx, stmt.Cond)
		diagnostics = append(diagnostics, condDiagnostics...)
	}
	post := ""
	if stmt.Post != nil {
		lowered, postDiagnostics := o.lowerForPostStmt(ctx, stmt.Post)
		diagnostics = append(diagnostics, postDiagnostics...)
		post = lowered
	}
	body, bodyDiagnostics := o.lowerBlock(ctx.withoutRangeLoopBranches(), stmt.Body)
	diagnostics = append(diagnostics, bodyDiagnostics...)
	return loweredStmt{
		text:     "for (" + init + "; " + cond + "; " + post + ")",
		children: body,
	}, diagnostics
}

func (o *LoweringOwner) lowerForPostStmt(ctx lowerFileContext, stmt ast.Stmt) (string, []Diagnostic) {
	if assign, ok := stmt.(*ast.AssignStmt); ok && assign.Tok == token.ASSIGN && len(assign.Rhs) > 1 && len(assign.Rhs) == len(assign.Lhs) {
		lefts := make([]string, 0, len(assign.Lhs))
		rights := make([]string, 0, len(assign.Rhs))
		var diagnostics []Diagnostic
		for _, lhs := range assign.Lhs {
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, false)
			diagnostics = append(diagnostics, leftDiagnostics...)
			lefts = append(lefts, left)
		}
		for _, rhs := range assign.Rhs {
			right, rightDiagnostics := o.lowerExpr(ctx, rhs)
			diagnostics = append(diagnostics, rightDiagnostics...)
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

	keyName := rangeKeyName(stmt.Key)
	valueName := rangeKeyName(stmt.Value)
	rangeType := ctx.semPkg.source.TypesInfo.TypeOf(stmt.X)
	if isChannelType(rangeType) {
		body, bodyDiagnostics := o.lowerBlock(ctx.withoutRangeLoopBranches(), stmt.Body)
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
			text:     "while (true)",
			children: children,
		}, diagnostics
	}
	if isIntegerRangeType(rangeType) {
		body, bodyDiagnostics := o.lowerBlock(ctx.withoutRangeLoopBranches(), stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		if keyName == "" {
			keyName = "__rangeIndex"
		}
		return loweredStmt{
			text:     "for (let " + keyName + " = 0; " + keyName + " < " + rangeValue + "; " + keyName + "++)",
			children: body,
		}, diagnostics
	}
	if isMapType(rangeType) {
		body, bodyDiagnostics := o.lowerBlock(ctx.withoutRangeLoopBranches(), stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		key := keyName
		if key == "" {
			key = "__rangeKey"
		}
		value := valueName
		if value == "" {
			value = "__rangeValue"
		}
		return loweredStmt{
			text:     "for (const [" + key + ", " + value + "] of " + rangeValue + "?.entries() ?? [])",
			children: body,
		}, diagnostics
	}
	if isStringType(rangeType) {
		body, bodyDiagnostics := o.lowerBlock(ctx.withoutRangeLoopBranches(), stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		key := keyName
		if key == "" {
			key = "__rangeIndex"
		}
		value := valueName
		if value == "" {
			value = "__rangeRune"
		}
		return loweredStmt{
			text:     "for (const [" + key + ", " + value + "] of " + o.runtimeOwner.QualifiedHelper(RuntimeHelperRangeString) + "(" + rangeValue + "))",
			children: body,
		}, diagnostics
	}
	if isFunctionType(rangeType) {
		signature := rangeFunctionSignature(rangeType)
		if signature == nil {
			return loweredStmt{}, append(diagnostics, loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported function range signature"))
		}
		lowered, funcDiagnostics := o.lowerRangeFuncStmt(ctx, stmt, rangeValue, signature)
		diagnostics = append(diagnostics, funcDiagnostics...)
		return lowered, diagnostics
	}

	body, bodyDiagnostics := o.lowerBlock(ctx.withoutRangeLoopBranches(), stmt.Body)
	diagnostics = append(diagnostics, bodyDiagnostics...)
	indexName := keyName
	if indexName == "" {
		indexName = "__rangeIndex"
	}
	children := body
	if valueName != "" {
		indexTarget := lowerIndexTarget(rangeValue, rangeType)
		value := indexTarget + "[" + indexName + "]"
		if stmt.Tok == token.DEFINE {
			value = o.lowerDeclaredValue(ctx, stmt.Value, value)
		}
		children = append([]loweredStmt{{text: "let " + valueName + " = " + value}}, body...)
	}
	return loweredStmt{
		text:     "for (let " + indexName + " = 0; " + indexName + " < " + o.runtimeOwner.QualifiedHelper(RuntimeHelperLen) + "(" + rangeValue + "); " + indexName + "++)",
		children: children,
	}, diagnostics
}

func (o *LoweringOwner) lowerRangeFuncStmt(
	ctx lowerFileContext,
	stmt *ast.RangeStmt,
	rangeValue string,
	signature *types.Signature,
) (loweredStmt, []Diagnostic) {
	yieldSignature, ok := types.Unalias(signature.Params().At(0).Type()).Underlying().(*types.Signature)
	if !ok {
		return loweredStmt{}, []Diagnostic{loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported function range yield signature")}
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

	rangeBranch := &loweredRangeBranch{hasReturn: "__goscriptRangeReturn" + strconv.Itoa(int(stmt.Pos()))}
	if ctx.signature != nil && ctx.signature.Results() != nil && ctx.signature.Results().Len() != 0 {
		rangeBranch.value = "__goscriptRangeReturnValue" + strconv.Itoa(int(stmt.Pos()))
		rangeBranch.resultType = o.tsSignatureResultFor(ctx, ctx.signature)
	}
	body, diagnostics := o.lowerBlock(ctx.withRangeBranch(rangeBranch), stmt.Body)
	if stmt.Tok != token.DEFINE {
		assignments, assignmentDiagnostics := o.lowerRangeFuncAssignments(ctx, stmt, paramNames)
		diagnostics = append(diagnostics, assignmentDiagnostics...)
		body = append(assignments, body...)
	}

	return loweredStmt{rangeFunc: &loweredRangeFunc{
		value:        rangeValue,
		params:       paramNames,
		body:         body,
		returnBranch: rangeBranch,
	}}, diagnostics
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
		resultType: resultType,
	}
	var diagnostics []Diagnostic
	caseID := 0
	for _, raw := range stmt.Body.List {
		clause, ok := raw.(*ast.CommClause)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported select clause"))
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
			channel, prelude, receiveDiagnostics := o.lowerSelectReceiveComm(ctx, nil, comm.X)
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
			channel, prelude, receiveDiagnostics := o.lowerSelectReceiveComm(ctx, comm, nil)
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
			diagnostics = append(diagnostics, loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported select communication"))
		}
	}
	return lowered, diagnostics
}

func (o *LoweringOwner) lowerSelectReceiveComm(
	ctx lowerFileContext,
	assign *ast.AssignStmt,
	expr ast.Expr,
) (string, []loweredStmt, []Diagnostic) {
	receiveExpr := expr
	if assign != nil && len(assign.Rhs) == 1 {
		receiveExpr = assign.Rhs[0]
	}
	receive, ok := receiveExpr.(*ast.UnaryExpr)
	if !ok || receive.Op != token.ARROW {
		return "null", nil, []Diagnostic{loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported select receive")}
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
		prelude = append(prelude, loweredStmt{text: prefix + left + " = result" + fields[idx]})
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
	if stmt.Tag != nil {
		var valueDiagnostics []Diagnostic
		value, valueDiagnostics = o.lowerExpr(ctx, stmt.Tag)
		diagnostics = append(diagnostics, valueDiagnostics...)
	}

	switchIR := &loweredSwitch{value: value}
	for _, raw := range stmt.Body.List {
		clause, ok := raw.(*ast.CaseClause)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported switch clause"))
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
		body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak(), bodyStmts)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		if len(clause.List) == 0 {
			switchIR.defaultBody = body
			continue
		}

		values := make([]string, 0, len(clause.List))
		for _, expr := range clause.List {
			lowered, exprDiagnostics := o.lowerExpr(ctx, expr)
			diagnostics = append(diagnostics, exprDiagnostics...)
			values = append(values, lowered)
		}
		switchIR.cases = append(switchIR.cases, loweredSwitchCase{
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

func (o *LoweringOwner) lowerTypeSwitchStmt(ctx lowerFileContext, stmt *ast.TypeSwitchStmt) ([]loweredStmt, []Diagnostic) {
	var lowered []loweredStmt
	var diagnostics []Diagnostic
	if stmt.Init != nil {
		init, initDiagnostics := o.lowerStmt(ctx, stmt.Init)
		diagnostics = append(diagnostics, initDiagnostics...)
		lowered = append(lowered, init...)
	}

	valueExpr, varName, assignDiagnostics := o.lowerTypeSwitchAssign(ctx, stmt.Assign)
	diagnostics = append(diagnostics, assignDiagnostics...)
	if valueExpr == "" {
		return lowered, append(diagnostics, loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported type switch assignment"))
	}

	switchIR := &loweredTypeSwitch{
		value:   valueExpr,
		varName: varName,
	}
	if ctx.rangeBranch != nil {
		switchIR.result = "__goscriptTypeSwitchResult" + strconv.Itoa(int(stmt.Pos()))
	}
	for _, clauseStmt := range stmt.Body.List {
		clause, ok := clauseStmt.(*ast.CaseClause)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupported("statement", ctx.semPkg.pkgPath, "unsupported type switch clause"))
			continue
		}
		body, bodyDiagnostics := o.lowerStmtList(ctx.withoutRangeBreak(), clause.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		if len(clause.List) == 0 {
			switchIR.defaultBody = body
			continue
		}
		types := make([]string, 0, len(clause.List))
		for _, expr := range clause.List {
			types = append(types, o.runtimeTypeInfoExpr(ctx.semPkg.source.TypesInfo.TypeOf(expr)))
		}
		switchIR.cases = append(switchIR.cases, loweredTypeSwitchCase{
			types: types,
			body:  body,
		})
	}
	lowered = append(lowered, loweredStmt{typeSwitch: switchIR})
	return lowered, diagnostics
}

func (o *LoweringOwner) lowerTypeSwitchAssign(ctx lowerFileContext, stmt ast.Stmt) (string, string, []Diagnostic) {
	switch typed := stmt.(type) {
	case *ast.ExprStmt:
		return o.lowerTypeSwitchGuard(ctx, typed.X, "")
	case *ast.AssignStmt:
		if len(typed.Lhs) != 1 || len(typed.Rhs) != 1 {
			return "", "", nil
		}
		varName := ""
		if ident, ok := typed.Lhs[0].(*ast.Ident); ok && ident.Name != "_" {
			varName = safeIdentifier(ident.Name)
		}
		return o.lowerTypeSwitchGuard(ctx, typed.Rhs[0], varName)
	default:
		return "", "", nil
	}
}

func (o *LoweringOwner) lowerTypeSwitchGuard(ctx lowerFileContext, expr ast.Expr, varName string) (string, string, []Diagnostic) {
	assertion, ok := expr.(*ast.TypeAssertExpr)
	if !ok || assertion.Type != nil {
		return "", "", nil
	}
	value, diagnostics := o.lowerExpr(ctx, assertion.X)
	return value, varName, diagnostics
}

func rangeKeyName(expr ast.Expr) string {
	ident, ok := expr.(*ast.Ident)
	if !ok || ident.Name == "_" {
		return ""
	}
	return safeIdentifier(ident.Name)
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

func (o *LoweringOwner) lowerExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	switch typed := expr.(type) {
	case *ast.BasicLit:
		return lowerBasicLit(typed), nil
	case *ast.Ident:
		return o.lowerIdent(ctx, typed, false), nil
	case *ast.BinaryExpr:
		if value := ctx.semPkg.source.TypesInfo.Types[typed].Value; value != nil {
			if constantValue, ok := lowerLargeIntegerConstantValue(value); ok {
				return constantValue, nil
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
			return typed.Op.String() + value, diagnostics
		}
		if typed.Op == token.XOR {
			return "~" + value, diagnostics
		}
		return value, append(diagnostics, loweringUnsupported("expression", ctx.semPkg.pkgPath, "unsupported unary operator"))
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
		return "undefined", []Diagnostic{loweringUnsupported("expression", ctx.semPkg.pkgPath, "unsupported expression kind")}
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
		return strconv.Quote(value)
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
	body, diagnostics := o.lowerBlock(ctx.withSignature(signature).withDeferState(deferState).withoutRangeBranch(), lit.Body)
	var rendered strings.Builder
	renderDeferStack(&rendered, deferState, 1)
	renderStmts(&rendered, body, 1)
	async := stmtsContainAwait(body) || deferState.async
	prefix := ""
	if async {
		prefix = "async "
	}
	function := prefix + "(" + o.tsSignatureParamsFor(ctx, signature) + "): " +
		asyncResultType(o.tsSignatureResultFor(ctx, signature), async) + " => {\n" +
		rendered.String() + "}"
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFunctionValue) +
		"(" + function + ", " + o.runtimeFunctionTypeInfo(signature, "") + ")", async, diagnostics
}

func stmtsContainAwait(stmts []loweredStmt) bool {
	for _, stmt := range stmts {
		if strings.Contains(stmt.text, "await ") ||
			stmtsContainAwait(stmt.children) ||
			stmtsContainAwait(stmt.elseBody) {
			return true
		}
		if stmt.selectStmt != nil {
			for _, switchCase := range stmt.selectStmt.cases {
				if stmtsContainAwait(switchCase.prelude) || stmtsContainAwait(switchCase.body) {
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
	if raw || ident.Name == "nil" || ident.Name == "true" || ident.Name == "false" {
		return value
	}
	obj := objectForIdent(ctx, ident)
	if alias := ctx.localAliases[obj]; alias != "" {
		return alias + "." + value
	}
	if obj != nil && ctx.model.needsVarRef[obj] {
		return value + ".value"
	}
	return value
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
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperAppend) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "cap":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperCap) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "clear":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperClear) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "copy":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperCopy) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "delete":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperDeleteMapEntry) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "len":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperLen) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "max":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperMax) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "min":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperMin) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "panic":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperPanic) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "recover":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperRecover) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "close":
				if len(args) != 1 {
					return "undefined", append(diagnostics, loweringUnsupported("call", ctx.semPkg.pkgPath, "close requires one argument"))
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
				methodArgs := append([]string{"__typeArgs", strconv.Quote(typeParam.Obj().Name()), strconv.Quote(fun.Sel.Name), receiverExpr}, args...)
				call := o.runtimeOwner.QualifiedHelper(RuntimeHelperCallGenericMethod) + "(" + strings.Join(methodArgs, ", ") + ")"
				return o.awaitCallIfNeeded(ctx, fun, call), diagnostics
			}
			receiver := receiverNamedType(selection.Recv())
			if namedNonInterfaceNonStructType(receiver) {
				return o.lowerNamedReceiverMethodCall(ctx, fun, args, diagnostics)
			}
			receiverExpr, receiverDiagnostics := o.lowerMethodReceiverExpr(ctx, fun.X, selection)
			diagnostics = append(diagnostics, receiverDiagnostics...)
			call := receiverExpr + "." + fun.Sel.Name + "(" + strings.Join(args, ", ") + ")"
			return o.awaitCallIfNeeded(ctx, fun, call), diagnostics
		}
		selector, selectorDiagnostics := o.lowerSelectorExpr(ctx, fun)
		call := o.lowerCallableExpr(ctx, fun, selector) + "(" + strings.Join(args, ", ") + ")"
		return o.awaitCallIfNeeded(ctx, fun, call), append(diagnostics, selectorDiagnostics...)
	case *ast.IndexExpr:
		if signature, _ := ctx.semPkg.source.TypesInfo.TypeOf(fun).(*types.Signature); signature != nil {
			callee, calleeDiagnostics := o.lowerExpr(ctx, fun.X)
			args = append([]string{o.genericTypeArgsExpr(ctx, fun.X, []ast.Expr{fun.Index})}, args...)
			call := o.lowerCallableExpr(ctx, fun.X, callee) + "(" + strings.Join(args, ", ") + ")"
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
		return callee + "(" + strings.Join(args, ", ") + ")", append(diagnostics, calleeDiagnostics...)
	case *ast.FuncLit:
		callee, async, calleeDiagnostics := o.lowerFuncLit(ctx, fun)
		call := "(" + callee + ")(" + strings.Join(args, ", ") + ")"
		if async {
			call = "await " + call
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
		return "undefined", append(diagnostics, loweringUnsupported("call", ctx.semPkg.pkgPath, "unsupported call target"))
	}
	return "undefined", append(diagnostics, loweringUnsupported("call", ctx.semPkg.pkgPath, "unsupported call target"))
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
	if overrideCall && isNonEmptyInterfaceType(targetType) && isInterfaceType(sourceType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + "(" + value + ")"
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
	return o.overrideOwner.hasPackage(fn.Pkg().Path())
}

func (o *LoweringOwner) lowerMakeExpr(ctx lowerFileContext, expr *ast.CallExpr) (string, []Diagnostic) {
	if len(expr.Args) < 1 {
		return "undefined", []Diagnostic{loweringUnsupported("call", ctx.semPkg.pkgPath, "make requires a type argument")}
	}
	targetType := typeFromExpr(ctx, expr.Args[0])
	if targetType == nil {
		return "undefined", []Diagnostic{loweringUnsupported("call", ctx.semPkg.pkgPath, "make requires a type expression")}
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
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMakeSlice) +
			"<" + o.tsTypeFor(ctx, typed.Elem()) + ">(" + strings.Join(args, ", ") + ")", diagnostics
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
		return "undefined", []Diagnostic{loweringUnsupported("call", ctx.semPkg.pkgPath, "unsupported make type")}
	}
}

func (o *LoweringOwner) lowerNewExpr(ctx lowerFileContext, expr *ast.CallExpr) (string, []Diagnostic) {
	if len(expr.Args) != 1 {
		return "undefined", []Diagnostic{loweringUnsupported("call", ctx.semPkg.pkgPath, "new requires one type argument")}
	}
	typ := typeFromExpr(ctx, expr.Args[0])
	if named := namedStructType(typ); named != nil {
		return "new " + o.namedTypeExpr(ctx, named) + "()", nil
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + o.lowerZeroValueExprFor(ctx, typ) + ")", nil
}

func (o *LoweringOwner) lowerConversionExpr(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	targetType types.Type,
) (string, []Diagnostic) {
	if len(expr.Args) != 1 {
		return "undefined", []Diagnostic{loweringUnsupported("call", ctx.semPkg.pkgPath, "unsupported conversion arity")}
	}
	value, diagnostics := o.lowerExpr(ctx, expr.Args[0])
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0])
	if isNilExpr(expr.Args[0]) && isPointerType(targetType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperTypedNil) +
			"(" + strconv.Quote(goRuntimeTypeString(targetType)) + ")", diagnostics
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
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToBytes) + "(" + value + ")", diagnostics
	}
	if named := namedFunctionType(targetType); named != nil {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperNamedFunction) +
			"(" + value + ", " + strconv.Quote(runtimeNamedTypeName(named)) + ")", diagnostics
	}
	if named := namedNonStructType(targetType); named != nil {
		return value, diagnostics
	}
	if isNumericType(targetType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) + "(" + value + ")", diagnostics
	}
	return value, diagnostics
}

func (o *LoweringOwner) lowerNamedReceiverMethodCall(
	ctx lowerFileContext,
	selector *ast.SelectorExpr,
	args []string,
	diagnostics []Diagnostic,
) (string, []Diagnostic) {
	selection := ctx.semPkg.source.TypesInfo.Selections[selector]
	receiver := receiverNamedType(selection.Recv())
	receiverExpr, receiverDiagnostics := o.lowerNamedReceiverForMethod(ctx, selector.X, selection)
	diagnostics = append(diagnostics, receiverDiagnostics...)
	allArgs := append([]string{receiverExpr}, args...)
	call := o.methodFunctionExpr(ctx, receiver, selection.Obj(), selector.Sel.Name) + "(" + strings.Join(allArgs, ", ") + ")"
	return o.awaitCallIfNeeded(ctx, selector, call), diagnostics
}

func (o *LoweringOwner) lowerNamedReceiverForMethod(
	ctx lowerFileContext,
	expr ast.Expr,
	selection *types.Selection,
) (string, []Diagnostic) {
	method, _ := selection.Obj().(*types.Func)
	receiverPointer := false
	if method != nil {
		signature, _ := method.Type().(*types.Signature)
		if signature != nil && signature.Recv() != nil {
			_, receiverPointer = signature.Recv().Type().(*types.Pointer)
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
	return o.lowerExpr(ctx, expr)
}

func (o *LoweringOwner) lowerSelectorExpr(ctx lowerFileContext, expr *ast.SelectorExpr) (string, []Diagnostic) {
	if ident, ok := expr.X.(*ast.Ident); ok {
		if _, ok := ctx.importAliases[ident.Name]; ok {
			return ident.Name + "." + expr.Sel.Name, nil
		}
	}
	if selection := ctx.semPkg.source.TypesInfo.Selections[expr]; selection != nil {
		switch selection.Kind() {
		case types.MethodVal:
			if receiver := receiverNamedType(selection.Recv()); namedNonInterfaceNonStructType(receiver) {
				receiverExpr, diagnostics := o.lowerNamedReceiverForMethod(ctx, expr.X, selection)
				methodExpr := o.methodFunctionExpr(ctx, receiver, selection.Obj(), expr.Sel.Name)
				return o.lowerMethodValueClosure(ctx, selection, receiverExpr, methodExpr, true), diagnostics
			}
			receiver, diagnostics := o.lowerMethodReceiverExpr(ctx, expr.X, selection)
			return o.lowerMethodValueClosure(ctx, selection, receiver, "__receiver."+expr.Sel.Name, false), diagnostics
		case types.FieldVal:
			receiver, diagnostics := o.lowerFieldReceiverExpr(ctx, expr.X)
			return receiver + "." + expr.Sel.Name, diagnostics
		}
	}
	left, diagnostics := o.lowerExpr(ctx, expr.X)
	return left + "." + expr.Sel.Name, diagnostics
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

func (o *LoweringOwner) lowerFieldReceiverExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if isPointerToStructType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
		return o.lowerPointerValueExpr(ctx, expr)
	}
	return o.lowerExpr(ctx, expr)
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
	}
	if receiverPointer {
		return receiver, diagnostics
	}
	if isStructValueType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) ||
		isPointerToStructType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
		return o.lowerStructClone(receiver), diagnostics
	}
	if isInterfaceType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + "(" + receiver + ")", diagnostics
	}
	return receiver, diagnostics
}

func (o *LoweringOwner) lowerAssignmentTarget(
	ctx lowerFileContext,
	expr ast.Expr,
	declare bool,
) (string, []Diagnostic) {
	switch typed := expr.(type) {
	case *ast.Ident:
		if declare {
			return o.lowerIdent(ctx, typed, true), nil
		}
		return o.lowerIdent(ctx, typed, false), nil
	case *ast.StarExpr:
		return o.lowerPointerValueExpr(ctx, typed.X)
	default:
		return o.lowerExpr(ctx, expr)
	}
}

func (o *LoweringOwner) lowerAddressExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	switch typed := expr.(type) {
	case *ast.Ident:
		return o.lowerIdent(ctx, typed, true), nil
	case *ast.CompositeLit:
		return o.lowerCompositeLit(ctx, typed, false)
	case *ast.SelectorExpr:
		receiver, diagnostics := o.lowerFieldReceiverExpr(ctx, typed.X)
		return receiver + "._fields." + typed.Sel.Name, diagnostics
	case *ast.IndexExpr:
		return o.lowerIndexAddressExpr(ctx, typed)
	default:
		return "undefined", []Diagnostic{loweringUnsupported("expression", ctx.semPkg.pkgPath, "unsupported address expression")}
	}
}

func (o *LoweringOwner) lowerIndexAddressExpr(ctx lowerFileContext, expr *ast.IndexExpr) (string, []Diagnostic) {
	target, targetDiagnostics := o.lowerExpr(ctx, expr.X)
	index, indexDiagnostics := o.lowerExpr(ctx, expr.Index)
	diagnostics := append(targetDiagnostics, indexDiagnostics...)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	if isStringType(targetType) || isMapType(targetType) {
		return "undefined", append(diagnostics, loweringUnsupported("expression", ctx.semPkg.pkgPath, "unsupported address expression"))
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexRef) + "(" + lowerIndexTarget(target, targetType) + ", " + index + ")", diagnostics
}

func (o *LoweringOwner) lowerPointerValueExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if value, diagnostics, ok := o.lowerUnsafeStringPointerValue(ctx, expr); ok {
		return value, diagnostics
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

func (o *LoweringOwner) lowerPointerStorageExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	base, diagnostics := o.lowerExpr(ctx, expr)
	return base + "!.value", diagnostics
}

func (o *LoweringOwner) lowerIndexExpr(ctx lowerFileContext, expr *ast.IndexExpr) (string, []Diagnostic) {
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
		return lowerIndexTarget(target, targetType) + "[" + index + "]", diagnostics
	}
}

func lowerIndexTarget(target string, typ types.Type) string {
	if isNilableType(typ) {
		return target + "!"
	}
	return target
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
	if isStringType(ctx.semPkg.source.TypesInfo.TypeOf(expr.X)) {
		helper = RuntimeHelperSliceStringOrBytes
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
	position := sourcePos(ctx.semPkg.source, lit.Pos())
	detail := "unsupported composite literal"
	if position.file != "" {
		detail += " at " + filepath.Base(position.file) + ":" + strconv.Itoa(position.line)
	}
	if typ := ctx.semPkg.source.TypesInfo.TypeOf(lit); typ != nil {
		detail += " of type " + typ.String()
	}
	return "undefined", []Diagnostic{loweringUnsupported("expression", ctx.semPkg.pkgPath, detail)}
}

func (o *LoweringOwner) lowerStructCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	named *types.Named,
	markStruct bool,
) (string, []Diagnostic) {
	structType, _ := named.Underlying().(*types.Struct)
	fields := make([]string, 0, len(lit.Elts))
	var diagnostics []Diagnostic
	for idx, elt := range lit.Elts {
		fieldName := ""
		fieldType := types.Type(nil)
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			if ident, ok := keyed.Key.(*ast.Ident); ok {
				fieldName = ident.Name
				if field := fieldByName(structType, fieldName); field != nil {
					fieldType = field.Type()
				}
			}
		} else if idx < structType.NumFields() {
			field := structType.Field(idx)
			fieldName = field.Name()
			fieldType = field.Type()
		}
		if fieldName == "" {
			diagnostics = append(diagnostics, loweringUnsupported("expression", ctx.semPkg.pkgPath, "unsupported struct literal field"))
			continue
		}
		value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = o.lowerValueForTarget(ctx, valueExpr, fieldType, value)
		fields = append(fields, fieldName+": "+value)
	}

	expr := "new " + o.namedTypeExpr(ctx, named) + "()"
	if len(fields) != 0 {
		expr = "new " + o.namedTypeExpr(ctx, named) + "({" + strings.Join(fields, ", ") + "})"
	}
	if markStruct {
		expr = o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(" + expr + ")"
	}
	return expr, diagnostics
}

func (o *LoweringOwner) lowerAnonymousStructCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	structType *types.Struct,
) (string, []Diagnostic) {
	fields := make([]string, 0, len(lit.Elts))
	var diagnostics []Diagnostic
	for idx, elt := range lit.Elts {
		fieldName := ""
		fieldType := types.Type(nil)
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			if ident, ok := keyed.Key.(*ast.Ident); ok {
				fieldName = ident.Name
				if field := fieldByName(structType, fieldName); field != nil {
					fieldType = field.Type()
				}
			}
		}
		if fieldName == "" && idx < structType.NumFields() {
			field := structType.Field(idx)
			fieldName = field.Name()
			fieldType = field.Type()
		}
		if fieldName == "" {
			diagnostics = append(diagnostics, loweringUnsupported("expression", ctx.semPkg.pkgPath, "unsupported anonymous struct literal field"))
			continue
		}
		value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = o.lowerValueForTarget(ctx, valueExpr, fieldType, value)
		fields = append(fields, fieldName+": "+value)
	}
	return "{" + strings.Join(fields, ", ") + "}", diagnostics
}

func (o *LoweringOwner) lowerArrayCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	array *types.Array,
) (string, []Diagnostic) {
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
		"<" + o.tsTypeFor(ctx, slice.Elem()) + ">([" + strings.Join(values, ", ") + "])", diagnostics
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
			diagnostics = append(diagnostics, loweringUnsupported("expression", ctx.semPkg.pkgPath, "unsupported map literal entry"))
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
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperMustTypeAssert) +
		"<" + o.tsTypeFor(ctx, ctx.semPkg.source.TypesInfo.TypeOf(expr.Type)) + ">(" +
		value + ", " + o.runtimeTypeInfoExpr(ctx.semPkg.source.TypesInfo.TypeOf(expr.Type)) + ")", diagnostics
}

func (o *LoweringOwner) lowerTupleExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	switch typed := expr.(type) {
	case *ast.TypeAssertExpr:
		value, diagnostics := o.lowerExpr(ctx, typed.X)
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeAssertTuple) +
			"<" + o.tsTypeFor(ctx, ctx.semPkg.source.TypesInfo.TypeOf(typed.Type)) + ">(" +
			value + ", " + o.runtimeTypeInfoExpr(ctx.semPkg.source.TypesInfo.TypeOf(typed.Type)) + ")", diagnostics
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
	if isInterfaceType(targetType) && isStructValueType(sourceType) {
		return o.lowerStructClone(value)
	}
	if isBuiltinErrorType(targetType) {
		if wrapper := o.lowerPrimitiveErrorWrapper(ctx, sourceType, value); wrapper != "" {
			return wrapper
		}
	}
	if isInterfaceType(targetType) && !isInterfaceType(sourceType) && isNilableType(sourceType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperInterfaceValue) +
			"<" + o.tsTypeFor(ctx, targetType) + ">(" + value + ", " + strconv.Quote(goRuntimeTypeString(sourceType)) + ")"
	}
	if isStructValueType(targetType) && shouldCloneStructValue(expr) {
		return o.lowerStructClone(value)
	}
	return value
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
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperWrapPrimitiveError) +
		"(" + value + ", " + o.methodFunctionExpr(ctx, named, fn, "Error") + ")"
}

func (o *LoweringOwner) lowerStructClone(value string) string {
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(" + value + ".clone())"
}

func (o *LoweringOwner) lowerZeroValueExpr(typ types.Type) string {
	if named := namedStructType(typ); named != nil && isStructValueType(typ) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(new " + named.Obj().Name() + "())"
	}
	return zeroValueExpr(typ)
}

func (o *LoweringOwner) lowerZeroValueExprFor(ctx lowerFileContext, typ types.Type) string {
	if named := namedStructType(typ); named != nil && isStructValueType(typ) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(new " + o.namedTypeExpr(ctx, named) + "())"
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
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
		return "Array.from({ length: " + strconv.FormatInt(typed.Len(), 10) + " }, () => " + o.lowerZeroValueExprFor(ctx, typed.Elem()) + ")"
	case *types.Struct:
		return "{}"
	default:
		return "null"
	}
}

func (o *LoweringOwner) lowerDeclarationZeroValueExpr(ctx lowerFileContext, typ types.Type) string {
	typeParam, ok := types.Unalias(typ).(*types.TypeParam)
	if !ok {
		return o.lowerZeroValueExprFor(ctx, typ)
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericZero) +
		"(__typeArgs, " + strconv.Quote(typeParam.Obj().Name()) + ", " + zeroValueExpr(typ) + ")"
}

func (o *LoweringOwner) runtimeTypeInfoExpr(typ types.Type) string {
	return o.runtimeTypeInfoExprWithSeen(typ, make(map[types.Type]bool))
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
		return strconv.Quote(runtimeNamedTypeName(named))
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		switch {
		case typed.Info()&types.IsBoolean != 0:
			return "{ kind: " + typeKind + ".Basic, name: \"bool\" }"
		case typed.Info()&types.IsString != 0:
			return "{ kind: " + typeKind + ".Basic, name: \"string\" }"
		case typed.Info()&types.IsNumeric != 0:
			return "{ kind: " + typeKind + ".Basic, name: \"" + basicRuntimeName(typed) + "\" }"
		default:
			return "{ kind: " + typeKind + ".Basic, name: \"unknown\" }"
		}
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
		return "{ kind: " + typeKind + ".Struct, methods: [], fields: {} }"
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
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fieldInfo := runtimeStructFieldInfoExpr(
			o.runtimeTypeInfoExprWithSeen(field.Type(), seen),
			structType.Tag(idx),
		)
		fields = append(fields, strconv.Quote(field.Name())+": "+fieldInfo)
	}
	return "{" + strings.Join(fields, ", ") + "}"
}

func runtimeStructFieldInfoExpr(runtimeType string, tag string) string {
	if tag == "" {
		return runtimeType
	}
	return "{ type: " + runtimeType + ", tag: " + strconv.Quote(tag) + " }"
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
	return "{ " + strings.Join(parts, ", ") + " }"
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

func fieldByName(structType *types.Struct, name string) *types.Var {
	for field := range structType.Fields() {
		if field.Name() == name {
			return field
		}
	}
	return nil
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

func tsType(typ types.Type) string {
	if typ == nil {
		return "unknown"
	}
	if isBuiltinErrorType(typ) {
		return "$.GoError"
	}
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if _, ok := named.Underlying().(*types.Interface); ok {
			return named.Obj().Name() + " | null"
		}
		if _, ok := named.Underlying().(*types.Struct); ok {
			return named.Obj().Name()
		}
		return named.Obj().Name()
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		if typed.Kind() == types.UntypedNil {
			return "null"
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
	case *types.Struct:
		return tsAnonymousStructType(typed)
	case *types.Array:
		return tsType(typed.Elem()) + "[]"
	case *types.Slice:
		return "$.Slice<" + tsType(typed.Elem()) + ">"
	case *types.Map:
		return "Map<" + tsType(typed.Key()) + ", " + tsType(typed.Elem()) + "> | null"
	case *types.Chan:
		return "$.Channel<" + tsType(typed.Elem()) + "> | null"
	case *types.Pointer:
		if named := namedNonStructType(typed.Elem()); named != nil {
			return "$.VarRef<" + named.Obj().Name() + "> | null"
		}
		if named := namedStructType(typed.Elem()); named != nil {
			return named.Obj().Name() + " | $.VarRef<" + named.Obj().Name() + "> | null"
		}
		return "$.VarRef<" + tsType(typed.Elem()) + "> | null"
	case *types.Interface:
		return "any"
	case *types.Signature:
		return "(" + tsSignatureParams(typed) + ") => " + tsSignatureResult(typed)
	default:
		return "unknown"
	}
}

func tsSignatureParams(signature *types.Signature) string {
	if signature == nil || signature.Params() == nil || signature.Params().Len() == 0 {
		return ""
	}
	params := make([]string, 0, signature.Params().Len())
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		params = append(params, safeParamName(param, idx)+": "+tsType(param.Type()))
	}
	return strings.Join(params, ", ")
}

func tsAnonymousStructType(structType *types.Struct) string {
	fields := make([]string, 0, structType.NumFields())
	for field := range structType.Fields() {
		fields = append(fields, strconv.Quote(field.Name())+": "+tsType(field.Type()))
	}
	return "{" + strings.Join(fields, ", ") + "}"
}

func tsSignatureResult(signature *types.Signature) string {
	if signature == nil || signature.Results() == nil || signature.Results().Len() == 0 {
		return "void"
	}
	if signature.Results().Len() == 1 {
		return tsType(signature.Results().At(0).Type())
	}
	results := make([]string, 0, signature.Results().Len())
	for result := range signature.Results().Variables() {
		results = append(results, tsType(result.Type()))
	}
	return "[" + strings.Join(results, ", ") + "]"
}

func (o *LoweringOwner) tsSignatureParamsFor(ctx lowerFileContext, signature *types.Signature) string {
	if signature == nil || signature.Params() == nil || signature.Params().Len() == 0 {
		return ""
	}
	params := make([]string, 0, signature.Params().Len())
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		params = append(params, safeParamName(param, idx)+": "+o.tsTypeFor(ctx, param.Type()))
	}
	return strings.Join(params, ", ")
}

func (o *LoweringOwner) tsSignatureResultFor(ctx lowerFileContext, signature *types.Signature) string {
	if signature == nil || signature.Results() == nil || signature.Results().Len() == 0 {
		return "void"
	}
	if signature.Results().Len() == 1 {
		return o.tsTypeFor(ctx, signature.Results().At(0).Type())
	}
	results := make([]string, 0, signature.Results().Len())
	for result := range signature.Results().Variables() {
		results = append(results, o.tsTypeFor(ctx, result.Type()))
	}
	return "[" + strings.Join(results, ", ") + "]"
}

func asyncResultType(result string, async bool) string {
	if !async {
		return result
	}
	return "Promise<" + result + ">"
}

func (o *LoweringOwner) tsVariableTypeFor(ctx lowerFileContext, typ types.Type, needsVarRef bool) string {
	valueType := o.tsTypeFor(ctx, typ)
	if needsVarRef {
		return "$.VarRef<" + valueType + ">"
	}
	return valueType
}

func (o *LoweringOwner) tsTypeFor(ctx lowerFileContext, typ types.Type) string {
	if typ == nil {
		return "unknown"
	}
	if isBuiltinErrorType(typ) {
		return "$.GoError"
	}
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		name := o.namedTypeExpr(ctx, named)
		if _, ok := named.Underlying().(*types.Interface); ok {
			return name + " | null"
		}
		return name
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Array:
		return o.tsTypeFor(ctx, typed.Elem()) + "[]"
	case *types.Slice:
		return "$.Slice<" + o.tsTypeFor(ctx, typed.Elem()) + ">"
	case *types.Map:
		return "Map<" + o.tsTypeFor(ctx, typed.Key()) + ", " + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
	case *types.Chan:
		return "$.Channel<" + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
	case *types.Struct:
		return o.tsAnonymousStructTypeFor(ctx, typed)
	case *types.Pointer:
		if named := namedNonStructType(typed.Elem()); named != nil {
			return "$.VarRef<" + o.namedTypeExpr(ctx, named) + "> | null"
		}
		if named := namedStructType(typed.Elem()); named != nil {
			name := o.namedTypeExpr(ctx, named)
			return name + " | $.VarRef<" + name + "> | null"
		}
		return "$.VarRef<" + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
	case *types.Signature:
		return "((" + o.tsSignatureParamsFor(ctx, typed) + ") => " + o.tsSignatureResultFor(ctx, typed) + ") | null"
	default:
		return tsType(typ)
	}
}

func (o *LoweringOwner) tsAnonymousStructTypeFor(ctx lowerFileContext, structType *types.Struct) string {
	fields := make([]string, 0, structType.NumFields())
	for field := range structType.Fields() {
		fields = append(fields, strconv.Quote(field.Name())+": "+o.tsTypeFor(ctx, field.Type()))
	}
	return "{" + strings.Join(fields, ", ") + "}"
}

func zeroValueExpr(typ types.Type) string {
	if typ == nil {
		return "undefined"
	}
	if named := namedStructType(typ); named != nil && isStructValueType(typ) {
		return "new " + named.Obj().Name() + "()"
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
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
		return "Array.from({ length: " + strconv.FormatInt(typed.Len(), 10) + " }, () => " + zeroValueExpr(typed.Elem()) + ")"
	case *types.Struct:
		return "{}"
	default:
		return "null"
	}
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

func isPointerToStructType(typ types.Type) bool {
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return false
	}
	return namedStructType(pointer.Elem()) != nil
}

func isMapType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Map)
	return ok
}

func isChannelType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Chan)
	return ok
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

func (o *LoweringOwner) functionAsync(ctx lowerFileContext, fn *types.Func) bool {
	if fn == nil || ctx.model == nil {
		return false
	}
	semFn := ctx.model.functions[fn]
	return semFn != nil && semFn.async
}

func (o *LoweringOwner) callNeedsAwait(ctx lowerFileContext, fun ast.Expr) bool {
	for {
		switch typed := fun.(type) {
		case *ast.IndexExpr:
			fun = typed.X
		case *ast.IndexListExpr:
			fun = typed.X
		default:
			if ctx.semPkg == nil || ctx.semPkg.source == nil {
				return false
			}
			return o.functionAsync(ctx, calledFunction(ctx.semPkg.source, fun)) ||
				o.overrideCallNeedsAwait(ctx, fun)
		}
	}
}

func (o *LoweringOwner) overrideCallNeedsAwait(ctx lowerFileContext, fun ast.Expr) bool {
	if o.overrideOwner == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
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
	named := receiverNamedType(selection.Recv())
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return false
	}
	async, err := o.overrideOwner.IsMethodAsync(
		named.Obj().Pkg().Path(),
		named.Obj().Name()+"."+method.Name(),
	)
	return err == nil && async
}

func (o *LoweringOwner) awaitCallIfNeeded(ctx lowerFileContext, fun ast.Expr, call string) string {
	if o.callNeedsAwait(ctx, fun) {
		return "await " + call
	}
	return call
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
		entries = append(entries, typeParams.At(idx).Obj().Name()+": "+o.genericTypeDescriptorExpr(typ))
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
		entries = append(entries, typeParam.Obj().Name()+": "+o.genericTypeDescriptorExpr(typ))
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

func (o *LoweringOwner) genericTypeDescriptorExpr(typ types.Type) string {
	parts := []string{
		"type: " + o.runtimeTypeInfoExpr(typ),
		"zero: () => " + zeroValueExpr(typ),
	}
	if methods := o.genericMethodDescriptors(typ); methods != "" {
		parts = append(parts, "methods: "+methods)
	}
	return "{ " + strings.Join(parts, ", ") + " }"
}

func (o *LoweringOwner) genericMethodDescriptors(typ types.Type) string {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil {
		return ""
	}
	methodSet := types.NewMethodSet(named)
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
		methods = append(methods, method.Name()+": "+methodFunctionName(named.Origin(), method.Name()))
	}
	if len(methods) == 0 {
		return ""
	}
	return "{" + strings.Join(methods, ", ") + "}"
}

func methodFunctionName(receiver *types.Named, method string) string {
	if receiver == nil || receiver.Obj() == nil {
		return method
	}
	return receiver.Obj().Name() + "_" + method
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
	baseName := named.Obj().Name()
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
	if !o.overrideOwner.hasPackage(named.Obj().Pkg().Path()) {
		return ""
	}
	parts := make([]string, 0, args.Len())
	for typ := range args.Types() {
		parts = append(parts, o.tsTypeFor(ctx, typ))
	}
	return strings.Join(parts, ", ")
}

func (o *LoweringOwner) tsReceiverTypeFor(ctx lowerFileContext, typ types.Type) string {
	if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
		if named := namedNonStructType(pointer.Elem()); named != nil {
			return "$.VarRef<" + o.namedTypeExpr(ctx, named) + ">"
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
	return types.TypeString(typ, func(pkg *types.Package) string {
		return pkg.Name()
	})
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
