// Generated file based on broadcast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/errors/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/context/index.js"
import "@goscript/errors/index.js"
import "@goscript/sync/index.js"

export class Broadcast {
	public get mtx(): sync.Mutex {
		return this._fields.mtx.value
	}
	public set mtx(value: sync.Mutex) {
		this._fields.mtx.value = value
	}

	public get ch(): $.Channel<{}> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<{}> | null) {
		this._fields.ch.value = value
	}

	public _fields: {
		mtx: $.VarRef<sync.Mutex>
		ch: $.VarRef<$.Channel<{}> | null>
	}

	constructor(init?: Partial<{mtx?: sync.Mutex, ch?: $.Channel<{}> | null}>) {
		this._fields = {
			mtx: $.varRef(init?.mtx ? $.markAsStructValue($.cloneStructValue(init.mtx)) : $.markAsStructValue(new sync.Mutex())),
			ch: $.varRef(init?.ch ?? null)
		}
	}

	public clone(): Broadcast {
		const cloned = new Broadcast()
		cloned._fields = {
			mtx: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mtx.value))),
			ch: $.varRef(this._fields.ch.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async HoldLock(cb: ((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null) => void) | null): globalThis.Promise<void> {
		const c: Broadcast | $.VarRef<Broadcast> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Broadcast>(c).mtx.Lock()
		__defer.defer(() => { $.pointerValue<Broadcast>(c).mtx.Unlock() })
		await cb!(((__receiver) => () => __receiver.broadcastLocked())($.pointerValue<Broadcast>(c)), ((__receiver) => () => __receiver.getWaitChLocked())($.pointerValue<Broadcast>(c)))
	}

	public async HoldLockMaybeAsync(cb: ((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null) => void) | null): globalThis.Promise<void> {
		const c: Broadcast | $.VarRef<Broadcast> | null = this
		let holdBroadcastLock: ((lock: boolean) => void) | null = $.functionValue(async (lock: boolean): globalThis.Promise<void> => {
			using __defer = new $.DisposableStack()
			if (lock) {
				await $.pointerValue<Broadcast>(c).mtx.Lock()
			}
			// use defer to catch panic cases
			__defer.defer(() => { $.pointerValue<Broadcast>(c).mtx.Unlock() })
			await cb!(((__receiver) => () => __receiver.broadcastLocked())($.pointerValue<Broadcast>(c)), ((__receiver) => () => __receiver.getWaitChLocked())($.pointerValue<Broadcast>(c)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "bool" }], results: [] } as $.FunctionTypeInfo))

		// fast path: lock immediately
		if ($.pointerValue<Broadcast>(c).mtx.TryLock()) {
			await holdBroadcastLock!(false)
		} else {
			// slow path: use separate goroutine
			queueMicrotask(async () => { await holdBroadcastLock!(true) })
		}
	}

	public async TryHoldLock(cb: ((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null) => void) | null): globalThis.Promise<boolean> {
		const c: Broadcast | $.VarRef<Broadcast> | null = this
		using __defer = new $.DisposableStack()
		if (!$.pointerValue<Broadcast>(c).mtx.TryLock()) {
			return false
		}
		__defer.defer(() => { $.pointerValue<Broadcast>(c).mtx.Unlock() })
		await cb!(((__receiver) => () => __receiver.broadcastLocked())($.pointerValue<Broadcast>(c)), ((__receiver) => () => __receiver.getWaitChLocked())($.pointerValue<Broadcast>(c)))
		return true
	}

	public async Wait(ctx: context.Context | null, cb: ((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null) => [boolean, $.GoError] | globalThis.Promise<[boolean, $.GoError]>) | null): globalThis.Promise<$.GoError> {
		const c: Broadcast | $.VarRef<Broadcast> | null = this
		if ((cb == null) || (ctx == null)) {
			return errors.New("cb and ctx must be set")
		}

		let waitCh: $.Channel<{}> | null = null as $.Channel<{}> | null

		while (true) {
			if ($.pointerValue<Exclude<context.Context, null>>(ctx).Err() != null) {
				return context.Canceled
			}

			let done: boolean = false
			let err: $.GoError = null as $.GoError
			await Broadcast.prototype.HoldLock.call(c, $.functionValue(async (broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				let __goscriptTuple0: any = await cb!(broadcast, getWaitCh)
				done = __goscriptTuple0[0]
				err = __goscriptTuple0[1]
				if (!done && (err == null)) {
					waitCh = await getWaitCh!()
				}
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))

			if (done || (err != null)) {
				return err
			}

			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, $.GoError>([
				{
					id: 0,
					isSend: false,
					channel: $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
					onSelected: async (__goscriptSelect0Result) => {
						return context.Canceled
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
	}

	public broadcastLocked(): void {
		let c: Broadcast | $.VarRef<Broadcast> | null = this
		if ($.pointerValue<Broadcast>(c).ch != null) {
			$.pointerValue<Broadcast>(c).ch!.close()
			$.pointerValue<Broadcast>(c).ch = null
		}
	}

	public getWaitChLocked(): $.Channel<{}> | null {
		let c: Broadcast | $.VarRef<Broadcast> | null = this
		if ($.pointerValue<Broadcast>(c).ch == null) {
			$.pointerValue<Broadcast>(c).ch = $.makeChannel<{}>(0, {}, "both")
		}
		return $.pointerValue<Broadcast>(c).ch
	}

	static __typeInfo = $.registerStructType(
		"broadcast.Broadcast",
		() => new Broadcast(),
		[{ name: "HoldLock", args: [], returns: [] }, { name: "HoldLockMaybeAsync", args: [], returns: [] }, { name: "TryHoldLock", args: [], returns: [] }, { name: "Wait", args: [], returns: [] }, { name: "broadcastLocked", args: [], returns: [] }, { name: "getWaitChLocked", args: [], returns: [] }],
		Broadcast,
		{"mtx": "sync.Mutex", "ch": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }}
	)
}
