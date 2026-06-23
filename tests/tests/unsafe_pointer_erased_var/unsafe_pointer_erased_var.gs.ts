// Generated file based on unsafe_pointer_erased_var.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export let table: $.VarRef<Uint8Array> = $.varRef(new Uint8Array([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8), $.uint(4, 8)]))

export function __goscript_set_table(__goscriptValue: Uint8Array): void {
	table.value = __goscriptValue
}

export function acceptMatrix(_p0: $.VarRef<Uint8Array[]> | null): void {
}

export async function main(): globalThis.Promise<void> {
	let ptr = (table as any)
	let bytes: $.VarRef<Uint8Array> | null = ptr
	$.println($.uint($.arrayIndex(($.pointerValue<Uint8Array>(bytes)), 2), 8))

	ptr = (table as any)
	acceptMatrix(ptr)
}

if ($.isMainScript(import.meta)) {
	await main()
}
