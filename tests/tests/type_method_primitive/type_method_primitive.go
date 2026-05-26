package main

// Test that primitive type aliases with methods work correctly
type MyInt int

type Doubler interface {
	Double() int
}

type Stringer interface {
	String() string
}

type MyBool bool

func (m MyInt) Double() int {
	return int(m) * 2
}

func (b *MyBool) String() string {
	if bool(*b) {
		return "true"
	}
	return "false"
}

func asDoubler(v MyInt) Doubler {
	return v
}

func sumDoublers(vals []Doubler) int {
	return vals[0].Double() + vals[1].Double()
}

func assertDoubler[T Doubler](v Doubler) (T, bool) {
	out, ok := v.(T)
	return out, ok
}

func newMyBool(value bool, target *bool) *MyBool {
	*target = value
	return (*MyBool)(target)
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

	var vals []Doubler
	vals = append(vals, MyInt(14), MyInt(15))
	println("Interface slice append:", sumDoublers(vals))

	genericAsserted, genericOK := assertDoubler[MyInt](ret)
	println("Generic interface assertion:", int(genericAsserted), genericOK)

	var flag bool
	var stringer Stringer = newMyBool(true, &flag)
	println("Pointer primitive interface:", stringer.String(), flag)
}
