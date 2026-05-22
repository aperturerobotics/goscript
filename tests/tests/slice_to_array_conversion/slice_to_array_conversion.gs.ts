// Generated file based on slice_to_array_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let values = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)])
	let array = ($.sliceToArray<number>($.goSlice(values, 1, undefined), 2, "byte") as unknown as Uint8Array)

	$.println($.uint(array[0], 8), $.uint(array[1], 8))
	values![1] = $.uint(9, 8)
	$.println($.uint(array[0], 8), $.uint(values![1], 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
