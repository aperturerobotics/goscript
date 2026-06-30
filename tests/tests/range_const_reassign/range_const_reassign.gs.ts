// Generated file based on range_const_reassign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let s = "abc"
	for (let [__rangeIndex, c] of $.rangeString(s)) {
		if ($.int(c, 32) >= $.int(97, 32)) {
			c = $.int((c - 97) + 10, 32)
		}
		$.println($.int(c))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
