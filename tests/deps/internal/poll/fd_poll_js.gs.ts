// Generated file based on fd_poll_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_fd from "./fd.gs.ts"

import * as __goscript_fd_fsync_posix from "./fd_fsync_posix.gs.ts"

import * as __goscript_fd_mutex from "./fd_mutex.gs.ts"

import * as __goscript_fd_posix from "./fd_posix.gs.ts"

import * as __goscript_fd_unix from "./fd_unix.gs.ts"

import * as __goscript_fd_unixjs from "./fd_unixjs.gs.ts"
import "@goscript/syscall/index.js"
import "@goscript/time/index.js"
import "./fd.gs.ts"
import "./fd_fsync_posix.gs.ts"
import "./fd_mutex.gs.ts"
import "./fd_posix.gs.ts"
import "./fd_unix.gs.ts"
import "./fd_unixjs.gs.ts"

export class pollDesc {
	public get fd(): __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null {
		return this._fields.fd.value
	}
	public set fd(value: __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null) {
		this._fields.fd.value = value
	}

	public get closing(): boolean {
		return this._fields.closing.value
	}
	public set closing(value: boolean) {
		this._fields.closing.value = value
	}

	public _fields: {
		fd: $.VarRef<__goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null>
		closing: $.VarRef<boolean>
	}

	constructor(init?: Partial<{fd?: __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null, closing?: boolean}>) {
		this._fields = {
			fd: $.varRef(init?.fd ?? (null as __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null)),
			closing: $.varRef(init?.closing ?? (false as boolean))
		}
	}

	public clone(): pollDesc {
		const cloned = new pollDesc()
		cloned._fields = {
			fd: $.varRef(this._fields.fd.value),
			closing: $.varRef(this._fields.closing.value)
		}
		return $.markAsStructValue(cloned)
	}

	public close(): void {
		const pd: pollDesc | $.VarRef<pollDesc> | null = this
	}

	public evict(): void {
		let pd: pollDesc | $.VarRef<pollDesc> | null = this
		$.pointerValue<pollDesc>(pd).closing = true
		if ($.pointerValue<pollDesc>(pd).fd != null) {
			syscall.StopIO($.pointerValue<__goscript_fd_unix.FD>($.pointerValue<pollDesc>(pd).fd).Sysfd)
		}
	}

	public init(fd: __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null): $.GoError {
		let pd: pollDesc | $.VarRef<pollDesc> | null = this
		$.pointerValue<pollDesc>(pd).fd = fd
		return null
	}

	public pollable(): boolean {
		const pd: pollDesc | $.VarRef<pollDesc> | null = this
		return true
	}

	public prepare(mode: number, isFile: boolean): $.GoError {
		const pd: pollDesc | $.VarRef<pollDesc> | null = this
		if ($.pointerValue<pollDesc>(pd).closing) {
			return __goscript_fd.errClosing(isFile)
		}
		return null
	}

	public prepareRead(isFile: boolean): $.GoError {
		const pd: pollDesc | $.VarRef<pollDesc> | null = this
		return pollDesc.prototype.prepare.call(pd, 114, isFile)
	}

	public prepareWrite(isFile: boolean): $.GoError {
		const pd: pollDesc | $.VarRef<pollDesc> | null = this
		return pollDesc.prototype.prepare.call(pd, 119, isFile)
	}

	public wait(mode: number, isFile: boolean): $.GoError {
		const pd: pollDesc | $.VarRef<pollDesc> | null = this
		if ($.pointerValue<pollDesc>(pd).closing) {
			return __goscript_fd.errClosing(isFile)
		}
		if (isFile) {
			return null
		}
		return __goscript_fd.ErrDeadlineExceeded
	}

	public waitCanceled(mode: number): void {
		const pd: pollDesc | $.VarRef<pollDesc> | null = this
	}

	public waitRead(isFile: boolean): $.GoError {
		const pd: pollDesc | $.VarRef<pollDesc> | null = this
		return pollDesc.prototype.wait.call(pd, 114, isFile)
	}

	public waitWrite(isFile: boolean): $.GoError {
		const pd: pollDesc | $.VarRef<pollDesc> | null = this
		return pollDesc.prototype.wait.call(pd, 119, isFile)
	}

	static __typeInfo = $.registerStructType(
		"poll.pollDesc",
		() => new pollDesc(),
		[{ name: "close", args: [], returns: [] }, { name: "evict", args: [], returns: [] }, { name: "init", args: [{ name: "fd", type: { kind: $.TypeKind.Pointer, elemType: "poll.FD" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "pollable", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "prepare", args: [{ name: "mode", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "isFile", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "prepareRead", args: [{ name: "isFile", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "prepareWrite", args: [{ name: "isFile", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "wait", args: [{ name: "mode", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "isFile", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "waitCanceled", args: [{ name: "mode", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "waitRead", args: [{ name: "isFile", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "waitWrite", args: [{ name: "isFile", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }],
		pollDesc,
		[{ name: "fd", key: "fd", type: { kind: $.TypeKind.Pointer, elemType: "poll.FD" }, pkgPath: "internal/poll", index: [0], offset: 0, exported: false }, { name: "closing", key: "closing", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "internal/poll", index: [1], offset: 8, exported: false }]
	)
}

export async function setDeadlineImpl(fd: __goscript_fd_unix.FD | $.VarRef<__goscript_fd_unix.FD> | null, t: time.Time, mode: number): globalThis.Promise<$.GoError> {
	let d = $.markAsStructValue($.cloneStructValue(t)).UnixNano()
	if ($.markAsStructValue($.cloneStructValue(t)).IsZero()) {
		d = 0n
	}
	{
		let err = __goscript_fd_unix.FD.prototype.incref.call(fd)
		if (err != null) {
			return err
		}
	}
	switch (mode) {
		case 114:
		{
			syscall.SetReadDeadline($.pointerValue<__goscript_fd_unix.FD>(fd).Sysfd, d)
			break
		}
		case 119:
		{
			syscall.SetWriteDeadline($.pointerValue<__goscript_fd_unix.FD>(fd).Sysfd, d)
			break
		}
		case 114 + 119:
		{
			syscall.SetReadDeadline($.pointerValue<__goscript_fd_unix.FD>(fd).Sysfd, d)
			syscall.SetWriteDeadline($.pointerValue<__goscript_fd_unix.FD>(fd).Sysfd, d)
			break
		}
	}
	await __goscript_fd_unix.FD.prototype.decref.call(fd)
	return null
}

export function IsPollDescriptor(fd: number): boolean {
	return false
}
