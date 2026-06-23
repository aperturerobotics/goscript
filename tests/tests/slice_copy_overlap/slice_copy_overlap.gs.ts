// Generated file based on slice_copy_overlap.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let right: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	let n = $.copy($.goSlice(right, 2, undefined), $.goSlice(right, 1, 4))
	$.println("right count:", n)
	$.println("right:", $.arrayIndex(right!, 0), $.arrayIndex(right!, 1), $.arrayIndex(right!, 2), $.arrayIndex(right!, 3), $.arrayIndex(right!, 4))

	let left: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	n = $.copy($.goSlice(left, 1, undefined), $.goSlice(left, 2, undefined))
	$.println("left count:", n)
	$.println("left:", $.arrayIndex(left!, 0), $.arrayIndex(left!, 1), $.arrayIndex(left!, 2), $.arrayIndex(left!, 3), $.arrayIndex(left!, 4))
}

if ($.isMainScript(import.meta)) {
	await main()
}
