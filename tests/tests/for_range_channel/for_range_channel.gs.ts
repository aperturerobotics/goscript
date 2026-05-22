// Generated file based on for_range_channel.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let c = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(c, 0)
	c!.close()

	while (true) {
		let __goscriptRange0 = await $.chanRecvWithOk(c)
		if (!__goscriptRange0.ok) {
			break
		}
		let x = __goscriptRange0.value
		$.println(x)
	}

	// test with = instead of := within the for range
	c = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(c, 1)
	c!.close()

	let y: number = 0
	while (true) {
		let __goscriptRange1 = await $.chanRecvWithOk(c)
		if (!__goscriptRange1.ok) {
			break
		}
		y = __goscriptRange1.value
		$.println(y)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
