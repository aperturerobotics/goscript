// Generated file based on atof.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_atofeisel from "./atofeisel.gs.ts"

import * as __goscript_atoi from "./atoi.gs.ts"

import * as __goscript_decimal from "./decimal.gs.ts"

import * as __goscript_deps from "./deps.gs.ts"

import * as __goscript_ftoa from "./ftoa.gs.ts"
import "./atofeisel.gs.ts"
import "./atoi.gs.ts"
import "./decimal.gs.ts"
import "./deps.gs.ts"
import "./ftoa.gs.ts"

export const fnParseFloat: string = "ParseFloat"

export let optimize: boolean = true

export function __goscript_set_optimize(__goscriptValue: boolean): void {
	optimize = __goscriptValue
}

export function commonPrefixLenIgnoreCase(s: string, prefix: string): number {
	let n = $.min($.len(prefix), $.len(s))
	for (let i = 0; i < n; i++) {
		let c = $.uint($.indexStringOrBytes(s, i), 8)
		if ((65 <= c) && (c <= 90)) {
			c = c + ($.uint(97 - 65, 8))
		}
		if ($.uint(c, 8) != $.uint($.indexStringOrBytes(prefix, i), 8)) {
			return i
		}
	}
	return n
}

export function special(s: string): [number, number, boolean] {
	let f: number = 0
	let n: number = 0
	let ok: boolean = false
	if ($.len(s) == 0) {
		return [0, 0, false]
	}
	let sign = 1
	let nsign = 0
	switch ($.indexStringOrBytes(s, 0)) {
		case 43:
		case 45:
		{
			if ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(45, 8)) {
				sign = -1
			}
			nsign = 1
			s = $.sliceStringOrBytes(s, 1, undefined)
		}
		case 105:
		case 73:
		{
			let __goscriptShadow0 = commonPrefixLenIgnoreCase(s, "infinity")
			// Anything longer than "inf" is ok, but if we
			// don't have "infinity", only consume "inf".
			if ((3 < __goscriptShadow0) && (__goscriptShadow0 < 8)) {
				__goscriptShadow0 = 3
			}
			if ((__goscriptShadow0 == 3) || (__goscriptShadow0 == 8)) {
				return [__goscript_deps.inf(sign), nsign + __goscriptShadow0, true]
			}
			break
		}
		case 110:
		case 78:
		{
			if (commonPrefixLenIgnoreCase(s, "nan") == 3) {
				return [__goscript_deps.nan(), 3, true]
			}
			break
		}
	}
	return [0, 0, false]
}

export function readFloat(s: string): [bigint, number, boolean, boolean, boolean, number, boolean] {
	let mantissa: bigint = 0n
	let exp: number = 0
	let neg: boolean = false
	let trunc: boolean = false
	let hex: boolean = false
	let i: number = 0
	let ok: boolean = false
	let underscores = false

	// optional sign
	if (i >= $.len(s)) {
		return [mantissa, exp, neg, trunc, hex, i, ok]
	}
	switch ($.indexStringOrBytes(s, i)) {
		case 43:
		{
			i++
			break
		}
		case 45:
		{
			i++
			neg = true
			break
		}
	}

	// digits
	let base = 10n
	let maxMantDigits = 19
	let expChar = $.uint($.uint(101, 8), 8)
	if ((((i + 2) < $.len(s)) && ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(48, 8))) && ($.uint(__goscript_atoi.lower($.uint($.indexStringOrBytes(s, i + 1), 8)), 8) == $.uint(120, 8))) {
		base = 16n
		maxMantDigits = 16
		i = i + (2)
		expChar = $.uint(112, 8)
		hex = true
	}
	let sawdot = false
	let sawdigits = false
	let nd = 0
	let ndMant = 0
	let dp = 0
	loop: for (; i < $.len(s); i++) {
		{
			let c = $.uint($.indexStringOrBytes(s, i), 8)
			switch ((true as boolean)) {
				case $.uint(c, 8) == $.uint(95, 8):
				{
					underscores = true
					continue
					break
				}
				case $.uint(c, 8) == $.uint(46, 8):
				{
					if (sawdot) {
						break loop
					}
					sawdot = true
					dp = nd
					continue
					break
				}
				case (48 <= c) && (c <= 57):
				{
					sawdigits = true
					if (($.uint(c, 8) == $.uint(48, 8)) && (nd == 0)) {
						dp--
						continue
					}
					nd++
					if (ndMant < maxMantDigits) {
						mantissa = $.uint64Mul(mantissa, base)
						mantissa = $.uint64Add(mantissa, $.uint64(c - 48))
						ndMant++
					} else {
						if ($.uint(c, 8) != $.uint(48, 8)) {
							trunc = true
						}
					}
					continue
					break
				}
				case ((base == 16n) && (97 <= __goscript_atoi.lower($.uint(c, 8)))) && (__goscript_atoi.lower($.uint(c, 8)) <= 102):
				{
					sawdigits = true
					nd++
					if (ndMant < maxMantDigits) {
						mantissa = $.uint64Mul(mantissa, 16n)
						mantissa = $.uint64Add(mantissa, $.uint64((__goscript_atoi.lower($.uint(c, 8)) - 97) + 10))
						ndMant++
					} else {
						trunc = true
					}
					continue
					break
				}
			}
		}
		break
	}
	if (!sawdigits) {
		return [mantissa, exp, neg, trunc, hex, i, ok]
	}
	if (!sawdot) {
		dp = nd
	}

	if (base == 16n) {
		dp = dp * (4)
		ndMant = ndMant * (4)
	}

	// optional exponent moves decimal point.
	// if we read a very large, very long number,
	// just be sure to move the decimal point by
	// a lot (say, 100000).  it doesn't matter if it's
	// not the exact number.
	if ((i < $.len(s)) && ($.uint(__goscript_atoi.lower($.uint($.indexStringOrBytes(s, i), 8)), 8) == $.uint(expChar, 8))) {
		i++
		if (i >= $.len(s)) {
			return [mantissa, exp, neg, trunc, hex, i, ok]
		}
		let esign = 1
		switch ($.indexStringOrBytes(s, i)) {
			case 43:
			{
				i++
				break
			}
			case 45:
			{
				i++
				esign = -1
				break
			}
		}
		if (((i >= $.len(s)) || ($.indexStringOrBytes(s, i) < 48)) || ($.indexStringOrBytes(s, i) > 57)) {
			return [mantissa, exp, neg, trunc, hex, i, ok]
		}
		let e = 0
		for (; (i < $.len(s)) && (((48 <= $.indexStringOrBytes(s, i)) && ($.indexStringOrBytes(s, i) <= 57)) || ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(95, 8))); i++) {
			if ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(95, 8)) {
				underscores = true
				continue
			}
			if (e < 10000) {
				e = ((e * 10) + $.int($.indexStringOrBytes(s, i))) - 48
			}
		}
		dp = dp + (e * esign)
	} else {
		if (base == 16n) {
			// Must have exponent.
			return [mantissa, exp, neg, trunc, hex, i, ok]
		}
	}

	if (mantissa != 0n) {
		exp = dp - ndMant
	}

	if (underscores && !__goscript_atoi.underscoreOK($.sliceStringOrBytes(s, undefined, i))) {
		return [mantissa, exp, neg, trunc, hex, i, ok]
	}

	ok = true
	return [mantissa, exp, neg, trunc, hex, i, ok]
}

export let powtab: $.Slice<number> = $.arrayToSlice<number>([1, 3, 6, 9, 13, 16, 19, 23, 26])

export function __goscript_set_powtab(__goscriptValue: $.Slice<number>): void {
	powtab = __goscriptValue
}

export let float64pow10: $.Slice<number> = $.arrayToSlice<number>([1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e22])

export function __goscript_set_float64pow10(__goscriptValue: $.Slice<number>): void {
	float64pow10 = __goscriptValue
}

export let float32pow10: $.Slice<number> = $.arrayToSlice<number>([1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10])

export function __goscript_set_float32pow10(__goscriptValue: $.Slice<number>): void {
	float32pow10 = __goscriptValue
}

export function atof64exact(mantissa: bigint, exp: number, neg: boolean): [number, boolean] {
	let f: number = 0
	let ok: boolean = false
	if (($.uint64Shr(mantissa, $.pointerValue<__goscript_ftoa.floatInfo>(__goscript_ftoa.float64info).mantbits)) != 0n) {
		return [f, ok]
	}
	f = Number(mantissa)
	if (neg) {
		f = -f
	}
	switch (true) {
		case exp == 0:
		{
			return [f, true]
			break
		}
		case (exp > 0) && (exp <= (15 + 22)):
		{
			if (exp > 22) {
				f = f * ($.arrayIndex(float64pow10!, exp - 22))
				exp = 22
			}
			if ((f > 1e15) || (f < -1e15)) {
				// the exponent was really too large.
				return [f, ok]
			}
			return [f * $.arrayIndex(float64pow10!, exp), true]
			break
		}
		case (exp < 0) && (exp >= -22):
		{
			return [f / $.arrayIndex(float64pow10!, -exp), true]
			break
		}
	}
	return [f, ok]
}

export function atof32exact(mantissa: bigint, exp: number, neg: boolean): [number, boolean] {
	let f: number = 0
	let ok: boolean = false
	if (($.uint64Shr(mantissa, 23)) != 0n) {
		return [f, ok]
	}
	f = Number(mantissa)
	if (neg) {
		f = -f
	}
	switch (true) {
		case exp == 0:
		{
			return [f, true]
			break
		}
		case (exp > 0) && (exp <= (7 + 10)):
		{
			if (exp > 10) {
				f = f * ($.arrayIndex(float32pow10!, exp - 10))
				exp = 10
			}
			if ((f > 1e7) || (f < -1e7)) {
				// the exponent was really too large.
				return [f, ok]
			}
			return [f * $.arrayIndex(float32pow10!, exp), true]
			break
		}
		case (exp < 0) && (exp >= -10):
		{
			return [f / $.arrayIndex(float32pow10!, -exp), true]
			break
		}
	}
	return [f, ok]
}

export function atofHex(s: string, flt: __goscript_ftoa.floatInfo | $.VarRef<__goscript_ftoa.floatInfo> | null, mantissa: bigint, exp: number, neg: boolean, trunc: boolean): [number, $.GoError] {
	let maxExp = ((1 << $.pointerValue<__goscript_ftoa.floatInfo>(flt).expbits) + $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias) - 2
	let minExp = $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias + 1
	exp = exp + ($.int($.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits))

	// Shift mantissa and exponent to bring representation into float range.
	// Eventually we want a mantissa with a leading 1-bit followed by mantbits other bits.
	// For rounding, we need two more, where the bottom bit represents
	// whether that bit or any later bit was non-zero.
	// (If the mantissa has already lost non-zero bits, trunc is true,
	// and we OR in a 1 below after shifting left appropriately.)
	while ((mantissa != 0n) && (($.uint64Shr(mantissa, ($.uint($.uint64Add($.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits, 2), 64)))) == 0n)) {
		mantissa = $.uint64Shl(mantissa, 1n)
		exp--
	}
	if (trunc) {
		mantissa = $.uint64Or(mantissa, 1n)
	}
	while (($.uint64Shr(mantissa, ($.uint($.uint64Add(($.uint($.uint64Add(1, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits), 64)), 2), 64)))) != 0n) {
		mantissa = $.uint64Or(($.uint64Shr(mantissa, 1)), ($.uint64And(mantissa, 1)))
		exp++
	}

	// If exponent is too negative,
	// denormalize in hopes of making it representable.
	// (The -2 is for the rounding bits.)
	while ((mantissa > 1) && (exp < (minExp - 2))) {
		mantissa = $.uint64Or(($.uint64Shr(mantissa, 1)), ($.uint64And(mantissa, 1)))
		exp++
	}

	// Round using two bottom bits.
	let round = $.uint64And(mantissa, 3)
	mantissa = $.uint64Shr(mantissa, 2n)
	round = $.uint64Or(round, $.uint64And(mantissa, 1))
	exp = exp + (2)
	if (round == 3n) {
		mantissa++
		if (mantissa == ($.uint64Shl(1, ($.uint($.uint64Add(1, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits), 64))))) {
			mantissa = $.uint64Shr(mantissa, 1n)
			exp++
		}
	}

	if (($.uint64Shr(mantissa, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits)) == 0n) {
		exp = $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias
	}
	let err: $.GoError = null as $.GoError
	if (exp > maxExp) {
		mantissa = $.uint64Shl(1, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits)
		exp = maxExp + 1
		err = $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })
	}

	let bits = $.uint64And(mantissa, ($.uint64Sub(($.uint64Shl(1, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits)), 1)))
	bits = $.uint64Or(bits, $.uint64Shl($.uint64((exp - $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias) & ((1 << $.pointerValue<__goscript_ftoa.floatInfo>(flt).expbits) - 1)), $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits))
	if (neg) {
		bits = $.uint64Or(bits, $.uint64Shl(($.uint64Shl(1, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits)), $.pointerValue<__goscript_ftoa.floatInfo>(flt).expbits))
	}
	if (flt == __goscript_ftoa.float32info) {
		return [__goscript_deps.float32frombits($.uint($.uint(bits, 32), 32)), err]
	}
	return [__goscript_deps.float64frombits(bits), err]
}

export function atof32(s: string): [number, number, $.GoError] {
	let f: number = 0
	let n: number = 0
	let err: $.GoError = null as $.GoError
	{
		let [val, __goscriptShadow1, ok] = special(s)
		if (ok) {
			return [val, __goscriptShadow1, null]
		}
	}

	let __goscriptTuple0: any = readFloat(s)
	let mantissa = __goscriptTuple0[0]
	let exp = __goscriptTuple0[1]
	let neg = __goscriptTuple0[2]
	let trunc = __goscriptTuple0[3]
	let hex = __goscriptTuple0[4]
	n = __goscriptTuple0[5]
	let ok = __goscriptTuple0[6]
	if (!ok) {
		return [0, n, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}

	if (hex) {
		let [__goscriptShadow2, __goscriptShadow3] = atofHex($.sliceStringOrBytes(s, undefined, n), __goscript_ftoa.float32info, mantissa, exp, neg, trunc)
		return [__goscriptShadow2, n, __goscriptShadow3]
	}

	if (optimize) {
		// Try pure floating-point arithmetic conversion, and if that fails,
		// the Eisel-Lemire algorithm.
		if (!trunc) {
			{
				let [__goscriptShadow4, __goscriptShadow5] = atof32exact(mantissa, exp, neg)
				if (__goscriptShadow5) {
					return [__goscriptShadow4, n, null]
				}
			}
		}
		let [__goscriptShadow6, __goscriptShadow7] = __goscript_atofeisel.eiselLemire32(mantissa, exp, neg)
		if (__goscriptShadow7) {
			if (!trunc) {
				return [__goscriptShadow6, n, null]
			}
			// Even if the mantissa was truncated, we may
			// have found the correct result. Confirm by
			// converting the upper mantissa bound.
			let [fUp, __goscriptShadow8] = __goscript_atofeisel.eiselLemire32($.uint64Add(mantissa, 1), exp, neg)
			if (__goscriptShadow8 && (__goscriptShadow6 == fUp)) {
				return [__goscriptShadow6, n, null]
			}
		}
	}

	// Slow fallback.
	let d: $.VarRef<__goscript_decimal.decimal> = $.varRef($.markAsStructValue(new __goscript_decimal.decimal()))
	if (!d.value.set($.sliceStringOrBytes(s, undefined, n))) {
		return [0, n, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}
	let [b, ovf] = d.value.floatBits(__goscript_ftoa.float32info)
	f = __goscript_deps.float32frombits($.uint($.uint(b, 32), 32))
	if (ovf) {
		err = $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })
	}
	return [f, n, err]
}

export function atof64(s: string): [number, number, $.GoError] {
	let f: number = 0
	let n: number = 0
	let err: $.GoError = null as $.GoError
	{
		let [val, __goscriptShadow9, ok] = special(s)
		if (ok) {
			return [val, __goscriptShadow9, null]
		}
	}

	let __goscriptTuple1: any = readFloat(s)
	let mantissa = __goscriptTuple1[0]
	let exp = __goscriptTuple1[1]
	let neg = __goscriptTuple1[2]
	let trunc = __goscriptTuple1[3]
	let hex = __goscriptTuple1[4]
	n = __goscriptTuple1[5]
	let ok = __goscriptTuple1[6]
	if (!ok) {
		return [0, n, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}

	if (hex) {
		let [__goscriptShadow10, __goscriptShadow11] = atofHex($.sliceStringOrBytes(s, undefined, n), __goscript_ftoa.float64info, mantissa, exp, neg, trunc)
		return [__goscriptShadow10, n, __goscriptShadow11]
	}

	if (optimize) {
		// Try pure floating-point arithmetic conversion, and if that fails,
		// the Eisel-Lemire algorithm.
		if (!trunc) {
			{
				let [__goscriptShadow12, __goscriptShadow13] = atof64exact(mantissa, exp, neg)
				if (__goscriptShadow13) {
					return [__goscriptShadow12, n, null]
				}
			}
		}
		let [__goscriptShadow14, __goscriptShadow15] = __goscript_atofeisel.eiselLemire64(mantissa, exp, neg)
		if (__goscriptShadow15) {
			if (!trunc) {
				return [__goscriptShadow14, n, null]
			}
			// Even if the mantissa was truncated, we may
			// have found the correct result. Confirm by
			// converting the upper mantissa bound.
			let [fUp, __goscriptShadow16] = __goscript_atofeisel.eiselLemire64($.uint64Add(mantissa, 1), exp, neg)
			if (__goscriptShadow16 && (__goscriptShadow14 == fUp)) {
				return [__goscriptShadow14, n, null]
			}
		}
	}

	// Slow fallback.
	let d: $.VarRef<__goscript_decimal.decimal> = $.varRef($.markAsStructValue(new __goscript_decimal.decimal()))
	if (!d.value.set($.sliceStringOrBytes(s, undefined, n))) {
		return [0, n, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}
	let [b, ovf] = d.value.floatBits(__goscript_ftoa.float64info)
	f = __goscript_deps.float64frombits(b)
	if (ovf) {
		err = $.namedValueInterfaceValue<$.GoError>(1, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })
	}
	return [f, n, err]
}

export function ParseFloat(s: string, bitSize: number): [number, $.GoError] {
	let [f, n, err] = parseFloatPrefix(s, bitSize)
	if (n != $.len(s)) {
		return [0, $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}
	return [f, err]
}

export function parseFloatPrefix(s: string, bitSize: number): [number, number, $.GoError] {
	if (bitSize == 32) {
		let [f, n, err] = atof32(s)
		return [f, n, err]
	}
	return atof64(s)
}
