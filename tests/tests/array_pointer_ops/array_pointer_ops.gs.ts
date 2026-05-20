// Generated file based on array_pointer_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let buckets: number[][] = Array.from({ length: 2 }, () => Array.from({ length: 3 }, () => 0))
	let cache = $.indexRef(buckets, 1)

	$.println("len:", $.len($.pointerValue<number[]>(cache)))

	$.pointerValue<number[]>(cache)[0] = 5
	$.pointerValue<number[]>(cache)[1] = 7
	$.println("index:", $.pointerValue<number[]>(cache)[0], $.pointerValue<number[]>(cache)[1])

	for (let i = 0; i < $.len($.pointerValue<number[]>(cache)); i++) {
		let x = $.pointerValue<number[]>(cache)[i]
		$.println("range:", i, x)
	}

	let view = $.goSlice($.pointerValue<number[]>(cache), undefined, undefined)
	$.println("slice:", $.len(view), view![2])
}


if ($.isMainScript(import.meta)) {
	await main()
}
