// Generated file based on for_loop_infinite.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let i = 0
	for (; ; ) {
		$.println("Looping forever...")
		i++
		if (i >= 3) {
			break
		}
	}
	$.println("Loop finished")
}

