package main

import (
	"fmt"
	"slices"
)

func main() {
	// Test slices.Delete which was missing in the error output
	numbers := []int{1, 2, 3, 4, 5}
	fmt.Printf("Original: %v\n", numbers)

	// This should work but might be missing from the slices package implementation
	numbers = slices.Delete(numbers, 1, 3) // Delete indices 1 and 2
	fmt.Printf("After delete: %v\n", numbers)

	// Test slices.BinarySearchFunc which was also missing
	data := []int{10, 20, 30, 40, 50}
	index, found := slices.BinarySearchFunc(data, 30, func(a, b int) int {
		if a < b {
			return -1
		} else if a > b {
			return 1
		}
		return 0
	})

	fmt.Printf("Index: %d, Found: %t\n", index, found)
}
