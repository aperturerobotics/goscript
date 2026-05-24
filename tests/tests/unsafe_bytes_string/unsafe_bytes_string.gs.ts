// Generated file based on unsafe_bytes_string.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export function bytesAsString(): string {
	let b: $.VarRef<$.Slice<number>> = $.varRef(new Uint8Array([49, 50, 51]))
	return $.bytesToString(b.value)
}

export async function main(): globalThis.Promise<void> {
	$.println(bytesAsString())
}

if ($.isMainScript(import.meta)) {
	await main()
}
