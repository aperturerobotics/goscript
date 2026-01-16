package main

import (
	"github.com/aperturerobotics/goscript/tests/tests/linkname_alias/target"
	_ "unsafe"
)

// Test //go:linkname to alias a function from another package
// This creates a local alias to an external function (no body = alias)

//go:linkname greet github.com/aperturerobotics/goscript/tests/tests/linkname_alias/target.Greet
func greet(name string) string

//go:linkname add github.com/aperturerobotics/goscript/tests/tests/linkname_alias/target.Add
func add(a, b int) int

func main() {
	// Test using the linkname alias functions
	println(greet("World"))
	println(add(2, 3))

	// Also test calling the target package directly
	println(target.Greet("Direct"))
}
