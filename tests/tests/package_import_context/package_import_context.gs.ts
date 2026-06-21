// Generated file based on package_import_context.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/context/index.js"
import "@goscript/time/index.js"

export async function run(ctx: context.Context | null): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let [sctx, sctxCancel] = context.WithCancel($.pointerValueOrNil(ctx)!)
	__defer.defer(async () => { await sctxCancel!() })

	let myCh: $.Channel<{}> | null = $.makeChannel<{}>(0, {}, "both")

	queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
		await $.chanRecv(await $.pointerValue<Exclude<context.Context, null>>(sctx).Done())
		await $.chanSend(myCh, {})
	})() })

	// Check that myCh is not readable yet
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: myCh,
			onSelected: async (__goscriptSelect0Result) => {
				$.println("myCh should not be readable yet")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
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

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let ctx = context.Background()
	await run(ctx)

	let [deadlineCtx, cancel] = context.WithDeadline($.pointerValueOrNil(ctx)!, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(time.Hour))))
	__defer.defer(async () => { await cancel!() })
	let [deadline, ok] = await $.pointerValue<Exclude<context.Context, null>>(deadlineCtx).Deadline()
	$.println("deadline ok:", ok)
	$.println("deadline zero:", $.markAsStructValue($.cloneStructValue(deadline)).IsZero())

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
