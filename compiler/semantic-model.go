package compiler

import (
	"cmp"
	"context"
	"go/ast"
	"go/token"
	"go/types"
	"slices"
	"strconv"
	"strings"

	"golang.org/x/tools/go/packages"
)

// SemanticModelOwner owns immutable Go semantic facts used by lowering.
type SemanticModelOwner struct {
	overrideOwner *OverrideRegistryOwner
}

// NewSemanticModelOwner creates the semantic model owner.
func NewSemanticModelOwner(overrideOwners ...*OverrideRegistryOwner) *SemanticModelOwner {
	overrideOwner := NewOverrideRegistryOwner()
	if len(overrideOwners) != 0 && overrideOwners[0] != nil {
		overrideOwner = overrideOwners[0]
	}
	return &SemanticModelOwner{overrideOwner: overrideOwner}
}

// Build constructs semantic facts for a package graph.
func (o *SemanticModelOwner) Build(ctx context.Context, graph *PackageGraph) (*SemanticModel, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if graph == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/semantic:no-graph",
			Message:  "semantic model requires a loaded package graph",
		}}
	}

	model := newSemanticModel()
	var diagnostics []Diagnostic
	for _, node := range graph.Nodes {
		if err := ctx.Err(); err != nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/context:canceled",
				Message:  err.Error(),
			})
			break
		}
		if node.OverrideCandidate {
			continue
		}
		pkg := graph.packagesByPath[node.PkgPath]
		if pkg == nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/semantic:missing-package",
				Message:  "package graph node is missing loaded package data",
				Detail:   node.PkgPath,
			})
			continue
		}
		diagnostics = append(diagnostics, o.buildPackage(model, node, pkg)...)
	}
	if diagnosticsHaveErrors(diagnostics) {
		return model, diagnostics
	}

	o.propagateFunctionAsync(model)
	o.resolveInterfaceImplementations(model)
	o.propagateFunctionAsync(model)
	return model, diagnostics
}

func newSemanticModel() *SemanticModel {
	return &SemanticModel{
		packages:         make(map[string]*semanticPackage),
		addressTaken:     make(map[types.Object]bool),
		needsVarRef:      make(map[types.Object]bool),
		functions:        make(map[*types.Func]*semanticFunction),
		types:            make(map[*types.Named]*semanticType),
		values:           make(map[types.Object]*semanticValue),
		generatedImports: make(map[string]map[string]bool),
	}
}

func (o *SemanticModelOwner) buildPackage(
	model *SemanticModel,
	node *PackageGraphNode,
	pkg *packages.Package,
) []Diagnostic {
	semPkg := &semanticPackage{
		pkgPath:          node.PkgPath,
		name:             node.Name,
		source:           pkg,
		generatedImports: make(map[string]map[string]bool),
	}
	model.packages[node.PkgPath] = semPkg

	for _, file := range pkg.Syntax {
		o.collectFileDeclarations(model, semPkg, pkg, file)
		o.collectFileFacts(model, semPkg, pkg, file)
	}
	var diagnostics []Diagnostic
	for _, file := range pkg.Syntax {
		diagnostics = append(diagnostics, o.collectFunctionFacts(model, pkg, file)...)
	}
	return diagnostics
}

func (o *SemanticModelOwner) collectFileDeclarations(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	file *ast.File,
) {
	for _, importSpec := range file.Imports {
		importPath, err := strconv.Unquote(importSpec.Path.Value)
		if err != nil {
			importPath = importSpec.Path.Value
		}
		var name string
		if importSpec.Name != nil {
			name = importSpec.Name.Name
		}
		position := sourcePos(pkg, importSpec.Pos())
		semPkg.imports = append(semPkg.imports, semanticImport{
			path:     importPath,
			name:     name,
			file:     position.file,
			position: position,
		})
	}

	for _, decl := range file.Decls {
		switch typed := decl.(type) {
		case *ast.GenDecl:
			o.collectGenDecl(model, semPkg, pkg, typed)
		case *ast.FuncDecl:
			fn, _ := pkg.TypesInfo.Defs[typed.Name].(*types.Func)
			if fn == nil {
				continue
			}
			position := sourcePos(pkg, typed.Name.Pos())
			o.addFunction(model, semPkg, fn, position)
			semPkg.declarations = append(semPkg.declarations, semanticDeclaration{
				kind:     "func",
				name:     typed.Name.Name,
				object:   fn,
				position: position,
			})
		}
	}
}

func (o *SemanticModelOwner) collectGenDecl(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	decl *ast.GenDecl,
) {
	for _, spec := range decl.Specs {
		switch typed := spec.(type) {
		case *ast.TypeSpec:
			obj, _ := pkg.TypesInfo.Defs[typed.Name].(*types.TypeName)
			if obj == nil {
				continue
			}
			position := sourcePos(pkg, typed.Name.Pos())
			o.addType(model, semPkg, obj, position, typed.Type)
			semPkg.declarations = append(semPkg.declarations, semanticDeclaration{
				kind:     "type",
				name:     typed.Name.Name,
				object:   obj,
				position: position,
			})
		case *ast.ValueSpec:
			for _, name := range typed.Names {
				obj := pkg.TypesInfo.Defs[name]
				switch concrete := obj.(type) {
				case *types.Var:
					position := sourcePos(pkg, name.Pos())
					o.addValue(model, semPkg, concrete, position, true)
					semPkg.initOrder = append(semPkg.initOrder, concrete)
					semPkg.declarations = append(semPkg.declarations, semanticDeclaration{
						kind:     "var",
						name:     name.Name,
						object:   concrete,
						position: position,
					})
					o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, concrete.Type())
				case *types.Const:
					position := sourcePos(pkg, name.Pos())
					o.addValue(model, semPkg, concrete, position, true)
					semPkg.declarations = append(semPkg.declarations, semanticDeclaration{
						kind:     "const",
						name:     name.Name,
						object:   concrete,
						position: position,
					})
					o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, concrete.Type())
				}
			}
		}
	}
}

func (o *SemanticModelOwner) collectFileFacts(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	file *ast.File,
) {
	ast.Inspect(file, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.Ident:
			o.addDefinedObject(model, semPkg, pkg, typed)
		case *ast.UnaryExpr:
			if typed.Op == token.AND {
				o.recordAddressTaken(model, pkg, typed.X)
			}
		case *ast.SelectorExpr:
			o.recordPointerReceiverUse(model, pkg, typed)
		case *ast.TypeAssertExpr:
			o.recordTypeAssertion(semPkg, pkg, typed)
		case *ast.ValueSpec:
			o.recordValueSpecNilFacts(semPkg, pkg, typed)
		case *ast.AssignStmt:
			o.recordAssignNilFacts(semPkg, pkg, typed)
		case *ast.CallExpr:
			o.recordCallSignatureImports(model, semPkg, pkg, typed)
		}
		return true
	})
}

func (o *SemanticModelOwner) recordCallSignatureImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	expr *ast.CallExpr,
) {
	signature := signatureForType(pkg.TypesInfo.TypeOf(expr.Fun))
	if signature == nil {
		return
	}
	position := sourcePos(pkg, expr.Pos())
	o.recordTupleImports(model, semPkg, position.file, pkg.PkgPath, signature.Params(), make(map[types.Type]bool))
}

func signatureForType(typ types.Type) *types.Signature {
	if typ == nil {
		return nil
	}
	if signature, ok := typ.(*types.Signature); ok {
		return signature
	}
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	return signature
}

func (o *SemanticModelOwner) recordPointerReceiverUse(
	model *SemanticModel,
	pkg *packages.Package,
	expr *ast.SelectorExpr,
) {
	selection := pkg.TypesInfo.Selections[expr]
	if selection == nil || selection.Kind() != types.MethodVal {
		return
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return
	}
	signature, _ := method.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return
	}
	if _, ok := signature.Recv().Type().(*types.Pointer); !ok {
		return
	}
	if _, ok := types.Unalias(pkg.TypesInfo.TypeOf(expr.X)).Underlying().(*types.Pointer); ok {
		return
	}
	obj := objectForAddress(pkg, expr.X)
	if obj == nil {
		return
	}
	model.addressTaken[obj] = true
	model.needsVarRef[obj] = true
}

func (o *SemanticModelOwner) addDefinedObject(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	ident *ast.Ident,
) {
	obj := pkg.TypesInfo.Defs[ident]
	switch typed := obj.(type) {
	case *types.Var:
		position := sourcePos(pkg, ident.Pos())
		o.addValue(model, semPkg, typed, position, false)
		o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, typed.Type())
	case *types.Const:
		position := sourcePos(pkg, ident.Pos())
		o.addValue(model, semPkg, typed, position, false)
		o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, typed.Type())
	case *types.TypeName:
		o.addType(model, semPkg, typed, sourcePos(pkg, ident.Pos()), nil)
	case *types.Func:
		o.addFunction(model, semPkg, typed, sourcePos(pkg, ident.Pos()))
	}
}

func (o *SemanticModelOwner) addType(
	model *SemanticModel,
	semPkg *semanticPackage,
	obj *types.TypeName,
	position sourcePosition,
	typeExpr ast.Expr,
) *semanticType {
	named, _ := obj.Type().(*types.Named)
	if named == nil {
		return nil
	}
	if existing := model.types[named]; existing != nil {
		return existing
	}
	_, isInterface := named.Underlying().(*types.Interface)
	semType := &semanticType{
		name:        obj.Name(),
		named:       named,
		isInterface: isInterface,
		fields:      semanticFields(named, typeExpr),
		position:    position,
	}
	model.types[named] = semType
	semPkg.types = append(semPkg.types, semType)
	if iface, ok := named.Underlying().(*types.Interface); ok {
		iface.Complete()
		for method := range iface.Methods() {
			o.addFunction(model, semPkg, method, sourcePosition{})
		}
	}
	return semType
}

func (o *SemanticModelOwner) addValue(
	model *SemanticModel,
	semPkg *semanticPackage,
	obj types.Object,
	position sourcePosition,
	topLevel bool,
) *semanticValue {
	if obj == nil {
		return nil
	}
	if existing := model.values[obj]; existing != nil {
		if topLevel {
			existing.topLevel = true
		}
		return existing
	}
	value := &semanticValue{
		name:          obj.Name(),
		object:        obj,
		typ:           obj.Type(),
		zeroValueKind: zeroValueKind(obj.Type()),
		position:      position,
		topLevel:      topLevel,
	}
	model.values[obj] = value
	semPkg.values = append(semPkg.values, value)
	return value
}

func (o *SemanticModelOwner) addFunction(
	model *SemanticModel,
	semPkg *semanticPackage,
	fn *types.Func,
	position sourcePosition,
) *semanticFunction {
	if fn == nil {
		return nil
	}
	if existing := model.functions[fn]; existing != nil {
		return existing
	}
	signature, _ := fn.Type().(*types.Signature)
	semFn := &semanticFunction{
		name:      fn.Name(),
		function:  fn,
		signature: signature,
		position:  position,
		calls:     make(map[*types.Func]bool),
	}
	if signature != nil && signature.Recv() != nil {
		recv := signature.Recv().Type()
		if _, ok := recv.(*types.Pointer); ok {
			semFn.receiverPointer = true
		}
		semFn.receiver = receiverNamedType(recv)
	}
	model.functions[fn] = semFn
	semPkg.functions = append(semPkg.functions, semFn)
	return semFn
}

func semanticFields(named *types.Named, typeExpr ast.Expr) []semanticField {
	if named == nil {
		return nil
	}
	structType, _ := named.Underlying().(*types.Struct)
	if structType == nil {
		return nil
	}
	docs := structFieldDocs(typeExpr)
	fields := make([]semanticField, 0, structType.NumFields())
	for i := range structType.NumFields() {
		field := structType.Field(i)
		fields = append(fields, semanticField{
			name:     field.Name(),
			typ:      field.Type(),
			doc:      docs[field.Name()],
			tag:      structType.Tag(i),
			embedded: field.Embedded(),
		})
	}
	return fields
}

func structFieldDocs(typeExpr ast.Expr) map[string]string {
	structType, _ := typeExpr.(*ast.StructType)
	if structType == nil || structType.Fields == nil {
		return nil
	}
	docs := make(map[string]string)
	for _, field := range structType.Fields.List {
		if field.Doc == nil {
			continue
		}
		doc := strings.TrimSpace(field.Doc.Text())
		if doc == "" {
			continue
		}
		for _, name := range field.Names {
			docs[name.Name] = doc
		}
	}
	return docs
}

func (o *SemanticModelOwner) recordAddressTaken(model *SemanticModel, pkg *packages.Package, expr ast.Expr) {
	obj := objectForAddress(pkg, expr)
	if obj == nil {
		return
	}
	model.addressTaken[obj] = true
	model.needsVarRef[obj] = true
}

func objectForAddress(pkg *packages.Package, expr ast.Expr) types.Object {
	switch typed := expr.(type) {
	case *ast.Ident:
		if obj := pkg.TypesInfo.Uses[typed]; obj != nil {
			return obj
		}
		return pkg.TypesInfo.Defs[typed]
	case *ast.SelectorExpr:
		if selection := pkg.TypesInfo.Selections[typed]; selection != nil {
			return selection.Obj()
		}
		return pkg.TypesInfo.Uses[typed.Sel]
	}
	return nil
}

func (o *SemanticModelOwner) collectFunctionFacts(
	model *SemanticModel,
	pkg *packages.Package,
	file *ast.File,
) []Diagnostic {
	var diagnostics []Diagnostic
	for _, decl := range file.Decls {
		fnDecl, ok := decl.(*ast.FuncDecl)
		if !ok || fnDecl.Body == nil {
			continue
		}
		fnObj, _ := pkg.TypesInfo.Defs[fnDecl.Name].(*types.Func)
		semFn := model.functions[fnObj]
		if semFn == nil {
			continue
		}
		ast.Inspect(fnDecl.Body, func(node ast.Node) bool {
			switch typed := node.(type) {
			case *ast.FuncLit:
				return false
			case *ast.SendStmt:
				markFunctionAsync(semFn, "channel-send")
			case *ast.SelectStmt:
				markFunctionAsync(semFn, "select")
			case *ast.UnaryExpr:
				if typed.Op == token.ARROW {
					markFunctionAsync(semFn, "channel-receive")
				}
			case *ast.CallExpr:
				if called := calledFunction(pkg, typed.Fun); called != nil {
					semFn.calls[called] = true
				}
				async, err := o.isOverrideAsyncCall(pkg, typed.Fun)
				if err != nil {
					diagnostics = append(diagnostics, Diagnostic{
						Severity: DiagnosticSeverityError,
						Code:     "goscript/overrides:metadata",
						Message:  "failed to read override metadata",
						Detail:   err.Error(),
					})
					return false
				}
				if async {
					markFunctionAsync(semFn, "override")
				}
			}
			return true
		})
	}
	return diagnostics
}

func (o *SemanticModelOwner) isOverrideAsyncCall(pkg *packages.Package, expr ast.Expr) (bool, error) {
	selector, ok := expr.(*ast.SelectorExpr)
	if !ok {
		return false, nil
	}
	selection := pkg.TypesInfo.Selections[selector]
	if selection == nil {
		return false, nil
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return false, nil
	}
	named := receiverNamedType(selection.Recv())
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return false, nil
	}
	methodKey := named.Obj().Name() + "." + method.Name()
	return o.overrideOwner.IsMethodAsync(named.Obj().Pkg().Path(), methodKey)
}

func calledFunction(pkg *packages.Package, expr ast.Expr) *types.Func {
	switch typed := expr.(type) {
	case *ast.Ident:
		fn, _ := pkg.TypesInfo.Uses[typed].(*types.Func)
		return fn
	case *ast.SelectorExpr:
		if selection := pkg.TypesInfo.Selections[typed]; selection != nil {
			fn, _ := selection.Obj().(*types.Func)
			return fn
		}
		fn, _ := pkg.TypesInfo.Uses[typed.Sel].(*types.Func)
		return fn
	}
	return nil
}

func receiverNamedType(typ types.Type) *types.Named {
	for {
		pointer, ok := typ.(*types.Pointer)
		if !ok {
			break
		}
		typ = pointer.Elem()
	}
	named, _ := typ.(*types.Named)
	return named
}

func (o *SemanticModelOwner) propagateFunctionAsync(model *SemanticModel) {
	changed := true
	for changed {
		changed = false
		for _, semFn := range model.functions {
			for called := range semFn.calls {
				calledFn := model.functions[called]
				if calledFn != nil && calledFn.async {
					if markFunctionAsync(semFn, "call:"+called.FullName()) {
						changed = true
					}
				}
			}
		}
	}
}

func markFunctionAsync(fn *semanticFunction, reason string) bool {
	if fn == nil {
		return false
	}
	changed := !fn.async
	fn.async = true
	if slices.Contains(fn.asyncReasons, reason) {
		return changed
	}
	fn.asyncReasons = append(fn.asyncReasons, reason)
	return true
}

func (o *SemanticModelOwner) resolveInterfaceImplementations(model *SemanticModel) {
	var interfaces []*types.Named
	var concretes []*types.Named
	for named, semType := range model.types {
		if semType.isInterface {
			interfaces = append(interfaces, named)
			continue
		}
		concretes = append(concretes, named)
	}
	sortNamedTypes(interfaces)
	sortNamedTypes(concretes)

	for _, ifaceNamed := range interfaces {
		iface, _ := ifaceNamed.Underlying().(*types.Interface)
		if iface == nil {
			continue
		}
		iface.Complete()
		for _, concrete := range concretes {
			o.addInterfaceImplementation(model, concrete, ifaceNamed, iface, false)
			o.addInterfaceImplementation(model, concrete, ifaceNamed, iface, true)
		}
	}
}

func (o *SemanticModelOwner) addInterfaceImplementation(
	model *SemanticModel,
	concrete *types.Named,
	ifaceNamed *types.Named,
	iface *types.Interface,
	pointer bool,
) {
	var receiver types.Type = concrete
	if pointer {
		receiver = types.NewPointer(concrete)
	}
	if !types.Implements(receiver, iface) {
		return
	}

	implementation := semanticInterfaceImplementation{
		typ:          concrete,
		iface:        ifaceNamed,
		pointer:      pointer,
		asyncMethods: make(map[string]bool),
	}
	for ifaceMethod := range iface.Methods() {
		obj, _, _ := types.LookupFieldOrMethod(receiver, true, concrete.Obj().Pkg(), ifaceMethod.Name())
		implMethod, _ := obj.(*types.Func)
		if implMethod == nil {
			continue
		}
		implFn := model.functions[implMethod]
		if implFn != nil && implFn.async {
			implementation.asyncMethods[ifaceMethod.Name()] = true
			if ifaceFn := model.functions[ifaceMethod]; ifaceFn != nil {
				markFunctionAsync(ifaceFn, "interface-implementation")
			}
		}
	}
	for methodName, async := range implementation.asyncMethods {
		if !async {
			continue
		}
		obj, _, _ := types.LookupFieldOrMethod(receiver, true, concrete.Obj().Pkg(), methodName)
		implMethod, _ := obj.(*types.Func)
		markFunctionAsync(model.functions[implMethod], "interface-method")
	}
	model.interfaceImplementations = append(model.interfaceImplementations, implementation)
}

func sortNamedTypes(named []*types.Named) {
	slices.SortFunc(named, func(a, b *types.Named) int {
		return cmp.Compare(namedTypeKey(a), namedTypeKey(b))
	})
}

func namedTypeKey(named *types.Named) string {
	if named == nil || named.Obj() == nil {
		return ""
	}
	if named.Obj().Pkg() == nil {
		return named.Obj().Name()
	}
	return named.Obj().Pkg().Path() + "." + named.Obj().Name()
}

func (o *SemanticModelOwner) recordTypeAssertion(
	semPkg *semanticPackage,
	pkg *packages.Package,
	expr *ast.TypeAssertExpr,
) {
	if expr.Type == nil {
		return
	}
	semPkg.typeAssertions = append(semPkg.typeAssertions, semanticTypeAssertion{
		position: sourcePos(pkg, expr.Pos()),
		source:   pkg.TypesInfo.TypeOf(expr.X),
		target:   pkg.TypesInfo.TypeOf(expr.Type),
	})
}

func (o *SemanticModelOwner) recordValueSpecNilFacts(
	semPkg *semanticPackage,
	pkg *packages.Package,
	spec *ast.ValueSpec,
) {
	for idx, value := range spec.Values {
		if idx >= len(spec.Names) {
			continue
		}
		obj := pkg.TypesInfo.Defs[spec.Names[idx]]
		if obj == nil {
			continue
		}
		o.recordNilFacts(semPkg, pkg, obj.Type(), value)
	}
}

func (o *SemanticModelOwner) recordAssignNilFacts(
	semPkg *semanticPackage,
	pkg *packages.Package,
	stmt *ast.AssignStmt,
) {
	for idx, rhs := range stmt.Rhs {
		if idx >= len(stmt.Lhs) {
			continue
		}
		targetType := pkg.TypesInfo.TypeOf(stmt.Lhs[idx])
		o.recordNilFacts(semPkg, pkg, targetType, rhs)
	}
}

func (o *SemanticModelOwner) recordNilFacts(
	semPkg *semanticPackage,
	pkg *packages.Package,
	targetType types.Type,
	expr ast.Expr,
) {
	position := sourcePos(pkg, expr.Pos())
	if isNilIdent(expr) {
		if kind := nilFactKind(targetType); kind != "" {
			semPkg.nilFacts = append(semPkg.nilFacts, semanticNilFact{
				position: position,
				kind:     kind,
				typ:      targetType,
			})
		}
		return
	}

	exprType := pkg.TypesInfo.TypeOf(expr)
	if isInterfaceType(targetType) && !isInterfaceType(exprType) && isNilableType(exprType) {
		semPkg.nilFacts = append(semPkg.nilFacts, semanticNilFact{
			position: position,
			kind:     "typed-nil-interface-risk",
			typ:      exprType,
		})
	}
}

func isNilIdent(expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	return ok && ident.Name == "nil"
}

func nilFactKind(typ types.Type) string {
	switch {
	case isInterfaceType(typ):
		return "nil-interface"
	case isNilableType(typ):
		return "typed-nil"
	default:
		return ""
	}
}

func isInterfaceType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Interface)
	return ok
}

func isNonEmptyInterfaceType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	iface, ok := types.Unalias(typ).Underlying().(*types.Interface)
	if !ok {
		return false
	}
	iface.Complete()
	return iface.NumMethods() != 0
}

func isNilableType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	switch types.Unalias(typ).Underlying().(type) {
	case *types.Pointer, *types.Slice, *types.Map, *types.Chan, *types.Signature, *types.Interface:
		return true
	default:
		return false
	}
}

func (o *SemanticModelOwner) recordGeneratedImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	file string,
	currentPkg string,
	typ types.Type,
) {
	if file == "" || typ == nil {
		return
	}
	o.recordTypeImports(model, semPkg, file, currentPkg, typ, make(map[types.Type]bool))
}

func (o *SemanticModelOwner) recordTypeImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	file string,
	currentPkg string,
	typ types.Type,
	seen map[types.Type]bool,
) {
	if typ == nil || seen[typ] {
		return
	}
	seen[typ] = true

	switch typed := types.Unalias(typ).(type) {
	case *types.Named:
		if obj := typed.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() != currentPkg {
			addGeneratedImport(model, semPkg, file, obj.Pkg().Path())
		}
		if args := typed.TypeArgs(); args != nil {
			for t := range args.Types() {
				o.recordTypeImports(model, semPkg, file, currentPkg, t, seen)
			}
		}
	case *types.Pointer:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Slice:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Array:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Map:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Key(), seen)
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Chan:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Signature:
		o.recordTupleImports(model, semPkg, file, currentPkg, typed.Params(), seen)
		o.recordTupleImports(model, semPkg, file, currentPkg, typed.Results(), seen)
	case *types.Struct:
		for field := range typed.Fields() {
			o.recordTypeImports(model, semPkg, file, currentPkg, field.Type(), seen)
		}
	case *types.Interface:
		typed.Complete()
		for method := range typed.Methods() {
			o.recordTypeImports(model, semPkg, file, currentPkg, method.Type(), seen)
		}
		for etyp := range typed.EmbeddedTypes() {
			o.recordTypeImports(model, semPkg, file, currentPkg, etyp, seen)
		}
	}
}

func (o *SemanticModelOwner) recordTupleImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	file string,
	currentPkg string,
	tuple *types.Tuple,
	seen map[types.Type]bool,
) {
	if tuple == nil {
		return
	}
	for v := range tuple.Variables() {
		o.recordTypeImports(model, semPkg, file, currentPkg, v.Type(), seen)
	}
}

func addGeneratedImport(model *SemanticModel, semPkg *semanticPackage, file string, pkgPath string) {
	if model.generatedImports[file] == nil {
		model.generatedImports[file] = make(map[string]bool)
	}
	model.generatedImports[file][pkgPath] = true
	if semPkg.generatedImports[file] == nil {
		semPkg.generatedImports[file] = make(map[string]bool)
	}
	semPkg.generatedImports[file][pkgPath] = true
}

func zeroValueKind(typ types.Type) string {
	if typ == nil {
		return "unknown"
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		switch {
		case typed.Info()&types.IsBoolean != 0:
			return "false"
		case typed.Info()&types.IsString != 0:
			return "\"\""
		case typed.Info()&types.IsNumeric != 0:
			return "0"
		default:
			return "nil"
		}
	case *types.Pointer, *types.Slice, *types.Map, *types.Chan, *types.Signature, *types.Interface:
		return "nil"
	case *types.Array:
		return "array-zero"
	case *types.Struct:
		return "struct-zero"
	default:
		return "unknown"
	}
}

func sourcePos(pkg *packages.Package, pos token.Pos) sourcePosition {
	if pkg == nil || pkg.Fset == nil || !pos.IsValid() {
		return sourcePosition{}
	}
	return sourcePosFromTokenPosition(pkg.Fset.Position(pos))
}

func sourcePosFromTokenPosition(pos token.Position) sourcePosition {
	return sourcePosition{
		file:   pos.Filename,
		line:   pos.Line,
		column: pos.Column,
	}
}
