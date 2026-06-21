// Generated file based on async_void_function_literal_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function wrap(fn: (() => void) | null): globalThis.Promise<(() => void) | null> {
	return $.functionValue(async (): globalThis.Promise<void> => {
		await fn!()
		$.println("wrapped")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
}

export async function main(): globalThis.Promise<void> {
	let ch: $.Channel<{}> | null = $.makeChannel<{}>(0, {}, "both")
	queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
		await $.chanSend(ch, {})
	})() })
	let wrapped: (() => void) | null = await wrap($.functionValue(async (): globalThis.Promise<void> => {
		await $.chanRecv(ch)
		$.println("fn")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await wrapped!()
	$.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
