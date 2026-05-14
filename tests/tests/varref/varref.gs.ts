// Generated file based on varref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	$.println("setting x to 10")
	let x: $.VarRef<number> = $.varRef(10)

	let p1: $.VarRef<$.VarRef<number> | null> = $.varRef(x)
	let p2: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> = $.varRef(p1)
	let p3: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> | null = p2

	$.println("***p3 ==", $.pointerValue($.pointerValue($.pointerValue(p3))))
	$.println()

	$.println("setting ***p3 to 12")
	$.pointerValue($.pointerValue(p3))!.value = 12
	$.println("***p3 ==", $.pointerValue($.pointerValue($.pointerValue(p3))))
	$.println()

	$.println("setting y to 15, p1 to &y")
	// should be: let y: $.VarRef<number> = $.varRef(15)
	let y: $.VarRef<number> = $.varRef(15)
	// should be: p1.value = y
	p1.value = y

	$.println("***p3 ==", $.pointerValue($.pointerValue($.pointerValue(p3))))
	$.println()
}


if ($.isMainScript(import.meta)) {
	await main()
}
