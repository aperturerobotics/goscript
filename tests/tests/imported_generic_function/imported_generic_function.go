package main

import "github.com/aperturerobotics/goscript/tests/tests/imported_generic_function/helper"

func main() {
	box := helper.Wrap(21)
	println("wrapped:", box.Value)
}
