// Generated file based on unixsock_posix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/errors/index.js"

import * as os from "@goscript/os/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import type * as io from "@goscript/io/index.js"

import type * as netip from "@goscript/net/netip/index.js"

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

import type * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_lookup from "./lookup.gs.ts"

import * as __goscript_lookup_unix from "./lookup_unix.gs.ts"

import * as __goscript_mac from "./mac.gs.ts"

import type * as __goscript_mptcpsock_stub from "./mptcpsock_stub.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_tcpsock from "./tcpsock.gs.ts"

import type * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"

import type * as __goscript_tcpsock_unix from "./tcpsock_unix.gs.ts"

import type * as __goscript_udpsock from "./udpsock.gs.ts"

import type * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"

import * as __goscript_unixsock from "./unixsock.gs.ts"

import * as __goscript_unixsock_readmsg_other from "./unixsock_readmsg_other.gs.ts"
import "@goscript/context/index.js"
import "@goscript/errors/index.js"
import "@goscript/os/index.js"
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
import "./ipsock.gs.ts"
import "./lookup.gs.ts"
import "./lookup_unix.gs.ts"
import "./mac.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./tcpsock.gs.ts"
import "./unixsock.gs.ts"
import "./unixsock_readmsg_other.gs.ts"

export async function unixSocket(ctx: context.Context | null, net: string, laddr: __goscript_sockaddr_posix.sockaddr | null, raddr: __goscript_sockaddr_posix.sockaddr | null, mode: string, ctxCtrlFn: ((_p0: context.Context | null, _p1: string, _p2: string, _p3: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<[__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, $.GoError]> {
	let sotype: number = 0
	switch (net) {
		case "unix":
		{
			sotype = syscall.SOCK_STREAM
			break
		}
		case "unixgram":
		{
			sotype = syscall.SOCK_DGRAM
			break
		}
		case "unixpacket":
		{
			sotype = syscall.SOCK_SEQPACKET
			break
		}
		default:
		{
			return [null, $.namedValueInterfaceValue<$.GoError>(net, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
			break
		}
	}

	switch (mode) {
		case "dial":
		{
			if ((laddr != null) && await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(laddr).isWildcard()) {
				laddr = null
			}
			if ((raddr != null) && await $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(raddr).isWildcard()) {
				raddr = null
			}
			if ((raddr == null) && ((sotype != syscall.SOCK_DGRAM) || (laddr == null))) {
				return [null, __goscript_net.errMissingAddress]
			}
			break
		}
		case "listen":
		{
			break
		}
		default:
		{
			return [null, errors.New("unknown mode: " + mode)]
			break
		}
	}

	let __goscriptTuple0: any = await __goscript_net_fake.socket(ctx, net, syscall.AF_UNIX, sotype, 0, false, laddr, raddr, ctxCtrlFn)
	let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}
	return [fd, null]
}

export function sockaddrToUnix(sa: syscall.Sockaddr | null): __goscript_net.Addr | null {
	{
		let __goscriptTuple1: any = $.typeAssertTuple<syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null>(sa, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrUnix" })
		let s: syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null = __goscriptTuple1[0]
		let ok = __goscriptTuple1[1]
		if (ok) {
			return $.interfaceValue<__goscript_net.Addr | null>(new __goscript_unixsock.UnixAddr({Name: $.pointerValue<syscall.SockaddrUnix>(s).Name, Net: "unix"}), "*net.UnixAddr")
		}
	}
	return null
}

export function sockaddrToUnixgram(sa: syscall.Sockaddr | null): __goscript_net.Addr | null {
	{
		let __goscriptTuple2: any = $.typeAssertTuple<syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null>(sa, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrUnix" })
		let s: syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null = __goscriptTuple2[0]
		let ok = __goscriptTuple2[1]
		if (ok) {
			return $.interfaceValue<__goscript_net.Addr | null>(new __goscript_unixsock.UnixAddr({Name: $.pointerValue<syscall.SockaddrUnix>(s).Name, Net: "unixgram"}), "*net.UnixAddr")
		}
	}
	return null
}

export function sockaddrToUnixpacket(sa: syscall.Sockaddr | null): __goscript_net.Addr | null {
	{
		let __goscriptTuple3: any = $.typeAssertTuple<syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null>(sa, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrUnix" })
		let s: syscall.SockaddrUnix | $.VarRef<syscall.SockaddrUnix> | null = __goscriptTuple3[0]
		let ok = __goscriptTuple3[1]
		if (ok) {
			return $.interfaceValue<__goscript_net.Addr | null>(new __goscript_unixsock.UnixAddr({Name: $.pointerValue<syscall.SockaddrUnix>(s).Name, Net: "unixpacket"}), "*net.UnixAddr")
		}
	}
	return null
}

export function sotypeToNet(sotype: number): string {
	switch (sotype) {
		case syscall.SOCK_STREAM:
		{
			return "unix"
			break
		}
		case syscall.SOCK_DGRAM:
		{
			return "unixgram"
			break
		}
		case syscall.SOCK_SEQPACKET:
		{
			return "unixpacket"
			break
		}
		default:
		{
			$.panic("sotypeToNet unknown socket type")
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}
