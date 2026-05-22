package main

import "github.com/aperturerobotics/goscript/tests/tests/interface_embedded_import_methods/dep1"

type Combined interface {
	dep1.Base
	Extra()
}

func main() {
	println("ok")
}
