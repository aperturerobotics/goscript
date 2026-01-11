// Generated file based on select_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Test 1: Simple deterministic select with default
	// Create a buffered channel so sends don't block
	let ch1 = $.makeChannel<string>(1, "", 'both')

	// First test: empty channel, should hit default
	const [_select_has_return_286f, _select_value_286f] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: ch1,
			onSelected: async (result) => {
				const msg = result.value
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
		},
	], true)
	if (_select_has_return_286f) {
		return _select_value_286f!
	}
	// If _select_has_return_286f is false, continue execution

	// Now put something in the channel
	await $.chanSend(ch1, "hello")

	// Second test: should read from channel
	const [_select_has_return_eaf0, _select_value_eaf0] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: ch1,
			onSelected: async (result) => {
				const msg = result.value
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
		},
	], true)
	if (_select_has_return_eaf0) {
		return _select_value_eaf0!
	}
	// If _select_has_return_eaf0 is false, continue execution

	// Test 3: Select with channel closing and ok value
	let ch2 = $.makeChannel<number>(1, 0, 'both')
	await $.chanSend(ch2, 42)
	ch2.close()

	// First receive gets the buffered value
	const [_select_has_return_4217, _select_value_4217] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: ch2,
			onSelected: async (result) => {
				const val = result.value
				const ok = result.ok
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
		},
	], true)
	if (_select_has_return_4217) {
		return _select_value_4217!
	}
	// If _select_has_return_4217 is false, continue execution

	// Second receive gets the zero value with ok==false
	const [_select_has_return_3807, _select_value_3807] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: ch2,
			onSelected: async (result) => {
				const val = result.value
				const ok = result.ok
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
		},
	], true)
	if (_select_has_return_3807) {
		return _select_value_3807!
	}
	// If _select_has_return_3807 is false, continue execution

	// Test 5: Send operations
	let ch3 = $.makeChannel<number>(1, 0, 'both')

	// First send should succeed (buffer not full)
	const [_select_has_return_7b82, _select_value_7b82] = await $.selectStatement([
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
		},
	], true)
	if (_select_has_return_7b82) {
		return _select_value_7b82!
	}
	// If _select_has_return_7b82 is false, continue execution

	// Second send should hit default (buffer full)
	const [_select_has_return_c3e4, _select_value_c3e4] = await $.selectStatement([
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
		},
	], true)
	if (_select_has_return_c3e4) {
		return _select_value_c3e4!
	}
	// If _select_has_return_c3e4 is false, continue execution

	// Test 7: Multiple channel select (with known values)
	let ch4 = $.makeChannel<string>(1, "", 'both')
	let ch5 = $.makeChannel<string>(1, "", 'both')

	await $.chanSend(ch4, "from ch4")

	// Should select ch4 because it has data, ch5 is empty
	const [_select_has_return_4cfd, _select_value_4cfd] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: ch4,
			onSelected: async (result) => {
				const msg = result.value
				$.println("TEST7: Selected ch4 correctly:", msg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch5,
			onSelected: async (result) => {
				const msg = result.value
				$.println("TEST7: Selected ch5 unexpectedly:", msg)
			}
		},
	], false)
	if (_select_has_return_4cfd) {
		return _select_value_4cfd!
	}
	// If _select_has_return_4cfd is false, continue execution

	// Now ch4 is empty and ch5 is empty
	await $.chanSend(ch5, "from ch5")

	// Should select ch5 because it has data, ch4 is empty
	const [_select_has_return_5d67, _select_value_5d67] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: ch4,
			onSelected: async (result) => {
				const msg = result.value
				$.println("TEST8: Selected ch4 unexpectedly:", msg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch5,
			onSelected: async (result) => {
				const msg = result.value
				$.println("TEST8: Selected ch5 correctly:", msg)
			}
		},
	], false)
	if (_select_has_return_5d67) {
		return _select_value_5d67!
	}
	// If _select_has_return_5d67 is false, continue execution

	// Test 9: Channel closing test case for a separate test
	let chClose = $.makeChannel<boolean>(0, false, 'both')
	chClose.close()
	const { value: val, ok: ok } = await $.chanRecvWithOk(chClose)
	if (!ok) {
		$.println("TEST9: Channel is closed, ok is false, val:", val)
	} else {
		$.println("TEST9: Channel reports as not closed")
	}
}

