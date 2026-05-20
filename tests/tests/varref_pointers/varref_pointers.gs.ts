// Generated file based on varref_pointers.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let x: $.VarRef<number> = $.varRef(10)
	let p1: $.VarRef<$.VarRef<number> | null> = $.varRef(x)
	let p2: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> = $.varRef(p1)
	let p3: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> | null = p2

	$.println("***p3 before ==", $.pointerValue<number>($.pointerValue<$.VarRef<number> | null>($.pointerValue<$.VarRef<$.VarRef<number> | null> | null>(p3))))

	// Dereference multiple times, this should be:
	// Goal: p3!.value!.value!.value = 12
	// Current: p3!.value = 12
	// Issue: only the bottom-most level of the WriteStarExpr checks p3 for varRefing generating .value
	// How do we know that *p3 needs .value?
	$.pointerValue<$.VarRef<number> | null>($.pointerValue<$.VarRef<$.VarRef<number> | null> | null>(p3))!.value = 12
	$.println("***p3 after ==", $.pointerValue<number>($.pointerValue<$.VarRef<number> | null>($.pointerValue<$.VarRef<$.VarRef<number> | null> | null>(p3))))
}


if ($.isMainScript(import.meta)) {
	await main()
}
