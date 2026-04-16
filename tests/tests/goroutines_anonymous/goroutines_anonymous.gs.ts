// Generated file based on goroutines_anonymous.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	// Start an anonymous function worker
	let msgs = $.makeChannel<string>(1, "", 'both')
	queueMicrotask(async () => {
		await $.chanSend(msgs, "anonymous function worker")
	})
	$.println(await $.chanRecv(msgs))
}


if ($.isMainScript(import.meta)) {
	await main()
}
