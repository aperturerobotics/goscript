// Generated file based on array_pointer_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function fillArray(dst: $.VarRef<number[]> | null): void {
	for (let i = 0; i < $.len($.pointerValue<number[]>(dst)); i++) {
		$.pointerValue<number[]>(dst)[i] = $.int(i + 1)
	}
}

export function sumArray(src: $.VarRef<number[]> | null): number {
	let sum = 0
	for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<number[]>(src)); __rangeIndex++) {
		let v = $.pointerValue<number[]>(src)[__rangeIndex]
		sum += $.int(v)
	}
	return sum
}

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

	let buf = $.arrayToSlice<number>([9, 0, 0, 0, 0])
	fillArray($.sliceToArrayPointer<number>($.goSlice(buf, 1, undefined), 4))
	$.println("converted:", buf![0], buf![1], buf![2], buf![3], buf![4])
	$.println("converted sum:", sumArray($.sliceToArrayPointer<number>($.goSlice(buf, 1, undefined), 4)))

	let literal = $.varRef([4, 3, 2, 1])
	$.println("literal sum:", sumArray(literal))
	fillArray(literal)
	$.println("literal filled:", $.pointerValue<number[]>(literal)[0], $.pointerValue<number[]>(literal)[1], $.pointerValue<number[]>(literal)[2], $.pointerValue<number[]>(literal)[3])
}


if ($.isMainScript(import.meta)) {
	await main()
}
