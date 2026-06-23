// Generated file based on array_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Test basic array literal
	let a: number[] = [1, 2, 3]
	$.println($.arrayIndex(a, 0), $.arrayIndex(a, 1), $.arrayIndex(a, 2))

	// Test array literal with inferred length
	let b = ["hello", "world"]
	$.println($.arrayIndex(b, 0), $.arrayIndex(b, 1))

	// Test array literal with specific element initialization
	let c = [0, 10, 0, 30, 0]
	$.println($.arrayIndex(c, 0), $.arrayIndex(c, 1), $.arrayIndex(c, 2), $.arrayIndex(c, 3), $.arrayIndex(c, 4))

	// Test empty byte array literal
	let d = new Uint8Array(4)
	$.println($.len(d), $.uint($.arrayIndex(d, 0), 8), $.uint($.arrayIndex(d, 3), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
