// Generated file based on for_init_exprstmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function init_func(): void {
	console.log("init_func called")
}

export async function main(): Promise<void> {
	// Using a function call in the for loop's init statement
	// The condition is false to prevent the loop body from executing during the test,
	// focusing only on the init part's translation and execution.
	for (init_func(); false; ) {
		console.log("loop body (should not be printed)")
	}
	console.log("done")
}

