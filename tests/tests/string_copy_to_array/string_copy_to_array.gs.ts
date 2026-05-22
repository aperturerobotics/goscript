// Generated file based on string_copy_to_array.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let arr: Uint8Array = new Uint8Array(10)
	let decodeMapInitialize = "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"
	$.copy($.goSlice(arr, undefined, undefined), decodeMapInitialize)

	// Check that arr is initialized with 255 values
	for (let i = 0; i < $.len(arr); i++) {
		if ($.uint(arr[i], 8) != $.uint(255, 8)) {
			$.panic("copy failed")
		}
	}
	$.println("Copy succeeded")
}

if ($.isMainScript(import.meta)) {
	await main()
}
