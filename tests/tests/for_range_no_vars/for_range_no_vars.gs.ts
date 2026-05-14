// Generated file based on for_range_no_vars.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let s = [10, 20, 30]
	$.println("Looping over slice (no vars):")
	let count = 0
	for (let __rangeIndex = 0; __rangeIndex < $.len(s); __rangeIndex++) {
		count++
	}
	$.println(count)
	let a = ["alpha", "beta"]
	$.println("Looping over array (no vars):")
	let arrCount = 0
	for (let __rangeIndex = 0; __rangeIndex < $.len(a); __rangeIndex++) {
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
