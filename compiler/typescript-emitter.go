package compiler

import (
	"context"
	"io"
	"os"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
)

// TypeScriptEmitOwner owns deterministic TypeScript file emission.
type TypeScriptEmitOwner struct {
	runtimeOwner *RuntimeContractOwner
}

// NewTypeScriptEmitOwner creates the TypeScript emit owner.
func NewTypeScriptEmitOwner(runtimeOwners ...*RuntimeContractOwner) *TypeScriptEmitOwner {
	runtimeOwner := NewRuntimeContractOwner()
	if len(runtimeOwners) != 0 && runtimeOwners[0] != nil {
		runtimeOwner = runtimeOwners[0]
	}
	return &TypeScriptEmitOwner{runtimeOwner: runtimeOwner}
}

// Emit writes a lowered program to the configured TypeScript output tree.
func (o *TypeScriptEmitOwner) Emit(
	ctx context.Context,
	req *CompileRequest,
	program *LoweredProgram,
) ([]string, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if req == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/emitter:no-request",
			Message:  "TypeScript emission requires a compile request",
		}}
	}
	if program == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/emitter:no-program",
			Message:  "TypeScript emission requires a lowered program",
		}}
	}

	files, diagnostics := o.EmitToMemory(ctx, program)
	if diagnosticsHaveErrors(diagnostics) {
		return nil, diagnostics
	}
	var compiled []string
	for _, pkg := range program.packages {
		if err := ctx.Err(); err != nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/context:canceled",
				Message:  err.Error(),
			})
			break
		}
		pkgDir := filepath.Join(req.OutputPath, "@goscript", filepath.FromSlash(pkg.pkgPath))
		if err := os.MkdirAll(pkgDir, 0o755); err != nil {
			diagnostics = append(diagnostics, emitError("create package output", pkg.pkgPath, err))
			continue
		}
		for _, file := range pkg.files {
			filePath := "@goscript/" + pkg.pkgPath + "/" + file.outputName
			path := filepath.Join(req.OutputPath, filepath.FromSlash(filePath))
			if err := writeFileString(path, files[filePath], 0o644); err != nil {
				diagnostics = append(diagnostics, emitError("write TypeScript file", path, err))
			}
		}
		indexPath := "@goscript/" + pkg.pkgPath + "/index.ts"
		if err := writeFileString(filepath.Join(pkgDir, "index.ts"), files[indexPath], 0o644); err != nil {
			diagnostics = append(diagnostics, emitError("write package index", pkg.pkgPath, err))
			continue
		}
		compiled = append(compiled, pkg.pkgPath)
	}
	return compiled, diagnostics
}

func writeFileString(path string, contents string, perm os.FileMode) error {
	file, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, perm)
	if err != nil {
		return err
	}
	written, writeErr := file.WriteString(contents)
	closeErr := file.Close()
	if writeErr != nil {
		return writeErr
	}
	if written != len(contents) {
		return io.ErrShortWrite
	}
	return closeErr
}

// EmitToMemory renders a lowered program into deterministic slash-path files.
func (o *TypeScriptEmitOwner) EmitToMemory(
	ctx context.Context,
	program *LoweredProgram,
) (map[string]string, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{contextCanceledDiagnostic(err)}
	}
	if program == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/emitter:no-program",
			Message:  "TypeScript emission requires a lowered program",
		}}
	}
	files := make(map[string]string)
	for _, pkg := range program.packages {
		if err := ctx.Err(); err != nil {
			return files, []Diagnostic{contextCanceledDiagnostic(err)}
		}
		for _, file := range pkg.files {
			files["@goscript/"+pkg.pkgPath+"/"+file.outputName] = o.renderLoweredFile(pkg, file)
		}
		files["@goscript/"+pkg.pkgPath+"/index.ts"] = renderIndex(pkg)
	}
	return files, nil
}

func (o *TypeScriptEmitOwner) renderLoweredFile(pkg *loweredPackage, file *loweredFile) string {
	var b strings.Builder
	b.Grow(estimateLoweredFileSize(file))
	if file.sourcePath != "" {
		b.WriteString("// Generated file based on ")
		b.WriteString(filepath.Base(file.sourcePath))
		b.WriteString("\n// Updated when compliance tests are re-run, DO NOT EDIT!\n\n")
	}
	for idx, imp := range file.imports {
		if idx != 0 {
			b.WriteString("\n")
		}
		b.WriteString("import ")
		if imp.typeOnly {
			b.WriteString("type ")
		}
		b.WriteString("* as ")
		b.WriteString(imp.alias)
		b.WriteString(" from \"")
		b.WriteString(imp.source)
		b.WriteString("\"\n")
	}
	sideEffectImports := make(map[string]bool)
	for _, imp := range file.imports {
		if imp.typeOnly || !imp.sideEffect || sideEffectImports[imp.source] {
			continue
		}
		sideEffectImports[imp.source] = true
		b.WriteString("import \"")
		b.WriteString(imp.source)
		b.WriteString("\"\n")
	}
	if len(file.imports) != 0 {
		b.WriteString("\n")
	}
	hasMain := false
	wroteDecl := false
	writeSeparator := func() {
		if wroteDecl {
			b.WriteString("\n")
		}
		wroteDecl = true
	}
	writeDecl := func(decl loweredDecl) {
		if decl.structType != nil {
			writeSeparator()
			renderStruct(&b, decl.structType, o.runtimeOwner)
			return
		}
		if decl.function != nil {
			writeSeparator()
			renderFunction(&b, decl.function)
			if decl.function.name == "main" {
				hasMain = true
			}
			return
		}
		writeSeparator()
		b.WriteString(decl.code)
		b.WriteString("\n")
	}
	for _, decl := range file.decls {
		if decl.typeIndexExport != "" && decl.code != "" {
			writeDecl(decl)
		}
	}
	for _, decl := range sortedStructDecls(file.decls) {
		if decl.structType != nil {
			writeDecl(decl)
		}
	}
	for _, decl := range file.decls {
		if decl.structType != nil || (decl.typeIndexExport != "" && decl.code != "") {
			continue
		}
		writeDecl(decl)
	}
	if pkg.name == "main" && hasMain {
		writeSeparator()
		b.WriteString("if (")
		b.WriteString(o.runtimeOwner.QualifiedHelper(RuntimeHelperIsMainScript))
		b.WriteString("(import.meta)) {\n")
		b.WriteString("\tawait main()\n")
		b.WriteString("}\n")
	}
	return b.String()
}

func estimateLoweredFileSize(file *loweredFile) int {
	if file == nil {
		return 0
	}
	size := 128 + len(file.imports)*96 + len(file.decls)*32
	for _, imp := range file.imports {
		size += len(imp.alias) + len(imp.source)
	}
	for _, decl := range file.decls {
		size += len(decl.code)
		if decl.function != nil {
			size += estimateLoweredFunctionSize(decl.function)
		}
		if decl.structType != nil {
			size += estimateLoweredStructSize(decl.structType)
		}
	}
	return size
}

func estimateLoweredStructSize(structType *loweredStruct) int {
	if structType == nil {
		return 0
	}
	size := 256 + len(structType.name) + len(structType.typeName) + len(structType.fields)*128
	for _, field := range structType.fields {
		size += len(field.name) + len(field.runtimeName) + len(field.typ) + len(field.zero) + len(field.runtimeType) +
			len(field.doc) + len(field.tag)
	}
	for idx := range structType.methods {
		size += estimateLoweredFunctionSize(&structType.methods[idx])
	}
	return size
}

func estimateLoweredFunctionSize(fn *loweredFunction) int {
	if fn == nil {
		return 0
	}
	size := 192 + len(fn.name) + len(fn.result) + len(fn.receiverAlias) + len(fn.receiverType) + len(fn.receiverValue)
	for _, typeParam := range fn.typeParams {
		size += len(typeParam) + 2
	}
	for _, param := range fn.params {
		size += len(param.name) + len(param.typ) + 4
	}
	for _, result := range fn.namedResults {
		size += len(result.name) + len(result.typ) + len(result.zero) + len(result.returnExpr) + 16
	}
	size += estimateLoweredStmtsSize(fn.paramBindings)
	size += estimateLoweredStmtsSize(fn.body)
	return size
}

func estimateLoweredStmtsSize(stmts []loweredStmt) int {
	size := len(stmts) * 24
	for _, stmt := range stmts {
		size += len(stmt.text) + len(stmt.leading)*16
		for _, line := range stmt.leading {
			size += len(line)
		}
		size += estimateLoweredStmtsSize(stmt.children)
		size += estimateLoweredStmtsSize(stmt.elseBody)
		if stmt.rangeFunc != nil {
			size += len(stmt.rangeFunc.value) + len(stmt.rangeFunc.params)*16 + estimateLoweredStmtsSize(stmt.rangeFunc.body)
		}
		if stmt.switchStmt != nil {
			size += len(stmt.switchStmt.value)
			for _, switchCase := range stmt.switchStmt.cases {
				size += len(switchCase.values)*16 + estimateLoweredStmtsSize(switchCase.body)
				for _, value := range switchCase.values {
					size += len(value)
				}
			}
		}
		if stmt.selectStmt != nil {
			size += len(stmt.selectStmt.hasReturn) + len(stmt.selectStmt.value) + len(stmt.selectStmt.result) + len(stmt.selectStmt.resultType)
			for _, selectCase := range stmt.selectStmt.cases {
				size += len(selectCase.channel) + len(selectCase.value) + estimateLoweredStmtsSize(selectCase.prelude) +
					estimateLoweredStmtsSize(selectCase.body)
			}
		}
		if stmt.typeSwitch != nil {
			size += len(stmt.typeSwitch.value) + len(stmt.typeSwitch.varName) + estimateLoweredStmtsSize(stmt.typeSwitch.defaultBody)
			for _, switchCase := range stmt.typeSwitch.cases {
				for _, typ := range switchCase.types {
					size += len(typ)
				}
				for _, typ := range switchCase.tsTypes {
					size += len(typ)
				}
				size += estimateLoweredStmtsSize(switchCase.body)
			}
		}
	}
	return size
}

func sortedStructDecls(decls []loweredDecl) []loweredDecl {
	structs := make([]loweredDecl, 0)
	names := make(map[string]bool)
	for _, decl := range decls {
		if decl.structType == nil {
			continue
		}
		structs = append(structs, decl)
		names[decl.structType.name] = true
	}
	if len(structs) < 2 {
		return structs
	}
	byName := make(map[string]loweredDecl, len(structs))
	for _, decl := range structs {
		byName[decl.structType.name] = decl
	}
	visiting := make(map[string]bool, len(structs))
	visited := make(map[string]bool, len(structs))
	sorted := make([]loweredDecl, 0, len(structs))
	var visit func(loweredDecl)
	visit = func(decl loweredDecl) {
		name := decl.structType.name
		if visited[name] || visiting[name] {
			return
		}
		visiting[name] = true
		for _, dep := range structZeroValueDeps(decl.structType, names) {
			if depDecl, ok := byName[dep]; ok {
				visit(depDecl)
			}
		}
		visiting[name] = false
		visited[name] = true
		sorted = append(sorted, decl)
	}
	for _, decl := range structs {
		visit(decl)
	}
	return sorted
}

func structZeroValueDeps(structType *loweredStruct, names map[string]bool) []string {
	var deps []string
	for _, field := range structType.fields {
		if !field.structValue {
			continue
		}
		for name := range names {
			if name == structType.name {
				continue
			}
			if strings.Contains(field.zero, "new "+name+"(") {
				deps = append(deps, name)
			}
		}
	}
	return deps
}

func renderStruct(b *strings.Builder, structType *loweredStruct, runtimeOwner *RuntimeContractOwner) {
	varRef := runtimeOwner.QualifiedHelper(RuntimeHelperVarRef)
	markStructValue := runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue)
	cloneStructValue := runtimeOwner.QualifiedHelper(RuntimeHelperCloneStructValue)
	cloneArrayValue := runtimeOwner.QualifiedHelper(RuntimeHelperCloneArrayValue)
	registerStructType := runtimeOwner.QualifiedHelper(RuntimeHelperRegisterStructType)
	if structType.exported {
		b.WriteString("export ")
	}
	b.WriteString("class ")
	b.WriteString(structType.name)
	b.WriteString(" {\n")
	for _, field := range structType.fields {
		writeLineComment(b, "\t", field.doc)
		b.WriteString("\tpublic get ")
		b.WriteString(field.name)
		b.WriteString("(): ")
		b.WriteString(field.typ)
		b.WriteString(" {\n\t\treturn this._fields.")
		b.WriteString(field.name)
		b.WriteString(".value\n\t}\n")
		b.WriteString("\tpublic set ")
		b.WriteString(field.name)
		b.WriteString("(value: ")
		b.WriteString(field.typ)
		b.WriteString(") {\n\t\tthis._fields.")
		b.WriteString(field.name)
		b.WriteString(".value = value\n\t}\n\n")
	}
	b.WriteString("\tpublic _fields: {\n")
	for _, field := range structType.fields {
		b.WriteString("\t\t")
		b.WriteString(field.name)
		b.WriteString(": $.VarRef<")
		b.WriteString(field.typ)
		b.WriteString(">\n")
	}
	b.WriteString("\t}\n\n")
	b.WriteString("\tconstructor(init?: Partial<{")
	for idx, field := range structType.fields {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(field.name)
		b.WriteString("?: ")
		b.WriteString(field.typ)
	}
	b.WriteString("}>) {\n\t\tthis._fields = {\n")
	for idx, field := range structType.fields {
		b.WriteString("\t\t\t")
		b.WriteString(field.name)
		b.WriteString(": ")
		b.WriteString(varRef)
		b.WriteString("(")
		if field.structValue {
			b.WriteString("init?.")
			b.WriteString(field.name)
			b.WriteString(" ? ")
			b.WriteString(markStructValue)
			b.WriteString("(")
			b.WriteString(cloneStructValue)
			b.WriteString("(init.")
			b.WriteString(field.name)
			b.WriteString(")) : ")
			b.WriteString(field.zero)
		} else if field.arrayValue {
			b.WriteString("init?.")
			b.WriteString(field.name)
			b.WriteString(" !== undefined ? ")
			b.WriteString(cloneArrayValue)
			b.WriteString("(init.")
			b.WriteString(field.name)
			b.WriteString(") : ")
			b.WriteString(field.zero)
		} else {
			b.WriteString("init?.")
			b.WriteString(field.name)
			b.WriteString(" ?? ")
			b.WriteString(field.zero)
		}
		b.WriteString(")")
		if idx != len(structType.fields)-1 {
			b.WriteString(",")
		}
		b.WriteString("\n")
	}
	b.WriteString("\t\t}\n\t}\n\n")
	b.WriteString("\tpublic ")
	b.WriteString(structType.cloneMethod)
	b.WriteString("(): ")
	b.WriteString(structType.name)
	b.WriteString(" {\n\t\tconst cloned = new ")
	b.WriteString(structType.name)
	b.WriteString("()\n\t\tcloned._fields = {\n")
	for idx, field := range structType.fields {
		b.WriteString("\t\t\t")
		b.WriteString(field.name)
		b.WriteString(": ")
		b.WriteString(varRef)
		b.WriteString("(")
		if field.structValue {
			b.WriteString(markStructValue)
			b.WriteString("(")
			b.WriteString(cloneStructValue)
			b.WriteString("(this._fields.")
			b.WriteString(field.name)
			b.WriteString(".value))")
		} else if field.arrayValue {
			b.WriteString(cloneArrayValue)
			b.WriteString("(this._fields.")
			b.WriteString(field.name)
			b.WriteString(".value)")
		} else {
			b.WriteString("this._fields.")
			b.WriteString(field.name)
			b.WriteString(".value")
		}
		b.WriteString(")")
		if idx != len(structType.fields)-1 {
			b.WriteString(",")
		}
		b.WriteString("\n")
	}
	b.WriteString("\t\t}\n\t\treturn ")
	b.WriteString(markStructValue)
	b.WriteString("(cloned)\n\t}\n")
	for _, method := range structType.methods {
		b.WriteString("\n")
		renderMethod(b, &method)
	}
	b.WriteString("\n\tstatic __typeInfo = ")
	b.WriteString(registerStructType)
	b.WriteString("(\n")
	b.WriteString("\t\t")
	b.WriteString(strconvQuote(structType.typeName))
	b.WriteString(",\n\t\t() => new ")
	b.WriteString(structType.name)
	b.WriteString("(),\n\t\t[")
	for idx, method := range structType.methods {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(runtimeMethodSignatureExpr(method))
	}
	b.WriteString("],\n\t\t")
	b.WriteString(structType.name)
	b.WriteString(",\n\t\t[")
	for idx, field := range structType.fields {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(runtimeStructFieldInfoExpr(
			field.runtimeType,
			field.name,
			field.runtimeName,
			field.tag,
			field.pkgPath,
			field.anonymous,
			field.index,
			field.offset,
			field.exported,
		))
	}
	b.WriteString("]\n\t)\n")
	b.WriteString("}\n")
}

func runtimeMethodSignatureExpr(method loweredFunction) string {
	if method.runtimeSignature != "" {
		return method.runtimeSignature
	}
	methodName := method.name
	if method.runtimeName != "" {
		methodName = method.runtimeName
	}
	return "{ name: " + strconvQuote(methodName) + ", args: [], returns: [] }"
}

func writeLineComment(b *strings.Builder, indent string, comment string) {
	comment = strings.TrimSpace(comment)
	if comment == "" {
		return
	}
	for line := range strings.SplitSeq(comment, "\n") {
		line = strings.TrimRight(line, "\r")
		if strings.TrimSpace(line) == "" {
			b.WriteString(indent)
			b.WriteString("//\n")
			continue
		}
		b.WriteString(indent)
		b.WriteString("// ")
		b.WriteString(line)
		b.WriteString("\n")
	}
}

func renderFunction(b *strings.Builder, fn *loweredFunction) {
	if fn.exported {
		b.WriteString("export ")
	}
	if fn.async {
		b.WriteString("async ")
	}
	b.WriteString("function ")
	b.WriteString(fn.name)
	renderFunctionTypeParams(b, fn)
	b.WriteString("(")
	for idx, param := range fn.params {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(param.name)
		b.WriteString(": ")
		b.WriteString(param.typ)
	}
	b.WriteString("): ")
	b.WriteString(fn.result)
	b.WriteString(" {\n")
	if fn.receiverAlias != "" && fn.receiverAlias != "_" {
		writeIndent(b, 1)
		if fn.receiverMutable {
			b.WriteString("let ")
		} else {
			b.WriteString("const ")
		}
		b.WriteString(fn.receiverAlias)
		if fn.receiverType != "" {
			b.WriteString(": ")
			b.WriteString(fn.receiverType)
		}
		b.WriteString(" = ")
		b.WriteString(receiverValue(fn))
		b.WriteString("\n")
	}
	renderStmts(b, fn.paramBindings, 1)
	renderNamedResults(b, fn.namedResults, 1)
	renderDeferStack(b, fn.deferState, 1)
	renderStmts(b, fn.body, 1)
	renderUnreachableReturn(b, fn, 1)
	b.WriteString("}\n")
}

func renderMethod(b *strings.Builder, fn *loweredFunction) {
	writeIndent(b, 1)
	b.WriteString("public ")
	if fn.async {
		b.WriteString("async ")
	}
	b.WriteString(fn.name)
	renderFunctionTypeParams(b, fn)
	b.WriteString("(")
	for idx, param := range fn.params {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(param.name)
		b.WriteString(": ")
		b.WriteString(param.typ)
	}
	b.WriteString("): ")
	b.WriteString(fn.result)
	b.WriteString(" {\n")
	if fn.receiverAlias != "" && fn.receiverAlias != "_" {
		writeIndent(b, 2)
		if fn.receiverMutable {
			b.WriteString("let ")
		} else {
			b.WriteString("const ")
		}
		b.WriteString(fn.receiverAlias)
		if fn.receiverType != "" {
			b.WriteString(": ")
			b.WriteString(fn.receiverType)
		}
		b.WriteString(" = ")
		b.WriteString(receiverValue(fn))
		b.WriteString("\n")
	}
	renderStmts(b, fn.paramBindings, 2)
	renderNamedResults(b, fn.namedResults, 2)
	renderDeferStack(b, fn.deferState, 2)
	renderStmts(b, fn.body, 2)
	renderUnreachableReturn(b, fn, 2)
	writeIndent(b, 1)
	b.WriteString("}\n")
}

func renderUnreachableReturn(b *strings.Builder, fn *loweredFunction, indent int) {
	if fn.result == "void" || fn.result == "globalThis.Promise<void>" {
		return
	}
	if loweredStmtsEndWithTerminal(fn.body) {
		return
	}
	writeIndent(b, indent)
	b.WriteString("throw new globalThis.Error(\"goscript: unreachable return\")\n")
}

func loweredStmtsEndWithTerminal(stmts []loweredStmt) bool {
	if len(stmts) == 0 {
		return false
	}
	last := stmts[len(stmts)-1]
	text := strings.TrimSpace(last.text)
	return strings.HasPrefix(text, "return") || strings.HasPrefix(text, "throw ")
}

func renderFunctionTypeParams(b *strings.Builder, fn *loweredFunction) {
	if len(fn.typeParams) == 0 {
		return
	}
	b.WriteString("<")
	for idx, typeParam := range fn.typeParams {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(typeParam)
	}
	b.WriteString(">")
}

func receiverValue(fn *loweredFunction) string {
	if fn.receiverValue != "" {
		return fn.receiverValue
	}
	return "this"
}

func renderNamedResults(b *strings.Builder, results []loweredNamedResult, indent int) {
	for _, result := range results {
		writeIndent(b, indent)
		b.WriteString("let ")
		b.WriteString(result.name)
		b.WriteString(": ")
		b.WriteString(result.typ)
		b.WriteString(" = ")
		b.WriteString(result.zero)
		b.WriteString("\n")
	}
}

func renderDeferStack(b *strings.Builder, state *loweredDeferState, indent int) {
	if state == nil || !state.used {
		return
	}
	writeIndent(b, indent)
	if state.async {
		b.WriteString("await using __defer = new $.AsyncDisposableStack()\n")
		return
	}
	b.WriteString("using __defer = new $.DisposableStack()\n")
}

func renderStmts(b *strings.Builder, stmts []loweredStmt, indent int) {
	for idx, stmt := range stmts {
		renderLeadingLines(b, stmt.leading, indent)
		if stmt.rangeFunc != nil {
			renderRangeFunc(b, stmt.rangeFunc, indent)
			continue
		}
		if stmt.switchStmt != nil {
			renderSwitch(b, stmt.switchStmt, indent)
			continue
		}
		if stmt.selectStmt != nil {
			renderSelect(b, stmt.selectStmt, indent)
			continue
		}
		if stmt.typeSwitch != nil {
			renderTypeSwitch(b, stmt.typeSwitch, indent)
			continue
		}
		writeIndent(b, indent)
		if stmt.text == "" && (stmt.hasBlock || len(stmt.children) != 0) {
			b.WriteString("{\n")
			renderStmts(b, stmt.children, indent+1)
			writeIndent(b, indent)
			b.WriteString("}\n")
			continue
		}
		writeIndentedText(b, stmt.text, indent)
		if !stmt.hasBlock && len(stmt.children) == 0 {
			if idx+1 < len(stmts) && needsASIBarrier(stmt, stmts[idx+1]) {
				b.WriteString(";")
			}
			b.WriteString("\n")
			continue
		}
		b.WriteString(" {\n")
		renderStmts(b, stmt.children, indent+1)
		writeIndent(b, indent)
		b.WriteString("}")
		if len(stmt.elseBody) == 0 {
			b.WriteString("\n")
			continue
		}
		b.WriteString(" else {\n")
		renderStmts(b, stmt.elseBody, indent+1)
		writeIndent(b, indent)
		b.WriteString("}\n")
	}
}

func needsASIBarrier(current loweredStmt, next loweredStmt) bool {
	if current.text == "" ||
		current.hasBlock ||
		len(current.children) != 0 ||
		current.rangeFunc != nil ||
		current.switchStmt != nil ||
		current.selectStmt != nil ||
		current.typeSwitch != nil {
		return false
	}
	if strings.HasSuffix(strings.TrimSpace(current.text), ";") {
		return false
	}
	nextText := strings.TrimLeft(next.text, " \t")
	return strings.HasPrefix(nextText, "(") || strings.HasPrefix(nextText, "[")
}

func renderLeadingLines(b *strings.Builder, lines []string, indent int) {
	for _, line := range lines {
		if strings.TrimSpace(line) == "" {
			b.WriteString("\n")
			continue
		}
		writeIndent(b, indent)
		b.WriteString(line)
		b.WriteString("\n")
	}
}

func writeIndentedText(b *strings.Builder, text string, indent int) {
	lines := strings.Split(text, "\n")
	for idx, line := range lines {
		if idx != 0 {
			b.WriteString("\n")
			if line != "" {
				writeIndent(b, indent)
			}
		}
		b.WriteString(line)
	}
}

func renderSwitch(b *strings.Builder, stmt *loweredSwitch, indent int) {
	writeIndent(b, indent)
	b.WriteString("switch (")
	b.WriteString(stmt.value)
	b.WriteString(") {\n")
	for _, switchCase := range stmt.cases {
		if switchCase.defaultCase {
			writeIndent(b, indent+1)
			b.WriteString("default:\n")
		} else {
			for _, value := range switchCase.values {
				writeIndent(b, indent+1)
				b.WriteString("case ")
				b.WriteString(value)
				b.WriteString(":\n")
			}
		}
		renderSwitchBody(b, switchCase.body, switchCase.fallsThrough, indent+1)
	}
	writeIndent(b, indent)
	b.WriteString("}\n")
}

func renderSwitchBody(b *strings.Builder, body []loweredStmt, fallsThrough bool, indent int) {
	writeIndent(b, indent)
	b.WriteString("{\n")
	renderStmts(b, body, indent+1)
	if !fallsThrough {
		writeIndent(b, indent+1)
		b.WriteString("break\n")
	}
	writeIndent(b, indent)
	b.WriteString("}\n")
}

func renderRangeFunc(b *strings.Builder, stmt *loweredRangeFunc, indent int) {
	if stmt.returnBranch != nil {
		writeIndent(b, indent)
		b.WriteString("let ")
		b.WriteString(stmt.returnBranch.hasReturn)
		b.WriteString(" = false\n")
		if stmt.returnBranch.value != "" {
			writeIndent(b, indent)
			b.WriteString("let ")
			b.WriteString(stmt.returnBranch.value)
			b.WriteString(": ")
			b.WriteString(stmt.returnBranch.resultType)
			b.WriteString(" | undefined\n")
		}
	}
	writeIndent(b, indent)
	if stmt.async {
		b.WriteString(";await (async () => {\n")
	} else {
		b.WriteString(";(() => {\n")
	}
	writeIndent(b, indent+1)
	if stmt.async {
		b.WriteString("await ")
	}
	b.WriteString(stmt.value)
	b.WriteString("!(")
	if stmt.async {
		b.WriteString("async ")
	}
	b.WriteString("(")
	b.WriteString(strings.Join(stmt.params, ", "))
	b.WriteString(") => {\n")
	renderStmts(b, stmt.body, indent+2)
	writeIndent(b, indent+2)
	b.WriteString("return true\n")
	writeIndent(b, indent+1)
	b.WriteString("})\n")
	writeIndent(b, indent)
	b.WriteString("})()\n")
	if stmt.returnBranch == nil {
		return
	}
	writeIndent(b, indent)
	b.WriteString("if (")
	b.WriteString(stmt.returnBranch.hasReturn)
	b.WriteString(")")
	if stmt.parentBranch != nil {
		b.WriteString(" {\n")
		writeIndent(b, indent+1)
		b.WriteString(stmt.parentBranch.hasReturn)
		b.WriteString(" = true\n")
		if stmt.parentBranch.value != "" && stmt.returnBranch.value != "" {
			writeIndent(b, indent+1)
			b.WriteString(stmt.parentBranch.value)
			b.WriteString(" = ")
			b.WriteString(stmt.returnBranch.value)
			b.WriteString("!\n")
		}
		writeIndent(b, indent+1)
		b.WriteString("return false\n")
		writeIndent(b, indent)
		b.WriteString("}\n")
		return
	}
	if stmt.returnBranch.value == "" {
		b.WriteString(" {\n")
		writeIndent(b, indent+1)
		b.WriteString("return\n")
		writeIndent(b, indent)
		b.WriteString("}\n")
		return
	}
	b.WriteString(" {\n")
	writeIndent(b, indent+1)
	b.WriteString("return ")
	b.WriteString(stmt.returnBranch.value)
	b.WriteString("!")
	b.WriteString("\n")
	writeIndent(b, indent)
	b.WriteString("}\n")
}

func renderNamedStructConversion(expr *loweredNamedStructConversionExpr) string {
	if expr == nil {
		return "undefined"
	}
	if expr.castOnly {
		return "(" + expr.value.text + " as unknown as " + expr.castTarget + ")"
	}
	fields := make([]string, 0, len(expr.fields))
	for _, field := range expr.fields {
		fields = append(fields, field.name+": "+expr.temp+"."+field.name)
	}
	body := "const " + expr.temp + " = " + expr.value.text + "; return " +
		expr.helper + "(new " + expr.target + "({" + strings.Join(fields, ", ") + "}))"
	if expr.value.async {
		return "(await (async () => { " + body + " })())"
	}
	return "(() => { " + body + " })()"
}

func renderSelect(b *strings.Builder, stmt *loweredSelect, indent int) {
	writeIndent(b, indent)
	b.WriteString("const [")
	b.WriteString(stmt.hasReturn)
	b.WriteString(", ")
	b.WriteString(stmt.value)
	b.WriteString("] = await $.selectStatement<any, ")
	if stmt.external {
		b.WriteString("any")
	} else {
		b.WriteString(stmt.resultType)
	}
	b.WriteString(">([\n")
	for idx, switchCase := range stmt.cases {
		renderSelectCase(b, switchCase, stmt.external, stmt.result, indent+1)
		if idx != len(stmt.cases)-1 {
			b.WriteString(",")
		}
		b.WriteString("\n")
	}
	writeIndent(b, indent)
	b.WriteString("], ")
	hasDefault := "false"
	if stmt.hasDefault {
		hasDefault = "true"
	}
	b.WriteString(hasDefault)
	b.WriteString(")\n")
	if stmt.external {
		renderSelectExternalBodies(b, stmt, indent)
		return
	}
	writeIndent(b, indent)
	b.WriteString("if (")
	b.WriteString(stmt.hasReturn)
	b.WriteString(") {\n")
	writeIndent(b, indent+1)
	b.WriteString("return ")
	b.WriteString(stmt.value)
	b.WriteString("\n")
	writeIndent(b, indent)
	b.WriteString("}\n")
	if stmt.returns {
		writeIndent(b, indent)
		b.WriteString("throw new Error(\"unreachable select\")\n")
	}
}

func renderSelectExternalBodies(b *strings.Builder, stmt *loweredSelect, indent int) {
	writeIndent(b, indent)
	b.WriteString("switch (")
	b.WriteString(stmt.value)
	b.WriteString("?.id) {\n")
	for _, switchCase := range stmt.cases {
		writeIndent(b, indent+1)
		b.WriteString("case ")
		b.WriteString(strconv.Itoa(switchCase.id))
		b.WriteString(":\n")
		writeIndent(b, indent+2)
		b.WriteString("{\n")
		writeIndent(b, indent+3)
		b.WriteString("const ")
		b.WriteString(stmt.result)
		b.WriteString(" = ")
		b.WriteString(stmt.value)
		b.WriteString("\n")
		renderStmts(b, switchCase.prelude, indent+3)
		renderStmts(b, switchCase.body, indent+3)
		writeIndent(b, indent+3)
		b.WriteString("break\n")
		writeIndent(b, indent+2)
		b.WriteString("}\n")
	}
	writeIndent(b, indent)
	b.WriteString("}\n")
	if stmt.returns {
		writeIndent(b, indent)
		b.WriteString("throw new Error(\"unreachable select\")\n")
	}
}

func renderSelectCase(b *strings.Builder, switchCase loweredSelectCase, external bool, resultName string, indent int) {
	writeIndent(b, indent)
	b.WriteString("{\n")
	writeIndent(b, indent+1)
	b.WriteString("id: ")
	b.WriteString(strconv.Itoa(switchCase.id))
	b.WriteString(",\n")
	writeIndent(b, indent+1)
	b.WriteString("isSend: ")
	isSend := "false"
	if switchCase.isSend {
		isSend = "true"
	}
	b.WriteString(isSend)
	b.WriteString(",\n")
	writeIndent(b, indent+1)
	b.WriteString("channel: ")
	b.WriteString(switchCase.channel)
	b.WriteString(",\n")
	if switchCase.isSend {
		writeIndent(b, indent+1)
		b.WriteString("value: ")
		b.WriteString(switchCase.value)
		b.WriteString(",\n")
	}
	writeIndent(b, indent+1)
	b.WriteString("onSelected: async (")
	b.WriteString(resultName)
	b.WriteString(") => {\n")
	if external {
		writeIndent(b, indent+2)
		b.WriteString("return ")
		b.WriteString(resultName)
		b.WriteString("\n")
		writeIndent(b, indent+1)
		b.WriteString("}\n")
		writeIndent(b, indent)
		b.WriteString("}")
		return
	}
	renderStmts(b, switchCase.prelude, indent+2)
	renderSelectCaseStmts(b, switchCase.body, indent+2)
	writeIndent(b, indent+1)
	b.WriteString("}\n")
	writeIndent(b, indent)
	b.WriteString("}")
}

func renderSelectCaseStmts(b *strings.Builder, stmts []loweredStmt, indent int) {
	for idx, stmt := range stmts {
		renderLeadingLines(b, stmt.leading, indent)
		if stmt.rangeFunc != nil {
			renderRangeFunc(b, stmt.rangeFunc, indent)
			continue
		}
		if stmt.switchStmt != nil {
			renderSwitch(b, stmt.switchStmt, indent)
			continue
		}
		if stmt.selectStmt != nil {
			renderSelect(b, stmt.selectStmt, indent)
			continue
		}
		if stmt.typeSwitch != nil {
			renderTypeSwitch(b, stmt.typeSwitch, indent)
			continue
		}
		writeIndent(b, indent)
		if stmt.text == "" && (stmt.hasBlock || len(stmt.children) != 0) {
			b.WriteString("{\n")
			renderSelectCaseStmts(b, stmt.children, indent+1)
			writeIndent(b, indent)
			b.WriteString("}\n")
			continue
		}
		if strings.TrimSpace(stmt.text) == "return" {
			b.WriteString("return $.selectVoidReturn()\n")
			continue
		}
		writeIndentedText(b, stmt.text, indent)
		if !stmt.hasBlock && len(stmt.children) == 0 {
			if idx+1 < len(stmts) && needsASIBarrier(stmt, stmts[idx+1]) {
				b.WriteString(";")
			}
			b.WriteString("\n")
			continue
		}
		b.WriteString(" {\n")
		renderSelectCaseStmts(b, stmt.children, indent+1)
		writeIndent(b, indent)
		b.WriteString("}")
		if len(stmt.elseBody) == 0 {
			b.WriteString("\n")
			continue
		}
		b.WriteString(" else {\n")
		renderSelectCaseStmts(b, stmt.elseBody, indent+1)
		writeIndent(b, indent)
		b.WriteString("}\n")
	}
}

func renderTypeSwitch(b *strings.Builder, stmt *loweredTypeSwitch, indent int) {
	writeIndent(b, indent)
	b.WriteString("{\n")
	writeIndent(b, indent+1)
	b.WriteString("const __goscriptTypeSwitchValue = ")
	b.WriteString(stmt.value)
	b.WriteString("\n")
	writeIndent(b, indent+1)
	b.WriteString("switch (true) {\n")
	for _, switchCase := range stmt.cases {
		renderTypeSwitchCase(b, stmt.varName, stmt.varRef, switchCase, indent+2)
	}
	if len(stmt.defaultBody) != 0 {
		writeIndent(b, indent+2)
		b.WriteString("default:\n")
		renderTypeSwitchInlineBody(b, stmt.varName, stmt.varRef || stmt.defaultRef, "any", "__goscriptTypeSwitchValue", stmt.defaultBody, indent+3)
		writeIndent(b, indent+3)
		b.WriteString("break\n")
	}
	writeIndent(b, indent+1)
	b.WriteString("}\n")
	writeIndent(b, indent)
	b.WriteString("}\n")
}

func renderTypeSwitchCase(b *strings.Builder, varName string, varRef bool, switchCase loweredTypeSwitchCase, indent int) {
	if len(switchCase.types) == 0 {
		return
	}
	writeIndent(b, indent)
	b.WriteString("case ")
	if len(switchCase.types) == 1 {
		b.WriteString("$.typeAssert<")
		b.WriteString(typeSwitchAssertType(switchCase, 0))
		b.WriteString(">(__goscriptTypeSwitchValue, ")
		b.WriteString(switchCase.types[0])
		b.WriteString(").ok")
	} else {
		for idx, typ := range switchCase.types {
			if idx != 0 {
				b.WriteString(" || ")
			}
			b.WriteString("$.is(__goscriptTypeSwitchValue, ")
			b.WriteString(typ)
			b.WriteString(")")
		}
	}
	b.WriteString(":\n")
	value := "__goscriptTypeSwitchValue"
	if len(switchCase.types) == 1 {
		value = "$.typeAssert<" + typeSwitchAssertType(switchCase, 0) +
			">(__goscriptTypeSwitchValue, " + switchCase.types[0] + ").value"
	}
	renderTypeSwitchInlineBody(b, varName, varRef || switchCase.varRef, typeSwitchCaseVariableType(switchCase), value, switchCase.body, indent+1)
	writeIndent(b, indent+1)
	b.WriteString("break\n")
}

func typeSwitchAssertType(switchCase loweredTypeSwitchCase, idx int) string {
	if idx < len(switchCase.tsTypes) && switchCase.tsTypes[idx] != "" {
		return switchCase.tsTypes[idx]
	}
	return "any"
}

func typeSwitchCaseVariableType(switchCase loweredTypeSwitchCase) string {
	if len(switchCase.types) == 1 {
		return typeSwitchAssertType(switchCase, 0)
	}
	return ""
}

func renderTypeSwitchInlineBody(
	b *strings.Builder,
	varName string,
	varRef bool,
	varType string,
	value string,
	body []loweredStmt,
	indent int,
) {
	if varName == "" {
		writeIndent(b, indent)
		b.WriteString("{\n")
		renderStmts(b, body, indent+1)
		writeIndent(b, indent)
		b.WriteString("}\n")
		return
	}
	writeIndent(b, indent)
	b.WriteString("{\n")
	writeIndent(b, indent+1)
	b.WriteString("let ")
	b.WriteString(varName)
	if varRef {
		if varType == "" {
			varType = "any"
		}
		b.WriteString(": $.VarRef<")
		b.WriteString(varType)
		b.WriteString("> = $.varRef(")
		b.WriteString(value)
		b.WriteString(")\n")
		renderStmts(b, body, indent+1)
		writeIndent(b, indent)
		b.WriteString("}\n")
		return
	}
	if varType != "" {
		b.WriteString(": ")
		b.WriteString(varType)
	}
	b.WriteString(" = ")
	b.WriteString(value)
	b.WriteString("\n")
	renderStmts(b, body, indent+1)
	writeIndent(b, indent)
	b.WriteString("}\n")
}

func renderIndex(pkg *loweredPackage) string {
	var lines []string
	for _, file := range pkg.files {
		if file.sideEffect {
			lines = append(lines, "import \"./"+file.outputName+"\"")
		}
		exports := slices.Clone(file.exports)
		slices.Sort(exports)
		if len(exports) != 0 {
			lines = append(lines, "export { "+strings.Join(exports, ", ")+" } from \"./"+file.outputName+"\"")
		}
		typeExports := slices.Clone(file.typeExports)
		slices.Sort(typeExports)
		if len(typeExports) != 0 {
			lines = append(lines, "export type { "+strings.Join(typeExports, ", ")+" } from \"./"+file.outputName+"\"")
		}
	}
	slices.Sort(lines)
	if len(lines) == 0 {
		return ""
	}
	return strings.Join(lines, "\n") + "\n"
}

func writeIndent(b *strings.Builder, indent int) {
	for range indent {
		b.WriteString("\t")
	}
}

func strconvQuote(value string) string {
	return strconv.Quote(value)
}

func emitError(action string, subject string, err error) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/emitter:write",
		Message:  "failed to " + action,
		Detail:   subject + ": " + err.Error(),
	}
}
