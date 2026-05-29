// Generated file based on ctoa.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_ftoa from "./ftoa.gs.ts"
import "./ftoa.gs.ts"

export function FormatComplex(c: $.Complex, fmt: number, prec: number, bitSize: number): string {
	let buf: Uint8Array = new Uint8Array(64)
	return $.bytesToString(AppendComplex($.goSlice(buf, undefined, 0), c, $.uint(fmt, 8), prec, bitSize))
}

export function AppendComplex(dst: $.Slice<number>, c: $.Complex, fmt: number, prec: number, bitSize: number): $.Slice<number> {
	if ((bitSize != 64) && (bitSize != 128)) {
		$.panic("invalid bitSize")
	}
	bitSize = bitSize >> (1)

	dst = $.append(dst, $.uint(40, 8))
	dst = __goscript_ftoa.AppendFloat(dst, $.real(c), $.uint(fmt, 8), prec, bitSize)
	let i = $.len(dst)
	dst = __goscript_ftoa.AppendFloat(dst, $.imag(c), $.uint(fmt, 8), prec, bitSize)
	// Check if imaginary part has a sign. If not, add one.
	if (($.uint(dst![i], 8) != $.uint(43, 8)) && ($.uint(dst![i], 8) != $.uint(45, 8))) {
		dst = $.append(dst, $.uint(0, 8))
		$.copy($.goSlice(dst, i + 1, undefined), $.goSlice(dst, i, undefined))
		dst![i] = $.uint(43, 8)
	}
	dst = $.append(dst, ...($.stringToBytes("i)") ?? []))
	return dst
}
