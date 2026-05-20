// Generated file based on unsafe_bytes_string.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

export function bytesAsString(): string {
	let b = $.varRef($.stringToBytes("123"))
	return $.bytesToString(b.value)
}

export async function main(): Promise<void> {
	$.println(bytesAsString())
}


if ($.isMainScript(import.meta)) {
	await main()
}
