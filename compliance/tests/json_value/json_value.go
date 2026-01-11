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
	v := reflect.ValueOf(p)
	t := v.Type()

	println("Type:", t.Name())
	println("Kind:", t.Kind().String())
	println("NumField:", t.NumField())

	for i := 0; i < t.NumField(); i++ {
		sf := t.Field(i)
		fv := v.Field(i)

		println("Field", i, ":", sf.Name)
		println("  FieldValue Kind:", fv.Kind().String())
		println("  FieldValue CanInterface:", fv.CanInterface())

		switch fv.Kind() {
		case reflect.String:
			println("  Value:", fv.String())
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			println("  Value:", fv.Int())
		case reflect.Bool:
			println("  Value:", fv.Bool())
		}
	}
}
