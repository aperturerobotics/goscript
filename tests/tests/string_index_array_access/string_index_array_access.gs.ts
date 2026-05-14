// Generated file based on string_index_array_access.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let encoder = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

	let decodeMap: number[] = Array.from({ length: 256 }, () => 0)
	for (let i = 0; i < $.len(decodeMap); i++) {
		decodeMap[i] = 255
	}

	for (let i = 0; i < $.len(encoder); i++) {
		if (decodeMap[$.indexStringOrBytes(encoder, i)] != 255) {
			$.panic("duplicate symbol")
		}
		decodeMap[$.indexStringOrBytes(encoder, i)] = $.int(i)
	}

	$.println("Success: no duplicates")
}


if ($.isMainScript(import.meta)) {
	await main()
}
