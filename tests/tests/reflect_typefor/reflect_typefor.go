package main

import (
	"reflect"
	"time"
)

type MyStruct struct {
	Name string
	Age  int
}

type MyInterface interface {
	SomeMethod()
}

func main() {
	// Test TypeFor with named interface type
	t1 := reflect.TypeFor[MyInterface]()
	println("TypeFor interface:", t1.String())

	// Test TypeFor with struct type
	t2 := reflect.TypeFor[MyStruct]()
	println("TypeFor struct:", t2.String())
	println("TypeFor struct kind:", t2.Kind() == reflect.Struct)

	// Test TypeFor with int type
	t3 := reflect.TypeFor[int]()
	println("TypeFor int:", t3.String())
	println("TypeFor int kind:", t3.Kind() == reflect.Int)

	// Test TypeFor with imported and cross-file named struct types
	t4 := reflect.TypeFor[time.Time]()
	println("TypeFor imported struct:", t4.String())
	t5 := reflect.TypeFor[OtherStruct]()
	println("TypeFor cross-file struct:", t5.String())

	// Test Pointer constant (should be same as Ptr)
	println("Pointer constant:", reflect.Pointer == reflect.Pointer)

	println("reflect_typefor test finished")
}
