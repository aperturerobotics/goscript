// Generated file based on math.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as __goscript_pow10tab from "./pow10tab.gs.ts"
import "@goscript/math/bits/index.js"
import "./pow10tab.gs.ts"

export class uint128 {
	public get Hi(): bigint {
		return this._fields.Hi.value
	}
	public set Hi(value: bigint) {
		this._fields.Hi.value = value
	}

	public get Lo(): bigint {
		return this._fields.Lo.value
	}
	public set Lo(value: bigint) {
		this._fields.Lo.value = value
	}

	public _fields: {
		Hi: $.VarRef<bigint>
		Lo: $.VarRef<bigint>
	}

	constructor(init?: Partial<{Hi?: bigint, Lo?: bigint}>) {
		this._fields = {
			Hi: $.varRef(init?.Hi ?? (0n as unknown as bigint)),
			Lo: $.varRef(init?.Lo ?? (0n as unknown as bigint))
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
		[{ name: "Hi", key: "Hi", type: { kind: $.TypeKind.Basic, name: "uint64" }, index: [0], offset: 0, exported: true }, { name: "Lo", key: "Lo", type: { kind: $.TypeKind.Basic, name: "uint64" }, index: [1], offset: 8, exported: true }]
	)
}

export const maxUint64: number = 18446744073709551615

export function umul128(x: bigint, y: bigint): uint128 {
	let [hi, lo] = bits.Mul64(x, y)
	return $.markAsStructValue(new uint128({Hi: hi, Lo: lo}))
}

export function umul192(x: bigint, y: uint128): [bigint, bigint, bigint] {
	let hi: bigint = 0n
	let mid: bigint = 0n
	let lo: bigint = 0n
	let __goscriptTuple0: any = bits.Mul64(x, y.Lo)
	let mid1 = __goscriptTuple0[0]
	lo = __goscriptTuple0[1]
	let __goscriptTuple1: any = bits.Mul64(x, y.Hi)
	hi = __goscriptTuple1[0]
	let mid2 = __goscriptTuple1[1]
	let __goscriptTuple2: any = bits.Add64(mid1, mid2, 0n)
	mid = __goscriptTuple2[0]
	let carry = __goscriptTuple2[1]
	return [$.uint64Add(hi, carry), mid, lo]
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

export function divisiblePow5(x: bigint, p: number): boolean {
	return ((1 <= p) && (p <= 22)) && (($.uint64Mul(x, div5Tab[p - 1][0])) <= div5Tab[p - 1][1])
}

export let div5Tab: bigint[][] = [[14757395258967641293n, 3689348814741910323n], [10330176681277348905n, 737869762948382064n], [2066035336255469781n, 147573952589676412n], [15170602326218735249n, 29514790517935282n], [6723469279985657373n, 5902958103587056n], [8723391485480952121n, 1180591620717411n], [16502073556063831717n, 236118324143482n], [14368461155438497313n, 47223664828696n], [10252389860571520109n, 9444732965739n], [5739826786856214345n, 1888946593147n], [1147965357371242869n, 377789318629n], [3918941886216158897n, 75557863725n], [11851834821468962749n, 15111572745n], [6059715779035702873n, 3022314549n], [8590640785290961221n, 604462909n], [16475523416025833537n, 120892581n], [14363151127430897677n, 24178516n], [13940676669711910505n, 4835703n], [2788135333942382101n, 967140n], [15315022325756117713n, 193428n], [10441702094635044189n, 38685n], [5777689233668919161n, 7737n]]

export function __goscript_set_div5Tab(__goscriptValue: bigint[][]): void {
	div5Tab = __goscriptValue
}

export function trimZeros(x: bigint): [bigint, number] {
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
	for (let d = bits.RotateLeft64($.uint64Mul(x, 14368461155438497313), -8); d <= 184467440737; d = bits.RotateLeft64($.uint64Mul(x, 14368461155438497313), -8)) {
		x = d
		p = p + (8)
	}
	{
		let d = bits.RotateLeft64($.uint64Mul(x, 15170602326218735249), -4)
		if (d <= 1844674407370955) {
			x = d
			p = p + (4)
		}
	}
	{
		let d = bits.RotateLeft64($.uint64Mul(x, 10330176681277348905), -2)
		if (d <= 184467440737095516) {
			x = d
			p = p + (2)
		}
	}
	{
		let d = bits.RotateLeft64($.uint64Mul(x, 14757395258967641293), -1)
		if (d <= 1844674407370955161) {
			x = d
			p = p + (1)
		}
	}
	return [x, p]
}
