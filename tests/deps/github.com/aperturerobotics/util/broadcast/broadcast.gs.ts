// Generated file based on broadcast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_compat from "./compat.gs.ts"

import * as __goscript_locked from "./locked.gs.ts"
import "@goscript/sync/index.js"
import "@goscript/context/index.js"
import "@goscript/errors/index.js"
import "./compat.gs.ts"
import "./locked.gs.ts"

export class Broadcast {
	public get mtx(): sync.Mutex {
		return this._fields.mtx.value
	}
	public set mtx(value: sync.Mutex) {
		this._fields.mtx.value = value
	}

	public get ch(): broadcastWaitCh | $.VarRef<broadcastWaitCh> | null {
		return this._fields.ch.value
	}
	public set ch(value: broadcastWaitCh | $.VarRef<broadcastWaitCh> | null) {
		this._fields.ch.value = value
	}

	public _fields: {
		mtx: $.VarRef<sync.Mutex>
		ch: $.VarRef<broadcastWaitCh | $.VarRef<broadcastWaitCh> | null>
	}

	constructor(init?: Partial<{mtx?: sync.Mutex, ch?: broadcastWaitCh | $.VarRef<broadcastWaitCh> | null}>) {
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
		let locked = $.varRef($.markAsStructValue($.cloneStructValue(await Broadcast.prototype.Lock.call(c))))
		__defer.defer(() => { locked.value.Unlock() })
		await cb!(((__receiver) => () => __receiver.Broadcast())(locked.value), ((__receiver) => () => __receiver.WaitCh())(locked.value))
	}

	public async HoldLockMaybeAsync(cb: ((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null) => void) | null): globalThis.Promise<void> {
		const c: Broadcast | $.VarRef<Broadcast> | null = this
		let holdBroadcastLock: ((lock: boolean) => void) | null = $.functionValue(async (lock: boolean): globalThis.Promise<void> => {
			using __defer = new $.DisposableStack()
			if (lock) {
				await $.pointerValue<Broadcast>(c).mtx.Lock()
			}
			__defer.defer(() => { $.pointerValue<Broadcast>(c).mtx.Unlock() })
			let locked = $.varRef($.markAsStructValue(new __goscript_locked.Locked({b: c})))
			await cb!(((__receiver) => () => __receiver.Broadcast())(locked.value), ((__receiver) => () => __receiver.WaitCh())(locked.value))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "bool" }], results: [] } as $.FunctionTypeInfo))

		if ($.pointerValue<Broadcast>(c).mtx.TryLock()) {
			await holdBroadcastLock!(false)
			return
		}
		queueMicrotask(async () => { await holdBroadcastLock!(true) })
	}

	public async Lock(): globalThis.Promise<__goscript_locked.Locked> {
		const c: Broadcast | $.VarRef<Broadcast> | null = this
		await $.pointerValue<Broadcast>(c).mtx.Lock()
		return $.markAsStructValue(new __goscript_locked.Locked({b: c}))
	}

	public async TryHoldLock(cb: ((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null) => void) | null): globalThis.Promise<boolean> {
		const c: Broadcast | $.VarRef<Broadcast> | null = this
		using __defer = new $.DisposableStack()
		let __goscriptTuple0: any = Broadcast.prototype.TryLock.call(c)
		let locked = $.varRef(__goscriptTuple0[0])
		let ok = __goscriptTuple0[1]
		if (!ok) {
			return false
		}
		__defer.defer(() => { locked.value.Unlock() })
		await cb!(((__receiver) => () => __receiver.Broadcast())(locked.value), ((__receiver) => () => __receiver.WaitCh())(locked.value))
		return true
	}

	public TryLock(): [__goscript_locked.Locked, boolean] {
		const c: Broadcast | $.VarRef<Broadcast> | null = this
		if (!$.pointerValue<Broadcast>(c).mtx.TryLock()) {
			return [$.markAsStructValue(new __goscript_locked.Locked()), false]
		}
		return [$.markAsStructValue(new __goscript_locked.Locked({b: c})), true]
	}

	public async Wait(ctx: context.Context | null, cb: ((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null) => [boolean, $.GoError] | globalThis.Promise<[boolean, $.GoError]>) | null): globalThis.Promise<$.GoError> {
		const c: Broadcast | $.VarRef<Broadcast> | null = this
		if ((cb == null) || (ctx == null)) {
			return errors.New("cb and ctx must be set")
		}

		while (true) {
			if (await $.pointerValue<Exclude<context.Context, null>>(ctx).Err() != null) {
				return context.Canceled
			}

			let waitCh: $.Channel<{}> | null = null as $.Channel<{}> | null
			let done: boolean = false
			let err: $.GoError = null as $.GoError
			let locked = $.varRef($.markAsStructValue($.cloneStructValue(await Broadcast.prototype.Lock.call(c))))
			let __goscriptTuple1: any = await cb!(((__receiver) => () => __receiver.Broadcast())(locked.value), ((__receiver) => () => __receiver.WaitCh())(locked.value))
			done = __goscriptTuple1[0]
			err = __goscriptTuple1[1]
			if (!done && (err == null)) {
				waitCh = locked.value.WaitCh()
			}
			locked.value.Unlock()

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
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"broadcast.Broadcast",
		() => new Broadcast(),
		[{ name: "HoldLock", args: [{ name: "cb", type: ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo) }], returns: [] }, { name: "HoldLockMaybeAsync", args: [{ name: "cb", type: ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo) }], returns: [] }, { name: "Lock", args: [], returns: [{ name: "_r0", type: "broadcast.Locked" }] }, { name: "TryHoldLock", args: [{ name: "cb", type: ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "TryLock", args: [], returns: [{ name: "_r0", type: "broadcast.Locked" }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Wait", args: [{ name: "ctx", type: "context.Context" }, { name: "cb", type: ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [{ kind: $.TypeKind.Basic, name: "bool" }, "error"] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: "error" }] }],
		Broadcast,
		[{ name: "mtx", key: "mtx", type: "sync.Mutex", pkgPath: "github.com/aperturerobotics/util/broadcast", index: [0], offset: 0, exported: false }, { name: "ch", key: "ch", type: { kind: $.TypeKind.Pointer, elemType: "broadcast.broadcastWaitCh" }, pkgPath: "github.com/aperturerobotics/util/broadcast", index: [1], offset: 8, exported: false }]
	)
}

export class broadcastWaitCh {
	public get once(): sync.Once {
		return this._fields.once.value
	}
	public set once(value: sync.Once) {
		this._fields.once.value = value
	}

	public get ch(): $.Channel<{}> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<{}> | null) {
		this._fields.ch.value = value
	}

	public _fields: {
		once: $.VarRef<sync.Once>
		ch: $.VarRef<$.Channel<{}> | null>
	}

	constructor(init?: Partial<{once?: sync.Once, ch?: $.Channel<{}> | null}>) {
		this._fields = {
			once: $.varRef(init?.once ? $.markAsStructValue($.cloneStructValue(init.once)) : $.markAsStructValue(new sync.Once())),
			ch: $.varRef(init?.ch ?? null)
		}
	}

	public clone(): broadcastWaitCh {
		const cloned = new broadcastWaitCh()
		cloned._fields = {
			once: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.once.value))),
			ch: $.varRef(this._fields.ch.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async close(): globalThis.Promise<void> {
		const c: broadcastWaitCh | $.VarRef<broadcastWaitCh> | null = this
		await $.pointerValue<broadcastWaitCh>(c).once.Do($.functionValue((): void => {
			$.pointerValue<broadcastWaitCh>(c).ch!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}

	static __typeInfo = $.registerStructType(
		"broadcast.broadcastWaitCh",
		() => new broadcastWaitCh(),
		[{ name: "close", args: [], returns: [] }],
		broadcastWaitCh,
		[{ name: "once", key: "once", type: "sync.Once", pkgPath: "github.com/aperturerobotics/util/broadcast", index: [0], offset: 0, exported: false }, { name: "ch", key: "ch", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/aperturerobotics/util/broadcast", index: [1], offset: 16, exported: false }]
	)
}

export function newBroadcastWaitCh(): broadcastWaitCh | $.VarRef<broadcastWaitCh> | null {
	return new broadcastWaitCh({ch: $.makeChannel<{}>(0, {}, "both")})
}
