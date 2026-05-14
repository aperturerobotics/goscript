// Generated file based on nil_channel.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Test nil channel operations

	// Test 1: Using nil channel in select with default
	$.println("Test 1: Select with nil channel and default")
	let nilCh: $.Channel<number> | null = null

	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
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
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}

	// Test 2: Multiple nil channels in select with default
	$.println("\nTest 2: Select with multiple nil channels and default")
	let nilCh1: $.Channel<string> | null = null
	let nilCh2: $.Channel<string> | null = null

	const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, void>([
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
				let msg = result.value
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
		}
	], true)
	if (__goscriptSelect1HasReturn) {
		return __goscriptSelect1Value
	}

	// Test 3: Mix of nil and valid channels in select
	$.println("\nTest 3: Select with mix of nil and valid channels")
	let nilCh3: $.Channel<boolean> | null = null
	let validCh = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(validCh, true)

	const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, void>([
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
				let val = result.value
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
		}
	], true)
	if (__goscriptSelect2HasReturn) {
		return __goscriptSelect2Value
	}

	$.println("\nAll nil channel tests completed")
}


if ($.isMainScript(import.meta)) {
	await main()
}
