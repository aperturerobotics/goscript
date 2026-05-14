// Generated file based on star_compound_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let x: $.VarRef<number> = $.varRef(2)
	let p: $.VarRef<number> | null = x
	$.pointerValue(p) += 3
	$.println(x.value)
	$.pointerValue(p) &^= 1
	$.println(x.value)
}


if ($.isMainScript(import.meta)) {
	await main()
}
