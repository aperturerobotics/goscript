// Generated file based on clear_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let buf: $.Slice<number> = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)])
	$.clear(buf)
	$.println("bytes:", $.uint($.arrayIndex(buf!, 0), 8), $.uint($.arrayIndex(buf!, 1), 8), $.uint($.arrayIndex(buf!, 2), 8))

	let nums: $.Slice<number> = $.arrayToSlice<number>([4, 5, 6, 7])
	$.clear($.goSlice(nums, 1, 3))
	$.println("window:", $.arrayIndex(nums!, 0), $.arrayIndex(nums!, 1), $.arrayIndex(nums!, 2), $.arrayIndex(nums!, 3))

	let words: $.Slice<string> = $.arrayToSlice<string>(["a", "b"])
	$.clear(words)
	$.println("strings:", $.stringEqual($.arrayIndex(words!, 0), ""), $.stringEqual($.arrayIndex(words!, 1), ""))
}

if ($.isMainScript(import.meta)) {
	await main()
}
