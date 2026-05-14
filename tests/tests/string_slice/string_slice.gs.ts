// Generated file based on string_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let myStr1 = "testing"
	$.println("myStr1:", myStr1)
	$.println("len(myStr1):", $.len(myStr1))
	$.println("myStr1[0:2]:", $.sliceStringOrBytes(myStr1, 0, 2))
	$.println("myStr1[2:5]:", $.sliceStringOrBytes(myStr1, 2, 5))
	$.println("myStr1[5:7]:", $.sliceStringOrBytes(myStr1, 5, 7))
	$.println("myStr1[3:]:", $.sliceStringOrBytes(myStr1, 3, undefined))
	$.println("myStr1[:4]:", $.sliceStringOrBytes(myStr1, undefined, 4))
	$.println("myStr1[:]:", $.sliceStringOrBytes(myStr1, undefined, undefined))
	let myStr2 = "你好世界"
	$.println("myStr2:", myStr2)
	$.println("len(myStr2):", $.len(myStr2))
	$.println("myStr2[0:3]:", $.sliceStringOrBytes(myStr2, 0, 3))
	$.println("myStr2[3:6]:", $.sliceStringOrBytes(myStr2, 3, 6))
	$.println("myStr2[0:6]:", $.sliceStringOrBytes(myStr2, 0, 6))
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
