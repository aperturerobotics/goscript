// Generated file based on varref_pointers.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let x: $.VarRef<number> = $.varRef(10)
	let p1: $.VarRef<$.VarRef<number> | null> = $.varRef(x)
	let p2: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> = $.varRef(p1)
	let p3: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> | null = p2
	$.println("***p3 before ==", $.pointerValue($.pointerValue($.pointerValue(p3))))
	$.pointerValue($.pointerValue(p3))!.value = 12
	$.println("***p3 after ==", $.pointerValue($.pointerValue($.pointerValue(p3))))
}


if ($.isMainScript(import.meta)) {
	await main()
}
