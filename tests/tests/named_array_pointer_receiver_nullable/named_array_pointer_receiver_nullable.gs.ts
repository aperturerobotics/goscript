// Generated file based on named_array_pointer_receiver_nullable.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type words = bigint[]

export function setWords(w: $.VarRef<words> | null): [$.VarRef<words> | null, boolean] {
	$.pointerValue<bigint[]>(w)[0] = 4n
	return [w, true]
}

export function words_Rsh(w: $.VarRef<words> | null, n: number): bigint {
	return $.uint64Shr($.pointerValue<bigint[]>(w)[0], n)
}

export async function main(): globalThis.Promise<void> {
	let __goscriptTuple0: any = setWords($.varRef<words>(Array.from({ length: 1 }, () => 0n)))
	let w: $.VarRef<words> | null = __goscriptTuple0[0]
	let ok = __goscriptTuple0[1]
	if (!ok) {
		$.println("missing")
		return
	}
	$.println(words_Rsh(w, 1))
}

if ($.isMainScript(import.meta)) {
	await main()
}
