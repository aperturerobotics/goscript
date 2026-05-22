// Generated file based on string_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let myStr1 = "testing"
	$.println("myStr1:", myStr1)
	$.println("len(myStr1):", $.len(myStr1))

	// Basic slicing
	$.println("myStr1[0:2]:", $.sliceStringOrBytes(myStr1, 0, 2))
	$.println("myStr1[2:5]:", $.sliceStringOrBytes(myStr1, 2, 5))
	$.println("myStr1[5:7]:", $.sliceStringOrBytes(myStr1, 5, 7))

	// Slicing to the end
	$.println("myStr1[3:]:", $.sliceStringOrBytes(myStr1, 3, undefined))

	// Slicing from the beginning
	$.println("myStr1[:4]:", $.sliceStringOrBytes(myStr1, undefined, 4))

	// Slicing the entire string
	$.println("myStr1[:]:", $.sliceStringOrBytes(myStr1, undefined, undefined))

	// Slicing with Unicode characters
	let myStr2 = "你好世界"
	// UTF-8 bytes:
	// 你: E4 BD A0
	// 好: E5 A5 BD
	// 世: E4 B8 96
	// 界: E7 95 8C
	// Combined: E4 BD A0 E5 A5 BD E4 B8 96 E7 95 8C
	$.println("myStr2:", myStr2)
	$.println("len(myStr2):", $.len(myStr2))

	// Slice the first character '你' (3 bytes)
	$.println("myStr2[0:3]:", $.sliceStringOrBytes(myStr2, 0, 3))

	// Slice the second character '好' (next 3 bytes)
	$.println("myStr2[3:6]:", $.sliceStringOrBytes(myStr2, 3, 6))

	// Slice '你好' (first 6 bytes)
	$.println("myStr2[0:6]:", $.sliceStringOrBytes(myStr2, 0, 6))

	// Slice from middle of a multi-byte char to middle of another - result might be invalid UTF-8 but still a valid slice
	// byteSlice := []byte(myStr2[1:5])
	// NOTE: this would throw an error since this is not possible in JavaScript (converting string to invalid utf-8 then indexing it)
	// instead of implementing this with a hack we chose to just throw an error in this case.
	// println("myStr2[1:5] => bytes:", byteSlice[0], byteSlice[1], byteSlice[2], byteSlice[3]) // Expected: bytes BD A0 E5 A5 (partial 你, partial 好)

	// Empty slices
	$.println("myStr1[1:1]:", $.sliceStringOrBytes(myStr1, 1, 1))
	$.println("myStr1[0:0]:", $.sliceStringOrBytes(myStr1, 0, 0))
	$.println("myStr1[7:7]:", $.sliceStringOrBytes(myStr1, 7, 7))

	let s = "abc"
	let s1 = $.sliceStringOrBytes(s, 0, 1)
	let s2 = $.sliceStringOrBytes(s, 1, 2)
	let s3 = $.sliceStringOrBytes(s, 2, 3)
	$.println(s1, s2, s3)
}


if ($.isMainScript(import.meta)) {
	await main()
}
