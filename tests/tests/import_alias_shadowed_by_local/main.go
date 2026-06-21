package main

import "github.com/s4wave/goscript/tests/tests/import_alias_shadowed_by_local/drbg"

type local struct {
	value int
}

func newLocal(value int) *local {
	return &local{value: value}
}

func main() {
	if err := drbg.Read(); err != nil {
		println("error")
		return
	}

	drbg := newLocal(7)
	println(drbg.value)
}
