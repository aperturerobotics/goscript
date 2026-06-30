// Generated file based on atoi.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_math from "./math.gs.ts"
import "./math.gs.ts"

export type Error = number

export const ErrRange: Error = 1

export const ErrSyntax: Error = 2

export const ErrBase: Error = 3

export const ErrBitSize: Error = 4

export const intSize: number = 64

export const IntSize: number = 64

export function lower(c: number): number {
	return $.uint(c | (120 - 88), 8)
}

export function Error_Error(e: Error): string {
	switch (e) {
		case 1:
		{
			return "value out of range"
			break
		}
		case 2:
		{
			return "invalid syntax"
			break
		}
		case 3:
		{
			return "invalid base"
			break
		}
		case 4:
		{
			return "invalid bit size"
			break
		}
	}
	return "unknown error"
}

export function ParseUint(s: string, base: number, bitSize: number): [bigint, $.GoError] {
	const fnParseUint: string = "ParseUint"

	if ($.stringEqual(s, "")) {
		return [0n, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}

	let base0 = base == 0

	let s0 = s
	switch (true) {
		case (2 <= base) && (base <= 36):
		{
			break
		}
		case base == 0:
		{
			base = 10
			if ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(48, 8)) {
				switch (true) {
					case ($.len(s) >= 3) && ($.uint(lower($.uint($.indexStringOrBytes(s, 1), 8)), 8) == $.uint(98, 8)):
					{
						base = 2
						s = $.sliceStringOrBytes(s, 2, undefined)
						break
					}
					case ($.len(s) >= 3) && ($.uint(lower($.uint($.indexStringOrBytes(s, 1), 8)), 8) == $.uint(111, 8)):
					{
						base = 8
						s = $.sliceStringOrBytes(s, 2, undefined)
						break
					}
					case ($.len(s) >= 3) && ($.uint(lower($.uint($.indexStringOrBytes(s, 1), 8)), 8) == $.uint(120, 8)):
					{
						base = 16
						s = $.sliceStringOrBytes(s, 2, undefined)
						break
					}
					default:
					{
						base = 8
						s = $.sliceStringOrBytes(s, 1, undefined)
						break
					}
				}
			}
			break
		}
		default:
		{
			return [0n, $.namedValueInterfaceValue<$.GoError>(3, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
			break
		}
	}

	if (bitSize == 0) {
		bitSize = 64
	} else {
		if ((bitSize < 0) || (bitSize > 64)) {
			return [0n, $.namedValueInterfaceValue<$.GoError>(4, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
		}
	}

	// Cutoff is the smallest number such that cutoff*base > maxUint64.
	// Use compile-time constants for common cases.
	let cutoff: bigint = 0n
	switch (base) {
		case 10:
		{
			cutoff = 1844674407370955162n
			break
		}
		case 16:
		{
			cutoff = 1152921504606846976n
			break
		}
		default:
		{
			cutoff = $.uint64Add(($.uint64Div(18446744073709551615, $.uint64(base))), 1)
			break
		}
	}

	let maxVal = $.uint64Sub(($.uint64Shl(1n, $.uint(bitSize, 64))), 1)

	let underscores = false
	let n: bigint = 0n
	for (let __goscriptRangeTarget0 = $.stringToBytes(s), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let c = __goscriptRangeTarget0![__rangeIndex]
		let d: number = 0
		switch (true) {
			case ($.uint(c, 8) == $.uint(95, 8)) && base0:
			{
				underscores = true
				continue
				break
			}
			case ($.uint(48, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(57, 8)):
			{
				d = $.uint(c - 48, 8)
				break
			}
			case ($.uint(97, 8) <= $.uint(lower($.uint(c, 8)), 8)) && ($.uint(lower($.uint(c, 8)), 8) <= $.uint(122, 8)):
			{
				d = $.uint((lower($.uint(c, 8)) - 97) + 10, 8)
				break
			}
			default:
			{
				return [0n, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
				break
			}
		}

		if ($.uint(d, 8) >= $.uint($.uint(base, 8), 8)) {
			return [0n, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
		}

		if (n >= cutoff) {
			// n*base overflows
			return [maxVal, $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
		}
		n = $.uint64Mul(n, $.uint64(base))

		let n1 = $.uint64Add(n, $.uint64(d))
		if ((n1 < n) || (n1 > maxVal)) {
			// n+d overflows
			return [maxVal, $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
		}
		n = n1
	}

	if (underscores && !underscoreOK(s0)) {
		return [0n, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}

	return [n, null]
}

export function ParseInt(s: string, base: number, bitSize: number): [bigint, $.GoError] {
	let i: bigint = 0n
	let err: $.GoError = null as $.GoError
	const fnParseInt: string = "ParseInt"

	if ($.stringEqual(s, "")) {
		return [0n, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}

	// Pick off leading sign.
	let neg = false
	switch ($.indexStringOrBytes(s, 0)) {
		case 43:
		{
			s = $.sliceStringOrBytes(s, 1, undefined)
			break
		}
		case 45:
		{
			s = $.sliceStringOrBytes(s, 1, undefined)
			neg = true
			break
		}
	}

	// Convert unsigned and check range.
	let un: bigint = 0n
	let __goscriptTuple0: any = ParseUint(s, base, bitSize)
	un = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	if ((err != null) && (!$.comparableEqual(err, 1))) {
		return [0n, err]
	}

	if (bitSize == 0) {
		bitSize = 64
	}

	let cutoff = $.uint64($.uint64Shl(1, $.uint(bitSize - 1, 64)))
	if (!neg && (un >= cutoff)) {
		return [$.int64($.uint64Sub(cutoff, 1)), $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}
	if (neg && (un > cutoff)) {
		return [-$.int64(cutoff), $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}
	let n = $.int64(un)
	if (neg) {
		n = -n
	}
	return [n, null]
}

export function Atoi(s: string): [number, $.GoError] {
	const fnAtoi: string = "Atoi"

	let sLen = $.len(s)
	if ((((64 as number) == 32) && ((0 < sLen) && (sLen < 10))) || (((64 as number) == 64) && ((0 < sLen) && (sLen < 19)))) {
		// Fast path for small integers that fit int type.
		let s0 = s
		if (($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(45, 8)) || ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(43, 8))) {
			s = $.sliceStringOrBytes(s, 1, undefined)
			if ($.len(s) < 1) {
				return [0, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
			}
		}

		let n = 0
		for (let __goscriptRangeTarget1 = $.stringToBytes(s), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let ch = __goscriptRangeTarget1![__rangeIndex]
			ch = ch - ($.uint(48, 8))
			if ($.uint(ch, 8) > $.uint(9, 8)) {
				return [0, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
			}
			n = (n * 10) + $.int(ch)
		}
		if ($.uint($.indexStringOrBytes(s0, 0), 8) == $.uint(45, 8)) {
			n = -n
		}
		return [n, null]
	}

	// Slow path for invalid, big, or underscored integers.
	let [i64, err] = ParseInt(s, 10, 0)
	return [$.int(i64), err]
}

export function underscoreOK(s: string): boolean {
	// saw tracks the last character (class) we saw:
	// ^ for beginning of number,
	// 0 for a digit or base prefix,
	// _ for an underscore,
	// ! for none of the above.
	let saw = $.int(94, 32)
	let i = 0

	// Optional sign.
	if (($.len(s) >= 1) && (($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(45, 8)) || ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(43, 8)))) {
		s = $.sliceStringOrBytes(s, 1, undefined)
	}

	// Optional base prefix.
	let hex = false
	if ((($.len(s) >= 2) && ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(48, 8))) && ((($.uint(lower($.uint($.indexStringOrBytes(s, 1), 8)), 8) == $.uint(98, 8)) || ($.uint(lower($.uint($.indexStringOrBytes(s, 1), 8)), 8) == $.uint(111, 8))) || ($.uint(lower($.uint($.indexStringOrBytes(s, 1), 8)), 8) == $.uint(120, 8)))) {
		i = 2
		saw = $.int(48, 32)
		hex = $.uint(lower($.uint($.indexStringOrBytes(s, 1), 8)), 8) == $.uint(120, 8)
	}

	// Number proper.
	for (; i < $.len(s); i++) {
		// Digits are always okay.
		if ((($.uint(48, 8) <= $.uint($.indexStringOrBytes(s, i), 8)) && ($.uint($.indexStringOrBytes(s, i), 8) <= $.uint(57, 8))) || ((hex && ($.uint(97, 8) <= $.uint(lower($.uint($.indexStringOrBytes(s, i), 8)), 8))) && ($.uint(lower($.uint($.indexStringOrBytes(s, i), 8)), 8) <= $.uint(102, 8)))) {
			saw = $.int(48, 32)
			continue
		}
		// Underscore must follow digit.
		if ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(95, 8)) {
			if ($.int(saw, 32) != $.int(48, 32)) {
				return false
			}
			saw = $.int(95, 32)
			continue
		}
		// Underscore must also be followed by digit.
		if ($.int(saw, 32) == $.int(95, 32)) {
			return false
		}
		// Saw non-digit, non-underscore.
		saw = $.int(33, 32)
	}
	return $.int(saw, 32) != $.int(95, 32)
}
