package main

import "fmt"

func multiReturn() (int, int) {
	return 10, 20
}

func multiReturnThree() (string, int, int) {
	return "test", 100, 200
}

func main() {
	// Test simple destructuring that should work
	x, y := multiReturn()
	fmt.Printf("x=%d, y=%d\n", x, y)

	// Test three-value destructuring
	name, line, col := multiReturnThree()
	fmt.Printf("name=%s, line=%d, col=%d\n", name, line, col)

	// Test reassignment to existing variables
	var a, b int
	a, b = multiReturn()
	fmt.Printf("a=%d, b=%d\n", a, b)
}
