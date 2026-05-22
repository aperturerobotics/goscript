// Generated file based on func_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let greet = $.functionValue((name: string): string => {
		return "Hello, " + name
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })

	let message = await greet!("world")
	$.println(message)
}


if ($.isMainScript(import.meta)) {
	await main()
}
