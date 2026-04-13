package main

import "reflect"

type Stringer interface {
	String() string
}

func main() {
	// Create a typed nil pointer to interface

	// Get the type
	t := reflect.TypeFor[*Stringer]()
	println("Type:", t.String())
	println("Kind:", t.Kind())

	// Get the element type (the interface type itself)
	elem := t.Elem()
	println("Elem Type:", elem.String())
	println("Elem Kind:", elem.Kind())
}
