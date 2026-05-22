package main

import "github.com/aperturerobotics/goscript/tests/tests/package_import_top_level_call/subpkg"

var cached = subpkg.Next()

func main() {
	println("cached:", cached)
}
