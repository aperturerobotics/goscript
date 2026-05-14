// Generated file based on destructure_trailing_comma.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function returnTwoValues(): [number, $.GoError] {
	return [42, null]
}

export async function main(): Promise<void> {
	let nref: number = 0
	let __goscriptTuple252 = returnTwoValues()
	nref = __goscriptTuple252[0]
	$.println("nref:", nref)
}


if ($.isMainScript(import.meta)) {
	await main()
}
