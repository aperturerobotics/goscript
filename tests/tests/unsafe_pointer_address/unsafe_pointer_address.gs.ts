// Generated file based on unsafe_pointer_address.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export function anyOverlap(x: $.Slice<number>, y: $.Slice<number>): boolean {
	return ((($.len(x) > 0) && ($.len(y) > 0)) && ($.indexByteAddress(x!, 0, 1) <= $.indexByteAddress(y!, $.len(y) - 1, 1))) && ($.indexByteAddress(y!, 0, 1) <= $.indexByteAddress(x!, $.len(x) - 1, 1))
}

export function sameStart(x: $.Slice<number>, y: $.Slice<number>): boolean {
	return (($.len(x) > 0) && ($.len(y) > 0)) && ($.indexAddress(x!, 0) == $.indexAddress(y!, 0))
}

export function parenIndexValue(x: $.Slice<number>, i: number): number {
	return $.uint($.pointerValue<number>(($.indexRef(x!, i))), 8)
}

export async function main(): globalThis.Promise<void> {
	let buf: $.Slice<number> = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8), $.uint(4, 8)])
	let left: $.Slice<number> = $.goSlice(buf, 1, 3)
	let right: $.Slice<number> = $.goSlice(buf, 2, 4)
	let other: $.Slice<number> = $.arrayToSlice<number>([$.uint(8, 8), $.uint(9, 8)])

	$.println("overlap:", anyOverlap(left, right))
	$.println("separate:", anyOverlap(left, other))
	$.println("same:", sameStart(left, $.goSlice(buf, 1, undefined)))
	$.println("different:", sameStart(left, right))
	$.println("paren:", $.uint(parenIndexValue(buf, 2), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
