// Generated file based on math.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as __goscript_pow10tab from "./pow10tab.gs.ts"
import "@goscript/math/bits/index.js"
import "./pow10tab.gs.ts"

export class uint128 {
	public get Hi(): number {
		return this._fields.Hi.value
	}
	public set Hi(value: number) {
		this._fields.Hi.value = value
	}

	public get Lo(): number {
		return this._fields.Lo.value
	}
	public set Lo(value: number) {
		this._fields.Lo.value = value
	}

	public _fields: {
		Hi: $.VarRef<number>
		Lo: $.VarRef<number>
	}

	constructor(init?: Partial<{Hi?: number, Lo?: number}>) {
		this._fields = {
			Hi: $.varRef(init?.Hi ?? 0),
			Lo: $.varRef(init?.Lo ?? 0)
		}
	}

	public clone(): uint128 {
		const cloned = new uint128()
		cloned._fields = {
			Hi: $.varRef(this._fields.Hi.value),
			Lo: $.varRef(this._fields.Lo.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"strconv.uint128",
		() => new uint128(),
		[],
		uint128,
		{"Hi": { kind: $.TypeKind.Basic, name: "uint64" }, "Lo": { kind: $.TypeKind.Basic, name: "uint64" }}
	)
}

export const maxUint64: number = 18446744073709551615

export function umul128(x: number, y: number): uint128 {
	let __goscriptTuple0: any = bits.Mul64($.uint(x, 64), $.uint(y, 64))
	let hi = $.uint(__goscriptTuple0[0], 64)
	let lo = $.uint(__goscriptTuple0[1], 64)
	return $.markAsStructValue(new uint128({Hi: $.uint(hi, 64), Lo: $.uint(lo, 64)}))
}

export function umul192(x: number, y: uint128): [number, number, number] {
	let hi: number = 0
	let mid: number = 0
	let lo: number = 0
	let __goscriptTuple1: any = bits.Mul64($.uint(x, 64), $.uint(y.Lo, 64))
	let mid1 = $.uint(__goscriptTuple1[0], 64)
	lo = $.uint(__goscriptTuple1[1], 64)
	let __goscriptTuple2: any = bits.Mul64($.uint(x, 64), $.uint(y.Hi, 64))
	hi = $.uint(__goscriptTuple2[0], 64)
	let mid2 = $.uint(__goscriptTuple2[1], 64)
	let __goscriptTuple3: any = bits.Add64($.uint(mid1, 64), $.uint(mid2, 64), $.uint(0, 64))
	mid = $.uint(__goscriptTuple3[0], 64)
	let carry = $.uint(__goscriptTuple3[1], 64)
	return [$.uint($.uint64Add(hi, carry), 64), $.uint(mid, 64), $.uint(lo, 64)]
}

export function pow10(e: number): [uint128, number, boolean] {
	let mant: uint128 = $.markAsStructValue(new uint128())
	let exp: number = 0
	let ok: boolean = false
	if ((e < -348) || (e > 347)) {
		return [mant, exp, ok]
	}
	return [$.markAsStructValue($.cloneStructValue(__goscript_pow10tab.__goscript_get_pow10Tab()[e - -348])), 1 + mulLog2_10(e), true]
}

export function mulLog10_2(x: number): number {
	// log(2)/log(10) ≈ 0.30102999566 ≈ 78913 / 2^18
	return (x * 78913) >> 18
}

export function mulLog2_10(x: number): number {
	// log(10)/log(2) ≈ 3.32192809489 ≈ 108853 / 2^15
	return (x * 108853) >> 15
}

export function bool2uint(b: boolean): number {
	if (b) {
		return 1
	}
	return 0
}

export function divisiblePow5(x: number, p: number): boolean {
	return ((1 <= p) && (p <= 22)) && (($.uint64Mul(x, div5Tab[p - 1][0])) <= div5Tab[p - 1][1])
}

export let div5Tab: number[][] = [[$.uint("14757395258967641293", 64), $.uint("3689348814741910323", 64)], [$.uint("10330176681277348905", 64), $.uint("737869762948382064", 64)], [$.uint("2066035336255469781", 64), $.uint("147573952589676412", 64)], [$.uint("15170602326218735249", 64), $.uint("29514790517935282", 64)], [$.uint("6723469279985657373", 64), $.uint($.uint64Div((29514790517935282), 5), 64)], [$.uint("8723391485480952121", 64), $.uint($.uint64Div((Math.trunc((29514790517935282) / 5)), 5), 64)], [$.uint("16502073556063831717", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)), 5), 64)], [$.uint("14368461155438497313", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)), 5), 64)], [$.uint("10252389860571520109", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("5739826786856214345", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("1147965357371242869", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("3918941886216158897", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("11851834821468962749", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("6059715779035702873", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("8590640785290961221", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("16475523416025833537", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("14363151127430897677", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("13940676669711910505", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("2788135333942382101", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("15315022325756117713", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("10441702094635044189", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)], [$.uint("5777689233668919161", 64), $.uint($.uint64Div((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((Math.trunc((29514790517935282) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)) / 5)), 5), 64)]]

export function __goscript_set_div5Tab(__goscriptValue: number[][]): void {
	div5Tab = __goscriptValue
}

export function trimZeros(x: number): [number, number] {
	const div1e8m: number = 14368461155438497313
	const div1e8le: number = 184467440737
	const div1e4m: number = 15170602326218735249
	const div1e4le: number = 1844674407370955
	const div1e2m: number = 10330176681277348905
	const div1e2le: number = 184467440737095516
	const div1e1m: number = 14757395258967641293
	const div1e1le: number = 1844674407370955161

	// _ = assert[x - y] asserts at compile time that x == y.
	// Assert that the multiplicative inverses are correct
	// by checking that (div1eNm * 5^N) % 1<<64 == 1.
	let assert: {}[] = Array.from({ length: 1 }, () => ({}))
	assert[((5612680138843163012890625) % (18446744073709551616)) - 1]
	assert[((9481626453886709530625) % (18446744073709551616)) - 1]
	assert[((258254417031933722625) % (18446744073709551616)) - 1]
	assert[((73786976294838206465) % (18446744073709551616)) - 1]

	// Cut 8 zeros, then 4, then 2, then 1.
	let p = 0
	for (let d = $.uint(bits.RotateLeft64($.uint($.uint64Mul(x, 14368461155438497313), 64), -8), 64); d <= 184467440737; d = $.uint(bits.RotateLeft64($.uint($.uint64Mul(x, 14368461155438497313), 64), -8), 64)) {
		x = $.uint(d, 64)
		p = p + (8)
	}
	{
		let d = $.uint(bits.RotateLeft64($.uint($.uint64Mul(x, 15170602326218735249), 64), -4), 64)
		if (d <= 1844674407370955) {
			x = $.uint(d, 64)
			p = p + (4)
		}
	}
	{
		let d = $.uint(bits.RotateLeft64($.uint($.uint64Mul(x, 10330176681277348905), 64), -2), 64)
		if (d <= 184467440737095516) {
			x = $.uint(d, 64)
			p = p + (2)
		}
	}
	{
		let d = $.uint(bits.RotateLeft64($.uint($.uint64Mul(x, 14757395258967641293), 64), -1), 64)
		if (d <= 1844674407370955161) {
			x = $.uint(d, 64)
			p = p + (1)
		}
	}
	return [$.uint(x, 64), p]
}
