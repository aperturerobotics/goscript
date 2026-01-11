// Generated file based on for_range_channel.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let c = $.makeChannel<number>(1, 0, 'both')
	await $.chanSend(c, 0)
	c.close()

	for (;;) {
		const { value: x, ok: _ok } = await $.chanRecvWithOk(c)
		if (!_ok) break
		{
			$.println(x)
		}
	}

	// test with = instead of := within the for range
	c = $.makeChannel<number>(1, 0, 'both')
	await $.chanSend(c, 1)
	c.close()

	let y: number = 0
	for (;;) {
		let _ok
		;({ value: y, ok: _ok } = await $.chanRecvWithOk(c))
		if (!_ok) break
		{
			$.println(y)
		}
	}
}

