//go:build js && wasm

package main

import (
	"errors"
	"syscall/js"

	"github.com/s4wave/goscript/compiler"
	"github.com/s4wave/goscript/compiler/wasm"
)

func main() {
	// Register the compile function as a global JavaScript function
	js.Global().Set("goscriptCompile", js.FuncOf(compileWrapper))

	// Keep the program running
	select {}
}

// compileWrapper wraps the compile function for JavaScript interop
func compileWrapper(this js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return map[string]interface{}{
			"error":       "missing source code argument",
			"output":      "",
			"diagnostics": []interface{}{},
		}
	}

	source := args[0].String()
	packageName := "main"
	if len(args) > 1 {
		packageName = args[1].String()
	}

	output, err := wasm.CompileSource(source, packageName)
	if err != nil {
		diagnostics := []interface{}{}
		var compileErr *compiler.CompileError
		if errors.As(err, &compileErr) {
			diagnostics = encodeDiagnostics(compileErr.Diagnostics)
		}
		return map[string]interface{}{
			"error":       err.Error(),
			"output":      "",
			"diagnostics": diagnostics,
		}
	}

	return map[string]interface{}{
		"error":       "",
		"output":      output,
		"diagnostics": []interface{}{},
	}
}

func encodeDiagnostics(diagnostics []compiler.Diagnostic) []interface{} {
	encoded := make([]interface{}, 0, len(diagnostics))
	for _, diagnostic := range diagnostics {
		item := map[string]interface{}{
			"severity": string(diagnostic.Severity),
			"code":     diagnostic.Code,
			"message":  diagnostic.Message,
			"detail":   diagnostic.Detail,
		}
		if diagnostic.Position != nil {
			item["position"] = map[string]interface{}{
				"file":        diagnostic.Position.File,
				"displayFile": diagnostic.Position.DisplayFile,
				"line":        diagnostic.Position.Line,
				"column":      diagnostic.Position.Column,
			}
		}
		encoded = append(encoded, item)
	}
	return encoded
}
