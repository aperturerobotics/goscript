// Generated file based on defer_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	using __defer = new $.DisposableStack()
	__defer.defer(() => { $.println("deferred") })
	let release = $.functionValue((name: string): void => {
	using __defer = new $.DisposableStack()
	__defer.defer(() => { $.println("func deferred", name) })
	$.println("func body", name)
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] })
	release("first")
	release("second")
	$.println("main")
}


if ($.isMainScript(import.meta)) {
	await main()
}
