package main

import "github.com/aperturerobotics/goscript/tests/tests/import_unexported_inferred_type/dep"

var closed = dep.ErrClosed

func main() {
	println(closed.Error())
}
