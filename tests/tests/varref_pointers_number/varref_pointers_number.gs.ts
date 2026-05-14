// Generated file based on varref_pointers_number.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let x = $.varRef(10)
	let p1 = $.varRef(x)
	let p2 = x
	let pp1 = p1
	$.println("p1==p2:", p1.value == p2)
	$.println("*p1==*p2:", $.pointerValue(p1.value) == $.pointerValue(p2))
	$.println("pp1 deref:", $.pointerValue($.pointerValue(pp1)))
}


if ($.isMainScript(import.meta)) {
	await main()
}
