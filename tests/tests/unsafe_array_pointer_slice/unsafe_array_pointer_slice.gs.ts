// Generated file based on unsafe_array_pointer_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

export async function main(): globalThis.Promise<void> {
	let buf = $.arrayToSlice<number>([$.uint(9, 8), $.uint(1, 8), $.uint(2, 8), $.uint(3, 8), $.uint(4, 8)])
	let ptr = ($.arrayPointerFromIndexRef<number>($.indexRef(buf!, 1), 4) as unknown as $.VarRef<Uint8Array> | null)
	let view = $.goSlice($.pointerValue<Uint8Array>(ptr), undefined, undefined)
	$.println($.len(view), $.uint(view![0], 8), $.uint(view![3], 8))
	$.pointerValue<Uint8Array>(ptr)[2] = $.uint(7, 8)
	$.println($.uint(buf![3], 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
