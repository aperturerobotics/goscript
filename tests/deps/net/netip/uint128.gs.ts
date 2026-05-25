// Generated file based on uint128.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/math/bits/index.js"

export class uint128 {
	public get hi(): number {
		return this._fields.hi.value
	}
	public set hi(value: number) {
		this._fields.hi.value = value
	}

	public get lo(): number {
		return this._fields.lo.value
	}
	public set lo(value: number) {
		this._fields.lo.value = value
	}

	public _fields: {
		hi: $.VarRef<number>
		lo: $.VarRef<number>
	}

	constructor(init?: Partial<{hi?: number, lo?: number}>) {
		this._fields = {
			hi: $.varRef(init?.hi ?? 0),
			lo: $.varRef(init?.lo ?? 0)
		}
	}

	public clone(): uint128 {
		const cloned = new uint128()
		cloned._fields = {
			hi: $.varRef(this._fields.hi.value),
			lo: $.varRef(this._fields.lo.value)
		}
		return $.markAsStructValue(cloned)
	}

	public addOne(): uint128 {
		const u = this
		let __goscriptTuple0: any = bits.Add64($.uint(u.lo, 64), $.uint(1, 64), $.uint(0, 64))
		let lo = $.uint(__goscriptTuple0[0], 64)
		let carry = $.uint(__goscriptTuple0[1], 64)
		return $.markAsStructValue(new uint128({hi: $.uint($.uint64Add(u.hi, carry), 64), lo: $.uint(lo, 64)}))
	}

	public and(m: uint128): uint128 {
		const u = this
		return $.markAsStructValue(new uint128({hi: $.uint($.uint64And(u.hi, m.hi), 64), lo: $.uint($.uint64And(u.lo, m.lo), 64)}))
	}

	public bitsClearedFrom(bit: number): uint128 {
		const u = this
		return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(u)).and($.markAsStructValue($.cloneStructValue(mask6($.int(bit)))))))
	}

	public bitsSetFrom(bit: number): uint128 {
		const u = this
		return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(u)).or($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(mask6($.int(bit)))).not())))))
	}

	public halves(): ($.VarRef<number> | null)[] {
		const u: uint128 | $.VarRef<uint128> | null = this
		return [$.pointerValue<uint128>(u)._fields.hi, $.pointerValue<uint128>(u)._fields.lo]
	}

	public isZero(): boolean {
		const u = this
		return $.uint(($.uint64Or(u.hi, u.lo)), 64) == $.uint(0, 64)
	}

	public not(): uint128 {
		const u = this
		return $.markAsStructValue(new uint128({hi: $.uint(~u.hi, 64), lo: $.uint(~u.lo, 64)}))
	}

	public or(m: uint128): uint128 {
		const u = this
		return $.markAsStructValue(new uint128({hi: $.uint($.uint64Or(u.hi, m.hi), 64), lo: $.uint($.uint64Or(u.lo, m.lo), 64)}))
	}

	public subOne(): uint128 {
		const u = this
		let __goscriptTuple1: any = bits.Sub64($.uint(u.lo, 64), $.uint(1, 64), $.uint(0, 64))
		let lo = $.uint(__goscriptTuple1[0], 64)
		let borrow = $.uint(__goscriptTuple1[1], 64)
		return $.markAsStructValue(new uint128({hi: $.uint($.uint64Sub(u.hi, borrow), 64), lo: $.uint(lo, 64)}))
	}

	public xor(m: uint128): uint128 {
		const u = this
		return $.markAsStructValue(new uint128({hi: $.uint($.uint64Xor(u.hi, m.hi), 64), lo: $.uint($.uint64Xor(u.lo, m.lo), 64)}))
	}

	static __typeInfo = $.registerStructType(
		"netip.uint128",
		() => new uint128(),
		[{ name: "addOne", args: [], returns: [] }, { name: "and", args: [], returns: [] }, { name: "bitsClearedFrom", args: [], returns: [] }, { name: "bitsSetFrom", args: [], returns: [] }, { name: "halves", args: [], returns: [] }, { name: "isZero", args: [], returns: [] }, { name: "not", args: [], returns: [] }, { name: "or", args: [], returns: [] }, { name: "subOne", args: [], returns: [] }, { name: "xor", args: [], returns: [] }],
		uint128,
		{"hi": { kind: $.TypeKind.Basic, name: "int" }, "lo": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function mask6(n: number): uint128 {
	return $.markAsStructValue(new uint128({hi: $.uint(~($.uint64Shr(~$.uint(0, 64), n)), 64), lo: $.uint($.uint64Shl(~$.uint(0, 64), (128 - n)), 64)}))
}
