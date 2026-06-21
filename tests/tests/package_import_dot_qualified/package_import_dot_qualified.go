package main

import . "github.com/aperturerobotics/goscript/tests/tests/package_import_dot_qualified/dep"

func main() {
	box := NewBox(3)
	println(Double(Value), box.N)
}
