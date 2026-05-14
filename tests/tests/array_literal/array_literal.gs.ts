// Generated file based on array_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let a: number[] = [1, 2, 3]
	$.println(a[0], a[1], a[2])
	let b = ["hello", "world"]
	$.println(b[0], b[1])
	let c = [0, 10, 0, 30, 0]
	$.println(c[0], c[1], c[2], c[3], c[4])
}


if ($.isMainScript(import.meta)) {
	await main()
}
