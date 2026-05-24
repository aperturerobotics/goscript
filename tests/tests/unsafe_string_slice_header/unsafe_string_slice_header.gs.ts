// Generated file based on unsafe_string_slice_header.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/reflect/index.js"
import "@goscript/unsafe/index.js"

export function stringBytes(__goscriptParam0: string): $.Slice<number> {
	let s: $.VarRef<string> = $.varRef(__goscriptParam0)
	let b: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let strh: reflect.StringHeader | $.VarRef<reflect.StringHeader> | null = ($.stringHeaderRef(s) as unknown as reflect.StringHeader | $.VarRef<reflect.StringHeader> | null)
	let sh: reflect.SliceHeader | $.VarRef<reflect.SliceHeader> | null = ($.sliceHeaderRef(b) as unknown as reflect.SliceHeader | $.VarRef<reflect.SliceHeader> | null)
	$.pointerValue<reflect.SliceHeader>(sh).Data = $.pointerValue<reflect.StringHeader>(strh).Data
	$.pointerValue<reflect.SliceHeader>(sh).Len = $.pointerValue<reflect.StringHeader>(strh).Len
	$.pointerValue<reflect.SliceHeader>(sh).Cap = $.pointerValue<reflect.StringHeader>(strh).Len
	return b.value
}

export async function main(): globalThis.Promise<void> {
	let b: $.Slice<number> = stringBytes("abc")
	$.println($.len(b), $.cap(b), $.uint(b![0], 8), $.uint(b![1], 8), $.uint(b![2], 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
