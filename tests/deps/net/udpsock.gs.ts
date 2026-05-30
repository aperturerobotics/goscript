// Generated file based on udpsock.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as strconv from "@goscript/internal/strconv/index.js"

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

import type * as __goscript_iprawsock from "./iprawsock.gs.ts"

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

import * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"

import type * as __goscript_unixsock from "./unixsock.gs.ts"

import * as __goscript_unixsock_posix from "./unixsock_posix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/internal/strconv/index.js"
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

export class UDPAddr {
	public get IP(): __goscript_ip.IP {
		return this._fields.IP.value
	}
	public set IP(value: __goscript_ip.IP) {
		this._fields.IP.value = value
	}

	public get Port(): number {
		return this._fields.Port.value
	}
	public set Port(value: number) {
		this._fields.Port.value = value
	}

	public get Zone(): string {
		return this._fields.Zone.value
	}
	public set Zone(value: string) {
		this._fields.Zone.value = value
	}

	public _fields: {
		IP: $.VarRef<__goscript_ip.IP>
		Port: $.VarRef<number>
		Zone: $.VarRef<string>
	}

	constructor(init?: Partial<{IP?: __goscript_ip.IP, Port?: number, Zone?: string}>) {
		this._fields = {
			IP: $.varRef(init?.IP ?? null),
			Port: $.varRef(init?.Port ?? 0),
			Zone: $.varRef(init?.Zone ?? "")
		}
	}

	public clone(): UDPAddr {
		const cloned = new UDPAddr()
		cloned._fields = {
			IP: $.varRef(this._fields.IP.value),
			Port: $.varRef(this._fields.Port.value),
			Zone: $.varRef(this._fields.Zone.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AddrPort(): netip.AddrPort {
		const a: UDPAddr | $.VarRef<UDPAddr> | null = this
		if (a == null) {
			return $.markAsStructValue(new netip.AddrPort())
		}
		let [na, ] = netip.AddrFromSlice($.pointerValue<UDPAddr>(a).IP)
		na = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(na)).WithZone($.pointerValue<UDPAddr>(a).Zone)))
		return $.markAsStructValue($.cloneStructValue(netip.AddrPortFrom($.markAsStructValue($.cloneStructValue(na)), $.uint($.uint($.pointerValue<UDPAddr>(a).Port, 16), 16))))
	}

	public Network(): string {
		const a: UDPAddr | $.VarRef<UDPAddr> | null = this
		return "udp"
	}

	public String(): string {
		const a: UDPAddr | $.VarRef<UDPAddr> | null = this
		if (a == null) {
			return "<nil>"
		}
		let ip = __goscript_ip.ipEmptyString(($.pointerValue<UDPAddr>(a).IP as __goscript_ip.IP))
		if (!$.stringEqual($.pointerValue<UDPAddr>(a).Zone, "")) {
			return __goscript_ipsock.JoinHostPort((ip + "%") + $.pointerValue<UDPAddr>(a).Zone, strconv.Itoa($.pointerValue<UDPAddr>(a).Port))
		}
		return __goscript_ipsock.JoinHostPort(ip, strconv.Itoa($.pointerValue<UDPAddr>(a).Port))
	}

	public family(): number {
		const a: UDPAddr | $.VarRef<UDPAddr> | null = this
		if ((a == null) || ($.len(($.pointerValue<UDPAddr>(a).IP as __goscript_ip.IP)) <= 4)) {
			return syscall.AF_INET
		}
		if (__goscript_ip.IP_To4($.pointerValue<UDPAddr>(a).IP) != null) {
			return syscall.AF_INET
		}
		return syscall.AF_INET6
	}

	public isWildcard(): boolean {
		const a: UDPAddr | $.VarRef<UDPAddr> | null = this
		if ((a == null) || ($.pointerValue<UDPAddr>(a).IP == null)) {
			return true
		}
		return __goscript_ip.IP_IsUnspecified($.pointerValue<UDPAddr>(a).IP)
	}

	public opAddr(): __goscript_net.Addr | null {
		const a: UDPAddr | $.VarRef<UDPAddr> | null = this
		if (a == null) {
			return null
		}
		return $.interfaceValue<__goscript_net.Addr | null>(a, "*net.UDPAddr")
	}

	public async sockaddr(family: number): globalThis.Promise<[syscall.Sockaddr | null, $.GoError]> {
		const a: UDPAddr | $.VarRef<UDPAddr> | null = this
		if (a == null) {
			return [null, null]
		}
		return await __goscript_ipsock_posix.ipToSockaddr(family, ($.pointerValue<UDPAddr>(a).IP as __goscript_ip.IP), $.pointerValue<UDPAddr>(a).Port, $.pointerValue<UDPAddr>(a).Zone)
	}

	public toLocal(net: string): __goscript_sockaddr_posix.sockaddr | null {
		const a: UDPAddr | $.VarRef<UDPAddr> | null = this
		return $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>((() => { const __goscriptLiteralField0 = (__goscript_ipsock.loopbackIP(net) as __goscript_ip.IP); return new UDPAddr({IP: __goscriptLiteralField0, Port: $.pointerValue<UDPAddr>(a).Port, Zone: $.pointerValue<UDPAddr>(a).Zone}) })(), "*net.UDPAddr")
	}

	static __typeInfo = $.registerStructType(
		"net.UDPAddr",
		() => new UDPAddr(),
		[{ name: "AddrPort", args: [], returns: [] }, { name: "Network", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "family", args: [], returns: [] }, { name: "isWildcard", args: [], returns: [] }, { name: "opAddr", args: [], returns: [] }, { name: "sockaddr", args: [], returns: [] }, { name: "toLocal", args: [], returns: [] }],
		UDPAddr,
		[{ name: "IP", key: "IP", type: "net.IP", index: [0], offset: 0, exported: true }, { name: "Port", key: "Port", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 24, exported: true }, { name: "Zone", key: "Zone", type: { kind: $.TypeKind.Basic, name: "string" }, index: [2], offset: 32, exported: true }]
	)
}

export class addrPortUDPAddr {
	public get AddrPort(): netip.AddrPort {
		return this._fields.AddrPort.value
	}
	public set AddrPort(value: netip.AddrPort) {
		this._fields.AddrPort.value = value
	}

	public _fields: {
		AddrPort: $.VarRef<netip.AddrPort>
	}

	constructor(init?: Partial<{AddrPort?: netip.AddrPort}>) {
		this._fields = {
			AddrPort: $.varRef(init?.AddrPort ? $.markAsStructValue($.cloneStructValue(init.AddrPort)) : $.markAsStructValue(new netip.AddrPort()))
		}
	}

	public clone(): addrPortUDPAddr {
		const cloned = new addrPortUDPAddr()
		cloned._fields = {
			AddrPort: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.AddrPort.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Network(): string {
		return "udp"
	}

	public Addr(): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).Addr()
	}

	public AppendBinary(b: any): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).AppendBinary(b)
	}

	public AppendText(b: any): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).AppendText(b)
	}

	public AppendTo(b: any): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).AppendTo(b)
	}

	public Compare(p2: any): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).Compare(p2)
	}

	public IsValid(): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).IsValid()
	}

	public MarshalBinary(): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).MarshalBinary()
	}

	public MarshalText(): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).MarshalText()
	}

	public Port(): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).Port()
	}

	public String(): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).String()
	}

	public UnmarshalBinary(b: any): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).UnmarshalBinary(b)
	}

	public UnmarshalText(text: any): any {
		return $.pointerValue<netip.AddrPort>(this.AddrPort).UnmarshalText(text)
	}

	static __typeInfo = $.registerStructType(
		"net.addrPortUDPAddr",
		() => new addrPortUDPAddr(),
		[{ name: "Network", args: [], returns: [] }, { name: "Addr", args: [], returns: [] }, { name: "AppendBinary", args: [], returns: [] }, { name: "AppendText", args: [], returns: [] }, { name: "AppendTo", args: [], returns: [] }, { name: "Compare", args: [], returns: [] }, { name: "IsValid", args: [], returns: [] }, { name: "MarshalBinary", args: [], returns: [] }, { name: "MarshalText", args: [], returns: [] }, { name: "Port", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "UnmarshalBinary", args: [], returns: [] }, { name: "UnmarshalText", args: [], returns: [] }],
		addrPortUDPAddr,
		[{ name: "AddrPort", key: "AddrPort", type: "netip.AddrPort", anonymous: true, index: [0], offset: 0, exported: true }]
	)
}

export class UDPConn {
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

	public clone(): UDPConn {
		const cloned = new UDPConn()
		cloned._fields = {
			conn: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.conn.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async ReadFrom(b: $.Slice<number>): globalThis.Promise<[number, __goscript_net.Addr | null, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let __goscriptTuple1: any = await UDPConn.prototype.readFromUDP.call(c, b, new UDPAddr())
		let n = __goscriptTuple1[0]
		let addr: UDPAddr | $.VarRef<UDPAddr> | null = __goscriptTuple1[1]
		let err = __goscriptTuple1[2]
		if (addr == null) {
			// Return Addr(nil), not Addr(*UDPConn(nil)).
			return [n, null, err]
		}
		return [n, $.interfaceValue<__goscript_net.Addr | null>(addr, "*net.UDPAddr"), err]
	}

	public async ReadFromUDP(b: $.Slice<number>): globalThis.Promise<[number, UDPAddr | $.VarRef<UDPAddr> | null, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let addr: UDPAddr | $.VarRef<UDPAddr> | null = null as UDPAddr | $.VarRef<UDPAddr> | null
		let err: $.GoError = null as $.GoError
		// This function is designed to allow the caller to control the lifetime
		// of the returned *UDPAddr and thereby prevent an allocation.
		// See https://blog.filippo.io/efficient-go-apis-with-the-inliner/.
		// The real work is done by readFromUDP, below.
		return await UDPConn.prototype.readFromUDP.call(c, b, new UDPAddr())
	}

	public async ReadFromUDPAddrPort(b: $.Slice<number>): globalThis.Promise<[number, netip.AddrPort, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let addr: netip.AddrPort = $.markAsStructValue(new netip.AddrPort())
		let err: $.GoError = null as $.GoError
		if (!$.pointerValue<UDPConn>(c).conn.ok()) {
			return [0, $.markAsStructValue(new netip.AddrPort()), $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple2: any = await UDPConn.prototype.readFromAddrPort.call(c, b)
		n = __goscriptTuple2[0]
		addr = __goscriptTuple2[1]
		err = __goscriptTuple2[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		return [n, $.markAsStructValue($.cloneStructValue(addr)), err]
	}

	public async ReadMsgUDP(b: $.Slice<number>, oob: $.Slice<number>): globalThis.Promise<[number, number, number, UDPAddr | $.VarRef<UDPAddr> | null, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let flags: number = 0
		let addr: UDPAddr | $.VarRef<UDPAddr> | null = null as UDPAddr | $.VarRef<UDPAddr> | null
		let err: $.GoError = null as $.GoError
		let ap: netip.AddrPort = $.markAsStructValue(new netip.AddrPort())
		let __goscriptTuple3: any = await UDPConn.prototype.ReadMsgUDPAddrPort.call(c, b, oob)
		n = __goscriptTuple3[0]
		oobn = __goscriptTuple3[1]
		flags = __goscriptTuple3[2]
		ap = __goscriptTuple3[3]
		err = __goscriptTuple3[4]
		if ($.markAsStructValue($.cloneStructValue(ap)).IsValid()) {
			addr = UDPAddrFromAddrPort($.markAsStructValue($.cloneStructValue(ap)))
		}
		return [n, oobn, flags, addr, err]
	}

	public async ReadMsgUDPAddrPort(b: $.Slice<number>, oob: $.Slice<number>): globalThis.Promise<[number, number, number, netip.AddrPort, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let flags: number = 0
		let addr: netip.AddrPort = $.markAsStructValue(new netip.AddrPort())
		let err: $.GoError = null as $.GoError
		if (!$.pointerValue<UDPConn>(c).conn.ok()) {
			return [0, 0, 0, $.markAsStructValue(new netip.AddrPort()), $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple4: any = await UDPConn.prototype.readMsg.call(c, b, oob)
		n = __goscriptTuple4[0]
		oobn = __goscriptTuple4[1]
		flags = __goscriptTuple4[2]
		addr = __goscriptTuple4[3]
		err = __goscriptTuple4[4]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		return [n, oobn, flags, addr, err]
	}

	public SyscallConn(): [syscall.RawConn | null, $.GoError] {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		if (!$.pointerValue<UDPConn>(c).conn.ok()) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		return [$.interfaceValue<syscall.RawConn | null>(__goscript_rawconn.newRawConn($.pointerValue<UDPConn>(c).conn.fd), "*net.rawConn"), null]
	}

	public async WriteMsgUDP(b: $.Slice<number>, oob: $.Slice<number>, addr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[number, number, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		if (!$.pointerValue<UDPConn>(c).conn.ok()) {
			return [0, 0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple5: any = await UDPConn.prototype.writeMsg.call(c, b, oob, addr)
		n = __goscriptTuple5[0]
		oobn = __goscriptTuple5[1]
		err = __goscriptTuple5[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField4 = UDPAddr.prototype.opAddr.call(addr); return new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).laddr, Addr: __goscriptLiteralField4, Err: err}) })(), "*net.OpError")
		}
		return [n, oobn, err]
	}

	public async WriteMsgUDPAddrPort(b: $.Slice<number>, oob: $.Slice<number>, addr: netip.AddrPort): globalThis.Promise<[number, number, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		if (!$.pointerValue<UDPConn>(c).conn.ok()) {
			return [0, 0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple6: any = await UDPConn.prototype.writeMsgAddrPort.call(c, b, oob, $.markAsStructValue($.cloneStructValue(addr)))
		n = __goscriptTuple6[0]
		oobn = __goscriptTuple6[1]
		err = __goscriptTuple6[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).laddr, Addr: $.interfaceValue<__goscript_net.Addr | null>($.markAsStructValue(new addrPortUDPAddr({AddrPort: $.markAsStructValue($.cloneStructValue(addr))})), "net.addrPortUDPAddr"), Err: err}), "*net.OpError")
		}
		return [n, oobn, err]
	}

	public async WriteTo(b: $.Slice<number>, addr: __goscript_net.Addr | null): globalThis.Promise<[number, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		if (!$.pointerValue<UDPConn>(c).conn.ok()) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple7: any = $.typeAssertTuple<UDPAddr | $.VarRef<UDPAddr> | null>(addr, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" })
		let a: UDPAddr | $.VarRef<UDPAddr> | null = __goscriptTuple7[0]
		let ok = __goscriptTuple7[1]
		if (!ok) {
			return [0, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).laddr, Addr: addr, Err: $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })}), "*net.OpError")]
		}
		let [n, err] = await UDPConn.prototype.writeTo.call(c, b, a)
		if (err != null) {
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField5 = UDPAddr.prototype.opAddr.call(a); return new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).laddr, Addr: __goscriptLiteralField5, Err: err}) })(), "*net.OpError")
		}
		return [n, err]
	}

	public async WriteToUDP(b: $.Slice<number>, addr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[number, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		if (!$.pointerValue<UDPConn>(c).conn.ok()) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let [n, err] = await UDPConn.prototype.writeTo.call(c, b, addr)
		if (err != null) {
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField6 = UDPAddr.prototype.opAddr.call(addr); return new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).laddr, Addr: __goscriptLiteralField6, Err: err}) })(), "*net.OpError")
		}
		return [n, err]
	}

	public async WriteToUDPAddrPort(b: $.Slice<number>, addr: netip.AddrPort): globalThis.Promise<[number, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		if (!$.pointerValue<UDPConn>(c).conn.ok()) {
			return [0, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let [n, err] = await UDPConn.prototype.writeToAddrPort.call(c, b, $.markAsStructValue($.cloneStructValue(addr)))
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "write", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).laddr, Addr: $.interfaceValue<__goscript_net.Addr | null>($.markAsStructValue(new addrPortUDPAddr({AddrPort: $.markAsStructValue($.cloneStructValue(addr))})), "net.addrPortUDPAddr"), Err: err}), "*net.OpError")
		}
		return [n, err]
	}

	public async readFrom(b: $.Slice<number>, addr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[number, UDPAddr | $.VarRef<UDPAddr> | null, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		switch ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).family) {
			case syscall.AF_INET:
			{
				let _from: $.VarRef<syscall.SockaddrInet4> = $.varRef($.markAsStructValue(new syscall.SockaddrInet4()))
				let __goscriptTuple8: any = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).readFromInet4(b, _from)
				n = __goscriptTuple8[0]
				err = __goscriptTuple8[1]
				if (err == null) {
					let ip = _from.value.Addr
					$.assignStruct($.pointerValue<UDPAddr>(addr), $.markAsStructValue(new UDPAddr({IP: ($.goSlice(ip, undefined, undefined) as __goscript_ip.IP), Port: _from.value.Port})))
				}
				break
			}
			case syscall.AF_INET6:
			{
				let _from: $.VarRef<syscall.SockaddrInet6> = $.varRef($.markAsStructValue(new syscall.SockaddrInet6()))
				let __goscriptTuple9: any = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).readFromInet6(b, _from)
				n = __goscriptTuple9[0]
				err = __goscriptTuple9[1]
				if (err == null) {
					let ip = _from.value.Addr
					$.assignStruct($.pointerValue<UDPAddr>(addr), (await (async () => { const __goscriptLiteralField7 = await $.pointerValue<__goscript__interface.ipv6ZoneCache>(__goscript__interface.zoneCache).name($.int(_from.value.ZoneId)); return $.markAsStructValue(new UDPAddr({IP: ($.goSlice(ip, undefined, undefined) as __goscript_ip.IP), Port: _from.value.Port, Zone: __goscriptLiteralField7})) })()))
				}
				break
			}
		}
		if (err != null) {

			addr = null
		}
		return [n, addr, err]
	}

	public async readFromAddrPort(b: $.Slice<number>): globalThis.Promise<[number, netip.AddrPort, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let addr: netip.AddrPort = $.markAsStructValue(new netip.AddrPort())
		let err: $.GoError = null as $.GoError
		let ip: netip.Addr = $.markAsStructValue(new netip.Addr())
		let port: number = 0
		switch ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).family) {
			case syscall.AF_INET:
			{
				let _from: $.VarRef<syscall.SockaddrInet4> = $.varRef($.markAsStructValue(new syscall.SockaddrInet4()))
				let __goscriptTuple10: any = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).readFromInet4(b, _from)
				n = __goscriptTuple10[0]
				err = __goscriptTuple10[1]
				if (err == null) {
					ip = $.markAsStructValue($.cloneStructValue(netip.AddrFrom4(_from.value.Addr)))
					port = _from.value.Port
				}
				break
			}
			case syscall.AF_INET6:
			{
				let _from: $.VarRef<syscall.SockaddrInet6> = $.varRef($.markAsStructValue(new syscall.SockaddrInet6()))
				let __goscriptTuple11: any = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).readFromInet6(b, _from)
				n = __goscriptTuple11[0]
				err = __goscriptTuple11[1]
				if (err == null) {
					ip = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(_from.value.Addr))).WithZone(await $.pointerValue<__goscript__interface.ipv6ZoneCache>(__goscript__interface.zoneCache).name($.int(_from.value.ZoneId)))))
					port = _from.value.Port
				}
				break
			}
		}
		if (err == null) {
			addr = $.markAsStructValue($.cloneStructValue(netip.AddrPortFrom($.markAsStructValue($.cloneStructValue(ip)), $.uint($.uint(port, 16), 16))))
		}
		return [n, $.markAsStructValue($.cloneStructValue(addr)), err]
	}

	public async readFromUDP(b: $.Slice<number>, addr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[number, UDPAddr | $.VarRef<UDPAddr> | null, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		if (!$.pointerValue<UDPConn>(c).conn.ok()) {
			return [0, null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple12: any = await UDPConn.prototype.readFrom.call(c, b, addr)
		let n = __goscriptTuple12[0]
		addr = __goscriptTuple12[1]
		let err = __goscriptTuple12[2]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		return [n, addr, err]
	}

	public async readMsg(b: $.Slice<number>, oob: $.Slice<number>): globalThis.Promise<[number, number, number, netip.AddrPort, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let flags: number = 0
		let addr: netip.AddrPort = $.markAsStructValue(new netip.AddrPort())
		let err: $.GoError = null as $.GoError
		switch ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).family) {
			case syscall.AF_INET:
			{
				let sa: $.VarRef<syscall.SockaddrInet4> = $.varRef($.markAsStructValue(new syscall.SockaddrInet4()))
				let __goscriptTuple13: any = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).readMsgInet4(b, oob, 0, sa)
				n = __goscriptTuple13[0]
				oobn = __goscriptTuple13[1]
				flags = __goscriptTuple13[2]
				err = __goscriptTuple13[3]
				let ip = $.markAsStructValue($.cloneStructValue(netip.AddrFrom4(sa.value.Addr)))
				addr = $.markAsStructValue($.cloneStructValue(netip.AddrPortFrom($.markAsStructValue($.cloneStructValue(ip)), $.uint($.uint(sa.value.Port, 16), 16))))
				break
			}
			case syscall.AF_INET6:
			{
				let sa: $.VarRef<syscall.SockaddrInet6> = $.varRef($.markAsStructValue(new syscall.SockaddrInet6()))
				let __goscriptTuple14: any = await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).readMsgInet6(b, oob, 0, sa)
				n = __goscriptTuple14[0]
				oobn = __goscriptTuple14[1]
				flags = __goscriptTuple14[2]
				err = __goscriptTuple14[3]
				let ip = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(sa.value.Addr))).WithZone(await $.pointerValue<__goscript__interface.ipv6ZoneCache>(__goscript__interface.zoneCache).name($.int(sa.value.ZoneId)))))
				addr = $.markAsStructValue($.cloneStructValue(netip.AddrPortFrom($.markAsStructValue($.cloneStructValue(ip)), $.uint($.uint(sa.value.Port, 16), 16))))
				break
			}
		}
		return [n, oobn, flags, addr, err]
	}

	public async writeMsg(b: $.Slice<number>, oob: $.Slice<number>, addr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[number, number, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).isConnected && (addr != null)) {
			return [0, 0, __goscript_net.ErrWriteToConnected]
		}
		if (!$.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).isConnected && (addr == null)) {
			return [0, 0, __goscript_net.errMissingAddress]
		}
		let __goscriptTuple15: any = await UDPAddr.prototype.sockaddr.call(addr, $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).family)
		let sa = __goscriptTuple15[0]
		err = __goscriptTuple15[1]
		if (err != null) {
			return [0, 0, err]
		}
		return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).writeMsg(b, oob, sa)
	}

	public async writeMsgAddrPort(b: $.Slice<number>, oob: $.Slice<number>, addr: netip.AddrPort): globalThis.Promise<[number, number, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		let n: number = 0
		let oobn: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).isConnected && $.markAsStructValue($.cloneStructValue(addr)).IsValid()) {
			return [0, 0, __goscript_net.ErrWriteToConnected]
		}
		if (!$.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).isConnected && !$.markAsStructValue($.cloneStructValue(addr)).IsValid()) {
			return [0, 0, __goscript_net.errMissingAddress]
		}

		switch ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).family) {
			case syscall.AF_INET:
			{
				let sap: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null = null as syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null
				if ($.markAsStructValue($.cloneStructValue(addr)).IsValid()) {
					let __goscriptTuple16: any = __goscript_ipsock_posix.addrPortToSockaddrInet4($.markAsStructValue($.cloneStructValue(addr)))
					let sa = $.varRef(__goscriptTuple16[0])
					let __goscriptShadow0 = __goscriptTuple16[1]
					if (__goscriptShadow0 != null) {
						return [0, 0, __goscriptShadow0]
					}
					sap = sa
				}
				return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).writeMsgInet4(b, oob, sap)
				break
			}
			case syscall.AF_INET6:
			{
				let sap: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null = null as syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null
				if ($.markAsStructValue($.cloneStructValue(addr)).IsValid()) {
					let __goscriptTuple17: any = await __goscript_ipsock_posix.addrPortToSockaddrInet6($.markAsStructValue($.cloneStructValue(addr)))
					let sa = $.varRef(__goscriptTuple17[0])
					let __goscriptShadow1 = __goscriptTuple17[1]
					if (__goscriptShadow1 != null) {
						return [0, 0, __goscriptShadow1]
					}
					sap = sa
				}
				return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).writeMsgInet6(b, oob, sap)
				break
			}
			default:
			{
				return [0, 0, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField8 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(addr)).Addr())).String(); return new __goscript_net.AddrError({Err: "invalid address family", Addr: __goscriptLiteralField8}) })(), "*net.AddrError")]
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async writeTo(b: $.Slice<number>, addr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[number, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		if ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).isConnected) {
			return [0, __goscript_net.ErrWriteToConnected]
		}
		if (addr == null) {
			return [0, __goscript_net.errMissingAddress]
		}

		switch ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).family) {
			case syscall.AF_INET:
			{
				let __goscriptTuple18: any = __goscript_ipsock_posix.ipToSockaddrInet4(($.pointerValue<UDPAddr>(addr).IP as __goscript_ip.IP), $.pointerValue<UDPAddr>(addr).Port)
				let sa = $.varRef(__goscriptTuple18[0])
				let err = __goscriptTuple18[1]
				if (err != null) {
					return [0, err]
				}
				return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).writeToInet4(b, sa)
				break
			}
			case syscall.AF_INET6:
			{
				let __goscriptTuple19: any = await __goscript_ipsock_posix.ipToSockaddrInet6(($.pointerValue<UDPAddr>(addr).IP as __goscript_ip.IP), $.pointerValue<UDPAddr>(addr).Port, $.pointerValue<UDPAddr>(addr).Zone)
				let sa = $.varRef(__goscriptTuple19[0])
				let err = __goscriptTuple19[1]
				if (err != null) {
					return [0, err]
				}
				return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).writeToInet6(b, sa)
				break
			}
			default:
			{
				return [0, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField9 = __goscript_ip.IP_String($.pointerValue<UDPAddr>(addr).IP); return new __goscript_net.AddrError({Err: "invalid address family", Addr: __goscriptLiteralField9}) })(), "*net.AddrError")]
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async writeToAddrPort(b: $.Slice<number>, addr: netip.AddrPort): globalThis.Promise<[number, $.GoError]> {
		const c: UDPConn | $.VarRef<UDPConn> | null = this
		if ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).isConnected) {
			return [0, __goscript_net.ErrWriteToConnected]
		}
		if (!$.markAsStructValue($.cloneStructValue(addr)).IsValid()) {
			return [0, __goscript_net.errMissingAddress]
		}

		switch ($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).family) {
			case syscall.AF_INET:
			{
				let __goscriptTuple20: any = __goscript_ipsock_posix.addrPortToSockaddrInet4($.markAsStructValue($.cloneStructValue(addr)))
				let sa = $.varRef(__goscriptTuple20[0])
				let err = __goscriptTuple20[1]
				if (err != null) {
					return [0, err]
				}
				return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).writeToInet4(b, sa)
				break
			}
			case syscall.AF_INET6:
			{
				let __goscriptTuple21: any = await __goscript_ipsock_posix.addrPortToSockaddrInet6($.markAsStructValue($.cloneStructValue(addr)))
				let sa = $.varRef(__goscriptTuple21[0])
				let err = __goscriptTuple21[1]
				if (err != null) {
					return [0, err]
				}
				return await $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<UDPConn>(c).conn.fd).fakeNetFD).writeToInet6(b, sa)
				break
			}
			default:
			{
				return [0, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField10 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(addr)).Addr())).String(); return new __goscript_net.AddrError({Err: "invalid address family", Addr: __goscriptLiteralField10}) })(), "*net.AddrError")]
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
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
		"net.UDPConn",
		() => new UDPConn(),
		[{ name: "ReadFrom", args: [], returns: [] }, { name: "ReadFromUDP", args: [], returns: [] }, { name: "ReadFromUDPAddrPort", args: [], returns: [] }, { name: "ReadMsgUDP", args: [], returns: [] }, { name: "ReadMsgUDPAddrPort", args: [], returns: [] }, { name: "SyscallConn", args: [], returns: [] }, { name: "WriteMsgUDP", args: [], returns: [] }, { name: "WriteMsgUDPAddrPort", args: [], returns: [] }, { name: "WriteTo", args: [], returns: [] }, { name: "WriteToUDP", args: [], returns: [] }, { name: "WriteToUDPAddrPort", args: [], returns: [] }, { name: "readFrom", args: [], returns: [] }, { name: "readFromAddrPort", args: [], returns: [] }, { name: "readFromUDP", args: [], returns: [] }, { name: "readMsg", args: [], returns: [] }, { name: "writeMsg", args: [], returns: [] }, { name: "writeMsgAddrPort", args: [], returns: [] }, { name: "writeTo", args: [], returns: [] }, { name: "writeToAddrPort", args: [], returns: [] }, { name: "Close", args: [], returns: [] }, { name: "File", args: [], returns: [] }, { name: "LocalAddr", args: [], returns: [] }, { name: "Read", args: [], returns: [] }, { name: "RemoteAddr", args: [], returns: [] }, { name: "SetDeadline", args: [], returns: [] }, { name: "SetReadBuffer", args: [], returns: [] }, { name: "SetReadDeadline", args: [], returns: [] }, { name: "SetWriteBuffer", args: [], returns: [] }, { name: "SetWriteDeadline", args: [], returns: [] }, { name: "Write", args: [], returns: [] }, { name: "ok", args: [], returns: [] }],
		UDPConn,
		[{ name: "conn", key: "conn", type: "net.conn", pkgPath: "net", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export async function ResolveUDPAddr(network: string, address: string): globalThis.Promise<[UDPAddr | $.VarRef<UDPAddr> | null, $.GoError]> {
	switch (network) {
		case "udp":
		case "udp4":
		case "udp6":
		{
			break
		}
		case "":
		{
			network = "udp"
			break
		}
		default:
		{
			return [null, $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
			break
		}
	}
	let __goscriptTuple0: any = await __goscript_lookup.Resolver.prototype.internetAddrList.call(__goscript_lookup.DefaultResolver, context.Background(), network, address)
	let addrs: __goscript_ipsock.addrList = (__goscriptTuple0[0] as __goscript_ipsock.addrList)
	let err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}
	return [$.mustTypeAssert<UDPAddr | $.VarRef<UDPAddr> | null>(await __goscript_ipsock.addrList_forResolve(addrs, network, address), { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }), null]
}

export function UDPAddrFromAddrPort(addr: netip.AddrPort): UDPAddr | $.VarRef<UDPAddr> | null {
	return (() => { const __goscriptLiteralField1 = ($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(addr)).Addr())).AsSlice() as __goscript_ip.IP); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(addr)).Addr())).Zone(); const __goscriptLiteralField3 = $.int($.markAsStructValue($.cloneStructValue(addr)).Port()); return new UDPAddr({IP: __goscriptLiteralField1, Zone: __goscriptLiteralField2, Port: __goscriptLiteralField3}) })()
}

export function newUDPConn(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null): UDPConn | $.VarRef<UDPConn> | null {
	return new UDPConn({conn: $.markAsStructValue(new __goscript_net.conn({fd: fd}))})
}

export async function DialUDP(network: string, laddr: UDPAddr | $.VarRef<UDPAddr> | null, raddr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[UDPConn | $.VarRef<UDPConn> | null, $.GoError]> {
	return await dialUDP(context.Background(), null, network, laddr, raddr)
}

export async function dialUDP(ctx: context.Context | null, dialer: __goscript_dial.Dialer | $.VarRef<__goscript_dial.Dialer> | null, network: string, laddr: UDPAddr | $.VarRef<UDPAddr> | null, raddr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[UDPConn | $.VarRef<UDPConn> | null, $.GoError]> {
	switch (network) {
		case "udp":
		case "udp4":
		case "udp6":
		{
			break
		}
		default:
		{
			return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField11 = UDPAddr.prototype.opAddr.call(laddr); const __goscriptLiteralField12 = UDPAddr.prototype.opAddr.call(raddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField11, Addr: __goscriptLiteralField12, Err: $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })}) })(), "*net.OpError")]
			break
		}
	}
	if (raddr == null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField13 = UDPAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField13, Addr: null, Err: __goscript_net.errMissingAddress}) })(), "*net.OpError")]
	}
	let sd: __goscript_dial.sysDialer | $.VarRef<__goscript_dial.sysDialer> | null = (() => { const __goscriptLiteralField14 = UDPAddr.prototype.String.call(raddr); return new __goscript_dial.sysDialer({network: network, address: __goscriptLiteralField14}) })()
	if (dialer != null) {
		$.pointerValue<__goscript_dial.sysDialer>(sd).Dialer = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_dial.Dialer>(dialer)))
	}
	let __goscriptTuple22: any = await __goscript_dial.sysDialer.prototype.dialUDP.call(sd, ctx, laddr, raddr)
	let c: UDPConn | $.VarRef<UDPConn> | null = __goscriptTuple22[0]
	let err = __goscriptTuple22[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField15 = UDPAddr.prototype.opAddr.call(laddr); const __goscriptLiteralField16 = UDPAddr.prototype.opAddr.call(raddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField15, Addr: __goscriptLiteralField16, Err: err}) })(), "*net.OpError")]
	}
	return [c, null]
}

export async function ListenUDP(network: string, laddr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[UDPConn | $.VarRef<UDPConn> | null, $.GoError]> {
	switch (network) {
		case "udp":
		case "udp4":
		case "udp6":
		{
			break
		}
		default:
		{
			return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField17 = UDPAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField17, Err: $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })}) })(), "*net.OpError")]
			break
		}
	}
	if (laddr == null) {
		laddr = new UDPAddr()
	}
	let sl: __goscript_dial.sysListener | $.VarRef<__goscript_dial.sysListener> | null = (() => { const __goscriptLiteralField18 = UDPAddr.prototype.String.call(laddr); return new __goscript_dial.sysListener({network: network, address: __goscriptLiteralField18}) })()
	let __goscriptTuple23: any = await __goscript_dial.sysListener.prototype.listenUDP.call(sl, context.Background(), laddr)
	let c: UDPConn | $.VarRef<UDPConn> | null = __goscriptTuple23[0]
	let err = __goscriptTuple23[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField19 = UDPAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField19, Err: err}) })(), "*net.OpError")]
	}
	return [c, null]
}

export async function ListenMulticastUDP(network: string, ifi: __goscript__interface.Interface | $.VarRef<__goscript__interface.Interface> | null, gaddr: UDPAddr | $.VarRef<UDPAddr> | null): globalThis.Promise<[UDPConn | $.VarRef<UDPConn> | null, $.GoError]> {
	switch (network) {
		case "udp":
		case "udp4":
		case "udp6":
		{
			break
		}
		default:
		{
			return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField20 = UDPAddr.prototype.opAddr.call(gaddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField20, Err: $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })}) })(), "*net.OpError")]
			break
		}
	}
	if ((gaddr == null) || ($.pointerValue<UDPAddr>(gaddr).IP == null)) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField21 = UDPAddr.prototype.opAddr.call(gaddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField21, Err: __goscript_net.errMissingAddress}) })(), "*net.OpError")]
	}
	let sl: __goscript_dial.sysListener | $.VarRef<__goscript_dial.sysListener> | null = (() => { const __goscriptLiteralField22 = UDPAddr.prototype.String.call(gaddr); return new __goscript_dial.sysListener({network: network, address: __goscriptLiteralField22}) })()
	let __goscriptTuple24: any = await __goscript_dial.sysListener.prototype.listenMulticastUDP.call(sl, context.Background(), ifi, gaddr)
	let c: UDPConn | $.VarRef<UDPConn> | null = __goscriptTuple24[0]
	let err = __goscriptTuple24[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField23 = UDPAddr.prototype.opAddr.call(gaddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField23, Err: err}) })(), "*net.OpError")]
	}
	return [c, null]
}
