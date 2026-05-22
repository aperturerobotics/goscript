// Generated file based on unsigned_conversion_comparison.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function beforeStart(pos: number, length: number): boolean {
	return $.uint(pos - 1, 64) < $.uint(length, 64)
}

export function byteWrap(v: number): number {
	return $.uint($.uint(v, 8), 8)
}

export async function main(): globalThis.Promise<void> {
	$.println("uint(-1) below length:", beforeStart(0, 3))
	$.println("uint(0) below length:", beforeStart(1, 3))
	$.println("uint8(-1):", $.uint(byteWrap(-1), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
