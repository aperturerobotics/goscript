// Generated file based on rwmutex.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as broadcast from "@goscript/github.com/aperturerobotics/util/broadcast/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"

export class RWMutex {
	// bcast is broadcast when below fields change
	public get bcast(): broadcast.Broadcast {
		return this._fields.bcast.value
	}
	public set bcast(value: broadcast.Broadcast) {
		this._fields.bcast.value = value
	}

	// nreaders is the number of active readers
	public get nreaders(): number {
		return this._fields.nreaders.value
	}
	public set nreaders(value: number) {
		this._fields.nreaders.value = value
	}

	// writing indicates there's a write tx active
	public get writing(): boolean {
		return this._fields.writing.value
	}
	public set writing(value: boolean) {
		this._fields.writing.value = value
	}

	// writeWaiting indicates the number of waiting write tx
	public get writeWaiting(): number {
		return this._fields.writeWaiting.value
	}
	public set writeWaiting(value: number) {
		this._fields.writeWaiting.value = value
	}

	public _fields: {
		bcast: $.VarRef<broadcast.Broadcast>
		nreaders: $.VarRef<number>
		writing: $.VarRef<boolean>
		writeWaiting: $.VarRef<number>
	}

	constructor(init?: Partial<{bcast?: broadcast.Broadcast, nreaders?: number, writing?: boolean, writeWaiting?: number}>) {
		this._fields = {
			bcast: $.varRef(init?.bcast ? $.markAsStructValue(init.bcast.clone()) : $.markAsStructValue(new broadcast.Broadcast())),
			nreaders: $.varRef(init?.nreaders ?? 0),
			writing: $.varRef(init?.writing ?? false),
			writeWaiting: $.varRef(init?.writeWaiting ?? 0)
		}
	}

	public clone(): RWMutex {
		const cloned = new RWMutex()
		cloned._fields = {
			bcast: $.varRef($.markAsStructValue(this._fields.bcast.value.clone())),
			nreaders: $.varRef(this._fields.nreaders.value),
			writing: $.varRef(this._fields.writing.value),
			writeWaiting: $.varRef(this._fields.writeWaiting.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Lock(ctx: context.Context | null, write: boolean): Promise<[(() => void) | null, $.GoError]> {
		const m: RWMutex | $.VarRef<RWMutex> | null = this
		// status:
		// 0: waiting for lock
		// 1: locked
		// 2: unlocked (released)
		let status: $.VarRef<atomic.Int32> = $.varRef($.markAsStructValue(new atomic.Int32()))
		let waitCh: $.Channel<Record<string, unknown>> | null = null
		await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue((_: (() => void) | null, getWaitCh: (() => $.Channel<Record<string, unknown>> | null) | null): void => {
			if (write) {
				if ($.pointerValue<RWMutex>(m).nreaders != 0 || $.pointerValue<RWMutex>(m).writing) {
					$.pointerValue<RWMutex>(m).writeWaiting++
					waitCh = getWaitCh!()
				} else {
					$.pointerValue<RWMutex>(m).writing = true
					status.value.Store(1)
				}
			} else {
				if (!$.pointerValue<RWMutex>(m).writing && $.pointerValue<RWMutex>(m).writeWaiting == 0) {
					$.pointerValue<RWMutex>(m).nreaders++
					status.value.Store(1)
				} else {
					waitCh = getWaitCh!()
				}
			}
		}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))

		let release = $.functionValue(async (): Promise<void> => {
			let pre = status.value.Swap(2)
			if (pre == 2) {
				return
			}

			await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue((broadcast: (() => void) | null, _: (() => $.Channel<Record<string, unknown>> | null) | null): void => {
				if (pre == 0) {
					// 0: waiting for lock
					if (write) {
						$.pointerValue<RWMutex>(m).writeWaiting--
					}
				} else {
					// 1: we have the lock
					if (write) {
						$.pointerValue<RWMutex>(m).writing = false
					} else {
						$.pointerValue<RWMutex>(m).nreaders--
					}
					broadcast!()
				}
			}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
		}, { kind: $.TypeKind.Function, params: [], results: [] })

		// fast path: we locked the mutex
		if (status.value.Load() == 1) {
			return [release, null]
		}

		// slow path: watch for changes
		while (true) {
			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, [(() => void) | null, $.GoError]>([
				{
					id: 0,
					isSend: false,
					channel: ctx!.Done(),
					onSelected: async (result) => {
						release!()
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
			if (__goscriptSelect0HasReturn) {
				return __goscriptSelect0Value
			}

			await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<Record<string, unknown>> | null) | null): void => {
				if (write) {
					if ($.pointerValue<RWMutex>(m).nreaders == 0 && !$.pointerValue<RWMutex>(m).writing) {
						$.pointerValue<RWMutex>(m).writeWaiting--
						$.pointerValue<RWMutex>(m).writing = true
						status.value.Store(1)
					} else {
						waitCh = getWaitCh!()
					}
				} else {
					if (!$.pointerValue<RWMutex>(m).writing && $.pointerValue<RWMutex>(m).writeWaiting == 0) {
						$.pointerValue<RWMutex>(m).nreaders++
						status.value.Store(1)
					} else {
						waitCh = getWaitCh!()
					}
				}
			}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))

			if (status.value.Load() == 1) {
				return [release, null]
			}
		}
	}

	public Locker(): sync.Locker | null {
		const m: RWMutex | $.VarRef<RWMutex> | null = this
		return $.interfaceValue<sync.Locker | null>(new RWMutexLocker({m: m, write: true}), "*csync.RWMutexLocker")
	}

	public RLocker(): sync.Locker | null {
		const m: RWMutex | $.VarRef<RWMutex> | null = this
		return $.interfaceValue<sync.Locker | null>(new RWMutexLocker({m: m, write: false}), "*csync.RWMutexLocker")
	}

	public async TryLock(write: boolean): Promise<[(() => void) | null, boolean]> {
		const m: RWMutex | $.VarRef<RWMutex> | null = this
		let unlocked: $.VarRef<atomic.Bool> = $.varRef($.markAsStructValue(new atomic.Bool()))
		await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<Record<string, unknown>> | null) | null): void => {
			if (write) {
				if ($.pointerValue<RWMutex>(m).nreaders != 0 || $.pointerValue<RWMutex>(m).writing) {
					unlocked.value.Store(true)
				} else {
					$.pointerValue<RWMutex>(m).writing = true
				}
			} else {
				if (!$.pointerValue<RWMutex>(m).writing && $.pointerValue<RWMutex>(m).writeWaiting == 0) {
					$.pointerValue<RWMutex>(m).nreaders++
				} else {
					unlocked.value.Store(true)
				}
			}
		}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))

		// we failed to lock the mutex
		if (unlocked.value.Load()) {
			return [null, false]
		}

		return [$.functionValue(async (): Promise<void> => {
			if (unlocked.value.Swap(true)) {
				return
			}

			await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue((broadcast: (() => void) | null, _: (() => $.Channel<Record<string, unknown>> | null) | null): void => {
				if (write) {
					$.pointerValue<RWMutex>(m).writing = false
				} else {
					$.pointerValue<RWMutex>(m).nreaders--
				}
				broadcast!()
			}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
		}, { kind: $.TypeKind.Function, params: [], results: [] }), true]
	}

	static __typeInfo = $.registerStructType(
		"csync.RWMutex",
		new RWMutex(),
		[{ name: "Lock", args: [], returns: [] }, { name: "Locker", args: [], returns: [] }, { name: "RLocker", args: [], returns: [] }, { name: "TryLock", args: [], returns: [] }],
		RWMutex,
		{"bcast": "broadcast.Broadcast", "nreaders": { kind: $.TypeKind.Basic, name: "int" }, "writing": { kind: $.TypeKind.Basic, name: "bool" }, "writeWaiting": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class RWMutexLocker {
	public get m(): RWMutex | $.VarRef<RWMutex> | null {
		return this._fields.m.value
	}
	public set m(value: RWMutex | $.VarRef<RWMutex> | null) {
		this._fields.m.value = value
	}

	public get write(): boolean {
		return this._fields.write.value
	}
	public set write(value: boolean) {
		this._fields.write.value = value
	}

	public get mtx(): sync.Mutex {
		return this._fields.mtx.value
	}
	public set mtx(value: sync.Mutex) {
		this._fields.mtx.value = value
	}

	public get rels(): $.Slice<(() => void) | null> {
		return this._fields.rels.value
	}
	public set rels(value: $.Slice<(() => void) | null>) {
		this._fields.rels.value = value
	}

	public _fields: {
		m: $.VarRef<RWMutex | $.VarRef<RWMutex> | null>
		write: $.VarRef<boolean>
		mtx: $.VarRef<sync.Mutex>
		rels: $.VarRef<$.Slice<(() => void) | null>>
	}

	constructor(init?: Partial<{m?: RWMutex | $.VarRef<RWMutex> | null, write?: boolean, mtx?: sync.Mutex, rels?: $.Slice<(() => void) | null>}>) {
		this._fields = {
			m: $.varRef(init?.m ?? null),
			write: $.varRef(init?.write ?? false),
			mtx: $.varRef(init?.mtx ? $.markAsStructValue(init.mtx.clone()) : $.markAsStructValue(new sync.Mutex())),
			rels: $.varRef(init?.rels ?? null)
		}
	}

	public clone(): RWMutexLocker {
		const cloned = new RWMutexLocker()
		cloned._fields = {
			m: $.varRef(this._fields.m.value),
			write: $.varRef(this._fields.write.value),
			mtx: $.varRef($.markAsStructValue(this._fields.mtx.value.clone())),
			rels: $.varRef(this._fields.rels.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Lock(): Promise<void> {
		const l: RWMutexLocker | $.VarRef<RWMutexLocker> | null = this
		let [release, err] = await $.pointerValue<RWMutex>($.pointerValue<RWMutexLocker>(l).m).Lock(context.Background(), $.pointerValue<RWMutexLocker>(l).write)
		if (err != null) {
			$.panic(errors.Wrap(err, "csync: failed RWMutexLocker Lock"))
		}
		await $.pointerValue<RWMutexLocker>(l).mtx.Lock()
		$.pointerValue<RWMutexLocker>(l).rels = $.append($.pointerValue<RWMutexLocker>(l).rels, release)
		$.pointerValue<RWMutexLocker>(l).mtx.Unlock()
	}

	public async Unlock(): Promise<void> {
		const l: RWMutexLocker | $.VarRef<RWMutexLocker> | null = this
		await $.pointerValue<RWMutexLocker>(l).mtx.Lock()
		if ($.len($.pointerValue<RWMutexLocker>(l).rels) == 0) {
			$.pointerValue<RWMutexLocker>(l).mtx.Unlock()
			$.panic("csync: unlock of unlocked RWMutexLocker")
		}
		let rel = $.pointerValue<RWMutexLocker>(l).rels![$.len($.pointerValue<RWMutexLocker>(l).rels) - 1]
		if ($.len($.pointerValue<RWMutexLocker>(l).rels) == 1) {
			$.pointerValue<RWMutexLocker>(l).rels = null
		} else {
			$.pointerValue<RWMutexLocker>(l).rels![$.len($.pointerValue<RWMutexLocker>(l).rels) - 1] = null
			$.pointerValue<RWMutexLocker>(l).rels = $.goSlice($.pointerValue<RWMutexLocker>(l).rels, undefined, $.len($.pointerValue<RWMutexLocker>(l).rels) - 1)
		}
		$.pointerValue<RWMutexLocker>(l).mtx.Unlock()
		rel!()
	}

	static __typeInfo = $.registerStructType(
		"csync.RWMutexLocker",
		new RWMutexLocker(),
		[{ name: "Lock", args: [], returns: [] }, { name: "Unlock", args: [], returns: [] }],
		RWMutexLocker,
		{"m": { kind: $.TypeKind.Pointer, elemType: "csync.RWMutex" }, "write": { kind: $.TypeKind.Basic, name: "bool" }, "mtx": "sync.Mutex", "rels": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Function, params: [], results: [] } }}
	)
}

export let _: sync.Locker | null = $.interfaceValue<sync.Locker | null>(($.typedNil("*csync.RWMutexLocker")), "*csync.RWMutexLocker")
