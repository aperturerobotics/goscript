// Generated file based on for_range_channel.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let c = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(c, 0)
	c!.close()
	while (true) {
		let __goscriptRange73 = await $.chanRecvWithOk(c)
		if (!__goscriptRange73.ok) {
			break
		}
		let x = __goscriptRange73.value
		$.println(x)
	}
	c = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(c, 1)
	c!.close()
	let y: number = 0
	while (true) {
		let __goscriptRange214 = await $.chanRecvWithOk(c)
		if (!__goscriptRange214.ok) {
			break
		}
		y = __goscriptRange214.value
		$.println(y)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
