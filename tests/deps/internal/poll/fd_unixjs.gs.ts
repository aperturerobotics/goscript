// Generated file based on fd_unixjs.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as sync from "@goscript/sync/index.js"

import type * as time from "@goscript/time/index.js"

import * as __goscript_fd_fsync_posix from "./fd_fsync_posix.gs.ts"

import * as __goscript_fd_mutex from "./fd_mutex.gs.ts"

import * as __goscript_fd_poll_js from "./fd_poll_js.gs.ts"

import * as __goscript_fd_posix from "./fd_posix.gs.ts"

import * as __goscript_fd_unix from "./fd_unix.gs.ts"

import * as __goscript_hook_unix from "./hook_unix.gs.ts"
import "@goscript/syscall/index.js"
import "@goscript/sync/index.js"
import "./fd_fsync_posix.gs.ts"
import "./fd_mutex.gs.ts"
import "./fd_poll_js.gs.ts"
import "./fd_posix.gs.ts"
import "./fd_unix.gs.ts"
import "./hook_unix.gs.ts"

export class SysFile {
	// Writev cache.
	public get iovecs(): $.VarRef<$.Slice<syscall.Iovec>> | null {
		return this._fields.iovecs.value
	}
	public set iovecs(value: $.VarRef<$.Slice<syscall.Iovec>> | null) {
		this._fields.iovecs.value = value
	}

	public _fields: {
		iovecs: $.VarRef<$.VarRef<$.Slice<syscall.Iovec>> | null>
	}

	constructor(init?: Partial<{iovecs?: $.VarRef<$.Slice<syscall.Iovec>> | null}>) {
		this._fields = {
			iovecs: $.varRef(init?.iovecs ?? null)
		}
	}

	public clone(): SysFile {
		const cloned = new SysFile()
		cloned._fields = {
			iovecs: $.varRef(this._fields.iovecs.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async destroy(fd: number): globalThis.Promise<$.GoError> {
		const s: SysFile | $.VarRef<SysFile> | null = this
		// We don't use ignoringEINTR here because POSIX does not define
		// whether the descriptor is closed if close returns EINTR.
		// If the descriptor is indeed closed, using a loop would race
		// with some other goroutine opening a new descriptor.
		// (The Linux kernel guarantees that it is closed on an EINTR error.)
		return await __goscript_hook_unix.CloseFunc!(fd)
	}

	public init(): void {
		const s: SysFile | $.VarRef<SysFile> | null = this
	}

	static __typeInfo = $.registerStructType(
		"poll.SysFile",
		() => new SysFile(),
		[{ name: "destroy", args: [], returns: [] }, { name: "init", args: [], returns: [] }],
		SysFile,
		{"iovecs": { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: "syscall.Iovec" } }}
	)
}

export async function dupCloseOnExecOld(fd: number): globalThis.Promise<[number, string, $.GoError]> {
	using __defer = new $.DisposableStack()
	await $.pointerValue<sync.RWMutex>($.pointerValue<sync.RWMutex>(syscall.ForkLock)).RLock()
	__defer.defer(() => { $.pointerValue<sync.RWMutex>($.pointerValue<sync.RWMutex>(syscall.ForkLock)).RUnlock() })
	let [newfd, err] = syscall.Dup(fd)
	if (err != null) {
		return [-1, "dup", err]
	}
	syscall.CloseOnExec(newfd)
	return [newfd, "", null]
}
