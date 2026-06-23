// Generated file based on ftoa.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_atof from "./atof.gs.ts"

import * as __goscript_atoi from "./atoi.gs.ts"

import * as __goscript_decimal from "./decimal.gs.ts"

import * as __goscript_deps from "./deps.gs.ts"

import * as __goscript_ftoadbox from "./ftoadbox.gs.ts"

import * as __goscript_ftoafixed from "./ftoafixed.gs.ts"

import * as __goscript_itoa from "./itoa.gs.ts"

import * as __goscript_math from "./math.gs.ts"
import "./atof.gs.ts"
import "./atoi.gs.ts"
import "./decimal.gs.ts"
import "./deps.gs.ts"
import "./ftoadbox.gs.ts"
import "./ftoafixed.gs.ts"
import "./itoa.gs.ts"
import "./math.gs.ts"

export class floatInfo {
	public get mantbits(): number {
		return this._fields.mantbits.value
	}
	public set mantbits(value: number) {
		this._fields.mantbits.value = value
	}

	public get expbits(): number {
		return this._fields.expbits.value
	}
	public set expbits(value: number) {
		this._fields.expbits.value = value
	}

	public get bias(): number {
		return this._fields.bias.value
	}
	public set bias(value: number) {
		this._fields.bias.value = value
	}

	public _fields: {
		mantbits: $.VarRef<number>
		expbits: $.VarRef<number>
		bias: $.VarRef<number>
	}

	constructor(init?: Partial<{mantbits?: number, expbits?: number, bias?: number}>) {
		this._fields = {
			mantbits: $.varRef(init?.mantbits ?? (0 as unknown as number)),
			expbits: $.varRef(init?.expbits ?? (0 as unknown as number)),
			bias: $.varRef(init?.bias ?? (0 as unknown as number))
		}
	}

	public clone(): floatInfo {
		const cloned = new floatInfo()
		cloned._fields = {
			mantbits: $.varRef(this._fields.mantbits.value),
			expbits: $.varRef(this._fields.expbits.value),
			bias: $.varRef(this._fields.bias.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"strconv.floatInfo",
		() => new floatInfo(),
		[],
		floatInfo,
		[{ name: "mantbits", key: "mantbits", type: { kind: $.TypeKind.Basic, name: "uint" }, pkgPath: "internal/strconv", index: [0], offset: 0, exported: false }, { name: "expbits", key: "expbits", type: { kind: $.TypeKind.Basic, name: "uint" }, pkgPath: "internal/strconv", index: [1], offset: 8, exported: false }, { name: "bias", key: "bias", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "internal/strconv", index: [2], offset: 16, exported: false }]
	)
}

export class decimalSlice {
	public get d(): $.Slice<number> {
		return this._fields.d.value
	}
	public set d(value: $.Slice<number>) {
		this._fields.d.value = value
	}

	public get nd(): number {
		return this._fields.nd.value
	}
	public set nd(value: number) {
		this._fields.nd.value = value
	}

	public get dp(): number {
		return this._fields.dp.value
	}
	public set dp(value: number) {
		this._fields.dp.value = value
	}

	public _fields: {
		d: $.VarRef<$.Slice<number>>
		nd: $.VarRef<number>
		dp: $.VarRef<number>
	}

	constructor(init?: Partial<{d?: $.Slice<number>, nd?: number, dp?: number}>) {
		this._fields = {
			d: $.varRef(init?.d ?? (null as unknown as $.Slice<number>)),
			nd: $.varRef(init?.nd ?? (0 as unknown as number)),
			dp: $.varRef(init?.dp ?? (0 as unknown as number))
		}
	}

	public clone(): decimalSlice {
		const cloned = new decimalSlice()
		cloned._fields = {
			d: $.varRef(this._fields.d.value),
			nd: $.varRef(this._fields.nd.value),
			dp: $.varRef(this._fields.dp.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"strconv.decimalSlice",
		() => new decimalSlice(),
		[],
		decimalSlice,
		[{ name: "d", key: "d", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "internal/strconv", index: [0], offset: 0, exported: false }, { name: "nd", key: "nd", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "internal/strconv", index: [1], offset: 24, exported: false }, { name: "dp", key: "dp", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "internal/strconv", index: [2], offset: 32, exported: false }]
	)
}

export const lowerhex: string = "0123456789abcdef"

export const upperhex: string = "0123456789ABCDEF"

export const float32MantBits: number = 23

export const float32ExpBits: number = 8

export const float32Bias: number = -127

export const float64MantBits: number = 52

export const float64ExpBits: number = 11

export const float64Bias: number = -1023

export let float32info: $.VarRef<floatInfo> = $.varRef($.markAsStructValue(new floatInfo({mantbits: 23, expbits: 8, bias: -127})))

export function __goscript_set_float32info(__goscriptValue: floatInfo): void {
	float32info.value = __goscriptValue
}

export let float64info: $.VarRef<floatInfo> = $.varRef($.markAsStructValue(new floatInfo({mantbits: 52, expbits: 11, bias: -1023})))

export function __goscript_set_float64info(__goscriptValue: floatInfo): void {
	float64info.value = __goscriptValue
}

export function FormatFloat(f: number, fmt: number, prec: number, bitSize: number): string {
	return $.bytesToString(genericFtoa($.makeSlice<number>(0, $.max(prec + 4, 24), "byte"), f, $.uint(fmt, 8), prec, bitSize))
}

export function AppendFloat(dst: $.Slice<number>, f: number, fmt: number, prec: number, bitSize: number): $.Slice<number> {
	return genericFtoa(dst, f, $.uint(fmt, 8), prec, bitSize)
}

export function genericFtoa(dst: $.Slice<number>, val: number, fmt: number, prec: number, bitSize: number): $.Slice<number> {
	let bits: bigint = 0n
	let flt: floatInfo | $.VarRef<floatInfo> | null = null as floatInfo | $.VarRef<floatInfo> | null
	switch (bitSize) {
		case 32:
		{
			bits = $.uint64(__goscript_deps.float32bits(val))
			flt = float32info
			break
		}
		case 64:
		{
			bits = __goscript_deps.float64bits(val)
			flt = float64info
			break
		}
		default:
		{
			$.panic("strconv: illegal AppendFloat/FormatFloat bitSize")
			break
		}
	}

	let neg = ($.uint64Shr(bits, ($.uint($.uint64Add($.pointerValue<floatInfo>(flt).expbits, $.pointerValue<floatInfo>(flt).mantbits), 64)))) != 0n
	let exp = $.int($.uint64Shr(bits, $.pointerValue<floatInfo>(flt).mantbits)) & ((1 << $.pointerValue<floatInfo>(flt).expbits) - 1)
	let mant = $.uint64And(bits, ($.uint64Sub(($.uint64Shl(1n, $.pointerValue<floatInfo>(flt).mantbits)), 1)))
	let denorm = false

	switch (exp) {
		case (1 << $.pointerValue<floatInfo>(flt).expbits) - 1:
		{
			let s: string = ""
			switch (true) {
				case mant != 0n:
				{
					s = "NaN"
					break
				}
				case neg:
				{
					s = "-Inf"
					break
				}
				default:
				{
					s = "+Inf"
					break
				}
			}
			return $.appendSlice(dst, $.stringToBytes(s))
			break
		}
		case 0:
		{
			exp++
			denorm = true
			break
		}
		default:
		{
			mant = $.uint64Or(mant, $.uint64Shl(1n, $.pointerValue<floatInfo>(flt).mantbits))
			break
		}
	}
	exp = exp + ($.pointerValue<floatInfo>(flt).bias)

	// Pick off easy binary, hex formats.
	if ($.uint(fmt, 8) == $.uint(98, 8)) {
		return fmtB(dst, neg, mant, exp, flt)
	}
	if (($.uint(fmt, 8) == $.uint(120, 8)) || ($.uint(fmt, 8) == $.uint(88, 8))) {
		return fmtX(dst, prec, $.uint(fmt, 8), neg, mant, exp, flt)
	}

	if (!__goscript_atof.optimize) {
		return bigFtoa(dst, prec, $.uint(fmt, 8), neg, mant, exp, flt)
	}

	// Negative precision means "only as much as needed to be exact."
	let shortest = prec < 0
	let digs: $.VarRef<decimalSlice> = $.varRef($.markAsStructValue(new decimalSlice()))
	if (mant == 0n) {
		return formatDigits(dst, shortest, neg, $.markAsStructValue($.cloneStructValue(digs.value)), prec, $.uint(fmt, 8))
	}
	if (shortest) {
		// Use the Dragonbox algorithm.
		let buf: Uint8Array = new Uint8Array(32)
		digs.value.d = $.goSlice(buf, undefined, undefined)
		__goscript_ftoadbox.dboxFtoa(digs, mant, exp - $.int($.pointerValue<floatInfo>(flt).mantbits), denorm, bitSize)
		// Precision for shortest representation mode.
		switch (fmt) {
			case 101:
			case 69:
			{
				prec = $.max(digs.value.nd - 1, 0)
				break
			}
			case 102:
			{
				prec = $.max(digs.value.nd - digs.value.dp, 0)
				break
			}
			case 103:
			case 71:
			{
				prec = digs.value.nd
				break
			}
		}
		return formatDigits(dst, shortest, neg, $.markAsStructValue($.cloneStructValue(digs.value)), prec, $.uint(fmt, 8))
	}

	// Fixed number of digits.
	let digits = prec
	switch (fmt) {
		case 102:
		{
			if (exp >= 0) {
				digits = (1 + __goscript_math.mulLog10_2(1 + exp)) + prec
			} else {
				digits = (1 + prec) - __goscript_math.mulLog10_2(-exp)
			}
			break
		}
		case 101:
		case 69:
		{
			digits++
			break
		}
		case 103:
		case 71:
		{
			if (prec == 0) {
				prec = 1
			}
			digits = prec
			break
		}
		default:
		{
			digits = 1
			break
		}
	}
	if (digits <= 18) {
		// digits <= 0 happens for %f on very small numbers
		// and means that we're guaranteed to print all zeros.
		if (digits > 0) {
			let buf: Uint8Array = new Uint8Array(24)
			digs.value.d = $.goSlice(buf, undefined, undefined)
			__goscript_ftoafixed.fixedFtoa(digs, mant, exp - $.int($.pointerValue<floatInfo>(flt).mantbits), digits, prec, $.uint(fmt, 8))
		}
		return formatDigits(dst, false, neg, $.markAsStructValue($.cloneStructValue(digs.value)), prec, $.uint(fmt, 8))
	}

	return bigFtoa(dst, prec, $.uint(fmt, 8), neg, mant, exp, flt)
}

export function bigFtoa(dst: $.Slice<number>, prec: number, fmt: number, neg: boolean, mant: bigint, exp: number, flt: floatInfo | $.VarRef<floatInfo> | null): $.Slice<number> {
	let d: __goscript_decimal.decimal | $.VarRef<__goscript_decimal.decimal> | null = new __goscript_decimal.decimal()
	__goscript_decimal.decimal.prototype.Assign.call(d, mant)
	__goscript_decimal.decimal.prototype.Shift.call(d, exp - $.int($.pointerValue<floatInfo>(flt).mantbits))
	let digs: decimalSlice = $.markAsStructValue(new decimalSlice())
	let shortest = prec < 0
	if (shortest) {
		roundShortest(d, mant, exp, flt)
		digs = $.markAsStructValue(new decimalSlice({d: $.goSlice($.pointerValue<__goscript_decimal.decimal>(d).d, undefined, undefined), nd: $.pointerValue<__goscript_decimal.decimal>(d).nd, dp: $.pointerValue<__goscript_decimal.decimal>(d).dp}))
		// Precision for shortest representation mode.
		switch (fmt) {
			case 101:
			case 69:
			{
				prec = digs.nd - 1
				break
			}
			case 102:
			{
				prec = $.max(digs.nd - digs.dp, 0)
				break
			}
			case 103:
			case 71:
			{
				prec = digs.nd
				break
			}
		}
	} else {
		// Round appropriately.
		switch (fmt) {
			case 101:
			case 69:
			{
				__goscript_decimal.decimal.prototype.Round.call(d, prec + 1)
				break
			}
			case 102:
			{
				__goscript_decimal.decimal.prototype.Round.call(d, $.pointerValue<__goscript_decimal.decimal>(d).dp + prec)
				break
			}
			case 103:
			case 71:
			{
				if (prec == 0) {
					prec = 1
				}
				__goscript_decimal.decimal.prototype.Round.call(d, prec)
				break
			}
		}
		digs = $.markAsStructValue(new decimalSlice({d: $.goSlice($.pointerValue<__goscript_decimal.decimal>(d).d, undefined, undefined), nd: $.pointerValue<__goscript_decimal.decimal>(d).nd, dp: $.pointerValue<__goscript_decimal.decimal>(d).dp}))
	}
	return formatDigits(dst, shortest, neg, $.markAsStructValue($.cloneStructValue(digs)), prec, $.uint(fmt, 8))
}

export function formatDigits(dst: $.Slice<number>, shortest: boolean, neg: boolean, digs: decimalSlice, prec: number, fmt: number): $.Slice<number> {
	switch (fmt) {
		case 101:
		case 69:
		{
			return fmtE(dst, neg, $.markAsStructValue($.cloneStructValue(digs)), prec, $.uint(fmt, 8))
			break
		}
		case 102:
		{
			return fmtF(dst, neg, $.markAsStructValue($.cloneStructValue(digs)), prec)
			break
		}
		case 103:
		case 71:
		{
			let eprec = prec
			if ((eprec > digs.nd) && (digs.nd >= digs.dp)) {
				eprec = digs.nd
			}
			// %e is used if the exponent from the conversion
			// is less than -4 or greater than or equal to the precision.
			// if precision was the shortest possible, use precision 6 for this decision.
			if (shortest) {
				eprec = 6
			}
			let exp = digs.dp - 1
			if ((exp < -4) || (exp >= eprec)) {
				if (prec > digs.nd) {
					prec = digs.nd
				}
				return fmtE(dst, neg, $.markAsStructValue($.cloneStructValue(digs)), prec - 1, $.uint((fmt + 101) - 103, 8))
			}
			if (prec > digs.dp) {
				prec = digs.nd
			}
			return fmtF(dst, neg, $.markAsStructValue($.cloneStructValue(digs)), $.max(prec - digs.dp, 0))
			break
		}
	}

	// unknown format
	return $.append(dst, $.uint(37, 8), $.uint(fmt, 8))
}

export function roundShortest(d: __goscript_decimal.decimal | $.VarRef<__goscript_decimal.decimal> | null, mant: bigint, exp: number, flt: floatInfo | $.VarRef<floatInfo> | null): void {
	// If mantissa is zero, the number is zero; stop now.
	if (mant == 0n) {
		$.pointerValue<__goscript_decimal.decimal>(d).nd = 0
		return
	}

	// Compute upper and lower such that any decimal number
	// between upper and lower (possibly inclusive)
	// will round to the original floating point number.

	// We may see at once that the number is already shortest.
	//
	// Suppose d is not denormal, so that 2^exp <= d < 10^dp.
	// The closest shorter number is at least 10^(dp-nd) away.
	// The lower/upper bounds computed below are at distance
	// at most 2^(exp-mantbits).
	//
	// So the number is already shortest if 10^(dp-nd) > 2^(exp-mantbits),
	// or equivalently log2(10)*(dp-nd) > exp-mantbits.
	// It is true if 332/100*(dp-nd) >= exp-mantbits (log2(10) > 3.32).
	let minexp = $.pointerValue<floatInfo>(flt).bias + 1
	if ((exp > minexp) && ((332 * ($.pointerValue<__goscript_decimal.decimal>(d).dp - $.pointerValue<__goscript_decimal.decimal>(d).nd)) >= (100 * (exp - $.int($.pointerValue<floatInfo>(flt).mantbits))))) {
		// The number is already shortest.
		return
	}

	// d = mant << (exp - mantbits)
	// Next highest floating point number is mant+1 << exp-mantbits.
	// Our upper bound is halfway between, mant*2+1 << exp-mantbits-1.
	let upper: __goscript_decimal.decimal | $.VarRef<__goscript_decimal.decimal> | null = new __goscript_decimal.decimal()
	__goscript_decimal.decimal.prototype.Assign.call(upper, $.uint64Add(($.uint64Mul(mant, 2)), 1))
	__goscript_decimal.decimal.prototype.Shift.call(upper, (exp - $.int($.pointerValue<floatInfo>(flt).mantbits)) - 1)

	// d = mant << (exp - mantbits)
	// Next lowest floating point number is mant-1 << exp-mantbits,
	// unless mant-1 drops the significant bit and exp is not the minimum exp,
	// in which case the next lowest is mant*2-1 << exp-mantbits-1.
	// Either way, call it mantlo << explo-mantbits.
	// Our lower bound is halfway between, mantlo*2+1 << explo-mantbits-1.
	let mantlo: bigint = 0n
	let explo: number = 0
	if ((mant > ($.uint64Shl(1, $.pointerValue<floatInfo>(flt).mantbits))) || (exp == minexp)) {
		mantlo = $.uint64Sub(mant, 1)
		explo = exp
	} else {
		mantlo = $.uint64Sub(($.uint64Mul(mant, 2)), 1)
		explo = exp - 1
	}
	let lower: __goscript_decimal.decimal | $.VarRef<__goscript_decimal.decimal> | null = new __goscript_decimal.decimal()
	__goscript_decimal.decimal.prototype.Assign.call(lower, $.uint64Add(($.uint64Mul(mantlo, 2)), 1))
	__goscript_decimal.decimal.prototype.Shift.call(lower, (explo - $.int($.pointerValue<floatInfo>(flt).mantbits)) - 1)

	// The upper and lower bounds are possible outputs only if
	// the original mantissa is even, so that IEEE round-to-even
	// would round to the original mantissa and not the neighbors.
	let inclusive = ($.uint64Mod(mant, 2)) == 0n

	// As we walk the digits we want to know whether rounding up would fall
	// within the upper bound. This is tracked by upperdelta:
	//
	// If upperdelta == 0, the digits of d and upper are the same so far.
	//
	// If upperdelta == 1, we saw a difference of 1 between d and upper on a
	// previous digit and subsequently only 9s for d and 0s for upper.
	// (Thus rounding up may fall outside the bound, if it is exclusive.)
	//
	// If upperdelta == 2, then the difference is greater than 1
	// and we know that rounding up falls within the bound.
	let upperdelta: number = 0

	// Now we can figure out the minimum number of digits required.
	// Walk along until d has distinguished itself from upper and lower.
	for (let ui = 0; ; ui++) {
		// lower, d, and upper may have the decimal points at different
		// places. In this case upper is the longest, so we iterate from
		// ui==0 and start li and mi at (possibly) -1.
		let mi = (ui - $.pointerValue<__goscript_decimal.decimal>(upper).dp) + $.pointerValue<__goscript_decimal.decimal>(d).dp
		if (mi >= $.pointerValue<__goscript_decimal.decimal>(d).nd) {
			break
		}
		let li = (ui - $.pointerValue<__goscript_decimal.decimal>(upper).dp) + $.pointerValue<__goscript_decimal.decimal>(lower).dp
		let l = $.uint($.uint(48, 8), 8)
		if ((li >= 0) && (li < $.pointerValue<__goscript_decimal.decimal>(lower).nd)) {
			l = $.uint($.arrayIndex($.pointerValue<__goscript_decimal.decimal>(lower).d, li), 8)
		}
		let m = $.uint($.uint(48, 8), 8)
		if (mi >= 0) {
			m = $.uint($.arrayIndex($.pointerValue<__goscript_decimal.decimal>(d).d, mi), 8)
		}
		let u = $.uint($.uint(48, 8), 8)
		if (ui < $.pointerValue<__goscript_decimal.decimal>(upper).nd) {
			u = $.uint($.arrayIndex($.pointerValue<__goscript_decimal.decimal>(upper).d, ui), 8)
		}

		// Okay to round down (truncate) if lower has a different digit
		// or if lower is inclusive and is exactly the result of rounding
		// down (i.e., and we have reached the final digit of lower).
		let okdown = ($.uint(l, 8) != $.uint(m, 8)) || (inclusive && ((li + 1) == $.pointerValue<__goscript_decimal.decimal>(lower).nd))

		switch (true) {
			case ($.uint(upperdelta, 8) == $.uint(0, 8)) && ((m + 1) < u):
			{
				upperdelta = $.uint(2, 8)
				break
			}
			case ($.uint(upperdelta, 8) == $.uint(0, 8)) && ($.uint(m, 8) != $.uint(u, 8)):
			{
				upperdelta = $.uint(1, 8)
				break
			}
			case ($.uint(upperdelta, 8) == $.uint(1, 8)) && (($.uint(m, 8) != $.uint(57, 8)) || ($.uint(u, 8) != $.uint(48, 8))):
			{
				upperdelta = $.uint(2, 8)
				break
			}
		}
		// Okay to round up if upper has a different digit and either upper
		// is inclusive or upper is bigger than the result of rounding up.
		let okup = (upperdelta > 0) && ((inclusive || (upperdelta > 1)) || ((ui + 1) < $.pointerValue<__goscript_decimal.decimal>(upper).nd))

		// If it's okay to do either, then round to the nearest one.
		// If it's okay to do only one, do it.
		switch (true) {
			case okdown && okup:
			{
				__goscript_decimal.decimal.prototype.Round.call(d, mi + 1)
				return
				break
			}
			case okdown:
			{
				__goscript_decimal.decimal.prototype.RoundDown.call(d, mi + 1)
				return
				break
			}
			case okup:
			{
				__goscript_decimal.decimal.prototype.RoundUp.call(d, mi + 1)
				return
				break
			}
		}
	}
}

export function fmtE(dst: $.Slice<number>, neg: boolean, d: decimalSlice, prec: number, fmt: number): $.Slice<number> {
	// sign
	if (neg) {
		dst = $.append(dst, $.uint(45, 8))
	}

	// first digit
	let ch = $.uint($.uint(48, 8), 8)
	if (d.nd != 0) {
		ch = $.uint($.arrayIndex(d.d!, 0), 8)
	}
	dst = $.append(dst, $.uint(ch, 8))

	// .moredigits
	if (prec > 0) {
		dst = $.append(dst, $.uint(46, 8))
		let i = 1
		let m = $.min(d.nd, prec + 1)
		if (i < m) {
			dst = $.appendSlice(dst, $.goSlice(d.d, i, m))
			i = m
		}
		for (; i <= prec; i++) {
			dst = $.append(dst, $.uint(48, 8))
		}
	}

	// e±
	dst = $.append(dst, $.uint(fmt, 8))
	let exp = d.dp - 1
	if (d.nd == 0) {
		exp = 0
	}
	if (exp < 0) {
		ch = $.uint(45, 8)
		exp = -exp
	} else {
		ch = $.uint(43, 8)
	}
	dst = $.append(dst, $.uint(ch, 8))

	// dd or ddd
	switch (true) {
		case exp < 10:
		{
			dst = $.append(dst, $.uint(48, 8), $.uint($.uint(exp, 8) + 48, 8))
			break
		}
		case exp < 100:
		{
			dst = $.append(dst, $.uint($.uint(Math.trunc(exp / 10), 8) + 48, 8), $.uint($.uint(exp % 10, 8) + 48, 8))
			break
		}
		default:
		{
			dst = $.append(dst, $.uint($.uint(Math.trunc(exp / 100), 8) + 48, 8), $.uint(($.uint(Math.trunc(exp / 10), 8) % 10) + 48, 8), $.uint($.uint(exp % 10, 8) + 48, 8))
			break
		}
	}

	return dst
}

export function fmtF(dst: $.Slice<number>, neg: boolean, d: decimalSlice, prec: number): $.Slice<number> {
	// sign
	if (neg) {
		dst = $.append(dst, $.uint(45, 8))
	}

	// integer, padded with zeros as needed.
	if (d.dp > 0) {
		let m = $.min(d.nd, d.dp)
		dst = $.appendSlice(dst, $.goSlice(d.d, undefined, m))
		for (; m < d.dp; m++) {
			dst = $.append(dst, $.uint(48, 8))
		}
	} else {
		dst = $.append(dst, $.uint(48, 8))
	}

	// fraction
	if (prec > 0) {
		dst = $.append(dst, $.uint(46, 8))
		for (let i = 0; i < prec; i++) {
			let ch = $.uint($.uint(48, 8), 8)
			{
				let j = d.dp + i
				if ((0 <= j) && (j < d.nd)) {
					ch = $.uint($.arrayIndex(d.d!, j), 8)
				}
			}
			dst = $.append(dst, $.uint(ch, 8))
		}
	}

	return dst
}

export function fmtB(dst: $.Slice<number>, neg: boolean, mant: bigint, exp: number, flt: floatInfo | $.VarRef<floatInfo> | null): $.Slice<number> {
	// sign
	if (neg) {
		dst = $.append(dst, $.uint(45, 8))
	}

	// mantissa
	dst = __goscript_itoa.AppendUint(dst, mant, 10)

	// p
	dst = $.append(dst, $.uint(112, 8))

	// ±exponent
	exp = exp - ($.int($.pointerValue<floatInfo>(flt).mantbits))
	if (exp >= 0) {
		dst = $.append(dst, $.uint(43, 8))
	}
	dst = __goscript_itoa.AppendInt(dst, $.int64(exp), 10)

	return dst
}

export function fmtX(dst: $.Slice<number>, prec: number, fmt: number, neg: boolean, mant: bigint, exp: number, flt: floatInfo | $.VarRef<floatInfo> | null): $.Slice<number> {
	if (mant == 0n) {
		exp = 0
	}

	// Shift digits so leading 1 (if any) is at bit 1<<60.
	mant = $.uint64Shl(mant, $.uint64($.uint($.uint64Sub(60, $.pointerValue<floatInfo>(flt).mantbits), 64)))
	while ((mant != 0n) && (($.uint64And(mant, (1152921504606846976))) == 0n)) {
		mant = $.uint64Shl(mant, 1n)
		exp--
	}

	// Round if requested.
	if ((prec >= 0) && (prec < 15)) {
		let shift = $.uint(prec * 4, 64)
		let extra = $.uint64And(($.uint64Shl(mant, shift)), (1152921504606846975))
		mant = $.uint64Shr(mant, $.uint64($.uint($.uint64Sub(60, shift), 64)))
		if (($.uint64Or(extra, ($.uint64And(mant, 1)))) > (576460752303423488)) {
			mant++
		}
		mant = $.uint64Shl(mant, $.uint64($.uint($.uint64Sub(60, shift), 64)))
		if (($.uint64And(mant, (2305843009213693952))) != 0n) {
			// Wrapped around.
			mant = $.uint64Shr(mant, 1n)
			exp++
		}
	}

	let hex = "0123456789abcdef"
	if ($.uint(fmt, 8) == $.uint(88, 8)) {
		hex = "0123456789ABCDEF"
	}

	// sign, 0x, leading digit
	if (neg) {
		dst = $.append(dst, $.uint(45, 8))
	}
	dst = $.append(dst, $.uint(48, 8), $.uint(fmt, 8), $.uint(48 + $.uint($.uint64And(($.uint64Shr(mant, 60)), 1), 8), 8))

	// .fraction
	mant = $.uint64Shl(mant, 4n)
	if ((prec < 0) && (mant != 0n)) {
		dst = $.append(dst, $.uint(46, 8))
		while (mant != 0n) {
			dst = $.append(dst, $.uint($.indexStringOrBytes(hex, Number($.uint64And(($.uint64Shr(mant, 60)), 15))), 8))
			mant = $.uint64Shl(mant, 4n)
		}
	} else {
		if (prec > 0) {
			dst = $.append(dst, $.uint(46, 8))
			for (let i = 0; i < prec; i++) {
				dst = $.append(dst, $.uint($.indexStringOrBytes(hex, Number($.uint64And(($.uint64Shr(mant, 60)), 15))), 8))
				mant = $.uint64Shl(mant, 4n)
			}
		}
	}

	// p±
	let ch = $.uint($.uint(80, 8), 8)
	if ($.uint(fmt, 8) == $.uint(__goscript_atoi.lower($.uint(fmt, 8)), 8)) {
		ch = $.uint(112, 8)
	}
	dst = $.append(dst, $.uint(ch, 8))
	if (exp < 0) {
		ch = $.uint(45, 8)
		exp = -exp
	} else {
		ch = $.uint(43, 8)
	}
	dst = $.append(dst, $.uint(ch, 8))

	// dd or ddd or dddd
	switch (true) {
		case exp < 100:
		{
			dst = $.append(dst, $.uint($.uint(Math.trunc(exp / 10), 8) + 48, 8), $.uint($.uint(exp % 10, 8) + 48, 8))
			break
		}
		case exp < 1000:
		{
			dst = $.append(dst, $.uint($.uint(Math.trunc(exp / 100), 8) + 48, 8), $.uint($.uint((Math.trunc(exp / 10)) % 10, 8) + 48, 8), $.uint($.uint(exp % 10, 8) + 48, 8))
			break
		}
		default:
		{
			dst = $.append(dst, $.uint($.uint(Math.trunc(exp / 1000), 8) + 48, 8), $.uint(($.uint(Math.trunc(exp / 100), 8) % 10) + 48, 8), $.uint($.uint((Math.trunc(exp / 10)) % 10, 8) + 48, 8), $.uint($.uint(exp % 10, 8) + 48, 8))
			break
		}
	}

	return dst
}
