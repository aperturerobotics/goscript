package main

import "github.com/s4wave/goscript/tests/tests/interface_call_result_imports/dep1"

func main() {
	v := dep1.Make()
	println(v.Value())
}
