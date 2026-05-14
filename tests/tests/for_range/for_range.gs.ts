// Generated file based on for_range.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let nums = [2, 3, 4]
	let sum = 0
	for (let __rangeIndex = 0; __rangeIndex < $.len(nums); __rangeIndex++) {
		let num = nums[__rangeIndex]
		sum += num
	}
	$.println("sum:", sum)
	for (let i = 0; i < $.len(nums); i++) {
		let num = nums[i]
		$.println("index:", i, "value:", num)
	}
	let arr = ["a", "b", "c"]
	for (let i = 0; i < $.len(arr); i++) {
		let s = arr[i]
		$.println("index:", i, "value:", s)
	}
	let str = "go"
	for (let i = 0; i < $.len(str); i++) {
		let c = str[i]
		$.println("index:", i, "value:", c)
	}
	$.println("Ranging over slice (no key/value):")
	for (let __rangeIndex = 0; __rangeIndex < $.len(nums); __rangeIndex++) {
		$.println("Iterating slice")
	}
	$.println("Ranging over array (no key/value):")
	for (let __rangeIndex = 0; __rangeIndex < $.len(arr); __rangeIndex++) {
		$.println("Iterating array")
	}
	$.println("Ranging over string (no key/value):")
	for (let __rangeIndex = 0; __rangeIndex < $.len(str); __rangeIndex++) {
		$.println("Iterating string")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
