// Generated file based on slice_copy_overlap.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let right: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	let n = $.copy($.goSlice(right, 2, undefined), $.goSlice(right, 1, 4))
	$.println("right count:", n)
	$.println("right:", right![0], right![1], right![2], right![3], right![4])

	let left: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	n = $.copy($.goSlice(left, 1, undefined), $.goSlice(left, 2, undefined))
	$.println("left count:", n)
	$.println("left:", left![0], left![1], left![2], left![3], left![4])
}

if ($.isMainScript(import.meta)) {
	await main()
}
