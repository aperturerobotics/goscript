package main

import "strconv"

// This test demonstrates that generic type parameters with interface constraints
// have incorrect zero values and method resolution in GoScript.
//
// When a type parameter is constrained to an interface with methods, GoScript
// treats the zero value as null. But when instantiated with a type like IntVal
// (which has int as underlying type), the zero value should be 0, not null.

type Stringer interface {
	String() string
}

// IntVal is a named type with int as underlying type
type IntVal int

func (i IntVal) String() string {
	return strconv.Itoa(int(i))
}

// StringVal is a named type with string as underlying type
type StringVal string

func (s StringVal) String() string {
	return string(s)
}

// ZeroValue returns the zero value of type T
func ZeroValue[T Stringer]() T {
	var zero T
	return zero
}

// CallString calls the String method on a value of type T
func CallString[T Stringer](v T) string {
	return v.String()
}

// Sum demonstrates zero value + method call in a generic context
func Sum[T Stringer](vals ...T) T {
	var sum T // Should be 0 for IntVal, "" for StringVal
	// Note: We can't actually add T values in Go without more constraints
	// This just tests that sum has the right zero value and String() works
	return sum
}

func main() {
	// Test 1: Zero value of IntVal should be 0
	zeroInt := ZeroValue[IntVal]()
	println("ZeroValue[IntVal]:", zeroInt.String())

	// Test 2: Zero value of StringVal should be ""
	zeroStr := ZeroValue[StringVal]()
	println("ZeroValue[StringVal]:", zeroStr.String())

	// Test 3: CallString on zero value
	println("CallString on zero IntVal:", CallString(zeroInt))
	println("CallString on zero StringVal:", CallString(zeroStr))

	// Test 4: Sum returns zero value
	sumInt := Sum[IntVal]()
	println("Sum[IntVal]():", sumInt.String())

	sumStr := Sum[StringVal]()
	println("Sum[StringVal]():", sumStr.String())

	// Test 5: Verify the actual values
	println("zeroInt == 0:", zeroInt == 0)
	println("zeroStr == \"\":", zeroStr == "")
}
