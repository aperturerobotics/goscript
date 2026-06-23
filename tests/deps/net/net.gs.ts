// Generated file based on net.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/errors/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as __goscript_error_unix from "./error_unix.gs.ts"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_rlimit_js from "./rlimit_js.gs.ts"

import * as __goscript_sock_stub from "./sock_stub.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_sockopt_fake from "./sockopt_fake.gs.ts"

import * as __goscript_tcpsock from "./tcpsock.gs.ts"

import * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"

import * as __goscript_tcpsock_unix from "./tcpsock_unix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/io/index.js"
import "@goscript/os/index.js"
import "@goscript/sync/index.js"
import "@goscript/syscall/index.js"
import "@goscript/time/index.js"
import "@goscript/sync/atomic/index.js"
import "./error_unix.gs.ts"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./net_fake.gs.ts"
import "./rlimit_js.gs.ts"
import "./sock_stub.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./sockopt_fake.gs.ts"
import "./tcpsock.gs.ts"
import "./tcpsock_posix.gs.ts"
import "./tcpsock_unix.gs.ts"

export type Addr = {
	Network(): string
	String(): string | globalThis.Promise<string>
}

$.registerInterfaceType(
	"net.Addr",
	null,
	[{ name: "Network", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export type Conn = {
	Close(): $.GoError | globalThis.Promise<$.GoError>
	LocalAddr(): Addr | null | globalThis.Promise<Addr | null>
	Read(b: $.Slice<number>): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
	RemoteAddr(): Addr | null | globalThis.Promise<Addr | null>
	SetDeadline(t: time.Time): $.GoError | globalThis.Promise<$.GoError>
	SetReadDeadline(t: time.Time): $.GoError | globalThis.Promise<$.GoError>
	SetWriteDeadline(t: time.Time): $.GoError | globalThis.Promise<$.GoError>
	Write(b: $.Slice<number>): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
}

$.registerInterfaceType(
	"net.Conn",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }]
);

export type PacketConn = {
	Close(): $.GoError | globalThis.Promise<$.GoError>
	LocalAddr(): Addr | null
	ReadFrom(p: $.Slice<number>): [number, Addr | null, $.GoError] | globalThis.Promise<[number, Addr | null, $.GoError]>
	SetDeadline(t: time.Time): $.GoError | globalThis.Promise<$.GoError>
	SetReadDeadline(t: time.Time): $.GoError | globalThis.Promise<$.GoError>
	SetWriteDeadline(t: time.Time): $.GoError | globalThis.Promise<$.GoError>
	WriteTo(p: $.Slice<number>, addr: Addr | null): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
}

$.registerInterfaceType(
	"net.PacketConn",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "ReadFrom", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "addr", type: "net.Addr" }, { name: "err", type: "error" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteTo", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: "net.Addr" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }]
);

export type Listener = {
	Accept(): [Conn | null, $.GoError] | globalThis.Promise<[Conn | null, $.GoError]>
	Addr(): Addr | null | globalThis.Promise<Addr | null>
	Close(): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"net.Listener",
	null,
	[{ name: "Accept", args: [], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "Addr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }]
);

export type Error = {
	Error(): string
	Temporary(): boolean | globalThis.Promise<boolean>
	Timeout(): boolean | globalThis.Promise<boolean>
}

$.registerInterfaceType(
	"net.Error",
	null,
	[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
);

export type UnknownNetworkError = string

export type InvalidAddrError = string

export type Buffers = $.Slice<$.Slice<number>>

export class conn {
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
			fd: $.varRef(init?.fd ?? (null as unknown as __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null))
		}
	}

	public clone(): conn {
		const cloned = new conn()
		cloned._fields = {
			fd: $.varRef(this._fields.fd.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		let err = await __goscript_fd_fake.netFD.prototype.Close.call($.pointerValue<conn>(c).fd)
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new OpError({Op: "close", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).raddr, Err: err}), "*net.OpError")
		}
		return err
	}

	public File(): [os.File | $.VarRef<os.File> | null, $.GoError] {
		const c: conn | $.VarRef<conn> | null = this
		let f: os.File | $.VarRef<os.File> | null = null as os.File | $.VarRef<os.File> | null
		let err: $.GoError = null as $.GoError
		let __goscriptTuple0: any = $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).fakeNetFD).dup()
		f = __goscriptTuple0[0]
		err = __goscriptTuple0[1]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new OpError({Op: "file", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).raddr, Err: err}), "*net.OpError")
		}
		return [f, err]
	}

	public LocalAddr(): Addr | null {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return null
		}
		return $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let [n, err] = await __goscript_fd_fake.netFD.prototype.Read.call($.pointerValue<conn>(c).fd, b)
		if ((err != null) && (!$.comparableEqual(err, io.EOF))) {
			err = $.interfaceValue<$.GoError>(new OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).raddr, Err: err}), "*net.OpError")
		}
		return [n, err]
	}

	public RemoteAddr(): Addr | null {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return null
		}
		return $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).raddr
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await __goscript_fd_fake.netFD.prototype.SetDeadline.call($.pointerValue<conn>(c).fd, $.markAsStructValue($.cloneStructValue(t)))
			if (err != null) {
				return $.interfaceValue<$.GoError>(new OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public async SetReadBuffer(bytes: number): globalThis.Promise<$.GoError> {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await __goscript_sockopt_fake.setReadBuffer($.pointerValue<conn>(c).fd, bytes)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public async SetReadDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await __goscript_fd_fake.netFD.prototype.SetReadDeadline.call($.pointerValue<conn>(c).fd, $.markAsStructValue($.cloneStructValue(t)))
			if (err != null) {
				return $.interfaceValue<$.GoError>(new OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public SetWriteBuffer(bytes: number): $.GoError {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = __goscript_sockopt_fake.setWriteBuffer($.pointerValue<conn>(c).fd, bytes)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public async SetWriteDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await __goscript_fd_fake.netFD.prototype.SetWriteDeadline.call($.pointerValue<conn>(c).fd, $.markAsStructValue($.cloneStructValue(t)))
			if (err != null) {
				return $.interfaceValue<$.GoError>(new OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public async Write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const c: conn | $.VarRef<conn> | null = this
		if (!conn.prototype.ok.call(c)) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let [n, err] = await __goscript_fd_fake.netFD.prototype.Write.call($.pointerValue<conn>(c).fd, b)
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<conn>(c).fd).raddr, Err: err}), "*net.OpError")
		}
		return [n, err]
	}

	public ok(): boolean {
		const c: conn | $.VarRef<conn> | null = this
		return (c != null) && ($.pointerValue<conn>(c).fd != null)
	}

	static __typeInfo = $.registerStructType(
		"net.conn",
		() => new conn(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "File", args: [], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "err", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "ok", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		conn,
		[{ name: "fd", key: "fd", type: { kind: $.TypeKind.Pointer, elemType: "net.netFD" }, pkgPath: "net", index: [0], offset: 0, exported: false }]
	)
}

export class canceledError {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): canceledError {
		const cloned = new canceledError()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		return "operation was canceled"
	}

	public Is(err: $.GoError): boolean {
		return $.comparableEqual(err, context.Canceled)
	}

	static __typeInfo = $.registerStructType(
		"net.canceledError",
		() => new canceledError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Is", args: [{ name: "err", type: "error" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		canceledError,
		[]
	)
}

export class OpError {
	// Op is the operation which caused the error, such as
	// "read" or "write".
	public get Op(): string {
		return this._fields.Op.value
	}
	public set Op(value: string) {
		this._fields.Op.value = value
	}

	// Net is the network type on which this error occurred,
	// such as "tcp" or "udp6".
	public get Net(): string {
		return this._fields.Net.value
	}
	public set Net(value: string) {
		this._fields.Net.value = value
	}

	// For operations involving a remote network connection, like
	// Dial, Read, or Write, Source is the corresponding local
	// network address.
	public get Source(): Addr | null {
		return this._fields.Source.value
	}
	public set Source(value: Addr | null) {
		this._fields.Source.value = value
	}

	// Addr is the network address for which this error occurred.
	// For local operations, like Listen or SetDeadline, Addr is
	// the address of the local endpoint being manipulated.
	// For operations involving a remote network connection, like
	// Dial, Read, or Write, Addr is the remote address of that
	// connection.
	public get Addr(): Addr | null {
		return this._fields.Addr.value
	}
	public set Addr(value: Addr | null) {
		this._fields.Addr.value = value
	}

	// Err is the error that occurred during the operation.
	// The Error method panics if the error is nil.
	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public _fields: {
		Op: $.VarRef<string>
		Net: $.VarRef<string>
		Source: $.VarRef<Addr | null>
		Addr: $.VarRef<Addr | null>
		Err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{Op?: string, Net?: string, Source?: Addr | null, Addr?: Addr | null, Err?: $.GoError}>) {
		this._fields = {
			Op: $.varRef(init?.Op ?? ("" as unknown as string)),
			Net: $.varRef(init?.Net ?? ("" as unknown as string)),
			Source: $.varRef(init?.Source ?? (null as unknown as Addr | null)),
			Addr: $.varRef(init?.Addr ?? (null as unknown as Addr | null)),
			Err: $.varRef(init?.Err ?? (null as unknown as $.GoError))
		}
	}

	public clone(): OpError {
		const cloned = new OpError()
		cloned._fields = {
			Op: $.varRef(this._fields.Op.value),
			Net: $.varRef(this._fields.Net.value),
			Source: $.varRef(this._fields.Source.value),
			Addr: $.varRef(this._fields.Addr.value),
			Err: $.varRef(this._fields.Err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const e: OpError | $.VarRef<OpError> | null = this
		if (e == null) {
			return "<nil>"
		}
		let s = $.pointerValue<OpError>(e).Op
		if (!$.stringEqual($.pointerValue<OpError>(e).Net, "")) {
			s = s + (" " + $.pointerValue<OpError>(e).Net)
		}
		if ($.pointerValue<OpError>(e).Source != null) {
			s = s + (" " + await $.pointerValue<Exclude<Addr, null>>($.pointerValue<OpError>(e).Source).String())
		}
		if ($.pointerValue<OpError>(e).Addr != null) {
			if ($.pointerValue<OpError>(e).Source != null) {
				s = s + ("->")
			} else {
				s = s + (" ")
			}
			s = s + (await $.pointerValue<Exclude<Addr, null>>($.pointerValue<OpError>(e).Addr).String())
		}
		s = s + (": " + $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<OpError>(e).Err).Error())
		return s
	}

	public async Temporary(): globalThis.Promise<boolean> {
		const e: OpError | $.VarRef<OpError> | null = this
		// Treat ECONNRESET and ECONNABORTED as temporary errors when
		// they come from calling accept. See issue 6163.
		if (($.stringEqual($.pointerValue<OpError>(e).Op, "accept")) && __goscript_error_unix.isConnError($.pointerValue<OpError>(e).Err)) {
			return true
		}

		{
			let __goscriptTuple1: any = $.typeAssertTuple<os.SyscallError | $.VarRef<os.SyscallError> | null>($.pointerValue<OpError>(e).Err, { kind: $.TypeKind.Pointer, elemType: "os.SyscallError" })
			let ne: os.SyscallError | $.VarRef<os.SyscallError> | null = __goscriptTuple1[0]
			let ok = __goscriptTuple1[1]
			if (ok) {
				let [t, __goscriptShadow0] = $.typeAssertTuple<temporary | null>($.pointerValue<os.SyscallError>(ne).Err, "net.temporary")
				return __goscriptShadow0 && await $.pointerValue<Exclude<temporary, null>>(t).Temporary()
			}
		}
		let [t, ok] = $.typeAssertTuple<temporary | null>($.pointerValue<OpError>(e).Err, "net.temporary")
		return ok && await $.pointerValue<Exclude<temporary, null>>(t).Temporary()
	}

	public async Timeout(): globalThis.Promise<boolean> {
		const e: OpError | $.VarRef<OpError> | null = this
		{
			let __goscriptTuple2: any = $.typeAssertTuple<os.SyscallError | $.VarRef<os.SyscallError> | null>($.pointerValue<OpError>(e).Err, { kind: $.TypeKind.Pointer, elemType: "os.SyscallError" })
			let ne: os.SyscallError | $.VarRef<os.SyscallError> | null = __goscriptTuple2[0]
			let ok = __goscriptTuple2[1]
			if (ok) {
				let [t, __goscriptShadow1] = $.typeAssertTuple<timeout | null>($.pointerValue<os.SyscallError>(ne).Err, "net.timeout")
				return __goscriptShadow1 && await $.pointerValue<Exclude<timeout, null>>(t).Timeout()
			}
		}
		let [t, ok] = $.typeAssertTuple<timeout | null>($.pointerValue<OpError>(e).Err, "net.timeout")
		return ok && await $.pointerValue<Exclude<timeout, null>>(t).Timeout()
	}

	public Unwrap(): $.GoError {
		const e: OpError | $.VarRef<OpError> | null = this
		return $.pointerValue<OpError>(e).Err
	}

	static __typeInfo = $.registerStructType(
		"net.OpError",
		() => new OpError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unwrap", args: [], returns: [{ name: "_r0", type: "error" }] }],
		OpError,
		[{ name: "Op", key: "Op", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Net", key: "Net", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 16, exported: true }, { name: "Source", key: "Source", type: "net.Addr", index: [2], offset: 32, exported: true }, { name: "Addr", key: "Addr", type: "net.Addr", index: [3], offset: 48, exported: true }, { name: "Err", key: "Err", type: "error", index: [4], offset: 64, exported: true }]
	)
}

export class ParseError {
	// Type is the type of string that was expected, such as
	// "IP address", "CIDR address".
	public get Type(): string {
		return this._fields.Type.value
	}
	public set Type(value: string) {
		this._fields.Type.value = value
	}

	// Text is the malformed text string.
	public get Text(): string {
		return this._fields.Text.value
	}
	public set Text(value: string) {
		this._fields.Text.value = value
	}

	public _fields: {
		Type: $.VarRef<string>
		Text: $.VarRef<string>
	}

	constructor(init?: Partial<{Type?: string, Text?: string}>) {
		this._fields = {
			Type: $.varRef(init?.Type ?? ("" as unknown as string)),
			Text: $.varRef(init?.Text ?? ("" as unknown as string))
		}
	}

	public clone(): ParseError {
		const cloned = new ParseError()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value),
			Text: $.varRef(this._fields.Text.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: ParseError | $.VarRef<ParseError> | null = this
		return (("invalid " + $.pointerValue<ParseError>(e).Type) + ": ") + $.pointerValue<ParseError>(e).Text
	}

	public Temporary(): boolean {
		const e: ParseError | $.VarRef<ParseError> | null = this
		return false
	}

	public Timeout(): boolean {
		const e: ParseError | $.VarRef<ParseError> | null = this
		return false
	}

	static __typeInfo = $.registerStructType(
		"net.ParseError",
		() => new ParseError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		ParseError,
		[{ name: "Type", key: "Type", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Text", key: "Text", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 16, exported: true }]
	)
}

export class AddrError {
	public get Err(): string {
		return this._fields.Err.value
	}
	public set Err(value: string) {
		this._fields.Err.value = value
	}

	public get Addr(): string {
		return this._fields.Addr.value
	}
	public set Addr(value: string) {
		this._fields.Addr.value = value
	}

	public _fields: {
		Err: $.VarRef<string>
		Addr: $.VarRef<string>
	}

	constructor(init?: Partial<{Err?: string, Addr?: string}>) {
		this._fields = {
			Err: $.varRef(init?.Err ?? ("" as unknown as string)),
			Addr: $.varRef(init?.Addr ?? ("" as unknown as string))
		}
	}

	public clone(): AddrError {
		const cloned = new AddrError()
		cloned._fields = {
			Err: $.varRef(this._fields.Err.value),
			Addr: $.varRef(this._fields.Addr.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: AddrError | $.VarRef<AddrError> | null = this
		if (e == null) {
			return "<nil>"
		}
		let s = $.pointerValue<AddrError>(e).Err
		if (!$.stringEqual($.pointerValue<AddrError>(e).Addr, "")) {
			s = (("address " + $.pointerValue<AddrError>(e).Addr) + ": ") + s
		}
		return s
	}

	public Temporary(): boolean {
		const e: AddrError | $.VarRef<AddrError> | null = this
		return false
	}

	public Timeout(): boolean {
		const e: AddrError | $.VarRef<AddrError> | null = this
		return false
	}

	static __typeInfo = $.registerStructType(
		"net.AddrError",
		() => new AddrError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		AddrError,
		[{ name: "Err", key: "Err", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Addr", key: "Addr", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 16, exported: true }]
	)
}

export class timeoutError {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): timeoutError {
		const cloned = new timeoutError()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: timeoutError | $.VarRef<timeoutError> | null = this
		return "i/o timeout"
	}

	public Is(err: $.GoError): boolean {
		const e: timeoutError | $.VarRef<timeoutError> | null = this
		return $.comparableEqual(err, context.DeadlineExceeded)
	}

	public Temporary(): boolean {
		const e: timeoutError | $.VarRef<timeoutError> | null = this
		return true
	}

	public Timeout(): boolean {
		const e: timeoutError | $.VarRef<timeoutError> | null = this
		return true
	}

	static __typeInfo = $.registerStructType(
		"net.timeoutError",
		() => new timeoutError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Is", args: [{ name: "err", type: "error" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		timeoutError,
		[]
	)
}

export class DNSConfigError {
	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public _fields: {
		Err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{Err?: $.GoError}>) {
		this._fields = {
			Err: $.varRef(init?.Err ?? (null as unknown as $.GoError))
		}
	}

	public clone(): DNSConfigError {
		const cloned = new DNSConfigError()
		cloned._fields = {
			Err: $.varRef(this._fields.Err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: DNSConfigError | $.VarRef<DNSConfigError> | null = this
		return "error reading DNS config: " + $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<DNSConfigError>(e).Err).Error()
	}

	public Temporary(): boolean {
		const e: DNSConfigError | $.VarRef<DNSConfigError> | null = this
		return false
	}

	public Timeout(): boolean {
		const e: DNSConfigError | $.VarRef<DNSConfigError> | null = this
		return false
	}

	public Unwrap(): $.GoError {
		const e: DNSConfigError | $.VarRef<DNSConfigError> | null = this
		return $.pointerValue<DNSConfigError>(e).Err
	}

	static __typeInfo = $.registerStructType(
		"net.DNSConfigError",
		() => new DNSConfigError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unwrap", args: [], returns: [{ name: "_r0", type: "error" }] }],
		DNSConfigError,
		[{ name: "Err", key: "Err", type: "error", index: [0], offset: 0, exported: true }]
	)
}

export class notFoundError {
	public get s(): string {
		return this._fields.s.value
	}
	public set s(value: string) {
		this._fields.s.value = value
	}

	public _fields: {
		s: $.VarRef<string>
	}

	constructor(init?: Partial<{s?: string}>) {
		this._fields = {
			s: $.varRef(init?.s ?? ("" as unknown as string))
		}
	}

	public clone(): notFoundError {
		const cloned = new notFoundError()
		cloned._fields = {
			s: $.varRef(this._fields.s.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: notFoundError | $.VarRef<notFoundError> | null = this
		return $.pointerValue<notFoundError>(e).s
	}

	static __typeInfo = $.registerStructType(
		"net.notFoundError",
		() => new notFoundError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		notFoundError,
		[{ name: "s", key: "s", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [0], offset: 0, exported: false }]
	)
}

export class temporaryError {
	public get s(): string {
		return this._fields.s.value
	}
	public set s(value: string) {
		this._fields.s.value = value
	}

	public _fields: {
		s: $.VarRef<string>
	}

	constructor(init?: Partial<{s?: string}>) {
		this._fields = {
			s: $.varRef(init?.s ?? ("" as unknown as string))
		}
	}

	public clone(): temporaryError {
		const cloned = new temporaryError()
		cloned._fields = {
			s: $.varRef(this._fields.s.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: temporaryError | $.VarRef<temporaryError> | null = this
		return $.pointerValue<temporaryError>(e).s
	}

	public Temporary(): boolean {
		const e: temporaryError | $.VarRef<temporaryError> | null = this
		return true
	}

	public Timeout(): boolean {
		const e: temporaryError | $.VarRef<temporaryError> | null = this
		return false
	}

	static __typeInfo = $.registerStructType(
		"net.temporaryError",
		() => new temporaryError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		temporaryError,
		[{ name: "s", key: "s", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [0], offset: 0, exported: false }]
	)
}

export class DNSError {
	public get UnwrapErr(): $.GoError {
		return this._fields.UnwrapErr.value
	}
	public set UnwrapErr(value: $.GoError) {
		this._fields.UnwrapErr.value = value
	}

	public get Err(): string {
		return this._fields.Err.value
	}
	public set Err(value: string) {
		this._fields.Err.value = value
	}

	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Server(): string {
		return this._fields.Server.value
	}
	public set Server(value: string) {
		this._fields.Server.value = value
	}

	public get IsTimeout(): boolean {
		return this._fields.IsTimeout.value
	}
	public set IsTimeout(value: boolean) {
		this._fields.IsTimeout.value = value
	}

	public get IsTemporary(): boolean {
		return this._fields.IsTemporary.value
	}
	public set IsTemporary(value: boolean) {
		this._fields.IsTemporary.value = value
	}

	// IsNotFound is set to true when the requested name does not
	// contain any records of the requested type (data not found),
	// or the name itself was not found (NXDOMAIN).
	public get IsNotFound(): boolean {
		return this._fields.IsNotFound.value
	}
	public set IsNotFound(value: boolean) {
		this._fields.IsNotFound.value = value
	}

	public _fields: {
		UnwrapErr: $.VarRef<$.GoError>
		Err: $.VarRef<string>
		Name: $.VarRef<string>
		Server: $.VarRef<string>
		IsTimeout: $.VarRef<boolean>
		IsTemporary: $.VarRef<boolean>
		IsNotFound: $.VarRef<boolean>
	}

	constructor(init?: Partial<{UnwrapErr?: $.GoError, Err?: string, Name?: string, Server?: string, IsTimeout?: boolean, IsTemporary?: boolean, IsNotFound?: boolean}>) {
		this._fields = {
			UnwrapErr: $.varRef(init?.UnwrapErr ?? (null as unknown as $.GoError)),
			Err: $.varRef(init?.Err ?? ("" as unknown as string)),
			Name: $.varRef(init?.Name ?? ("" as unknown as string)),
			Server: $.varRef(init?.Server ?? ("" as unknown as string)),
			IsTimeout: $.varRef(init?.IsTimeout ?? (false as unknown as boolean)),
			IsTemporary: $.varRef(init?.IsTemporary ?? (false as unknown as boolean)),
			IsNotFound: $.varRef(init?.IsNotFound ?? (false as unknown as boolean))
		}
	}

	public clone(): DNSError {
		const cloned = new DNSError()
		cloned._fields = {
			UnwrapErr: $.varRef(this._fields.UnwrapErr.value),
			Err: $.varRef(this._fields.Err.value),
			Name: $.varRef(this._fields.Name.value),
			Server: $.varRef(this._fields.Server.value),
			IsTimeout: $.varRef(this._fields.IsTimeout.value),
			IsTemporary: $.varRef(this._fields.IsTemporary.value),
			IsNotFound: $.varRef(this._fields.IsNotFound.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: DNSError | $.VarRef<DNSError> | null = this
		if (e == null) {
			return "<nil>"
		}
		let s = "lookup " + $.pointerValue<DNSError>(e).Name
		if (!$.stringEqual($.pointerValue<DNSError>(e).Server, "")) {
			s = s + (" on " + $.pointerValue<DNSError>(e).Server)
		}
		s = s + (": " + $.pointerValue<DNSError>(e).Err)
		return s
	}

	public Temporary(): boolean {
		const e: DNSError | $.VarRef<DNSError> | null = this
		return $.pointerValue<DNSError>(e).IsTimeout || $.pointerValue<DNSError>(e).IsTemporary
	}

	public Timeout(): boolean {
		const e: DNSError | $.VarRef<DNSError> | null = this
		return $.pointerValue<DNSError>(e).IsTimeout
	}

	public Unwrap(): $.GoError {
		const e: DNSError | $.VarRef<DNSError> | null = this
		return $.pointerValue<DNSError>(e).UnwrapErr
	}

	static __typeInfo = $.registerStructType(
		"net.DNSError",
		() => new DNSError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unwrap", args: [], returns: [{ name: "_r0", type: "error" }] }],
		DNSError,
		[{ name: "UnwrapErr", key: "UnwrapErr", type: "error", index: [0], offset: 0, exported: true }, { name: "Err", key: "Err", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 16, exported: true }, { name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, index: [2], offset: 32, exported: true }, { name: "Server", key: "Server", type: { kind: $.TypeKind.Basic, name: "string" }, index: [3], offset: 48, exported: true }, { name: "IsTimeout", key: "IsTimeout", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [4], offset: 64, exported: true }, { name: "IsTemporary", key: "IsTemporary", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [5], offset: 65, exported: true }, { name: "IsNotFound", key: "IsNotFound", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [6], offset: 66, exported: true }]
	)
}

export class noReadFrom {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): noReadFrom {
		const cloned = new noReadFrom()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public ReadFrom(_p0: io.Reader | null): [bigint, $.GoError] {
		$.panic("can't happen")
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"net.noReadFrom",
		() => new noReadFrom(),
		[{ name: "ReadFrom", args: [{ name: "_p0", type: "io.Reader" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }],
		noReadFrom,
		[]
	)
}

export class tcpConnWithoutReadFrom {
	public get noReadFrom(): noReadFrom {
		return this._fields.noReadFrom.value
	}
	public set noReadFrom(value: noReadFrom) {
		this._fields.noReadFrom.value = value
	}

	public get TCPConn(): __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null {
		return this._fields.TCPConn.value
	}
	public set TCPConn(value: __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null) {
		this._fields.TCPConn.value = value
	}

	public _fields: {
		noReadFrom: $.VarRef<noReadFrom>
		TCPConn: $.VarRef<__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null>
	}

	constructor(init?: Partial<{noReadFrom?: noReadFrom, TCPConn?: __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null}>) {
		this._fields = {
			noReadFrom: $.varRef(init?.noReadFrom ? $.markAsStructValue($.cloneStructValue(init.noReadFrom)) : $.markAsStructValue(new noReadFrom())),
			TCPConn: $.varRef(init?.TCPConn ?? (null as unknown as __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null))
		}
	}

	public clone(): tcpConnWithoutReadFrom {
		const cloned = new tcpConnWithoutReadFrom()
		cloned._fields = {
			noReadFrom: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.noReadFrom.value))),
			TCPConn: $.varRef(this._fields.TCPConn.value)
		}
		return $.markAsStructValue(cloned)
	}

	public ReadFrom(_p0: any): any {
		return $.pointerValue<noReadFrom>(this.noReadFrom).ReadFrom(_p0)
	}

	public async Close(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.Close()
	}

	public async CloseRead(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).CloseRead()
	}

	public async CloseWrite(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).CloseWrite()
	}

	public File(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.File()
	}

	public LocalAddr(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.LocalAddr()
	}

	public MultipathTCP(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).MultipathTCP()
	}

	public async Read(b: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.Read(b)
	}

	public RemoteAddr(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.RemoteAddr()
	}

	public async SetDeadline(t: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetDeadline(t)
	}

	public SetKeepAlive(keepalive: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetKeepAlive(keepalive)
	}

	public SetKeepAliveConfig(config: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetKeepAliveConfig(config)
	}

	public SetKeepAlivePeriod(d: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetKeepAlivePeriod(d)
	}

	public async SetLinger(sec: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetLinger(sec)
	}

	public SetNoDelay(noDelay: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetNoDelay(noDelay)
	}

	public async SetReadBuffer(bytes: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetReadBuffer(bytes)
	}

	public async SetReadDeadline(t: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetReadDeadline(t)
	}

	public SetWriteBuffer(bytes: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetWriteBuffer(bytes)
	}

	public async SetWriteDeadline(t: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetWriteDeadline(t)
	}

	public SyscallConn(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SyscallConn()
	}

	public async Write(b: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.Write(b)
	}

	public async WriteTo(w: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).WriteTo(w)
	}

	public ok(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.ok()
	}

	public async readFrom(r: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).readFrom(r)
	}

	public async writeTo(w: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).writeTo(w)
	}

	static __typeInfo = $.registerStructType(
		"net.tcpConnWithoutReadFrom",
		() => new tcpConnWithoutReadFrom(),
		[{ name: "ReadFrom", args: [{ name: "_p0", type: "io.Reader" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseRead", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "File", args: [], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "err", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "MultipathTCP", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: "error" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetKeepAlive", args: [{ name: "keepalive", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetKeepAliveConfig", args: [{ name: "config", type: "net.KeepAliveConfig" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetKeepAlivePeriod", args: [{ name: "d", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetLinger", args: [{ name: "sec", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetNoDelay", args: [{ name: "noDelay", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SyscallConn", args: [], returns: [{ name: "_r0", type: "syscall.RawConn" }, { name: "_r1", type: "error" }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "WriteTo", args: [{ name: "w", type: "io.Writer" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }, { name: "ok", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "readFrom", args: [{ name: "r", type: "io.Reader" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }, { name: "writeTo", args: [{ name: "w", type: "io.Writer" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }],
		tcpConnWithoutReadFrom,
		[{ name: "noReadFrom", key: "noReadFrom", type: "net.noReadFrom", pkgPath: "net", anonymous: true, index: [0], offset: 0, exported: false }, { name: "TCPConn", key: "TCPConn", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPConn" }, anonymous: true, index: [1], offset: 0, exported: true }]
	)
}

export class noWriteTo {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): noWriteTo {
		const cloned = new noWriteTo()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public WriteTo(_p0: io.Writer | null): [bigint, $.GoError] {
		$.panic("can't happen")
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"net.noWriteTo",
		() => new noWriteTo(),
		[{ name: "WriteTo", args: [{ name: "_p0", type: "io.Writer" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }],
		noWriteTo,
		[]
	)
}

export class tcpConnWithoutWriteTo {
	public get noWriteTo(): noWriteTo {
		return this._fields.noWriteTo.value
	}
	public set noWriteTo(value: noWriteTo) {
		this._fields.noWriteTo.value = value
	}

	public get TCPConn(): __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null {
		return this._fields.TCPConn.value
	}
	public set TCPConn(value: __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null) {
		this._fields.TCPConn.value = value
	}

	public _fields: {
		noWriteTo: $.VarRef<noWriteTo>
		TCPConn: $.VarRef<__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null>
	}

	constructor(init?: Partial<{noWriteTo?: noWriteTo, TCPConn?: __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null}>) {
		this._fields = {
			noWriteTo: $.varRef(init?.noWriteTo ? $.markAsStructValue($.cloneStructValue(init.noWriteTo)) : $.markAsStructValue(new noWriteTo())),
			TCPConn: $.varRef(init?.TCPConn ?? (null as unknown as __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null))
		}
	}

	public clone(): tcpConnWithoutWriteTo {
		const cloned = new tcpConnWithoutWriteTo()
		cloned._fields = {
			noWriteTo: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.noWriteTo.value))),
			TCPConn: $.varRef(this._fields.TCPConn.value)
		}
		return $.markAsStructValue(cloned)
	}

	public WriteTo(_p0: any): any {
		return $.pointerValue<noWriteTo>(this.noWriteTo).WriteTo(_p0)
	}

	public async Close(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.Close()
	}

	public async CloseRead(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).CloseRead()
	}

	public async CloseWrite(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).CloseWrite()
	}

	public File(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.File()
	}

	public LocalAddr(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.LocalAddr()
	}

	public MultipathTCP(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).MultipathTCP()
	}

	public async Read(b: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.Read(b)
	}

	public async ReadFrom(r: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).ReadFrom(r)
	}

	public RemoteAddr(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.RemoteAddr()
	}

	public async SetDeadline(t: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetDeadline(t)
	}

	public SetKeepAlive(keepalive: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetKeepAlive(keepalive)
	}

	public SetKeepAliveConfig(config: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetKeepAliveConfig(config)
	}

	public SetKeepAlivePeriod(d: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetKeepAlivePeriod(d)
	}

	public async SetLinger(sec: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetLinger(sec)
	}

	public SetNoDelay(noDelay: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SetNoDelay(noDelay)
	}

	public async SetReadBuffer(bytes: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetReadBuffer(bytes)
	}

	public async SetReadDeadline(t: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetReadDeadline(t)
	}

	public SetWriteBuffer(bytes: any): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetWriteBuffer(bytes)
	}

	public async SetWriteDeadline(t: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.SetWriteDeadline(t)
	}

	public SyscallConn(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).SyscallConn()
	}

	public async Write(b: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.Write(b)
	}

	public ok(): any {
		return $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).conn.ok()
	}

	public async readFrom(r: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).readFrom(r)
	}

	public async writeTo(w: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_tcpsock.TCPConn>(this.TCPConn).writeTo(w)
	}

	static __typeInfo = $.registerStructType(
		"net.tcpConnWithoutWriteTo",
		() => new tcpConnWithoutWriteTo(),
		[{ name: "WriteTo", args: [{ name: "_p0", type: "io.Writer" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseRead", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "File", args: [], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "err", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "MultipathTCP", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: "error" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "ReadFrom", args: [{ name: "r", type: "io.Reader" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetKeepAlive", args: [{ name: "keepalive", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetKeepAliveConfig", args: [{ name: "config", type: "net.KeepAliveConfig" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetKeepAlivePeriod", args: [{ name: "d", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetLinger", args: [{ name: "sec", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetNoDelay", args: [{ name: "noDelay", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SyscallConn", args: [], returns: [{ name: "_r0", type: "syscall.RawConn" }, { name: "_r1", type: "error" }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "ok", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "readFrom", args: [{ name: "r", type: "io.Reader" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }, { name: "writeTo", args: [{ name: "w", type: "io.Writer" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }],
		tcpConnWithoutWriteTo,
		[{ name: "noWriteTo", key: "noWriteTo", type: "net.noWriteTo", pkgPath: "net", anonymous: true, index: [0], offset: 0, exported: false }, { name: "TCPConn", key: "TCPConn", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPConn" }, anonymous: true, index: [1], offset: 0, exported: true }]
	)
}

export let listenerBacklogCache: $.VarRef<{"Once": sync.Once, "val": number}> = $.varRef({"Once": $.markAsStructValue(new sync.Once()), "val": 0})

export function __goscript_set_listenerBacklogCache(__goscriptValue: {"Once": sync.Once, "val": number}): void {
	listenerBacklogCache.value = __goscriptValue
}

export async function listenerBacklog(): globalThis.Promise<number> {
	await listenerBacklogCache.value.Once.Do($.functionValue((): void => {
		listenerBacklogCache.value.val = __goscript_sock_stub.maxListenerBacklog()
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	return listenerBacklogCache.value.val
}

export let errNoSuitableAddress: $.GoError = errors.New("no suitable address found")

export function __goscript_set_errNoSuitableAddress(__goscriptValue: $.GoError): void {
	errNoSuitableAddress = __goscriptValue
}

export let errMissingAddress: $.GoError = errors.New("missing address")

export function __goscript_set_errMissingAddress(__goscriptValue: $.GoError): void {
	errMissingAddress = __goscriptValue
}

export let errCanceled: canceledError = $.markAsStructValue(new canceledError())

export function __goscript_set_errCanceled(__goscriptValue: canceledError): void {
	errCanceled = __goscriptValue
}

export let ErrWriteToConnected: $.GoError = errors.New("use of WriteTo with pre-connected connection")

export function __goscript_set_ErrWriteToConnected(__goscriptValue: $.GoError): void {
	ErrWriteToConnected = __goscriptValue
}

export function mapErr(err: $.GoError): $.GoError {
	{
		let __goscriptSwitch0 = err
		switch (true) {
			case $.comparableEqual(__goscriptSwitch0, context.Canceled):
			{
				return $.interfaceValue<$.GoError>($.markAsStructValue($.cloneStructValue(errCanceled)), "net.canceledError")
				break
			}
			case $.comparableEqual(__goscriptSwitch0, context.DeadlineExceeded):
			{
				return errTimeout
				break
			}
			default:
			{
				return err
				break
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export let aLongTimeAgo: time.Time = $.markAsStructValue($.cloneStructValue(time.Unix(1n, 0n)))

export function __goscript_set_aLongTimeAgo(__goscriptValue: time.Time): void {
	aLongTimeAgo = __goscriptValue
}

export let noDeadline: time.Time = $.markAsStructValue(new time.Time())

export function __goscript_set_noDeadline(__goscriptValue: time.Time): void {
	noDeadline = __goscriptValue
}

export let noCancel: $.Channel<{}> | null = null

export function __goscript_set_noCancel(__goscriptValue: $.Channel<{}> | null): void {
	noCancel = __goscriptValue
}

export type timeout = {
	Timeout(): boolean | globalThis.Promise<boolean>
}

$.registerInterfaceType(
	"net.timeout",
	null,
	[{ name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
);

export type temporary = {
	Temporary(): boolean | globalThis.Promise<boolean>
}

$.registerInterfaceType(
	"net.temporary",
	null,
	[{ name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
);

export function UnknownNetworkError_Error(e: UnknownNetworkError): string {
	return "unknown network " + e
}

export function UnknownNetworkError_Timeout(e: UnknownNetworkError): boolean {
	return false
}

export function UnknownNetworkError_Temporary(e: UnknownNetworkError): boolean {
	return false
}

export function InvalidAddrError_Error(e: InvalidAddrError): string {
	return e
}

export function InvalidAddrError_Timeout(e: InvalidAddrError): boolean {
	return false
}

export function InvalidAddrError_Temporary(e: InvalidAddrError): boolean {
	return false
}

export let errTimeout: $.GoError = $.interfaceValue<$.GoError>(new timeoutError(), "*net.timeoutError")

export function __goscript_set_errTimeout(__goscriptValue: $.GoError): void {
	errTimeout = __goscriptValue
}

export let errNoSuchHost: notFoundError | $.VarRef<notFoundError> | null = new notFoundError({s: "no such host"})

export function __goscript_set_errNoSuchHost(__goscriptValue: notFoundError | $.VarRef<notFoundError> | null): void {
	errNoSuchHost = __goscriptValue
}

export let errUnknownPort: notFoundError | $.VarRef<notFoundError> | null = new notFoundError({s: "unknown port"})

export function __goscript_set_errUnknownPort(__goscriptValue: notFoundError | $.VarRef<notFoundError> | null): void {
	errUnknownPort = __goscriptValue
}

export async function newDNSError(err: $.GoError, name: string, server: string): globalThis.Promise<DNSError | $.VarRef<DNSError> | null> {
	let isTimeout: boolean = false
	let isTemporary: boolean = false
	let unwrapErr: $.GoError = null as $.GoError

	let __goscriptShadow2 = err
	{
		let __goscriptTuple3: any = $.typeAssertTuple<Error | null>(__goscriptShadow2, "net.Error")
		let __goscriptShadow3 = __goscriptTuple3[0]
		let ok = __goscriptTuple3[1]
		if (ok) {
			isTimeout = await $.pointerValue<Exclude<Error, null>>(__goscriptShadow3).Timeout()
			isTemporary = await $.pointerValue<Exclude<Error, null>>(__goscriptShadow3).Temporary()
		}
	}

	// At this time, the only errors we wrap are context errors, to allow
	// users to check for canceled/timed out requests.
	if (errors.Is($.pointerValueOrNil(err)!, $.pointerValueOrNil(context.DeadlineExceeded)!) || errors.Is($.pointerValueOrNil(err)!, $.pointerValueOrNil(context.Canceled)!)) {
		unwrapErr = err
	}

	let [, isNotFound] = $.typeAssertTuple<notFoundError | $.VarRef<notFoundError> | null>(err, { kind: $.TypeKind.Pointer, elemType: "net.notFoundError" })
	return (() => { const __goscriptLiteralField0 = $.pointerValue<Exclude<$.GoError, null>>(err).Error(); return new DNSError({UnwrapErr: unwrapErr, Err: __goscriptLiteralField0, Name: name, Server: server, IsTimeout: isTimeout, IsTemporary: isTemporary, IsNotFound: isNotFound}) })()
}

export let errClosed: any = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(poll.ErrNetClosing)))

export function __goscript_set_errClosed(__goscriptValue: any): void {
	errClosed = __goscriptValue
}

export let ErrClosed: $.GoError = $.interfaceValue<$.GoError>($.markAsStructValue($.cloneStructValue(errClosed)), "poll.errNetClosing")

export function __goscript_set_ErrClosed(__goscriptValue: $.GoError): void {
	ErrClosed = __goscriptValue
}

export async function genericReadFrom(c: __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, r: io.Reader | null): globalThis.Promise<[bigint, $.GoError]> {
	let n: bigint = 0n
	let err: $.GoError = null as $.GoError
	// Use wrapper to hide existing r.ReadFrom from io.Copy.
	return await io.Copy($.interfaceValue<io.Writer | null>($.markAsStructValue(new tcpConnWithoutReadFrom({TCPConn: c})), "net.tcpConnWithoutReadFrom"), $.pointerValueOrNil(r)!)
}

export async function genericWriteTo(c: __goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, w: io.Writer | null): globalThis.Promise<[bigint, $.GoError]> {
	let n: bigint = 0n
	let err: $.GoError = null as $.GoError
	// Use wrapper to hide existing w.WriteTo from io.Copy.
	return await io.Copy($.pointerValueOrNil(w)!, $.interfaceValue<io.Reader | null>($.markAsStructValue(new tcpConnWithoutWriteTo({TCPConn: c})), "net.tcpConnWithoutWriteTo"))
}

export let threadLimit: $.Channel<{}> | null = null as $.Channel<{}> | null

export function __goscript_set_threadLimit(__goscriptValue: $.Channel<{}> | null): void {
	threadLimit = __goscriptValue
}

export let threadOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_threadOnce(__goscriptValue: sync.Once): void {
	threadOnce.value = __goscriptValue
}

export async function acquireThread(ctx: context.Context | null): globalThis.Promise<$.GoError> {
	await threadOnce.value.Do($.functionValue((): void => {
		threadLimit = $.makeChannel<{}>(__goscript_rlimit_js.concurrentThreadsLimit(), {}, "both")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, $.GoError>([
		{
			id: 0,
			isSend: true,
			channel: threadLimit,
			value: {},
			onSelected: async (__goscriptSelect0Result) => {
				return null
			}
		},
		{
			id: 1,
			isSend: false,
			channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
			onSelected: async (__goscriptSelect0Result) => {
				return await $.pointerValue<Exclude<context.Context, null>>(ctx).Err()
			}
		}
	], false)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}
	throw new Error("unreachable select")
	throw new globalThis.Error("goscript: unreachable return")
}

export async function releaseThread(): globalThis.Promise<void> {
	await $.chanRecv(threadLimit)
}

export type buffersWriter = {
	writeBuffers(_p0: $.VarRef<Buffers> | null): [bigint, $.GoError]
}

$.registerInterfaceType(
	"net.buffersWriter",
	null,
	[{ name: "writeBuffers", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "net.Buffers" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }]
);

export async function Buffers_WriteTo(v: $.VarRef<Buffers> | null, w: io.Writer | null): globalThis.Promise<[bigint, $.GoError]> {
	let n: bigint = 0n
	let err: $.GoError = null as $.GoError
	{
		let [wv, ok] = $.typeAssertTuple<buffersWriter | null>(w, "net.buffersWriter")
		if (ok) {
			return await $.pointerValue<Exclude<buffersWriter, null>>(wv).writeBuffers(v)
		}
	}
	for (let __goscriptRangeTarget0 = $.pointerValue<Buffers>(v), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let b = __goscriptRangeTarget0![__rangeIndex]
		let [nb, __goscriptShadow4] = await $.pointerValue<Exclude<io.Writer, null>>(w).Write(b)
		n = $.int64Add(n, $.int64(nb))
		if (__goscriptShadow4 != null) {
			Buffers_consume(v, n)
			return [n, __goscriptShadow4]
		}
	}
	Buffers_consume(v, n)
	return [n, null]
}

export function Buffers_Read(v: $.VarRef<Buffers> | null, p: $.Slice<number>): [number, $.GoError] {
	let n: number = 0
	let err: $.GoError = null as $.GoError
	while (($.len(p) > 0) && ($.len(($.pointerValue<Buffers>(v) as Buffers)) > 0)) {
		let n0 = $.copy(p, $.arrayIndex(($.pointerValue<Buffers>(v))!, 0))
		Buffers_consume(v, $.int64(n0))
		p = $.goSlice(p, n0, undefined)
		n = n + (n0)
	}
	if ($.len(($.pointerValue<Buffers>(v) as Buffers)) == 0) {
		err = io.EOF
	}
	return [n, err]
}

export function Buffers_consume(v: $.VarRef<Buffers> | null, n: bigint): void {
	while ($.len(($.pointerValue<Buffers>(v) as Buffers)) > 0) {
		let ln0 = $.int64($.len($.arrayIndex(($.pointerValue<Buffers>(v))!, 0)))
		if (ln0 > n) {
			($.pointerValue<Buffers>(v))![0] = $.goSlice($.arrayIndex(($.pointerValue<Buffers>(v))!, 0), Number(n), undefined)
			return
		}
		n = $.int64Sub(n, ln0);
		($.pointerValue<Buffers>(v))![0] = null
		v!.value = ($.goSlice(($.pointerValue<Buffers>(v)), 1, undefined) as Buffers)
	}
}
