// Generated file based on unsafe_pointer_erased_var.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

export let table: $.VarRef<number[]> = $.varRef([1, 2, 3, 4])

export function acceptMatrix(_p0: $.VarRef<number[][]> | null): void {
}

export async function main(): Promise<void> {
	let ptr = (table as any)
	let bytes = ptr
	$.println(($.pointerValue<number[]>(bytes))[2])

	ptr = (table as any)
	acceptMatrix(ptr)
}


if ($.isMainScript(import.meta)) {
	await main()
}
