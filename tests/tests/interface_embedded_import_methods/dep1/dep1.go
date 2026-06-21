package dep1

import "github.com/s4wave/goscript/tests/tests/interface_embedded_import_methods/dep2"

type Base interface {
	Use(dep2.Value) dep2.Result
}
