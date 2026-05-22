// Generated file based on slice_to_array_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let values = $.arrayToSlice<number>([1, 2, 3])
	let array = $.sliceToArray<number>($.goSlice(values, 1, undefined), 2)

	$.println(array[0], array[1])
	values![1] = 9
	$.println(array[0], values![1])
}


if ($.isMainScript(import.meta)) {
	await main()
}
