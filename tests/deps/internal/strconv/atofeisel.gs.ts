// Generated file based on atofeisel.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as __goscript_deps from "./deps.gs.ts"

import * as __goscript_ftoa from "./ftoa.gs.ts"

import * as __goscript_math from "./math.gs.ts"
import "@goscript/math/bits/index.js"
import "./deps.gs.ts"
import "./ftoa.gs.ts"
import "./math.gs.ts"

export function eiselLemire64(man: number, exp10: number, neg: boolean): [number, boolean] {
	let f: number = 0
	let ok: boolean = false
	// The terse comments in this function body refer to sections of the
	// https://nigeltao.github.io/blog/2020/eisel-lemire.html blog post.

	// Exp10 Range.
	if ($.uint(man, 64) == $.uint(0, 64)) {
		if (neg) {
			f = __goscript_deps.float64frombits($.uint("9223372036854775808", 64))
		}
		return [f, true]
	}
	let __goscriptTuple0: any = __goscript_math.pow10(exp10)
	let pow = __goscriptTuple0[0]
	let exp2 = __goscriptTuple0[1]
	ok = __goscriptTuple0[2]
	if (!ok) {
		return [0, false]
	}

	// Normalization.
	let clz = bits.LeadingZeros64($.uint(man, 64))
	man = $.uint64Shl(man, $.uint($.uint(clz, 64), 64))
	let retExp2 = $.uint($.uint64Sub($.uint((exp2 + 63) - -1023, 64), $.uint(clz, 64)), 64)

	// Multiplication.
	let __goscriptTuple1: any = bits.Mul64($.uint(man, 64), $.uint(pow.Hi, 64))
	let xHi = $.uint(__goscriptTuple1[0], 64)
	let xLo = $.uint(__goscriptTuple1[1], 64)

	// Wider Approximation.
	if (($.uint(($.uint64And(xHi, 0x1FF)), 64) == $.uint(0x1FF, 64)) && (($.uint64Add(xLo, man)) < man)) {
		let __goscriptTuple2: any = bits.Mul64($.uint(man, 64), $.uint(pow.Lo, 64))
		let yHi = $.uint(__goscriptTuple2[0], 64)
		let yLo = $.uint(__goscriptTuple2[1], 64)
		let mergedHi = $.uint(xHi, 64)
		let mergedLo = $.uint($.uint64Add(xLo, yHi), 64)
		if (mergedLo < xLo) {
			mergedHi++
		}
		if ((($.uint(($.uint64And(mergedHi, 0x1FF)), 64) == $.uint(0x1FF, 64)) && ($.uint(($.uint64Add(mergedLo, 1)), 64) == $.uint(0, 64))) && (($.uint64Add(yLo, man)) < man)) {
			return [0, false]
		}
		let __goscriptAssign0_0: number = $.uint(mergedHi, 64)
		let __goscriptAssign0_1: number = $.uint(mergedLo, 64)
		xHi = __goscriptAssign0_0
		xLo = __goscriptAssign0_1
	}

	// Shifting to 54 Bits.
	let msb = $.uint($.uint64Shr(xHi, 63), 64)
	let retMantissa = $.uint($.uint64Shr(xHi, ($.uint64Add(msb, 9))), 64)
	retExp2 = $.uint64Sub(retExp2, $.uint($.uint64Xor(1, msb), 64))

	// Half-way Ambiguity.
	if ((($.uint(xLo, 64) == $.uint(0, 64)) && ($.uint(($.uint64And(xHi, 0x1FF)), 64) == $.uint(0, 64))) && ($.uint(($.uint64And(retMantissa, 3)), 64) == $.uint(1, 64))) {
		return [0, false]
	}

	// From 54 to 53 Bits.
	retMantissa = $.uint64Add(retMantissa, $.uint($.uint64And(retMantissa, 1), 64))
	retMantissa = $.uint64Shr(retMantissa, $.uint(1, 64))
	if (($.uint64Shr(retMantissa, 53)) > 0) {
		retMantissa = $.uint64Shr(retMantissa, $.uint(1, 64))
		retExp2 = $.uint64Add(retExp2, $.uint(1, 64))
	}
	// retExp2 is a uint64. Zero or underflow means that we're in subnormal
	// float64 space. 0x7FF or above means that we're in Inf/NaN float64 space.
	//
	// The if block is equivalent to (but has fewer branches than):
	//   if retExp2 <= 0 || retExp2 >= 0x7FF { etc }
	if (($.uint64Sub(retExp2, 1)) >= ($.uint64Sub(0x7FF, 1))) {
		return [0, false]
	}
	let retBits = $.uint($.uint64Or(($.uint64Mul(retExp2, (2 ** 52))), ($.uint64And(retMantissa, ($.uint64Sub((4503599627370496), 1))))), 64)
	if (neg) {
		retBits = $.uint64Or(retBits, $.uint("9223372036854775808", 64))
	}
	return [__goscript_deps.float64frombits($.uint(retBits, 64)), true]
}

export function eiselLemire32(man: number, exp10: number, neg: boolean): [number, boolean] {
	let f: number = 0
	let ok: boolean = false
	// The terse comments in this function body refer to sections of the
	// https://nigeltao.github.io/blog/2020/eisel-lemire.html blog post.
	//
	// That blog post discusses the float64 flavor (11 exponent bits with a
	// -1023 bias, 52 mantissa bits) of the algorithm, but the same approach
	// applies to the float32 flavor (8 exponent bits with a -127 bias, 23
	// mantissa bits). The computation here happens with 64-bit values (e.g.
	// man, xHi, retMantissa) before finally converting to a 32-bit float.

	// Exp10 Range.
	if ($.uint(man, 64) == $.uint(0, 64)) {
		if (neg) {
			f = __goscript_deps.float32frombits($.uint(0x80000000, 32))
		}
		return [f, true]
	}
	let __goscriptTuple3: any = __goscript_math.pow10(exp10)
	let pow = __goscriptTuple3[0]
	let exp2 = __goscriptTuple3[1]
	ok = __goscriptTuple3[2]
	if (!ok) {
		return [0, false]
	}

	// Normalization.
	let clz = bits.LeadingZeros64($.uint(man, 64))
	man = $.uint64Shl(man, $.uint($.uint(clz, 64), 64))
	let retExp2 = $.uint($.uint64Sub($.uint((exp2 + 63) - -127, 64), $.uint(clz, 64)), 64)

	// Multiplication.
	let __goscriptTuple4: any = bits.Mul64($.uint(man, 64), $.uint(pow.Hi, 64))
	let xHi = $.uint(__goscriptTuple4[0], 64)
	let xLo = $.uint(__goscriptTuple4[1], 64)

	// Wider Approximation.
	if (($.uint(($.uint64And(xHi, 0x3FFFFFFFFF)), 64) == $.uint(0x3FFFFFFFFF, 64)) && (($.uint64Add(xLo, man)) < man)) {
		let __goscriptTuple5: any = bits.Mul64($.uint(man, 64), $.uint(pow.Lo, 64))
		let yHi = $.uint(__goscriptTuple5[0], 64)
		let yLo = $.uint(__goscriptTuple5[1], 64)
		let mergedHi = $.uint(xHi, 64)
		let mergedLo = $.uint($.uint64Add(xLo, yHi), 64)
		if (mergedLo < xLo) {
			mergedHi++
		}
		if ((($.uint(($.uint64And(mergedHi, 0x3FFFFFFFFF)), 64) == $.uint(0x3FFFFFFFFF, 64)) && ($.uint(($.uint64Add(mergedLo, 1)), 64) == $.uint(0, 64))) && (($.uint64Add(yLo, man)) < man)) {
			return [0, false]
		}
		let __goscriptAssign1_0: number = $.uint(mergedHi, 64)
		let __goscriptAssign1_1: number = $.uint(mergedLo, 64)
		xHi = __goscriptAssign1_0
		xLo = __goscriptAssign1_1
	}

	// Shifting to 54 Bits (and for float32, it's shifting to 25 bits).
	let msb = $.uint($.uint64Shr(xHi, 63), 64)
	let retMantissa = $.uint($.uint64Shr(xHi, ($.uint64Add(msb, 38))), 64)
	retExp2 = $.uint64Sub(retExp2, $.uint($.uint64Xor(1, msb), 64))

	// Half-way Ambiguity.
	if ((($.uint(xLo, 64) == $.uint(0, 64)) && ($.uint(($.uint64And(xHi, 0x3FFFFFFFFF)), 64) == $.uint(0, 64))) && ($.uint(($.uint64And(retMantissa, 3)), 64) == $.uint(1, 64))) {
		return [0, false]
	}

	// From 54 to 53 Bits (and for float32, it's from 25 to 24 bits).
	retMantissa = $.uint64Add(retMantissa, $.uint($.uint64And(retMantissa, 1), 64))
	retMantissa = $.uint64Shr(retMantissa, $.uint(1, 64))
	if (($.uint64Shr(retMantissa, 24)) > 0) {
		retMantissa = $.uint64Shr(retMantissa, $.uint(1, 64))
		retExp2 = $.uint64Add(retExp2, $.uint(1, 64))
	}
	// retExp2 is a uint64. Zero or underflow means that we're in subnormal
	// float32 space. 0xFF or above means that we're in Inf/NaN float32 space.
	//
	// The if block is equivalent to (but has fewer branches than):
	//   if retExp2 <= 0 || retExp2 >= 0xFF { etc }
	if (($.uint64Sub(retExp2, 1)) >= ($.uint64Sub(0xFF, 1))) {
		return [0, false]
	}
	let retBits = $.uint($.uint64Or(($.uint64Shl(retExp2, 23)), ($.uint64And(retMantissa, ($.uint64Sub((8388608), 1))))), 64)
	if (neg) {
		retBits = $.uint64Or(retBits, $.uint(0x80000000, 64))
	}
	return [__goscript_deps.float32frombits($.uint($.uint(retBits, 32), 32)), true]
}
