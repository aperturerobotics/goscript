package main

import "reflect"

type Stringer interface {
	String() string
}

func main() {
	// Create a typed nil pointer to interface
	var nilPtr *Stringer = (*Stringer)(nil)

	// Get the type
	t := reflect.TypeOf(nilPtr)
	println("Type:", t.String())
	println("Kind:", t.Kind())

	// Get the element type (the interface type itself)
	elem := t.Elem()
	println("Elem Type:", elem.String())
	println("Elem Kind:", elem.Kind())
}
