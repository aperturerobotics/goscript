// Generated file based on package_import_context.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as time from "@goscript/time/index.js"

export async function run(ctx: context.Context | null): Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let [sctx, sctxCancel] = context.WithCancel($.pointerValue(ctx))
	__defer.defer(async () => { await sctxCancel!() })

	let myCh = $.makeChannel<{}>(0, {}, "both")

	queueMicrotask(async () => { await ($.functionValue(async (): Promise<void> => {
		await $.chanRecv($.pointerValue(sctx).Done())
		await $.chanSend(myCh, {})
	}, { kind: $.TypeKind.Function, params: [], results: [] }))() })

	// Check that myCh is not readable yet
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
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
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}

	// Cancel context which should trigger the goroutine
	await sctxCancel!()

	// Now myCh should become readable
	await $.chanRecv(myCh)

	$.println("read successfully")
}

export async function main(): Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let ctx = context.Background()
	await run(ctx)

	let [deadlineCtx, cancel] = context.WithDeadline($.pointerValue(ctx), $.markAsStructValue(($.markAsStructValue((time.Now()).clone()).Add(time.Hour)).clone()))
	__defer.defer(async () => { await cancel!() })
	let [deadline, ok] = $.pointerValue(deadlineCtx).Deadline()
	$.println("deadline ok:", ok)
	$.println("deadline zero:", $.markAsStructValue((deadline).clone()).IsZero())

	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
