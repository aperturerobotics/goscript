// Generated file based on bytes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let b1: $.Slice<number> = null
	$.println("b1:", b1)
	let b2 = [72, 101, 108, 108, 111]
	$.println("b2:", b2)
	let b3 = $.stringToBytes("World")
	$.println("b3:", b3)
	b1 = b2
	$.println("b1 after assignment:", b1)
	let s = "GoScript"
	let b4 = $.stringToBytes(s)
	$.println("b4 from string:", b4)
	let s2 = $.bytesToString(b2)
	$.println("s2 from bytes:", s2)
	$.println("b2[0]:", b2[0])
	b2[0] = 87
	$.println("b2 after modification:", b2)
	$.println("s2 after b2 modification (should be 'Hello'):", s2)
	$.println("len(b2):", $.len(b2), "cap(b2):", $.cap(b2))
	$.println("len(b3):", $.len(b3), "cap(b3):", $.cap(b3))
	let b5 = $.append(b2, 33, 33)
	$.println("b5 after append:", b5)
	$.println("len(b5):", $.len(b5), "cap(b5):", $.cap(b5))
	let b6 = $.append(b5, $.stringToBytes(" GoScript"))
	$.println("b6 after append slice:", b6)
	$.println("len(b6):", $.len(b6), "cap(b6):", $.cap(b6))
}


if ($.isMainScript(import.meta)) {
	await main()
}
