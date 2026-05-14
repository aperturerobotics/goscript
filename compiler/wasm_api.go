package compiler

// CompileSourceToTypeScript is the WASM adapter for browser source compilation.
func CompileSourceToTypeScript(source string, packageName string) (string, error) {
	_ = source
	_ = packageName

	return "", NewCompileError([]Diagnostic{{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/wasm:single-file-unsupported",
		Message:  "browser source compilation is not supported by the v2 compiler",
		Detail:   "Use goscript compile --package . from inside a Go module. The website uses precompiled examples until direct single-file compilation is scoped.",
	}})
}
