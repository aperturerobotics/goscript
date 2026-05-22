// Generated file based on clear_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let buf = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)])
	$.clear(buf)
	$.println("bytes:", $.uint(buf![0], 8), $.uint(buf![1], 8), $.uint(buf![2], 8))

	let nums = $.arrayToSlice<number>([4, 5, 6, 7])
	$.clear($.goSlice(nums, 1, 3))
	$.println("window:", nums![0], nums![1], nums![2], nums![3])

	let words = $.arrayToSlice<string>(["a", "b"])
	$.clear(words)
	$.println("strings:", (words![0] as string) == "", (words![1] as string) == "")
}

if ($.isMainScript(import.meta)) {
	await main()
}
