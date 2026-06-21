package main

import "github.com/s4wave/goscript/tests/tests/type_alias_interface_param_cross_file/dep"

type Value = dep.Value

type Tx interface {
	Put(v Value)
}
