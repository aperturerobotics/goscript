// Generated file based on signed_wide_compound_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let value: bigint = 3n
	let delta = -5
	value = $.int64Add(value, $.int64(delta))
	$.println("int64-add", value)

	value = $.int64Sub(value, -2n)
	$.println("int64-sub", value)

	value = $.int64Mul(value, -3n)
	$.println("int64-mul", value)

	let shifted = -8n
	shifted = $.int64Shr(shifted, 1n)
	$.println("int64-shr", shifted)
	shifted = $.int64Shl(shifted, 2n)
	$.println("int64-shl", shifted)
}

if ($.isMainScript(import.meta)) {
	await main()
}
