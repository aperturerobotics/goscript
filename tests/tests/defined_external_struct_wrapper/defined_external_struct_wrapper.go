package main

import "github.com/aperturerobotics/goscript/tests/tests/defined_external_struct_wrapper/dep"

type Wrapped dep.Public

func (w *Wrapped) public() *dep.Public {
	return (*dep.Public)(w)
}

func wrap(p *dep.Public) *Wrapped {
	return (*Wrapped)(p)
}

func main() {
	println("ok")
}
