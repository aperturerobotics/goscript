// Generated file based on simple_pointer_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Simple case that should work
	let x = $.varRef(10)
	let p1 = x // p1 is *int, not varref'd
	let p2 = p1 // p2 is *int, not varref'd, should copy p1

	$.println("p1==p2:", (p1 === p2)) // Should be true
	$.println("*p1:", p1!.value) // Should be 10
	$.println("*p2:", p2!.value) // Should be 10
}

