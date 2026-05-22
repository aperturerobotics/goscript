// Generated file based on for_range_value_only.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"

export async function main(): globalThis.Promise<void> {
	let s = $.arrayToSlice<number>([10, 20, 30])
	let sum = 0
	for (let __goscriptRangeTarget0 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let v = __goscriptRangeTarget0![__rangeIndex]
		sum += v
		$.println(v)
	}
	$.println(sum)

	let arr = ["a", "b", "c"]
	let concat: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	for (let __goscriptRangeTarget1 = arr, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let val = __goscriptRangeTarget1[__rangeIndex]
		concat.value.WriteString(val)
		$.println(val)
	}
	$.println(concat.value.String())

	// Test with blank identifier for value (should still iterate)
	$.println("Ranging with blank identifier for value:")
	let count = 0
	for (let __goscriptRangeTarget2 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		count++
	}
	$.println(count)
}

if ($.isMainScript(import.meta)) {
	await main()
}
