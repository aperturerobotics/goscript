// Generated file based on unsafe_pointer_address.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

export function anyOverlap(x: $.Slice<number>, y: $.Slice<number>): boolean {
	return ((($.len(x) > 0) && ($.len(y) > 0)) && ($.indexAddress(x!, 0) <= $.indexAddress(y!, $.len(y) - 1))) && ($.indexAddress(y!, 0) <= $.indexAddress(x!, $.len(x) - 1))
}

export function sameStart(x: $.Slice<number>, y: $.Slice<number>): boolean {
	return (($.len(x) > 0) && ($.len(y) > 0)) && ($.indexAddress(x!, 0) == $.indexAddress(y!, 0))
}

export async function main(): Promise<void> {
	let buf = $.arrayToSlice<number>([1, 2, 3, 4])
	let left = $.goSlice(buf, 1, 3)
	let right = $.goSlice(buf, 2, 4)
	let other = $.arrayToSlice<number>([8, 9])

	$.println("overlap:", anyOverlap(left, right))
	$.println("separate:", anyOverlap(left, other))
	$.println("same:", sameStart(left, $.goSlice(buf, 1, undefined)))
	$.println("different:", sameStart(left, right))
}


if ($.isMainScript(import.meta)) {
	await main()
}
