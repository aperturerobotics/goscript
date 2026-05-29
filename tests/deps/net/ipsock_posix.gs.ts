// Generated file based on ipsock_posix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as syscall from "@goscript/syscall/index.js"

import type * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript__interface from "./interface.gs.ts"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_mac from "./mac.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_tcpsock from "./tcpsock.gs.ts"

import * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/runtime/index.js"
import "@goscript/syscall/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./interface.gs.ts"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./ip.gs.ts"
import "./ipsock.gs.ts"
import "./mac.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./tcpsock.gs.ts"
import "./tcpsock_posix.gs.ts"

export async function favoriteAddrFamily(network: string, laddr: __goscript_sockaddr_posix.sockaddr | null, raddr: __goscript_sockaddr_posix.sockaddr | null, mode: string): globalThis.Promise<[number, boolean]> {
	let family: number = 0
	let ipv6only: boolean = false
	switch ($.indexStringOrBytes(network, $.len(network) - 1)) {
		case 52:
		{
			return [syscall.AF_INET, false]
			break
		}
		case 54:
		{
			return [syscall.AF_INET6, true]
			break
		}
	}

	if (($.stringEqual(mode, "listen")) && ((laddr == null) || $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(laddr).isWildcard())) {
		if (await __goscript_ipsock.supportsIPv4map() || !await __goscript_ipsock.supportsIPv4()) {
			return [syscall.AF_INET6, false]
		}
		if (laddr == null) {
			return [syscall.AF_INET, false]
		}
		return [$.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(laddr).family(), false]
	}

	if (((laddr == null) || ($.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(laddr).family() == syscall.AF_INET)) && ((raddr == null) || ($.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(raddr).family() == syscall.AF_INET))) {
		return [syscall.AF_INET, false]
	}
	return [syscall.AF_INET6, false]
}

export async function internetSocket(ctx: context.Context | null, net: string, laddr: __goscript_sockaddr_posix.sockaddr | null, raddr: __goscript_sockaddr_posix.sockaddr | null, sotype: number, proto: number, mode: string, ctrlCtxFn: ((_p0: context.Context | null, _p1: string, _p2: string, _p3: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<[__goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, $.GoError]> {
	let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = null as __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null
	let err: $.GoError = null as $.GoError
	switch ((runtime.GOOS as string)) {
		case "aix":
		case "windows":
		case "openbsd":
		case "js":
		case "wasip1":
		{
			if (($.stringEqual(mode, "dial")) && $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(raddr).isWildcard()) {
				raddr = $.pointerValue<Exclude<__goscript_sockaddr_posix.sockaddr, null>>(raddr).toLocal(net)
			}
			break
		}
	}
	let [family, ipv6only] = await favoriteAddrFamily(net, laddr, raddr, mode)
	return await __goscript_net_fake.socket(ctx, net, family, sotype, proto, ipv6only, laddr, raddr, ctrlCtxFn)
}

export function ipToSockaddrInet4(ip: __goscript_ip.IP, port: number): [syscall.SockaddrInet4, $.GoError] {
	if ($.len((ip as __goscript_ip.IP)) == 0) {
		ip = (__goscript_ip.IPv4zero as __goscript_ip.IP)
	}
	let ip4: __goscript_ip.IP = (__goscript_ip.IP_To4(ip) as __goscript_ip.IP)
	if (ip4 == null) {
		return [$.markAsStructValue(new syscall.SockaddrInet4()), $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField0 = __goscript_ip.IP_String(ip); return new __goscript_net.AddrError({Err: "non-IPv4 address", Addr: __goscriptLiteralField0}) })(), "*net.AddrError")]
	}
	let sa = $.markAsStructValue(new syscall.SockaddrInet4({Port: port}))
	$.copy($.goSlice(sa.Addr, undefined, undefined), (ip4 as __goscript_ip.IP))
	return [$.markAsStructValue($.cloneStructValue(sa)), null]
}

export async function ipToSockaddrInet6(ip: __goscript_ip.IP, port: number, zone: string): globalThis.Promise<[syscall.SockaddrInet6, $.GoError]> {
	// In general, an IP wildcard address, which is either
	// "0.0.0.0" or "::", means the entire IP addressing
	// space. For some historical reason, it is used to
	// specify "any available address" on some operations
	// of IP node.
	//
	// When the IP node supports IPv4-mapped IPv6 address,
	// we allow a listener to listen to the wildcard
	// address of both IP addressing spaces by specifying
	// IPv6 wildcard address.
	if (($.len((ip as __goscript_ip.IP)) == 0) || __goscript_ip.IP_Equal(ip, (__goscript_ip.IPv4zero as __goscript_ip.IP))) {
		ip = (__goscript_ip.IPv6zero as __goscript_ip.IP)
	}
	// We accept any IPv6 address including IPv4-mapped
	// IPv6 address.
	let ip6: __goscript_ip.IP = (__goscript_ip.IP_To16(ip) as __goscript_ip.IP)
	if (ip6 == null) {
		return [$.markAsStructValue(new syscall.SockaddrInet6()), $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField1 = __goscript_ip.IP_String(ip); return new __goscript_net.AddrError({Err: "non-IPv6 address", Addr: __goscriptLiteralField1}) })(), "*net.AddrError")]
	}
	let sa = (await (async () => { const __goscriptLiteralField2 = $.uint($.uint(await $.pointerValue<__goscript__interface.ipv6ZoneCache>(__goscript__interface.zoneCache).index(zone), 32), 32); return $.markAsStructValue(new syscall.SockaddrInet6({Port: port, ZoneId: __goscriptLiteralField2})) })())
	$.copy($.goSlice(sa.Addr, undefined, undefined), (ip6 as __goscript_ip.IP))
	return [$.markAsStructValue($.cloneStructValue(sa)), null]
}

export async function ipToSockaddr(family: number, ip: __goscript_ip.IP, port: number, zone: string): globalThis.Promise<[syscall.Sockaddr | null, $.GoError]> {
	switch (family) {
		case syscall.AF_INET:
		{
			let __goscriptTuple0: any = ipToSockaddrInet4((ip as __goscript_ip.IP), port)
			let sa = $.varRef(__goscriptTuple0[0])
			let err = __goscriptTuple0[1]
			if (err != null) {
				return [null, err]
			}
			return [$.interfaceValue<syscall.Sockaddr | null>(sa, "*syscall.SockaddrInet4"), null]
			break
		}
		case syscall.AF_INET6:
		{
			let __goscriptTuple1: any = await ipToSockaddrInet6((ip as __goscript_ip.IP), port, zone)
			let sa = $.varRef(__goscriptTuple1[0])
			let err = __goscriptTuple1[1]
			if (err != null) {
				return [null, err]
			}
			return [$.interfaceValue<syscall.Sockaddr | null>(sa, "*syscall.SockaddrInet6"), null]
			break
		}
	}
	return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField3 = __goscript_ip.IP_String(ip); return new __goscript_net.AddrError({Err: "invalid address family", Addr: __goscriptLiteralField3}) })(), "*net.AddrError")]
}

export function addrPortToSockaddrInet4(ap: netip.AddrPort): [syscall.SockaddrInet4, $.GoError] {
	// ipToSockaddrInet4 has special handling here for zero length slices.
	// We do not, because netip has no concept of a generic zero IP address.
	//
	// addr is allowed to be an IPv4-mapped IPv6 address.
	// As4 will unmap it to an IPv4 address.
	// The error message is kept consistent with ipToSockaddrInet4.
	let addr = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ap)).Addr()))
	if (!$.markAsStructValue($.cloneStructValue(addr)).Is4() && !$.markAsStructValue($.cloneStructValue(addr)).Is4In6()) {
		return [$.markAsStructValue(new syscall.SockaddrInet4()), $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField4 = $.markAsStructValue($.cloneStructValue(addr)).String(); return new __goscript_net.AddrError({Err: "non-IPv4 address", Addr: __goscriptLiteralField4}) })(), "*net.AddrError")]
	}
	let sa = (() => { const __goscriptLiteralField5 = $.markAsStructValue($.cloneStructValue(addr)).As4(); const __goscriptLiteralField6 = $.int($.markAsStructValue($.cloneStructValue(ap)).Port()); return $.markAsStructValue(new syscall.SockaddrInet4({Addr: __goscriptLiteralField5, Port: __goscriptLiteralField6})) })()
	return [$.markAsStructValue($.cloneStructValue(sa)), null]
}

export async function addrPortToSockaddrInet6(ap: netip.AddrPort): globalThis.Promise<[syscall.SockaddrInet6, $.GoError]> {
	// ipToSockaddrInet6 has special handling here for zero length slices.
	// We do not, because netip has no concept of a generic zero IP address.
	//
	// addr is allowed to be an IPv4 address, because As16 will convert it
	// to an IPv4-mapped IPv6 address.
	// The error message is kept consistent with ipToSockaddrInet6.
	let addr = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ap)).Addr()))
	let sa = (await (async () => { const __goscriptLiteralField7 = $.markAsStructValue($.cloneStructValue(addr)).As16(); const __goscriptLiteralField8 = $.int($.markAsStructValue($.cloneStructValue(ap)).Port()); const __goscriptLiteralField9 = $.uint($.uint(await $.pointerValue<__goscript__interface.ipv6ZoneCache>(__goscript__interface.zoneCache).index($.markAsStructValue($.cloneStructValue(addr)).Zone()), 32), 32); return $.markAsStructValue(new syscall.SockaddrInet6({Addr: __goscriptLiteralField7, Port: __goscriptLiteralField8, ZoneId: __goscriptLiteralField9})) })())
	return [$.markAsStructValue($.cloneStructValue(sa)), null]
}
