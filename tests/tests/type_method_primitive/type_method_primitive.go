package main

// Test that primitive type aliases with methods work correctly
type MyInt int

type Doubler interface {
	Double() int
}

func (m MyInt) Double() int {
	return int(m) * 2
}

func asDoubler(v MyInt) Doubler {
	return v
}

func main() {
	// Test direct method call on type conversion
	result := MyInt(5).Double()
	println("Direct call:", result)

	// Test storing method reference (this is the failing case)
	fn := MyInt(10).Double
	println("Method ref call:", fn())

	var d Doubler = MyInt(12)
	println("Interface method call:", d.Double())

	ret := asDoubler(MyInt(13))
	println("Returned interface call:", ret.Double())

	asserted, ok := ret.(MyInt)
	println("Interface assertion:", int(asserted), ok)
}
