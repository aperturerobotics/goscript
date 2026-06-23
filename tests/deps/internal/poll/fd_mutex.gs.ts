// Generated file based on fd_mutex.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as syscall from "@goscript/syscall/index.js"

import type * as time from "@goscript/time/index.js"

import * as __goscript_fd from "./fd.gs.ts"

import * as __goscript_fd_fsync_posix from "./fd_fsync_posix.gs.ts"

import * as __goscript_fd_poll_js from "./fd_poll_js.gs.ts"

import * as __goscript_fd_posix from "./fd_posix.gs.ts"

import * as __goscript_fd_unix from "./fd_unix.gs.ts"

import * as __goscript_fd_unixjs from "./fd_unixjs.gs.ts"
import "@goscript/sync/atomic/index.js"
import "@goscript/syscall/index.js"
import "./fd.gs.ts"
import "./fd_fsync_posix.gs.ts"
import "./fd_poll_js.gs.ts"
import "./fd_posix.gs.ts"
import "./fd_unix.gs.ts"
import "./fd_unixjs.gs.ts"

export class fdMutex {
	public get state(): bigint {
		return this._fields.state.value
	}
	public set state(value: bigint) {
		this._fields.state.value = value
	}

	public get rsema(): number {
		return this._fields.rsema.value
	}
	public set rsema(value: number) {
		this._fields.rsema.value = value
	}

	public get wsema(): number {
		return this._fields.wsema.value
	}
	public set wsema(value: number) {
		this._fields.wsema.value = value
	}

	public _fields: {
		state: $.VarRef<bigint>
		rsema: $.VarRef<number>
		wsema: $.VarRef<number>
	}

	constructor(init?: Partial<{state?: bigint, rsema?: number, wsema?: number}>) {
		this._fields = {
			state: $.varRef(init?.state ?? (0n as unknown as bigint)),
			rsema: $.varRef(init?.rsema ?? (0 as unknown as number)),
			wsema: $.varRef(init?.wsema ?? (0 as unknown as number))
		}
	}

	public clone(): fdMutex {
		const cloned = new fdMutex()
		cloned._fields = {
			state: $.varRef(this._fields.state.value),
			rsema: $.varRef(this._fields.rsema.value),
			wsema: $.varRef(this._fields.wsema.value)
		}
		return $.markAsStructValue(cloned)
	}

	public decref(): boolean {
		const mu: fdMutex | $.VarRef<fdMutex> | null = this
		while (true) {
			let old = atomic.LoadUint64($.pointerValue<fdMutex>(mu)._fields.state)
			if (($.uint64And(old, 8388600)) == 0n) {
				$.panic("inconsistent poll.fdMutex")
			}
			let _new = $.uint64Sub(old, 8)
			if (atomic.CompareAndSwapUint64($.pointerValue<fdMutex>(mu)._fields.state, old, _new)) {
				return ($.uint64And(_new, ($.uint64Or(1, 8388600)))) == 1n
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public incref(): boolean {
		const mu: fdMutex | $.VarRef<fdMutex> | null = this
		while (true) {
			let old = atomic.LoadUint64($.pointerValue<fdMutex>(mu)._fields.state)
			if (($.uint64And(old, 1)) != 0n) {
				return false
			}
			let _new = $.uint64Add(old, 8)
			if (($.uint64And(_new, 8388600)) == 0n) {
				$.panic("too many concurrent operations on a single file or socket (max 1048575)")
			}
			if (atomic.CompareAndSwapUint64($.pointerValue<fdMutex>(mu)._fields.state, old, _new)) {
				return true
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public increfAndClose(): boolean {
		const mu: fdMutex | $.VarRef<fdMutex> | null = this
		while (true) {
			let old = atomic.LoadUint64($.pointerValue<fdMutex>(mu)._fields.state)
			if (($.uint64And(old, 1)) != 0n) {
				return false
			}
			// Mark as closed and acquire a reference.
			let _new = $.uint64Add(($.uint64Or(old, 1)), 8)
			if (($.uint64And(_new, 8388600)) == 0n) {
				$.panic("too many concurrent operations on a single file or socket (max 1048575)")
			}
			// Remove all read and write waiters.
			_new = _new & ~((9223372036846387200n))
			if (atomic.CompareAndSwapUint64($.pointerValue<fdMutex>(mu)._fields.state, old, _new)) {
				// Wake all read and write waiters,
				// they will observe closed flag after wakeup.
				while (($.uint64And(old, 8796084633600)) != 0n) {
					old = $.uint64Sub(old, 8388608n)
					runtime_Semrelease($.pointerValue<fdMutex>(mu)._fields.rsema)
				}
				while (($.uint64And(old, 9223363240761753600)) != 0n) {
					old = $.uint64Sub(old, 8796093022208n)
					runtime_Semrelease($.pointerValue<fdMutex>(mu)._fields.wsema)
				}
				return true
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public rwlock(read: boolean): boolean {
		const mu: fdMutex | $.VarRef<fdMutex> | null = this
		let mutexBit: bigint = 0n
		let mutexWait: bigint = 0n
		let mutexMask: bigint = 0n
		let mutexSema: $.VarRef<number> | null = null as $.VarRef<number> | null
		if (read) {
			mutexBit = 2n
			mutexWait = 8388608n
			mutexMask = 8796084633600n
			mutexSema = $.pointerValue<fdMutex>(mu)._fields.rsema
		} else {
			mutexBit = 4n
			mutexWait = 8796093022208n
			mutexMask = 9223363240761753600n
			mutexSema = $.pointerValue<fdMutex>(mu)._fields.wsema
		}
		while (true) {
			let old = atomic.LoadUint64($.pointerValue<fdMutex>(mu)._fields.state)
			if (($.uint64And(old, 1)) != 0n) {
				return false
			}
			let _new: bigint = 0n
			if (($.uint64And(old, mutexBit)) == 0n) {
				// Lock is free, acquire it.
				_new = $.uint64Add(($.uint64Or(old, mutexBit)), 8)
				if (($.uint64And(_new, 8388600)) == 0n) {
					$.panic("too many concurrent operations on a single file or socket (max 1048575)")
				}
			} else {
				// Wait for lock.
				_new = $.uint64Add(old, mutexWait)
				if (($.uint64And(_new, mutexMask)) == 0n) {
					$.panic("too many concurrent operations on a single file or socket (max 1048575)")
				}
			}
			if (atomic.CompareAndSwapUint64($.pointerValue<fdMutex>(mu)._fields.state, old, _new)) {
				if (($.uint64And(old, mutexBit)) == 0n) {
					return true
				}
				runtime_Semacquire(mutexSema)
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public rwunlock(read: boolean): boolean {
		const mu: fdMutex | $.VarRef<fdMutex> | null = this
		let mutexBit: bigint = 0n
		let mutexWait: bigint = 0n
		let mutexMask: bigint = 0n
		let mutexSema: $.VarRef<number> | null = null as $.VarRef<number> | null
		if (read) {
			mutexBit = 2n
			mutexWait = 8388608n
			mutexMask = 8796084633600n
			mutexSema = $.pointerValue<fdMutex>(mu)._fields.rsema
		} else {
			mutexBit = 4n
			mutexWait = 8796093022208n
			mutexMask = 9223363240761753600n
			mutexSema = $.pointerValue<fdMutex>(mu)._fields.wsema
		}
		while (true) {
			let old = atomic.LoadUint64($.pointerValue<fdMutex>(mu)._fields.state)
			if ((($.uint64And(old, mutexBit)) == 0n) || (($.uint64And(old, 8388600)) == 0n)) {
				$.panic("inconsistent poll.fdMutex")
			}
			// Drop lock, drop reference and wake read waiter if present.
			let _new = $.uint64Sub((old & ~(mutexBit)), 8)
			if (($.uint64And(old, mutexMask)) != 0n) {
				_new = $.uint64Sub(_new, mutexWait)
			}
			if (atomic.CompareAndSwapUint64($.pointerValue<fdMutex>(mu)._fields.state, old, _new)) {
				if (($.uint64And(old, mutexMask)) != 0n) {
					runtime_Semrelease(mutexSema)
				}
				return ($.uint64And(_new, ($.uint64Or(1, 8388600)))) == 1n
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"poll.fdMutex",
		() => new fdMutex(),
		[{ name: "decref", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "incref", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "increfAndClose", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "rwlock", args: [{ name: "read", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "rwunlock", args: [{ name: "read", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		fdMutex,
		[{ name: "state", key: "state", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "internal/poll", index: [0], offset: 0, exported: false }, { name: "rsema", key: "rsema", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "internal/poll", index: [1], offset: 8, exported: false }, { name: "wsema", key: "wsema", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "internal/poll", index: [2], offset: 12, exported: false }]
	)
}

export const mutexClosed: number = 1

export const mutexRLock: number = 2

export const mutexWLock: number = 4

export const mutexRef: number = 8

export const mutexRefMask: number = 8388600

export const mutexRWait: number = 8388608

export const mutexRMask: number = 8796084633600

export const mutexWWait: number = 8796093022208

export const mutexWMask: number = 9223363240761753600

export const overflowMsg: string = "too many concurrent operations on a single file or socket (max 1048575)"

export function runtime_Semacquire(sema: $.VarRef<number> | null): void {
}

export function runtime_Semrelease(sema: $.VarRef<number> | null): void {
}
