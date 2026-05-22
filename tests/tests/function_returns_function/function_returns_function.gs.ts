// Generated file based on function_returns_function.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function getAdder(x: number): ((_p0: number) => number | globalThis.Promise<number>) | null {
	return $.functionValue((y: number): number => {
		return x + y
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
}

export async function main(): globalThis.Promise<void> {
	let adder = getAdder(5)
	let result = await adder!(3)
	$.println("Result:", result)
}


if ($.isMainScript(import.meta)) {
	await main()
}
