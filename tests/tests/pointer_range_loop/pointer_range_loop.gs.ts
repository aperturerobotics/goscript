// Generated file based on pointer_range_loop.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let arr = $.varRef([1, 2, 3])
	let arrPtr = arr
	for (let i = 0; i < $.len(arrPtr); i++) {
		let v = arrPtr[i]
		$.println("index:", i, "value:", v)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
