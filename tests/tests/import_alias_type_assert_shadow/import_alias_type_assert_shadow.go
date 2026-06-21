package main

import "github.com/s4wave/goscript/tests/tests/import_alias_type_assert_shadow/dep"

func unwrap(v any) int {
	if dep, ok := v.(*dep.Thing); ok {
		return dep.Value
	}
	return 0
}

func main() {
	println(unwrap(&dep.Thing{Value: 7}))
}
