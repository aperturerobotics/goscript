// Generated file based on keyed_array_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Test simple keyed array literal with integer keys
	let arr1 = $.arrayToSlice<string>(["", "first", "", "third", ""])
	$.println("arr1[0]:", arr1![0])
	$.println("arr1[1]:", arr1![1])
	$.println("arr1[2]:", arr1![2])
	$.println("arr1[3]:", arr1![3])
	$.println("arr1[4]:", arr1![4])

	// Test keyed array literal with expression keys (this likely causes the issue)
	let offset: number = 10
	let arr2 = $.arrayToSlice<string>(["", "", "", "", "", "", "", "", "", "", "", "at index 11", "", "at index 13", ""])
	$.println("arr2[10]:", arr2![10])
	$.println("arr2[11]:", arr2![11])
	$.println("arr2[12]:", arr2![12])
	$.println("arr2[13]:", arr2![13])
	$.println("arr2[14]:", arr2![14])

	// Test mixed keyed and unkeyed elements

	// unkeyed (indices 0, 1)
	// keyed (index 5)
	// unkeyed (index 6)
	let arr3 = $.arrayToSlice<number>([1, 2, 0, 0, 0, 100, 200, 0])
	$.println("arr3[0]:", arr3![0])
	$.println("arr3[1]:", arr3![1])
	$.println("arr3[2]:", arr3![2])
	$.println("arr3[5]:", arr3![5])
	$.println("arr3[6]:", arr3![6])
	$.println("arr3[7]:", arr3![7])

	// Test slice with keyed elements
	let slice1 = $.arrayToSlice<string>(["", "", "second", "", "fourth"])
	$.println("slice1[0]:", slice1![0])
	$.println("slice1[1]:", slice1![1])
	$.println("slice1[2]:", slice1![2])
	$.println("slice1[3]:", slice1![3])
	$.println("slice1[4]:", slice1![4])

	$.println("keyed array literal test completed")
}

