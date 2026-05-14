// Generated file based on mutex.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as context from "@goscript/context/index.ts"

import * as sync from "@goscript/sync/index.ts"

import * as atomic from "@goscript/sync/atomic/index.ts"

import * as broadcast from "@goscript/github.com/aperturerobotics/util/broadcast/index.ts"

import * as errors from "@goscript/github.com/pkg/errors/index.ts"

export class Mutex {
	public get bcast(): broadcast.Broadcast {
		return this._fields.bcast.value
	}
	public set bcast(value: broadcast.Broadcast) {
		this._fields.bcast.value = value
	}

	public get locked(): boolean {
		return this._fields.locked.value
	}
	public set locked(value: boolean) {
		this._fields.locked.value = value
	}

	public _fields: {
		bcast: $.VarRef<broadcast.Broadcast>
		locked: $.VarRef<boolean>
	}

	constructor(init?: Partial<{bcast?: broadcast.Broadcast, locked?: boolean}>) {
		this._fields = {
			bcast: $.varRef(init?.bcast ? $.markAsStructValue(init.bcast.clone()) : $.markAsStructValue(new broadcast.Broadcast())),
			locked: $.varRef(init?.locked ?? false)
		}
	}

	public clone(): Mutex {
		const cloned = new Mutex()
		cloned._fields = {
			bcast: $.varRef($.markAsStructValue(this._fields.bcast.value.clone())),
			locked: $.varRef(this._fields.locked.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Lock(ctx: context.Context): Promise<[() => void, $.GoError]> {
		const m = this
		let status: $.VarRef<atomic.Int32> = $.varRef($.markAsStructValue(new atomic.Int32()))
		let waitCh: $.Channel<Record<string, unknown>> | null = null
		await $.pointerValue(m).bcast.HoldLock($.functionValue((_: () => void, getWaitCh: () => $.Channel<Record<string, unknown>> | null): void => {
	if ($.pointerValue(m).locked) {
		waitCh = getWaitCh()
	} else {
		let swapped = status.value.CompareAndSwap(0, 1)
		if (swapped) {
			$.pointerValue(m).locked = true
		}
	}
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
		let release = $.functionValue(async (): Promise<void> => {
	let pre = status.value.Swap(2)
	if (pre != 1) {
		return
	}
	await $.pointerValue(m).bcast.HoldLock($.functionValue((broadcast: () => void, _: () => $.Channel<Record<string, unknown>> | null): void => {
	$.pointerValue(m).locked = false
	broadcast()
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
}, { kind: $.TypeKind.Function, params: [], results: [] })
		if (status.value.Load() == 1) {
			return [release, null]
		}
		while (true) {
			const [__goscriptSelectHasReturn4794185, __goscriptSelectValue4794185] = await $.selectStatement<any, [() => void, $.GoError]>([
				{
					id: 0,
					isSend: false,
					channel: ctx!.Done(),
					onSelected: async (result) => {
						release()
						return [null, context.Canceled]
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
			if (__goscriptSelectHasReturn4794185) {
				return __goscriptSelectValue4794185
			}
			await $.pointerValue(m).bcast.HoldLock($.functionValue((broadcast: () => void, getWaitCh: () => $.Channel<Record<string, unknown>> | null): void => {
	if ($.pointerValue(m).locked) {
		waitCh = getWaitCh()
		return
	}
	let swapped = status.value.CompareAndSwap(0, 1)
	if (swapped) {
		$.pointerValue(m).locked = true
	}
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
			let nstatus = status.value.Load()
			switch (nstatus) {
				case 1:
				{
					return [release, null]
					break
				}
				case 2:
				{
					return [null, context.Canceled]
					break
				}
			}
		}
	}

	public Locker(): sync.Locker {
		const m = this
		return $.interfaceValue<sync.Locker>(new MutexLocker({m: m}), "*csync.MutexLocker")
	}

	public async TryLock(): Promise<[() => void, boolean]> {
		const m = this
		let unlocked: $.VarRef<atomic.Bool> = $.varRef($.markAsStructValue(new atomic.Bool()))
		await $.pointerValue(m).bcast.HoldLock($.functionValue((broadcast: () => void, getWaitCh: () => $.Channel<Record<string, unknown>> | null): void => {
	if ($.pointerValue(m).locked) {
		unlocked.value.Store(true)
	} else {
		$.pointerValue(m).locked = true
	}
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
		if (unlocked.value.Load()) {
			return [null, false]
		}
		return [$.functionValue(async (): Promise<void> => {
	if (unlocked.value.Swap(true)) {
		return
	}
	await $.pointerValue(m).bcast.HoldLock($.functionValue((broadcast: () => void, _: () => $.Channel<Record<string, unknown>> | null): void => {
	$.pointerValue(m).locked = false
	broadcast()
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
}, { kind: $.TypeKind.Function, params: [], results: [] }), true]
	}

	static __typeInfo = $.registerStructType(
		"csync.Mutex",
		new Mutex(),
		[{ name: "Lock", args: [], returns: [] }, { name: "Locker", args: [], returns: [] }, { name: "TryLock", args: [], returns: [] }],
		Mutex,
		{"bcast": "broadcast.Broadcast", "locked": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export class MutexLocker {
	public get m(): Mutex | $.VarRef<Mutex> | null {
		return this._fields.m.value
	}
	public set m(value: Mutex | $.VarRef<Mutex> | null) {
		this._fields.m.value = value
	}

	public get rel(): atomic.Pointer<() => void> {
		return this._fields.rel.value
	}
	public set rel(value: atomic.Pointer<() => void>) {
		this._fields.rel.value = value
	}

	public _fields: {
		m: $.VarRef<Mutex | $.VarRef<Mutex> | null>
		rel: $.VarRef<atomic.Pointer<() => void>>
	}

	constructor(init?: Partial<{m?: Mutex | $.VarRef<Mutex> | null, rel?: atomic.Pointer<() => void>}>) {
		this._fields = {
			m: $.varRef(init?.m ?? null),
			rel: $.varRef(init?.rel ? $.markAsStructValue(init.rel.clone()) : $.markAsStructValue(new atomic.Pointer<() => void>()))
		}
	}

	public clone(): MutexLocker {
		const cloned = new MutexLocker()
		cloned._fields = {
			m: $.varRef(this._fields.m.value),
			rel: $.varRef($.markAsStructValue(this._fields.rel.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	public async Lock(): Promise<void> {
		const l = this
		let [release, err] = await $.pointerValue($.pointerValue(l).m).Lock(context.Background())
		if (err != null) {
			$.panic(errors.Wrap(err, "csync: failed MutexLocker Lock"))
		}
		$.pointerValue(l).rel.Store(release)
	}

	public Unlock(): void {
		const l = this
		let rel = $.pointerValue(l).rel.Swap(null)
		if (rel == null) {
			$.panic("csync: unlock of unlocked MutexLocker")
		}
		($.pointerValue(rel))()
	}

	static __typeInfo = $.registerStructType(
		"csync.MutexLocker",
		new MutexLocker(),
		[{ name: "Lock", args: [], returns: [] }, { name: "Unlock", args: [], returns: [] }],
		MutexLocker,
		{"m": { kind: $.TypeKind.Pointer, elemType: "csync.Mutex" }, "rel": "atomic.Pointer"}
	)
}

export let _: sync.Locker = $.interfaceValue<sync.Locker>(($.typedNil("*csync.MutexLocker")), "*csync.MutexLocker")
