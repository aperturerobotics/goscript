// Generated file based on for_range_index_use.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let slice = $.arrayToSlice<number>([10, 20, 30, 40, 50])
	let sum = 0
	for (let __goscriptRangeTarget0 = slice, idx = 0; idx < $.len(__goscriptRangeTarget0); idx++) {
		let val = __goscriptRangeTarget0![idx]
		sum += val
		$.println("Range idx:", idx, "val:", val)
	}
	$.println("Sum:", sum)
}

if ($.isMainScript(import.meta)) {
	await main()
}
