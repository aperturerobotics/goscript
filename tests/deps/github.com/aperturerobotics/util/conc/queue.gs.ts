// Generated file based on queue.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as broadcast2 from "@goscript/github.com/aperturerobotics/util/broadcast/index.js"

import * as linkedlist from "@goscript/github.com/aperturerobotics/util/linkedlist/index.js"
import "@goscript/context/index.js"
import "@goscript/github.com/aperturerobotics/util/broadcast/index.js"
import "@goscript/github.com/aperturerobotics/util/linkedlist/index.js"

export class ConcurrentQueue {
	// bcast guards below fields
	public get bcast(): broadcast2.Broadcast {
		return this._fields.bcast.value
	}
	public set bcast(value: broadcast2.Broadcast) {
		this._fields.bcast.value = value
	}

	// maxConcurrency is the concurrency limit or 0 if none
	public get maxConcurrency(): number {
		return this._fields.maxConcurrency.value
	}
	public set maxConcurrency(value: number) {
		this._fields.maxConcurrency.value = value
	}

	// running is the number of running goroutines.
	public get running(): number {
		return this._fields.running.value
	}
	public set running(value: number) {
		this._fields.running.value = value
	}

	// jobQueue is the job queue linked list.
	public get jobQueue(): linkedlist.LinkedList | $.VarRef<linkedlist.LinkedList> | null {
		return this._fields.jobQueue.value
	}
	public set jobQueue(value: linkedlist.LinkedList | $.VarRef<linkedlist.LinkedList> | null) {
		this._fields.jobQueue.value = value
	}

	// jobQueueSize is the current size of jobQueue
	public get jobQueueSize(): number {
		return this._fields.jobQueueSize.value
	}
	public set jobQueueSize(value: number) {
		this._fields.jobQueueSize.value = value
	}

	public _fields: {
		bcast: $.VarRef<broadcast2.Broadcast>
		maxConcurrency: $.VarRef<number>
		running: $.VarRef<number>
		jobQueue: $.VarRef<linkedlist.LinkedList | $.VarRef<linkedlist.LinkedList> | null>
		jobQueueSize: $.VarRef<number>
	}

	constructor(init?: Partial<{bcast?: broadcast2.Broadcast, maxConcurrency?: number, running?: number, jobQueue?: linkedlist.LinkedList | $.VarRef<linkedlist.LinkedList> | null, jobQueueSize?: number}>) {
		this._fields = {
			bcast: $.varRef(init?.bcast ? $.markAsStructValue($.cloneStructValue(init.bcast)) : $.markAsStructValue(new broadcast2.Broadcast())),
			maxConcurrency: $.varRef(init?.maxConcurrency ?? (0 as unknown as number)),
			running: $.varRef(init?.running ?? (0 as unknown as number)),
			jobQueue: $.varRef(init?.jobQueue ?? (null as unknown as linkedlist.LinkedList | $.VarRef<linkedlist.LinkedList> | null)),
			jobQueueSize: $.varRef(init?.jobQueueSize ?? (0 as unknown as number))
		}
	}

	public clone(): ConcurrentQueue {
		const cloned = new ConcurrentQueue()
		cloned._fields = {
			bcast: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.bcast.value))),
			maxConcurrency: $.varRef(this._fields.maxConcurrency.value),
			running: $.varRef(this._fields.running.value),
			jobQueue: $.varRef(this._fields.jobQueue.value),
			jobQueueSize: $.varRef(this._fields.jobQueueSize.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Enqueue(jobs: $.Slice<(() => void) | null>): globalThis.Promise<[number, number]> {
		const s: ConcurrentQueue | $.VarRef<ConcurrentQueue> | null = this
		let queued: number = 0
		let running: number = 0
		await $.pointerValue<ConcurrentQueue>(s).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
			if ($.len(jobs) != 0) {
				for (let __goscriptRangeTarget0 = jobs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
					let job = __goscriptRangeTarget0![__rangeIndex]
					if (($.pointerValue<ConcurrentQueue>(s).maxConcurrency <= 0) || ($.pointerValue<ConcurrentQueue>(s).running < $.pointerValue<ConcurrentQueue>(s).maxConcurrency)) {
						$.pointerValue<ConcurrentQueue>(s).running++
						queueMicrotask(async () => { await ConcurrentQueue.prototype.executeJob.call(s, job) })
					} else {
						$.pointerValue<ConcurrentQueue>(s).jobQueueSize++
						await linkedlist.LinkedList.prototype.Push.call($.pointerValue<ConcurrentQueue>(s).jobQueue, job)
					}
				}
				await broadcast!()
			}

			let __goscriptAssign0_0: number = $.pointerValue<ConcurrentQueue>(s).jobQueueSize
			let __goscriptAssign0_1: number = $.pointerValue<ConcurrentQueue>(s).running
			queued = __goscriptAssign0_0
			running = __goscriptAssign0_1
		}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))

		return [queued, running]
	}

	public async WaitIdle(ctx: context.Context | null, errCh: $.Channel<$.GoError> | null): globalThis.Promise<$.GoError> {
		const s: ConcurrentQueue | $.VarRef<ConcurrentQueue> | null = this
		while (true) {
			let idle: boolean = false
			let wait: $.Channel<{}> | null = null as $.Channel<{}> | null
			await $.pointerValue<ConcurrentQueue>(s).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				idle = ($.pointerValue<ConcurrentQueue>(s).running == 0) && ($.pointerValue<ConcurrentQueue>(s).jobQueueSize == 0)
				if (!idle) {
					wait = await getWaitCh!()
				}
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
			if (idle) {
				return null
			}
			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, $.GoError>([
				{
					id: 0,
					isSend: false,
					channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
					onSelected: async (__goscriptSelect0Result) => {
						return context.Canceled
					}
				},
				{
					id: 1,
					isSend: false,
					channel: errCh,
					onSelected: async (__goscriptSelect0Result) => {
						let err = __goscriptSelect0Result.value
						let ok = __goscriptSelect0Result.ok
						if (!ok) {
							// errCh was non-nil but was closed
							// treat this as context canceled
							return context.Canceled
						}
						if (err != null) {
							return err
						}
					}
				},
				{
					id: 2,
					isSend: false,
					channel: wait,
					onSelected: async (__goscriptSelect0Result) => {
					}
				}
			], false)
			if (__goscriptSelect0HasReturn) {
				return __goscriptSelect0Value
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async WatchState(ctx: context.Context | null, errCh: $.Channel<$.GoError> | null, cb: ((queued: number, running: number) => [boolean, $.GoError] | globalThis.Promise<[boolean, $.GoError]>) | null): globalThis.Promise<$.GoError> {
		const s: ConcurrentQueue | $.VarRef<ConcurrentQueue> | null = this
		if (cb == null) {
			return null
		}

		while (true) {
			let queued: number = 0
			let running: number = 0
			let waitCh: $.Channel<{}> | null = null as $.Channel<{}> | null
			await $.pointerValue<ConcurrentQueue>(s).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				let __goscriptAssign1_0: number = $.pointerValue<ConcurrentQueue>(s).jobQueueSize
				let __goscriptAssign1_1: number = $.pointerValue<ConcurrentQueue>(s).running
				queued = __goscriptAssign1_0
				running = __goscriptAssign1_1
				waitCh = await getWaitCh!()
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))

			let [cntu, err] = await cb!(queued, running)
			if ((err != null) || !cntu) {
				return err
			}

			const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, $.GoError>([
				{
					id: 0,
					isSend: false,
					channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
					onSelected: async (__goscriptSelect1Result) => {
						return context.Canceled
					}
				},
				{
					id: 1,
					isSend: false,
					channel: waitCh,
					onSelected: async (__goscriptSelect1Result) => {
					}
				}
			], false)
			if (__goscriptSelect1HasReturn) {
				return __goscriptSelect1Value
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async executeJob(__goscriptParam0: (() => void) | null): globalThis.Promise<void> {
		const s: ConcurrentQueue | $.VarRef<ConcurrentQueue> | null = this
		let job: $.VarRef<(() => void) | null> = $.varRef(__goscriptParam0)
		while (true) {
			if (job.value != null) {
				await job.value!()
			}

			let jobOk: boolean = false
			await $.pointerValue<ConcurrentQueue>(s).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				let __goscriptTuple0: any = await linkedlist.LinkedList.prototype.Pop.call($.pointerValue<ConcurrentQueue>(s).jobQueue)
				job.value = (__goscriptTuple0[0] as (() => void) | null)
				jobOk = __goscriptTuple0[1]
				if (!jobOk) {
					$.pointerValue<ConcurrentQueue>(s).running--
					await broadcast!()
				} else {
					$.pointerValue<ConcurrentQueue>(s).jobQueueSize--
				}
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
			if (!jobOk) {
				return
			}
		}
	}

	public async updateLocked(broadcast: (() => void) | null): globalThis.Promise<void> {
		let s: ConcurrentQueue | $.VarRef<ConcurrentQueue> | null = this
		let dirty: boolean = false
		while (($.pointerValue<ConcurrentQueue>(s).maxConcurrency <= 0) || ($.pointerValue<ConcurrentQueue>(s).running < $.pointerValue<ConcurrentQueue>(s).maxConcurrency)) {
			let __goscriptTuple1: any = await linkedlist.LinkedList.prototype.Pop.call($.pointerValue<ConcurrentQueue>(s).jobQueue)
			let job: (() => void) | null = (__goscriptTuple1[0] as (() => void) | null)
			let jobOk = __goscriptTuple1[1]
			if (!jobOk) {
				break
			}
			$.pointerValue<ConcurrentQueue>(s).jobQueueSize--
			$.pointerValue<ConcurrentQueue>(s).running++
			dirty = true
			queueMicrotask(async () => { await ConcurrentQueue.prototype.executeJob.call(s, job) })
		}
		if (dirty) {
			await broadcast!()
		}
	}

	static __typeInfo = $.registerStructType(
		"conc.ConcurrentQueue",
		() => new ConcurrentQueue(),
		[{ name: "Enqueue", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "WaitIdle", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "WatchState", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "executeJob", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "updateLocked", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		ConcurrentQueue,
		[{ name: "bcast", key: "bcast", type: "broadcast.Broadcast" }, { name: "maxConcurrency", key: "maxConcurrency", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "running", key: "running", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "jobQueue", key: "jobQueue", type: { kind: $.TypeKind.Pointer, elemType: "linkedlist.LinkedList" } }, { name: "jobQueueSize", key: "jobQueueSize", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function NewConcurrentQueue(maxConcurrency: number, initialElems: $.Slice<(() => void) | null>): globalThis.Promise<ConcurrentQueue | $.VarRef<ConcurrentQueue> | null> {
	let str: ConcurrentQueue | $.VarRef<ConcurrentQueue> | null = (() => { const __goscriptLiteralField0 = linkedlist.NewLinkedList({T: { type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), zero: () => null }}, initialElems); return new ConcurrentQueue({jobQueue: __goscriptLiteralField0, jobQueueSize: $.len(initialElems), maxConcurrency: maxConcurrency}) })()
	if ($.len(initialElems) != 0) {
		await $.pointerValue<ConcurrentQueue>(str).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
			await ConcurrentQueue.prototype.updateLocked.call(str, broadcast)
		}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
	}
	return str
}
