// Generated file based on fd_fake.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as time from "@goscript/time/index.js"

import * as os from "@goscript/os/index.js"

import * as syscall from "@goscript/syscall/index.js"

import type * as netip from "@goscript/net/netip/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as __goscript_error_posix from "./error_posix.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_tcpsock from "./tcpsock.gs.ts"

import * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"

import * as __goscript_udpsock from "./udpsock.gs.ts"

import * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"

import * as __goscript_unixsock_posix from "./unixsock_posix.gs.ts"
import "@goscript/internal/poll/index.js"
import "@goscript/runtime/index.js"
import "@goscript/time/index.js"
import "@goscript/os/index.js"
import "@goscript/syscall/index.js"
import "@goscript/sync/atomic/index.js"
import "./error_posix.gs.ts"
import "./fd_js.gs.ts"
import "./ip.gs.ts"
import "./iprawsock_posix.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./tcpsock.gs.ts"
import "./tcpsock_posix.gs.ts"
import "./udpsock.gs.ts"
import "./udpsock_posix.gs.ts"
import "./unixsock_posix.gs.ts"

export class netFD {
	public get pfd(): poll.FD {
		return this._fields.pfd.value
	}
	public set pfd(value: poll.FD) {
		this._fields.pfd.value = value
	}

	// immutable until Close
	public get family(): number {
		return this._fields.family.value
	}
	public set family(value: number) {
		this._fields.family.value = value
	}

	public get sotype(): number {
		return this._fields.sotype.value
	}
	public set sotype(value: number) {
		this._fields.sotype.value = value
	}

	public get isConnected(): boolean {
		return this._fields.isConnected.value
	}
	public set isConnected(value: boolean) {
		this._fields.isConnected.value = value
	}

	public get net(): string {
		return this._fields.net.value
	}
	public set net(value: string) {
		this._fields.net.value = value
	}

	public get laddr(): __goscript_net.Addr | null {
		return this._fields.laddr.value
	}
	public set laddr(value: __goscript_net.Addr | null) {
		this._fields.laddr.value = value
	}

	public get raddr(): __goscript_net.Addr | null {
		return this._fields.raddr.value
	}
	public set raddr(value: __goscript_net.Addr | null) {
		this._fields.raddr.value = value
	}

	public get fakeNetFD(): __goscript_net_fake.fakeNetFD | $.VarRef<__goscript_net_fake.fakeNetFD> | null {
		return this._fields.fakeNetFD.value
	}
	public set fakeNetFD(value: __goscript_net_fake.fakeNetFD | $.VarRef<__goscript_net_fake.fakeNetFD> | null) {
		this._fields.fakeNetFD.value = value
	}

	public _fields: {
		pfd: $.VarRef<poll.FD>
		family: $.VarRef<number>
		sotype: $.VarRef<number>
		isConnected: $.VarRef<boolean>
		net: $.VarRef<string>
		laddr: $.VarRef<__goscript_net.Addr | null>
		raddr: $.VarRef<__goscript_net.Addr | null>
		fakeNetFD: $.VarRef<__goscript_net_fake.fakeNetFD | $.VarRef<__goscript_net_fake.fakeNetFD> | null>
	}

	constructor(init?: Partial<{pfd?: poll.FD, family?: number, sotype?: number, isConnected?: boolean, net?: string, laddr?: __goscript_net.Addr | null, raddr?: __goscript_net.Addr | null, fakeNetFD?: __goscript_net_fake.fakeNetFD | $.VarRef<__goscript_net_fake.fakeNetFD> | null}>) {
		this._fields = {
			pfd: $.varRef(init?.pfd ? $.markAsStructValue($.cloneStructValue(init.pfd)) : $.markAsStructValue(new poll.FD())),
			family: $.varRef(init?.family ?? (0 as number)),
			sotype: $.varRef(init?.sotype ?? (0 as number)),
			isConnected: $.varRef(init?.isConnected ?? (false as boolean)),
			net: $.varRef(init?.net ?? ("" as string)),
			laddr: $.varRef(init?.laddr ?? (null as __goscript_net.Addr | null)),
			raddr: $.varRef(init?.raddr ?? (null as __goscript_net.Addr | null)),
			fakeNetFD: $.varRef(init?.fakeNetFD ?? (null as __goscript_net_fake.fakeNetFD | $.VarRef<__goscript_net_fake.fakeNetFD> | null))
		}
	}

	public clone(): netFD {
		const cloned = new netFD()
		cloned._fields = {
			pfd: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.pfd.value))),
			family: $.varRef(this._fields.family.value),
			sotype: $.varRef(this._fields.sotype.value),
			isConnected: $.varRef(this._fields.isConnected.value),
			net: $.varRef(this._fields.net.value),
			laddr: $.varRef(this._fields.laddr.value),
			raddr: $.varRef(this._fields.raddr.value),
			fakeNetFD: $.varRef(this._fields.fakeNetFD.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const fd: netFD | $.VarRef<netFD> | null = this
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return await __goscript_net_fake.fakeNetFD.prototype.Close.call($.pointerValue<netFD>(fd).fakeNetFD)
		}
		// TODO Replace with runtime.AddCleanup.
		runtime.SetFinalizer($.interfaceValue<any>(fd, "*net.netFD"), null)
		return await $.pointerValue<netFD>(fd).pfd.Close()
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const fd: netFD | $.VarRef<netFD> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return await __goscript_net_fake.fakeNetFD.prototype.Read.call($.pointerValue<netFD>(fd).fakeNetFD, p)
		}
		let __goscriptTuple0: any = await $.pointerValue<netFD>(fd).pfd.Read(p)
		n = __goscriptTuple0[0]
		err = __goscriptTuple0[1]
		runtime.KeepAlive($.interfaceValue<any>(fd, "*net.netFD"))
		return [n, __goscript_error_posix.wrapSyscallError("fd_read", err)]
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const fd: netFD | $.VarRef<netFD> | null = this
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return await __goscript_net_fake.fakeNetFD.prototype.SetDeadline.call($.pointerValue<netFD>(fd).fakeNetFD, $.markAsStructValue($.cloneStructValue(t)))
		}
		return await $.pointerValue<netFD>(fd).pfd.SetDeadline($.markAsStructValue($.cloneStructValue(t)))
	}

	public async SetReadDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const fd: netFD | $.VarRef<netFD> | null = this
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return await __goscript_net_fake.fakeNetFD.prototype.SetReadDeadline.call($.pointerValue<netFD>(fd).fakeNetFD, $.markAsStructValue($.cloneStructValue(t)))
		}
		return await $.pointerValue<netFD>(fd).pfd.SetReadDeadline($.markAsStructValue($.cloneStructValue(t)))
	}

	public async SetWriteDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const fd: netFD | $.VarRef<netFD> | null = this
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return await __goscript_net_fake.fakeNetFD.prototype.SetWriteDeadline.call($.pointerValue<netFD>(fd).fakeNetFD, $.markAsStructValue($.cloneStructValue(t)))
		}
		return await $.pointerValue<netFD>(fd).pfd.SetWriteDeadline($.markAsStructValue($.cloneStructValue(t)))
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const fd: netFD | $.VarRef<netFD> | null = this
		let nn: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return await __goscript_net_fake.fakeNetFD.prototype.Write.call($.pointerValue<netFD>(fd).fakeNetFD, p)
		}
		let __goscriptTuple1: any = await $.pointerValue<netFD>(fd).pfd.Write(p)
		nn = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		runtime.KeepAlive($.interfaceValue<any>(fd, "*net.netFD"))
		return [nn, __goscript_error_posix.wrapSyscallError("fd_write", err)]
	}

	public async accept(): globalThis.Promise<[netFD | $.VarRef<netFD> | null, $.GoError]> {
		const fd: netFD | $.VarRef<netFD> | null = this
		let netfd: netFD | $.VarRef<netFD> | null = null as netFD | $.VarRef<netFD> | null
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return await __goscript_net_fake.fakeNetFD.prototype.accept.call($.pointerValue<netFD>(fd).fakeNetFD, $.pointerValue<netFD>(fd).laddr)
		}
		let __goscriptTuple2: any = await $.pointerValue<netFD>(fd).pfd.Accept()
		let d = __goscriptTuple2[0]
		let errcall = __goscriptTuple2[2]
		err = __goscriptTuple2[3]
		if (err != null) {
			if (!$.stringEqual(errcall, "")) {
				err = __goscript_error_posix.wrapSyscallError(errcall, err)
			}
			return [null, err]
		}
		netfd = newFD("tcp", d)
		{
			err = netFD.prototype.init.call(netfd)
			if (err != null) {
				await netFD.prototype.Close.call(netfd)
				return [null, err]
			}
		}
		return [netfd, null]
	}

	public addrFunc(): ((_p0: syscall.Sockaddr | null) => __goscript_net.Addr | null | globalThis.Promise<__goscript_net.Addr | null>) | null {
		const fd: netFD | $.VarRef<netFD> | null = this
		switch ($.pointerValue<netFD>(fd).family) {
			case syscall.AF_INET:
			case syscall.AF_INET6:
			{
				switch ($.pointerValue<netFD>(fd).sotype) {
					case syscall.SOCK_STREAM:
					{
						return __goscript_tcpsock_posix.sockaddrToTCP
						break
					}
					case syscall.SOCK_DGRAM:
					{
						return __goscript_udpsock_posix.sockaddrToUDP
						break
					}
					case syscall.SOCK_RAW:
					{
						return __goscript_iprawsock_posix.sockaddrToIP
						break
					}
				}
				break
			}
			case syscall.AF_UNIX:
			{
				switch ($.pointerValue<netFD>(fd).sotype) {
					case syscall.SOCK_STREAM:
					{
						return __goscript_unixsock_posix.sockaddrToUnix
						break
					}
					case syscall.SOCK_DGRAM:
					{
						return __goscript_unixsock_posix.sockaddrToUnixgram
						break
					}
					case syscall.SOCK_SEQPACKET:
					{
						return __goscript_unixsock_posix.sockaddrToUnixpacket
						break
					}
				}
				break
			}
		}
		return $.functionValue((_p0: syscall.Sockaddr | null): __goscript_net.Addr | null => {
			return null
		}, ({ kind: $.TypeKind.Function, params: ["syscall.Sockaddr"], results: ["net.Addr"] } as $.FunctionTypeInfo))
	}

	public async closeRead(): globalThis.Promise<$.GoError> {
		const fd: netFD | $.VarRef<netFD> | null = this
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return await __goscript_net_fake.fakeNetFD.prototype.closeRead.call($.pointerValue<netFD>(fd).fakeNetFD)
		}
		return os.NewSyscallError("closeRead", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTSUP, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
	}

	public async closeWrite(): globalThis.Promise<$.GoError> {
		const fd: netFD | $.VarRef<netFD> | null = this
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return await __goscript_net_fake.fakeNetFD.prototype.closeWrite.call($.pointerValue<netFD>(fd).fakeNetFD)
		}
		return os.NewSyscallError("closeRead", $.namedValueInterfaceValue<$.GoError>(syscall.ENOTSUP, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" }))
	}

	public init(): $.GoError {
		const fd: netFD | $.VarRef<netFD> | null = this
		return $.pointerValue<netFD>(fd).pfd.Init($.pointerValue<netFD>(fd).net, true)
	}

	public name(): string {
		const fd: netFD | $.VarRef<netFD> | null = this
		return "unknown"
	}

	public setAddr(laddr: __goscript_net.Addr | null, raddr: __goscript_net.Addr | null): void {
		let fd: netFD | $.VarRef<netFD> | null = this
		$.pointerValue<netFD>(fd).laddr = laddr
		$.pointerValue<netFD>(fd).raddr = raddr
		// TODO Replace with runtime.AddCleanup.
		runtime.SetFinalizer($.interfaceValue<any>(fd, "*net.netFD"), $.interfaceValue<any>($.functionValue(async (fd: netFD | $.VarRef<netFD> | null): globalThis.Promise<$.GoError> => await $.pointerValue<netFD>(fd).Close(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "net.netFD" }], results: ["error"] } as $.FunctionTypeInfo)), "func(*net.netFD) error"))
	}

	public async shutdown(how: number): globalThis.Promise<$.GoError> {
		const fd: netFD | $.VarRef<netFD> | null = this
		if ($.pointerValue<netFD>(fd).fakeNetFD != null) {
			return null
		}
		let err = await $.pointerValue<netFD>(fd).pfd.Shutdown(how)
		runtime.KeepAlive($.interfaceValue<any>(fd, "*net.netFD"))
		return __goscript_error_posix.wrapSyscallError("shutdown", err)
	}

	public async assignFakeAddr(addr: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).assignFakeAddr(addr)
	}

	public dup(): any {
		return $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).dup()
	}

	public async readFrom(p: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).readFrom(p)
	}

	public async readFromInet4(p: any, sa: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).readFromInet4(p, sa)
	}

	public async readFromInet6(p: any, sa: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).readFromInet6(p, sa)
	}

	public async readMsg(p: any, oob: any, flags: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).readMsg(p, oob, flags)
	}

	public async readMsgInet4(p: any, oob: any, flags: any, sa: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).readMsgInet4(p, oob, flags, sa)
	}

	public async readMsgInet6(p: any, oob: any, flags: any, sa: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).readMsgInet6(p, oob, flags, sa)
	}

	public async setLinger(sec: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).setLinger(sec)
	}

	public async setReadBuffer(bytes: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).setReadBuffer(bytes)
	}

	public setWriteBuffer(bytes: any): any {
		return $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).setWriteBuffer(bytes)
	}

	public async writeMsg(p: any, oob: any, sa: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).writeMsg(p, oob, sa)
	}

	public async writeMsgInet4(p: any, oob: any, sa4: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).writeMsgInet4(p, oob, sa4)
	}

	public async writeMsgInet6(p: any, oob: any, sa6: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).writeMsgInet6(p, oob, sa6)
	}

	public async writeTo(p: any, sa: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).writeTo(p, sa)
	}

	public async writeToInet4(p: any, sa: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).writeToInet4(p, sa)
	}

	public async writeToInet6(p: any, sa: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>(this.fakeNetFD).writeToInet6(p, sa)
	}

	static __typeInfo = $.registerStructType(
		"net.netFD",
		() => new netFD(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "nn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "accept", args: [], returns: [{ name: "netfd", type: { kind: $.TypeKind.Pointer, elemType: "net.netFD" } }, { name: "err", type: "error" }] }, { name: "addrFunc", args: [], returns: [{ name: "_r0", type: ({ kind: $.TypeKind.Function, params: ["syscall.Sockaddr"], results: ["net.Addr"] } as $.FunctionTypeInfo) }] }, { name: "closeRead", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "closeWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "init", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "name", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "setAddr", args: [{ name: "laddr", type: "net.Addr" }, { name: "raddr", type: "net.Addr" }], returns: [] }, { name: "shutdown", args: [{ name: "how", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "assignFakeAddr", args: [{ name: "addr", type: "net.sockaddr" }], returns: [{ name: "_r0", type: "error" }] }, { name: "dup", args: [], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "err", type: "error" }] }, { name: "readFrom", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "sa", type: "syscall.Sockaddr" }, { name: "err", type: "error" }] }, { name: "readFromInet4", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "readFromInet6", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "readMsg", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "retflags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "sa", type: "syscall.Sockaddr" }, { name: "err", type: "error" }] }, { name: "readMsgInet4", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "retflags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "readMsgInet6", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "retflags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "setLinger", args: [{ name: "sec", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "setReadBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "setWriteBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "writeMsg", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: "syscall.Sockaddr" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeMsgInet4", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa4", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeMsgInet6", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa6", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeTo", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: "syscall.Sockaddr" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeToInet4", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeToInet6", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "sa", type: { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		netFD,
		[{ name: "pfd", key: "pfd", type: "poll.FD", pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "family", key: "family", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "net", index: [1], offset: 64, exported: false }, { name: "sotype", key: "sotype", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "net", index: [2], offset: 72, exported: false }, { name: "isConnected", key: "isConnected", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [3], offset: 80, exported: false }, { name: "net", key: "net", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [4], offset: 88, exported: false }, { name: "laddr", key: "laddr", type: "net.Addr", pkgPath: "net", index: [5], offset: 104, exported: false }, { name: "raddr", key: "raddr", type: "net.Addr", pkgPath: "net", index: [6], offset: 120, exported: false }, { name: "fakeNetFD", key: "fakeNetFD", type: { kind: $.TypeKind.Pointer, elemType: "net.fakeNetFD" }, pkgPath: "net", anonymous: true, index: [7], offset: 136, exported: false }]
	)
}

export class unknownAddr {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): unknownAddr {
		const cloned = new unknownAddr()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Network(): string {
		return "unknown"
	}

	public String(): string {
		return "unknown"
	}

	static __typeInfo = $.registerStructType(
		"net.unknownAddr",
		() => new unknownAddr(),
		[{ name: "Network", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		unknownAddr,
		[]
	)
}

export const readSyscallName: string = "fd_read"

export const writeSyscallName: string = "fd_write"

export function newFD(net: string, sysfd: number): netFD | $.VarRef<netFD> | null {
	return newPollFD(net, $.markAsStructValue(new poll.FD({Sysfd: sysfd, IsStream: true, ZeroReadIsEOF: true})))
}

export function newPollFD(net: string, pfd: poll.FD): netFD | $.VarRef<netFD> | null {
	let laddr: __goscript_net.Addr | null = null as __goscript_net.Addr | null
	let raddr: __goscript_net.Addr | null = null as __goscript_net.Addr | null
	// WASI preview 1 does not have functions like getsockname/getpeername,
	// so we cannot get access to the underlying IP address used by connections.
	//
	// However, listeners created by FileListener are of type *TCPListener,
	// which can be asserted by a Go program. The (*TCPListener).Addr method
	// documents that the returned value will be of type *TCPAddr, we satisfy
	// the documented behavior by creating addresses of the expected type here.
	switch (net) {
		case "tcp":
		{
			laddr = $.interfaceValue<__goscript_net.Addr | null>(new __goscript_tcpsock.TCPAddr(), "*net.TCPAddr")
			raddr = $.interfaceValue<__goscript_net.Addr | null>(new __goscript_tcpsock.TCPAddr(), "*net.TCPAddr")
			break
		}
		case "udp":
		{
			laddr = $.interfaceValue<__goscript_net.Addr | null>(new __goscript_udpsock.UDPAddr(), "*net.UDPAddr")
			raddr = $.interfaceValue<__goscript_net.Addr | null>(new __goscript_udpsock.UDPAddr(), "*net.UDPAddr")
			break
		}
		default:
		{
			laddr = $.interfaceValue<__goscript_net.Addr | null>($.markAsStructValue(new unknownAddr()), "net.unknownAddr")
			raddr = $.interfaceValue<__goscript_net.Addr | null>($.markAsStructValue(new unknownAddr()), "net.unknownAddr")
			break
		}
	}
	return new netFD({pfd: $.markAsStructValue($.cloneStructValue(pfd)), net: net, laddr: laddr, raddr: raddr})
}
