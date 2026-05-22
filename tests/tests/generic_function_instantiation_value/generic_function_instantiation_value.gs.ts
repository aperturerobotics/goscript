// Generated file based on generic_function_instantiation_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function identity(__typeArgs: $.GenericTypeArgs | undefined, value: any): any {
	return value
}

export async function main(): globalThis.Promise<void> {
	let fn = $.functionValue((value: any): any => identity({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, value), { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Interface, methods: [] }] })
	$.println(await fn!(7))
}

if ($.isMainScript(import.meta)) {
	await main()
}
