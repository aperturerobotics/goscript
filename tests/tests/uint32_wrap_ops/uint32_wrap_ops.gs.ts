// Generated file based on uint32_wrap_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function checksum(c: number): number {
	return $.uint(c + 2, 32)
}

export async function main(): globalThis.Promise<void> {
	let c: number = $.uint(4294967295, 32)
	let v = $.uint(checksum($.uint(c, 32)), 32)
	$.println($.uint(v, 32) == $.uint(1, 32))
	$.println($.uint($.uint(v, 8), 8) == $.uint(1, 8))
	let high: number = $.uint(0x80000000, 32)
	$.println($.uint(($.uintShr(high, 31, 32)), 32) == $.uint(1, 32))
	high = (high >>> ($.uint(1, 32))) >>> 0
	$.println($.uint(high, 32) == $.uint(0x40000000, 32))
	$.println($.uint(($.uint(~$.uint(0, 16), 16) as number), 16) == $.uint(0xffff, 16))
	$.println($.uint(($.uintShr(high, 32, 32)), 32) == $.uint(0, 32))
	let count: number = 0
	for (let mask = $.uint($.uint(8, 8), 8); $.uint(mask, 8) <= $.uint(24, 8); [mask, count] = [$.uint(mask - 8, 8), count + 1]) {
		$.println($.uint(mask, 8))
	}
	$.println(count)
}

if ($.isMainScript(import.meta)) {
	await main()
}
