// Generated file based on mutex.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as broadcast2 from "@goscript/github.com/aperturerobotics/util/broadcast/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"
import "@goscript/context/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/github.com/aperturerobotics/util/broadcast/index.js"
import "@goscript/github.com/pkg/errors/index.js"

export class Mutex {
	// bcast is broadcast when below fields change
	public get bcast(): broadcast2.Broadcast {
		return this._fields.bcast.value
	}
	public set bcast(value: broadcast2.Broadcast) {
		this._fields.bcast.value = value
	}

	// locked indicates the mutex is locked
	public get locked(): boolean {
		return this._fields.locked.value
	}
	public set locked(value: boolean) {
		this._fields.locked.value = value
	}

	public _fields: {
		bcast: $.VarRef<broadcast2.Broadcast>
		locked: $.VarRef<boolean>
	}

	constructor(init?: Partial<{bcast?: broadcast2.Broadcast, locked?: boolean}>) {
		this._fields = {
			bcast: $.varRef(init?.bcast ? $.markAsStructValue($.cloneStructValue(init.bcast)) : $.markAsStructValue(new broadcast2.Broadcast())),
			locked: $.varRef(init?.locked ?? false)
		}
	}

	public clone(): Mutex {
		const cloned = new Mutex()
		cloned._fields = {
			bcast: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.bcast.value))),
			locked: $.varRef(this._fields.locked.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Lock(ctx: context.Context | null): globalThis.Promise<[(() => void) | null, $.GoError]> {
		const m: Mutex | $.VarRef<Mutex> | null = this
		// status:
		// 0: waiting for lock
		// 1: locked
		// 2: unlocked (released)
		let status: $.VarRef<atomic.Int32> = $.varRef($.markAsStructValue(new atomic.Int32()))
		let waitCh: $.Channel<{}> | null = null as $.Channel<{}> | null
		await $.pointerValue<Mutex>(m).bcast.HoldLock($.functionValue(async (_p0: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
			if ($.pointerValue<Mutex>(m).locked) {
				// keep waiting
				waitCh = await getWaitCh!()
			} else {
				// 0: waiting for lock
				// 1: have the lock
				let swapped = status.value.CompareAndSwap($.int(0, 32), $.int(1, 32))
				if (swapped) {
					$.pointerValue<Mutex>(m).locked = true
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))

		let release: (() => void) | null = $.functionValue(async (): globalThis.Promise<void> => {
			let pre = $.int(status.value.Swap($.int(2, 32)), 32)
			// 1: we have the lock
			if ($.int(pre, 32) != $.int(1, 32)) {
				return
			}

			// unlock
			await $.pointerValue<Mutex>(m).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, _p1: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				$.pointerValue<Mutex>(m).locked = false
				await broadcast!()
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))

		// fast path: we locked the mutex
		if ($.int(status.value.Load(), 32) == $.int(1, 32)) {
			return [release, null]
		}

		// slow path: watch for changes
		while (true) {
			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, [(() => void) | null, $.GoError]>([
				{
					id: 0,
					isSend: false,
					channel: $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
					onSelected: async (__goscriptSelect0Result) => {
						await release!()
						return [(null as (() => void) | null), context.Canceled]
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

			await $.pointerValue<Mutex>(m).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				// keep waiting for the lock
				if ($.pointerValue<Mutex>(m).locked) {
					waitCh = await getWaitCh!()
					return
				}

				// 0: waiting for lock
				// 1: have the lock
				let swapped = status.value.CompareAndSwap($.int(0, 32), $.int(1, 32))
				if (swapped) {
					$.pointerValue<Mutex>(m).locked = true
				}
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))

			let nstatus = $.int(status.value.Load(), 32)
			switch (nstatus) {
				case 1:
				{
					return [release, null]
					break
				}
				case 2:
				{
					return [(null as (() => void) | null), context.Canceled]
					break
				}
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public Locker(): sync.Locker | null {
		const m: Mutex | $.VarRef<Mutex> | null = this
		return $.interfaceValue<sync.Locker | null>(new MutexLocker({m: m}), "*csync.MutexLocker")
	}

	public async TryLock(): globalThis.Promise<[(() => void) | null, boolean]> {
		const m: Mutex | $.VarRef<Mutex> | null = this
		let unlocked: $.VarRef<atomic.Bool> = $.varRef($.markAsStructValue(new atomic.Bool()))
		await $.pointerValue<Mutex>(m).bcast.HoldLock($.functionValue((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): void => {
			if ($.pointerValue<Mutex>(m).locked) {
				unlocked.value.Store(true)
			} else {
				$.pointerValue<Mutex>(m).locked = true
			}
		}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))

		// we failed to lock the mutex
		if (unlocked.value.Load()) {
			return [(null as (() => void) | null), false]
		}

		return [$.functionValue(async (): globalThis.Promise<void> => {
			if (unlocked.value.Swap(true)) {
				return
			}

			await $.pointerValue<Mutex>(m).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, _p1: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				$.pointerValue<Mutex>(m).locked = false
				await broadcast!()
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)), true]
	}

	static __typeInfo = $.registerStructType(
		"csync.Mutex",
		() => new Mutex(),
		[{ name: "Lock", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }, { name: "_r1", type: "error" }] }, { name: "Locker", args: [], returns: [{ name: "_r0", type: "sync.Locker" }] }, { name: "TryLock", args: [], returns: [{ name: "_r0", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		Mutex,
		[{ name: "bcast", key: "bcast", type: "broadcast.Broadcast", pkgPath: "github.com/aperturerobotics/util/csync", index: [0], offset: 0, exported: false }, { name: "locked", key: "locked", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/util/csync", index: [1], offset: 16, exported: false }]
	)
}

export class MutexLocker {
	public get m(): Mutex | $.VarRef<Mutex> | null {
		return this._fields.m.value
	}
	public set m(value: Mutex | $.VarRef<Mutex> | null) {
		this._fields.m.value = value
	}

	public get rel(): atomic.Pointer<(() => void) | null> {
		return this._fields.rel.value
	}
	public set rel(value: atomic.Pointer<(() => void) | null>) {
		this._fields.rel.value = value
	}

	public _fields: {
		m: $.VarRef<Mutex | $.VarRef<Mutex> | null>
		rel: $.VarRef<atomic.Pointer<(() => void) | null>>
	}

	constructor(init?: Partial<{m?: Mutex | $.VarRef<Mutex> | null, rel?: atomic.Pointer<(() => void) | null>}>) {
		this._fields = {
			m: $.varRef(init?.m ?? null),
			rel: $.varRef(init?.rel ? $.markAsStructValue($.cloneStructValue(init.rel)) : $.markAsStructValue(new atomic.Pointer<(() => void) | null>()))
		}
	}

	public clone(): MutexLocker {
		const cloned = new MutexLocker()
		cloned._fields = {
			m: $.varRef(this._fields.m.value),
			rel: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.rel.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Lock(): globalThis.Promise<void> {
		const l: MutexLocker | $.VarRef<MutexLocker> | null = this
		let __goscriptTuple0: any = await Mutex.prototype.Lock.call($.pointerValue<MutexLocker>(l).m, context.Background())
		let release: $.VarRef<(() => void) | null> = $.varRef(__goscriptTuple0[0])
		let err = __goscriptTuple0[1]
		if (err != null) {
			$.panic((errors.Wrap($.pointerValueOrNil(err)!, "csync: failed MutexLocker Lock") as any))
		}
		$.pointerValue<MutexLocker>(l).rel.Store(release)
	}

	public Unlock(): void {
		const l: MutexLocker | $.VarRef<MutexLocker> | null = this
		let rel = ($.pointerValue<MutexLocker>(l).rel.Swap(null) as $.VarRef<(() => void) | null> | null)
		if (rel == null) {
			$.panic("csync: unlock of unlocked MutexLocker")
		}
		void ($.pointerValue<(() => void) | null>(rel))!()
	}

	static __typeInfo = $.registerStructType(
		"csync.MutexLocker",
		() => new MutexLocker(),
		[{ name: "Lock", args: [], returns: [] }, { name: "Unlock", args: [], returns: [] }],
		MutexLocker,
		[{ name: "m", key: "m", type: { kind: $.TypeKind.Pointer, elemType: "csync.Mutex" }, pkgPath: "github.com/aperturerobotics/util/csync", index: [0], offset: 0, exported: false }, { name: "rel", key: "rel", type: "atomic.Pointer", pkgPath: "github.com/aperturerobotics/util/csync", index: [1], offset: 8, exported: false }]
	)
}
