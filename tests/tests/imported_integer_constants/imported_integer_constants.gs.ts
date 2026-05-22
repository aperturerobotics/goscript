// Generated file based on imported_integer_constants.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

export function aboveSignedLimit(v: number): boolean {
	return v > (9223372036854775808)
}

export function isMinInt64(v: number): boolean {
	return v == -9223372036854775808
}

export async function main(): globalThis.Promise<void> {
	$.println(aboveSignedLimit($.uint(10, 64)))
	$.println(isMinInt64(0))
}

if ($.isMainScript(import.meta)) {
	await main()
}
