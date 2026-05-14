// Generated file based on destructure_trailing_comma.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function returnTwoValues(): [number, $.GoError] {
	return [42, null]
}

export async function main(): Promise<void> {
	// Test destructuring assignment with trailing comma issue
	// This should generate: [nref] = returnTwoValues()
	// Not: [nref, ] = returnTwoValues()
	let nref: number = 0
	let __goscriptTuple252 = returnTwoValues()
	nref = __goscriptTuple252[0]

	$.println("nref:", nref)
}


if ($.isMainScript(import.meta)) {
	await main()
}
