// Package wasm provides the WASM-friendly compiler adapter surface.
package wasm

import (
	"github.com/s4wave/goscript/compiler"
)

// CompileSource compiles import-free browser source strings to TypeScript.
func CompileSource(source string, packageName string) (string, error) {
	return compiler.CompileSourceToTypeScript(source, packageName)
}
