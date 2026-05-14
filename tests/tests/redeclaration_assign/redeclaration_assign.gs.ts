// Generated file based on redeclaration_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function returnsOneIntOneBool(): [number, boolean] {
	return [7, true]
}

export async function main(): Promise<void> {
	let i: number = 0
	$.println("initial i:", i)
	let __goscriptTuple268 = returnsOneIntOneBool()
	i = __goscriptTuple268[0]
	let err = __goscriptTuple268[1]
	$.println("after assign i:", i)
	if (err) {
		$.println("err is true")
	} else {
		$.println("err is false")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
