// Generated file based on assign_op.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let a: number = 5
	a += 3
	$.println(a)

	let b: number = 10
	b -= 2
	$.println(b)

	let c: number = 16
	c = Math.trunc(c / 4)
	$.println(c)

	let quotient: number = 5
	quotient = Math.trunc(quotient / 2)
	$.println(quotient)

	let unsignedQuotient: number = $.uint(5, 32)
	unsignedQuotient = (unsignedQuotient / $.uint(2, 32)) >>> 0
	$.println($.uint(unsignedQuotient, 32))

	let d: number = 3
	d *= 5
	$.println(d)

	let e: number = 10
	e %= 3
	$.println(e)

	let f: number = 5
	f &= 3
	$.println(f)

	let g: number = 5
	g |= 3
	$.println(g)

	let h: number = 5
	h ^= 3
	$.println(h)

	// This operation is not yet supported.
	// var i int = 5
	// i &^= 3    // 101 &^ 011 = 101 & (~011) = 101 & 100 = 100
	// println(i) // Expected output: 4

	let j: number = 5
	j <<= 1
	$.println(j)

	let k: number = 5
	k >>= 1
	$.println(k)
}

if ($.isMainScript(import.meta)) {
	await main()
}
