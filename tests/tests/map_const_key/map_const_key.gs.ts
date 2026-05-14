// Generated file based on map_const_key.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type Operation = number

export const Add: Operation = iota

export const Sub: Operation = 0

export const Mul: Operation = 0

export type OpNames = Map<Operation, string> | null

export async function main(): Promise<void> {
	let opNames = new Map<Operation, string>([[Add, "addition"], [Sub, "subtraction"], [Mul, "multiplication"]])
	$.println($.mapGet(opNames, Add, "")[0])
	$.println($.mapGet(opNames, Sub, "")[0])
	$.println($.mapGet(opNames, Mul, "")[0])
}


if ($.isMainScript(import.meta)) {
	await main()
}
