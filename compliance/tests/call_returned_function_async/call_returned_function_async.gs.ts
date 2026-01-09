// Generated file based on call_returned_function_async.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function getAdder(x: number): ((p0: number) => number) | null {
	return (y: number): number => {
		return x + y
	}
}

export function asyncAdd(a: number, b: number): number {
	return a + b
}

export function getAsyncAdder(x: number): ((p0: number) => number) | null {
	return (y: number): number => {
		return asyncAdd(x, y)
	}
}

export async function main(): Promise<void> {
	// Direct call of returned function - not async
	let result1 = getAdder(5)!(3)
	$.println("Result 1:", result1)

	// Direct call of returned function - with async call inside
	let result2 = getAsyncAdder(10)!(7)
	$.println("Result 2:", result2)
}

