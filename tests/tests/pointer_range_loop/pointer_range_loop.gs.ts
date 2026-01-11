// Generated file based on pointer_range_loop.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let arr = $.varRef($.arrayToSlice<number>([1, 2, 3]))
	let arrPtr = arr

	for (let i = 0; i < $.len(arrPtr!.value); i++) {
		let v = arrPtr!.value![i]
		{
			$.println("index:", i, "value:", v)
		}
	}
}

