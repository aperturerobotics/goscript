// Generated file based on bitwise_and_not_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let x = $.int(0x7FF0000000000000)
	let mask = $.int(2047 << 52)
	$.println("Before:", x)
	x &^= mask
	$.println("After:", x)
	let y = $.int(0x7FF0000000000000)
	let result = y &^ mask
	$.println("Result:", result)
}


if ($.isMainScript(import.meta)) {
	await main()
}
