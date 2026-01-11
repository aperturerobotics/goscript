package main

// Test that primitive type aliases with methods work correctly
type MyInt int

func (m MyInt) Double() int {
	return int(m) * 2
}

func main() {
	// Test direct method call on type conversion
	result := MyInt(5).Double()
	println("Direct call:", result)

	// Test storing method reference (this is the failing case)
	fn := MyInt(10).Double
	println("Method ref call:", fn())
}
