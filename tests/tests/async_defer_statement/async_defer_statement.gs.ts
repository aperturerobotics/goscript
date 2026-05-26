// Generated file based on async_defer_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let ch = $.makeChannel<boolean>(1, false, "both")

	__defer.defer(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
		$.println("deferred start")
		await $.chanRecv(ch)
		$.println("deferred end")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })

	$.println("main start")
	$.println("main signaling defer")
	await $.chanSend(ch, true)
	$.println("main end")
}

if ($.isMainScript(import.meta)) {
	await main()
}
