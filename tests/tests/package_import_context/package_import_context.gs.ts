// Generated file based on package_import_context.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

export async function run(ctx: null | context.Context): Promise<void> {
	using __defer = new $.DisposableStack();
	let [sctx, sctxCancel] = context.WithCancel(ctx)
	__defer.defer(() => {
		sctxCancel!()
	});

	let myCh = $.makeChannel<{  }>(0, {}, 'both')

	queueMicrotask(async () => {
		await $.chanRecv(sctx!.Done())
		await $.chanSend(myCh, {})
	})

	// Check that myCh is not readable yet
	const [_select_has_return_be9f, _select_value_be9f] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: myCh,
			onSelected: async (result) => {
				$.println("myCh should not be readable yet")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (result) => {
				$.println("myCh is not be readable yet")
			}
		},
	], true)
	if (_select_has_return_be9f) {
		return _select_value_be9f!
	}
	// If _select_has_return_be9f is false, continue execution

	// Cancel context which should trigger the goroutine
	sctxCancel!()

	// Now myCh should become readable
	await $.chanRecv(myCh)

	$.println("read successfully")
}

export async function main(): Promise<void> {
	let ctx = context.Background()
	await run(ctx)

	$.println("test finished")
}

