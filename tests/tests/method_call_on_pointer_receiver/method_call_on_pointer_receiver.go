package main

type MyStruct struct {
	MyInt    int
	MyString string
}

type setterStruct struct {
	value int
}

type digest struct {
	writes int
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

func (d *digest) Write(p []byte) {
	d.writes += len(p)
}

func main() {
	structPointer := &MyStruct{MyInt: 4, MyString: "hello world"}
	// === Method Call on Pointer Receiver ===
	// Calling a method with a pointer receiver (*MyStruct) using a pointer variable.
	println("Method call on pointer (structPointer): Expected: hello world, Actual: " + structPointer.GetMyString())

	setter := &setterStruct{}
	setter.set(9)
	println("reserved pointer method:", setter.get())

	d := &digest{}
	pad := []byte{1, 2, 3}
	{
		d.Write(pad)
		digest := []byte{4}
		println("shadowed type name after method call:", d.writes, len(digest))
	}
}
