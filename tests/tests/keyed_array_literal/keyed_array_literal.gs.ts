// Generated file based on keyed_array_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Test simple keyed array literal with integer keys
	let arr1 = ["", "first", "", "third", ""]
	$.println("arr1[0]:", $.arrayIndex(arr1, 0))
	$.println("arr1[1]:", $.arrayIndex(arr1, 1))
	$.println("arr1[2]:", $.arrayIndex(arr1, 2))
	$.println("arr1[3]:", $.arrayIndex(arr1, 3))
	$.println("arr1[4]:", $.arrayIndex(arr1, 4))

	// Test keyed array literal with expression keys (this likely causes the issue)
	const offset: number = 10
	let arr2 = ["", "", "", "", "", "", "", "", "", "", "", "at index 11", "", "at index 13", ""]
	$.println("arr2[10]:", $.arrayIndex(arr2, 10))
	$.println("arr2[11]:", $.arrayIndex(arr2, 11))
	$.println("arr2[12]:", $.arrayIndex(arr2, 12))
	$.println("arr2[13]:", $.arrayIndex(arr2, 13))
	$.println("arr2[14]:", $.arrayIndex(arr2, 14))

	// Test mixed keyed and unkeyed elements
	let arr3 = [1, 2, 0, 0, 0, 100, 200, 0]
	$.println("arr3[0]:", $.arrayIndex(arr3, 0))
	$.println("arr3[1]:", $.arrayIndex(arr3, 1))
	$.println("arr3[2]:", $.arrayIndex(arr3, 2))
	$.println("arr3[5]:", $.arrayIndex(arr3, 5))
	$.println("arr3[6]:", $.arrayIndex(arr3, 6))
	$.println("arr3[7]:", $.arrayIndex(arr3, 7))

	// Test slice with keyed elements
	let slice1: $.Slice<string> = $.arrayToSlice<string>(["", "", "second", "", "fourth"])
	$.println("slice1[0]:", $.arrayIndex(slice1!, 0))
	$.println("slice1[1]:", $.arrayIndex(slice1!, 1))
	$.println("slice1[2]:", $.arrayIndex(slice1!, 2))
	$.println("slice1[3]:", $.arrayIndex(slice1!, 3))
	$.println("slice1[4]:", $.arrayIndex(slice1!, 4))

	$.println("keyed array literal test completed")
}

if ($.isMainScript(import.meta)) {
	await main()
}
