// Generated file based on bool_slice_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let values = $.makeSlice<boolean>(3, undefined, "boolean")
	$.println(values![0], values![1], values![2])
	values![1] = true
	$.println(values![0], values![1], values![2])
}

if ($.isMainScript(import.meta)) {
	await main()
}
