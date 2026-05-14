// Generated file based on broadcast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as context from "@goscript/context/index.ts"

import * as errors from "@goscript/errors/index.ts"

import * as sync from "@goscript/sync/index.ts"

export class Broadcast {
	public get mtx(): sync.Mutex {
		return this._fields.mtx.value
	}
	public set mtx(value: sync.Mutex) {
		this._fields.mtx.value = value
	}

	public get ch(): $.Channel<Record<string, unknown>> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<Record<string, unknown>> | null) {
		this._fields.ch.value = value
	}

	public _fields: {
		mtx: $.VarRef<sync.Mutex>
		ch: $.VarRef<$.Channel<Record<string, unknown>> | null>
	}

	constructor(init?: Partial<{mtx?: sync.Mutex, ch?: $.Channel<Record<string, unknown>> | null}>) {
		this._fields = {
			mtx: $.varRef(init?.mtx ? $.markAsStructValue(init.mtx.clone()) : $.markAsStructValue(new sync.Mutex())),
			ch: $.varRef(init?.ch ?? null)
		}
	}

	public clone(): Broadcast {
		const cloned = new Broadcast()
		cloned._fields = {
			mtx: $.varRef($.markAsStructValue(this._fields.mtx.value.clone())),
			ch: $.varRef(this._fields.ch.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async HoldLock(cb: (broadcast: () => void, getWaitCh: () => $.Channel<Record<string, unknown>> | null) => void): Promise<void> {
		const c = this
		using __defer = new $.DisposableStack()
		await $.pointerValue(c).mtx.Lock()
		__defer.defer(() => { $.pointerValue(c).mtx.Unlock() })
		cb(((__receiver) => () => __receiver.broadcastLocked())($.pointerValue(c)), ((__receiver) => () => __receiver.getWaitChLocked())($.pointerValue(c)))
	}

	public HoldLockMaybeAsync(cb: (broadcast: () => void, getWaitCh: () => $.Channel<Record<string, unknown>> | null) => void): void {
		const c = this
		using __defer = new $.DisposableStack()
		let holdBroadcastLock = $.functionValue(async (lock: boolean): Promise<void> => {
	if (lock) {
		await $.pointerValue(c).mtx.Lock()
	}
	__defer.defer(() => { $.pointerValue(c).mtx.Unlock() })
	cb(((__receiver) => () => __receiver.broadcastLocked())($.pointerValue(c)), ((__receiver) => () => __receiver.getWaitChLocked())($.pointerValue(c)))
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "bool" }], results: [] })
		if ($.pointerValue(c).mtx.TryLock()) {
			holdBroadcastLock(false)
		} else {
			queueMicrotask(async () => { holdBroadcastLock(true) })
		}
	}

	public TryHoldLock(cb: (broadcast: () => void, getWaitCh: () => $.Channel<Record<string, unknown>> | null) => void): boolean {
		const c = this
		using __defer = new $.DisposableStack()
		if (!$.pointerValue(c).mtx.TryLock()) {
			return false
		}
		__defer.defer(() => { $.pointerValue(c).mtx.Unlock() })
		cb(((__receiver) => () => __receiver.broadcastLocked())($.pointerValue(c)), ((__receiver) => () => __receiver.getWaitChLocked())($.pointerValue(c)))
		return true
	}

	public async Wait(ctx: context.Context, cb: (broadcast: () => void, getWaitCh: () => $.Channel<Record<string, unknown>> | null) => [boolean, $.GoError]): Promise<$.GoError> {
		const c = this
		if (cb == null || ctx == null) {
			return errors.New("cb and ctx must be set")
		}
		let waitCh: $.Channel<Record<string, unknown>> | null = null
		while (true) {
			if (ctx!.Err() != null) {
				return context.Canceled
			}
			let done: boolean = false
			let err: $.GoError = null
			await $.pointerValue(c).HoldLock($.functionValue((broadcast: () => void, getWaitCh: () => $.Channel<Record<string, unknown>> | null): void => {
	let __goscriptTuple4792258 = cb(broadcast, getWaitCh)
	done = __goscriptTuple4792258[0]
	err = __goscriptTuple4792258[1]
	if (!done && err == null) {
		waitCh = getWaitCh()
	}
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
			if (done || err != null) {
				return err
			}
			const [__goscriptSelectHasReturn4792406, __goscriptSelectValue4792406] = await $.selectStatement([
				{
					id: 0,
					isSend: false,
					channel: ctx!.Done(),
					onSelected: async (result) => {
						return context.Canceled
					}
				},
				{
					id: 1,
					isSend: false,
					channel: waitCh,
					onSelected: async (result) => {
					}
				}
			], false)
			if (__goscriptSelectHasReturn4792406) {
				return __goscriptSelectValue4792406
			}
		}
	}

	public broadcastLocked(): void {
		const c = this
		if ($.pointerValue(c).ch != null) {
			$.pointerValue(c).ch.close()
			$.pointerValue(c).ch = null
		}
	}

	public getWaitChLocked(): $.Channel<Record<string, unknown>> | null {
		const c = this
		if ($.pointerValue(c).ch == null) {
			$.pointerValue(c).ch = $.makeChannel<Record<string, unknown>>(0, null, "both")
		}
		return $.pointerValue(c).ch
	}

	static __typeInfo = $.registerStructType(
		"broadcast.Broadcast",
		new Broadcast(),
		[{ name: "HoldLock", args: [], returns: [] }, { name: "HoldLockMaybeAsync", args: [], returns: [] }, { name: "TryHoldLock", args: [], returns: [] }, { name: "Wait", args: [], returns: [] }, { name: "broadcastLocked", args: [], returns: [] }, { name: "getWaitChLocked", args: [], returns: [] }],
		Broadcast,
		{"mtx": "sync.Mutex", "ch": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }}
	)
}
