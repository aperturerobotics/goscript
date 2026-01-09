// Generated file based on for_range.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let nums = $.arrayToSlice<number>([2, 3, 4])
	let sum = 0
	for (let _i = 0; _i < $.len(nums); _i++) {
		let num = nums![_i]
		{
			sum += num
		}
	}
	$.println("sum:", sum)

	for (let i = 0; i < $.len(nums); i++) {
		let num = nums![i]
		{
			$.println("index:", i, "value:", num)
		}
	}

	// Test ranging over an array
	let arr = $.arrayToSlice<string>(["a", "b", "c"])
	for (let i = 0; i < $.len(arr); i++) {
		let s = arr![i]
		{
			$.println("index:", i, "value:", s)
		}
	}

	// Test ranging over a string
	let str = "go"

	// Note: c will be a rune (int32)
	{
		const _runes = $.stringToRunes(str)
		for (let i = 0; i < _runes.length; i++) {
			let c = _runes[i]
			{
				$.println("index:", i, "value:", c) // Note: c will be a rune (int32)
			}
		}
	}

	// Test ranging over a slice without key or value
	$.println("Ranging over slice (no key/value):")
	for (let _i = 0; _i < $.len(nums); _i++) {
		{
			$.println("Iterating slice")
		}
	}

	// Test ranging over an array without key or value
	$.println("Ranging over array (no key/value):")
	for (let _i = 0; _i < $.len(arr); _i++) {
		{
			$.println("Iterating array")
		}
	}

	// Test ranging over a string without key or value
	$.println("Ranging over string (no key/value):")
	{
		const _runes = $.stringToRunes(str)
		for (let i = 0; i < _runes.length; i++) {
			{
				$.println("Iterating string")
			}
		}
	}
}

