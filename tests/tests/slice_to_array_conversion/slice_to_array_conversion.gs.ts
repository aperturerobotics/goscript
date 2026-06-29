// Generated file based on slice_to_array_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let values: $.Slice<number> = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)])
	let array = ($.sliceToArray<number>($.goSlice(values, 1, undefined), 2, "byte") as Uint8Array)

	$.println($.uint($.arrayIndex(array, 0), 8), $.uint($.arrayIndex(array, 1), 8))
	values![1] = $.uint(9, 8)
	$.println($.uint($.arrayIndex(array, 0), 8), $.uint($.arrayIndex(values!, 1), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
