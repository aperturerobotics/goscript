// Generated file based on decimal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_atof from "./atof.gs.ts"

import * as __goscript_atoi from "./atoi.gs.ts"

import type * as __goscript_ftoa from "./ftoa.gs.ts"
import "./atof.gs.ts"
import "./atoi.gs.ts"

export class decimal {
	public get d(): Uint8Array {
		return this._fields.d.value
	}
	public set d(value: Uint8Array) {
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

	public get neg(): boolean {
		return this._fields.neg.value
	}
	public set neg(value: boolean) {
		this._fields.neg.value = value
	}

	public get trunc(): boolean {
		return this._fields.trunc.value
	}
	public set trunc(value: boolean) {
		this._fields.trunc.value = value
	}

	public _fields: {
		d: $.VarRef<Uint8Array>
		nd: $.VarRef<number>
		dp: $.VarRef<number>
		neg: $.VarRef<boolean>
		trunc: $.VarRef<boolean>
	}

	constructor(init?: Partial<{d?: Uint8Array, nd?: number, dp?: number, neg?: boolean, trunc?: boolean}>) {
		this._fields = {
			d: $.varRef(init?.d !== undefined ? $.cloneArrayValue(init.d) : new Uint8Array(800)),
			nd: $.varRef(init?.nd ?? (0 as unknown as number)),
			dp: $.varRef(init?.dp ?? (0 as unknown as number)),
			neg: $.varRef(init?.neg ?? (false as unknown as boolean)),
			trunc: $.varRef(init?.trunc ?? (false as unknown as boolean))
		}
	}

	public clone(): decimal {
		const cloned = new decimal()
		cloned._fields = {
			d: $.varRef($.cloneArrayValue(this._fields.d.value)),
			nd: $.varRef(this._fields.nd.value),
			dp: $.varRef(this._fields.dp.value),
			neg: $.varRef(this._fields.neg.value),
			trunc: $.varRef(this._fields.trunc.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Assign(v: number): void {
		let a: decimal | $.VarRef<decimal> | null = this
		let buf: Uint8Array = new Uint8Array(24)

		// Write reversed decimal in buf.
		let n = 0
		while (v > 0) {
			let v1 = $.uint($.uint64Div(v, 10), 64)
			v = $.uint64Sub(v, $.uint($.uint64Mul(10, v1), 64))
			buf[n] = $.uint($.uint($.uint64Add(v, 48), 8), 8)
			n++
			v = $.uint(v1, 64)
		}

		// Reverse again to produce forward decimal in a.d.
		$.pointerValue<decimal>(a).nd = 0
		for (n--; n >= 0; n--) {
			$.pointerValue<decimal>(a).d[$.pointerValue<decimal>(a).nd] = $.uint(buf[n], 8)
			$.pointerValue<decimal>(a).nd++
		}
		$.pointerValue<decimal>(a).dp = $.pointerValue<decimal>(a).nd
		trim(a)
	}

	public Round(nd: number): void {
		const a: decimal | $.VarRef<decimal> | null = this
		if ((nd < 0) || (nd >= $.pointerValue<decimal>(a).nd)) {
			return
		}
		if (shouldRoundUp(a, nd)) {
			decimal.prototype.RoundUp.call(a, nd)
		} else {
			decimal.prototype.RoundDown.call(a, nd)
		}
	}

	public RoundDown(nd: number): void {
		let a: decimal | $.VarRef<decimal> | null = this
		if ((nd < 0) || (nd >= $.pointerValue<decimal>(a).nd)) {
			return
		}
		$.pointerValue<decimal>(a).nd = nd
		trim(a)
	}

	public RoundUp(nd: number): void {
		let a: decimal | $.VarRef<decimal> | null = this
		if ((nd < 0) || (nd >= $.pointerValue<decimal>(a).nd)) {
			return
		}

		// round up
		for (let i = nd - 1; i >= 0; i--) {
			let c = $.uint($.pointerValue<decimal>(a).d[i], 8)
			if (c < 57) {
				$.pointerValue<decimal>(a).d[i]++
				$.pointerValue<decimal>(a).nd = i + 1
				return
			}
		}

		// Number is all 9s.
		// Change to single 1 with adjusted decimal point.
		$.pointerValue<decimal>(a).d[0] = $.uint(49, 8)
		$.pointerValue<decimal>(a).nd = 1
		$.pointerValue<decimal>(a).dp++
	}

	public RoundedInteger(): number {
		const a: decimal | $.VarRef<decimal> | null = this
		if ($.pointerValue<decimal>(a).dp > 20) {
			return $.uint("18446744073709551615", 64)
		}
		let i: number = 0
		let n = $.uint($.uint(0, 64), 64)
		for (i = 0; (i < $.pointerValue<decimal>(a).dp) && (i < $.pointerValue<decimal>(a).nd); i++) {
			n = $.uint($.uint64Add(($.uint64Mul(n, 10)), $.uint($.pointerValue<decimal>(a).d[i] - 48, 64)), 64)
		}
		for (; i < $.pointerValue<decimal>(a).dp; i++) {
			n = $.uint64Mul(n, $.uint(10, 64))
		}
		if (shouldRoundUp(a, $.pointerValue<decimal>(a).dp)) {
			n++
		}
		return $.uint(n, 64)
	}

	public Shift(k: number): void {
		const a: decimal | $.VarRef<decimal> | null = this
		switch (true) {
			case $.pointerValue<decimal>(a).nd == 0:
			{
				break
			}
			case k > 0:
			{
				while (k > 60) {
					leftShift(a, 60)
					k = k - (60)
				}
				leftShift(a, $.uint(k, 64))
				break
			}
			case k < 0:
			{
				while (k < -60) {
					rightShift(a, 60)
					k = k + (60)
				}
				rightShift(a, $.uint(-k, 64))
				break
			}
		}
	}

	public String(): string {
		const a: decimal | $.VarRef<decimal> | null = this
		let n = 10 + $.pointerValue<decimal>(a).nd
		if ($.pointerValue<decimal>(a).dp > 0) {
			n = n + ($.pointerValue<decimal>(a).dp)
		}
		if ($.pointerValue<decimal>(a).dp < 0) {
			n = n + (-$.pointerValue<decimal>(a).dp)
		}

		let buf: $.Slice<number> = $.makeSlice<number>(n, undefined, "byte")
		let w = 0
		switch (true) {
			case $.pointerValue<decimal>(a).nd == 0:
			{
				return "0"
				break
			}
			case $.pointerValue<decimal>(a).dp <= 0:
			{
				buf![w] = $.uint(48, 8)
				w++
				buf![w] = $.uint(46, 8)
				w++
				w = w + (digitZero($.goSlice(buf, w, w + -$.pointerValue<decimal>(a).dp)))
				w = w + ($.copy($.goSlice(buf, w, undefined), $.goSlice($.pointerValue<decimal>(a).d, 0, $.pointerValue<decimal>(a).nd)))
				break
			}
			case $.pointerValue<decimal>(a).dp < $.pointerValue<decimal>(a).nd:
			{
				w = w + ($.copy($.goSlice(buf, w, undefined), $.goSlice($.pointerValue<decimal>(a).d, 0, $.pointerValue<decimal>(a).dp)))
				buf![w] = $.uint(46, 8)
				w++
				w = w + ($.copy($.goSlice(buf, w, undefined), $.goSlice($.pointerValue<decimal>(a).d, $.pointerValue<decimal>(a).dp, $.pointerValue<decimal>(a).nd)))
				break
			}
			default:
			{
				w = w + ($.copy($.goSlice(buf, w, undefined), $.goSlice($.pointerValue<decimal>(a).d, 0, $.pointerValue<decimal>(a).nd)))
				w = w + (digitZero($.goSlice(buf, w, (w + $.pointerValue<decimal>(a).dp) - $.pointerValue<decimal>(a).nd)))
				break
			}
		}
		return $.bytesToString($.goSlice(buf, 0, w))
	}

	public floatBits(flt: __goscript_ftoa.floatInfo | $.VarRef<__goscript_ftoa.floatInfo> | null): [number, boolean] {
		const d: decimal | $.VarRef<decimal> | null = this
		let b: number = 0
		let overflow: boolean = false
		let exp: number = 0
		let mant: number = 0
		// Binary shift left (k > 0) or right (k < 0).

		out: {
			overflow: {
				// Binary shift left (k > 0) or right (k < 0).

				if ($.pointerValue<decimal>(d).nd == 0) {
					mant = $.uint(0, 64)
					exp = $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias
					break out
				}

				if ($.pointerValue<decimal>(d).dp > 310) {
					break overflow
				}
				if ($.pointerValue<decimal>(d).dp < -330) {

					mant = $.uint(0, 64)
					exp = $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias
					break out
				}
				// If we chop a at nd digits, should we round up?

				exp = 0
				while ($.pointerValue<decimal>(d).dp > 0) {
					let n: number = 0
					if ($.pointerValue<decimal>(d).dp >= $.len(__goscript_atof.powtab)) {
						n = 27
					} else {
						n = __goscript_atof.powtab![$.pointerValue<decimal>(d).dp]
					}
					decimal.prototype.Shift.call(d, -n)
					exp = exp + (n)
				}
				while (($.pointerValue<decimal>(d).dp < 0) || (($.pointerValue<decimal>(d).dp == 0) && ($.pointerValue<decimal>(d).d[0] < 53))) {
					let n: number = 0
					if (-$.pointerValue<decimal>(d).dp >= $.len(__goscript_atof.powtab)) {
						n = 27
					} else {
						n = __goscript_atof.powtab![-$.pointerValue<decimal>(d).dp]
					}
					decimal.prototype.Shift.call(d, n)
					exp = exp - (n)
				}

				exp--

				if (exp < ($.pointerValue<__goscript_ftoa.floatInfo>(flt).bias + 1)) {
					let n = ($.pointerValue<__goscript_ftoa.floatInfo>(flt).bias + 1) - exp
					decimal.prototype.Shift.call(d, -n)
					exp = exp + (n)
				}

				if ((exp - $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias) >= ((1 << $.pointerValue<__goscript_ftoa.floatInfo>(flt).expbits) - 1)) {
					break overflow
				}

				// Round a up to nd digits (or fewer).
				decimal.prototype.Shift.call(d, $.int($.uint64Add(1, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits)))
				mant = $.uint(decimal.prototype.RoundedInteger.call(d), 64)

				if ($.uint(mant, 64) == $.uint(($.uint64Shl(2, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits)), 64)) {
					mant = $.uint64Shr(mant, $.uint(1, 64))
					exp++
					if ((exp - $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias) >= ((1 << $.pointerValue<__goscript_ftoa.floatInfo>(flt).expbits) - 1)) {
						break overflow
					}
				}

				if ($.uint(($.uint64And(mant, ($.uint64Shl(1, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits)))), 64) == $.uint(0, 64)) {
					exp = $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias
				}
				break out
			}

			mant = $.uint(0, 64)
			exp = ((1 << $.pointerValue<__goscript_ftoa.floatInfo>(flt).expbits) - 1) + $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias
			overflow = true
		}
		let bits = $.uint($.uint64And(mant, ($.uint64Sub(($.uint64Shl($.uint(1, 64), $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits)), 1))), 64)
		bits = $.uint64Or(bits, $.uint($.uint64Shl($.uint((exp - $.pointerValue<__goscript_ftoa.floatInfo>(flt).bias) & ((1 << $.pointerValue<__goscript_ftoa.floatInfo>(flt).expbits) - 1), 64), $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits), 64))
		if ($.pointerValue<decimal>(d).neg) {
			bits = $.uint64Or(bits, $.uint($.uint64Shl(($.uint64Shl(1, $.pointerValue<__goscript_ftoa.floatInfo>(flt).mantbits)), $.pointerValue<__goscript_ftoa.floatInfo>(flt).expbits), 64))
		}
		return [$.uint(bits, 64), overflow]
	}

	public ["set"](s: string): boolean {
		let b: decimal | $.VarRef<decimal> | null = this
		let ok: boolean = false
		let i = 0
		$.pointerValue<decimal>(b).neg = false
		$.pointerValue<decimal>(b).trunc = false

		if (i >= $.len(s)) {
			return ok
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
				$.pointerValue<decimal>(b).neg = true
				break
			}
		}

		let sawdot = false
		let sawdigits = false
		for (; i < $.len(s); i++) {
			switch (true) {
				case $.uint($.indexStringOrBytes(s, i), 8) == $.uint(95, 8):
				{
					continue
					break
				}
				case $.uint($.indexStringOrBytes(s, i), 8) == $.uint(46, 8):
				{
					if (sawdot) {
						return ok
					}
					sawdot = true
					$.pointerValue<decimal>(b).dp = $.pointerValue<decimal>(b).nd
					continue
					break
				}
				case (48 <= $.indexStringOrBytes(s, i)) && ($.indexStringOrBytes(s, i) <= 57):
				{
					sawdigits = true
					if (($.uint($.indexStringOrBytes(s, i), 8) == $.uint(48, 8)) && ($.pointerValue<decimal>(b).nd == 0)) {
						$.pointerValue<decimal>(b).dp--
						continue
					}
					if ($.pointerValue<decimal>(b).nd < $.len($.pointerValue<decimal>(b).d)) {
						$.pointerValue<decimal>(b).d[$.pointerValue<decimal>(b).nd] = $.uint($.indexStringOrBytes(s, i), 8)
						$.pointerValue<decimal>(b).nd++
					} else {
						if ($.uint($.indexStringOrBytes(s, i), 8) != $.uint(48, 8)) {
							$.pointerValue<decimal>(b).trunc = true
						}
					}
					continue
					break
				}
			}
			break
		}
		if (!sawdigits) {
			return ok
		}
		if (!sawdot) {
			$.pointerValue<decimal>(b).dp = $.pointerValue<decimal>(b).nd
		}

		if ((i < $.len(s)) && ($.uint(__goscript_atoi.lower($.uint($.indexStringOrBytes(s, i), 8)), 8) == $.uint(101, 8))) {
			i++
			if (i >= $.len(s)) {
				return ok
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
				return ok
			}
			let e = 0
			for (; (i < $.len(s)) && (((48 <= $.indexStringOrBytes(s, i)) && ($.indexStringOrBytes(s, i) <= 57)) || ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(95, 8))); i++) {
				if ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(95, 8)) {

					continue
				}
				if (e < 10000) {
					e = ((e * 10) + $.int($.indexStringOrBytes(s, i))) - 48
				}
			}
			$.pointerValue<decimal>(b).dp = $.pointerValue<decimal>(b).dp + (e * esign)
		}

		if (i != $.len(s)) {
			return ok
		}

		ok = true
		return ok
	}

	static __typeInfo = $.registerStructType(
		"strconv.decimal",
		() => new decimal(),
		[{ name: "Assign", args: [{ name: "v", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [] }, { name: "Round", args: [{ name: "nd", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "RoundDown", args: [{ name: "nd", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "RoundUp", args: [{ name: "nd", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "RoundedInteger", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "Shift", args: [{ name: "k", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "floatBits", args: [{ name: "flt", type: { kind: $.TypeKind.Pointer, elemType: "strconv.floatInfo" } }], returns: [{ name: "b", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "overflow", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "set", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "ok", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		decimal,
		[{ name: "d", key: "d", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 800 }, pkgPath: "internal/strconv", index: [0], offset: 0, exported: false }, { name: "nd", key: "nd", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "internal/strconv", index: [1], offset: 800, exported: false }, { name: "dp", key: "dp", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "internal/strconv", index: [2], offset: 808, exported: false }, { name: "neg", key: "neg", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "internal/strconv", index: [3], offset: 816, exported: false }, { name: "trunc", key: "trunc", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "internal/strconv", index: [4], offset: 817, exported: false }]
	)
}

export class leftCheat {
	public get delta(): number {
		return this._fields.delta.value
	}
	public set delta(value: number) {
		this._fields.delta.value = value
	}

	public get cutoff(): string {
		return this._fields.cutoff.value
	}
	public set cutoff(value: string) {
		this._fields.cutoff.value = value
	}

	public _fields: {
		delta: $.VarRef<number>
		cutoff: $.VarRef<string>
	}

	constructor(init?: Partial<{delta?: number, cutoff?: string}>) {
		this._fields = {
			delta: $.varRef(init?.delta ?? (0 as unknown as number)),
			cutoff: $.varRef(init?.cutoff ?? ("" as unknown as string))
		}
	}

	public clone(): leftCheat {
		const cloned = new leftCheat()
		cloned._fields = {
			delta: $.varRef(this._fields.delta.value),
			cutoff: $.varRef(this._fields.cutoff.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"strconv.leftCheat",
		() => new leftCheat(),
		[],
		leftCheat,
		[{ name: "delta", key: "delta", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "internal/strconv", index: [0], offset: 0, exported: false }, { name: "cutoff", key: "cutoff", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "internal/strconv", index: [1], offset: 8, exported: false }]
	)
}

export const uintSize: number = 64

export const maxShift: number = 60

export function digitZero(dst: $.Slice<number>): number {
	for (let __goscriptRangeTarget0 = dst, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		dst![i] = $.uint(48, 8)
	}
	return $.len(dst)
}

export function trim(a: decimal | $.VarRef<decimal> | null): void {
	while (($.pointerValue<decimal>(a).nd > 0) && ($.uint($.pointerValue<decimal>(a).d[$.pointerValue<decimal>(a).nd - 1], 8) == $.uint(48, 8))) {
		$.pointerValue<decimal>(a).nd--
	}
	if ($.pointerValue<decimal>(a).nd == 0) {
		$.pointerValue<decimal>(a).dp = 0
	}
}

export function rightShift(a: decimal | $.VarRef<decimal> | null, k: number): void {
	let r = 0
	let w = 0

	// Pick up enough leading digits to cover first shift.
	let n: number = 0
	for (; ($.uint64Shr(n, k)) == 0; r++) {
		if (r >= $.pointerValue<decimal>(a).nd) {
			if (n == 0) {
				// a == 0; shouldn't get here, but handle anyway.
				$.pointerValue<decimal>(a).nd = 0
				return
			}
			while (($.uint64Shr(n, k)) == 0) {
				n = $.uint64Mul(n, 10)
				r++
			}
			break
		}
		let c = $.uint($.pointerValue<decimal>(a).d[r], 64)
		n = $.uint64Sub(($.uint64Add(($.uint64Mul(n, 10)), c)), 48)
	}
	$.pointerValue<decimal>(a).dp = $.pointerValue<decimal>(a).dp - (r - 1)

	let mask: number = $.uint64Sub(($.uint64Shl(1, k)), 1)

	// Pick up a digit, put down a digit.
	for (; r < $.pointerValue<decimal>(a).nd; r++) {
		let c = $.uint($.pointerValue<decimal>(a).d[r], 64)
		let dig = $.uint64Shr(n, k)
		n = $.uint64And(n, mask)
		$.pointerValue<decimal>(a).d[w] = $.uint($.uint($.uint64Add(dig, 48), 8), 8)
		w++
		n = $.uint64Sub(($.uint64Add(($.uint64Mul(n, 10)), c)), 48)
	}

	// Put down extra digits.
	while (n > 0) {
		let dig = $.uint64Shr(n, k)
		n = $.uint64And(n, mask)
		if (w < $.len($.pointerValue<decimal>(a).d)) {
			$.pointerValue<decimal>(a).d[w] = $.uint($.uint($.uint64Add(dig, 48), 8), 8)
			w++
		} else {
			if (dig > 0) {
				$.pointerValue<decimal>(a).trunc = true
			}
		}
		n = $.uint64Mul(n, 10)
	}

	$.pointerValue<decimal>(a).nd = w
	trim(a)
}

export let leftcheats: $.Slice<leftCheat> = $.arrayToSlice<leftCheat>([$.markAsStructValue(new leftCheat({delta: 0, cutoff: ""})), $.markAsStructValue(new leftCheat({delta: 1, cutoff: "5"})), $.markAsStructValue(new leftCheat({delta: 1, cutoff: "25"})), $.markAsStructValue(new leftCheat({delta: 1, cutoff: "125"})), $.markAsStructValue(new leftCheat({delta: 2, cutoff: "625"})), $.markAsStructValue(new leftCheat({delta: 2, cutoff: "3125"})), $.markAsStructValue(new leftCheat({delta: 2, cutoff: "15625"})), $.markAsStructValue(new leftCheat({delta: 3, cutoff: "78125"})), $.markAsStructValue(new leftCheat({delta: 3, cutoff: "390625"})), $.markAsStructValue(new leftCheat({delta: 3, cutoff: "1953125"})), $.markAsStructValue(new leftCheat({delta: 4, cutoff: "9765625"})), $.markAsStructValue(new leftCheat({delta: 4, cutoff: "48828125"})), $.markAsStructValue(new leftCheat({delta: 4, cutoff: "244140625"})), $.markAsStructValue(new leftCheat({delta: 4, cutoff: "1220703125"})), $.markAsStructValue(new leftCheat({delta: 5, cutoff: "6103515625"})), $.markAsStructValue(new leftCheat({delta: 5, cutoff: "30517578125"})), $.markAsStructValue(new leftCheat({delta: 5, cutoff: "152587890625"})), $.markAsStructValue(new leftCheat({delta: 6, cutoff: "762939453125"})), $.markAsStructValue(new leftCheat({delta: 6, cutoff: "3814697265625"})), $.markAsStructValue(new leftCheat({delta: 6, cutoff: "19073486328125"})), $.markAsStructValue(new leftCheat({delta: 7, cutoff: "95367431640625"})), $.markAsStructValue(new leftCheat({delta: 7, cutoff: "476837158203125"})), $.markAsStructValue(new leftCheat({delta: 7, cutoff: "2384185791015625"})), $.markAsStructValue(new leftCheat({delta: 7, cutoff: "11920928955078125"})), $.markAsStructValue(new leftCheat({delta: 8, cutoff: "59604644775390625"})), $.markAsStructValue(new leftCheat({delta: 8, cutoff: "298023223876953125"})), $.markAsStructValue(new leftCheat({delta: 8, cutoff: "1490116119384765625"})), $.markAsStructValue(new leftCheat({delta: 9, cutoff: "7450580596923828125"})), $.markAsStructValue(new leftCheat({delta: 9, cutoff: "37252902984619140625"})), $.markAsStructValue(new leftCheat({delta: 9, cutoff: "186264514923095703125"})), $.markAsStructValue(new leftCheat({delta: 10, cutoff: "931322574615478515625"})), $.markAsStructValue(new leftCheat({delta: 10, cutoff: "4656612873077392578125"})), $.markAsStructValue(new leftCheat({delta: 10, cutoff: "23283064365386962890625"})), $.markAsStructValue(new leftCheat({delta: 10, cutoff: "116415321826934814453125"})), $.markAsStructValue(new leftCheat({delta: 11, cutoff: "582076609134674072265625"})), $.markAsStructValue(new leftCheat({delta: 11, cutoff: "2910383045673370361328125"})), $.markAsStructValue(new leftCheat({delta: 11, cutoff: "14551915228366851806640625"})), $.markAsStructValue(new leftCheat({delta: 12, cutoff: "72759576141834259033203125"})), $.markAsStructValue(new leftCheat({delta: 12, cutoff: "363797880709171295166015625"})), $.markAsStructValue(new leftCheat({delta: 12, cutoff: "1818989403545856475830078125"})), $.markAsStructValue(new leftCheat({delta: 13, cutoff: "9094947017729282379150390625"})), $.markAsStructValue(new leftCheat({delta: 13, cutoff: "45474735088646411895751953125"})), $.markAsStructValue(new leftCheat({delta: 13, cutoff: "227373675443232059478759765625"})), $.markAsStructValue(new leftCheat({delta: 13, cutoff: "1136868377216160297393798828125"})), $.markAsStructValue(new leftCheat({delta: 14, cutoff: "5684341886080801486968994140625"})), $.markAsStructValue(new leftCheat({delta: 14, cutoff: "28421709430404007434844970703125"})), $.markAsStructValue(new leftCheat({delta: 14, cutoff: "142108547152020037174224853515625"})), $.markAsStructValue(new leftCheat({delta: 15, cutoff: "710542735760100185871124267578125"})), $.markAsStructValue(new leftCheat({delta: 15, cutoff: "3552713678800500929355621337890625"})), $.markAsStructValue(new leftCheat({delta: 15, cutoff: "17763568394002504646778106689453125"})), $.markAsStructValue(new leftCheat({delta: 16, cutoff: "88817841970012523233890533447265625"})), $.markAsStructValue(new leftCheat({delta: 16, cutoff: "444089209850062616169452667236328125"})), $.markAsStructValue(new leftCheat({delta: 16, cutoff: "2220446049250313080847263336181640625"})), $.markAsStructValue(new leftCheat({delta: 16, cutoff: "11102230246251565404236316680908203125"})), $.markAsStructValue(new leftCheat({delta: 17, cutoff: "55511151231257827021181583404541015625"})), $.markAsStructValue(new leftCheat({delta: 17, cutoff: "277555756156289135105907917022705078125"})), $.markAsStructValue(new leftCheat({delta: 17, cutoff: "1387778780781445675529539585113525390625"})), $.markAsStructValue(new leftCheat({delta: 18, cutoff: "6938893903907228377647697925567626953125"})), $.markAsStructValue(new leftCheat({delta: 18, cutoff: "34694469519536141888238489627838134765625"})), $.markAsStructValue(new leftCheat({delta: 18, cutoff: "173472347597680709441192448139190673828125"})), $.markAsStructValue(new leftCheat({delta: 19, cutoff: "867361737988403547205962240695953369140625"}))])

export function __goscript_set_leftcheats(__goscriptValue: $.Slice<leftCheat>): void {
	leftcheats = __goscriptValue
}

export function prefixIsLessThan(b: $.Slice<number>, s: string): boolean {
	for (let i = 0; i < $.len(s); i++) {
		if (i >= $.len(b)) {
			return true
		}
		if ($.uint(b![i], 8) != $.uint($.indexStringOrBytes(s, i), 8)) {
			return b![i] < $.indexStringOrBytes(s, i)
		}
	}
	return false
}

export function leftShift(a: decimal | $.VarRef<decimal> | null, k: number): void {
	let delta = leftcheats![k].delta
	if (prefixIsLessThan($.goSlice($.pointerValue<decimal>(a).d, 0, $.pointerValue<decimal>(a).nd), leftcheats![k].cutoff)) {
		delta--
	}

	let r = $.pointerValue<decimal>(a).nd
	let w = $.pointerValue<decimal>(a).nd + delta

	// Pick up a digit, put down a digit.
	let n: number = 0
	for (r--; r >= 0; r--) {
		n = $.uint64Add(n, $.uint64Shl(($.uint64Sub($.uint($.pointerValue<decimal>(a).d[r], 64), 48)), k))
		let quo = $.uint64Div(n, 10)
		let rem = $.uint64Sub(n, ($.uint64Mul(10, quo)))
		w--
		if (w < $.len($.pointerValue<decimal>(a).d)) {
			$.pointerValue<decimal>(a).d[w] = $.uint($.uint($.uint64Add(rem, 48), 8), 8)
		} else {
			if (rem != 0) {
				$.pointerValue<decimal>(a).trunc = true
			}
		}
		n = quo
	}

	// Put down extra digits.
	while (n > 0) {
		let quo = $.uint64Div(n, 10)
		let rem = $.uint64Sub(n, ($.uint64Mul(10, quo)))
		w--
		if (w < $.len($.pointerValue<decimal>(a).d)) {
			$.pointerValue<decimal>(a).d[w] = $.uint($.uint($.uint64Add(rem, 48), 8), 8)
		} else {
			if (rem != 0) {
				$.pointerValue<decimal>(a).trunc = true
			}
		}
		n = quo
	}

	$.pointerValue<decimal>(a).nd = $.pointerValue<decimal>(a).nd + (delta)
	if ($.pointerValue<decimal>(a).nd >= $.len($.pointerValue<decimal>(a).d)) {
		$.pointerValue<decimal>(a).nd = $.len($.pointerValue<decimal>(a).d)
	}
	$.pointerValue<decimal>(a).dp = $.pointerValue<decimal>(a).dp + (delta)
	trim(a)
}

export function shouldRoundUp(a: decimal | $.VarRef<decimal> | null, nd: number): boolean {
	if ((nd < 0) || (nd >= $.pointerValue<decimal>(a).nd)) {
		return false
	}
	if (($.uint($.pointerValue<decimal>(a).d[nd], 8) == $.uint(53, 8)) && ((nd + 1) == $.pointerValue<decimal>(a).nd)) {
		// if we truncated, a little higher than what's recorded - always round up
		if ($.pointerValue<decimal>(a).trunc) {
			return true
		}
		return (nd > 0) && ($.uint((($.pointerValue<decimal>(a).d[nd - 1] - 48) % 2), 8) != $.uint(0, 8))
	}
	// not halfway - digit tells all
	return $.pointerValue<decimal>(a).d[nd] >= 53
}
