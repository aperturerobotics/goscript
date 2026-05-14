package compiler

import (
	"context"
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

	var compiled []string
	var diagnostics []Diagnostic
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
			path := filepath.Join(pkgDir, file.outputName)
			if err := os.WriteFile(path, []byte(o.renderLoweredFile(pkg, file)), 0o644); err != nil {
				diagnostics = append(diagnostics, emitError("write TypeScript file", path, err))
			}
		}
		if err := os.WriteFile(filepath.Join(pkgDir, "index.ts"), []byte(renderIndex(pkg)), 0o644); err != nil {
			diagnostics = append(diagnostics, emitError("write package index", pkg.pkgPath, err))
			continue
		}
		compiled = append(compiled, pkg.pkgPath)
	}
	return compiled, diagnostics
}

func (o *TypeScriptEmitOwner) renderLoweredFile(pkg *loweredPackage, file *loweredFile) string {
	var b strings.Builder
	if file.sourcePath != "" {
		b.WriteString("// Generated file based on ")
		b.WriteString(filepath.Base(file.sourcePath))
		b.WriteString("\n// Updated when compliance tests are re-run, DO NOT EDIT!\n\n")
	}
	for idx, imp := range file.imports {
		if idx != 0 {
			b.WriteString("\n")
		}
		b.WriteString("import * as ")
		b.WriteString(imp.alias)
		b.WriteString(" from \"")
		b.WriteString(imp.source)
		b.WriteString("\"\n")
	}
	if len(file.imports) != 0 {
		b.WriteString("\n")
	}
	for idx, decl := range file.decls {
		if idx != 0 {
			b.WriteString("\n")
		}
		if decl.structType != nil {
			renderStruct(&b, decl.structType, o.runtimeOwner)
			continue
		}
		if decl.function != nil {
			renderFunction(&b, decl.function)
			if pkg.name == "main" && decl.function.name == "main" {
				b.WriteString("\n\nif (")
				b.WriteString(o.runtimeOwner.QualifiedHelper(RuntimeHelperIsMainScript))
				b.WriteString("(import.meta)) {\n")
				b.WriteString("\tawait main()\n")
				b.WriteString("}\n")
			}
			continue
		}
		b.WriteString(decl.code)
		b.WriteString("\n")
	}
	return b.String()
}

func renderStruct(b *strings.Builder, structType *loweredStruct, runtimeOwner *RuntimeContractOwner) {
	varRef := runtimeOwner.QualifiedHelper(RuntimeHelperVarRef)
	markStructValue := runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue)
	registerStructType := runtimeOwner.QualifiedHelper(RuntimeHelperRegisterStructType)
	if structType.exported {
		b.WriteString("export ")
	}
	b.WriteString("class ")
	b.WriteString(structType.name)
	b.WriteString(" {\n")
	for _, field := range structType.fields {
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
			b.WriteString("(init.")
			b.WriteString(field.name)
			b.WriteString(".clone()) : ")
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
	b.WriteString("\tpublic clone(): ")
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
			b.WriteString("(this._fields.")
			b.WriteString(field.name)
			b.WriteString(".value.clone())")
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
	b.WriteString(",\n\t\tnew ")
	b.WriteString(structType.name)
	b.WriteString("(),\n\t\t[")
	for idx, method := range structType.methods {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString("{ name: ")
		b.WriteString(strconvQuote(method.name))
		b.WriteString(", args: [], returns: [] }")
	}
	b.WriteString("],\n\t\t")
	b.WriteString(structType.name)
	b.WriteString(",\n\t\t{")
	for idx, field := range structType.fields {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(strconvQuote(field.name))
		b.WriteString(": ")
		b.WriteString(field.runtimeType)
	}
	b.WriteString("}\n\t)\n")
	b.WriteString("}\n")
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
		b.WriteString("const ")
		b.WriteString(fn.receiverAlias)
		b.WriteString(" = this\n")
	}
	renderDeferStack(b, fn.deferState, 1)
	renderStmts(b, fn.body, 1)
	b.WriteString("}\n")
}

func renderMethod(b *strings.Builder, fn *loweredFunction) {
	writeIndent(b, 1)
	b.WriteString("public ")
	if fn.async {
		b.WriteString("async ")
	}
	b.WriteString(fn.name)
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
		b.WriteString("const ")
		b.WriteString(fn.receiverAlias)
		b.WriteString(" = this\n")
	}
	renderDeferStack(b, fn.deferState, 2)
	renderStmts(b, fn.body, 2)
	writeIndent(b, 1)
	b.WriteString("}\n")
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
	for _, stmt := range stmts {
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
		if stmt.text == "" && len(stmt.children) != 0 {
			b.WriteString("{\n")
			renderStmts(b, stmt.children, indent+1)
			writeIndent(b, indent)
			b.WriteString("}\n")
			continue
		}
		b.WriteString(stmt.text)
		if len(stmt.children) == 0 {
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

func renderSwitch(b *strings.Builder, stmt *loweredSwitch, indent int) {
	writeIndent(b, indent)
	b.WriteString("switch (")
	b.WriteString(stmt.value)
	b.WriteString(") {\n")
	for _, switchCase := range stmt.cases {
		for _, value := range switchCase.values {
			writeIndent(b, indent+1)
			b.WriteString("case ")
			b.WriteString(value)
			b.WriteString(":\n")
		}
		renderSwitchBody(b, switchCase.body, indent+1)
	}
	if len(stmt.defaultBody) != 0 {
		writeIndent(b, indent+1)
		b.WriteString("default:\n")
		renderSwitchBody(b, stmt.defaultBody, indent+1)
	}
	writeIndent(b, indent)
	b.WriteString("}\n")
}

func renderSwitchBody(b *strings.Builder, body []loweredStmt, indent int) {
	writeIndent(b, indent)
	b.WriteString("{\n")
	renderStmts(b, body, indent+1)
	writeIndent(b, indent+1)
	b.WriteString("break\n")
	writeIndent(b, indent)
	b.WriteString("}\n")
}

func renderRangeFunc(b *strings.Builder, stmt *loweredRangeFunc, indent int) {
	writeIndent(b, indent)
	b.WriteString(";(() => {\n")
	writeIndent(b, indent+1)
	b.WriteString(stmt.value)
	b.WriteString("!((")
	b.WriteString(strings.Join(stmt.params, ", "))
	b.WriteString(") => {\n")
	renderStmts(b, stmt.body, indent+2)
	writeIndent(b, indent+2)
	b.WriteString("return true\n")
	writeIndent(b, indent+1)
	b.WriteString("})\n")
	writeIndent(b, indent)
	b.WriteString("})()\n")
}

func renderSelect(b *strings.Builder, stmt *loweredSelect, indent int) {
	writeIndent(b, indent)
	b.WriteString("const [")
	b.WriteString(stmt.hasReturn)
	b.WriteString(", ")
	b.WriteString(stmt.value)
	b.WriteString("] = await $.selectStatement([\n")
	for idx, switchCase := range stmt.cases {
		renderSelectCase(b, switchCase, indent+1)
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
}

func renderSelectCase(b *strings.Builder, switchCase loweredSelectCase, indent int) {
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
	b.WriteString("onSelected: async (result) => {\n")
	renderStmts(b, switchCase.prelude, indent+2)
	renderStmts(b, switchCase.body, indent+2)
	writeIndent(b, indent+1)
	b.WriteString("}\n")
	writeIndent(b, indent)
	b.WriteString("}")
}

func renderTypeSwitch(b *strings.Builder, stmt *loweredTypeSwitch, indent int) {
	writeIndent(b, indent)
	b.WriteString("$.typeSwitch(\n")
	writeIndent(b, indent+1)
	b.WriteString(stmt.value)
	b.WriteString(",\n")
	writeIndent(b, indent+1)
	b.WriteString("[\n")
	for caseIdx, switchCase := range stmt.cases {
		writeIndent(b, indent+2)
		b.WriteString("{\n")
		writeIndent(b, indent+3)
		b.WriteString("types: [")
		for idx, typ := range switchCase.types {
			if idx != 0 {
				b.WriteString(", ")
			}
			b.WriteString(typ)
		}
		b.WriteString("],\n")
		writeIndent(b, indent+3)
		b.WriteString("body: ")
		renderTypeSwitchBody(b, stmt.varName, "", switchCase.body, indent+3)
		writeIndent(b, indent+2)
		b.WriteString("}")
		if caseIdx != len(stmt.cases)-1 {
			b.WriteString(",")
		}
		b.WriteString("\n")
	}
	writeIndent(b, indent+1)
	b.WriteString("]")
	if len(stmt.defaultBody) != 0 {
		b.WriteString(",\n")
		writeIndent(b, indent+1)
		renderTypeSwitchBody(b, stmt.varName, stmt.value, stmt.defaultBody, indent+1)
	}
	if len(stmt.defaultBody) == 0 {
		b.WriteString("\n")
	}
	writeIndent(b, indent)
	b.WriteString(")\n")
}

func renderTypeSwitchBody(
	b *strings.Builder,
	varName string,
	defaultValue string,
	body []loweredStmt,
	indent int,
) {
	header := "() => {\n"
	if varName != "" && defaultValue == "" {
		header = "(" + varName + ") => {\n"
	}
	b.WriteString(header)
	if varName != "" && defaultValue != "" {
		writeIndent(b, indent+1)
		b.WriteString("let ")
		b.WriteString(varName)
		b.WriteString(" = ")
		b.WriteString(defaultValue)
		b.WriteString("\n")
	}
	renderStmts(b, body, indent+1)
	writeIndent(b, indent)
	b.WriteString("}\n")
}

func renderIndex(pkg *loweredPackage) string {
	var lines []string
	for _, file := range pkg.files {
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
