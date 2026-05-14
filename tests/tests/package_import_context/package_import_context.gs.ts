// Generated file based on package_import_context.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as context from "@goscript/context/index.ts"

export async function run(ctx: Context): Promise<void> {
	using __defer = new $.DisposableStack()
	let [sctx, sctxCancel] = context.WithCancel(ctx)
	__defer.defer(() => { sctxCancel() })
	let myCh = $.makeChannel<Record<string, unknown>>(0, null, "both")
	queueMicrotask(async () => { await (async (): Promise<void> => {
	await $.chanRecv(sctx.Done())
	await $.chanSend(myCh, {})
})() })
	const [__goscriptSelectHasReturn3504577, __goscriptSelectValue3504577] = await $.selectStatement([
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
	sctxCancel()
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
