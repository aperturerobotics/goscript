// Generated file based on ftoadbox.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_ftoa from "./ftoa.gs.ts"

import * as __goscript_itoa from "./itoa.gs.ts"

import * as __goscript_math from "./math.gs.ts"
import "./ftoa.gs.ts"
import "./itoa.gs.ts"
import "./math.gs.ts"

export const floatMantBits64: number = 52

export const floatMantBits32: number = 23

export function dboxFtoa(d: __goscript_ftoa.decimalSlice | $.VarRef<__goscript_ftoa.decimalSlice> | null, mant: bigint, exp: number, denorm: boolean, bitSize: number): void {
	if (bitSize == 32) {
		dboxFtoa32(d, $.uint($.uint(mant, 32), 32), exp, denorm)
		return
	}
	dboxFtoa64(d, mant, exp, denorm)
}

export function dboxFtoa64(d: __goscript_ftoa.decimalSlice | $.VarRef<__goscript_ftoa.decimalSlice> | null, mant: bigint, exp: number, denorm: boolean): void {
	if ((mant == 4503599627370496n) && !denorm) {
		// Algorithm 5.6 (page 24).
		let k0 = -mulLog10_2MinusLog10_4Over3(exp)
		let [_u3c6, _u3b2] = dboxPow64(k0, exp)
		let [xi, zi] = dboxRange64($.markAsStructValue($.cloneStructValue(_u3c6)), _u3b2)
		if ((exp != 2) && (exp != 3)) {
			xi++
		}
		let q = $.uint64Div(zi, 10)
		if (xi <= ($.uint64Mul(q, 10))) {
			let __goscriptShadow0 = q
			let __goscriptTuple0: any = __goscript_math.trimZeros(__goscriptShadow0)
			let __goscriptShadow1 = __goscriptTuple0[0]
			let zeros = __goscriptTuple0[1]
			dboxDigits(d, __goscriptShadow1, (-k0 + 1) + zeros)
			return
		}
		let yru = dboxRoundUp64($.markAsStructValue($.cloneStructValue(_u3c6)), _u3b2)
		if ((exp == -77) && (($.uint64Mod(yru, 2)) != 0n)) {
			yru--
		} else {
			if (yru < xi) {
				yru++
			}
		}
		dboxDigits(d, yru, -k0)
		return
	}

	// κ = 2 for float64 (section 5.1.3)
	const _u3ba: number = 2
	const p10_u3ba: number = 100
	const p10_u3ba1: number = 1000

	// Algorithm 5.2 (page 15).
	let k0 = -__goscript_math.mulLog10_2(exp)
	let [_u3c6, _u3b2] = dboxPow64(2 + k0, exp)
	let [zi, exact] = dboxMulPow64($.uint64Shl($.uint64($.uint64Add(($.uint64Mul(mant, 2)), 1)), _u3b2), $.markAsStructValue($.cloneStructValue(_u3c6)))
	let s = $.uint64Div(zi, 1000)
	let r = $.uint($.uint($.uint64Mod(zi, 1000), 32), 32)
	let _u3b4i = $.uint(dboxDelta64($.markAsStructValue($.cloneStructValue(_u3c6)), _u3b2), 32)

	if (r < _u3b4i) {
		if ((($.uint(r, 32) != $.uint(0, 32)) || !exact) || (($.uint64Mod(mant, 2)) == 0n)) {
			let __goscriptShadow2 = s
			let __goscriptTuple1: any = __goscript_math.trimZeros(__goscriptShadow2)
			let __goscriptShadow3 = __goscriptTuple1[0]
			let zeros = __goscriptTuple1[1]
			dboxDigits(d, __goscriptShadow3, (-k0 + 1) + zeros)
			return
		}
		s--
		r = $.uint(100 * 10, 32)
	} else {
		if ($.uint(r, 32) == $.uint(_u3b4i, 32)) {
			let [parity, __goscriptShadow4] = dboxParity64($.uint64($.uint64Sub(($.uint64Mul(mant, 2)), 1)), $.markAsStructValue($.cloneStructValue(_u3c6)), _u3b2)
			if (parity || (__goscriptShadow4 && (($.uint64Mod(mant, 2)) == 0n))) {
				let __goscriptShadow5 = s
				let __goscriptTuple2: any = __goscript_math.trimZeros(__goscriptShadow5)
				let __goscriptShadow6 = __goscriptTuple2[0]
				let zeros = __goscriptTuple2[1]
				dboxDigits(d, __goscriptShadow6, (-k0 + 1) + zeros)
				return
			}
		}
	}

	// Algorithm 5.4 (page 18).
	let D = $.uint((r + (Math.trunc(100 / 2))) - (Math.trunc(_u3b4i / 2)), 32)
	let t = $.uint(Math.trunc(D / 100), 32)
	let _u3c1 = $.uint(D % 100, 32)
	let yru = $.uint64Add(($.uint64Mul(10, s)), $.uint64(t))
	if ($.uint(_u3c1, 32) == $.uint(0, 32)) {
		let [parity, __goscriptShadow7] = dboxParity64($.uint64Mul(mant, 2), $.markAsStructValue($.cloneStructValue(_u3c6)), _u3b2)
		if ((parity != ($.uint(((D - (Math.trunc(100 / 2))) % 2), 32) != $.uint(0, 32))) || (__goscriptShadow7 && (($.uint64Mod(yru, 2)) != 0n))) {
			yru--
		}
	}
	dboxDigits(d, yru, -k0)
}

export function dboxFtoa32(d: __goscript_ftoa.decimalSlice | $.VarRef<__goscript_ftoa.decimalSlice> | null, mant: number, exp: number, denorm: boolean): void {
	if (($.uint(mant, 32) == $.uint((8388608), 32)) && !denorm) {
		// Algorithm 5.6 (page 24).
		let k0 = -mulLog10_2MinusLog10_4Over3(exp)
		let [_u3c6, _u3b2] = dboxPow32(k0, exp)
		let __goscriptTuple3: any = dboxRange32(_u3c6, _u3b2)
		let xi = $.uint(__goscriptTuple3[0], 32)
		let zi = $.uint(__goscriptTuple3[1], 32)
		if ((exp != 2) && (exp != 3)) {
			xi++
		}
		let q = $.uint(Math.trunc(zi / 10), 32)
		if (xi <= (q * 10)) {
			let __goscriptShadow8 = q
			let __goscriptTuple4: any = __goscript_math.trimZeros($.uint64(__goscriptShadow8))
			let __goscriptShadow9 = __goscriptTuple4[0]
			let zeros = __goscriptTuple4[1]
			dboxDigits(d, __goscriptShadow9, (-k0 + 1) + zeros)
			return
		}
		let yru = $.uint(dboxRoundUp32(_u3c6, _u3b2), 32)
		if ((exp == -77) && ($.uint((yru % 2), 32) != $.uint(0, 32))) {
			yru--
		} else {
			if (yru < xi) {
				yru++
			}
		}
		dboxDigits(d, $.uint64(yru), -k0)
		return
	}

	// κ = 1 for float32 (section 5.1.3)
	const _u3ba: number = 1
	const p10_u3ba: number = 10
	const p10_u3ba1: number = 100

	// Algorithm 5.2 (page 15).
	let k0 = -__goscript_math.mulLog10_2(exp)
	let [_u3c6, _u3b2] = dboxPow32(1 + k0, exp)
	let __goscriptTuple5: any = dboxMulPow32($.uint($.uint((mant * 2) + 1, 32) << _u3b2, 32), _u3c6)
	let zi = $.uint(__goscriptTuple5[0], 32)
	let exact = __goscriptTuple5[1]
	let s = $.uint(Math.trunc(zi / 100), 32)
	let r = $.uint($.uint(zi % 100, 32), 32)
	let _u3b4i = $.uint(dboxDelta32(_u3c6, _u3b2), 32)

	if (r < _u3b4i) {
		if ((($.uint(r, 32) != $.uint(0, 32)) || !exact) || ($.uint((mant % 2), 32) == $.uint(0, 32))) {
			let __goscriptShadow10 = s
			let __goscriptTuple6: any = __goscript_math.trimZeros($.uint64(__goscriptShadow10))
			let __goscriptShadow11 = __goscriptTuple6[0]
			let zeros = __goscriptTuple6[1]
			dboxDigits(d, __goscriptShadow11, (-k0 + 1) + zeros)
			return
		}
		s--
		r = $.uint(10 * 10, 32)
	} else {
		if ($.uint(r, 32) == $.uint(_u3b4i, 32)) {
			let [parity, __goscriptShadow12] = dboxParity32($.uint($.uint((mant * 2) - 1, 32), 32), _u3c6, _u3b2)
			if (parity || (__goscriptShadow12 && ($.uint((mant % 2), 32) == $.uint(0, 32)))) {
				let __goscriptShadow13 = s
				let __goscriptTuple7: any = __goscript_math.trimZeros($.uint64(__goscriptShadow13))
				let __goscriptShadow14 = __goscriptTuple7[0]
				let zeros = __goscriptTuple7[1]
				dboxDigits(d, __goscriptShadow14, (-k0 + 1) + zeros)
				return
			}
		}
	}

	// Algorithm 5.4 (page 18).
	let D = $.uint((r + (Math.trunc(10 / 2))) - (Math.trunc(_u3b4i / 2)), 32)
	let t = $.uint(Math.trunc(D / 10), 32)
	let _u3c1 = $.uint(D % 10, 32)
	let yru = $.uint((10 * s) + $.uint(t, 32), 32)
	if ($.uint(_u3c1, 32) == $.uint(0, 32)) {
		let [parity, __goscriptShadow15] = dboxParity32($.uint(mant * 2, 32), _u3c6, _u3b2)
		if ((parity != ($.uint(((D - (Math.trunc(10 / 2))) % 2), 32) != $.uint(0, 32))) || (__goscriptShadow15 && ($.uint((yru % 2), 32) != $.uint(0, 32)))) {
			yru--
		}
	}
	dboxDigits(d, $.uint64(yru), -k0)
}

export function dboxDigits(d: __goscript_ftoa.decimalSlice | $.VarRef<__goscript_ftoa.decimalSlice> | null, mant: bigint, exp: number): void {
	let i = __goscript_itoa.formatBase10($.pointerValue<__goscript_ftoa.decimalSlice>(d).d, mant)
	$.pointerValue<__goscript_ftoa.decimalSlice>(d).d = $.goSlice($.pointerValue<__goscript_ftoa.decimalSlice>(d).d, i, undefined)
	$.pointerValue<__goscript_ftoa.decimalSlice>(d).nd = $.len($.pointerValue<__goscript_ftoa.decimalSlice>(d).d)
	$.pointerValue<__goscript_ftoa.decimalSlice>(d).dp = $.pointerValue<__goscript_ftoa.decimalSlice>(d).nd + exp
}

export function uadd128(u: __goscript_math.uint128, n: bigint): __goscript_math.uint128 {
	let sum = $.uint64($.uint64Add(u.Lo, n))
	// Check if lo is wrapped around.
	if (sum < u.Lo) {
		u.Hi++
	}
	u.Lo = sum
	return $.markAsStructValue($.cloneStructValue(u))
}

export function umul64(x: number, y: number): bigint {
	return $.uint64Mul($.uint64(x), $.uint64(y))
}

export function umul96Upper64(x: number, y: bigint): bigint {
	let yh = $.uint($.uint($.uint64Shr(y, 32), 32), 32)
	let yl = $.uint($.uint(y, 32), 32)

	let xyh = umul64($.uint(x, 32), $.uint(yh, 32))
	let xyl = umul64($.uint(x, 32), $.uint(yl, 32))

	return $.uint64Add(xyh, ($.uint64Shr(xyl, 32)))
}

export function umul96Lower64(x: number, y: bigint): bigint {
	return $.uint64($.uint64Mul($.uint64(x), y))
}

export function umul128Upper64(x: bigint, y: bigint): bigint {
	let a = $.uint($.uint($.uint64Shr(x, 32), 32), 32)
	let b = $.uint($.uint(x, 32), 32)
	let c = $.uint($.uint($.uint64Shr(y, 32), 32), 32)
	let d = $.uint($.uint(y, 32), 32)

	let ac = umul64($.uint(a, 32), $.uint(c, 32))
	let bc = umul64($.uint(b, 32), $.uint(c, 32))
	let ad = umul64($.uint(a, 32), $.uint(d, 32))
	let bd = umul64($.uint(b, 32), $.uint(d, 32))

	let intermediate = $.uint64Add(($.uint64Add(($.uint64Shr(bd, 32)), $.uint64($.uint(ad, 32)))), $.uint64($.uint(bc, 32)))

	return $.uint64Add(($.uint64Add(($.uint64Add(ac, ($.uint64Shr(intermediate, 32)))), ($.uint64Shr(ad, 32)))), ($.uint64Shr(bc, 32)))
}

export function umul192Upper128(x: bigint, y: __goscript_math.uint128): __goscript_math.uint128 {
	let r = $.markAsStructValue($.cloneStructValue(__goscript_math.umul128(x, y.Hi)))
	let t = umul128Upper64(x, y.Lo)
	return $.markAsStructValue($.cloneStructValue(uadd128($.markAsStructValue($.cloneStructValue(r)), t)))
}

export function umul192Lower128(x: bigint, y: __goscript_math.uint128): __goscript_math.uint128 {
	let high = $.uint64Mul(x, y.Hi)
	let highLow = $.markAsStructValue($.cloneStructValue(__goscript_math.umul128(x, y.Lo)))
	return $.markAsStructValue(new __goscript_math.uint128({Hi: $.uint64($.uint64Add(high, highLow.Hi)), Lo: highLow.Lo}))
}

export function dboxMulPow64(u: bigint, phi: __goscript_math.uint128): [bigint, boolean] {
	let intPart: bigint = 0n
	let isInt: boolean = false
	let r = $.markAsStructValue($.cloneStructValue(umul192Upper128(u, $.markAsStructValue($.cloneStructValue(phi)))))
	intPart = r.Hi
	isInt = r.Lo == 0n
	return [intPart, isInt]
}

export function dboxMulPow32(u: number, phi: bigint): [number, boolean] {
	let intPart: number = 0
	let isInt: boolean = false
	let r = umul96Upper64($.uint(u, 32), phi)
	intPart = $.uint($.uint($.uint64Shr(r, 32), 32), 32)
	isInt = $.uint($.uint(r, 32), 32) == $.uint(0, 32)
	return [intPart, isInt]
}

export function dboxParity64(mant2: bigint, phi: __goscript_math.uint128, beta: number): [boolean, boolean] {
	let parity: boolean = false
	let isInt: boolean = false
	let r = $.markAsStructValue($.cloneStructValue(umul192Lower128(mant2, $.markAsStructValue($.cloneStructValue(phi)))))
	parity = ($.uint64And(($.uint64Shr(r.Hi, (64 - beta))), 1)) != 0n
	isInt = ($.uint64Or(($.uint64($.uint64Shl(r.Hi, beta))), ($.uint64Shr(r.Lo, (64 - beta))))) == 0n
	return [parity, isInt]
}

export function dboxParity32(mant2: number, phi: bigint, beta: number): [boolean, boolean] {
	let parity: boolean = false
	let isInt: boolean = false
	let r = umul96Lower64($.uint(mant2, 32), phi)
	parity = ($.uint64And(($.uint64Shr(r, (64 - beta))), 1)) != 0n
	isInt = $.uint($.uint($.uint64Shr(r, (32 - beta)), 32), 32) == $.uint(0, 32)
	return [parity, isInt]
}

export function dboxDelta64(_u3c6: __goscript_math.uint128, _u3b2: number): number {
	return $.uint($.uint($.uint64Shr(_u3c6.Hi, ((64 - 1) - _u3b2)), 32), 32)
}

export function dboxDelta32(_u3c6: bigint, _u3b2: number): number {
	return $.uint($.uint($.uint64Shr(_u3c6, ((64 - 1) - _u3b2)), 32), 32)
}

export function mulLog10_2MinusLog10_4Over3(e: number): number {
	// e should be in the range [-2985, 2936].
	return ((e * 631305) - 261663) >> 21
}

export function dboxRange64(_u3c6: __goscript_math.uint128, _u3b2: number): [bigint, bigint] {
	let left: bigint = 0n
	let right: bigint = 0n
	left = $.uint64Shr(($.uint64Sub(_u3c6.Hi, ($.uint64Shr(_u3c6.Hi, (52 + 2))))), (((64 - 52) - 1) - _u3b2))
	right = $.uint64Shr(($.uint64Add(_u3c6.Hi, ($.uint64Shr(_u3c6.Hi, (52 + 1))))), (((64 - 52) - 1) - _u3b2))
	return [left, right]
}

export function dboxRange32(_u3c6: bigint, _u3b2: number): [number, number] {
	let left: number = 0
	let right: number = 0
	left = $.uint($.uint($.uint64Shr(($.uint64Sub(_u3c6, ($.uint64Shr(_u3c6, (23 + 2))))), (((64 - 23) - 1) - _u3b2)), 32), 32)
	right = $.uint($.uint($.uint64Shr(($.uint64Add(_u3c6, ($.uint64Shr(_u3c6, (23 + 1))))), (((64 - 23) - 1) - _u3b2)), 32), 32)
	return [$.uint(left, 32), $.uint(right, 32)]
}

export function dboxRoundUp64(phi: __goscript_math.uint128, beta: number): bigint {
	return $.uint64Div(($.uint64Add(($.uint64Shr(phi.Hi, ((((Math.trunc(128 / 2)) - 52) - 2) - beta))), 1)), 2)
}

export function dboxRoundUp32(phi: bigint, beta: number): number {
	return $.uint(Math.trunc($.uint($.uint64Add(($.uint64Shr(phi, (((64 - 23) - 2) - beta))), 1), 32) / 2), 32)
}

export function dboxPow64(k: number, e: number): [__goscript_math.uint128, number] {
	let _u3c6: __goscript_math.uint128 = $.markAsStructValue(new __goscript_math.uint128())
	let _u3b2: number = 0
	let __goscriptTuple8: any = __goscript_math.pow10(k)
	_u3c6 = __goscriptTuple8[0]
	let e1 = __goscriptTuple8[1]
	if ((k < 0) || (k > 55)) {
		_u3c6.Lo++
	}
	_u3b2 = (e + e1) - 1
	return [$.markAsStructValue($.cloneStructValue(_u3c6)), _u3b2]
}

export function dboxPow32(k: number, e: number): [bigint, number] {
	let mant: bigint = 0n
	let exp: number = 0
	let [m, e1, ] = __goscript_math.pow10(k)
	if ((k < 0) || (k > 27)) {
		m.Hi++
	}
	exp = (e + e1) - 1
	return [m.Hi, exp]
}
