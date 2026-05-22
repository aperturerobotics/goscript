// Generated file based on redeclaration_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function returnsOneIntOneBool(): [number, boolean] {
	return [7, true]
}

export function shadowTupleInput(value: string): [string, boolean] {
	return [value + "-inner", true]
}

export async function shadowCallbackInput(fn: ((_p0: number) => number | globalThis.Promise<number>) | null): globalThis.Promise<[number, boolean]> {
	return [await fn!(5), true]
}

export async function main(): globalThis.Promise<void> {
	let i: number = 0
	$.println("initial i:", i)

	// i already exists from the var declaration above.
	// err is a new variable being declared.
	let __goscriptTuple0 = returnsOneIntOneBool()
	i = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]

	$.println("after assign i:", i)
	if (err) {
		$.println("err is true")
	} else {
		$.println("err is false")
	}

	let value = "outer"
	{
		let __goscriptShadow0 = value
		let __goscriptTuple1 = shadowTupleInput(__goscriptShadow0)
		let __goscriptShadow1 = __goscriptTuple1[0]
		let ok = __goscriptTuple1[1]
		$.println("shadow tuple:", __goscriptShadow1, ok)
	}

	{
		let __goscriptTuple2 = await shadowCallbackInput($.functionValue((k: number): number => {
			return k + 1
		}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] }))
		let k = __goscriptTuple2[0]
		let ok = __goscriptTuple2[1]
		$.println("callback shadow:", k, ok)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
