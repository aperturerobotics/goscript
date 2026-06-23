// Generated file based on integer_conversion_overflow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let big: bigint = 1099511627781n
	$.println("int32:", $.int($.int(big, 32), 32))
	$.println("uint8:", $.uint($.uint(big, 8), 8))
	$.println("int16:", $.int($.int(big, 16), 16))

	let neg: bigint = -1n
	$.println("uint32 of -1:", $.uint($.uint(neg, 32), 32))
	$.println("uint64 of -1:", $.uint64(neg))

	let u: bigint = 18446744073709551615n
	$.println("int64 of max uint64:", $.int64(u))
}

if ($.isMainScript(import.meta)) {
	await main()
}
