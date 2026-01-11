package main

// myInt is a primitive type with a method
type myInt int

func (m myInt) add(x int) int {
	return int(m) + x
}

func (m myInt) multiply(x, y int) int {
	return int(m) * x * y
}

func main() {
	var n myInt = 5

	// Method value: binding the receiver to create a function
	addFn := n.add
	println("addFn(3):", addFn(3)) // Should print 8

	mulFn := n.multiply
	println("mulFn(2, 3):", mulFn(2, 3)) // Should print 30

	// Test with different receiver value
	var m myInt = 10
	addFn2 := m.add
	println("addFn2(7):", addFn2(7)) // Should print 17
}
