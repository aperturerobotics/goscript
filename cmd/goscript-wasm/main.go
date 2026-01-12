//go:build js && wasm

package main

import (
	"syscall/js"

	"github.com/aperturerobotics/goscript/compiler/wasm"
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
			"error":  "missing source code argument",
			"output": "",
		}
	}

	source := args[0].String()
	packageName := "main"
	if len(args) > 1 {
		packageName = args[1].String()
	}

	output, err := wasm.CompileSource(source, packageName)
	if err != nil {
		return map[string]interface{}{
			"error":  err.Error(),
			"output": "",
		}
	}

	return map[string]interface{}{
		"error":  "",
		"output": output,
	}
}
