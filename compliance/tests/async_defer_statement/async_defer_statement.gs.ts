// Generated file based on async_defer_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	await using __defer = new $.AsyncDisposableStack();
	let ch = $.makeChannel<boolean>(1, false, 'both')

	// Wait for signal from main
	__defer.defer(async () => {
		console.log("deferred start")
		await $.chanRecv(ch)
		console.log("deferred end")
	});

	console.log("main start")
	console.log("main signaling defer")
	await $.chanSend(ch, true)
	console.log("main end")
}

