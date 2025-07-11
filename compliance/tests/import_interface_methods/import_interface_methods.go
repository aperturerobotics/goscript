package main

import (
	"github.com/aperturerobotics/goscript/compliance/tests/import_interface_methods/errlist"
)

type parser struct {
	errors errlist.ErrorList
}

func main() {
	var p parser
	p.errors.Add("error")
	println(p.errors[0])
}
