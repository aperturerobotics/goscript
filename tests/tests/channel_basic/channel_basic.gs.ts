// Generated file based on channel_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let messages: $.Channel<string> | null = $.makeChannel<string>(0, "", "both")

	queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
		await $.chanSend(messages, "ping")
	})() })

	let msg = await $.chanRecv(messages)
	$.println(msg)
}

if ($.isMainScript(import.meta)) {
	await main()
}
