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

export function eiselLemire64(man: bigint, exp10: number, neg: boolean): [number, boolean] {
	let f: number = 0
	let ok: boolean = false
	// The terse comments in this function body refer to sections of the
	// https://nigeltao.github.io/blog/2020/eisel-lemire.html blog post.

	// Exp10 Range.
	if (man == 0n) {
		if (neg) {
			f = __goscript_deps.float64frombits(9223372036854775808n)
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
	let clz = bits.LeadingZeros64(man)
	man = $.uint64Shl(man, $.uint64($.uint(clz, 64)))
	let retExp2 = $.uint64Sub($.uint64((exp2 + 63) - -1023), $.uint64(clz))

	// Multiplication.
	let [xHi, xLo] = bits.Mul64(man, pow.Hi)

	// Wider Approximation.
	if ((($.uint64And(xHi, 0x1FF)) == 511n) && (($.uint64Add(xLo, man)) < man)) {
		let [yHi, yLo] = bits.Mul64(man, pow.Lo)
		let mergedHi = xHi
		let mergedLo = $.uint64Add(xLo, yHi)
		if (mergedLo < xLo) {
			mergedHi++
		}
		if (((($.uint64And(mergedHi, 0x1FF)) == 511n) && (($.uint64Add(mergedLo, 1)) == 0n)) && (($.uint64Add(yLo, man)) < man)) {
			return [0, false]
		}
		let __goscriptAssign0_0: bigint = mergedHi
		let __goscriptAssign0_1: bigint = mergedLo
		xHi = __goscriptAssign0_0
		xLo = __goscriptAssign0_1
	}

	// Shifting to 54 Bits.
	let msb = $.uint64Shr(xHi, 63)
	let retMantissa = $.uint64Shr(xHi, ($.uint64Add(msb, 9)))
	retExp2 = $.uint64Sub(retExp2, $.uint64Xor(1, msb))

	// Half-way Ambiguity.
	if (((xLo == 0n) && (($.uint64And(xHi, 0x1FF)) == 0n)) && (($.uint64And(retMantissa, 3)) == 1n)) {
		return [0, false]
	}

	// From 54 to 53 Bits.
	retMantissa = $.uint64Add(retMantissa, $.uint64And(retMantissa, 1))
	retMantissa = $.uint64Shr(retMantissa, 1n)
	if (($.uint64Shr(retMantissa, 53)) > 0n) {
		retMantissa = $.uint64Shr(retMantissa, 1n)
		retExp2 = $.uint64Add(retExp2, 1n)
	}
	// retExp2 is a uint64. Zero or underflow means that we're in subnormal
	// float64 space. 0x7FF or above means that we're in Inf/NaN float64 space.
	//
	// The if block is equivalent to (but has fewer branches than):
	//   if retExp2 <= 0 || retExp2 >= 0x7FF { etc }
	if (($.uint64Sub(retExp2, 1)) >= 2046n) {
		return [0, false]
	}
	let retBits = $.uint64Or(($.uint64Mul(retExp2, (2 ** 52))), ($.uint64And(retMantissa, ($.uint64Sub((4503599627370496), 1)))))
	if (neg) {
		retBits = $.uint64Or(retBits, 9223372036854775808n)
	}
	return [__goscript_deps.float64frombits(retBits), true]
}

export function eiselLemire32(man: bigint, exp10: number, neg: boolean): [number, boolean] {
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
	if (man == 0n) {
		if (neg) {
			f = __goscript_deps.float32frombits($.uint(0x80000000, 32))
		}
		return [f, true]
	}
	let __goscriptTuple1: any = __goscript_math.pow10(exp10)
	let pow = __goscriptTuple1[0]
	let exp2 = __goscriptTuple1[1]
	ok = __goscriptTuple1[2]
	if (!ok) {
		return [0, false]
	}

	// Normalization.
	let clz = bits.LeadingZeros64(man)
	man = $.uint64Shl(man, $.uint64($.uint(clz, 64)))
	let retExp2 = $.uint64Sub($.uint64((exp2 + 63) - -127), $.uint64(clz))

	// Multiplication.
	let [xHi, xLo] = bits.Mul64(man, pow.Hi)

	// Wider Approximation.
	if ((($.uint64And(xHi, 0x3FFFFFFFFF)) == 274877906943n) && (($.uint64Add(xLo, man)) < man)) {
		let [yHi, yLo] = bits.Mul64(man, pow.Lo)
		let mergedHi = xHi
		let mergedLo = $.uint64Add(xLo, yHi)
		if (mergedLo < xLo) {
			mergedHi++
		}
		if (((($.uint64And(mergedHi, 0x3FFFFFFFFF)) == 274877906943n) && (($.uint64Add(mergedLo, 1)) == 0n)) && (($.uint64Add(yLo, man)) < man)) {
			return [0, false]
		}
		let __goscriptAssign1_0: bigint = mergedHi
		let __goscriptAssign1_1: bigint = mergedLo
		xHi = __goscriptAssign1_0
		xLo = __goscriptAssign1_1
	}

	// Shifting to 54 Bits (and for float32, it's shifting to 25 bits).
	let msb = $.uint64Shr(xHi, 63)
	let retMantissa = $.uint64Shr(xHi, ($.uint64Add(msb, 38)))
	retExp2 = $.uint64Sub(retExp2, $.uint64Xor(1, msb))

	// Half-way Ambiguity.
	if (((xLo == 0n) && (($.uint64And(xHi, 0x3FFFFFFFFF)) == 0n)) && (($.uint64And(retMantissa, 3)) == 1n)) {
		return [0, false]
	}

	// From 54 to 53 Bits (and for float32, it's from 25 to 24 bits).
	retMantissa = $.uint64Add(retMantissa, $.uint64And(retMantissa, 1))
	retMantissa = $.uint64Shr(retMantissa, 1n)
	if (($.uint64Shr(retMantissa, 24)) > 0n) {
		retMantissa = $.uint64Shr(retMantissa, 1n)
		retExp2 = $.uint64Add(retExp2, 1n)
	}
	// retExp2 is a uint64. Zero or underflow means that we're in subnormal
	// float32 space. 0xFF or above means that we're in Inf/NaN float32 space.
	//
	// The if block is equivalent to (but has fewer branches than):
	//   if retExp2 <= 0 || retExp2 >= 0xFF { etc }
	if (($.uint64Sub(retExp2, 1)) >= 254n) {
		return [0, false]
	}
	let retBits = $.uint64Or(($.uint64Shl(retExp2, 23)), ($.uint64And(retMantissa, ($.uint64Sub((8388608), 1)))))
	if (neg) {
		retBits = $.uint64Or(retBits, 2147483648n)
	}
	return [__goscript_deps.float32frombits($.uint($.uint(retBits, 32), 32)), true]
}
