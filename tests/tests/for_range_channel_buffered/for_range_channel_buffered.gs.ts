// Generated file based on for_range_channel_buffered.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let ch = $.makeChannel<string>(15, "", "both")
	for (let i = 0; i < 10; i++) {
		$.println("Hello", i)
		await $.chanSend(ch, "testing")
	}
	ch!.close()
	while (true) {
		let __goscriptRange0 = await $.chanRecvWithOk(ch)
		if (!__goscriptRange0.ok) {
			break
		}
		let val = __goscriptRange0.value
		$.println("from ch", val)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
