package dep1

import "github.com/s4wave/goscript/tests/tests/method_result_imports_cross_file/dep2"

type maker struct{}

func (maker) Value() string {
	return "ok"
}

func Make() dep2.Value {
	return maker{}
}
