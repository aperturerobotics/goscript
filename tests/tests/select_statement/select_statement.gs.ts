// Generated file based on select_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Test 1: Simple deterministic select with default
	// Create a buffered channel so sends don't block
	let ch1 = $.makeChannel<string>(1, "", "both")

	// First test: empty channel, should hit default
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch1,
			onSelected: async (__goscriptSelect0Result) => {
				let msg = __goscriptSelect0Result.value
				$.println("TEST1: Received unexpected value:", msg)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
				$.println("TEST1: Default case hit correctly")
			}
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}

	// Now put something in the channel
	await $.chanSend(ch1, "hello")

	// Second test: should read from channel
	const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch1,
			onSelected: async (__goscriptSelect1Result) => {
				let msg = __goscriptSelect1Result.value
				$.println("TEST2: Received expected value:", msg)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect1Result) => {
				$.println("TEST2: Default case hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelect1HasReturn) {
		return __goscriptSelect1Value
	}

	// Test 3: Select with channel closing and ok value
	let ch2 = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch2, 42)
	ch2!.close()

	// First receive gets the buffered value
	const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch2,
			onSelected: async (__goscriptSelect2Result) => {
				let val = __goscriptSelect2Result.value
				let ok = __goscriptSelect2Result.ok
				if (ok) {
					$.println("TEST3: Received buffered value with ok==true:", val)
				} else {
					$.println("TEST3: Unexpected ok==false")
				}
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect2Result) => {
				$.println("TEST3: Default hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelect2HasReturn) {
		return __goscriptSelect2Value
	}

	// Second receive gets the zero value with ok==false
	const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch2,
			onSelected: async (__goscriptSelect3Result) => {
				let val = __goscriptSelect3Result.value
				let ok = __goscriptSelect3Result.ok
				if (ok) {
					$.println("TEST4: Unexpected ok==true:", val)
				} else {
					$.println("TEST4: Received zero value with ok==false:", val)
				}
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect3Result) => {
				$.println("TEST4: Default hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelect3HasReturn) {
		return __goscriptSelect3Value
	}

	// Test 5: Send operations
	let ch3 = $.makeChannel<number>(1, 0, "both")

	// First send should succeed (buffer not full)
	const [__goscriptSelect4HasReturn, __goscriptSelect4Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: ch3,
			value: 5,
			onSelected: async (__goscriptSelect4Result) => {
				$.println("TEST5: Sent value successfully")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect4Result) => {
				$.println("TEST5: Default hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelect4HasReturn) {
		return __goscriptSelect4Value
	}

	// Second send should hit default (buffer full)
	const [__goscriptSelect5HasReturn, __goscriptSelect5Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: ch3,
			value: 10,
			onSelected: async (__goscriptSelect5Result) => {
				$.println("TEST6: Sent unexpectedly")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect5Result) => {
				$.println("TEST6: Default hit correctly (channel full)")
			}
		}
	], true)
	if (__goscriptSelect5HasReturn) {
		return __goscriptSelect5Value
	}

	// Test 7: Multiple channel select (with known values)
	let ch4 = $.makeChannel<string>(1, "", "both")
	let ch5 = $.makeChannel<string>(1, "", "both")

	await $.chanSend(ch4, "from ch4")

	// Should select ch4 because it has data, ch5 is empty
	const [__goscriptSelect6HasReturn, __goscriptSelect6Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch4,
			onSelected: async (__goscriptSelect6Result) => {
				let msg = __goscriptSelect6Result.value
				$.println("TEST7: Selected ch4 correctly:", msg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch5,
			onSelected: async (__goscriptSelect6Result) => {
				let msg = __goscriptSelect6Result.value
				$.println("TEST7: Selected ch5 unexpectedly:", msg)
			}
		}
	], false)
	if (__goscriptSelect6HasReturn) {
		return __goscriptSelect6Value
	}

	// Now ch4 is empty and ch5 is empty
	await $.chanSend(ch5, "from ch5")

	// Should select ch5 because it has data, ch4 is empty
	const [__goscriptSelect7HasReturn, __goscriptSelect7Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch4,
			onSelected: async (__goscriptSelect7Result) => {
				let msg = __goscriptSelect7Result.value
				$.println("TEST8: Selected ch4 unexpectedly:", msg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch5,
			onSelected: async (__goscriptSelect7Result) => {
				let msg = __goscriptSelect7Result.value
				$.println("TEST8: Selected ch5 correctly:", msg)
			}
		}
	], false)
	if (__goscriptSelect7HasReturn) {
		return __goscriptSelect7Value
	}

	// Test 9: Channel closing test case for a separate test
	let chClose = $.makeChannel<boolean>(0, false, "both")
	chClose!.close()
	let __goscriptRecv0 = await $.chanRecvWithOk(chClose)
	let val = __goscriptRecv0.value
	let ok = __goscriptRecv0.ok
	if (!ok) {
		$.println("TEST9: Channel is closed, ok is false, val:", val)
	} else {
		$.println("TEST9: Channel reports as not closed")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
