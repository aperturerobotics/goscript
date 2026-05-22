// Generated file based on wide_uint64_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function hash6(u: number, h: number): number {
	const prime6bytes: number = 227718039650203
	return $.uint($.uint($.uint64Shr(($.uint64Mul(($.uint64Shl(u, (64 - 48))), prime6bytes)), ((64 - h) & 63)), 32), 32)
}

export function mix(a: number, b: number): number {
	return $.uint64Shr(($.uint64Xor(($.uint64And(a, b)), ($.uint64Or(a, 1)))), 60)
}

export function highAfterMask(v: number): number {
	return $.uint64Mul(($.uint64And(v, 0xffff)), (2 ** 48))
}

export function combineHighLow(v: number, low: number): number {
	return $.uint64Add(($.uint64Mul(($.uint64And(v, 0xffff)), (2 ** 48))), $.uint($.uint(low, 16), 64))
}

export async function main(): globalThis.Promise<void> {
	$.println($.uint(hash6(0x0102030405, 14), 32))
	$.println(mix(0xf0f0f0f0f0f0f0f0, 0x0f0f0f0f0f0f0f0f))
	$.println($.uint($.uint($.uint64Shr(highAfterMask(0x1234), 48), 32), 32))
	$.println($.uint($.uint($.uint64Shr(combineHighLow(0x1234, 0xbeef), 48), 32), 32))
	$.println($.uint($.uint($.uint64And(combineHighLow(0x1234, 0xbeef), 0xffff), 32), 32))
}

if ($.isMainScript(import.meta)) {
	await main()
}
