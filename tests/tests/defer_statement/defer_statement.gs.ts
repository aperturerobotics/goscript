// Generated file based on defer_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	__defer.defer(() => { $.println("deferred") })
	let release: ((name: string) => void) | null = $.functionValue((name: string): void => {
		using __defer = new $.DisposableStack()
		__defer.defer(() => { $.println("func deferred", name) })
		$.println("func body", name)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo))
	await release!("first")
	await release!("second")
	$.println("main")
}

if ($.isMainScript(import.meta)) {
	await main()
}
