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

export function ParseUint(s: string, base: number, bitSize: number): [number, $.GoError] {
	const fnParseUint: string = "ParseUint"

	if ($.stringEqual(s, "")) {
		return [$.uint(0, 64), $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
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
			return [$.uint(0, 64), $.namedValueInterfaceValue<$.GoError>(3, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
			break
		}
	}

	if (bitSize == 0) {
		bitSize = 64
	} else {
		if ((bitSize < 0) || (bitSize > 64)) {
			return [$.uint(0, 64), $.namedValueInterfaceValue<$.GoError>(4, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
		}
	}

	// Cutoff is the smallest number such that cutoff*base > maxUint64.
	// Use compile-time constants for common cases.
	let cutoff: number = 0
	switch (base) {
		case 10:
		{
			cutoff = $.uint("1844674407370955162", 64)
			break
		}
		case 16:
		{
			cutoff = $.uint("1152921504606846976", 64)
			break
		}
		default:
		{
			cutoff = $.uint($.uint64Add(($.uint64Div(18446744073709551615, $.uint(base, 64))), 1), 64)
			break
		}
	}

	let maxVal = $.uint($.uint64Sub(($.uint64Shl($.uint(1, 64), $.uint(bitSize, 64))), 1), 64)

	let underscores = false
	let n: number = 0
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
			case (48 <= c) && (c <= 57):
			{
				d = $.uint(c - 48, 8)
				break
			}
			case (97 <= lower($.uint(c, 8))) && (lower($.uint(c, 8)) <= 122):
			{
				d = $.uint((lower($.uint(c, 8)) - 97) + 10, 8)
				break
			}
			default:
			{
				return [$.uint(0, 64), $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
				break
			}
		}

		if (d >= $.uint(base, 8)) {
			return [$.uint(0, 64), $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
		}

		if (n >= cutoff) {
			// n*base overflows
			return [$.uint(maxVal, 64), $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
		}
		n = $.uint64Mul(n, $.uint($.uint(base, 64), 64))

		let n1 = $.uint($.uint64Add(n, $.uint(d, 64)), 64)
		if ((n1 < n) || (n1 > maxVal)) {
			// n+d overflows
			return [$.uint(maxVal, 64), $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
		}
		n = $.uint(n1, 64)
	}

	if (underscores && !underscoreOK(s0)) {
		return [$.uint(0, 64), $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}

	return [$.uint(n, 64), null]
}

export function ParseInt(s: string, base: number, bitSize: number): [number, $.GoError] {
	let i: number = 0
	let err: $.GoError = null as $.GoError
	const fnParseInt: string = "ParseInt"

	if ($.stringEqual(s, "")) {
		return [$.int(0), $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
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
	let un: number = 0
	let __goscriptTuple0: any = ParseUint(s, base, bitSize)
	un = $.uint(__goscriptTuple0[0], 64)
	err = __goscriptTuple0[1]
	if ((err != null) && (!$.comparableEqual(err, 1))) {
		return [$.int(0), err]
	}

	if (bitSize == 0) {
		bitSize = 64
	}

	let cutoff = $.uint($.uint($.uint64Shl(1, $.uint(bitSize - 1, 64)), 64), 64)
	if (!neg && (un >= cutoff)) {
		return [$.int($.int($.uint64Sub(cutoff, 1))), $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}
	if (neg && (un > cutoff)) {
		return [$.int(-$.int(cutoff)), $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}
	let n = $.int($.int(un))
	if (neg) {
		n = $.int(-n)
	}
	return [$.int(n), null]
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
			if (ch > 9) {
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
	let __goscriptTuple1: any = ParseInt(s, 10, 0)
	let i64 = $.int(__goscriptTuple1[0])
	let err = __goscriptTuple1[1]
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
		if (((48 <= $.indexStringOrBytes(s, i)) && ($.indexStringOrBytes(s, i) <= 57)) || ((hex && (97 <= lower($.uint($.indexStringOrBytes(s, i), 8)))) && (lower($.uint($.indexStringOrBytes(s, i), 8)) <= 102))) {
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
