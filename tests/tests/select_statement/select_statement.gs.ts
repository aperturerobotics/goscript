// Generated file based on select_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let ch1 = $.makeChannel<string>(1, "", "both")
	const [__goscriptSelectHasReturn214, __goscriptSelectValue214] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch1,
			onSelected: async (result) => {
				let msg = result.value
				$.println("TEST1: Received unexpected value:", msg)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (result) => {
				$.println("TEST1: Default case hit correctly")
			}
		}
	], true)
	if (__goscriptSelectHasReturn214) {
		return __goscriptSelectValue214
	}
	await $.chanSend(ch1, "hello")
	const [__goscriptSelectHasReturn453, __goscriptSelectValue453] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch1,
			onSelected: async (result) => {
				let msg = result.value
				$.println("TEST2: Received expected value:", msg)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (result) => {
				$.println("TEST2: Default case hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelectHasReturn453) {
		return __goscriptSelectValue453
	}
	let ch2 = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch2, 42)
	ch2!.close()
	const [__goscriptSelectHasReturn742, __goscriptSelectValue742] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch2,
			onSelected: async (result) => {
				let val = result.value
				let ok = result.ok
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
			onSelected: async (result) => {
				$.println("TEST3: Default hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelectHasReturn742) {
		return __goscriptSelectValue742
	}
	const [__goscriptSelectHasReturn1021, __goscriptSelectValue1021] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch2,
			onSelected: async (result) => {
				let val = result.value
				let ok = result.ok
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
			onSelected: async (result) => {
				$.println("TEST4: Default hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelectHasReturn1021) {
		return __goscriptSelectValue1021
	}
	let ch3 = $.makeChannel<number>(1, 0, "both")
	const [__goscriptSelectHasReturn1351, __goscriptSelectValue1351] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: ch3,
			value: 5,
			onSelected: async (result) => {
				$.println("TEST5: Sent value successfully")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (result) => {
				$.println("TEST5: Default hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelectHasReturn1351) {
		return __goscriptSelectValue1351
	}
	const [__goscriptSelectHasReturn1529, __goscriptSelectValue1529] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: ch3,
			value: 10,
			onSelected: async (result) => {
				$.println("TEST6: Sent unexpectedly")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (result) => {
				$.println("TEST6: Default hit correctly (channel full)")
			}
		}
	], true)
	if (__goscriptSelectHasReturn1529) {
		return __goscriptSelectValue1529
	}
	let ch4 = $.makeChannel<string>(1, "", "both")
	let ch5 = $.makeChannel<string>(1, "", "both")
	await $.chanSend(ch4, "from ch4")
	const [__goscriptSelectHasReturn1856, __goscriptSelectValue1856] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch4,
			onSelected: async (result) => {
				let msg = result.value
				$.println("TEST7: Selected ch4 correctly:", msg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch5,
			onSelected: async (result) => {
				let msg = result.value
				$.println("TEST7: Selected ch5 unexpectedly:", msg)
			}
		}
	], false)
	if (__goscriptSelectHasReturn1856) {
		return __goscriptSelectValue1856
	}
	await $.chanSend(ch5, "from ch5")
	const [__goscriptSelectHasReturn2125, __goscriptSelectValue2125] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch4,
			onSelected: async (result) => {
				let msg = result.value
				$.println("TEST8: Selected ch4 unexpectedly:", msg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch5,
			onSelected: async (result) => {
				let msg = result.value
				$.println("TEST8: Selected ch5 correctly:", msg)
			}
		}
	], false)
	if (__goscriptSelectHasReturn2125) {
		return __goscriptSelectValue2125
	}
	let chClose = $.makeChannel<boolean>(0, false, "both")
	chClose!.close()
	let __goscriptRecv2382 = await $.chanRecvWithOk(chClose)
	let val = __goscriptRecv2382.value
	let ok = __goscriptRecv2382.ok
	if (!ok) {
		$.println("TEST9: Channel is closed, ok is false, val:", val)
	} else {
		$.println("TEST9: Channel reports as not closed")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
