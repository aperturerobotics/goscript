// Generated file based on itoa.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/math/bits/index.js"

export const digits: string = "0123456789abcdefghijklmnopqrstuvwxyz"

export const nSmalls: number = 100

export const smalls: string = "00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899"

export const host64bit: boolean = true

export function FormatUint(i: bigint, base: number): string {
	if (base == 10) {
		if (i < 100n) {
			return small($.int(i))
		}
		let a: Uint8Array = new Uint8Array(24)
		let j = formatBase10($.goSlice(a, undefined, undefined), i)
		return $.bytesToString($.goSlice(a, j, undefined))
	}
	let [, s] = formatBits(null, i, base, false, false)
	return s
}

export function FormatInt(i: bigint, base: number): string {
	if (base == 10) {
		if ((0n <= i) && (i < 100n)) {
			return small($.int(i))
		}
		let a: Uint8Array = new Uint8Array(24)
		let u = $.uint64(i)
		if (i < 0n) {
			u = -u
		}
		let j = formatBase10($.goSlice(a, undefined, undefined), u)
		if (i < 0n) {
			j--
			a[j] = $.uint(45, 8)
		}
		return $.bytesToString($.goSlice(a, j, undefined))
	}
	let [, s] = formatBits(null, $.uint64(i), base, i < 0n, false)
	return s
}

export function Itoa(i: number): string {
	return FormatInt($.int64(i), 10)
}

export function AppendInt(dst: $.Slice<number>, i: bigint, base: number): $.Slice<number> {
	let u = $.uint64(i)
	if (i < 0n) {
		dst = $.append(dst, $.uint(45, 8))
		u = -u
	}
	return AppendUint(dst, u, base)
}

export function AppendUint(dst: $.Slice<number>, i: bigint, base: number): $.Slice<number> {
	if (base == 10) {
		if (i < 100n) {
			return $.appendSlice(dst, $.stringToBytes(small($.int(i))))
		}
		let a: Uint8Array = new Uint8Array(24)
		let j = formatBase10($.goSlice(a, undefined, undefined), i)
		return $.appendSlice(dst, $.goSlice(a, j, undefined))
	}
	let __goscriptTuple0: any = formatBits(dst, i, base, false, true)
	dst = __goscriptTuple0[0]
	return dst
}

export function formatBits(dst: $.Slice<number>, u: bigint, base: number, neg: boolean, append_: boolean): [$.Slice<number>, string] {
	let d: $.Slice<number> = null as $.Slice<number>
	let s: string = ""
	if (((base < 2) || (base == 10)) || (base > 36)) {
		$.panic("strconv: illegal AppendInt/FormatInt base")
	}
	// 2 <= base && base <= len(digits)

	let a: Uint8Array = new Uint8Array(65)
	let i = $.len(a)
	if (neg) {
		u = -u
	}

	// convert bits
	// We use uint values where we can because those will
	// fit into a single register even on a 32bit machine.
	if (isPowerOfTwo(base)) {
		// Use shifts and masks instead of / and %.
		let shift = $.uint(bits.TrailingZeros($.uint(base, 64)), 64)
		let b = $.uint64(base)
		let m = $.uint($.uint64Sub($.uint(base, 64), 1), 64)
		while (u >= b) {
			i--
			a[i] = $.uint($.indexStringOrBytes("0123456789abcdefghijklmnopqrstuvwxyz", $.uint($.uint64And($.uint(u, 64), m), 64)), 8)
			u = $.uint64Shr(u, $.uint64(shift))
		}
		// u < base
		i--
		a[i] = $.uint($.indexStringOrBytes("0123456789abcdefghijklmnopqrstuvwxyz", $.uint(u, 64)), 8)
	} else {
		// general case
		let b = $.uint64(base)
		while (u >= b) {
			i--
			// Avoid using r = a%b in addition to q = a/b
			// since 64bit division and modulo operations
			// are calculated by runtime functions on 32bit machines.
			let q = $.uint64Div(u, b)
			a[i] = $.uint($.indexStringOrBytes("0123456789abcdefghijklmnopqrstuvwxyz", $.uint($.uint64Sub(u, ($.uint64Mul(q, b))), 64)), 8)
			u = q
		}
		// u < base
		i--
		a[i] = $.uint($.indexStringOrBytes("0123456789abcdefghijklmnopqrstuvwxyz", $.uint(u, 64)), 8)
	}

	// add sign, if any
	if (neg) {
		i--
		a[i] = $.uint(45, 8)
	}

	if (append_) {
		d = $.appendSlice(dst, $.goSlice(a, i, undefined))
		return [d, s]
	}
	s = $.bytesToString($.goSlice(a, i, undefined))
	return [d, s]
}

export function isPowerOfTwo(x: number): boolean {
	return (x & (x - 1)) == 0
}

export function small(i: number): string {
	if (i < 10) {
		return $.sliceStringOrBytes("0123456789abcdefghijklmnopqrstuvwxyz", i, i + 1)
	}
	return $.sliceStringOrBytes("00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899", i * 2, (i * 2) + 2)
}

export function RuntimeFormatBase10(a: $.Slice<number>, u: bigint): number {
	return formatBase10(a, u)
}

export function formatBase10(a: $.Slice<number>, u: bigint): number {
	// Split into 9-digit chunks that fit in uint32s
	// and convert each chunk using uint32 math instead of uint64 math.
	// The obvious way to write the outer loop is "for u >= 1e9", but most numbers are small,
	// so the setup for the comparison u >= 1e9 is usually pure overhead.
	// Instead, we approximate it by u>>29 != 0, which is usually faster and good enough.
	let i = $.len(a)
	while ((true && (($.uint64Shr(u, 29)) != 0n)) || (!true && ($.uint((($.uintShr($.uint(u, 32), 29, 32)) | $.uint($.uint64Shr(u, 32), 32)), 32) != $.uint(0, 32)))) {
		let lo: number = 0
		let __goscriptAssign0_0: bigint = $.uint64Div(u, 1e9)
		let __goscriptAssign0_1: number = $.uint($.uint($.uint64Mod(u, 1e9), 32), 32)
		u = __goscriptAssign0_0
		lo = __goscriptAssign0_1

		// Convert 9 digits.
		for (let __rangeIndex = 0; __rangeIndex < 4; __rangeIndex++) {
			let dd: number = 0
			let __goscriptAssign1_0: number = $.uint(Math.trunc(lo / 100), 32)
			let __goscriptAssign1_1: number = $.uint((lo % 100) * 2, 32)
			lo = __goscriptAssign1_0
			dd = __goscriptAssign1_1
			i = i - (2)
			let __goscriptAssign2_0: number = $.uint($.indexStringOrBytes("00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899", dd + 0), 8)
			let __goscriptAssign2_1: number = $.uint($.indexStringOrBytes("00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899", dd + 1), 8)
			a![i + 0] = __goscriptAssign2_0
			a![i + 1] = __goscriptAssign2_1
		}
		i--
		a![i] = $.uint($.indexStringOrBytes("00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899", (lo * 2) + 1), 8)

		// If we'd been using u >= 1e9 then we would be guaranteed that u/1e9 > 0,
		// but since we used u>>29 != 0, u/1e9 might be 0, so we might be done.
		// (If u is now 0, then at the start we had 2²⁹ ≤ u < 10⁹, so it was still correct
		// to write 9 digits; we have not accidentally written any leading zeros.)
		if (u == 0n) {
			return i
		}
	}

	// Convert final chunk, at most 8 digits.
	let lo = $.uint($.uint(u, 32), 32)
	while ($.uint(lo, 32) >= $.uint(100, 32)) {
		let dd: number = 0
		let __goscriptAssign3_0: number = $.uint(Math.trunc(lo / 100), 32)
		let __goscriptAssign3_1: number = $.uint((lo % 100) * 2, 32)
		lo = __goscriptAssign3_0
		dd = __goscriptAssign3_1
		i = i - (2)
		let __goscriptAssign4_0: number = $.uint($.indexStringOrBytes("00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899", dd + 0), 8)
		let __goscriptAssign4_1: number = $.uint($.indexStringOrBytes("00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899", dd + 1), 8)
		a![i + 0] = __goscriptAssign4_0
		a![i + 1] = __goscriptAssign4_1
	}
	i--
	let dd = $.uint(lo * 2, 32)
	a![i] = $.uint($.indexStringOrBytes("00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899", dd + 1), 8)
	if ($.uint(lo, 32) >= $.uint(10, 32)) {
		i--
		a![i] = $.uint($.indexStringOrBytes("00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899", dd + 0), 8)
	}
	return i
}
