// Generated file based on named_array_pointer_receiver_nullable.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type words = number[]

export function setWords(w: $.VarRef<words> | null): [$.VarRef<words> | null, boolean] {
	$.pointerValue<number[]>(w)[0] = $.uint(4, 64)
	return [w, true]
}

export function words_Rsh(w: $.VarRef<words> | null, n: number): number {
	return $.uint($.uint64Shr($.pointerValue<number[]>(w)[0], n), 64)
}

export async function main(): globalThis.Promise<void> {
	let __goscriptTuple0: any = setWords($.varRef<words>(Array.from({ length: 1 }, () => 0)))
	let w: $.VarRef<words> | null = __goscriptTuple0[0]
	let ok = __goscriptTuple0[1]
	if (!ok) {
		$.println("missing")
		return
	}
	$.println($.uint(words_Rsh(w, 1), 64))
}

if ($.isMainScript(import.meta)) {
	await main()
}
