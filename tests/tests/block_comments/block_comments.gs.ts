// Generated file based on block_comments.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	/* Another single-line block comment */
	$.println("testing block comments")

	/*
			Multi-line comment
			in the middle of code
		*/

	let x = 42
	$.println("x =", x)
}


if ($.isMainScript(import.meta)) {
	await main()
}
