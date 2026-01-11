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
	p := Person{Name: "Alice", Age: 30, Active: true}
	t := reflect.TypeOf(p)
	println("Type:", t.Name())
	println("Kind:", t.Kind().String())
	println("NumField:", t.NumField())
	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)
		println("Field", i, "Name:", f.Name)
		println("Field", i, "Tag:", string(f.Tag))
		// Test the Get method
		jsonTag := f.Tag.Get("json")
		println("Field", i, "JsonTag:", jsonTag)
	}
}
