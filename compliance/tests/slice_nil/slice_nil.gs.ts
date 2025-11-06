// Generated file based on slice_nil.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let s: $.Slice<number> = null
	console.log("s == nil:", s == null)

	// Slicing nil with valid bounds should work
	let s2 = $.goSlice(s, 0, 0)
	console.log("s[0:0] == nil:", s2 == null)

	let s3 = $.goSlice(s, undefined, 0)
	console.log("s[:0] == nil:", s3 == null)

	let s4 = $.goSlice(s, undefined, undefined)
	console.log("s[:] == nil:", s4 == null)

	console.log("slice_nil test passed")
}

