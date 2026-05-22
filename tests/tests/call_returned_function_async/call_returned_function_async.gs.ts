// Generated file based on call_returned_function_async.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function getAdder(x: number): ((_p0: number) => number | globalThis.Promise<number>) | null {
	return $.functionValue((y: number): number => {
		return x + y
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
}

export function asyncAdd(a: number, b: number): number {
	return a + b
}

export function getAsyncAdder(x: number): ((_p0: number) => number | globalThis.Promise<number>) | null {
	return $.functionValue((y: number): number => {
		return asyncAdd(x, y)
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
}

export async function main(): globalThis.Promise<void> {
	// Direct call of returned function - not async
	let result1 = await getAdder(5)!(3)
	$.println("Result 1:", result1)

	// Direct call of returned function - with async call inside
	let result2 = await getAsyncAdder(10)!(7)
	$.println("Result 2:", result2)
}

if ($.isMainScript(import.meta)) {
	await main()
}
