// Generated file based on string_index_array_access.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let encoder = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

	let decodeMap: Uint8Array = new Uint8Array(256)
	for (let __goscriptRangeTarget0 = decodeMap, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		decodeMap[i] = $.uint(255, 8)
	}

	for (let i = 0; i < $.len(encoder); i++) {
		if ($.uint($.arrayIndex(decodeMap, $.indexStringOrBytes(encoder, i)), 8) != $.uint(255, 8)) {
			$.panic("duplicate symbol")
		}
		decodeMap[$.indexStringOrBytes(encoder, i)] = $.uint($.uint(i, 8), 8)
	}

	$.println("Success: no duplicates")
}

if ($.isMainScript(import.meta)) {
	await main()
}
