// Generated file based on crc32_generic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as __goscript_crc32 from "./crc32.gs.ts"
import "@goscript/internal/byteorder/index.js"
import "./crc32.gs.ts"

export const slicing8Cutoff: number = 16

export function simpleMakeTable(poly: number): $.VarRef<__goscript_crc32.Table> | null {
	let t: $.VarRef<__goscript_crc32.Table> | null = $.varRef<__goscript_crc32.Table>(Array.from({ length: 256 }, () => 0))
	simplePopulateTable($.uint(poly, 32), t)
	return t
}

export function simplePopulateTable(poly: number, t: $.VarRef<__goscript_crc32.Table> | null): void {
	for (let i = 0; i < 256; i++) {
		let crc = $.uint($.uint(i, 32), 32)
		for (let j = 0; j < 8; j++) {
			if ($.uint((crc & 1), 32) == $.uint(1, 32)) {
				crc = $.uint(($.uintShr(crc, 1, 32)) ^ poly, 32)
			} else {
				crc = (crc >>> ($.uint(1, 32))) >>> 0
			}
		}
		$.pointerValue<number[]>(t)[i] = $.uint(crc, 32)
	}
}

export function simpleUpdate(crc: number, tab: $.VarRef<__goscript_crc32.Table> | null, p: $.Slice<number>): number {
	crc = $.uint($.uint(~crc, 32), 32)
	for (let __goscriptRangeTarget0 = p, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let v = __goscriptRangeTarget0![__rangeIndex]
		crc = $.uint($.pointerValue<number[]>(tab)[$.uint(crc, 8) ^ v] ^ ($.uintShr(crc, 8, 32)), 32)
	}
	return $.uint($.uint(~crc, 32), 32)
}

export type slicing8Table = __goscript_crc32.Table[]

export function slicingMakeTable(poly: number): $.VarRef<slicing8Table> | null {
	let t: $.VarRef<slicing8Table> | null = $.varRef<slicing8Table>(Array.from({ length: 8 }, () => Array.from({ length: 256 }, () => 0)))
	simplePopulateTable($.uint(poly, 32), $.indexRef($.pointerValue<__goscript_crc32.Table[]>(t), 0))
	for (let i = 0; i < 256; i++) {
		let crc = $.uint($.pointerValue<__goscript_crc32.Table[]>(t)[0][i], 32)
		for (let j = 1; j < 8; j++) {
			crc = $.uint($.pointerValue<__goscript_crc32.Table[]>(t)[0][crc & 0xFF] ^ ($.uintShr(crc, 8, 32)), 32)
			$.pointerValue<__goscript_crc32.Table[]>(t)[j][i] = $.uint(crc, 32)
		}
	}
	return t
}

export function slicingUpdate(crc: number, tab: $.VarRef<slicing8Table> | null, p: $.Slice<number>): number {
	if ($.len(p) >= slicing8Cutoff) {
		crc = $.uint($.uint(~crc, 32), 32)
		while ($.len(p) > 8) {
			crc = crc ^ ($.uint(byteorder.LEUint32(p), 32))
			crc = $.uint((((((($.pointerValue<__goscript_crc32.Table[]>(tab)[0][p![7]] ^ $.pointerValue<__goscript_crc32.Table[]>(tab)[1][p![6]]) ^ $.pointerValue<__goscript_crc32.Table[]>(tab)[2][p![5]]) ^ $.pointerValue<__goscript_crc32.Table[]>(tab)[3][p![4]]) ^ $.pointerValue<__goscript_crc32.Table[]>(tab)[4][$.uintShr(crc, 24, 32)]) ^ $.pointerValue<__goscript_crc32.Table[]>(tab)[5][($.uintShr(crc, 16, 32)) & 0xFF]) ^ $.pointerValue<__goscript_crc32.Table[]>(tab)[6][($.uintShr(crc, 8, 32)) & 0xFF]) ^ $.pointerValue<__goscript_crc32.Table[]>(tab)[7][crc & 0xFF], 32)
			p = $.goSlice(p, 8, undefined)
		}
		crc = $.uint($.uint(~crc, 32), 32)
	}
	if ($.len(p) == 0) {
		return $.uint(crc, 32)
	}
	return $.uint(simpleUpdate($.uint(crc, 32), $.indexRef($.pointerValue<__goscript_crc32.Table[]>(tab), 0), p), 32)
}
