// Generated file based on ipsock.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import * as time from "@goscript/time/index.js"

import type * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import type * as atomic from "@goscript/sync/atomic/index.js"

import type * as __goscript_dial from "./dial.gs.ts"

import type * as __goscript_dnsclient from "./dnsclient.gs.ts"

import type * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.ts"

import type * as __goscript_dnsconfig from "./dnsconfig.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_iprawsock from "./iprawsock.gs.ts"

import * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_ipsock_posix from "./ipsock_posix.gs.ts"

import * as __goscript_lookup from "./lookup.gs.ts"

import type * as __goscript_lookup_unix from "./lookup_unix.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import type * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_tcpsock from "./tcpsock.gs.ts"

import * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"

import * as __goscript_udpsock from "./udpsock.gs.ts"

import * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/syscall/index.js"
import "@goscript/internal/singleflight/index.js"
import "@goscript/time/index.js"
import "./ip.gs.ts"
import "./iprawsock.gs.ts"
import "./iprawsock_posix.gs.ts"
import "./ipsock_posix.gs.ts"
import "./lookup.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./tcpsock.gs.ts"
import "./tcpsock_posix.gs.ts"
import "./udpsock.gs.ts"
import "./udpsock_posix.gs.ts"

export class ipStackCapabilities {
	public get Once(): sync.Once {
		return this._fields.Once.value
	}
	public set Once(value: sync.Once) {
		this._fields.Once.value = value
	}

	public get ipv4Enabled(): boolean {
		return this._fields.ipv4Enabled.value
	}
	public set ipv4Enabled(value: boolean) {
		this._fields.ipv4Enabled.value = value
	}

	public get ipv6Enabled(): boolean {
		return this._fields.ipv6Enabled.value
	}
	public set ipv6Enabled(value: boolean) {
		this._fields.ipv6Enabled.value = value
	}

	public get ipv4MappedIPv6Enabled(): boolean {
		return this._fields.ipv4MappedIPv6Enabled.value
	}
	public set ipv4MappedIPv6Enabled(value: boolean) {
		this._fields.ipv4MappedIPv6Enabled.value = value
	}

	public _fields: {
		Once: $.VarRef<sync.Once>
		ipv4Enabled: $.VarRef<boolean>
		ipv6Enabled: $.VarRef<boolean>
		ipv4MappedIPv6Enabled: $.VarRef<boolean>
	}

	constructor(init?: Partial<{Once?: sync.Once, ipv4Enabled?: boolean, ipv6Enabled?: boolean, ipv4MappedIPv6Enabled?: boolean}>) {
		this._fields = {
			Once: $.varRef(init?.Once ? $.markAsStructValue($.cloneStructValue(init.Once)) : $.markAsStructValue(new sync.Once())),
			ipv4Enabled: $.varRef(init?.ipv4Enabled ?? (false as unknown as boolean)),
			ipv6Enabled: $.varRef(init?.ipv6Enabled ?? (false as unknown as boolean)),
			ipv4MappedIPv6Enabled: $.varRef(init?.ipv4MappedIPv6Enabled ?? (false as unknown as boolean))
		}
	}

	public clone(): ipStackCapabilities {
		const cloned = new ipStackCapabilities()
		cloned._fields = {
			Once: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Once.value))),
			ipv4Enabled: $.varRef(this._fields.ipv4Enabled.value),
			ipv6Enabled: $.varRef(this._fields.ipv6Enabled.value),
			ipv4MappedIPv6Enabled: $.varRef(this._fields.ipv4MappedIPv6Enabled.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async probe(): globalThis.Promise<void> {
		let p: ipStackCapabilities | $.VarRef<ipStackCapabilities> | null = this
		await using __defer = new $.AsyncDisposableStack()
		switch ((runtime.GOOS as string)) {
			case "js":
			case "wasip1":
			{
				$.pointerValue<ipStackCapabilities>(p).ipv4Enabled = true
				$.pointerValue<ipStackCapabilities>(p).ipv6Enabled = true
				$.pointerValue<ipStackCapabilities>(p).ipv4MappedIPv6Enabled = true
				return
				break
			}
		}

		let [s, err] = __goscript_net_fake.sysSocket(syscall.AF_INET, syscall.SOCK_STREAM, syscall.IPPROTO_TCP)
		{
			let __goscriptSwitch0 = err
			switch (true) {
				case $.comparableEqual(__goscriptSwitch0, $.namedValueInterfaceValue<$.GoError>(syscall.EAFNOSUPPORT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })):
				case $.comparableEqual(__goscriptSwitch0, $.namedValueInterfaceValue<$.GoError>(syscall.EPROTONOSUPPORT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })):
				{
					break
				}
				case $.comparableEqual(__goscriptSwitch0, null):
				{
					await poll.CloseFunc!(s)
					$.pointerValue<ipStackCapabilities>(p).ipv4Enabled = true
					break
				}
			}
		}
		let probes: $.Slice<{"laddr": __goscript_tcpsock.TCPAddr, "value": number}> = $.arrayToSlice<{"laddr": __goscript_tcpsock.TCPAddr, "value": number}>([{laddr: (() => { const __goscriptLiteralField0 = (__goscript_ip.ParseIP("::1") as __goscript_ip.IP); return $.markAsStructValue(new __goscript_tcpsock.TCPAddr({IP: __goscriptLiteralField0})) })(), value: 1}, {laddr: (() => { const __goscriptLiteralField1 = (__goscript_ip.IPv4($.uint(127, 8), $.uint(0, 8), $.uint(0, 8), $.uint(1, 8)) as __goscript_ip.IP); return $.markAsStructValue(new __goscript_tcpsock.TCPAddr({IP: __goscriptLiteralField1})) })(), value: 0}])
		switch ((runtime.GOOS as string)) {
			case "dragonfly":
			case "openbsd":
			{
				probes = $.goSlice(probes, undefined, 1)
				break
			}
		}
		for (let __goscriptRangeTarget0 = probes, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			let [__goscriptShadow0, __goscriptShadow1] = __goscript_net_fake.sysSocket(syscall.AF_INET6, syscall.SOCK_STREAM, syscall.IPPROTO_TCP)
			if (__goscriptShadow1 != null) {
				continue
			}
			__defer.defer(async () => { await poll.CloseFunc!(__goscriptShadow0) })
			syscall.SetsockoptInt(__goscriptShadow0, syscall.IPPROTO_IPV6, syscall.IPV6_V6ONLY, probes![i].value)
			let __goscriptTuple0: any = await probes![i].laddr.sockaddr(syscall.AF_INET6)
			let sa = __goscriptTuple0[0]
			__goscriptShadow1 = __goscriptTuple0[1]
			if (__goscriptShadow1 != null) {
				continue
			}
			{
				let __goscriptShadow2 = syscall.Bind(__goscriptShadow0, sa)
				if (__goscriptShadow2 != null) {
					continue
				}
			}
			if (i == 0) {
				$.pointerValue<ipStackCapabilities>(p).ipv6Enabled = true
			} else {
				$.pointerValue<ipStackCapabilities>(p).ipv4MappedIPv6Enabled = true
			}
		}
	}

	public Do(f: any): any {
		return $.pointerValue<sync.Once>(this.Once).Do(f)
	}

	static __typeInfo = $.registerStructType(
		"net.ipStackCapabilities",
		() => new ipStackCapabilities(),
		[{ name: "probe", args: [], returns: [] }, { name: "Do", args: [{ name: "f", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }], returns: [] }],
		ipStackCapabilities,
		[{ name: "Once", key: "Once", type: "sync.Once", anonymous: true, index: [0], offset: 0, exported: true }, { name: "ipv4Enabled", key: "ipv4Enabled", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [1], offset: 12, exported: false }, { name: "ipv6Enabled", key: "ipv6Enabled", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [2], offset: 13, exported: false }, { name: "ipv4MappedIPv6Enabled", key: "ipv4MappedIPv6Enabled", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [3], offset: 14, exported: false }]
	)
}

export let ipStackCaps: $.VarRef<ipStackCapabilities> = $.varRef($.markAsStructValue(new ipStackCapabilities()))

export function __goscript_set_ipStackCaps(__goscriptValue: ipStackCapabilities): void {
	ipStackCaps.value = __goscriptValue
}

export async function supportsIPv4(): globalThis.Promise<boolean> {
	await ipStackCaps.value.Once.Do($.functionValue(((__receiver) => () => __receiver.probe())(ipStackCaps.value), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	return ipStackCaps.value.ipv4Enabled
}

export async function supportsIPv6(): globalThis.Promise<boolean> {
	await ipStackCaps.value.Once.Do($.functionValue(((__receiver) => () => __receiver.probe())(ipStackCaps.value), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	return ipStackCaps.value.ipv6Enabled
}

export async function supportsIPv4map(): globalThis.Promise<boolean> {
	// Some operating systems provide no support for mapping IPv4
	// addresses to IPv6, and a runtime check is unnecessary.
	switch ((runtime.GOOS as string)) {
		case "dragonfly":
		case "openbsd":
		{
			return false
			break
		}
	}

	await ipStackCaps.value.Once.Do($.functionValue(((__receiver) => () => __receiver.probe())(ipStackCaps.value), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	return ipStackCaps.value.ipv4MappedIPv6Enabled
}

export type addrList = $.Slice<__goscript_net.Addr | null>

export function isIPv4(addr: __goscript_net.Addr | null): boolean {
	{
		const __goscriptTypeSwitchValue = addr
		switch (true) {
			case $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).ok:
				{
					let addr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).value
					return __goscript_ip.IP_To4($.pointerValue<__goscript_tcpsock.TCPAddr>(addr).IP) != null
				}
				break
			case $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).ok:
				{
					let addr: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).value
					return __goscript_ip.IP_To4($.pointerValue<__goscript_udpsock.UDPAddr>(addr).IP) != null
				}
				break
			case $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).ok:
				{
					let addr: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null = $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).value
					return __goscript_ip.IP_To4($.pointerValue<__goscript_iprawsock.IPAddr>(addr).IP) != null
				}
				break
		}
	}
	return false
}

export function isNotIPv4(addr: __goscript_net.Addr | null): boolean {
	return !isIPv4(addr)
}

export async function addrList_forResolve(addrs: addrList, network: string, addr: string): globalThis.Promise<__goscript_net.Addr | null> {
	let want6: boolean = false
	switch (network) {
		case "ip":
		{
			want6 = bytealg.CountString(addr, $.uint(58, 8)) > 0
			break
		}
		case "tcp":
		case "udp":
		{
			want6 = bytealg.CountString(addr, $.uint(91, 8)) > 0
			break
		}
	}
	if (want6) {
		return await addrList_first(addrs, isNotIPv4)
	}
	return await addrList_first(addrs, isIPv4)
}

export async function addrList_first(addrs: addrList, strategy: ((_p0: __goscript_net.Addr | null) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<__goscript_net.Addr | null> {
	for (let __goscriptRangeTarget1 = addrs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let addr = __goscriptRangeTarget1![__rangeIndex]
		if (await strategy!(addr)) {
			return addr
		}
	}
	return addrs![0]
}

export async function addrList_partition(addrs: addrList, strategy: ((_p0: __goscript_net.Addr | null) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<[addrList, addrList]> {
	let primaries: addrList = null as addrList
	let fallbacks: addrList = null as addrList
	let primaryLabel: boolean = false
	for (let __goscriptRangeTarget2 = addrs, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		let addr = __goscriptRangeTarget2![i]
		let label = await strategy!(addr)
		if ((i == 0) || (label == primaryLabel)) {
			primaryLabel = label
			primaries = ($.append((primaries as addrList), addr) as addrList)
		} else {
			fallbacks = ($.append((fallbacks as addrList), addr) as addrList)
		}
	}
	return [primaries, fallbacks]
}

export async function filterAddrList(filter: ((_p0: __goscript_iprawsock.IPAddr) => boolean | globalThis.Promise<boolean>) | null, ips: $.Slice<__goscript_iprawsock.IPAddr>, inetaddr: ((_p0: __goscript_iprawsock.IPAddr) => __goscript_net.Addr | null | globalThis.Promise<__goscript_net.Addr | null>) | null, originalAddr: string): globalThis.Promise<[addrList, $.GoError]> {
	let addrs: addrList = null as addrList
	for (let __goscriptRangeTarget3 = ips, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let ip = __goscriptRangeTarget3![__rangeIndex]
		if ((filter == null) || await filter!($.markAsStructValue($.cloneStructValue(ip)))) {
			addrs = ($.append((addrs as addrList), await inetaddr!($.markAsStructValue($.cloneStructValue(ip)))) as addrList)
		}
	}
	if ($.len((addrs as addrList)) == 0) {
		return [(null as addrList), $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField2 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_net.errNoSuitableAddress).Error(); return new __goscript_net.AddrError({Err: __goscriptLiteralField2, Addr: originalAddr}) })(), "*net.AddrError")]
	}
	return [(addrs as addrList), null]
}

export function ipv4only(addr: __goscript_iprawsock.IPAddr): boolean {
	return __goscript_ip.IP_To4(addr.IP) != null
}

export function ipv6only(addr: __goscript_iprawsock.IPAddr): boolean {
	return ($.len((addr.IP as __goscript_ip.IP)) == 16) && (__goscript_ip.IP_To4(addr.IP) == null)
}

export async function SplitHostPort(hostport: string): globalThis.Promise<[string, string, $.GoError]> {
	let host: string = ""
	let port: string = ""
	let err: $.GoError = null as $.GoError
	const missingPort: string = "missing port in address"
	const tooManyColons: string = "too many colons in address"
	let addrErr: ((addr: string, why: string) => [string, string, $.GoError] | globalThis.Promise<[string, string, $.GoError]>) | null = $.functionValue((addr: string, why: string): [string, string, $.GoError] => {
		let host: string = ""
		let port: string = ""
		let err: $.GoError = null as $.GoError
		return ["", "", $.interfaceValue<$.GoError>(new __goscript_net.AddrError({Err: why, Addr: addr}), "*net.AddrError")]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "error"] } as $.FunctionTypeInfo))
	let j = 0
	let k = 0

	// The port starts after the last colon.
	let i = bytealg.LastIndexByteString(hostport, $.uint(58, 8))
	if (i < 0) {
		return await addrErr!(hostport, "missing port in address")
	}

	if ($.uint($.indexStringOrBytes(hostport, 0), 8) == $.uint(91, 8)) {
		// Expect the first ']' just before the last ':'.
		let end = bytealg.IndexByteString(hostport, $.uint(93, 8))
		if (end < 0) {
			return await addrErr!(hostport, "missing ']' in address")
		}
		switch (end + 1) {
			case $.len(hostport):
			{
				return await addrErr!(hostport, "missing port in address")
				break
			}
			case i:
			{
				break
			}
			default:
			{
				if ($.uint($.indexStringOrBytes(hostport, end + 1), 8) == $.uint(58, 8)) {
					return await addrErr!(hostport, "too many colons in address")
				}
				return await addrErr!(hostport, "missing port in address")
				break
			}
		}
		host = $.sliceStringOrBytes(hostport, 1, end)
		let __goscriptAssign0_0: number = 1
		let __goscriptAssign0_1: number = end + 1
		j = __goscriptAssign0_0
		k = __goscriptAssign0_1
	} else {
		host = $.sliceStringOrBytes(hostport, undefined, i)
		if (bytealg.IndexByteString(host, $.uint(58, 8)) >= 0) {
			return await addrErr!(hostport, "too many colons in address")
		}
	}
	if (bytealg.IndexByteString($.sliceStringOrBytes(hostport, j, undefined), $.uint(91, 8)) >= 0) {
		return await addrErr!(hostport, "unexpected '[' in address")
	}
	if (bytealg.IndexByteString($.sliceStringOrBytes(hostport, k, undefined), $.uint(93, 8)) >= 0) {
		return await addrErr!(hostport, "unexpected ']' in address")
	}

	port = $.sliceStringOrBytes(hostport, i + 1, undefined)
	return [host, port, null]
}

export function splitHostZone(s: string): [string, string] {
	let host: string = ""
	let zone: string = ""
	// The IPv6 scoped addressing zone identifier starts after the
	// last percent sign.
	{
		let i = bytealg.LastIndexByteString(s, $.uint(37, 8))
		if (i > 0) {
			let __goscriptAssign1_0: string = $.sliceStringOrBytes(s, undefined, i)
			let __goscriptAssign1_1: string = $.sliceStringOrBytes(s, i + 1, undefined)
			host = __goscriptAssign1_0
			zone = __goscriptAssign1_1
		} else {
			host = s
		}
	}
	return [host, zone]
}

export function JoinHostPort(host: string, port: string): string {
	// We assume that host is a literal IPv6 address if host has
	// colons.
	if (bytealg.IndexByteString(host, $.uint(58, 8)) >= 0) {
		return (("[" + host) + "]:") + port
	}
	return (host + ":") + port
}

export function loopbackIP(net: string): __goscript_ip.IP {
	if ((!$.stringEqual(net, "")) && ($.uint($.indexStringOrBytes(net, $.len(net) - 1), 8) == $.uint(54, 8))) {
		return (__goscript_ip.IPv6loopback as __goscript_ip.IP)
	}
	return ($.arrayToSlice<number>([$.uint(127, 8), $.uint(0, 8), $.uint(0, 8), $.uint(1, 8)]) as __goscript_ip.IP)
}
