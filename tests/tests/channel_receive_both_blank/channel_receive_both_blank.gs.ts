// Generated file based on channel_receive_both_blank.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 42)
	let __goscriptRecv144 = await $.chanRecvWithOk(ch)
	$.println("received and discarded value and ok")
	ch.close()
	let __goscriptRecv293 = await $.chanRecvWithOk(ch)
	$.println("received from closed channel, both discarded")
}


if ($.isMainScript(import.meta)) {
	await main()
}
