// Generated file based on for_loop_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	$.println("Starting loop")
	for (let i = 0; i < 3; i++) {
		$.println("Iteration:", i)
	}
	$.println("Loop finished")
	$.println("Starting loop")
	let x = 0
	for (let __rangeIndex = 0; __rangeIndex < 5; __rangeIndex++) {
		$.println("Iteration:", x)
		x++
	}
	$.println("Loop finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
