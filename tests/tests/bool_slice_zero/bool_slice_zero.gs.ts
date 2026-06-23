// Generated file based on bool_slice_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let values: $.Slice<boolean> = $.makeSlice<boolean>(3, undefined, "boolean")
	$.println($.arrayIndex(values!, 0), $.arrayIndex(values!, 1), $.arrayIndex(values!, 2))
	values![1] = true
	$.println($.arrayIndex(values!, 0), $.arrayIndex(values!, 1), $.arrayIndex(values!, 2))
}

if ($.isMainScript(import.meta)) {
	await main()
}
