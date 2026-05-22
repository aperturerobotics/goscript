// Generated file based on for_loop_condition_only.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let i = 0
	while (i < 3) {
		$.println("Current value:", i)
		i = i + 1
	}
	$.println("Loop finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
