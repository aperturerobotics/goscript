package main

import "github.com/s4wave/goscript/tests/tests/package_import_top_level_call/subpkg"

var cached = subpkg.Next()

func main() {
	println("cached:", cached)
}
