// Generated file based on short_decl_shadow_tdz.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function pair(): [number, number] {
	return [2, 3]
}

export async function main(): Promise<void> {
	let x = 0
	for (let __rangeIndex = 0; __rangeIndex < 1; __rangeIndex++) {
		x = 1
		let [y, __goscriptShadow0] = pair()
		$.println("inner:", y, __goscriptShadow0)
	}
	$.println("outer:", x)
}


if ($.isMainScript(import.meta)) {
	await main()
}
