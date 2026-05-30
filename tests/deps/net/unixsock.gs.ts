// Generated file based on unixsock.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as errors from "@goscript/errors/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import type * as io from "@goscript/io/index.js"

import type * as netip from "@goscript/net/netip/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import type * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import * as __goscript__interface from "./interface.gs.ts"

import * as __goscript_dial from "./dial.gs.ts"

import type * as __goscript_dnsclient from "./dnsclient.gs.ts"

import * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.ts"

import type * as __goscript_dnsconfig from "./dnsconfig.gs.ts"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import type * as __goscript_iprawsock from "./iprawsock.gs.ts"

import * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_lookup from "./lookup.gs.ts"

import * as __goscript_lookup_unix from "./lookup_unix.gs.ts"

import * as __goscript_mac from "./mac.gs.ts"

import * as __goscript_mptcpsock_stub from "./mptcpsock_stub.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_rawconn from "./rawconn.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_tcpsock from "./tcpsock.gs.ts"

import * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"

import type * as __goscript_tcpsock_unix from "./tcpsock_unix.gs.ts"

import type * as __goscript_udpsock from "./udpsock.gs.ts"

import * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"

import * as __goscript_unixsock_posix from "./unixsock_posix.gs.ts"

import * as __goscript_unixsock_readmsg_other from "./unixsock_readmsg_other.gs.ts"
import "@goscript/context/index.js"
import "@goscript/os/index.js"
import "@goscript/sync/index.js"
import "@goscript/syscall/index.js"
import "@goscript/time/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/internal/singleflight/index.js"
import "@goscript/sync/atomic/index.js"
import "./interface.gs.ts"
import "./dial.gs.ts"
import "./dnsclient_unix.gs.ts"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./ip.gs.ts"
import "./iprawsock_posix.gs.ts"
import "./ipsock.gs.ts"
import "./lookup.gs.ts"
import "./lookup_unix.gs.ts"
import "./mac.gs.ts"
import "./mptcpsock_stub.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./rawconn.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./tcpsock.gs.ts"
import "./tcpsock_posix.gs.ts"
import "./udpsock_posix.gs.ts"
import "./unixsock_posix.gs.ts"
import "./unixsock_readmsg_other.gs.ts"

export class UnixAddr {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Net(): string {
		return this._fields.Net.value
	}
	public set Net(value: string) {
		this._fields.Net.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Net: $.VarRef<string>
	}

	constructor(init?: Partial<{Name?: string, Net?: string}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ""),
			Net: $.varRef(init?.Net ?? "")
		}
	}

	public clone(): UnixAddr {
		const cloned = new UnixAddr()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Net: $.varRef(this._fields.Net.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Network(): string {
		const a: UnixAddr | $.VarRef<UnixAddr> | null = this
		return $.pointerValue<UnixAddr>(a).Net
	}

	public String(): string {
		const a: UnixAddr | $.VarRef<UnixAddr> | null = this
		if (a == null) {
			return "<nil>"
		}
		return $.pointerValue<UnixAddr>(a).Name
	}

	public family(): number {
		const a: UnixAddr | $.VarRef<UnixAddr> | null = this
		return syscall.AF_UNIX
	}

	public isWildcard(): boolean {
		const a: UnixAddr | $.VarRef<UnixAddr> | null = this
		return (a == null) || ($.stringEqual($.pointerValue<UnixAddr>(a).Name, ""))
	}

	public opAddr(): __goscript_net.Addr | null {
		const a: UnixAddr | $.VarRef<UnixAddr> | null = this
		if (a == null) {
			return null
		}
		return $.interfaceValue<__goscript_net.Addr | null>(a, "*net.UnixAddr")
	}

	public sockaddr(family: number): [syscall.Sockaddr | null, $.GoError] {
		const a: UnixAddr | $.VarRef<UnixAddr> | null = this
		if (a == null) {
			return [null, null]
		}
		return [$.interfaceValue<syscall.Sockaddr | null>(new syscall.SockaddrUnix({Name: $.pointerValue<UnixAddr>(a).Name}), "*syscall.SockaddrUnix"), null]
	}

	public toLocal(net: string): __goscript_sockaddr_posix.sockaddr | null {
		const a: UnixAddr | $.VarRef<UnixAddr> | null = this
		return $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(a, "*net.UnixAddr")
	}

	static __typeInfo = $.registerStructType(
		"net.UnixAddr",
		() => new UnixAddr(),
		[{ name: "Network", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "family", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "isWildcard", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "opAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "sockaddr", args: [{ name: "family", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "syscall.Sockaddr" }, { name: "_r1", type: "error" }] }, { name: "toLocal", args: [{ name: "net", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.sockaddr" }] }],
		UnixAddr,
		[{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Net", key: "Net", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 16, exported: true }]
	)
}

export class UnixConn {
	public get conn(): __goscript_net.conn {
		return this._fields.conn.value
	}
	public set conn(value: __goscript_net.conn) {
		this._fields.conn.value = value
	}

	public _fields: {
		conn: $.VarRef<__goscript_net.conn>
	}

	constructor(init?: Partial<{conn?: __goscript_net.conn}>) {
		this._fields = {
			conn: $.varRef(init?.conn ? $.markAsStructValue($.cloneStructValue(init.conn)) : $.markAsStructValue(new __goscript_net.conn()))
		}
	}

	public clone(): UnixConn {
		const cloned = new UnixConn()
		cloned._fields = {
			conn: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.conn.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async CloseRead(): globalThis.Promise<$.GoError> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		if (!$.pointerValue<UnixConn>(c).conn.ok()) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await __goscript_fd_fake.netFD.prototype.closeRead.call($.pointerValue<UnixConn>(c).conn.fd)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "close", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public async CloseWrite(): globalThis.Promise<$.GoError> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		if (!$.pointerValue<UnixConn>(c).conn.ok()) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await __goscript_fd_fake.netFD.prototype.closeWrite.call($.pointerValue<UnixConn>(c).conn.fd)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "close", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public async ReadFrom(b: $.Slice<number>): globalThis.Promise<[number, __goscript_net.Addr | null, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		if (!$.pointerValue<UnixConn>(c).conn.ok()) {
			return [0, null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple0: any = await UnixConn.prototype.readFrom.call(c, b)
		let n = __goscriptTuple0[0]
		let addr: UnixAddr | $.VarRef<UnixAddr> | null = __goscriptTuple0[1]
		let err = __goscriptTuple0[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		if (addr == null) {
			return [n, null, err]
		}
		return [n, $.interfaceValue<__goscript_net.Addr | null>(addr, "*net.UnixAddr"), err]
	}

	public async ReadFromUnix(b: $.Slice<number>): globalThis.Promise<[number, UnixAddr | $.VarRef<UnixAddr> | null, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		if (!$.pointerValue<UnixConn>(c).conn.ok()) {
			return [0, null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple1: any = await UnixConn.prototype.readFrom.call(c, b)
		let n = __goscriptTuple1[0]
		let addr: UnixAddr | $.VarRef<UnixAddr> | null = __goscriptTuple1[1]
		let err = __goscriptTuple1[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		return [n, addr, err]
	}

	public async ReadMsgUnix(b: $.Slice<number>, oob: $.Slice<number>): globalThis.Promise<[number, number, number, UnixAddr | $.VarRef<UnixAddr> | null, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let flags: number = 0
		let addr: UnixAddr | $.VarRef<UnixAddr> | null = null as UnixAddr | $.VarRef<UnixAddr> | null
		let err: $.GoError = null as $.GoError
		if (!$.pointerValue<UnixConn>(c).conn.ok()) {
			return [0, 0, 0, null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple2: any = await UnixConn.prototype.readMsg.call(c, b, oob)
		n = __goscriptTuple2[0]
		oobn = __goscriptTuple2[1]
		flags = __goscriptTuple2[2]
		addr = __goscriptTuple2[3]
		err = __goscriptTuple2[4]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		return [n, oobn, flags, addr, err]
	}

	public SyscallConn(): [syscall.RawConn | null, $.GoError] {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		if (!$.pointerValue<UnixConn>(c).conn.ok()) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		return [$.interfaceValue<syscall.RawConn | null>(__goscript_rawconn.newRawConn($.pointerValue<UnixConn>(c).conn.fd), "*net.rawConn"), null]
	}

	public async WriteMsgUnix(b: $.Slice<number>, oob: $.Slice<number>, addr: UnixAddr | $.VarRef<UnixAddr> | null): globalThis.Promise<[number, number, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		if (!$.pointerValue<UnixConn>(c).conn.ok()) {
			return [0, 0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple3: any = await UnixConn.prototype.writeMsg.call(c, b, oob, addr)
		n = __goscriptTuple3[0]
		oobn = __goscriptTuple3[1]
		err = __goscriptTuple3[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField0 = UnixAddr.prototype.opAddr.call(addr); return new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).laddr, Addr: __goscriptLiteralField0, Err: err}) })(), "*net.OpError")
		}
		return [n, oobn, err]
	}

	public async WriteTo(b: $.Slice<number>, addr: __goscript_net.Addr | null): globalThis.Promise<[number, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		if (!$.pointerValue<UnixConn>(c).conn.ok()) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple4: any = $.typeAssertTuple<UnixAddr | $.VarRef<UnixAddr> | null>(addr, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" })
		let a: UnixAddr | $.VarRef<UnixAddr> | null = __goscriptTuple4[0]
		let ok = __goscriptTuple4[1]
		if (!ok) {
			return [0, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).laddr, Addr: addr, Err: $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })}), "*net.OpError")]
		}
		let [n, err] = await UnixConn.prototype.writeTo.call(c, b, a)
		if (err != null) {
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField1 = UnixAddr.prototype.opAddr.call(a); return new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).laddr, Addr: __goscriptLiteralField1, Err: err}) })(), "*net.OpError")
		}
		return [n, err]
	}

	public async WriteToUnix(b: $.Slice<number>, addr: UnixAddr | $.VarRef<UnixAddr> | null): globalThis.Promise<[number, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		if (!$.pointerValue<UnixConn>(c).conn.ok()) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let [n, err] = await UnixConn.prototype.writeTo.call(c, b, addr)
		if (err != null) {
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField2 = UnixAddr.prototype.opAddr.call(addr); return new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).laddr, Addr: __goscriptLiteralField2, Err: err}) })(), "*net.OpError")
		}
		return [n, err]
	}

	public async readFrom(b: $.Slice<number>): globalThis.Promise<[number, UnixAddr | $.VarRef<UnixAddr> | null, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		let addr: UnixAddr | $.VarRef<UnixAddr> | null = null as UnixAddr | $.VarRef<UnixAddr> | null
		let [n, sa, err] = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).fakeNetFD).readFrom(b)
		{
			const __goscriptTypeSwitchValue = sa
			switch (true) {
				case $.typeAssert<syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrUnix" }).ok:
					{
						let sa: syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null = $.typeAssert<syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrUnix" }).value
						if (!$.stringEqual($.pointerValue<syscall.SockaddrUnix>(sa).Name, "")) {
							addr = (() => { const __goscriptLiteralField3 = __goscript_unixsock_posix.sotypeToNet($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).sotype); return new UnixAddr({Name: $.pointerValue<syscall.SockaddrUnix>(sa).Name, Net: __goscriptLiteralField3}) })()
						}
					}
					break
			}
		}
		return [n, addr, err]
	}

	public async readMsg(b: $.Slice<number>, oob: $.Slice<number>): globalThis.Promise<[number, number, number, UnixAddr | $.VarRef<UnixAddr> | null, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let flags: number = 0
		let addr: UnixAddr | $.VarRef<UnixAddr> | null = null as UnixAddr | $.VarRef<UnixAddr> | null
		let err: $.GoError = null as $.GoError
		let sa: syscall.Sockaddr | null = null as syscall.Sockaddr | null
		let __goscriptTuple5: any = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).fakeNetFD).readMsg(b, oob, 0)
		n = __goscriptTuple5[0]
		oobn = __goscriptTuple5[1]
		flags = __goscriptTuple5[2]
		sa = __goscriptTuple5[3]
		err = __goscriptTuple5[4]
		if ((((0 as number) == 0) && (err == null)) && (oobn > 0)) {
			__goscript_unixsock_readmsg_other.setReadMsgCloseOnExec($.goSlice(oob, undefined, oobn))
		}

		{
			const __goscriptTypeSwitchValue = sa
			switch (true) {
				case $.typeAssert<syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrUnix" }).ok:
					{
						let sa: syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null = $.typeAssert<syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrUnix" }).value
						if (!$.stringEqual($.pointerValue<syscall.SockaddrUnix>(sa).Name, "")) {
							addr = (() => { const __goscriptLiteralField4 = __goscript_unixsock_posix.sotypeToNet($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).sotype); return new UnixAddr({Name: $.pointerValue<syscall.SockaddrUnix>(sa).Name, Net: __goscriptLiteralField4}) })()
						}
					}
					break
			}
		}
		return [n, oobn, flags, addr, err]
	}

	public async writeMsg(b: $.Slice<number>, oob: $.Slice<number>, addr: UnixAddr | $.VarRef<UnixAddr> | null): globalThis.Promise<[number, number, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		if (($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).sotype == syscall.SOCK_DGRAM) && $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).isConnected) {
			return [0, 0, __goscript_net.ErrWriteToConnected]
		}
		let sa: syscall.Sockaddr | null = null as syscall.Sockaddr | null
		if (addr != null) {
			if (!$.stringEqual($.pointerValue<UnixAddr>(addr).Net, __goscript_unixsock_posix.sotypeToNet($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).sotype))) {
				return [0, 0, $.namedValueInterfaceValue<$.GoError>(syscall.EAFNOSUPPORT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
			}
			sa = $.interfaceValue<syscall.Sockaddr | null>(new syscall.SockaddrUnix({Name: $.pointerValue<UnixAddr>(addr).Name}), "*syscall.SockaddrUnix")
		}
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).fakeNetFD).writeMsg(b, oob, sa)
	}

	public async writeTo(b: $.Slice<number>, addr: UnixAddr | $.VarRef<UnixAddr> | null): globalThis.Promise<[number, $.GoError]> {
		const c: UnixConn | $.VarRef<UnixConn> | null = this
		if ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).isConnected) {
			return [0, __goscript_net.ErrWriteToConnected]
		}
		if (addr == null) {
			return [0, __goscript_net.errMissingAddress]
		}
		if (!$.stringEqual($.pointerValue<UnixAddr>(addr).Net, __goscript_unixsock_posix.sotypeToNet($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).sotype))) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EAFNOSUPPORT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let sa: syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null = new syscall.SockaddrUnix({Name: $.pointerValue<UnixAddr>(addr).Name})
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixConn>(c).conn.fd).fakeNetFD).writeTo(b, $.interfaceValue<syscall.Sockaddr | null>(sa, "*syscall.SockaddrUnix"))
	}

	public async Close(): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net.conn>(this.conn).Close()
	}

	public File(): any {
		return $.pointerValue<__goscript_net.conn>(this.conn).File()
	}

	public LocalAddr(): any {
		return $.pointerValue<__goscript_net.conn>(this.conn).LocalAddr()
	}

	public async Read(b: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net.conn>(this.conn).Read(b)
	}

	public RemoteAddr(): any {
		return $.pointerValue<__goscript_net.conn>(this.conn).RemoteAddr()
	}

	public async SetDeadline(t: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net.conn>(this.conn).SetDeadline(t)
	}

	public async SetReadBuffer(bytes: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net.conn>(this.conn).SetReadBuffer(bytes)
	}

	public async SetReadDeadline(t: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net.conn>(this.conn).SetReadDeadline(t)
	}

	public SetWriteBuffer(bytes: any): any {
		return $.pointerValue<__goscript_net.conn>(this.conn).SetWriteBuffer(bytes)
	}

	public async SetWriteDeadline(t: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net.conn>(this.conn).SetWriteDeadline(t)
	}

	public async Write(b: any): globalThis.Promise<any> {
		return await $.pointerValue<__goscript_net.conn>(this.conn).Write(b)
	}

	public ok(): any {
		return $.pointerValue<__goscript_net.conn>(this.conn).ok()
	}

	static __typeInfo = $.registerStructType(
		"net.UnixConn",
		() => new UnixConn(),
		[{ name: "CloseRead", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "ReadFrom", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "net.Addr" }, { name: "_r2", type: "error" }] }, { name: "ReadFromUnix", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }, { name: "_r2", type: "error" }] }, { name: "ReadMsgUnix", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }, { name: "err", type: "error" }] }, { name: "SyscallConn", args: [], returns: [{ name: "_r0", type: "syscall.RawConn" }, { name: "_r1", type: "error" }] }, { name: "WriteMsgUnix", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "WriteTo", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: "net.Addr" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "WriteToUnix", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "readFrom", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }, { name: "_r2", type: "error" }] }, { name: "readMsg", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }, { name: "err", type: "error" }] }, { name: "writeMsg", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeTo", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "File", args: [], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "err", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "ok", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		UnixConn,
		[{ name: "conn", key: "conn", type: "net.conn", pkgPath: "net", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export class UnixListener {
	public get fd(): __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null {
		return this._fields.fd.value
	}
	public set fd(value: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null) {
		this._fields.fd.value = value
	}

	public get path(): string {
		return this._fields.path.value
	}
	public set path(value: string) {
		this._fields.path.value = value
	}

	public get unlink(): boolean {
		return this._fields.unlink.value
	}
	public set unlink(value: boolean) {
		this._fields.unlink.value = value
	}

	public get unlinkOnce(): sync.Once {
		return this._fields.unlinkOnce.value
	}
	public set unlinkOnce(value: sync.Once) {
		this._fields.unlinkOnce.value = value
	}

	public _fields: {
		fd: $.VarRef<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>
		path: $.VarRef<string>
		unlink: $.VarRef<boolean>
		unlinkOnce: $.VarRef<sync.Once>
	}

	constructor(init?: Partial<{fd?: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, path?: string, unlink?: boolean, unlinkOnce?: sync.Once}>) {
		this._fields = {
			fd: $.varRef(init?.fd ?? null),
			path: $.varRef(init?.path ?? ""),
			unlink: $.varRef(init?.unlink ?? false),
			unlinkOnce: $.varRef(init?.unlinkOnce ? $.markAsStructValue($.cloneStructValue(init.unlinkOnce)) : $.markAsStructValue(new sync.Once()))
		}
	}

	public clone(): UnixListener {
		const cloned = new UnixListener()
		cloned._fields = {
			fd: $.varRef(this._fields.fd.value),
			path: $.varRef(this._fields.path.value),
			unlink: $.varRef(this._fields.unlink.value),
			unlinkOnce: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.unlinkOnce.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Accept(): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
		const l: UnixListener | $.VarRef<UnixListener> | null = this
		if (!UnixListener.prototype.ok.call(l)) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple7: any = await UnixListener.prototype.accept.call(l)
		let c: UnixConn | $.VarRef<UnixConn> | null = __goscriptTuple7[0]
		let err = __goscriptTuple7[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "accept", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(l).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(l).fd).laddr, Err: err}), "*net.OpError")]
		}
		return [$.interfaceValue<__goscript_net.Conn | null>(c, "*net.UnixConn"), null]
	}

	public async AcceptUnix(): globalThis.Promise<[UnixConn | $.VarRef<UnixConn> | null, $.GoError]> {
		const l: UnixListener | $.VarRef<UnixListener> | null = this
		if (!UnixListener.prototype.ok.call(l)) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple8: any = await UnixListener.prototype.accept.call(l)
		let c: UnixConn | $.VarRef<UnixConn> | null = __goscriptTuple8[0]
		let err = __goscriptTuple8[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "accept", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(l).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(l).fd).laddr, Err: err}), "*net.OpError")]
		}
		return [c, null]
	}

	public Addr(): __goscript_net.Addr | null {
		const l: UnixListener | $.VarRef<UnixListener> | null = this
		return $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(l).fd).laddr
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const l: UnixListener | $.VarRef<UnixListener> | null = this
		if (!UnixListener.prototype.ok.call(l)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await UnixListener.prototype.close.call(l)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "close", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(l).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(l).fd).laddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public File(): [os.File | $.VarRef<os.File> | null, $.GoError] {
		const l: UnixListener | $.VarRef<UnixListener> | null = this
		let f: os.File | $.VarRef<os.File> | null = null as os.File | $.VarRef<os.File> | null
		let err: $.GoError = null as $.GoError
		if (!UnixListener.prototype.ok.call(l)) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple9: any = UnixListener.prototype.file.call(l)
		f = __goscriptTuple9[0]
		err = __goscriptTuple9[1]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "file", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(l).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(l).fd).laddr, Err: err}), "*net.OpError")
		}
		return [f, err]
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const l: UnixListener | $.VarRef<UnixListener> | null = this
		if (!UnixListener.prototype.ok.call(l)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		return await __goscript_fd_fake.netFD.prototype.SetDeadline.call($.pointerValue<UnixListener>(l).fd, $.markAsStructValue($.cloneStructValue(t)))
	}

	public SetUnlinkOnClose(unlink: boolean): void {
		let l: UnixListener | $.VarRef<UnixListener> | null = this
		$.pointerValue<UnixListener>(l).unlink = unlink
	}

	public SyscallConn(): [syscall.RawConn | null, $.GoError] {
		const l: UnixListener | $.VarRef<UnixListener> | null = this
		if (!UnixListener.prototype.ok.call(l)) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		return [$.interfaceValue<syscall.RawConn | null>(__goscript_rawconn.newRawListener($.pointerValue<UnixListener>(l).fd), "*net.rawListener"), null]
	}

	public async accept(): globalThis.Promise<[UnixConn | $.VarRef<UnixConn> | null, $.GoError]> {
		const ln: UnixListener | $.VarRef<UnixListener> | null = this
		let __goscriptTuple10: any = await __goscript_fd_fake.netFD.prototype.accept.call($.pointerValue<UnixListener>(ln).fd)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple10[0]
		let err = __goscriptTuple10[1]
		if (err != null) {
			return [null, err]
		}
		return [newUnixConn(fd), null]
	}

	public async close(): globalThis.Promise<$.GoError> {
		const ln: UnixListener | $.VarRef<UnixListener> | null = this

		await $.pointerValue<UnixListener>(ln).unlinkOnce.Do($.functionValue((): void => {
			if (($.uint($.indexStringOrBytes($.pointerValue<UnixListener>(ln).path, 0), 8) != $.uint(64, 8)) && $.pointerValue<UnixListener>(ln).unlink) {
				syscall.Unlink($.pointerValue<UnixListener>(ln).path)
			}
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return await __goscript_fd_fake.netFD.prototype.Close.call($.pointerValue<UnixListener>(ln).fd)
	}

	public file(): [os.File | $.VarRef<os.File> | null, $.GoError] {
		const ln: UnixListener | $.VarRef<UnixListener> | null = this
		let __goscriptTuple11: any = $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UnixListener>(ln).fd).fakeNetFD).dup()
		let f: os.File | $.VarRef<os.File> | null = __goscriptTuple11[0]
		let err = __goscriptTuple11[1]
		if (err != null) {
			return [null, err]
		}
		return [f, null]
	}

	public ok(): boolean {
		const ln: UnixListener | $.VarRef<UnixListener> | null = this
		return (ln != null) && ($.pointerValue<UnixListener>(ln).fd != null)
	}

	static __typeInfo = $.registerStructType(
		"net.UnixListener",
		() => new UnixListener(),
		[{ name: "Accept", args: [], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "AcceptUnix", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixConn" } }, { name: "_r1", type: "error" }] }, { name: "Addr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "File", args: [], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "err", type: "error" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetUnlinkOnClose", args: [{ name: "unlink", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }, { name: "SyscallConn", args: [], returns: [{ name: "_r0", type: "syscall.RawConn" }, { name: "_r1", type: "error" }] }, { name: "accept", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixConn" } }, { name: "_r1", type: "error" }] }, { name: "close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "file", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "_r1", type: "error" }] }, { name: "ok", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		UnixListener,
		[{ name: "fd", key: "fd", type: { kind: $.TypeKind.Pointer, elemType: "net.netFD" }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "path", key: "path", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [1], offset: 8, exported: false }, { name: "unlink", key: "unlink", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [2], offset: 24, exported: false }, { name: "unlinkOnce", key: "unlinkOnce", type: "sync.Once", pkgPath: "net", index: [3], offset: 28, exported: false }]
	)
}

export function ResolveUnixAddr(network: string, address: string): [UnixAddr | $.VarRef<UnixAddr> | null, $.GoError] {
	switch (network) {
		case "unix":
		case "unixgram":
		case "unixpacket":
		{
			return [new UnixAddr({Name: address, Net: network}), null]
			break
		}
		default:
		{
			return [null, $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function newUnixConn(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null): UnixConn | $.VarRef<UnixConn> | null {
	return new UnixConn({conn: $.markAsStructValue(new __goscript_net.conn({fd: fd}))})
}

export async function DialUnix(network: string, laddr: UnixAddr | $.VarRef<UnixAddr> | null, raddr: UnixAddr | $.VarRef<UnixAddr> | null): globalThis.Promise<[UnixConn | $.VarRef<UnixConn> | null, $.GoError]> {
	return await dialUnix(context.Background(), null, network, laddr, raddr)
}

export async function dialUnix(ctx: context.Context | null, dialer: __goscript_dial.Dialer | $.VarRef<__goscript_dial.Dialer> | null, network: string, laddr: UnixAddr | $.VarRef<UnixAddr> | null, raddr: UnixAddr | $.VarRef<UnixAddr> | null): globalThis.Promise<[UnixConn | $.VarRef<UnixConn> | null, $.GoError]> {
	switch (network) {
		case "unix":
		case "unixgram":
		case "unixpacket":
		{
			break
		}
		default:
		{
			return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField5 = UnixAddr.prototype.opAddr.call(laddr); const __goscriptLiteralField6 = UnixAddr.prototype.opAddr.call(raddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField5, Addr: __goscriptLiteralField6, Err: $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })}) })(), "*net.OpError")]
			break
		}
	}
	let sd: __goscript_dial.sysDialer | $.VarRef<__goscript_dial.sysDialer> | null = (() => { const __goscriptLiteralField7 = UnixAddr.prototype.String.call(raddr); return new __goscript_dial.sysDialer({network: network, address: __goscriptLiteralField7}) })()
	if (dialer != null) {
		$.pointerValue<__goscript_dial.sysDialer>(sd).Dialer = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_dial.Dialer>(dialer)))
	}
	let __goscriptTuple6: any = await __goscript_dial.sysDialer.prototype.dialUnix.call(sd, ctx, laddr, raddr)
	let c: UnixConn | $.VarRef<UnixConn> | null = __goscriptTuple6[0]
	let err = __goscriptTuple6[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField8 = UnixAddr.prototype.opAddr.call(laddr); const __goscriptLiteralField9 = UnixAddr.prototype.opAddr.call(raddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField8, Addr: __goscriptLiteralField9, Err: err}) })(), "*net.OpError")]
	}
	return [c, null]
}

export async function ListenUnix(network: string, laddr: UnixAddr | $.VarRef<UnixAddr> | null): globalThis.Promise<[UnixListener | $.VarRef<UnixListener> | null, $.GoError]> {
	switch (network) {
		case "unix":
		case "unixpacket":
		{
			break
		}
		default:
		{
			return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField10 = UnixAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField10, Err: $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })}) })(), "*net.OpError")]
			break
		}
	}
	if (laddr == null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField11 = UnixAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField11, Err: __goscript_net.errMissingAddress}) })(), "*net.OpError")]
	}
	let sl: __goscript_dial.sysListener | $.VarRef<__goscript_dial.sysListener> | null = (() => { const __goscriptLiteralField12 = UnixAddr.prototype.String.call(laddr); return new __goscript_dial.sysListener({network: network, address: __goscriptLiteralField12}) })()
	let __goscriptTuple12: any = await __goscript_dial.sysListener.prototype.listenUnix.call(sl, context.Background(), laddr)
	let ln: UnixListener | $.VarRef<UnixListener> | null = __goscriptTuple12[0]
	let err = __goscriptTuple12[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField13 = UnixAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField13, Err: err}) })(), "*net.OpError")]
	}
	return [ln, null]
}

export async function ListenUnixgram(network: string, laddr: UnixAddr | $.VarRef<UnixAddr> | null): globalThis.Promise<[UnixConn | $.VarRef<UnixConn> | null, $.GoError]> {
	switch (network) {
		case "unixgram":
		{
			break
		}
		default:
		{
			return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField14 = UnixAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField14, Err: $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })}) })(), "*net.OpError")]
			break
		}
	}
	if (laddr == null) {
		return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: null, Err: __goscript_net.errMissingAddress}), "*net.OpError")]
	}
	let sl: __goscript_dial.sysListener | $.VarRef<__goscript_dial.sysListener> | null = (() => { const __goscriptLiteralField15 = UnixAddr.prototype.String.call(laddr); return new __goscript_dial.sysListener({network: network, address: __goscriptLiteralField15}) })()
	let __goscriptTuple13: any = await __goscript_dial.sysListener.prototype.listenUnixgram.call(sl, context.Background(), laddr)
	let c: UnixConn | $.VarRef<UnixConn> | null = __goscriptTuple13[0]
	let err = __goscriptTuple13[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField16 = UnixAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField16, Err: err}) })(), "*net.OpError")]
	}
	return [c, null]
}
