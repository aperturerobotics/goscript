package main

import "github.com/aperturerobotics/goscript/tests/tests/method_result_imports_cross_file/dep1"

func (Holder) Run() {
	v := dep1.Make()
	println(v.Value())
}
