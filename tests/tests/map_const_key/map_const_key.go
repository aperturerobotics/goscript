package main

// Test that map literals with constant keys generate correct TypeScript.
// This specifically tests:
// 1. Map type aliases
// 2. Map literals with iota constant keys

type Operation int

const (
	Add Operation = iota
	Sub
	Mul
)

type OpNames map[Operation]string

func main() {
	// Using a type alias for map with constant keys
	opNames := OpNames{
		Add: "addition",
		Sub: "subtraction",
		Mul: "multiplication",
	}

	println(opNames[Add])
	println(opNames[Sub])
	println(opNames[Mul])
}
