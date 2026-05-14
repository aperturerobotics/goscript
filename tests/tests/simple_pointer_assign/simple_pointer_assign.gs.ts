// Generated file based on simple_pointer_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let x = $.varRef(10)
	let p1 = x
	let p2 = p1
	$.println("p1==p2:", p1 == p2)
	$.println("*p1:", $.pointerValue(p1))
	$.println("*p2:", $.pointerValue(p2))
}


if ($.isMainScript(import.meta)) {
	await main()
}
