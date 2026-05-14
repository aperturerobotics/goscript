// Generated file based on package_import_context.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

export async function run(ctx: context.Context): Promise<void> {
	using __defer = new $.DisposableStack()
	let [sctx, sctxCancel] = context.WithCancel(ctx)
	__defer.defer(() => { sctxCancel!() })

	let myCh = $.makeChannel<Record<string, unknown>>(0, {}, "both")

	queueMicrotask(async () => { await ($.functionValue(async (): Promise<void> => {
		await $.chanRecv(sctx!.Done())
		await $.chanSend(myCh, {})
	}, { kind: $.TypeKind.Function, params: [], results: [] }))() })

	// Check that myCh is not readable yet
	const [__goscriptSelectHasReturn3504577, __goscriptSelectValue3504577] = await $.selectStatement<any, void>([
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
		}
	], true)
	if (__goscriptSelectHasReturn3504577) {
		return __goscriptSelectValue3504577
	}

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


if ($.isMainScript(import.meta)) {
	await main()
}
