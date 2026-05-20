// Generated file based on varref_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let x: $.VarRef<number> = $.varRef(10)

	let p1: $.VarRef<$.VarRef<number> | null> = $.varRef(x)
	let p2: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> = $.varRef(p1)
	let p3: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> | null = p2
	p3

	// should be: let y: $.VarRef<number> = $.varRef(15)
	let y: $.VarRef<number> = $.varRef(15)
	// should be: p1.value = y
	p1.value = y

	$.println("***p3 ==", $.pointerValue<number>($.pointerValue<$.VarRef<number> | null>($.pointerValue<$.VarRef<$.VarRef<number> | null> | null>(p3))))
}


if ($.isMainScript(import.meta)) {
	await main()
}
