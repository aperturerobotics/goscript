// Generated file based on varref_pointers_deref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let x = $.varRef(10)
	let p1 = x
	let p2 = x
	$.println("p1==p2:", p1 == p2)
	$.println("*p1==*p2:", $.pointerValue(p1) == $.pointerValue(p2))
	let p3 = p1
	$.println("p1==p3:", p1 == p3)
	let ptr = $.varRef(x)
	let pp1 = $.varRef(ptr)
	let savedPP1 = pp1.value
	let ppp1 = pp1
	$.println("Value through ppp1:", $.pointerValue($.pointerValue($.pointerValue(ppp1))))
	$.println("pp1==savedPP1:", pp1.value == savedPP1)
	$.println("**pp1:", $.pointerValue($.pointerValue(pp1.value)))
	$.println("**savedPP1:", $.pointerValue($.pointerValue(savedPP1)))
}


if ($.isMainScript(import.meta)) {
	await main()
}
