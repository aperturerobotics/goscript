// Generated file based on range_const_reassign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let s = "abc"
	for (let __rangeIndex = 0; __rangeIndex < $.len(s); __rangeIndex++) {
		let c = s[__rangeIndex]
		if (c >= 97) {
			c = c - 97 + 10
		}
		$.println($.int(c))
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
