// Generated file based on for_range_key_only.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let s = $.arrayToSlice<number>([10, 20, 30])
	$.println("Looping over slice (key only):")
	for (let __goscriptRangeTarget0 = s, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		$.println(i)
	}
	// Expected output:
	// 0
	// 1
	// 2

	let a = ["alpha", "beta"]
	$.println("Looping over array (key only):")
	for (let __goscriptRangeTarget1 = a, k = 0; k < $.len(__goscriptRangeTarget1); k++) {
		$.println(k)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
