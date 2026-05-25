// Generated file based on nil_channel.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Test nil channel operations

	// Test 1: Using nil channel in select with default
	$.println("Test 1: Select with nil channel and default")
	let nilCh: $.Channel<number> | null = null as $.Channel<number> | null

	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: nilCh,
			value: 42,
			onSelected: async (__goscriptSelect0Result) => {
				$.println("ERROR: Should not send to nil channel")
			}
		},
		{
			id: 1,
			isSend: false,
			channel: nilCh,
			onSelected: async (__goscriptSelect0Result) => {
				$.println("ERROR: Should not receive from nil channel")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
				$.println("PASS: Default case executed correctly")
			}
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}

	// Test 2: Multiple nil channels in select with default
	$.println("\nTest 2: Select with multiple nil channels and default")
	let nilCh1: $.Channel<string> | null = null as $.Channel<string> | null
	let nilCh2: $.Channel<string> | null = null as $.Channel<string> | null

	const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: nilCh1,
			value: "test",
			onSelected: async (__goscriptSelect1Result) => {
				$.println("ERROR: Should not send to nil channel 1")
			}
		},
		{
			id: 1,
			isSend: false,
			channel: nilCh2,
			onSelected: async (__goscriptSelect1Result) => {
				$.println("ERROR: Should not receive from nil channel 2")
			}
		},
		{
			id: 2,
			isSend: false,
			channel: nilCh1,
			onSelected: async (__goscriptSelect1Result) => {
				let msg = __goscriptSelect1Result.value
				$.println("ERROR: Should not receive from nil channel 1:", msg)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect1Result) => {
				$.println("PASS: Default case executed with multiple nil channels")
			}
		}
	], true)
	if (__goscriptSelect1HasReturn) {
		return __goscriptSelect1Value
	}

	// Test 3: Mix of nil and valid channels in select
	$.println("\nTest 3: Select with mix of nil and valid channels")
	let nilCh3: $.Channel<boolean> | null = null as $.Channel<boolean> | null
	let validCh = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(validCh, true)

	const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: nilCh3,
			value: true,
			onSelected: async (__goscriptSelect2Result) => {
				$.println("ERROR: Should not send to nil channel")
			}
		},
		{
			id: 1,
			isSend: false,
			channel: nilCh3,
			onSelected: async (__goscriptSelect2Result) => {
				$.println("ERROR: Should not receive from nil channel")
			}
		},
		{
			id: 2,
			isSend: false,
			channel: validCh,
			onSelected: async (__goscriptSelect2Result) => {
				let val = __goscriptSelect2Result.value
				$.println("PASS: Received from valid channel:", val)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect2Result) => {
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
