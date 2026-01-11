// Generated file based on nil_channel.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Test nil channel operations

	// Test 1: Using nil channel in select with default
	$.println("Test 1: Select with nil channel and default")
	let nilCh: $.Channel<number> | null = null

	const [_select_has_return_9426, _select_value_9426] = await $.selectStatement([
		{
			id: 0,
			isSend: true,
			channel: nilCh,
			value: 42,
			onSelected: async (result) => {
				$.println("ERROR: Should not send to nil channel")
			}
		},
		{
			id: 1,
			isSend: false,
			channel: nilCh,
			onSelected: async (result) => {
				$.println("ERROR: Should not receive from nil channel")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (result) => {
				$.println("PASS: Default case executed correctly")
			}
		},
	], true)
	if (_select_has_return_9426) {
		return _select_value_9426!
	}
	// If _select_has_return_9426 is false, continue execution

	// Test 2: Multiple nil channels in select with default
	$.println("\nTest 2: Select with multiple nil channels and default")
	let nilCh1: $.Channel<string> | null = null
	let nilCh2: $.Channel<string> | null = null

	const [_select_has_return_69ac, _select_value_69ac] = await $.selectStatement([
		{
			id: 0,
			isSend: true,
			channel: nilCh1,
			value: "test",
			onSelected: async (result) => {
				$.println("ERROR: Should not send to nil channel 1")
			}
		},
		{
			id: 1,
			isSend: false,
			channel: nilCh2,
			onSelected: async (result) => {
				$.println("ERROR: Should not receive from nil channel 2")
			}
		},
		{
			id: 2,
			isSend: false,
			channel: nilCh1,
			onSelected: async (result) => {
				const msg = result.value
				$.println("ERROR: Should not receive from nil channel 1:", msg)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (result) => {
				$.println("PASS: Default case executed with multiple nil channels")
			}
		},
	], true)
	if (_select_has_return_69ac) {
		return _select_value_69ac!
	}
	// If _select_has_return_69ac is false, continue execution

	// Test 3: Mix of nil and valid channels in select
	$.println("\nTest 3: Select with mix of nil and valid channels")
	let nilCh3: $.Channel<boolean> | null = null
	let validCh = $.makeChannel<boolean>(1, false, 'both')
	await $.chanSend(validCh, true)

	const [_select_has_return_c48f, _select_value_c48f] = await $.selectStatement([
		{
			id: 0,
			isSend: true,
			channel: nilCh3,
			value: true,
			onSelected: async (result) => {
				$.println("ERROR: Should not send to nil channel")
			}
		},
		{
			id: 1,
			isSend: false,
			channel: nilCh3,
			onSelected: async (result) => {
				$.println("ERROR: Should not receive from nil channel")
			}
		},
		{
			id: 2,
			isSend: false,
			channel: validCh,
			onSelected: async (result) => {
				const val = result.value
				$.println("PASS: Received from valid channel:", val)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (result) => {
				$.println("ERROR: Should not hit default with valid channel ready")
			}
		},
	], true)
	if (_select_has_return_c48f) {
		return _select_value_c48f!
	}
	// If _select_has_return_c48f is false, continue execution

	$.println("\nAll nil channel tests completed")
}

