// Generated file based on range_const_reassign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let s = "abc"
	for (let [__rangeIndex, c] of $.rangeString(s)) {
		if (c >= 97) {
			c = (c - 97) + 10
		}
		$.println($.int(c))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
