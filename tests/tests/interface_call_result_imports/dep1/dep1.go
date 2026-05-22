package dep1

import "github.com/aperturerobotics/goscript/tests/tests/interface_call_result_imports/dep2"

type maker struct{}

func (maker) Value() string {
	return "ok"
}

func Make() dep2.Value {
	return maker{}
}
