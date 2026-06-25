// Generated file based on wide_int_shift_count.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let n: bigint = 3n
	let s = $.uint64Mul(($.uint64And(n, 1)), 4)

	let b: number = $.uint(1, 8)
	b = b + ($.uint(1 << Number(s), 8))
	$.println("byte-shl-by-uint64", $.uint(b, 8))

	let v = $.uint(($.uintShr(b, s, 8)) & 0x0f, 8)
	$.println("byte-shr-by-uint64", $.uint(v, 8))

	let w: number = $.uint(1, 16)
	w = w << ($.uint($.uint(s, 16), 16))
	$.println("uint16-shlassign", $.uint(w, 16))
}

if ($.isMainScript(import.meta)) {
	await main()
}
