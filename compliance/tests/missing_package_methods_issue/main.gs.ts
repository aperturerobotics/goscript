// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as slices from "@goscript/slices/index.js"

export async function main(): Promise<void> {
	// Test slices.Delete which was missing in the error output
	let numbers = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	fmt.Printf("Original: %v\n", numbers)

	// This should work but might be missing from the slices package implementation
	numbers = slices.Delete(numbers, 1, 3) // Delete indices 1 and 2
	fmt.Printf("After delete: %v\n", numbers)

	// Test slices.BinarySearchFunc which was also missing
	let data = $.arrayToSlice<number>([10, 20, 30, 40, 50])
	let [index, found] = slices.BinarySearchFunc(data, 30, (a: number, b: number): number => {
		if (a < b) {
			return -1
		} else if (a > b) {
			return 1
		}
		return 0
	})

	fmt.Printf("Index: %d, Found: %t\n", index, found)
}

