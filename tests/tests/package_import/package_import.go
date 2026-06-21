package main

import (
	"github.com/s4wave/goscript/tests/tests/package_import/subpkg"
)

func main() {
	println(subpkg.Greet("world"))
}
