// Generated file based on channel_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let messages = $.makeChannel<string>(0, "", "both")

	queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
		await $.chanSend(messages, "ping")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })

	let msg = await $.chanRecv(messages)
	$.println(msg)
}

if ($.isMainScript(import.meta)) {
	await main()
}
