// Generated file based on star_expr_destructuring.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function returnTwoValues(): void {
	return [42, "hello"]
}

export async function main(): Promise<void> {
	let a: $.VarRef<number> = $.varRef(0)
	let b: $.VarRef<string> = $.varRef("")
	let pA: $.VarRef<number> | null = a
	let pB: $.VarRef<string> | null = b
	let __goscriptTuple314 = returnTwoValues()
	$.pointerValue(pA) = __goscriptTuple314[0]
	$.pointerValue(pB) = __goscriptTuple314[1]
	$.println("a:", a.value)
	$.println("b:", b.value)
}


if ($.isMainScript(import.meta)) {
	await main()
}
