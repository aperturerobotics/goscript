// Generated file based on unsafe_array_pointer_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export type shadow = Uint8Array

export async function main(): globalThis.Promise<void> {
	let buf: $.Slice<number> = $.arrayToSlice<number>([$.uint(9, 8), $.uint(1, 8), $.uint(2, 8), $.uint(3, 8), $.uint(4, 8)])
	let ptr: $.VarRef<Uint8Array> | null = ($.arrayPointerFromIndexRef<number>($.indexRef(buf!, 1), 4, 1, 1) as unknown as $.VarRef<Uint8Array> | null)
	let view: $.Slice<number> = $.goSlice($.pointerValue<Uint8Array>(ptr), undefined, undefined)
	$.println($.len(view), $.uint($.arrayIndex(view!, 0), 8), $.uint($.arrayIndex(view!, 3), 8))
	$.pointerValue<Uint8Array>(ptr)[2] = $.uint(7, 8)
	$.println($.uint($.arrayIndex(buf!, 3), 8))

	let __goscriptShadow0: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(4))
	fill(__goscriptShadow0)
	let shadowView: $.Slice<number> = $.goSlice(__goscriptShadow0.value, undefined, undefined)
	$.println($.len(shadowView), $.uint($.arrayIndex(shadowView!, 0), 8), $.uint($.arrayIndex(shadowView!, 3), 8))
}

export function fill(out: $.VarRef<Uint8Array> | null): void {
	$.pointerValue<Uint8Array>(out)[0] = $.uint(5, 8)
	$.pointerValue<Uint8Array>(out)[3] = $.uint(8, 8)
}

if ($.isMainScript(import.meta)) {
	await main()
}
