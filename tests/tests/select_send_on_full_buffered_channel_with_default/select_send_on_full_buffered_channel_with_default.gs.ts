// Generated file based on select_send_on_full_buffered_channel_with_default.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 1)
	const [__goscriptSelectHasReturn163, __goscriptSelectValue163] = await $.selectStatement([
		{
			id: 0,
			isSend: true,
			channel: ch,
			value: 2,
			onSelected: async (result) => {
				$.println("Sent value")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (result) => {
				$.println("Default case hit")
			}
		}
	], true)
	if (__goscriptSelectHasReturn163) {
		return __goscriptSelectValue163
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
