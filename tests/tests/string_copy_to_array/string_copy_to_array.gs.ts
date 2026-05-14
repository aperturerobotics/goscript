// Generated file based on string_copy_to_array.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let arr: number[] = Array.from({ length: 10 }, () => 0)
	let decodeMapInitialize = "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"
	$.copy($.goSlice(arr, undefined, undefined), decodeMapInitialize)
	for (let i = 0; i < $.len(arr); i++) {
		if (arr[i] != 255) {
			$.panic("copy failed")
		}
	}
	$.println("Copy succeeded")
}


if ($.isMainScript(import.meta)) {
	await main()
}
