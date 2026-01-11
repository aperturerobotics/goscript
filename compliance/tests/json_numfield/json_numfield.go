package main

import (
	"reflect"
)

type Person struct {
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Active bool   `json:"active"`
}

func main() {
	var p Person
	t := reflect.TypeOf(p)
	println("TypeOf(Person{}):")
	println("  Name:", t.Name())
	println("  Kind:", t.Kind().String())
	println("  NumField:", t.NumField())

	// This is closer to what json encoder does
	// - it gets the type from ValueOf(v).Type()
	v := reflect.ValueOf(p)
	t2 := v.Type()
	println("ValueOf(Person{}).Type():")
	println("  Name:", t2.Name())
	println("  Kind:", t2.Kind().String())
	println("  NumField:", t2.NumField())
}
