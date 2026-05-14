// Generated file based on block_comments.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	$.println("testing block comments")
	let x = 42
	$.println("x =", x)
}


if ($.isMainScript(import.meta)) {
	await main()
}
