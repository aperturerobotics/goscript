// Generated file based on for_range_channel_buffered.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let ch = $.makeChannel<string>(15, "", 'both')
	for (let i = 0; i < 10; i++) {
		$.println("Hello", i)
		await $.chanSend(ch, "testing")
	}
	ch.close()
	for (;;) {
		const { value: val, ok: _ok } = await $.chanRecvWithOk(ch)
		if (!_ok) break
		{
			$.println("from ch", val)
		}
	}
}

