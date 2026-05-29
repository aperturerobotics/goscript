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
			family: $.varRef(init?.family ?? 0),
			sotype: $.varRef(init?.sotype ?? 0),
			isConnected: $.varRef(init?.isConnected ?? false),
			net: $.varRef(init?.net ?? ""),
			laddr: $.varRef(init?.laddr ?? null),
			raddr: $.varRef(init?.raddr ?? null),
			fakeNetFD: $.varRef(init?.fakeNetFD ?? null)
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
		[{ name: "Close", args: [], returns: [] }, { name: "Read", args: [], returns: [] }, { name: "SetDeadline", args: [], returns: [] }, { name: "SetReadDeadline", args: [], returns: [] }, { name: "SetWriteDeadline", args: [], returns: [] }, { name: "Write", args: [], returns: [] }, { name: "accept", args: [], returns: [] }, { name: "addrFunc", args: [], returns: [] }, { name: "closeRead", args: [], returns: [] }, { name: "closeWrite", args: [], returns: [] }, { name: "init", args: [], returns: [] }, { name: "name", args: [], returns: [] }, { name: "setAddr", args: [], returns: [] }, { name: "shutdown", args: [], returns: [] }, { name: "assignFakeAddr", args: [], returns: [] }, { name: "dup", args: [], returns: [] }, { name: "readFrom", args: [], returns: [] }, { name: "readFromInet4", args: [], returns: [] }, { name: "readFromInet6", args: [], returns: [] }, { name: "readMsg", args: [], returns: [] }, { name: "readMsgInet4", args: [], returns: [] }, { name: "readMsgInet6", args: [], returns: [] }, { name: "setLinger", args: [], returns: [] }, { name: "setReadBuffer", args: [], returns: [] }, { name: "setWriteBuffer", args: [], returns: [] }, { name: "writeMsg", args: [], returns: [] }, { name: "writeMsgInet4", args: [], returns: [] }, { name: "writeMsgInet6", args: [], returns: [] }, { name: "writeTo", args: [], returns: [] }, { name: "writeToInet4", args: [], returns: [] }, { name: "writeToInet6", args: [], returns: [] }],
		netFD,
		{"pfd": "poll.FD", "family": { kind: $.TypeKind.Basic, name: "int" }, "sotype": { kind: $.TypeKind.Basic, name: "int" }, "isConnected": { kind: $.TypeKind.Basic, name: "bool" }, "net": { kind: $.TypeKind.Basic, name: "string" }, "laddr": "net.Addr", "raddr": "net.Addr", "fakeNetFD": { kind: $.TypeKind.Pointer, elemType: "net.fakeNetFD" }}
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
		[{ name: "Network", args: [], returns: [] }, { name: "String", args: [], returns: [] }],
		unknownAddr,
		{}
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
