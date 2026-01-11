// Generated file based on function_returns_function.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function getAdder(x: number): ((p0: number) => number) | null {
	return (y: number): number => {
		return x + y
	}
}

export async function main(): Promise<void> {
	let adder = getAdder(5)
	let result = adder!(3)
	$.println("Result:", result)
}

