// Generated file based on for_range_no_vars.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let s: $.Slice<number> = $.arrayToSlice<number>([10, 20, 30])
	$.println("Looping over slice (no vars):")
	let count = 0
	for (let __goscriptRangeTarget0 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		count++
	}
	$.println(count)

	let a = ["alpha", "beta"]
	$.println("Looping over array (no vars):")
	let arrCount = 0
	for (let __goscriptRangeTarget1 = a, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		$.println(a[arrCount])
		arrCount++
	}
	$.println(arrCount)

	$.println("Ranging over number (no vars):")
	let numCount = 0
	for (let __rangeIndex = 0; __rangeIndex < 5; __rangeIndex++) {
		numCount++
	}
	$.println(numCount)
}

if ($.isMainScript(import.meta)) {
	await main()
}
