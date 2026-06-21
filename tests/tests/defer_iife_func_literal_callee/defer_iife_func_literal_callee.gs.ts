// Generated file based on defer_iife_func_literal_callee.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let messages: $.Channel<string> | null = $.makeChannel<string>(0, "", "both")
	queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
		await $.chanSend(messages, "go")
	})() })
	$.println(await $.chanRecv(messages))

	void ((): void => {
		$.println("plain")
	})()

	__defer.defer(() => { ((): void => {
		$.println("defer")
	})() })

	let stored: (() => void) | null = $.functionValue((): void => {
		$.println("value")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
	await stored!()
}

if ($.isMainScript(import.meta)) {
	await main()
}
