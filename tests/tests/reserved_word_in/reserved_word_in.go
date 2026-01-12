package main

// Test that Go variables named 'in' are renamed in TypeScript.
// 'in' is a reserved keyword in TypeScript but valid in Go.
// This tests both declaration and usage contexts.

func double(in int) int {
	return in * 2
}

func main() {
	// Test simple variable named 'in'
	var in int = 3
	in = in + 1

	// Test function parameter named 'in'
	result := double(in)

	println(in)     // 4
	println(result) // 8
}
