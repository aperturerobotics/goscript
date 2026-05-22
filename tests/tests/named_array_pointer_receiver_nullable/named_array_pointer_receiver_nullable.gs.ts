// Generated file based on named_array_pointer_receiver_nullable.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type words = number[]

export function setWords(w: $.VarRef<words> | null): [$.VarRef<words> | null, boolean] {
	$.pointerValue<number[]>(w)[0] = 4
	return [w, true]
}

export function words_Rsh(w: $.VarRef<words> | null, n: number): number {
	return $.pointerValue<number[]>(w)[0] >> n
}

export async function main(): globalThis.Promise<void> {
	let [w, ok] = setWords($.varRef(Array.from({ length: 1 }, () => 0)))
	if (!ok) {
		$.println("missing")
		return
	}
	$.println(words_Rsh(w, 1))
}


if ($.isMainScript(import.meta)) {
	await main()
}
