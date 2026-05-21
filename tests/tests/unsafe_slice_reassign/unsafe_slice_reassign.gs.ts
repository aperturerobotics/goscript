// Generated file based on unsafe_slice_reassign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

export function reslice(ptr: $.VarRef<number> | null, n: number): void {
	let s = (unsafe.Slice!(ptr, n) as $.Slice<number>)
	s = $.goSlice(s, 1, undefined)
	s
}

export async function main(): Promise<void> {
	$.println("ok")
}


if ($.isMainScript(import.meta)) {
	await main()
}
