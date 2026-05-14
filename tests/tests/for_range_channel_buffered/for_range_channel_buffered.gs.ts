// Generated file based on for_range_channel_buffered.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let ch = $.makeChannel<string>(15, "", "both")
	for (let i = 0; i < 10; i++) {
		$.println("Hello", i)
		await $.chanSend(ch, "testing")
	}
	ch.close()
	while (true) {
		let __goscriptRange134 = await $.chanRecvWithOk(ch)
		if (!__goscriptRange134.ok) {
			break
		}
		let val = __goscriptRange134.value
		$.println("from ch", val)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
