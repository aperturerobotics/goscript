package main

import "github.com/s4wave/goscript/tests/tests/import_unexported_inferred_type/dep"

var closed = dep.ErrClosed

func main() {
	println(closed.Error())
}
