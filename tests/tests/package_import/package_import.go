package main

import (
	"github.com/aperturerobotics/goscript/tests/tests/package_import/subpkg"
)

func main() {
	println(subpkg.Greet("world"))
}
