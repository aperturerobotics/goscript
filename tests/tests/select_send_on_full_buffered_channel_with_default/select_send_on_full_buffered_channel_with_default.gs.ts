// Generated file based on select_send_on_full_buffered_channel_with_default.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 1)

	// TODO: The comments on the following cases are written twice in the output.
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
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
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
