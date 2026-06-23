// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as broadcast from "@goscript/github.com/aperturerobotics/util/broadcast/index.js"
import "@goscript/context/index.js"
import "@goscript/github.com/aperturerobotics/util/broadcast/index.js"

export const workers: number = 16

export async function main(): globalThis.Promise<void> {
	let bcast: $.VarRef<broadcast.Broadcast> = $.varRef($.markAsStructValue(new broadcast.Broadcast()))
	let completed = 0

	for (let w = 0; w < 16; w++) {
		queueMicrotask(async () => { await (async (id: number): globalThis.Promise<void> => {
			// Await-free CPU span: a tight loop with no I/O or channel op, the
			// starvation shape from issue_118 scaled across 16 goroutines.
			let sum = 0
			for (let i = 0; i < 200000; i++) {
				sum = sum + (i * (id + 1))
			}
			sum
			await bcast.value.HoldLock($.functionValue(async (broadcastFn: (() => void) | null, _p1: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				completed++
				await broadcastFn!()
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
		})(w) })
	}

	// Coordinator mirrors ConcurrentQueue.WaitIdle: read state and the wait
	// channel under the same lock, then park on the wait channel until every
	// worker has signaled. A lost wakeup or starvation hangs here.
	let ctx = context.Background()
	while (true) {
		let done: boolean = false
		let waitCh: $.Channel<{}> | null = null as $.Channel<{}> | null
		await bcast.value.HoldLock($.functionValue(async (_p0: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
			done = completed == 16
			if (!done) {
				waitCh = await getWaitCh!()
			}
		}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
		if (done) {
			break
		}
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
				onSelected: async (__goscriptSelect0Result) => {
					$.println("ctx canceled")
					return $.selectVoidReturn()
				}
			},
			{
				id: 1,
				isSend: false,
				channel: waitCh,
				onSelected: async (__goscriptSelect0Result) => {
				}
			}
		], false)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
	}

	if (completed == 16) {
		$.println("all 16 workers completed")
	} else {
		$.println("INCOMPLETE")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
