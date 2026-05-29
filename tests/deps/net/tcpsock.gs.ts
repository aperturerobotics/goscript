// Generated file based on tcpsock.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as strconv from "@goscript/internal/strconv/index.js"

import * as io from "@goscript/io/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as os from "@goscript/os/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import type * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import * as __goscript__interface from "./interface.gs.ts"

import * as __goscript_dial from "./dial.gs.ts"

import type * as __goscript_dnsclient from "./dnsclient.gs.ts"

import * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.ts"

import type * as __goscript_dnsconfig from "./dnsconfig.gs.ts"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_hook from "./hook.gs.ts"

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

import * as __goscript_sendfile_stub from "./sendfile_stub.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_sockopt_fake from "./sockopt_fake.gs.ts"

import * as __goscript_splice_stub from "./splice_stub.gs.ts"

import * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"

import * as __goscript_tcpsock_unix from "./tcpsock_unix.gs.ts"

import * as __goscript_tcpsockopt_stub from "./tcpsockopt_stub.gs.ts"

import type * as __goscript_udpsock from "./udpsock.gs.ts"

import * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"

import type * as __goscript_unixsock from "./unixsock.gs.ts"

import * as __goscript_unixsock_posix from "./unixsock_posix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/internal/strconv/index.js"
import "@goscript/io/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/os/index.js"
import "@goscript/syscall/index.js"
import "@goscript/time/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/internal/singleflight/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "./interface.gs.ts"
import "./dial.gs.ts"
import "./dnsclient_unix.gs.ts"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./hook.gs.ts"
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
import "./sendfile_stub.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./sockopt_fake.gs.ts"
import "./splice_stub.gs.ts"
import "./tcpsock_posix.gs.ts"
import "./tcpsock_unix.gs.ts"
import "./tcpsockopt_stub.gs.ts"
import "./udpsock_posix.gs.ts"
import "./unixsock_posix.gs.ts"

export class TCPAddr {
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

	public clone(): TCPAddr {
		const cloned = new TCPAddr()
		cloned._fields = {
			IP: $.varRef(this._fields.IP.value),
			Port: $.varRef(this._fields.Port.value),
			Zone: $.varRef(this._fields.Zone.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AddrPort(): netip.AddrPort {
		const a: TCPAddr | $.VarRef<TCPAddr> | null = this
		if (a == null) {
			return $.markAsStructValue(new netip.AddrPort())
		}
		let [na, ] = netip.AddrFromSlice($.pointerValue<TCPAddr>(a).IP)
		na = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(na)).WithZone($.pointerValue<TCPAddr>(a).Zone)))
		return $.markAsStructValue($.cloneStructValue(netip.AddrPortFrom($.markAsStructValue($.cloneStructValue(na)), $.uint($.uint($.pointerValue<TCPAddr>(a).Port, 16), 16))))
	}

	public Network(): string {
		const a: TCPAddr | $.VarRef<TCPAddr> | null = this
		return "tcp"
	}

	public String(): string {
		const a: TCPAddr | $.VarRef<TCPAddr> | null = this
		if (a == null) {
			return "<nil>"
		}
		let ip = __goscript_ip.ipEmptyString(($.pointerValue<TCPAddr>(a).IP as __goscript_ip.IP))
		if (!$.stringEqual($.pointerValue<TCPAddr>(a).Zone, "")) {
			return __goscript_ipsock.JoinHostPort((ip + "%") + $.pointerValue<TCPAddr>(a).Zone, strconv.Itoa($.pointerValue<TCPAddr>(a).Port))
		}
		return __goscript_ipsock.JoinHostPort(ip, strconv.Itoa($.pointerValue<TCPAddr>(a).Port))
	}

	public family(): number {
		const a: TCPAddr | $.VarRef<TCPAddr> | null = this
		if ((a == null) || ($.len(($.pointerValue<TCPAddr>(a).IP as __goscript_ip.IP)) <= 4)) {
			return syscall.AF_INET
		}
		if (__goscript_ip.IP_To4($.pointerValue<TCPAddr>(a).IP) != null) {
			return syscall.AF_INET
		}
		return syscall.AF_INET6
	}

	public isWildcard(): boolean {
		const a: TCPAddr | $.VarRef<TCPAddr> | null = this
		if ((a == null) || ($.pointerValue<TCPAddr>(a).IP == null)) {
			return true
		}
		return __goscript_ip.IP_IsUnspecified($.pointerValue<TCPAddr>(a).IP)
	}

	public opAddr(): __goscript_net.Addr | null {
		const a: TCPAddr | $.VarRef<TCPAddr> | null = this
		if (a == null) {
			return null
		}
		return $.interfaceValue<__goscript_net.Addr | null>(a, "*net.TCPAddr")
	}

	public async sockaddr(family: number): globalThis.Promise<[syscall.Sockaddr | null, $.GoError]> {
		const a: TCPAddr | $.VarRef<TCPAddr> | null = this
		if (a == null) {
			return [null, null]
		}
		return await __goscript_ipsock_posix.ipToSockaddr(family, ($.pointerValue<TCPAddr>(a).IP as __goscript_ip.IP), $.pointerValue<TCPAddr>(a).Port, $.pointerValue<TCPAddr>(a).Zone)
	}

	public toLocal(net: string): __goscript_sockaddr_posix.sockaddr | null {
		const a: TCPAddr | $.VarRef<TCPAddr> | null = this
		return $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>((() => { const __goscriptLiteralField0 = (__goscript_ipsock.loopbackIP(net) as __goscript_ip.IP); return new TCPAddr({IP: __goscriptLiteralField0, Port: $.pointerValue<TCPAddr>(a).Port, Zone: $.pointerValue<TCPAddr>(a).Zone}) })(), "*net.TCPAddr")
	}

	static __typeInfo = $.registerStructType(
		"net.TCPAddr",
		() => new TCPAddr(),
		[{ name: "AddrPort", args: [], returns: [] }, { name: "Network", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "family", args: [], returns: [] }, { name: "isWildcard", args: [], returns: [] }, { name: "opAddr", args: [], returns: [] }, { name: "sockaddr", args: [], returns: [] }, { name: "toLocal", args: [], returns: [] }],
		TCPAddr,
		{"IP": "net.IP", "Port": { kind: $.TypeKind.Basic, name: "int" }, "Zone": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class TCPConn {
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

	public clone(): TCPConn {
		const cloned = new TCPConn()
		cloned._fields = {
			conn: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.conn.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async CloseRead(): globalThis.Promise<$.GoError> {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await __goscript_fd_fake.netFD.prototype.closeRead.call($.pointerValue<TCPConn>(c).conn.fd)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "close", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public async CloseWrite(): globalThis.Promise<$.GoError> {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await __goscript_fd_fake.netFD.prototype.closeWrite.call($.pointerValue<TCPConn>(c).conn.fd)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "close", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public MultipathTCP(): [boolean, $.GoError] {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return [false, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		return [__goscript_mptcpsock_stub.isUsingMultipathTCP($.pointerValue<TCPConn>(c).conn.fd), null]
	}

	public async ReadFrom(r: io.Reader | null): globalThis.Promise<[number, $.GoError]> {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return [$.int(0), $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple1: any = await TCPConn.prototype.readFrom.call(c, r)
		let n = $.int(__goscriptTuple1[0])
		let err = __goscriptTuple1[1]
		if ((err != null) && (!$.comparableEqual(err, io.EOF))) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "readfrom", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		return [$.int(n), err]
	}

	public SetKeepAlive(keepalive: boolean): $.GoError {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = __goscript_sockopt_fake.setKeepAlive($.pointerValue<TCPConn>(c).conn.fd, keepalive)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public SetKeepAliveConfig(config: KeepAliveConfig): $.GoError {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}

		{
			let err = __goscript_sockopt_fake.setKeepAlive($.pointerValue<TCPConn>(c).conn.fd, config.Enable)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		{
			let err = __goscript_tcpsockopt_stub.setKeepAliveIdle($.pointerValue<TCPConn>(c).conn.fd, config.Idle)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		{
			let err = __goscript_tcpsockopt_stub.setKeepAliveInterval($.pointerValue<TCPConn>(c).conn.fd, config.Interval)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		{
			let err = __goscript_tcpsockopt_stub.setKeepAliveCount($.pointerValue<TCPConn>(c).conn.fd, config.Count)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}

		return null
	}

	public SetKeepAlivePeriod(d: time.Duration): $.GoError {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = __goscript_tcpsockopt_stub.setKeepAliveIdle($.pointerValue<TCPConn>(c).conn.fd, d)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public async SetLinger(sec: number): globalThis.Promise<$.GoError> {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await __goscript_sockopt_fake.setLinger($.pointerValue<TCPConn>(c).conn.fd, sec)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public SetNoDelay(noDelay: boolean): $.GoError {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = __goscript_tcpsockopt_stub.setNoDelay($.pointerValue<TCPConn>(c).conn.fd, noDelay)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "set", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public SyscallConn(): [syscall.RawConn | null, $.GoError] {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		return [$.interfaceValue<syscall.RawConn | null>(__goscript_rawconn.newRawConn($.pointerValue<TCPConn>(c).conn.fd), "*net.rawConn"), null]
	}

	public async WriteTo(w: io.Writer | null): globalThis.Promise<[number, $.GoError]> {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		if (!$.pointerValue<TCPConn>(c).conn.ok()) {
			return [$.int(0), $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple2: any = await TCPConn.prototype.writeTo.call(c, w)
		let n = $.int(__goscriptTuple2[0])
		let err = __goscriptTuple2[1]
		if ((err != null) && (!$.comparableEqual(err, io.EOF))) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "writeto", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).net, Source: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).laddr, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPConn>(c).conn.fd).raddr, Err: err}), "*net.OpError")
		}
		return [$.int(n), err]
	}

	public async readFrom(r: io.Reader | null): globalThis.Promise<[number, $.GoError]> {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		{
			let __goscriptTuple3: any = __goscript_splice_stub.spliceFrom($.pointerValue<TCPConn>(c).conn.fd, r)
			let n = $.int(__goscriptTuple3[0])
			let err = __goscriptTuple3[1]
			let handled = __goscriptTuple3[2]
			if (handled) {
				return [$.int(n), err]
			}
		}
		{
			let __goscriptTuple4: any = __goscript_sendfile_stub.sendFile($.pointerValue<TCPConn>(c).conn.fd, r)
			let n = $.int(__goscriptTuple4[0])
			let err = __goscriptTuple4[1]
			let handled = __goscriptTuple4[2]
			if (handled) {
				return [$.int(n), err]
			}
		}
		const __goscriptReturn1 = await __goscript_net.genericReadFrom(c, r)
		return [$.int(__goscriptReturn1[0]), __goscriptReturn1[1]]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async writeTo(w: io.Writer | null): globalThis.Promise<[number, $.GoError]> {
		const c: TCPConn | $.VarRef<TCPConn> | null = this
		{
			let __goscriptTuple5: any = __goscript_splice_stub.spliceTo(w, $.pointerValue<TCPConn>(c).conn.fd)
			let n = $.int(__goscriptTuple5[0])
			let err = __goscriptTuple5[1]
			let handled = __goscriptTuple5[2]
			if (handled) {
				return [$.int(n), err]
			}
		}
		const __goscriptReturn2 = await __goscript_net.genericWriteTo(c, w)
		return [$.int(__goscriptReturn2[0]), __goscriptReturn2[1]]
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
		"net.TCPConn",
		() => new TCPConn(),
		[{ name: "CloseRead", args: [], returns: [] }, { name: "CloseWrite", args: [], returns: [] }, { name: "MultipathTCP", args: [], returns: [] }, { name: "ReadFrom", args: [], returns: [] }, { name: "SetKeepAlive", args: [], returns: [] }, { name: "SetKeepAliveConfig", args: [], returns: [] }, { name: "SetKeepAlivePeriod", args: [], returns: [] }, { name: "SetLinger", args: [], returns: [] }, { name: "SetNoDelay", args: [], returns: [] }, { name: "SyscallConn", args: [], returns: [] }, { name: "WriteTo", args: [], returns: [] }, { name: "readFrom", args: [], returns: [] }, { name: "writeTo", args: [], returns: [] }, { name: "Close", args: [], returns: [] }, { name: "File", args: [], returns: [] }, { name: "LocalAddr", args: [], returns: [] }, { name: "Read", args: [], returns: [] }, { name: "RemoteAddr", args: [], returns: [] }, { name: "SetDeadline", args: [], returns: [] }, { name: "SetReadBuffer", args: [], returns: [] }, { name: "SetReadDeadline", args: [], returns: [] }, { name: "SetWriteBuffer", args: [], returns: [] }, { name: "SetWriteDeadline", args: [], returns: [] }, { name: "Write", args: [], returns: [] }, { name: "ok", args: [], returns: [] }],
		TCPConn,
		{"conn": "net.conn"}
	)
}

export class KeepAliveConfig {
	// If Enable is true, keep-alive probes are enabled.
	public get Enable(): boolean {
		return this._fields.Enable.value
	}
	public set Enable(value: boolean) {
		this._fields.Enable.value = value
	}

	// Idle is the time that the connection must be idle before
	// the first keep-alive probe is sent.
	// If zero, a default value of 15 seconds is used.
	public get Idle(): time.Duration {
		return this._fields.Idle.value
	}
	public set Idle(value: time.Duration) {
		this._fields.Idle.value = value
	}

	// Interval is the time between keep-alive probes.
	// If zero, a default value of 15 seconds is used.
	public get Interval(): time.Duration {
		return this._fields.Interval.value
	}
	public set Interval(value: time.Duration) {
		this._fields.Interval.value = value
	}

	// Count is the maximum number of keep-alive probes that
	// can go unanswered before dropping a connection.
	// If zero, a default value of 9 is used.
	public get Count(): number {
		return this._fields.Count.value
	}
	public set Count(value: number) {
		this._fields.Count.value = value
	}

	public _fields: {
		Enable: $.VarRef<boolean>
		Idle: $.VarRef<time.Duration>
		Interval: $.VarRef<time.Duration>
		Count: $.VarRef<number>
	}

	constructor(init?: Partial<{Enable?: boolean, Idle?: time.Duration, Interval?: time.Duration, Count?: number}>) {
		this._fields = {
			Enable: $.varRef(init?.Enable ?? false),
			Idle: $.varRef(init?.Idle ?? 0),
			Interval: $.varRef(init?.Interval ?? 0),
			Count: $.varRef(init?.Count ?? 0)
		}
	}

	public clone(): KeepAliveConfig {
		const cloned = new KeepAliveConfig()
		cloned._fields = {
			Enable: $.varRef(this._fields.Enable.value),
			Idle: $.varRef(this._fields.Idle.value),
			Interval: $.varRef(this._fields.Interval.value),
			Count: $.varRef(this._fields.Count.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.KeepAliveConfig",
		() => new KeepAliveConfig(),
		[],
		KeepAliveConfig,
		{"Enable": { kind: $.TypeKind.Basic, name: "bool" }, "Idle": { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, "Interval": { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, "Count": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class TCPListener {
	public get fd(): __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null {
		return this._fields.fd.value
	}
	public set fd(value: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null) {
		this._fields.fd.value = value
	}

	public get lc(): __goscript_dial.ListenConfig {
		return this._fields.lc.value
	}
	public set lc(value: __goscript_dial.ListenConfig) {
		this._fields.lc.value = value
	}

	public _fields: {
		fd: $.VarRef<__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null>
		lc: $.VarRef<__goscript_dial.ListenConfig>
	}

	constructor(init?: Partial<{fd?: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, lc?: __goscript_dial.ListenConfig}>) {
		this._fields = {
			fd: $.varRef(init?.fd ?? null),
			lc: $.varRef(init?.lc ? $.markAsStructValue($.cloneStructValue(init.lc)) : $.markAsStructValue(new __goscript_dial.ListenConfig()))
		}
	}

	public clone(): TCPListener {
		const cloned = new TCPListener()
		cloned._fields = {
			fd: $.varRef(this._fields.fd.value),
			lc: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.lc.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Accept(): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
		const l: TCPListener | $.VarRef<TCPListener> | null = this
		if (!TCPListener.prototype.ok.call(l)) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple8: any = await TCPListener.prototype.accept.call(l)
		let c: TCPConn | $.VarRef<TCPConn> | null = __goscriptTuple8[0]
		let err = __goscriptTuple8[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "accept", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(l).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(l).fd).laddr, Err: err}), "*net.OpError")]
		}
		return [$.interfaceValue<__goscript_net.Conn | null>(c, "*net.TCPConn"), null]
	}

	public async AcceptTCP(): globalThis.Promise<[TCPConn | $.VarRef<TCPConn> | null, $.GoError]> {
		const l: TCPListener | $.VarRef<TCPListener> | null = this
		if (!TCPListener.prototype.ok.call(l)) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple9: any = await TCPListener.prototype.accept.call(l)
		let c: TCPConn | $.VarRef<TCPConn> | null = __goscriptTuple9[0]
		let err = __goscriptTuple9[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "accept", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(l).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(l).fd).laddr, Err: err}), "*net.OpError")]
		}
		return [c, null]
	}

	public Addr(): __goscript_net.Addr | null {
		const l: TCPListener | $.VarRef<TCPListener> | null = this
		return $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(l).fd).laddr
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const l: TCPListener | $.VarRef<TCPListener> | null = this
		if (!TCPListener.prototype.ok.call(l)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		{
			let err = await TCPListener.prototype.close.call(l)
			if (err != null) {
				return $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "close", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(l).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(l).fd).laddr, Err: err}), "*net.OpError")
			}
		}
		return null
	}

	public File(): [os.File | $.VarRef<os.File> | null, $.GoError] {
		const l: TCPListener | $.VarRef<TCPListener> | null = this
		let f: os.File | $.VarRef<os.File> | null = null as os.File | $.VarRef<os.File> | null
		let err: $.GoError = null as $.GoError
		if (!TCPListener.prototype.ok.call(l)) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		let __goscriptTuple10: any = TCPListener.prototype.file.call(l)
		f = __goscriptTuple10[0]
		err = __goscriptTuple10[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "file", Net: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(l).fd).net, Source: null, Addr: $.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(l).fd).laddr, Err: err}), "*net.OpError")]
		}
		return [f, err]
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const l: TCPListener | $.VarRef<TCPListener> | null = this
		if (!TCPListener.prototype.ok.call(l)) {
			return $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
		}
		return await __goscript_fd_fake.netFD.prototype.SetDeadline.call($.pointerValue<TCPListener>(l).fd, $.markAsStructValue($.cloneStructValue(t)))
	}

	public SyscallConn(): [syscall.RawConn | null, $.GoError] {
		const l: TCPListener | $.VarRef<TCPListener> | null = this
		if (!TCPListener.prototype.ok.call(l)) {
			return [null, $.namedValueInterfaceValue<$.GoError>(syscall.EINVAL, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })]
		}
		return [$.interfaceValue<syscall.RawConn | null>(__goscript_rawconn.newRawListener($.pointerValue<TCPListener>(l).fd), "*net.rawListener"), null]
	}

	public async accept(): globalThis.Promise<[TCPConn | $.VarRef<TCPConn> | null, $.GoError]> {
		const ln: TCPListener | $.VarRef<TCPListener> | null = this
		let __goscriptTuple11: any = await __goscript_fd_fake.netFD.prototype.accept.call($.pointerValue<TCPListener>(ln).fd)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple11[0]
		let err = __goscriptTuple11[1]
		if (err != null) {
			return [null, err]
		}
		return [await newTCPConn(fd, $.pointerValue<TCPListener>(ln).lc.KeepAlive, $.markAsStructValue($.cloneStructValue($.pointerValue<TCPListener>(ln).lc.KeepAliveConfig)), __goscript_hook.__goscript_get_testPreHookSetKeepAlive(), __goscript_hook.__goscript_get_testHookSetKeepAlive()), null]
	}

	public async close(): globalThis.Promise<$.GoError> {
		const ln: TCPListener | $.VarRef<TCPListener> | null = this
		return await __goscript_fd_fake.netFD.prototype.Close.call($.pointerValue<TCPListener>(ln).fd)
	}

	public file(): [os.File | $.VarRef<os.File> | null, $.GoError] {
		const ln: TCPListener | $.VarRef<TCPListener> | null = this
		let __goscriptTuple12: any = $.pointerValue<__goscript_net_fake.fakeNetFD>($.pointerValue<__goscript_fd_fake.netFD>($.pointerValue<TCPListener>(ln).fd).fakeNetFD).dup()
		let f: os.File | $.VarRef<os.File> | null = __goscriptTuple12[0]
		let err = __goscriptTuple12[1]
		if (err != null) {
			return [null, err]
		}
		return [f, null]
	}

	public ok(): boolean {
		const ln: TCPListener | $.VarRef<TCPListener> | null = this
		return (ln != null) && ($.pointerValue<TCPListener>(ln).fd != null)
	}

	static __typeInfo = $.registerStructType(
		"net.TCPListener",
		() => new TCPListener(),
		[{ name: "Accept", args: [], returns: [] }, { name: "AcceptTCP", args: [], returns: [] }, { name: "Addr", args: [], returns: [] }, { name: "Close", args: [], returns: [] }, { name: "File", args: [], returns: [] }, { name: "SetDeadline", args: [], returns: [] }, { name: "SyscallConn", args: [], returns: [] }, { name: "accept", args: [], returns: [] }, { name: "close", args: [], returns: [] }, { name: "file", args: [], returns: [] }, { name: "ok", args: [], returns: [] }],
		TCPListener,
		{"fd": { kind: $.TypeKind.Pointer, elemType: "net.netFD" }, "lc": "net.ListenConfig"}
	)
}

export async function ResolveTCPAddr(network: string, address: string): globalThis.Promise<[TCPAddr | $.VarRef<TCPAddr> | null, $.GoError]> {
	switch (network) {
		case "tcp":
		case "tcp4":
		case "tcp6":
		{
			break
		}
		case "":
		{
			network = "tcp"
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
	return [$.mustTypeAssert<TCPAddr | $.VarRef<TCPAddr> | null>(await __goscript_ipsock.addrList_forResolve(addrs, network, address), { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }), null]
}

export function TCPAddrFromAddrPort(addr: netip.AddrPort): TCPAddr | $.VarRef<TCPAddr> | null {
	return (() => { const __goscriptLiteralField1 = ($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(addr)).Addr())).AsSlice() as __goscript_ip.IP); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(addr)).Addr())).Zone(); const __goscriptLiteralField3 = $.int($.markAsStructValue($.cloneStructValue(addr)).Port()); return new TCPAddr({IP: __goscriptLiteralField1, Zone: __goscriptLiteralField2, Port: __goscriptLiteralField3}) })()
}

export async function newTCPConn(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, keepAliveIdle: time.Duration, keepAliveCfg: KeepAliveConfig, preKeepAliveHook: ((_p0: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null) => void) | null, keepAliveHook: ((_p0: KeepAliveConfig) => void) | null): globalThis.Promise<TCPConn | $.VarRef<TCPConn> | null> {
	__goscript_tcpsockopt_stub.setNoDelay(fd, true)
	if (!keepAliveCfg.Enable && (keepAliveIdle >= 0)) {
		keepAliveCfg = $.markAsStructValue(new KeepAliveConfig({Enable: true, Idle: keepAliveIdle}))
	}
	let c: TCPConn | $.VarRef<TCPConn> | null = new TCPConn({conn: $.markAsStructValue(new __goscript_net.conn({fd: fd}))})
	if (keepAliveCfg.Enable) {
		if (preKeepAliveHook != null) {
			await preKeepAliveHook!(fd)
		}
		TCPConn.prototype.SetKeepAliveConfig.call(c, $.markAsStructValue($.cloneStructValue(keepAliveCfg)))
		if (keepAliveHook != null) {
			await keepAliveHook!($.markAsStructValue($.cloneStructValue(keepAliveCfg)))
		}
	}
	return c
}

export async function DialTCP(network: string, laddr: TCPAddr | $.VarRef<TCPAddr> | null, raddr: TCPAddr | $.VarRef<TCPAddr> | null): globalThis.Promise<[TCPConn | $.VarRef<TCPConn> | null, $.GoError]> {
	return await dialTCP(context.Background(), null, network, laddr, raddr)
}

export async function dialTCP(ctx: context.Context | null, dialer: __goscript_dial.Dialer | $.VarRef<__goscript_dial.Dialer> | null, network: string, laddr: TCPAddr | $.VarRef<TCPAddr> | null, raddr: TCPAddr | $.VarRef<TCPAddr> | null): globalThis.Promise<[TCPConn | $.VarRef<TCPConn> | null, $.GoError]> {
	switch (network) {
		case "tcp":
		case "tcp4":
		case "tcp6":
		{
			break
		}
		default:
		{
			return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField4 = TCPAddr.prototype.opAddr.call(laddr); const __goscriptLiteralField5 = TCPAddr.prototype.opAddr.call(raddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField4, Addr: __goscriptLiteralField5, Err: $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })}) })(), "*net.OpError")]
			break
		}
	}
	if (raddr == null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField6 = TCPAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField6, Addr: null, Err: __goscript_net.errMissingAddress}) })(), "*net.OpError")]
	}
	let sd: __goscript_dial.sysDialer | $.VarRef<__goscript_dial.sysDialer> | null = (() => { const __goscriptLiteralField7 = TCPAddr.prototype.String.call(raddr); return new __goscript_dial.sysDialer({network: network, address: __goscriptLiteralField7}) })()
	let c: TCPConn | $.VarRef<TCPConn> | null = null as TCPConn | $.VarRef<TCPConn> | null
	let err: $.GoError = null as $.GoError
	if (dialer != null) {
		$.pointerValue<__goscript_dial.sysDialer>(sd).Dialer = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_dial.Dialer>(dialer)))
	}
	if ($.pointerValue<__goscript_dial.sysDialer>(sd).Dialer.MultipathTCP()) {
		let __goscriptTuple6: any = await __goscript_dial.sysDialer.prototype.dialMPTCP.call(sd, ctx, laddr, raddr)
		c = __goscriptTuple6[0]
		err = __goscriptTuple6[1]
	} else {
		let __goscriptTuple7: any = await __goscript_dial.sysDialer.prototype.dialTCP.call(sd, ctx, laddr, raddr)
		c = __goscriptTuple7[0]
		err = __goscriptTuple7[1]
	}
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField8 = TCPAddr.prototype.opAddr.call(laddr); const __goscriptLiteralField9 = TCPAddr.prototype.opAddr.call(raddr); return new __goscript_net.OpError({Op: "dial", Net: network, Source: __goscriptLiteralField8, Addr: __goscriptLiteralField9, Err: err}) })(), "*net.OpError")]
	}
	return [c, null]
}

export async function ListenTCP(network: string, laddr: TCPAddr | $.VarRef<TCPAddr> | null): globalThis.Promise<[TCPListener | $.VarRef<TCPListener> | null, $.GoError]> {
	switch (network) {
		case "tcp":
		case "tcp4":
		case "tcp6":
		{
			break
		}
		default:
		{
			return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField10 = TCPAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField10, Err: $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })}) })(), "*net.OpError")]
			break
		}
	}
	if (laddr == null) {
		laddr = new TCPAddr()
	}
	let sl: __goscript_dial.sysListener | $.VarRef<__goscript_dial.sysListener> | null = (() => { const __goscriptLiteralField11 = TCPAddr.prototype.String.call(laddr); return new __goscript_dial.sysListener({network: network, address: __goscriptLiteralField11}) })()
	let ln: TCPListener | $.VarRef<TCPListener> | null = null as TCPListener | $.VarRef<TCPListener> | null
	let err: $.GoError = null as $.GoError
	if ($.pointerValue<__goscript_dial.sysListener>(sl).ListenConfig.MultipathTCP()) {
		let __goscriptTuple13: any = await __goscript_dial.sysListener.prototype.listenMPTCP.call(sl, context.Background(), laddr)
		ln = __goscriptTuple13[0]
		err = __goscriptTuple13[1]
	} else {
		let __goscriptTuple14: any = await __goscript_dial.sysListener.prototype.listenTCP.call(sl, context.Background(), laddr)
		ln = __goscriptTuple14[0]
		err = __goscriptTuple14[1]
	}
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField12 = TCPAddr.prototype.opAddr.call(laddr); return new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: __goscriptLiteralField12, Err: err}) })(), "*net.OpError")]
	}
	return [ln, null]
}

export function roundDurationUp(d: time.Duration, to: time.Duration): time.Duration {
	return $.int64Div(($.int64Sub(($.int64Add(d, to)), 1)), to)
}
