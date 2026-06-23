// Generated file based on function_slice_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let callbacks: $.Slice<((_p0: number) => number | globalThis.Promise<number>) | null> = null as $.Slice<((_p0: number) => number | globalThis.Promise<number>) | null>
	callbacks = $.append(callbacks, $.functionValue((value: number): number => {
		return value + 1
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))
	let value = await $.arrayIndex(callbacks!, 0)!(2)
	$.println("value:", value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
