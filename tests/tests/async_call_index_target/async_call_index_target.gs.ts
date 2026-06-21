// Generated file based on async_call_index_target.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function values(): globalThis.Promise<$.Slice<number>> {
	let ready: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(ready, true)
	await $.chanRecv(ready)
	return $.arrayToSlice<number>([4])
}

export async function mapped(): globalThis.Promise<globalThis.Map<number, number> | null> {
	let ready: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(ready, true)
	await $.chanRecv(ready)
	return new globalThis.Map<number, number>([[2, 5]])
}

export async function main(): globalThis.Promise<void> {
	$.println((await values())![0])
	for (const [k, v] of (await mapped())?.entries() ?? []) {
		$.println(k, v)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
