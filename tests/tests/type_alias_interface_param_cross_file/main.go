package main

import "github.com/aperturerobotics/goscript/tests/tests/type_alias_interface_param_cross_file/dep"

type sink struct {
	size int
}

func (s *sink) Put(v Value) {
	s.size = len(v)
}

func write(tx Tx, v dep.Value) {
	tx.Put(v)
}

func main() {
	s := &sink{}
	write(s, dep.Value{1, 2, 3})
	println("size:", s.size)
}
