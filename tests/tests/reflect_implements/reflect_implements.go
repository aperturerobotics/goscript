package main

import "reflect"

type Stringer interface {
	String() string
}

type MyType struct{}

func (m MyType) String() string {
	return "MyType"
}

func main() {
	t := reflect.TypeFor[MyType]()
	ptr := reflect.PointerTo(t)
	iface := reflect.TypeFor[Stringer]()

	println("MyType implements Stringer:", t.Implements(iface))
	println("*MyType implements Stringer:", ptr.Implements(iface))
}
