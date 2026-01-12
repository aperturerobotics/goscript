// Package wasm provides a WASM-friendly API for compiling Go source code to TypeScript.
package wasm

import (
	"github.com/aperturerobotics/goscript/compiler"
)

// CompileSource compiles Go source code to TypeScript.
// It takes the source code as a string and returns the generated TypeScript.
func CompileSource(source string, packageName string) (string, error) {
	return compiler.CompileSourceToTypeScript(source, packageName)
}
