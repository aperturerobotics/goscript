// Generated file based on async_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function receiveFromChan(ch: $.Channel<number> | null): globalThis.Promise<number> {
	let val = await $.chanRecv(ch)
	return val
}

export async function caller(ch: $.Channel<number> | null): globalThis.Promise<number> {
	// We expect this call to be awaited in TypeScript
	let result = await receiveFromChan(ch)
	return result + 1
}

export async function main(): globalThis.Promise<void> {
	// Create a buffered channel
	let myChan = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(myChan, 10)

	// Call the async caller function
	let finalResult = await caller(myChan)
	$.println(finalResult)

	myChan!.close()
}

if ($.isMainScript(import.meta)) {
	await main()
}
