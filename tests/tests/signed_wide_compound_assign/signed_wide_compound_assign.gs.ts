// Generated file based on signed_wide_compound_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let value: number = $.int(3)
	let delta = -5
	value = $.int64Add(value, $.int($.int(delta)))
	$.println("int64-add", $.int(value))

	value = $.int64Sub(value, $.int($.int(-2)))
	$.println("int64-sub", $.int(value))

	value = $.int64Mul(value, $.int($.int(-3)))
	$.println("int64-mul", $.int(value))

	let shifted = $.int($.int(-8))
	shifted = $.int64Shr(shifted, $.int(1))
	$.println("int64-shr", $.int(shifted))
	shifted = $.int64Shl(shifted, $.int(2))
	$.println("int64-shl", $.int(shifted))
}

if ($.isMainScript(import.meta)) {
	await main()
}
