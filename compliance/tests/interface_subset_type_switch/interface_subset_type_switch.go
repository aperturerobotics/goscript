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

func processInterface(i any) {
	switch v := i.(type) {
	case MyInterface1:
		println("MyInterface1:", v.MyString1(), v.MyString2())
	case MyInterface2:
		println("MyInterface2:", v.MyString1())
	default:
		println("Unknown type")
	}
}

func main() {
	s := MyStruct{Value1: "hello", Value2: "world"}

	// Test with MyInterface1
	var i1 MyInterface1 = s
	processInterface(i1)

	// Test with MyInterface2
	var i2 MyInterface2 = s
	processInterface(i2)

	// Test with concrete type
	processInterface(s)

	// Type switch with subset casting
	var i3 any = i1
	switch v := i3.(type) {
	case MyInterface2:
		println("Matched MyInterface2 from i1:", v.MyString1())
	case MyInterface1:
		println("Matched MyInterface1 from i1:", v.MyString1(), v.MyString2())
	default:
		println("No match")
	}
}
