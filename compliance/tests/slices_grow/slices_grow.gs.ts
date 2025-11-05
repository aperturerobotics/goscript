// Generated file based on slices_grow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

export async function main(): Promise<void> {
	let s = $.arrayToSlice<number>([1, 2, 3])
	console.log("Before Grow: len=", $.len(s), "cap=", $.cap(s))
	s = slices.Grow(s, 5)
	console.log("After Grow: len=", $.len(s), "cap=", $.cap(s))
	console.log("slices.Grow test finished")
}

