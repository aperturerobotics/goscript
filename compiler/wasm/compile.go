// Package wasm provides the WASM-friendly compiler adapter surface.
package wasm

import (
	"github.com/aperturerobotics/goscript/compiler"
)

// CompileSource returns the v2 browser source-compilation diagnostic.
func CompileSource(source string, packageName string) (string, error) {
	return compiler.CompileSourceToTypeScript(source, packageName)
}
