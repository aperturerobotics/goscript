package main

import "reflect"

func main() {
	// Test creating a StructField value
	field := reflect.StructField{
		Name: "TestField",
		Type: reflect.TypeOf(""),
	}
	println("StructField Name:", field.Name)
	println("StructField Type:", field.Type.String())
}
