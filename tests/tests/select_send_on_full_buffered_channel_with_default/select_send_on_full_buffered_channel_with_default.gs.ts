// Generated file based on select_send_on_full_buffered_channel_with_default.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let ch = $.makeChannel<number>(1, 0, 'both')
	await $.chanSend(ch, 1)

	// TODO: The comments on the following cases are written twice in the output.

	// Should not be reached

	// Should be reached
	const [_select_has_return_5b5a, _select_value_5b5a] = await $.selectStatement([
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
		},
	], true)
	if (_select_has_return_5b5a) {
		return _select_value_5b5a!
	}
	// If _select_has_return_5b5a is false, continue execution
}

