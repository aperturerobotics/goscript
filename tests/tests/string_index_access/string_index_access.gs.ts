// Generated file based on string_index_access.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let myStr1 = "testing"
	$.println("Byte from myStr1[0]:", $.indexStringOrBytes(myStr1, 0))
	$.println("Byte from myStr1[2]:", $.indexStringOrBytes(myStr1, 2))
	$.println("Byte from myStr1[6]:", $.indexStringOrBytes(myStr1, 6))

	let myStr2 = "你好世界"
	// Accessing bytes of multi-byte characters
	// '你' is E4 BD A0 in UTF-8
	// '好' is E5 A5 BD in UTF-8
	// '世' is E4 B8 96 in UTF-8
	// '界' is E7 95 C2 8C in UTF-8 (界 seems to be E7 95 8C, let's assume 3 bytes for simplicity in this example)
	// For "你好世界", bytes are: E4 BD A0 E5 A5 BD E4 B8 96 E7 95 8C
	$.println("Byte from myStr2[0]:", $.indexStringOrBytes(myStr2, 0))
	$.println("Byte from myStr2[1]:", $.indexStringOrBytes(myStr2, 1))
	$.println("Byte from myStr2[2]:", $.indexStringOrBytes(myStr2, 2))
	$.println("Byte from myStr2[3]:", $.indexStringOrBytes(myStr2, 3))
}


if ($.isMainScript(import.meta)) {
	await main()
}
