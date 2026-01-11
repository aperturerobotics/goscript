package main

import (
	"github.com/aperturerobotics/goscript/tests/tests/import_type_methods/errlist"
)

type parser struct {
	errors errlist.ErrorList
}

func main() {
	var p parser
	p.errors = p.errors.Add("error")
	println(p.errors[0])
}
