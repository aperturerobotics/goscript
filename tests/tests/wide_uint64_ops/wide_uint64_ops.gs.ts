// Generated file based on wide_uint64_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"
import "@goscript/math/index.js"

export function hash6(u: number, h: number): number {
	const prime6bytes: number = 227718039650203
	return $.uint($.uint($.uint64Shr(($.uint64Mul(($.uint64Shl(u, (64 - 48))), prime6bytes)), ((64 - h) & 63)), 32), 32)
}

export function mix(a: number, b: number): number {
	return $.uint($.uint64Shr(($.uint64Xor(($.uint64And(a, b)), ($.uint64Or(a, 1)))), 60), 64)
}

export function highAfterMask(v: number): number {
	return $.uint($.uint64Mul(($.uint64And(v, 0xffff)), (2 ** 48)), 64)
}

export function combineHighLow(v: number, low: number): number {
	return $.uint($.uint64Add(($.uint64Mul(($.uint64And(v, 0xffff)), (2 ** 48))), $.uint($.uint(low, 16), 64)), 64)
}

export function maxUint64Divisor(d: number): number {
	return $.uint($.uint64Div(math.MaxUint64, d), 64)
}

export function maxUint64Remainder(d: number): number {
	return $.uint($.uint64Mod(math.MaxUint64, d), 64)
}

export function setHighBit(idx: number): boolean {
	let words: $.Slice<number> = $.arrayToSlice<number>([$.uint(0, 64), $.uint(0, 64)])
	words![$.uint64Div(idx, 64)] = $.uint64Or(words![$.uint64Div(idx, 64)], $.uint($.uint64Shl($.uint(1, 64), ($.uint64Mod(idx, 64))), 64))
	return $.uint(words![1], 64) != $.uint(0, 64)
}

export async function main(): globalThis.Promise<void> {
	$.println($.uint(hash6($.uint(0x0102030405, 64), 14), 32))
	$.println($.uint(mix($.uint(0xf0f0f0f0f0f0f0f0, 64), $.uint(0x0f0f0f0f0f0f0f0f, 64)), 64))
	$.println($.uint($.uint($.uint64Shr(highAfterMask($.uint(0x1234, 64)), 48), 32), 32))
	$.println($.uint($.uint($.uint64Shr(combineHighLow($.uint(0x1234, 64), $.uint(0xbeef, 64)), 48), 32), 32))
	$.println($.uint($.uint($.uint64And(combineHighLow($.uint(0x1234, 64), $.uint(0xbeef, 64)), 0xffff), 32), 32))
	$.println($.uint(maxUint64Divisor($.uint(4114, 64)), 64))
	$.println($.uint(maxUint64Remainder($.uint(4114, 64)), 64))
	$.println(setHighBit($.uint(maxUint64Remainder($.uint(128, 64)), 64)))
}

if ($.isMainScript(import.meta)) {
	await main()
}
