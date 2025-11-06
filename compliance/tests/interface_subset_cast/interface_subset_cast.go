package main

type MyInterface1 interface {
	MyString1() string
	MyString2() string
}

type MyInterface2 interface {
	MyString1() string
}

type MyStruct struct {
	Value1 string
	Value2 string
}

func (m MyStruct) MyString1() string {
	return m.Value1
}

func (m MyStruct) MyString2() string {
	return m.Value2
}

func main() {
	s := MyStruct{Value1: "hello", Value2: "world"}
	var i1 MyInterface1 = s

	// Cast from larger interface to smaller interface (subset)
	var i2 MyInterface2 = i1

	println("i1.MyString1():", i1.MyString1())
	println("i1.MyString2():", i1.MyString2())
	println("i2.MyString1():", i2.MyString1())

	// Type assertion from larger to smaller interface
	i3, ok := i1.(MyInterface2)
	if ok {
		println("Type assertion successful")
		println("i3.MyString1():", i3.MyString1())
	} else {
		println("Type assertion failed")
	}
}
