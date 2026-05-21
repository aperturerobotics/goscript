package main

type MyStruct struct {
	MyInt    int
	MyString string
}

type setterStruct struct {
	value int
}

// GetMyString returns the MyString field.
func (m *MyStruct) GetMyString() string {
	return m.MyString
}

func (s *setterStruct) set(value int) {
	s.value = value
}

func (s *setterStruct) get() int {
	return s.value
}

func main() {
	structPointer := &MyStruct{MyInt: 4, MyString: "hello world"}
	// === Method Call on Pointer Receiver ===
	// Calling a method with a pointer receiver (*MyStruct) using a pointer variable.
	println("Method call on pointer (structPointer): Expected: hello world, Actual: " + structPointer.GetMyString())

	setter := &setterStruct{}
	setter.set(9)
	println("reserved pointer method:", setter.get())
}
