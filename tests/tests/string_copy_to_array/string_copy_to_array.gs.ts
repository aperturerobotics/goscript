// Generated file based on string_copy_to_array.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	let decodeMapInitialize = "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"
	$.copy($.goSlice(arr, undefined, undefined), decodeMapInitialize)

	// Check that arr is initialized with 255 values
	for (let i = 0; i < $.len(arr); i++) {
		if (arr![i] != 255) {
			$.panic("copy failed")
		}
	}
	$.println("Copy succeeded")
}

