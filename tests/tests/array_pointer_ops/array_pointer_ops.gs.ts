// Generated file based on array_pointer_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function fillArray(dst: $.VarRef<Uint8Array> | null): void {
	for (let __goscriptRangeTarget0 = $.pointerValue<Uint8Array>(dst), i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		$.pointerValue<Uint8Array>(dst)[i] = $.uint($.uint(i + 1, 8), 8)
	}
}

export function sumArray(src: $.VarRef<Uint8Array> | null): number {
	let sum = 0
	for (let __goscriptRangeTarget1 = $.pointerValue<Uint8Array>(src), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let v = __goscriptRangeTarget1![__rangeIndex]
		sum += $.int(v)
	}
	return sum
}

export function closureArrayAddress(): number {
	let result = 0
	void ($.functionValue((): void => {
		let table = $.varRef(new Uint8Array([$.uint(6, 8), $.uint(7, 8), $.uint(8, 8), $.uint(9, 8)]))
		let ptr = table
		result = $.int($.pointerValue<Uint8Array>(ptr)[2])
	}, { kind: $.TypeKind.Function, params: [], results: [] }))()
	return result
}

export async function main(): globalThis.Promise<void> {
	let buckets: number[][] = Array.from({ length: 2 }, () => Array.from({ length: 3 }, () => 0))
	let cache = $.indexRef(buckets, 1)

	$.println("len:", $.len($.pointerValue<number[]>(cache)))

	$.pointerValue<number[]>(cache)[0] = $.uint(5, 64)
	$.pointerValue<number[]>(cache)[1] = $.uint(7, 64)
	$.println("index:", $.uint($.pointerValue<number[]>(cache)[0], 64), $.uint($.pointerValue<number[]>(cache)[1], 64))

	for (let __goscriptRangeTarget2 = $.pointerValue<number[]>(cache), i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		let x = __goscriptRangeTarget2![i]
		$.println("range:", i, $.uint(x, 64))
	}

	let view: $.Slice<number> = $.goSlice($.pointerValue<number[]>(cache), undefined, undefined)
	$.println("slice:", $.len(view), $.uint(view![2], 64))

	let buf: $.Slice<number> = $.arrayToSlice<number>([$.uint(9, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8)])
	fillArray(($.sliceToArrayPointer<number>($.goSlice(buf, 1, undefined), 4, "byte") as unknown as $.VarRef<Uint8Array> | null))
	$.println("converted:", $.uint(buf![0], 8), $.uint(buf![1], 8), $.uint(buf![2], 8), $.uint(buf![3], 8), $.uint(buf![4], 8))
	$.println("converted sum:", sumArray(($.sliceToArrayPointer<number>($.goSlice(buf, 1, undefined), 4, "byte") as unknown as $.VarRef<Uint8Array> | null)))

	let literal = $.varRef(new Uint8Array([$.uint(4, 8), $.uint(3, 8), $.uint(2, 8), $.uint(1, 8)]))
	$.println("literal sum:", sumArray(literal))
	fillArray(literal)
	$.println("literal filled:", $.uint($.pointerValue<Uint8Array>(literal)[0], 8), $.uint($.pointerValue<Uint8Array>(literal)[1], 8), $.uint($.pointerValue<Uint8Array>(literal)[2], 8), $.uint($.pointerValue<Uint8Array>(literal)[3], 8))
	$.println("closure ptr:", closureArrayAddress())
}

if ($.isMainScript(import.meta)) {
	await main()
}
