// Generated file based on imported_integer_constants.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"
import "@goscript/math/index.js"

export function aboveSignedLimit(v: bigint): boolean {
	return v > (9223372036854775808)
}

export function isMinInt64(v: bigint): boolean {
	return v == -9223372036854775808n
}

export async function main(): globalThis.Promise<void> {
	$.println(aboveSignedLimit(10n))
	$.println(isMinInt64(0n))
}

if ($.isMainScript(import.meta)) {
	await main()
}
