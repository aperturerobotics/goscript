import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as broadcast from "@goscript/github.com/aperturerobotics/util/broadcast/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"

export class Mutex {
	// bcast is broadcast when below fields change
	public get bcast(): broadcast.Broadcast {
		return this._fields.bcast.value
	}
	public set bcast(value: broadcast.Broadcast) {
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
		bcast: $.VarRef<broadcast.Broadcast>;
		locked: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{bcast?: broadcast.Broadcast, locked?: boolean}>) {
		this._fields = {
			bcast: $.varRef(init?.bcast ? $.markAsStructValue(init.bcast.clone()) : new broadcast.Broadcast()),
			locked: $.varRef(init?.locked ?? false)
		}
	}

	public clone(): Mutex {
		const cloned = new Mutex()
		cloned._fields = {
			bcast: $.varRef($.markAsStructValue(this._fields.bcast.value.clone())),
			locked: $.varRef(this._fields.locked.value)
		}
		return cloned
	}

	// Lock attempts to hold a lock on the Mutex.
	// Returns a lock release function or an error.
	public async Lock(ctx: null | context.Context): Promise<[(() => void) | null, $.GoError]> {
		const m = this
		let status: $.VarRef<atomic.Int32> = $.varRef(new atomic.Int32())
		let waitCh: $.Channel<{  }> | null = null
		await m.bcast.HoldLock((_: (() => void) | null, getWaitCh: (() => $.Channel<{  }> | null) | null): void => {

			// keep waiting

			// 0: waiting for lock
			// 1: have the lock
			if (m.locked) {
				// keep waiting
				waitCh = getWaitCh!()
			} else {
				// 0: waiting for lock
				// 1: have the lock
				let swapped = status!.value.CompareAndSwap(0, 1)
				if (swapped) {
					m.locked = true
				}
			}
		})
		let release = async (): Promise<void> => {
			let pre = status!.value.Swap(2)
			// 1: we have the lock
			if (pre != 1) {
				return 
			}

			// unlock
			await m.bcast.HoldLock((broadcast: (() => void) | null, _: (() => $.Channel<{  }> | null) | null): void => {
				m.locked = false
				broadcast!()
			})
		}
		if (status!.value.Load() == 1) {
			return [release, null]
		}
		for (; ; ) {
			const [_select_has_return_2e46, _select_value_2e46] = await $.selectStatement([
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
				},
			], false)
			if (_select_has_return_2e46) {
				return _select_value_2e46!
			}
			// If _select_has_return_2e46 is false, continue execution

			// keep waiting for the lock

			// 0: waiting for lock
			// 1: have the lock
			await m.bcast.HoldLock((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{  }> | null) | null): void => {
				// keep waiting for the lock
				if (m.locked) {
					waitCh = getWaitCh!()
					return 
				}

				// 0: waiting for lock
				// 1: have the lock
				let swapped = status!.value.CompareAndSwap(0, 1)
				if (swapped) {
					m.locked = true
				}
			})

			let nstatus = status!.value.Load()
			switch (nstatus) {
				case 1: {
					return [release, null]
					break
				}
				case 2: {
					return [null, context.Canceled]
					break
				}
			}
		}
	}

	// TryLock attempts to hold a lock on the Mutex.
	// Returns a lock release function or nil if the lock could not be grabbed.
	public async TryLock(): Promise<[(() => void) | null, boolean]> {
		const m = this
		let unlocked: $.VarRef<atomic.Bool> = $.varRef(new atomic.Bool())
		await m.bcast.HoldLock((broadcast: (() => void) | null, getWaitCh: (() => $.Channel<{  }> | null) | null): void => {
			if (m.locked) {
				unlocked!.value.Store(true)
			} else {
				m.locked = true
			}
		})
		if (unlocked!.value.Load()) {
			return [null, false]
		}
		return [async (): Promise<void> => {
			if (unlocked!.value.Swap(true)) {
				return 
			}

			await m.bcast.HoldLock((broadcast: (() => void) | null, _: (() => $.Channel<{  }> | null) | null): void => {
				m.locked = false
				broadcast!()
			})
		}, true]
	}

	// Locker returns a MutexLocker that uses context.Background to lock the Mutex.
	public Locker(): null | sync.Locker {
		const m = this
		return new MutexLocker({m: m})
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'github.com/aperturerobotics/util/csync.Mutex',
	  new Mutex(),
	  [{ name: "Lock", args: [{ name: "ctx", type: "Context" }], returns: [{ type: { kind: $.TypeKind.Function, params: [], results: [] } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "TryLock", args: [], returns: [{ type: { kind: $.TypeKind.Function, params: [], results: [] } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Locker", args: [], returns: [{ type: "Locker" }] }],
	  Mutex,
	  {"bcast": "Broadcast", "locked": { kind: $.TypeKind.Basic, name: "bool" }}
	);
}

export class MutexLocker {
	public get m(): Mutex | null {
		return this._fields.m.value
	}
	public set m(value: Mutex | null) {
		this._fields.m.value = value
	}

	public get rel(): atomic.Pointer<(() => void)> {
		return this._fields.rel.value
	}
	public set rel(value: atomic.Pointer<(() => void)>) {
		this._fields.rel.value = value
	}

	public _fields: {
		m: $.VarRef<Mutex | null>;
		rel: $.VarRef<atomic.Pointer<(() => void)>>;
	}

	constructor(init?: Partial<{m?: Mutex | null, rel?: atomic.Pointer<(() => void)>}>) {
		this._fields = {
			m: $.varRef(init?.m ?? null),
			rel: $.varRef(init?.rel ? $.markAsStructValue(init.rel.clone()) : new atomic.Pointer<(() => void)>())
		}
	}

	public clone(): MutexLocker {
		const cloned = new MutexLocker()
		cloned._fields = {
			m: $.varRef(this._fields.m.value ? $.markAsStructValue(this._fields.m.value.clone()) : null),
			rel: $.varRef($.markAsStructValue(this._fields.rel.value.clone()))
		}
		return cloned
	}

	// Lock implements the sync.Locker interface.
	public async Lock(): Promise<void> {
		const l = this
		let [_varref_tmp_release, err] = await l.m!.Lock(context.Background())
		let release = $.varRef(_varref_tmp_release!)
		if (err != null) {
			$.panic(errors.Wrap(err, "csync: failed MutexLocker Lock"))
		}
		l.rel.Store(release)
	}

	// Unlock implements the sync.Locker interface.
	public Unlock(): void {
		const l = this
		let rel = l.rel.Swap(null)
		if (rel == null) {
			$.panic("csync: unlock of unlocked MutexLocker")
		}
		;(rel!.value)()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'github.com/aperturerobotics/util/csync.MutexLocker',
	  new MutexLocker(),
	  [{ name: "Lock", args: [], returns: [] }, { name: "Unlock", args: [], returns: [] }],
	  MutexLocker,
	  {"m": { kind: $.TypeKind.Pointer, elemType: "Mutex" }, "rel": "Pointer"}
	);
}


