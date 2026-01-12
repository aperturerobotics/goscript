package main

import (
	"fmt"
	"reflect"
)

type Person struct {
	Name string
	Age  int
}

func main() {
	p := Person{Name: "Alice", Age: 30}
	v := reflect.ValueOf(p)
	if v.Kind() == reflect.Struct {
		f := v.Field(0)
		fmt.Println(f.String())
	}
}
