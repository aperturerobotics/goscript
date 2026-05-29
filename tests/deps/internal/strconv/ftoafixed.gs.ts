// Generated file based on ftoafixed.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"

import type * as __goscript_ftoa from "./ftoa.gs.ts"

import * as __goscript_itoa from "./itoa.gs.ts"

import * as __goscript_math from "./math.gs.ts"
import "@goscript/math/bits/index.js"
import "./itoa.gs.ts"
import "./math.gs.ts"

export let uint64pow10: number[] = [$.uint(1, 64), $.uint(1e1, 64), $.uint(1e2, 64), $.uint(1e3, 64), $.uint(1e4, 64), $.uint(1e5, 64), $.uint(1e6, 64), $.uint(1e7, 64), $.uint(1e8, 64), $.uint(1e9, 64), $.uint(1e10, 64), $.uint(1e11, 64), $.uint(1e12, 64), $.uint(1e13, 64), $.uint(1e14, 64), $.uint(1e15, 64), $.uint("10000000000000000", 64), $.uint("100000000000000000", 64), $.uint("1000000000000000000", 64), $.uint("10000000000000000000", 64)]

export function __goscript_set_uint64pow10(__goscriptValue: number[]): void {
	uint64pow10 = __goscriptValue
}

export function fixedFtoa(d: __goscript_ftoa.decimalSlice | $.VarRef<__goscript_ftoa.decimalSlice> | null, mant: number, exp: number, digits: number, prec: number, fmt: number): void {
	// The strategy here is to multiply (mant * 2^exp) by a power of 10
	// to make the resulting integer be the number of digits we want.
	//
	// Adams proved in the Ryu paper that 128-bit precision in the
	// power-of-10 constant is sufficient to produce correctly
	// rounded output for all float64s, up to 18 digits.
	// https://dl.acm.org/doi/10.1145/3192366.3192369
	//
	// TODO(rsc): The paper is not focused on, nor terribly clear about,
	// this fact in this context, and the proof seems too complicated.
	// Post a shorter, more direct proof and link to it here.

	if (digits > 18) {
		$.panic("fixedFtoa called with digits > 18")
	}

	// Shift mantissa to have 64 bits,
	// so that the 192-bit product below will
	// have at least 63 bits in its top word.
	let b = 64 - bits.Len64($.uint(mant, 64))
	mant = $.uint64Shl(mant, $.uint(b, 64))
	exp = exp - (b)

	// We have f = mant * 2^exp ≥ 2^(63+exp)
	// and we want to multiply it by some 10^p
	// to make it have the number of digits plus one rounding bit:
	//
	//	2 * 10^(digits-1) ≤ f * 10^p < ~2 * 10^digits
	//
	// The lower bound is required, but the upper bound is approximate:
	// we must not have too few digits, but we can round away extra ones.
	//
	//	f * 10^p ≥ 2 * 10^(digits-1)
	//	10^p ≥ 2 * 10^(digits-1) / f                         [dividing by f]
	//	p ≥ (log₁₀ 2) + (digits-1) - log₁₀ f                 [taking log₁₀]
	//	p ≥ (log₁₀ 2) + (digits-1) - log₁₀ (mant * 2^exp)    [expanding f]
	//	p ≥ (log₁₀ 2) + (digits-1) - (log₁₀ 2) * (64 + exp)  [mant < 2⁶⁴]
	//	p ≥ (digits - 1) - (log₁₀ 2) * (63 + exp)            [refactoring]
	//
	// Once we have p, we can compute the scaled value:
	//
	//	dm * 2^de = mant * 2^exp * 10^p
	//	          = mant * 2^exp * pow/2^128 * 2^exp2.
	//	          = (mant * pow/2^128) * 2^(exp+exp2).
	let p = (digits - 1) - __goscript_math.mulLog10_2(63 + exp)
	let [pow, exp2, ok] = __goscript_math.pow10(p)
	if (!ok) {
		// This never happens due to the range of float32/float64 exponent
		$.panic("fixedFtoa: pow10 out of range")
	}
	if ((-22 <= p) && (p < 0)) {
		// Special case: Let q=-p. q is in [1,22]. We are dividing by 10^q
		// and the mantissa may be a multiple of 5^q (5^22 < 2^53),
		// in which case the division must be computed exactly and
		// recorded as exact for correct rounding. Our normal computation is:
		//
		//	dm = floor(mant * floor(10^p * 2^s))
		//
		// for some scaling shift s. To make this an exact division,
		// it suffices to change the inner floor to a ceil:
		//
		//	dm = floor(mant * ceil(10^p * 2^s))
		//
		// In the range of values we are using, the floor and ceil
		// cancel each other out and the high 64 bits of the product
		// come out exactly right.
		// (This is the same trick compilers use for division by constants.
		// See Hacker's Delight, 2nd ed., Chapter 10.)
		pow.Lo++
	}
	let __goscriptTuple0: any = __goscript_math.umul192($.uint(mant, 64), $.markAsStructValue($.cloneStructValue(pow)))
	let dm = $.uint(__goscriptTuple0[0], 64)
	let lo1 = $.uint(__goscriptTuple0[1], 64)
	let lo0 = $.uint(__goscriptTuple0[2], 64)
	let de = exp + exp2

	// Check whether any bits have been truncated from dm.
	// If so, set dt != 0. If not, leave dt == 0 (meaning dm is exact).
	let dt: number = 0
	switch (true) {
		default:
		{
			dt = 1
			break
		}
		case (0 <= p) && (p <= 55):
		{
			dt = __goscript_math.bool2uint($.uint(($.uint64Or(lo1, lo0)), 64) != $.uint(0, 64))
			break
		}
		case ((-22 <= p) && (p < 0)) && __goscript_math.divisiblePow5($.uint(mant, 64), -p):
		{
			dt = 0
			break
		}
	}

	// The value we want to format is dm * 2^de, where de < 0.
	// Multply by 2^de by shifting, but leave one extra bit for rounding.
	// After the shift, the "integer part" of dm is dm>>1,
	// the "rounding bit" (the first fractional bit) is dm&1,
	// and the "truncated bit" (have any bits been discarded?) is dt.
	let shift = -de - 1
	dt = $.uint64Or(dt, __goscript_math.bool2uint($.uint(($.uint64And(dm, ($.uint64Sub(($.uint64Shl(1, shift)), 1)))), 64) != $.uint(0, 64)))
	dm = $.uint64Shr(dm, $.uint(shift, 64))

	// Set decimal point in eventual formatted digits,
	// so we can update it as we adjust the digits.
	$.pointerValue<__goscript_ftoa.decimalSlice>(d).dp = digits - p

	// Trim excess digit if any, updating truncation and decimal point.
	// The << 1 is leaving room for the rounding bit.
	let max = $.uint($.uint64Shl(uint64pow10[digits], 1), 64)
	if (dm >= max) {
		let r: number = 0
		let __goscriptAssign0_0: number = $.uint($.uint64Div(dm, 10), 64)
		let __goscriptAssign0_1: number = $.uint($.uint64Mod(dm, 10), 64)
		dm = __goscriptAssign0_0
		r = __goscriptAssign0_1
		dt = $.uint64Or(dt, __goscript_math.bool2uint(r != 0))
		$.pointerValue<__goscript_ftoa.decimalSlice>(d).dp++
	}

	// If this is %.*f we may have overestimated the digits needed.
	// Now that we know where the decimal point is,
	// trim to the actual number of digits, which is d.dp+prec.
	if (($.uint(fmt, 8) == $.uint(102, 8)) && (digits != ($.pointerValue<__goscript_ftoa.decimalSlice>(d).dp + prec))) {
		while (digits > ($.pointerValue<__goscript_ftoa.decimalSlice>(d).dp + prec)) {
			let r: number = 0
			let __goscriptAssign1_0: number = $.uint($.uint64Div(dm, 10), 64)
			let __goscriptAssign1_1: number = $.uint($.uint64Mod(dm, 10), 64)
			dm = __goscriptAssign1_0
			r = __goscriptAssign1_1
			dt = $.uint64Or(dt, __goscript_math.bool2uint(r != 0))
			digits--
		}

		// Dropping those digits can create a new leftmost
		// non-zero digit, like if we are formatting %.1f and
		// convert 0.09 -> 0.1. Detect and adjust for that.
		if (digits <= 0) {
			digits = 1
			$.pointerValue<__goscript_ftoa.decimalSlice>(d).dp++
		}

		max = $.uint($.uint64Shl(uint64pow10[digits], 1), 64)
	}

	// Round and shift away rounding bit.
	// We want to round up when
	// (a) the fractional part is > 0.5 (dm&1 != 0 and dt == 1)
	// (b) or the fractional part is ≥ 0.5 and the integer part is odd
	//     (dm&1 != 0 and dm&2 != 0).
	// The bitwise expression encodes that logic.
	dm = $.uint64Add(dm, $.uint($.uint($.uint64And(($.uint64And($.uint(dm, 64), ($.uint64Or(dt, ($.uint64Shr($.uint(dm, 64), 1)))))), 1), 64), 64))
	dm = $.uint64Shr(dm, $.uint(1, 64))
	if ($.uint(dm, 64) == $.uint(($.uint64Shr(max, 1)), 64)) {
		// 999... rolled over to 1000...
		dm = $.uint(uint64pow10[digits - 1], 64)
		$.pointerValue<__goscript_ftoa.decimalSlice>(d).dp++
	}

	// Format digits into d.
	if ($.uint(dm, 64) != $.uint(0, 64)) {
		if (__goscript_itoa.formatBase10($.goSlice($.pointerValue<__goscript_ftoa.decimalSlice>(d).d, undefined, digits), $.uint(dm, 64)) != 0) {
			$.panic("formatBase10")
		}
		$.pointerValue<__goscript_ftoa.decimalSlice>(d).nd = digits
		while ($.uint($.pointerValue<__goscript_ftoa.decimalSlice>(d).d![$.pointerValue<__goscript_ftoa.decimalSlice>(d).nd - 1], 8) == $.uint(48, 8)) {
			$.pointerValue<__goscript_ftoa.decimalSlice>(d).nd--
		}
	}
}
