// Generated file based on varref_deref_set.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let y: $.VarRef<number> = $.varRef(15)
	let p1: $.VarRef<$.VarRef<number> | null> = $.varRef(null)
	let p1_varRefer: $.VarRef<$.VarRef<number> | null> | null = p1
	p1_varRefer
	p1.value = y
	$.println($.pointerValue(p1.value))
	p1.value!.value = 20
}


if ($.isMainScript(import.meta)) {
	await main()
}
