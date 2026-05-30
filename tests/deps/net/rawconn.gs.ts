// Generated file based on rawconn.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as syscall from "@goscript/syscall/index.js"

import type * as os from "@goscript/os/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"
import "@goscript/internal/poll/index.js"
import "@goscript/runtime/index.js"
import "@goscript/syscall/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sockaddr_posix.gs.ts"

export class rawConn {
	public get fd(): __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null {
		return this._fields.fd.value
	}
	public set fd(value: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null) {
		this._fields.fd.value = value
	}

	public _fields: {
		fd: $.VarRef<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>
	}

	constructor(init?: Partial<{fd?: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null}>) {
		this._fields = {
			fd: $.varRef(init?.fd ?? null)
		}
	}

	public clone(): rawConn {
		const cloned = new rawConn()
		cloned._fields = {
			fd: $.varRef(this._fields.fd.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Control(f: ((_p0: number) => void) | null): globalThis.Promise<$.GoError> {
		const c: rawConn | $.VarRef<rawConn> | null = this
		if (!rawConn.prototype.ok.call(c)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		let err = await $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).pfd.RawControl(f)
		runtime.KeepAlive($.interfaceValue<any>($.pointerValue<rawConn>(c).fd, "*net.netFD"))
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "raw-control", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).laddr, Err: err}), "*net.OpError")
		}
		return err
	}

	public Network(): poll.String {
		const c: rawConn | $.VarRef<rawConn> | null = this
		return $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).net
	}

	public PollFD(): poll.FD | $.VarRef<poll.FD> | null {
		const c: rawConn | $.VarRef<rawConn> | null = this
		if (!rawConn.prototype.ok.call(c)) {
			return null
		}
		return $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd)._fields.pfd
	}

	public async Read(f: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<$.GoError> {
		const c: rawConn | $.VarRef<rawConn> | null = this
		if (!rawConn.prototype.ok.call(c)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		let err = await $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).pfd.RawRead(f)
		runtime.KeepAlive($.interfaceValue<any>($.pointerValue<rawConn>(c).fd, "*net.netFD"))
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "raw-read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).raddr, Err: err}), "*net.OpError")
		}
		return err
	}

	public async Write(f: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<$.GoError> {
		const c: rawConn | $.VarRef<rawConn> | null = this
		if (!rawConn.prototype.ok.call(c)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		let err = await $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).pfd.RawWrite(f)
		runtime.KeepAlive($.interfaceValue<any>($.pointerValue<rawConn>(c).fd, "*net.netFD"))
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "raw-write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<rawConn>(c).fd).raddr, Err: err}), "*net.OpError")
		}
		return err
	}

	public ok(): boolean {
		const c: rawConn | $.VarRef<rawConn> | null = this
		return (c != null) && ($.pointerValue<rawConn>(c).fd != null)
	}

	static __typeInfo = $.registerStructType(
		"net.rawConn",
		() => new rawConn(),
		[{ name: "Control", args: [{ name: "f", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uintptr" }], results: [] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: "error" }] }, { name: "Network", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string", typeName: "poll.String" } }] }, { name: "PollFD", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "poll.FD" } }] }, { name: "Read", args: [{ name: "f", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uintptr" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "f", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uintptr" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: "error" }] }, { name: "ok", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		rawConn,
		[{ name: "fd", key: "fd", type: { kind: $.TypeKind.Pointer, elemType: "net.netFD" }, pkgPath: "net", index: [0], offset: 0, exported: false }]
	)
}

export class rawListener {
	public get rawConn(): rawConn {
		return this._fields.rawConn.value
	}
	public set rawConn(value: rawConn) {
		this._fields.rawConn.value = value
	}

	public _fields: {
		rawConn: $.VarRef<rawConn>
	}

	constructor(init?: Partial<{rawConn?: rawConn}>) {
		this._fields = {
			rawConn: $.varRef(init?.rawConn ? $.markAsStructValue($.cloneStructValue(init.rawConn)) : $.markAsStructValue(new rawConn()))
		}
	}

	public clone(): rawListener {
		const cloned = new rawListener()
		cloned._fields = {
			rawConn: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.rawConn.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Read(_p0: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): $.GoError {
		const l: rawListener | $.VarRef<rawListener> | null = this
		return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
	}

	public Write(_p0: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): $.GoError {
		const l: rawListener | $.VarRef<rawListener> | null = this
		return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
	}

	public async Control(f: any): globalThis.Promise<any> {
		return await $.pointerValue<rawConn>(this.rawConn).Control(f)
	}

	public Network(): any {
		return $.pointerValue<rawConn>(this.rawConn).Network()
	}

	public PollFD(): any {
		return $.pointerValue<rawConn>(this.rawConn).PollFD()
	}

	public ok(): any {
		return $.pointerValue<rawConn>(this.rawConn).ok()
	}

	static __typeInfo = $.registerStructType(
		"net.rawListener",
		() => new rawListener(),
		[{ name: "Read", args: [{ name: "_p0", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uintptr" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "_p0", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uintptr" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: "error" }] }, { name: "Control", args: [{ name: "f", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uintptr" }], results: [] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: "error" }] }, { name: "Network", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string", typeName: "poll.String" } }] }, { name: "PollFD", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "poll.FD" } }] }, { name: "ok", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		rawListener,
		[{ name: "rawConn", key: "rawConn", type: "net.rawConn", pkgPath: "net", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export function newRawConn(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null): rawConn | $.VarRef<rawConn> | null {
	return new rawConn({fd: fd})
}

export function newRawListener(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null): rawListener | $.VarRef<rawListener> | null {
	return new rawListener({rawConn: $.markAsStructValue(new rawConn({fd: fd}))})
}
