package main

import (
	"github.com/aperturerobotics/goscript/tests/tests/wrapper_slice_append/errlist"
)

type parser struct {
	errors  errlist.ErrorList
	astruct errlist.AStruct
}

func main() {
	var p parser
	// this Add method does not work:
	p.errors.Add("error")
	println(p.errors[0])

	// but it does work for a struct type:
	p.astruct.Set("astruct")
	println(p.astruct.Msg)
}
