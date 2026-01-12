// Generated file based on map_const_key.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let Add: Operation = 0

export let Sub: Operation = 0

export let Mul: Operation = 0

export type OpNames = Map<Operation, string> | null;

export type Operation = number;

export async function main(): Promise<void> {
	// Using a type alias for map with constant keys
	let opNames = new Map([[0, "addition"], [1, "subtraction"], [2, "multiplication"]])

	$.println($.mapGet(opNames, 0, "")[0])
	$.println($.mapGet(opNames, 1, "")[0])
	$.println($.mapGet(opNames, 2, "")[0])
}

