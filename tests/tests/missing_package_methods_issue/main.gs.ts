// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as slices from "@goscript/slices/index.js"

export async function main(): globalThis.Promise<void> {
	// Test slices.Delete which was missing in the error output
	let numbers: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	fmt.Printf("Original: %v\n", $.interfaceValue<any>(numbers, "[]int"))

	// This should work but might be missing from the slices package implementation
	numbers = slices.Delete(numbers, 1, 3)
	fmt.Printf("After delete: %v\n", $.interfaceValue<any>(numbers, "[]int"))

	// Test slices.BinarySearchFunc which was also missing
	let data: $.Slice<number> = $.arrayToSlice<number>([10, 20, 30, 40, 50])
	let [index, found] = slices.BinarySearchFunc(data, 30, $.functionValue((a: number, b: number): number => {
		if (a < b) {
			return -1
		} else {
			if (a > b) {
				return 1
			}
		}
		return 0
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] }))

	fmt.Printf("Index: %d, Found: %t\n", index, found)
}

if ($.isMainScript(import.meta)) {
	await main()
}
