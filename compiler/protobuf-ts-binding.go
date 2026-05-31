package compiler

import (
	"fmt"
	"go/ast"
	"os"
	"path/filepath"
	"strings"
)

type protobufTypeScriptBinding struct {
	sourcePath   string
	outputName   string
	importSource string
	messageNames map[string]string
	hasOneof     bool
}

func protobufTypeScriptBindings(semPkg *semanticPackage, options LoweringOptions) (map[string]protobufTypeScriptBinding, []Diagnostic) {
	if semPkg == nil || semPkg.source == nil || !options.ProtobufTypeScriptBinding {
		return nil, nil
	}
	bindings := make(map[string]protobufTypeScriptBinding)
	var diagnostics []Diagnostic
	for idx, syntax := range semPkg.source.Syntax {
		sourcePath := sourceFilePath(semPkg, idx, syntax)
		if !strings.HasSuffix(sourcePath, ".pb.go") {
			continue
		}
		if strings.HasSuffix(filepath.Base(sourcePath), "_srpc.pb.go") {
			continue
		}
		if !protobufTypeScriptBindingInSourceRoot(options.SourceRoot, sourcePath) {
			continue
		}
		tsPath := strings.TrimSuffix(sourcePath, ".go") + ".ts"
		if _, err := os.Stat(tsPath); err != nil {
			if os.IsNotExist(err) {
				diagnostics = append(diagnostics, Diagnostic{
					Severity: DiagnosticSeverityError,
					Code:     "goscript/protobuf-ts-binding:missing",
					Message:  "protobuf TypeScript binding is missing sibling .pb.ts",
					Detail:   fmt.Sprintf("%s requires %s", sourcePath, tsPath),
				})
				continue
			}
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/protobuf-ts-binding:stat",
				Message:  "failed to inspect protobuf TypeScript binding",
				Detail:   err.Error(),
			})
			continue
		}
		importSource, err := protobufTypeScriptBindingImportSource(options.OutputPath, semPkg.pkgPath, tsPath)
		if err != nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/protobuf-ts-binding:import-source",
				Message:  "failed to compute protobuf TypeScript binding import",
				Detail:   err.Error(),
			})
			continue
		}
		bindings[sourcePath] = protobufTypeScriptBinding{
			sourcePath:   sourcePath,
			outputName:   strings.TrimSuffix(filepath.Base(sourcePath), ".go") + ".ts",
			importSource: importSource,
			messageNames: protobufTypeScriptBindingMessageNames(syntax),
			hasOneof:     protobufTypeScriptBindingHasOneof(syntax),
		}
	}
	return bindings, diagnostics
}

func protobufTypeScriptBindingRoot(dir string) string {
	dir = strings.TrimSpace(dir)
	if dir == "" {
		return ""
	}
	abs, err := filepath.Abs(dir)
	if err != nil {
		return dir
	}
	for {
		if _, err := os.Stat(filepath.Join(abs, "go.mod")); err == nil {
			return abs
		}
		parent := filepath.Dir(abs)
		if parent == abs {
			return dir
		}
		abs = parent
	}
}

func protobufTypeScriptBindingInSourceRoot(sourceRoot, sourcePath string) bool {
	if strings.TrimSpace(sourceRoot) == "" {
		return true
	}
	rootAbs, err := filepath.Abs(sourceRoot)
	if err != nil {
		return false
	}
	sourceAbs, err := filepath.Abs(sourcePath)
	if err != nil {
		return false
	}
	rel, err := filepath.Rel(rootAbs, sourceAbs)
	if err != nil {
		return false
	}
	return rel == "." || !strings.HasPrefix(rel, ".."+string(filepath.Separator)) && rel != ".." && !filepath.IsAbs(rel)
}

func protobufTypeScriptBindingImportSource(outputPath, pkgPath, tsPath string) (string, error) {
	outputDir := filepath.Join(outputPath, "@goscript", filepath.FromSlash(pkgPath))
	outputDir, err := filepath.Abs(outputDir)
	if err != nil {
		return "", err
	}
	rel, err := filepath.Rel(outputDir, tsPath)
	if err != nil {
		return "", err
	}
	rel = filepath.ToSlash(rel)
	if !strings.HasPrefix(rel, ".") {
		rel = "./" + rel
	}
	return strings.TrimSuffix(rel, ".ts") + ".js", nil
}

func protobufTypeScriptBindingHasOneof(file *ast.File) bool {
	if file == nil {
		return false
	}
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
			structType, ok := typeSpec.Type.(*ast.StructType)
			if !ok || structType.Fields == nil {
				continue
			}
			for _, field := range structType.Fields.List {
				if field.Tag != nil && strings.Contains(field.Tag.Value, "protobuf_oneof") {
					return true
				}
			}
		}
	}
	return false
}

func protobufTypeScriptBindingMessageNames(file *ast.File) map[string]string {
	names := make(map[string]string)
	if file == nil {
		return names
	}
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
			if _, ok := typeSpec.Type.(*ast.StructType); !ok {
				continue
			}
			name := typeSpec.Name.Name
			names[name] = protobufTypeScriptBindingSafeIdentifier(name)
		}
	}
	return names
}

func protobufTypeScriptBindingSafeIdentifier(name string) string {
	switch name {
	case "break",
		"case",
		"catch",
		"class",
		"const",
		"continue",
		"debugger",
		"default",
		"delete",
		"do",
		"else",
		"export",
		"extends",
		"false",
		"finally",
		"for",
		"function",
		"if",
		"import",
		"in",
		"instanceof",
		"new",
		"null",
		"return",
		"super",
		"switch",
		"this",
		"throw",
		"true",
		"try",
		"typeof",
		"var",
		"void",
		"while",
		"with",
		"yield",
		"enum",
		"implements",
		"interface",
		"let",
		"package",
		"private",
		"protected",
		"public",
		"static",
		"Object",
		"bigint",
		"number",
		"boolean",
		"string",
		"object",
		"globalThis",
		"Uint8Array",
		"Partial":
		return name + "$"
	default:
		return name
	}
}

func rewriteProtobufTypeScriptBindingFile(file *loweredFile, binding protobufTypeScriptBinding) {
	if file == nil {
		return
	}
	file.outputName = binding.outputName
	if binding.hasOneof {
		return
	}
	const importAlias = "__protobuf_ts"
	file.imports = append(file.imports, loweredImport{
		alias:      importAlias,
		source:     binding.importSource,
		sideEffect: true,
	})
	var setupDecls []loweredDecl
	for _, decl := range file.decls {
		if decl.structType == nil {
			continue
		}
		if protobufTypeScriptBindingSyntheticMapEntry(decl.structType.name) {
			continue
		}
		rewriteProtobufTypeScriptBindingStruct(decl.structType)
		setup := protobufTypeScriptBindingStructSetupDecl(decl.structType, importAlias, binding.messageNames[decl.structType.name])
		if setup.code != "" {
			setupDecls = append(setupDecls, setup)
		}
	}
	file.decls = append(file.decls, setupDecls...)
}

func protobufTypeScriptBindingSyntheticMapEntry(name string) bool {
	return strings.Contains(name, "_") && strings.HasSuffix(name, "Entry")
}

func lowerProtobufSRPCTypeScriptBindingStub(semPkg *semanticPackage, sourcePath string, options LoweringOptions) (*loweredFile, []Diagnostic) {
	tsPath := strings.TrimSuffix(sourcePath, ".go") + ".ts"
	if _, err := os.Stat(tsPath); err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/protobuf-ts-binding:srpc-stat",
			Message:  "failed to inspect SRPC TypeScript binding",
			Detail:   err.Error(),
		}}
	}
	importSource, err := protobufTypeScriptBindingImportSource(options.OutputPath, semPkg.pkgPath, tsPath)
	if err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/protobuf-ts-binding:srpc-import-source",
			Message:  "failed to compute SRPC TypeScript binding import",
			Detail:   err.Error(),
		}}
	}
	return &loweredFile{
		sourcePath: sourcePath,
		outputName: sourceOutputName(sourcePath),
		decls: []loweredDecl{{
			code: "export * from " + strconvQuote(importSource),
		}},
		exportAll: true,
	}, nil
}

func protobufSRPCHasGoScriptReplacement(sourcePath string) bool {
	base := filepath.Base(sourcePath)
	if !strings.HasSuffix(base, "_srpc.pb.go") {
		return false
	}
	replacement := strings.TrimSuffix(base, "_srpc.pb.go") + "-srpc-goscript.go"
	_, err := os.Stat(filepath.Join(filepath.Dir(sourcePath), replacement))
	return err == nil
}

func rewriteProtobufTypeScriptBindingStruct(structType *loweredStruct) {
	if structType == nil {
		return
	}
	for idx := range structType.methods {
		method := &structType.methods[idx]
		body := protobufTypeScriptBindingMethodBody(structType, method)
		if body == "" {
			continue
		}
		method.async = false
		method.paramBindings = nil
		method.namedResults = nil
		method.deferState = nil
		method.body = []loweredStmt{{text: body}}
	}
}

func protobufTypeScriptBindingMethodBody(structType *loweredStruct, method *loweredFunction) string {
	if structType == nil || method == nil {
		return ""
	}
	ctor := structType.name
	if !protobufTypeScriptBindingReplacesMethodName(method.name) {
		return ""
	}
	switch method.name {
	case "CloneMessageVT":
		return "return $.interfaceValue<protobuf_go_lite.CloneMessage | null>(protobuf_go_lite.CloneBoundMessage(" +
			ctor + ", this) as any, " + strconvQuote("*"+structType.typeName) + ")"
	case "CloneVT":
		return "return protobuf_go_lite.CloneBoundMessage(" + ctor + ", this) as any"
	case "EqualVT":
		return "return protobuf_go_lite.EqualBoundMessage(" + ctor + ", this, " + protobufBindingParam(method, 0, "null") + ")"
	case "MarshalJSON":
		return "return protobuf_go_lite.MarshalBoundMessageJSON(" + ctor + ", this)"
	case "MarshalProtoJSON":
		return "protobuf_go_lite.MarshalBoundMessageProtoJSON(" + ctor + ", this, " + protobufBindingParam(method, 0, "null") + ")"
	case "MarshalProtoText", "String":
		return "return protobuf_go_lite.MarshalBoundMessageProtoText(" + ctor + ", this)"
	case "MarshalToSizedBufferVT":
		return "return protobuf_go_lite.MarshalBoundMessageToSizedBufferVT(" + ctor + ", this, " + protobufBindingParam(method, 0, "null") + ")"
	case "MarshalVT":
		return "return protobuf_go_lite.MarshalBoundMessageVT(" + ctor + ", this)"
	case "ProtoMessage":
		return "return"
	case "Reset":
		return "$.assignStruct($.pointerValue<" + ctor + ">(this), $.markAsStructValue(new " + ctor + "()))"
	case "SizeVT":
		return "return protobuf_go_lite.SizeBoundMessageVT(" + ctor + ", this)"
	case "UnmarshalJSON":
		return "return protobuf_go_lite.UnmarshalBoundMessageJSON(" + ctor + ", this, " + protobufBindingParam(method, 0, "null") + ")"
	case "UnmarshalProtoJSON":
		return "protobuf_go_lite.UnmarshalBoundMessageProtoJSON(" + ctor + ", this, " + protobufBindingParam(method, 0, "null") + ")"
	case "UnmarshalVT":
		return "return protobuf_go_lite.UnmarshalBoundMessageVT(" + ctor + ", this, " + protobufBindingParam(method, 0, "null") + ")"
	default:
		return ""
	}
}

func protobufTypeScriptBindingReplacesMethodName(name string) bool {
	switch name {
	case "CloneMessageVT",
		"CloneVT",
		"EqualVT",
		"MarshalJSON",
		"MarshalProtoJSON",
		"MarshalProtoText",
		"MarshalToSizedBufferVT",
		"MarshalVT",
		"ProtoMessage",
		"Reset",
		"SizeVT",
		"String",
		"UnmarshalJSON",
		"UnmarshalProtoJSON",
		"UnmarshalVT":
		return true
	default:
		return false
	}
}

func protobufBindingParam(method *loweredFunction, idx int, fallback string) string {
	if method == nil || idx < 0 || idx >= len(method.params) || strings.TrimSpace(method.params[idx].name) == "" {
		return fallback
	}
	return method.params[idx].name
}

func protobufTypeScriptBindingStructSetupDecl(structType *loweredStruct, importAlias, messageName string) loweredDecl {
	if structType == nil {
		return loweredDecl{}
	}
	if messageName == "" {
		messageName = structType.name
	}
	entries := make([]string, 0, len(structType.fields))
	for _, field := range structType.fields {
		ctor := protobufTypeScriptBindingFieldCtor(field)
		if ctor == "" {
			continue
		}
		entries = append(entries, strconvQuote(protobufTypeScriptBindingFieldLocalName(field))+": "+ctor)
	}
	return loweredDecl{code: "(" + structType.name + " as any).__protobufTypeScriptMessage = " + importAlias + "." + messageName + ";\n" +
		"(" + structType.name + " as any).__protobufTypeScriptFields = {" + strings.Join(entries, ", ") + "};"}
}

func protobufTypeScriptBindingFieldLocalName(field loweredStructField) string {
	if tag := field.tag; tag != "" {
		if value := protobufTypeScriptBindingTagValue(tag, "json="); value != "" {
			return value
		}
		if value := protobufTypeScriptBindingTagValue(tag, "name="); value != "" {
			return protobufTypeScriptBindingProtoCamel(value)
		}
	}
	if field.name == "" {
		return field.name
	}
	return strings.ToLower(field.name[:1]) + field.name[1:]
}

func protobufTypeScriptBindingTagValue(tag, key string) string {
	idx := strings.Index(tag, key)
	if idx < 0 {
		return ""
	}
	rest := tag[idx+len(key):]
	end := len(rest)
	for idx, ch := range rest {
		if ch == ',' || ch == '"' || ch == '`' || ch == ' ' {
			end = idx
			break
		}
	}
	return rest[:end]
}

func protobufTypeScriptBindingProtoCamel(name string) string {
	if name == "" {
		return ""
	}
	parts := strings.Split(name, "_")
	var out strings.Builder
	for idx, part := range parts {
		if part == "" {
			continue
		}
		part = strings.ToLower(part)
		if idx == 0 {
			out.WriteString(part)
			continue
		}
		out.WriteString(strings.ToUpper(part[:1]))
		out.WriteString(part[1:])
	}
	return out.String()
}

func protobufTypeScriptBindingFieldCtor(field loweredStructField) string {
	if !strings.Contains(field.runtimeType, "TypeKind.Pointer") {
		return ""
	}
	for _, token := range strings.FieldsFunc(field.typ, func(r rune) bool {
		return !(r == '.' || r == '_' || r == '$' || r >= '0' && r <= '9' || r >= 'A' && r <= 'Z' || r >= 'a' && r <= 'z')
	}) {
		if protobufTypeScriptBindingCtorToken(token) {
			return token
		}
	}
	return ""
}

func protobufTypeScriptBindingCtorToken(token string) bool {
	if token == "" || strings.HasPrefix(token, "$.") || strings.HasPrefix(token, "globalThis.") {
		return false
	}
	switch token {
	case "any", "bigint", "boolean", "Date", "Map", "null", "number", "Promise", "Set", "Slice", "string", "Uint8Array", "undefined", "unknown", "VarRef", "void":
		return false
	}
	if strings.Contains(token, ".") {
		return true
	}
	first := token[0]
	return first >= 'A' && first <= 'Z'
}
