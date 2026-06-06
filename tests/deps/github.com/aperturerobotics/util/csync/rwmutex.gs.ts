// Generated file based on rwmutex.go
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

export class RWMutex {
	// bcast is broadcast when below fields change
	public get bcast(): broadcast2.Broadcast {
		return this._fields.bcast.value
	}
	public set bcast(value: broadcast2.Broadcast) {
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
		bcast: $.VarRef<broadcast2.Broadcast>
		nreaders: $.VarRef<number>
		writing: $.VarRef<boolean>
		writeWaiting: $.VarRef<number>
	}

	constructor(init?: Partial<{bcast?: broadcast2.Broadcast, nreaders?: number, writing?: boolean, writeWaiting?: number}>) {
		this._fields = {
			bcast: $.varRef(init?.bcast ? $.markAsStructValue($.cloneStructValue(init.bcast)) : $.markAsStructValue(new broadcast2.Broadcast())),
			nreaders: $.varRef(init?.nreaders ?? (0 as unknown as number)),
			writing: $.varRef(init?.writing ?? (false as unknown as boolean)),
			writeWaiting: $.varRef(init?.writeWaiting ?? (0 as unknown as number))
		}
	}

	public clone(): RWMutex {
		const cloned = new RWMutex()
		cloned._fields = {
			bcast: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.bcast.value))),
			nreaders: $.varRef(this._fields.nreaders.value),
			writing: $.varRef(this._fields.writing.value),
			writeWaiting: $.varRef(this._fields.writeWaiting.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Lock(ctx: context.Context | null, write: boolean): globalThis.Promise<[(() => void) | null, $.GoError]> {
		const m: RWMutex | $.VarRef<RWMutex> | null = this
		// status:
		// 0: waiting for lock
		// 1: locked
		// 2: unlocked (released)
		let status: $.VarRef<atomic.Int32> = $.varRef($.markAsStructValue(new atomic.Int32()))
		let waitCh: $.Channel<{}> | null = null as $.Channel<{}> | null
		await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue(async (_p0: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
			if (write) {
				if (($.pointerValue<RWMutex>(m).nreaders != 0) || $.pointerValue<RWMutex>(m).writing) {
					$.pointerValue<RWMutex>(m).writeWaiting++
					waitCh = await getWaitCh!()
				} else {
					$.pointerValue<RWMutex>(m).writing = true
					status.value.Store($.int(1, 32))
				}
			} else {
				if (!$.pointerValue<RWMutex>(m).writing && ($.pointerValue<RWMutex>(m).writeWaiting == 0)) {
					$.pointerValue<RWMutex>(m).nreaders++
					status.value.Store($.int(1, 32))
				} else {
					waitCh = await getWaitCh!()
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))

		let release: (() => void) | null = $.functionValue(async (): globalThis.Promise<void> => {
			let pre = $.int(status.value.Swap($.int(2, 32)), 32)
			if ($.int(pre, 32) == $.int(2, 32)) {
				return
			}

			await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, _p1: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				if ($.int(pre, 32) == $.int(0, 32)) {
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
					await broadcast!()
				}
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
					channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
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

			await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				if (write) {
					if (($.pointerValue<RWMutex>(m).nreaders == 0) && !$.pointerValue<RWMutex>(m).writing) {
						$.pointerValue<RWMutex>(m).writeWaiting--
						$.pointerValue<RWMutex>(m).writing = true
						status.value.Store($.int(1, 32))
					} else {
						waitCh = await getWaitCh!()
					}
				} else {
					if (!$.pointerValue<RWMutex>(m).writing && ($.pointerValue<RWMutex>(m).writeWaiting == 0)) {
						$.pointerValue<RWMutex>(m).nreaders++
						status.value.Store($.int(1, 32))
					} else {
						waitCh = await getWaitCh!()
					}
				}
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))

			if ($.int(status.value.Load(), 32) == $.int(1, 32)) {
				return [release, null]
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public Locker(): sync.Locker | null {
		const m: RWMutex | $.VarRef<RWMutex> | null = this
		return $.interfaceValue<sync.Locker | null>(new RWMutexLocker({m: m, write: true}), "*csync.RWMutexLocker")
	}

	public RLocker(): sync.Locker | null {
		const m: RWMutex | $.VarRef<RWMutex> | null = this
		return $.interfaceValue<sync.Locker | null>(new RWMutexLocker({m: m, write: false}), "*csync.RWMutexLocker")
	}

	public async TryLock(write: boolean): globalThis.Promise<[(() => void) | null, boolean]> {
		const m: RWMutex | $.VarRef<RWMutex> | null = this
		let unlocked: $.VarRef<atomic.Bool> = $.varRef($.markAsStructValue(new atomic.Bool()))
		await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): void => {
			if (write) {
				if (($.pointerValue<RWMutex>(m).nreaders != 0) || $.pointerValue<RWMutex>(m).writing) {
					unlocked.value.Store(true)
				} else {
					$.pointerValue<RWMutex>(m).writing = true
				}
			} else {
				if (!$.pointerValue<RWMutex>(m).writing && ($.pointerValue<RWMutex>(m).writeWaiting == 0)) {
					$.pointerValue<RWMutex>(m).nreaders++
				} else {
					unlocked.value.Store(true)
				}
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

			await $.pointerValue<RWMutex>(m).bcast.HoldLock($.functionValue(async (broadcast: (() => void) | null, _p1: (() => $.Channel<{}> | null | globalThis.Promise<$.Channel<{}> | null>) | null): globalThis.Promise<void> => {
				if (write) {
					$.pointerValue<RWMutex>(m).writing = false
				} else {
					$.pointerValue<RWMutex>(m).nreaders--
				}
				await broadcast!()
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)), true]
	}

	static __typeInfo = $.registerStructType(
		"csync.RWMutex",
		() => new RWMutex(),
		[{ name: "Lock", args: [{ name: "ctx", type: "context.Context" }, { name: "write", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }, { name: "_r1", type: "error" }] }, { name: "Locker", args: [], returns: [{ name: "_r0", type: "sync.Locker" }] }, { name: "RLocker", args: [], returns: [{ name: "_r0", type: "sync.Locker" }] }, { name: "TryLock", args: [{ name: "write", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		RWMutex,
		[{ name: "bcast", key: "bcast", type: "broadcast.Broadcast", pkgPath: "github.com/aperturerobotics/util/csync", index: [0], offset: 0, exported: false }, { name: "nreaders", key: "nreaders", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/util/csync", index: [1], offset: 16, exported: false }, { name: "writing", key: "writing", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/util/csync", index: [2], offset: 24, exported: false }, { name: "writeWaiting", key: "writeWaiting", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/util/csync", index: [3], offset: 32, exported: false }]
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
			m: $.varRef(init?.m ?? (null as unknown as RWMutex | $.VarRef<RWMutex> | null)),
			write: $.varRef(init?.write ?? (false as unknown as boolean)),
			mtx: $.varRef(init?.mtx ? $.markAsStructValue($.cloneStructValue(init.mtx)) : $.markAsStructValue(new sync.Mutex())),
			rels: $.varRef(init?.rels ?? (null as unknown as $.Slice<(() => void) | null>))
		}
	}

	public clone(): RWMutexLocker {
		const cloned = new RWMutexLocker()
		cloned._fields = {
			m: $.varRef(this._fields.m.value),
			write: $.varRef(this._fields.write.value),
			mtx: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mtx.value))),
			rels: $.varRef(this._fields.rels.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Lock(): globalThis.Promise<void> {
		let l: RWMutexLocker | $.VarRef<RWMutexLocker> | null = this
		let [release, err] = await RWMutex.prototype.Lock.call($.pointerValue<RWMutexLocker>(l).m, context.Background(), $.pointerValue<RWMutexLocker>(l).write)
		if (err != null) {
			$.panic((errors.Wrap($.pointerValueOrNil(err)!, "csync: failed RWMutexLocker Lock") as any))
		}
		await $.pointerValue<RWMutexLocker>(l).mtx.Lock()
		$.pointerValue<RWMutexLocker>(l).rels = $.append($.pointerValue<RWMutexLocker>(l).rels, release)
		$.pointerValue<RWMutexLocker>(l).mtx.Unlock()
	}

	public async Unlock(): globalThis.Promise<void> {
		let l: RWMutexLocker | $.VarRef<RWMutexLocker> | null = this
		await $.pointerValue<RWMutexLocker>(l).mtx.Lock()
		if ($.len($.pointerValue<RWMutexLocker>(l).rels) == 0) {
			$.pointerValue<RWMutexLocker>(l).mtx.Unlock()
			$.panic("csync: unlock of unlocked RWMutexLocker")
		}
		let rel: (() => void) | null = $.pointerValue<RWMutexLocker>(l).rels![$.len($.pointerValue<RWMutexLocker>(l).rels) - 1]
		if ($.len($.pointerValue<RWMutexLocker>(l).rels) == 1) {
			$.pointerValue<RWMutexLocker>(l).rels = null
		} else {
			$.pointerValue<RWMutexLocker>(l).rels![$.len($.pointerValue<RWMutexLocker>(l).rels) - 1] = (null as (() => void) | null)
			$.pointerValue<RWMutexLocker>(l).rels = $.goSlice($.pointerValue<RWMutexLocker>(l).rels, undefined, $.len($.pointerValue<RWMutexLocker>(l).rels) - 1)
		}
		$.pointerValue<RWMutexLocker>(l).mtx.Unlock()
		await rel!()
	}

	static __typeInfo = $.registerStructType(
		"csync.RWMutexLocker",
		() => new RWMutexLocker(),
		[{ name: "Lock", args: [], returns: [] }, { name: "Unlock", args: [], returns: [] }],
		RWMutexLocker,
		[{ name: "m", key: "m", type: { kind: $.TypeKind.Pointer, elemType: "csync.RWMutex" }, pkgPath: "github.com/aperturerobotics/util/csync", index: [0], offset: 0, exported: false }, { name: "write", key: "write", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/util/csync", index: [1], offset: 8, exported: false }, { name: "mtx", key: "mtx", type: "sync.Mutex", pkgPath: "github.com/aperturerobotics/util/csync", index: [2], offset: 12, exported: false }, { name: "rels", key: "rels", type: { kind: $.TypeKind.Slice, elemType: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }, pkgPath: "github.com/aperturerobotics/util/csync", index: [3], offset: 24, exported: false }]
	)
}
