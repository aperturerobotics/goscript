// Generated file based on select_mixed_returns.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/context/index.js"
import "@goscript/time/index.js"

export async function testMixedReturns(ctx: context.Context | null): globalThis.Promise<string> {
	let ch1: $.Channel<string> | null = $.makeChannel<string>(1, "", "both")
	let ch2: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	let ch3: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
	let ch4: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	let ch5: $.Channel<$.Slice<number>> | null = $.makeChannel<$.Slice<number>>(1, null, "both")

	// Pre-populate only one channel to make the test deterministic
	await $.chanSend(ch2, 42)

	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, string>([
		{
			id: 0,
			isSend: false,
			channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
			onSelected: async (__goscriptSelect0Result) => {
				$.println("Context done, returning")
				return "context_done"
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch1,
			onSelected: async (__goscriptSelect0Result) => {
				let msg = __goscriptSelect0Result.value
				$.println("Received from ch1:", msg)
				return "ch1_result"
			}
		},
		{
			id: 2,
			isSend: false,
			channel: ch2,
			onSelected: async (__goscriptSelect0Result) => {
				let num = __goscriptSelect0Result.value
				$.println("Received from ch2:", num)
				$.println("Processing ch2 value...")
			}
		},
		{
			id: 3,
			isSend: false,
			channel: ch3,
			onSelected: async (__goscriptSelect0Result) => {
				let flag = __goscriptSelect0Result.value
				$.println("Received from ch3:", flag)
				return "ch3_result"
			}
		},
		{
			id: 4,
			isSend: false,
			channel: ch4,
			onSelected: async (__goscriptSelect0Result) => {
				let val = __goscriptSelect0Result.value
				$.println("Received from ch4:", val)
				$.println("Processing ch4 value...")
			}
		},
		{
			id: 5,
			isSend: false,
			channel: ch5,
			onSelected: async (__goscriptSelect0Result) => {
				$.println("Received from ch5")
				$.println("Processing ch5 data...")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
				$.println("No channels ready, using default")
			}
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}

	// This code should execute when cases 2, 4, 5, or default are selected
	$.println("Continuing execution after select")
	$.println("Performing additional work...")

	// Simulate some work
	await time.Sleep(10000000n)

	return "completed_normally"
}

export async function testReturnCase(ctx: context.Context | null): globalThis.Promise<string> {
	let ch1: $.Channel<string> | null = $.makeChannel<string>(1, "", "both")
	let ch2: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	let ch3: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
	let ch4: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	let ch5: $.Channel<$.Slice<number>> | null = $.makeChannel<$.Slice<number>>(1, null, "both")

	// Pre-populate ch1 to trigger a returning case
	await $.chanSend(ch1, "test_message")

	const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, string>([
		{
			id: 0,
			isSend: false,
			channel: ch1,
			onSelected: async (__goscriptSelect1Result) => {
				let msg = __goscriptSelect1Result.value
				$.println("Received from ch1:", msg)
				return "ch1_result"
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch2,
			onSelected: async (__goscriptSelect1Result) => {
				let num = __goscriptSelect1Result.value
				$.println("Received from ch2:", num)
				$.println("Processing ch2 value...")
			}
		},
		{
			id: 2,
			isSend: false,
			channel: ch3,
			onSelected: async (__goscriptSelect1Result) => {
				let flag = __goscriptSelect1Result.value
				$.println("Received from ch3:", flag)
				return "ch3_result"
			}
		},
		{
			id: 3,
			isSend: false,
			channel: ch4,
			onSelected: async (__goscriptSelect1Result) => {
				let val = __goscriptSelect1Result.value
				$.println("Received from ch4:", val)
				$.println("Processing ch4 value...")
			}
		},
		{
			id: 4,
			isSend: false,
			channel: ch5,
			onSelected: async (__goscriptSelect1Result) => {
				$.println("Received from ch5")
				$.println("Processing ch5 data...")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect1Result) => {
				$.println("No channels ready, using default")
			}
		}
	], true)
	if (__goscriptSelect1HasReturn) {
		return __goscriptSelect1Value
	}

	// This code should NOT execute for ch1 case (which returns)
	$.println("Continuing execution after select")
	$.println("Performing additional work...")

	// Simulate some work
	await time.Sleep(10000000n)

	return "completed_normally"
}

export async function main(): globalThis.Promise<void> {
	let ctx = context.Background()

	$.println("Test 1: Non-returning case (ch2)")
	let result1 = await testMixedReturns(ctx)
	$.println("Final result:", result1)

	$.println()
	$.println("Test 2: Returning case (ch1)")
	let result2 = await testReturnCase(ctx)
	$.println("Final result:", result2)

	$.println()
	$.println("All tests completed")
}

if ($.isMainScript(import.meta)) {
	await main()
}
