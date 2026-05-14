// Generated file based on index_expr_destructuring.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function returnTwoInts(): [number, number] {
	return [42, 24]
}

export function returnIntAndString(): [number, string] {
	return [42, "hello"]
}

export async function main(): Promise<void> {
	let intArray: number[] = Array.from({ length: 2 }, () => 0)
	let stringSlice: $.Slice<string> = $.makeSlice<string>(2, undefined, "string")
	let __goscriptTuple377 = returnIntAndString()
	intArray[0] = __goscriptTuple377[0]
	stringSlice![1] = __goscriptTuple377[1]
	$.println("intArray[0]:", intArray[0])
	$.println("stringSlice[1]:", stringSlice![1])
	let matrix: number[][] = Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => 0))
	let i: number = 0
	let j: number = 1
	let __goscriptTuple602 = returnTwoInts()
	matrix[i][j] = __goscriptTuple602[0]
	intArray[1] = __goscriptTuple602[1]
	$.println("matrix[0][1]:", matrix[0][1])
	$.println("intArray[1]:", intArray[1])
}


if ($.isMainScript(import.meta)) {
	await main()
}
