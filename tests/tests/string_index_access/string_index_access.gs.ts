// Generated file based on string_index_access.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let myStr1 = "testing"
	$.println("Byte from myStr1[0]:", $.indexStringOrBytes(myStr1, 0))
	$.println("Byte from myStr1[2]:", $.indexStringOrBytes(myStr1, 2))
	$.println("Byte from myStr1[6]:", $.indexStringOrBytes(myStr1, 6))
	let myStr2 = "你好世界"
	$.println("Byte from myStr2[0]:", $.indexStringOrBytes(myStr2, 0))
	$.println("Byte from myStr2[1]:", $.indexStringOrBytes(myStr2, 1))
	$.println("Byte from myStr2[2]:", $.indexStringOrBytes(myStr2, 2))
	$.println("Byte from myStr2[3]:", $.indexStringOrBytes(myStr2, 3))
}


if ($.isMainScript(import.meta)) {
	await main()
}
