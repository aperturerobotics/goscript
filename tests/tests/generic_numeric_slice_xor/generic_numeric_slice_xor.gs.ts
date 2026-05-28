// Generated file based on generic_numeric_slice_xor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function xorLoop<T>(__typeArgs: $.GenericTypeArgs | undefined, dst: $.Slice<T>, x: $.Slice<T>, y: $.Slice<T>): void {
	x = $.goSlice(x, undefined, $.len(dst))
	y = $.goSlice(y, undefined, $.len(dst))
	for (let __goscriptRangeTarget0 = dst, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		dst![i] = (x![i] as any) ^ (y![i] as any)
	}
}

export async function main(): globalThis.Promise<void> {
	let dst: $.Slice<number> = $.arrayToSlice<number>([$.uint(0, 8), $.uint(0, 8)])
	xorLoop({T: { type: { kind: $.TypeKind.Basic, name: "uint8" }, zero: () => 0 }}, dst, $.arrayToSlice<number>([$.uint(1, 8), $.uint(3, 8)]), $.arrayToSlice<number>([$.uint(2, 8), $.uint(1, 8)]))
	$.println($.uint(dst![0], 8), $.uint(dst![1], 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
