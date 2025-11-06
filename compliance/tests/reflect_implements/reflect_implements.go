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
	t := reflect.TypeOf(MyType{})
	ptr := reflect.PointerTo(t)
	iface := reflect.TypeOf((*Stringer)(nil)).Elem()

	println("MyType implements Stringer:", t.Implements(iface))
	println("*MyType implements Stringer:", ptr.Implements(iface))
}
