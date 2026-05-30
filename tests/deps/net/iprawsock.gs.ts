// Generated file based on iprawsock.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import type * as io from "@goscript/io/index.js"

import type * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import type * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import * as __goscript__interface from "./interface.gs.ts"

import * as __goscript_dial from "./dial.gs.ts"

import type * as __goscript_dnsclient from "./dnsclient.gs.ts"

import * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.ts"

import type * as __goscript_dnsconfig from "./dnsconfig.gs.ts"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_ipsock_posix from "./ipsock_posix.gs.ts"

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

import type * as __goscript_unixsock from "./unixsock.gs.ts"

import * as __goscript_unixsock_posix from "./unixsock_posix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/syscall/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/internal/singleflight/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./interface.gs.ts"
import "./dial.gs.ts"
import "./dnsclient_unix.gs.ts"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./ip.gs.ts"
import "./iprawsock_posix.gs.ts"
import "./ipsock.gs.ts"
import "./ipsock_posix.gs.ts"
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

export class IPAddr {
	public get IP(): __goscript_ip.IP {
		return this._fields.IP.value
	}
	public set IP(value: __goscript_ip.IP) {
		this._fields.IP.value = value
	}

	public get Zone(): string {
		return this._fields.Zone.value
	}
	public set Zone(value: string) {
		this._fields.Zone.value = value
	}

	public _fields: {
		IP: $.VarRef<__goscript_ip.IP>
		Zone: $.VarRef<string>
	}

	constructor(init?: Partial<{IP?: __goscript_ip.IP, Zone?: string}>) {
		this._fields = {
			IP: $.varRef(init?.IP ?? null),
			Zone: $.varRef(init?.Zone ?? "")
		}
	}

	public clone(): IPAddr {
		const cloned = new IPAddr()
		cloned._fields = {
			IP: $.varRef(this._fields.IP.value),
			Zone: $.varRef(this._fields.Zone.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Network(): string {
		const a: IPAddr | $.VarRef<IPAddr> | null = this
		return "ip"
	}

	public String(): string {
		const a: IPAddr | $.VarRef<IPAddr> | null = this
		if (a == null) {
			return "<nil>"
		}
		let ip = __goscript_ip.ipEmptyString(($.pointerValue<IPAddr>(a).IP as __goscript_ip.IP))
		if (!$.stringEqual($.pointerValue<IPAddr>(a).Zone, "")) {
			return (ip + "%") + $.pointerValue<IPAddr>(a).Zone
		}
		return ip
	}

	public family(): number {
		const a: IPAddr | $.VarRef<IPAddr> | null = this
		if ((a == null) || ($.len(($.pointerValue<IPAddr>(a).IP as __goscript_ip.IP)) <= 4)) {
			return syscall.AF_INET
		}
		if (__goscript_ip.IP_To4($.pointerValue<IPAddr>(a).IP) != null) {
			return syscall.AF_INET
		}
		return syscall.AF_INET6
	}

	public isWildcard(): boolean {
		const a: IPAddr | $.VarRef<IPAddr> | null = this
		if ((a == null) || ($.pointerValue<IPAddr>(a).IP == null)) {
			return true
		}
		return __goscript_ip.IP_IsUnspecified($.pointerValue<IPAddr>(a).IP)
	}

	public opAddr(): __goscript_net.Addr | null {
		const a: IPAddr | $.VarRef<IPAddr> | null = this
		if (a == null) {
			return null
		}
		return $.interfaceValue<__goscript_net.Addr | null>(a, "*net.IPAddr")
	}

	public async sockaddr(family: number): globalThis.Promise<[syscall.Sockaddr | null, $.GoError]> {
		const a: IPAddr | $.VarRef<IPAddr> | null = this
		if (a == null) {
			return [null, null]
		}
		return await __goscript_ipsock_posix.ipToSockaddr(family, ($.pointerValue<IPAddr>(a).IP as __goscript_ip.IP), 0, $.pointerValue<IPAddr>(a).Zone)
	}

	public toLocal(net: string): __goscript_sockaddr_posix.sockaddr | null {
		const a: IPAddr | $.VarRef<IPAddr> | null = this
		return $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>((() => { const __goscriptLiteralField2 = (__goscript_ipsock.loopbackIP(net) as __goscript_ip.IP); return new IPAddr({IP: __goscriptLiteralField2, Zone: $.pointerValue<IPAddr>(a).Zone}) })(), "*net.IPAddr")
	}

	static __typeInfo = $.registerStructType(
		"net.IPAddr",
		() => new IPAddr(),
		[{ name: "Network", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "family", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "isWildcard", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "opAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "sockaddr", args: [{ name: "family", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "syscall.Sockaddr" }, { name: "_r1", type: "error" }] }, { name: "toLocal", args: [{ name: "net", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.sockaddr" }] }],
		IPAddr,
		[{ name: "IP", key: "IP", type: "net.IP", index: [0], offset: 0, exported: true }, { name: "Zone", key: "Zone", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 24, exported: true }]
	)
}

export class IPConn {
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

	public clone(): IPConn {
		const cloned = new IPConn()
		cloned._fields = {
			conn: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.conn.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async ReadFrom(b: $.Slice<number>): globalThis.Promise<[number, __goscript_net.Addr | null, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this
		if (!$.pointerValue<IPConn>(c).conn.ok()) {
			return [0, null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple1: any = await IPConn.prototype.readFrom.call(c, b)
		let n = __goscriptTuple1[0]
		let addr: IPAddr | $.VarRef<IPAddr> | null = __goscriptTuple1[1]
		let err = __goscriptTuple1[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		if (addr == null) {
			return [n, null, err]
		}
		return [n, $.interfaceValue<__goscript_net.Addr | null>(addr, "*net.IPAddr"), err]
	}

	public async ReadFromIP(b: $.Slice<number>): globalThis.Promise<[number, IPAddr | $.VarRef<IPAddr> | null, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this
		if (!$.pointerValue<IPConn>(c).conn.ok()) {
			return [0, null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple2: any = await IPConn.prototype.readFrom.call(c, b)
		let n = __goscriptTuple2[0]
		let addr: IPAddr | $.VarRef<IPAddr> | null = __goscriptTuple2[1]
		let err = __goscriptTuple2[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		return [n, addr, err]
	}

	public async ReadMsgIP(b: $.Slice<number>, oob: $.Slice<number>): globalThis.Promise<[number, number, number, IPAddr | $.VarRef<IPAddr> | null, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let flags: number = 0
		let addr: IPAddr | $.VarRef<IPAddr> | null = null as IPAddr | $.VarRef<IPAddr> | null
		let err: $.GoError = null as $.GoError
		if (!$.pointerValue<IPConn>(c).conn.ok()) {
			return [0, 0, 0, null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple3: any = await IPConn.prototype.readMsg.call(c, b, oob)
		n = __goscriptTuple3[0]
		oobn = __goscriptTuple3[1]
		flags = __goscriptTuple3[2]
		addr = __goscriptTuple3[3]
		err = __goscriptTuple3[4]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		return [n, oobn, flags, addr, err]
	}

	public SyscallConn(): [syscall.RawConn | null, $.GoError] {
		const c: IPConn | $.VarRef<IPConn> | null = this
		if (!$.pointerValue<IPConn>(c).conn.ok()) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		return [$.interfaceValue<syscall.RawConn | null>(__goscript_rawconn.newRawConn($.pointerValue<IPConn>(c).conn.fd), "*net.rawConn"), null]
	}

	public async WriteMsgIP(b: $.Slice<number>, oob: $.Slice<number>, addr: IPAddr | $.VarRef<IPAddr> | null): globalThis.Promise<[number, number, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		if (!$.pointerValue<IPConn>(c).conn.ok()) {
			return [0, 0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple4: any = await IPConn.prototype.writeMsg.call(c, b, oob, addr)
		n = __goscriptTuple4[0]
		oobn = __goscriptTuple4[1]
		err = __goscriptTuple4[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField3 = IPAddr.prototype.opAddr.call(addr); return new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).laddr, Addr: __goscriptLiteralField3, Err: err}) })(), "*net.OpError")
		}
		return [n, oobn, err]
	}

	public async WriteTo(b: $.Slice<number>, addr: __goscript_net.Addr | null): globalThis.Promise<[number, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this
		if (!$.pointerValue<IPConn>(c).conn.ok()) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple5: any = $.typeAssertTuple<IPAddr | $.VarRef<IPAddr> | null>(addr, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" })
		let a: IPAddr | $.VarRef<IPAddr> | null = __goscriptTuple5[0]
		let ok = __goscriptTuple5[1]
		if (!ok) {
			return [0, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).laddr, Addr: addr, Err: $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })}), "*net.OpError")]
		}
		let [n, err] = await IPConn.prototype.writeTo.call(c, b, a)
		if (err != null) {
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField4 = IPAddr.prototype.opAddr.call(a); return new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).laddr, Addr: __goscriptLiteralField4, Err: err}) })(), "*net.OpError")
		}
		return [n, err]
	}

	public async WriteToIP(b: $.Slice<number>, addr: IPAddr | $.VarRef<IPAddr> | null): globalThis.Promise<[number, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this
		if (!$.pointerValue<IPConn>(c).conn.ok()) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let [n, err] = await IPConn.prototype.writeTo.call(c, b, addr)
		if (err != null) {
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField5 = IPAddr.prototype.opAddr.call(addr); return new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).laddr, Addr: __goscriptLiteralField5, Err: err}) })(), "*net.OpError")
		}
		return [n, err]
	}

	public async readFrom(b: $.Slice<number>): globalThis.Promise<[number, IPAddr | $.VarRef<IPAddr> | null, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this

		// Network returns the address's network name, "ip".
		let addr: IPAddr | $.VarRef<IPAddr> | null = null as IPAddr | $.VarRef<IPAddr> | null
		let [n, sa, err] = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).fakeNetFD).readFrom(b)
		{
			const __goscriptTypeSwitchValue = sa
			switch (true) {
				case $.typeAssert<syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" }).ok:
					{
						let sa: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null = $.typeAssert<syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" }).value
						addr = new IPAddr({IP: ($.goSlice($.pointerValue<syscall.SockaddrInet4>(sa).Addr, 0, undefined) as __goscript_ip.IP)})
						n = __goscript_iprawsock_posix.stripIPv4Header(n, b)
					}
					break
				case $.typeAssert<syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" }).ok:
					{
						let sa: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null = $.typeAssert<syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" }).value
						addr = (await (async () => { const __goscriptLiteralField6 = await $.pointerValue<__goscript__interface.ipv6ZoneCache>(__goscript__interface.zoneCache).name($.int($.pointerValue<syscall.SockaddrInet6>(sa).ZoneId)); return new IPAddr({IP: ($.goSlice($.pointerValue<syscall.SockaddrInet6>(sa).Addr, 0, undefined) as __goscript_ip.IP), Zone: __goscriptLiteralField6}) })())
					}
					break
			}
		}
		return [n, addr, err]
	}

	public async readMsg(b: $.Slice<number>, oob: $.Slice<number>): globalThis.Promise<[number, number, number, IPAddr | $.VarRef<IPAddr> | null, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let flags: number = 0
		let addr: IPAddr | $.VarRef<IPAddr> | null = null as IPAddr | $.VarRef<IPAddr> | null
		let err: $.GoError = null as $.GoError
		let sa: syscall.Sockaddr | null = null as syscall.Sockaddr | null
		let __goscriptTuple6: any = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).fakeNetFD).readMsg(b, oob, 0)
		n = __goscriptTuple6[0]
		oobn = __goscriptTuple6[1]
		flags = __goscriptTuple6[2]
		sa = __goscriptTuple6[3]
		err = __goscriptTuple6[4]
		{
			const __goscriptTypeSwitchValue = sa
			switch (true) {
				case $.typeAssert<syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" }).ok:
					{
						let sa: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null = $.typeAssert<syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" }).value
						addr = new IPAddr({IP: ($.goSlice($.pointerValue<syscall.SockaddrInet4>(sa).Addr, 0, undefined) as __goscript_ip.IP)})
					}
					break
				case $.typeAssert<syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" }).ok:
					{
						let sa: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null = $.typeAssert<syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" }).value
						addr = (await (async () => { const __goscriptLiteralField7 = await $.pointerValue<__goscript__interface.ipv6ZoneCache>(__goscript__interface.zoneCache).name($.int($.pointerValue<syscall.SockaddrInet6>(sa).ZoneId)); return new IPAddr({IP: ($.goSlice($.pointerValue<syscall.SockaddrInet6>(sa).Addr, 0, undefined) as __goscript_ip.IP), Zone: __goscriptLiteralField7}) })())
					}
					break
			}
		}
		return [n, oobn, flags, addr, err]
	}

	public async writeMsg(b: $.Slice<number>, oob: $.Slice<number>, addr: IPAddr | $.VarRef<IPAddr> | null): globalThis.Promise<[number, number, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).isConnected) {
			return [0, 0, __goscript_net.ErrWriteToConnected]
		}
		if (addr == null) {
			return [0, 0, __goscript_net.errMissingAddress]
		}
		let __goscriptTuple7: any = await IPAddr.prototype.sockaddr.call(addr, $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).family)
		let sa = __goscriptTuple7[0]
		err = __goscriptTuple7[1]
		if (err != null) {
			return [0, 0, err]
		}
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).fakeNetFD).writeMsg(b, oob, sa)
	}

	public async writeTo(b: $.Slice<number>, addr: IPAddr | $.VarRef<IPAddr> | null): globalThis.Promise<[number, $.GoError]> {
		const c: IPConn | $.VarRef<IPConn> | null = this
		if ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).isConnected) {
			return [0, __goscript_net.ErrWriteToConnected]
		}
		if (addr == null) {
			return [0, __goscript_net.errMissingAddress]
		}
		let [sa, err] = await IPAddr.prototype.sockaddr.call(addr, $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).family)
		if (err != null) {
			return [0, err]
		}
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<IPConn>(c).conn.fd).fakeNetFD).writeTo(b, sa)
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
		"net.IPConn",
		() => new IPConn(),
		[{ name: "ReadFrom", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "net.Addr" }, { name: "_r2", type: "error" }] }, { name: "ReadFromIP", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }, { name: "_r2", type: "error" }] }, { name: "ReadMsgIP", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }, { name: "err", type: "error" }] }, { name: "SyscallConn", args: [], returns: [{ name: "_r0", type: "syscall.RawConn" }, { name: "_r1", type: "error" }] }, { name: "WriteMsgIP", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "WriteTo", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: "net.Addr" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "WriteToIP", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "readFrom", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }, { name: "_r2", type: "error" }] }, { name: "readMsg", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }, { name: "err", type: "error" }] }, { name: "writeMsg", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "oob", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "oobn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeTo", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "addr", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "File", args: [], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "err", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteBuffer", args: [{ name: "bytes", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "ok", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		IPConn,
		[{ name: "conn", key: "conn", type: "net.conn", pkgPath: "net", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export function ipAddrFromAddr(addr: netip.Addr): IPAddr | $.VarRef<IPAddr> | null {
	return (() => { const __goscriptLiteralField0 = ($.markAsStructValue($.cloneStructValue(addr)).AsSlice() as __goscript_ip.IP); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue(addr)).Zone(); return new IPAddr({IP: __goscriptLiteralField0, Zone: __goscriptLiteralField1}) })()
}

export async function ResolveIPAddr(network: string, address: string): globalThis.Promise<[IPAddr | $.VarRef<IPAddr> | null, $.GoError]> {
	if ($.stringEqual(network, "")) {
		network = "ip"
	}
	let [afnet, , err] = await __goscript_dial.parseNetwork(context.Background(), network, false)
	if (err != null) {
		return [null, err]
	}
	switch (afnet) {
		case "ip":
		case "ip4":
		case "ip6":
		{
			break
		}
		default:
		{
			return [null, $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
			break
		}
	}
	let __goscriptTuple0: any = await __goscript_lookup.Resolver.prototype.internetAddrList.call(__goscript_lookup.DefaultResolver, context.Background(), afnet, address)
	let addrs: __goscript_ipsock.addrList = (__goscriptTuple0[0] as __goscript_ipsock.addrList)
	err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}
	return [$.mustTypeAssert<IPAddr | $.VarRef<IPAddr> | null>(await __goscript_ipsock.addrList_forResolve(addrs, network, address), { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }), null]
}

export function newIPConn(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null): IPConn | $.VarRef<IPConn> | null {
	return new IPConn({conn: $.markAsStructValue(new __goscript_net.conn({fd: fd}))})
}

export async function DialIP(network: string, laddr: IPAddr | $.VarRef<IPAddr> | null, raddr: IPAddr | $.VarRef<IPAddr> | null): globalThis.Promise<[IPConn | $.VarRef<IPConn> | null, $.GoError]> {
	return await dialIP(context.Background(), null, network, laddr, raddr)
}

export async function dialIP(ctx: context.Context | null, dialer: __goscript_dial.Dialer | $.VarRef<__goscript_dial.Dialer> | null, network: string, laddr: IPAddr | $.VarRef<IPAddr> | null, raddr: IPAddr | $.VarRef<IPAddr> | null): globalThis.Promise<[IPConn | $.VarRef<IPConn> | null, $.GoError]> {
	if (raddr == null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField8 = IPAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField8, Addr: null, Err: __goscript_net.errMissingAddress}) })(), "*net.OpError")]
	}
	let sd: __goscript_dial.sysDialer | $.VarRef<__goscript_dial.sysDialer> | null = (() => { const __goscriptLiteralField9 = IPAddr.prototype.String.call(raddr); return new __goscript_dial.sysDialer({network: network, address: __goscriptLiteralField9}) })()
	if (dialer != null) {
		$.pointerValue<__goscript_dial.sysDialer>(sd).Dialer = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_dial.Dialer>(dialer)))
	}
	let __goscriptTuple8: any = await __goscript_dial.sysDialer.prototype.dialIP.call(sd, ctx, laddr, raddr)
	let c: IPConn | $.VarRef<IPConn> | null = __goscriptTuple8[0]
	let err = __goscriptTuple8[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField10 = IPAddr.prototype.opAddr.call(laddr); const __goscriptLiteralField11 = IPAddr.prototype.opAddr.call(raddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField10, Addr: __goscriptLiteralField11, Err: err}) })(), "*net.OpError")]
	}
	return [c, null]
}

export async function ListenIP(network: string, laddr: IPAddr | $.VarRef<IPAddr> | null): globalThis.Promise<[IPConn | $.VarRef<IPConn> | null, $.GoError]> {
	if (laddr == null) {
		laddr = new IPAddr()
	}
	let sl: __goscript_dial.sysListener | $.VarRef<__goscript_dial.sysListener> | null = (() => { const __goscriptLiteralField12 = IPAddr.prototype.String.call(laddr); return new __goscript_dial.sysListener({network: network, address: __goscriptLiteralField12}) })()
	let __goscriptTuple9: any = await __goscript_dial.sysListener.prototype.listenIP.call(sl, context.Background(), laddr)
	let c: IPConn | $.VarRef<IPConn> | null = __goscriptTuple9[0]
	let err = __goscriptTuple9[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField13 = IPAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField13, Err: err}) })(), "*net.OpError")]
	}
	return [c, null]
}
