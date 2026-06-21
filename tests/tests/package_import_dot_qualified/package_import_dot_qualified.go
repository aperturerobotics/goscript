package main

import . "github.com/s4wave/goscript/tests/tests/package_import_dot_qualified/dep"

func main() {
	box := NewBox(3)
	println(Double(Value), box.N)
}
