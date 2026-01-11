package main

import (
	"reflect"
)

type Person struct {
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Active bool   `json:"active"`
}

type field struct {
	name string
	typ  reflect.Type
}

func main() {
	t := reflect.TypeOf(Person{})

	// Mimic the exact flow of typeFields
	next := []field{{typ: t}}
	println("Initial next len:", len(next))
	println("next[0].typ:", next[0].typ.Name())
	println("next[0].typ.NumField():", next[0].typ.NumField())

	for len(next) > 0 {
		current := next
		next = nil

		println("Loop iteration, current len:", len(current))

		for _, f := range current {
			println("Processing field, typ:", f.typ.Name())
			println("  NumField:", f.typ.NumField())

			for i := 0; i < f.typ.NumField(); i++ {
				sf := f.typ.Field(i)
				println("  Struct field", i, ":", sf.Name)
				tag := sf.Tag.Get("json")
				println("    Tag:", tag)
			}
		}
	}
}
