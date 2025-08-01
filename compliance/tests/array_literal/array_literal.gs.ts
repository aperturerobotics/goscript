// Generated file based on array_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Test basic array literal
	//nolint:staticcheck
	let a = $.arrayToSlice<number>([1, 2, 3])
	console.log(a![0], a![1], a![2])

	// Test array literal with inferred length
	let b = $.arrayToSlice<string>(["hello", "world"])
	console.log(b![0], b![1])

	// Test array literal with specific element initialization
	let c = $.arrayToSlice<number>([0, 10, 0, 30, 0])
	console.log(c![0], c![1], c![2], c![3], c![4])
}

