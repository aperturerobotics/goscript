package main

type Foo struct {
	Value string
}

var Storage = map[string]Foo{
	"foo": {Value: "bar"},
}
