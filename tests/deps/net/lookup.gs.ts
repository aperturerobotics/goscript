// Generated file based on lookup.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as nettrace from "@goscript/internal/nettrace/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as errors from "@goscript/errors/index.js"

import * as strconv from "@goscript/internal/strconv/index.js"

import * as stringslite from "@goscript/internal/stringslite/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import type * as fs from "@goscript/io/fs/index.js"

import * as __goscript_addrselect from "./addrselect.gs.ts"

import * as __goscript_cgo_stub from "./cgo_stub.gs.ts"

import * as __goscript_conf from "./conf.gs.ts"

import * as __goscript_dial from "./dial.gs.ts"

import * as __goscript_dnsclient from "./dnsclient.gs.ts"

import * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.ts"

import * as __goscript_dnsconfig from "./dnsconfig.gs.ts"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_hook from "./hook.gs.ts"

import * as __goscript_hosts from "./hosts.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_iprawsock from "./iprawsock.gs.ts"

import * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_lookup_unix from "./lookup_unix.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"

import * as __goscript_port from "./port.gs.ts"

import * as __goscript_port_unix from "./port_unix.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_tcpsock from "./tcpsock.gs.ts"

import * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"

import type * as __goscript_tcpsock_unix from "./tcpsock_unix.gs.ts"

import * as __goscript_udpsock from "./udpsock.gs.ts"

import * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"

import * as __goscript_unixsock from "./unixsock.gs.ts"

import * as __goscript_unixsock_posix from "./unixsock_posix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/internal/nettrace/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/syscall/index.js"
import "@goscript/time/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/strconv/index.js"
import "@goscript/internal/stringslite/index.js"
import "@goscript/io/index.js"
import "@goscript/os/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"
import "@goscript/internal/singleflight/index.js"
import "@goscript/internal/poll/index.js"
import "./addrselect.gs.ts"
import "./cgo_stub.gs.ts"
import "./conf.gs.ts"
import "./dial.gs.ts"
import "./dnsclient.gs.ts"
import "./dnsclient_unix.gs.ts"
import "./dnsconfig.gs.ts"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./hook.gs.ts"
import "./hosts.gs.ts"
import "./ip.gs.ts"
import "./iprawsock.gs.ts"
import "./iprawsock_posix.gs.ts"
import "./ipsock.gs.ts"
import "./lookup_unix.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./parse.gs.ts"
import "./port.gs.ts"
import "./port_unix.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./tcpsock.gs.ts"
import "./tcpsock_posix.gs.ts"
import "./udpsock.gs.ts"
import "./udpsock_posix.gs.ts"
import "./unixsock.gs.ts"
import "./unixsock_posix.gs.ts"

export class Resolver {
	// PreferGo controls whether Go's built-in DNS resolver is preferred
	// on platforms where it's available. It is equivalent to setting
	// GODEBUG=netdns=go, but scoped to just this resolver.
	public get PreferGo(): boolean {
		return this._fields.PreferGo.value
	}
	public set PreferGo(value: boolean) {
		this._fields.PreferGo.value = value
	}

	// StrictErrors controls the behavior of temporary errors
	// (including timeout, socket errors, and SERVFAIL) when using
	// Go's built-in resolver. For a query composed of multiple
	// sub-queries (such as an A+AAAA address lookup, or walking the
	// DNS search list), this option causes such errors to abort the
	// whole query instead of returning a partial result. This is
	// not enabled by default because it may affect compatibility
	// with resolvers that process AAAA queries incorrectly.
	public get StrictErrors(): boolean {
		return this._fields.StrictErrors.value
	}
	public set StrictErrors(value: boolean) {
		this._fields.StrictErrors.value = value
	}

	// Dial optionally specifies an alternate dialer for use by
	// Go's built-in DNS resolver to make TCP and UDP connections
	// to DNS services. The host in the address parameter will
	// always be a literal IP address and not a host name, and the
	// port in the address parameter will be a literal port number
	// and not a service name.
	// If the Conn returned is also a PacketConn, sent and received DNS
	// messages must adhere to RFC 1035 section 4.2.1, "UDP usage".
	// Otherwise, DNS messages transmitted over Conn must adhere
	// to RFC 7766 section 5, "Transport Protocol Selection".
	// If nil, the default dialer is used.
	public get Dial(): ((ctx: context.Context | null, network: string, address: string) => [__goscript_net.Conn | null, $.GoError] | globalThis.Promise<[__goscript_net.Conn | null, $.GoError]>) | null {
		return this._fields.Dial.value
	}
	public set Dial(value: ((ctx: context.Context | null, network: string, address: string) => [__goscript_net.Conn | null, $.GoError] | globalThis.Promise<[__goscript_net.Conn | null, $.GoError]>) | null) {
		this._fields.Dial.value = value
	}

	// lookupGroup merges LookupIPAddr calls together for lookups for the same
	// host. The lookupGroup key is the LookupIPAddr.host argument.
	// The return values are ([]IPAddr, error).
	public get lookupGroup(): singleflight.Group {
		return this._fields.lookupGroup.value
	}
	public set lookupGroup(value: singleflight.Group) {
		this._fields.lookupGroup.value = value
	}

	public _fields: {
		PreferGo: $.VarRef<boolean>
		StrictErrors: $.VarRef<boolean>
		Dial: $.VarRef<((ctx: context.Context | null, network: string, address: string) => [__goscript_net.Conn | null, $.GoError] | globalThis.Promise<[__goscript_net.Conn | null, $.GoError]>) | null>
		lookupGroup: $.VarRef<singleflight.Group>
	}

	constructor(init?: Partial<{PreferGo?: boolean, StrictErrors?: boolean, Dial?: ((ctx: context.Context | null, network: string, address: string) => [__goscript_net.Conn | null, $.GoError] | globalThis.Promise<[__goscript_net.Conn | null, $.GoError]>) | null, lookupGroup?: singleflight.Group}>) {
		this._fields = {
			PreferGo: $.varRef(init?.PreferGo ?? (false as boolean)),
			StrictErrors: $.varRef(init?.StrictErrors ?? (false as boolean)),
			Dial: $.varRef(init?.Dial ?? (null as ((ctx: context.Context | null, network: string, address: string) => [__goscript_net.Conn | null, $.GoError] | globalThis.Promise<[__goscript_net.Conn | null, $.GoError]>) | null)),
			lookupGroup: $.varRef(init?.lookupGroup ? $.markAsStructValue($.cloneStructValue(init.lookupGroup)) : $.markAsStructValue(new singleflight.Group()))
		}
	}

	public clone(): Resolver {
		const cloned = new Resolver()
		cloned._fields = {
			PreferGo: $.varRef(this._fields.PreferGo.value),
			StrictErrors: $.varRef(this._fields.StrictErrors.value),
			Dial: $.varRef(this._fields.Dial.value),
			lookupGroup: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.lookupGroup.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async LookupAddr(ctx: context.Context | null, addr: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let __goscriptTuple1: any = await Resolver.prototype.lookupAddr.call(r, ctx, addr)
		let names: $.Slice<string> = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		let filteredNames: $.Slice<string> = $.makeSlice<string>(0, $.len(names), "string")
		for (let __goscriptRangeTarget0 = names, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let name = __goscriptRangeTarget0![__rangeIndex]
			if (__goscript_dnsclient.isDomainName(name)) {
				filteredNames = $.append(filteredNames, name)
			}
		}
		if ($.len(names) != $.len(filteredNames)) {
			return [filteredNames, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: errMalformedDNSRecordsDetail, Name: addr}), "*net.DNSError")]
		}
		return [filteredNames, null]
	}

	public async LookupCNAME(ctx: context.Context | null, host: string): globalThis.Promise<[string, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let [cname, err] = await Resolver.prototype.lookupCNAME.call(r, ctx, host)
		if (err != null) {
			return ["", err]
		}
		if (!__goscript_dnsclient.isDomainName(cname)) {
			return ["", $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: errMalformedDNSRecordsDetail, Name: host}), "*net.DNSError")]
		}
		return [cname, null]
	}

	public async LookupHost(ctx: context.Context | null, host: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let addrs: $.Slice<string> = null as $.Slice<string>
		let err: $.GoError = null as $.GoError
		// Make sure that no matter what we do later, host=="" is rejected.
		if ($.stringEqual(host, "")) {
			return [null, $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), host, ""), "*net.DNSError")]
		}
		{
			let [, __goscriptShadow2] = netip.ParseAddr(host)
			if (__goscriptShadow2 == null) {
				return [$.arrayToSlice<string>([host]), null]
			}
		}
		return Resolver.prototype.lookupHost.call(r, ctx, host)
	}

	public async LookupIP(ctx: context.Context | null, network: string, host: string): globalThis.Promise<[$.Slice<__goscript_ip.IP>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let [afnet, , err] = await __goscript_dial.parseNetwork(ctx, network, false)
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

		if ($.stringEqual(host, "")) {
			return [null, $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), host, ""), "*net.DNSError")]
		}
		let __goscriptTuple2: any = await Resolver.prototype.internetAddrList.call(r, ctx, afnet, host)
		let addrs: __goscript_ipsock.addrList = (__goscriptTuple2[0] as __goscript_ipsock.addrList)
		err = __goscriptTuple2[1]
		if (err != null) {
			return [null, err]
		}

		let ips: $.Slice<__goscript_ip.IP> = $.makeSlice<__goscript_ip.IP>(0, $.len((addrs as __goscript_ipsock.addrList)))
		for (let __goscriptRangeTarget1 = addrs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let addr = __goscriptRangeTarget1![__rangeIndex]
			ips = $.append(ips, ($.pointerValue<__goscript_iprawsock.IPAddr>($.mustTypeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(addr, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" })).IP as __goscript_ip.IP))
		}
		return [ips, null]
	}

	public async LookupIPAddr(ctx: context.Context | null, host: string): globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		return Resolver.prototype.lookupIPAddr.call(r, ctx, "ip", host)
	}

	public async LookupMX(ctx: context.Context | null, name: string): globalThis.Promise<[$.Slice<__goscript_dnsclient.MX | $.VarRef<__goscript_dnsclient.MX> | null>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let __goscriptTuple3: any = await Resolver.prototype.lookupMX.call(r, ctx, name)
		let records: $.Slice<__goscript_dnsclient.MX | $.VarRef<__goscript_dnsclient.MX> | null> = __goscriptTuple3[0]
		let err = __goscriptTuple3[1]
		if (err != null) {
			return [null, err]
		}
		let filteredMX: $.Slice<__goscript_dnsclient.MX | $.VarRef<__goscript_dnsclient.MX> | null> = $.makeSlice<__goscript_dnsclient.MX | $.VarRef<__goscript_dnsclient.MX> | null>(0, $.len(records))
		for (let __goscriptRangeTarget2 = records, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let mx = __goscriptRangeTarget2![__rangeIndex]
			if (mx == null) {
				continue
			}
			if (!__goscript_dnsclient.isDomainName($.pointerValue<__goscript_dnsclient.MX>(mx).Host)) {
				// Check for IP address. In practice we observe
				// these with a trailing dot, so strip that.
				let [ip, __goscriptShadow3] = netip.ParseAddr(stringslite.TrimSuffix($.pointerValue<__goscript_dnsclient.MX>(mx).Host, "."))
				if ((__goscriptShadow3 != null) || (!$.stringEqual($.markAsStructValue($.cloneStructValue(ip)).Zone(), ""))) {
					continue
				}
			}
			filteredMX = $.append(filteredMX, mx)
		}
		if ($.len(records) != $.len(filteredMX)) {
			return [filteredMX, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: errMalformedDNSRecordsDetail, Name: name}), "*net.DNSError")]
		}
		return [filteredMX, null]
	}

	public async LookupNS(ctx: context.Context | null, name: string): globalThis.Promise<[$.Slice<__goscript_dnsclient.NS | $.VarRef<__goscript_dnsclient.NS> | null>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let __goscriptTuple4: any = await Resolver.prototype.lookupNS.call(r, ctx, name)
		let records: $.Slice<__goscript_dnsclient.NS | $.VarRef<__goscript_dnsclient.NS> | null> = __goscriptTuple4[0]
		let err = __goscriptTuple4[1]
		if (err != null) {
			return [null, err]
		}
		let filteredNS: $.Slice<__goscript_dnsclient.NS | $.VarRef<__goscript_dnsclient.NS> | null> = $.makeSlice<__goscript_dnsclient.NS | $.VarRef<__goscript_dnsclient.NS> | null>(0, $.len(records))
		for (let __goscriptRangeTarget3 = records, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let ns = __goscriptRangeTarget3![__rangeIndex]
			if (ns == null) {
				continue
			}
			if (!__goscript_dnsclient.isDomainName($.pointerValue<__goscript_dnsclient.NS>(ns).Host)) {
				continue
			}
			filteredNS = $.append(filteredNS, ns)
		}
		if ($.len(records) != $.len(filteredNS)) {
			return [filteredNS, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: errMalformedDNSRecordsDetail, Name: name}), "*net.DNSError")]
		}
		return [filteredNS, null]
	}

	public async LookupNetIP(ctx: context.Context | null, network: string, host: string): globalThis.Promise<[$.Slice<netip.Addr>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		// TODO(bradfitz): make this efficient, making the internal net package
		// type throughout be netip.Addr and only converting to the net.IP slice
		// version at the edge. But for now (2021-10-20), this is a wrapper around
		// the old way.
		let __goscriptTuple5: any = await Resolver.prototype.LookupIP.call(r, ctx, network, host)
		let ips: $.Slice<__goscript_ip.IP> = __goscriptTuple5[0]
		let err = __goscriptTuple5[1]
		if (err != null) {
			return [null, err]
		}
		let ret: $.Slice<netip.Addr> = $.makeSlice<netip.Addr>(0, $.len(ips), undefined, () => $.markAsStructValue(new netip.Addr()))
		for (let __goscriptRangeTarget4 = ips, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
			let ip = __goscriptRangeTarget4![__rangeIndex]
			{
				let [a, ok] = netip.AddrFromSlice(ip)
				if (ok) {
					ret = $.append(ret, a)
				}
			}
		}
		return [ret, null]
	}

	public async LookupPort(ctx: context.Context | null, network: string, service: string): globalThis.Promise<[number, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let port: number = 0
		let err: $.GoError = null as $.GoError
		let __goscriptTuple6: any = __goscript_port.parsePort(service)
		port = __goscriptTuple6[0]
		let needsLookup = __goscriptTuple6[1]
		if (needsLookup) {
			switch (network) {
				case "tcp":
				case "tcp4":
				case "tcp6":
				case "udp":
				case "udp4":
				case "udp6":
				case "ip":
				{
					break
				}
				case "":
				{
					network = "ip"
					break
				}
				default:
				{
					return [0, $.interfaceValue<$.GoError>(new __goscript_net.AddrError({Err: "unknown network", Addr: network}), "*net.AddrError")]
					break
				}
			}
			let __goscriptTuple7: any = await Resolver.prototype.lookupPort.call(r, ctx, network, service)
			port = __goscriptTuple7[0]
			err = __goscriptTuple7[1]
			if (err != null) {
				return [0, err]
			}
		}
		if ((0 > port) || (port > 65535)) {
			return [0, $.interfaceValue<$.GoError>(new __goscript_net.AddrError({Err: "invalid port", Addr: service}), "*net.AddrError")]
		}
		return [port, null]
	}

	public async LookupSRV(ctx: context.Context | null, service: string, proto: string, name: string): globalThis.Promise<[string, $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let __goscriptTuple8: any = await Resolver.prototype.lookupSRV.call(r, ctx, service, proto, name)
		let cname = __goscriptTuple8[0]
		let addrs: $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null> = __goscriptTuple8[1]
		let err = __goscriptTuple8[2]
		if (err != null) {
			return ["", null, err]
		}
		if ((!$.stringEqual(cname, "")) && !__goscript_dnsclient.isDomainName(cname)) {
			return ["", null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "SRV header name is invalid", Name: name}), "*net.DNSError")]
		}
		let filteredAddrs: $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null> = $.makeSlice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null>(0, $.len(addrs))
		for (let __goscriptRangeTarget5 = addrs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
			let addr = __goscriptRangeTarget5![__rangeIndex]
			if (addr == null) {
				continue
			}
			if (!__goscript_dnsclient.isDomainName($.pointerValue<__goscript_dnsclient.SRV>(addr).Target)) {
				continue
			}
			filteredAddrs = $.append(filteredAddrs, addr)
		}
		if ($.len(addrs) != $.len(filteredAddrs)) {
			return [cname, filteredAddrs, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: errMalformedDNSRecordsDetail, Name: name}), "*net.DNSError")]
		}
		return [cname, filteredAddrs, null]
	}

	public async LookupTXT(ctx: context.Context | null, name: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		return Resolver.prototype.lookupTXT.call(r, ctx, name)
	}

	public async dial(ctx: context.Context | null, network: string, server: string): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		// Calling Dial here is scary -- we have to be sure not to
		// dial a name that will require a DNS lookup, or Dial will
		// call back here to translate it. The DNS config parser has
		// already checked that all the cfg.servers are IP
		// addresses, which Dial will use without a DNS lookup.
		let c: __goscript_net.Conn | null = null as __goscript_net.Conn | null
		let err: $.GoError = null as $.GoError
		if ((r != null) && ($.pointerValue<Resolver>(r).Dial != null)) {
			let __goscriptTuple9: any = await $.pointerValue<Resolver>(r).Dial!(ctx, network, server)
			c = __goscriptTuple9[0]
			err = __goscriptTuple9[1]
		} else {
			let d: $.VarRef<__goscript_dial.Dialer> = $.varRef($.markAsStructValue(new __goscript_dial.Dialer()))
			let __goscriptTuple10: any = await d.value.DialContext(ctx, network, server)
			c = __goscriptTuple10[0]
			err = __goscriptTuple10[1]
		}
		if (err != null) {
			return [null, __goscript_net.mapErr(err)]
		}
		return [c, null]
	}

	public async exchange(ctx: context.Context | null, server: string, q: dnsmessage.Question, timeout: time.Duration, useTCP: boolean, ad: boolean): globalThis.Promise<[dnsmessage.Parser, dnsmessage.Header, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		await using __defer = new $.AsyncDisposableStack()
		q.Class = $.uint(dnsmessage.ClassINET, 16)
		let __goscriptTuple11: any = __goscript_dnsclient_unix.newRequest($.markAsStructValue($.cloneStructValue(q)), ad)
		let id = $.uint(__goscriptTuple11[0], 16)
		let udpReq: $.Slice<number> = __goscriptTuple11[1]
		let tcpReq: $.Slice<number> = __goscriptTuple11[2]
		let err = __goscriptTuple11[3]
		if (err != null) {
			return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), __goscript_dnsclient_unix.errCannotMarshalDNSMessage]
		}
		let networks: $.Slice<string> = null as $.Slice<string>
		if (useTCP) {
			networks = $.arrayToSlice<string>(["tcp"])
		} else {
			networks = $.arrayToSlice<string>(["udp", "tcp"])
		}
		for (let __goscriptRangeTarget6 = networks, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
			let network = __goscriptRangeTarget6![__rangeIndex]
			let __goscriptShadow4 = ctx
			let __goscriptTuple12: any = context.WithDeadline($.pointerValueOrNil(__goscriptShadow4)!, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(timeout))))
			let __goscriptShadow5 = __goscriptTuple12[0]
			let cancel = __goscriptTuple12[1]
			__defer.defer(async () => { await cancel!() })

			let [c, __goscriptShadow6] = await Resolver.prototype.dial.call(r, __goscriptShadow5, network, server)
			if (__goscriptShadow6 != null) {
				return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), __goscriptShadow6]
			}
			{
				let [d, ok] = await $.pointerValue<Exclude<context.Context, null>>(__goscriptShadow5).Deadline()
				if (ok && !$.markAsStructValue($.cloneStructValue(d)).IsZero()) {
					await $.pointerValue<Exclude<__goscript_net.Conn, null>>(c).SetDeadline($.markAsStructValue($.cloneStructValue(d)))
				}
			}
			let p: $.VarRef<dnsmessage.Parser> = $.varRef($.markAsStructValue(new dnsmessage.Parser()))
			let h: dnsmessage.Header = $.markAsStructValue(new dnsmessage.Header())
			{
				let [, ok] = $.typeAssertTuple<__goscript_net.PacketConn | null>(c, "net.PacketConn")
				if (ok) {
					let __goscriptTuple13: any = await __goscript_dnsclient_unix.dnsPacketRoundTrip(c, $.uint(id, 16), $.markAsStructValue($.cloneStructValue(q)), udpReq)
					p.value = __goscriptTuple13[0]
					h = __goscriptTuple13[1]
					__goscriptShadow6 = __goscriptTuple13[2]
				} else {
					let __goscriptTuple14: any = await __goscript_dnsclient_unix.dnsStreamRoundTrip(c, $.uint(id, 16), $.markAsStructValue($.cloneStructValue(q)), tcpReq)
					p.value = __goscriptTuple14[0]
					h = __goscriptTuple14[1]
					__goscriptShadow6 = __goscriptTuple14[2]
				}
			}
			await $.pointerValue<Exclude<__goscript_net.Conn, null>>(c).Close()
			if (__goscriptShadow6 != null) {
				return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), __goscript_net.mapErr(__goscriptShadow6)]
			}
			{
				let __goscriptShadow7 = p.value.SkipQuestion()
				if (!$.comparableEqual(__goscriptShadow7, dnsmessage.ErrSectionDone)) {
					return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), __goscript_dnsclient_unix.errInvalidDNSResponse]
				}
			}

			if (h.Truncated && ($.stringEqual(network, "udp"))) {
				continue
			}
			return [$.markAsStructValue($.cloneStructValue(p.value)), $.markAsStructValue($.cloneStructValue(h)), null]
		}
		return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), __goscript_dnsclient_unix.errNoAnswerFromDNSServer]
	}

	public getLookupGroup(): singleflight.Group | $.VarRef<singleflight.Group> | null {
		const r: Resolver | $.VarRef<Resolver> | null = this
		if (r == null) {
			return $.pointerValue<Resolver>(DefaultResolver)._fields.lookupGroup
		}
		return $.pointerValue<Resolver>(r)._fields.lookupGroup
	}

	public async goLookupCNAME(ctx: context.Context | null, host: string, order: __goscript_dnsclient_unix.hostLookupOrder, conf: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null): globalThis.Promise<[string, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let [, cname, err] = await Resolver.prototype.goLookupIPCNAMEOrder.call(r, ctx, "CNAME", host, order, conf)
		return [$.markAsStructValue($.cloneStructValue(cname)).String(), err]
	}

	public async goLookupHostOrder(ctx: context.Context | null, name: string, order: __goscript_dnsclient_unix.hostLookupOrder, conf: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null): globalThis.Promise<[$.Slice<string>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let addrs: $.Slice<string> = null as $.Slice<string>
		let err: $.GoError = null as $.GoError
		if ((order == 1) || (order == 3)) {

			let __goscriptTuple15: any = await __goscript_hosts.lookupStaticHost(name)
			addrs = __goscriptTuple15[0]
			if ($.len(addrs) > 0) {
				return [addrs, err]
			}

			if (order == 3) {
				return [null, $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), name, ""), "*net.DNSError")]
			}
		}
		let __goscriptTuple16: any = await Resolver.prototype.goLookupIPCNAMEOrder.call(r, ctx, "ip", name, order, conf)
		let ips: $.Slice<__goscript_iprawsock.IPAddr> = __goscriptTuple16[0]
		err = __goscriptTuple16[2]
		if (err != null) {
			return [addrs, err]
		}
		addrs = $.makeSlice<string>(0, $.len(ips), "string")
		for (let __goscriptRangeTarget7 = ips, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget7); __rangeIndex++) {
			let ip = $.varRef(__goscriptRangeTarget7![__rangeIndex])
			addrs = $.append(addrs, ip.value.String())
		}
		return [addrs, err]
	}

	public async goLookupIP(ctx: context.Context | null, network: string, host: string, order: __goscript_dnsclient_unix.hostLookupOrder, conf: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null): globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let addrs: $.Slice<__goscript_iprawsock.IPAddr> = null as $.Slice<__goscript_iprawsock.IPAddr>
		let err: $.GoError = null as $.GoError
		let __goscriptTuple17: any = await Resolver.prototype.goLookupIPCNAMEOrder.call(r, ctx, network, host, order, conf)
		addrs = __goscriptTuple17[0]
		err = __goscriptTuple17[2]
		return [addrs, err]
	}

	public async goLookupIPCNAMEOrder(ctx: context.Context | null, network: string, name: string, order: __goscript_dnsclient_unix.hostLookupOrder, conf: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null): globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, dnsmessage.Name, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let addrs: $.Slice<__goscript_iprawsock.IPAddr> = null as $.Slice<__goscript_iprawsock.IPAddr>
		let cname: dnsmessage.Name = $.markAsStructValue(new dnsmessage.Name())
		let err: $.GoError = null as $.GoError
		if ((order == 1) || (order == 3)) {
			let canonical: string = ""
			let __goscriptTuple18: any = await __goscript_dnsclient_unix.goLookupIPFiles(name)
			addrs = __goscriptTuple18[0]
			canonical = __goscriptTuple18[1]

			if ($.len(addrs) > 0) {
				let __goscriptShadow8: $.GoError = null as $.GoError
				let __goscriptTuple19: any = dnsmessage.NewName(canonical)
				cname = __goscriptTuple19[0]
				__goscriptShadow8 = __goscriptTuple19[1]
				if (__goscriptShadow8 != null) {
					return [null, $.markAsStructValue(new dnsmessage.Name()), __goscriptShadow8]
				}
				return [addrs, $.markAsStructValue($.cloneStructValue(cname)), null]
			}

			if (order == 3) {
				return [null, $.markAsStructValue(new dnsmessage.Name()), $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), name, ""), "*net.DNSError")]
			}
		}

		if (!__goscript_dnsclient.isDomainName(name)) {

			return [null, $.markAsStructValue(new dnsmessage.Name()), $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), name, ""), "*net.DNSError")]
		}
		class result {
			public get p(): dnsmessage.Parser {
				return this._fields.p.value
			}
			public set p(value: dnsmessage.Parser) {
				this._fields.p.value = value
			}

			public get server(): string {
				return this._fields.server.value
			}
			public set server(value: string) {
				this._fields.server.value = value
			}

			public get error(): $.GoError {
				return this._fields.error.value
			}
			public set error(value: $.GoError) {
				this._fields.error.value = value
			}

			public _fields: {
				p: $.VarRef<dnsmessage.Parser>
				server: $.VarRef<string>
				error: $.VarRef<$.GoError>
			}

			constructor(init?: Partial<{p?: dnsmessage.Parser, server?: string, error?: $.GoError}>) {
				this._fields = {
					p: $.varRef(init?.p ? $.markAsStructValue($.cloneStructValue(init.p)) : $.markAsStructValue(new dnsmessage.Parser())),
					server: $.varRef(init?.server ?? ("" as string)),
					error: $.varRef(init?.error ?? (null as $.GoError))
				}
			}

			public clone(): result {
				const cloned = new result()
				cloned._fields = {
					p: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.p.value))),
					server: $.varRef(this._fields.server.value),
					error: $.varRef(this._fields.error.value)
				}
				return $.markAsStructValue(cloned)
			}

			public Error(): any {
				return $.pointerValue<Exclude<$.GoError, null>>(this.error).Error()
			}

			static __typeInfo = $.registerStructType(
				"net.result",
				() => new result(),
				[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
				result,
				[{ name: "p", key: "p", type: "dnsmessage.Parser", pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "server", key: "server", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [1], offset: 80, exported: false }, { name: "error", key: "error", type: "error", pkgPath: "net", anonymous: true, index: [2], offset: 96, exported: false }]
			)
		}

		if (conf == null) {
			conf = await __goscript_dnsclient_unix.getSystemDNSConfig()
		}

		let lane: $.Channel<result> | null = $.makeChannel<result>(1, $.markAsStructValue(new result()), "both")
		let qtypes: $.Slice<dnsmessage.Type> = $.arrayToSlice<dnsmessage.Type>([$.uint(dnsmessage.TypeA, 16), $.uint(dnsmessage.TypeAAAA, 16)])
		if ($.stringEqual(network, "CNAME")) {
			qtypes = $.append(qtypes, $.uint(dnsmessage.TypeCNAME, 16))
		}
		switch (ipVersion(network)) {
			case 52:
			{
				qtypes = $.arrayToSlice<dnsmessage.Type>([$.uint(dnsmessage.TypeA, 16)])
				break
			}
			case 54:
			{
				qtypes = $.arrayToSlice<dnsmessage.Type>([$.uint(dnsmessage.TypeAAAA, 16)])
				break
			}
		}
		let queryFn: ((fqdn: string, qtype: dnsmessage.Type) => void) | null = null as ((fqdn: string, qtype: dnsmessage.Type) => void) | null
		let responseFn: ((fqdn: string, qtype: dnsmessage.Type) => result | globalThis.Promise<result>) | null = null as ((fqdn: string, qtype: dnsmessage.Type) => result | globalThis.Promise<result>) | null
		if ($.pointerValue<__goscript_dnsconfig.dnsConfig>(conf).singleRequest) {
			queryFn = $.functionValue((fqdn: string, qtype: dnsmessage.Type): void => {
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "uint16", typeName: "dnsmessage.Type" }], results: [] } as $.FunctionTypeInfo))
			responseFn = $.functionValue(async (fqdn: string, qtype: dnsmessage.Type): globalThis.Promise<result> => {
				using __defer = new $.DisposableStack()
				dnsWaitGroup.value.Add(1)
				__defer.defer(() => { dnsWaitGroup.value.Done() })
				let [p, server, __goscriptShadow9] = await Resolver.prototype.tryOneName.call(r, ctx, conf, fqdn, $.uint(qtype, 16))
				return $.markAsStructValue(new result({p: $.markAsStructValue($.cloneStructValue(p)), server: server, error: __goscriptShadow9}))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "uint16", typeName: "dnsmessage.Type" }], results: ["net.result"] } as $.FunctionTypeInfo))
		} else {
			queryFn = $.functionValue(async (fqdn: string, qtype: dnsmessage.Type): globalThis.Promise<void> => {
				dnsWaitGroup.value.Add(1)
				queueMicrotask(async () => { await (async (qtype: dnsmessage.Type): globalThis.Promise<void> => {
					let [p, server, __goscriptShadow10] = await Resolver.prototype.tryOneName.call(r, ctx, conf, fqdn, $.uint(qtype, 16))
					await $.chanSend(lane, $.markAsStructValue(new result({p: $.markAsStructValue($.cloneStructValue(p)), server: server, error: __goscriptShadow10})))
					dnsWaitGroup.value.Done()
				})($.uint(qtype, 16)) })
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "uint16", typeName: "dnsmessage.Type" }], results: [] } as $.FunctionTypeInfo))
			responseFn = $.functionValue(async (fqdn: string, qtype: dnsmessage.Type): globalThis.Promise<result> => {
				return $.markAsStructValue($.cloneStructValue(await $.chanRecv(lane)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "uint16", typeName: "dnsmessage.Type" }], results: ["net.result"] } as $.FunctionTypeInfo))
		}
		let lastErr: $.GoError = null as $.GoError
		for (let __goscriptRangeTarget10 = __goscript_dnsconfig.dnsConfig.prototype.nameList.call(conf, name), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget10); __rangeIndex++) {
			let fqdn = __goscriptRangeTarget10![__rangeIndex]
			for (let __goscriptRangeTarget8 = qtypes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget8); __rangeIndex++) {
				let qtype = __goscriptRangeTarget8![__rangeIndex]
				await queryFn!(fqdn, $.uint(qtype, 16))
			}
			let hitStrictError = false
			for (let __goscriptRangeTarget9 = qtypes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
				let qtype = __goscriptRangeTarget9![__rangeIndex]
				let __goscriptShadow11 = $.markAsStructValue($.cloneStructValue(await responseFn!(fqdn, $.uint(qtype, 16))))
				if (__goscriptShadow11.error != null) {
					{
						let [nerr, ok] = $.typeAssertTuple<__goscript_net.Error | null>(__goscriptShadow11.error, "net.Error")
						if ((ok && await $.pointerValue<Exclude<__goscript_net.Error, null>>(nerr).Temporary()) && Resolver.prototype.strictErrors.call(r)) {

							hitStrictError = true
							lastErr = __goscriptShadow11.error
						} else {
							if ((lastErr == null) || ($.stringEqual(fqdn, (name + ".")))) {

								lastErr = __goscriptShadow11.error
							}
						}
					}
					continue
				}

				loop: while (true) {
					let [h, __goscriptShadow12] = __goscriptShadow11.p.AnswerHeader()
					if ((__goscriptShadow12 != null) && (!$.comparableEqual(__goscriptShadow12, dnsmessage.ErrSectionDone))) {
						lastErr = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField0 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_dnsclient_unix.errCannotUnmarshalDNSMessage).Error(); return new __goscript_net.DNSError({Err: __goscriptLiteralField0, Name: name, Server: __goscriptShadow11.server}) })(), "*net.DNSError")
					}
					if (__goscriptShadow12 != null) {
						break
					}
					switch (h.Type) {
						case dnsmessage.TypeA:
						{
							let [a, __goscriptShadow13] = __goscriptShadow11.p.AResource()
							if (__goscriptShadow13 != null) {
								lastErr = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField1 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_dnsclient_unix.errCannotUnmarshalDNSMessage).Error(); return new __goscript_net.DNSError({Err: __goscriptLiteralField1, Name: name, Server: __goscriptShadow11.server}) })(), "*net.DNSError")
								break loop
							}
							addrs = $.append(addrs, $.markAsStructValue(new __goscript_iprawsock.IPAddr({IP: (($.goSlice(a.A, undefined, undefined) as __goscript_ip.IP) as __goscript_ip.IP)})))
							if (($.uint(cname.Length, 8) == $.uint(0, 8)) && ($.uint(h.Name.Length, 8) != $.uint(0, 8))) {
								cname = $.markAsStructValue($.cloneStructValue(h.Name))
							}
							break
						}
						case dnsmessage.TypeAAAA:
						{
							let [aaaa, __goscriptShadow14] = __goscriptShadow11.p.AAAAResource()
							if (__goscriptShadow14 != null) {
								lastErr = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField2 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_dnsclient_unix.errCannotUnmarshalDNSMessage).Error(); return new __goscript_net.DNSError({Err: __goscriptLiteralField2, Name: name, Server: __goscriptShadow11.server}) })(), "*net.DNSError")
								break loop
							}
							addrs = $.append(addrs, $.markAsStructValue(new __goscript_iprawsock.IPAddr({IP: (($.goSlice(aaaa.AAAA, undefined, undefined) as __goscript_ip.IP) as __goscript_ip.IP)})))
							if (($.uint(cname.Length, 8) == $.uint(0, 8)) && ($.uint(h.Name.Length, 8) != $.uint(0, 8))) {
								cname = $.markAsStructValue($.cloneStructValue(h.Name))
							}
							break
						}
						case dnsmessage.TypeCNAME:
						{
							let [c, __goscriptShadow15] = __goscriptShadow11.p.CNAMEResource()
							if (__goscriptShadow15 != null) {
								lastErr = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField3 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_dnsclient_unix.errCannotUnmarshalDNSMessage).Error(); return new __goscript_net.DNSError({Err: __goscriptLiteralField3, Name: name, Server: __goscriptShadow11.server}) })(), "*net.DNSError")
								break loop
							}
							if (($.uint(cname.Length, 8) == $.uint(0, 8)) && ($.uint(c.CNAME.Length, 8) > $.uint(0, 8))) {
								cname = $.markAsStructValue($.cloneStructValue(c.CNAME))
							}
							break
						}
						default:
						{
							{
								let __goscriptShadow16 = __goscriptShadow11.p.SkipAnswer()
								if (__goscriptShadow16 != null) {
									lastErr = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField4 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_dnsclient_unix.errCannotUnmarshalDNSMessage).Error(); return new __goscript_net.DNSError({Err: __goscriptLiteralField4, Name: name, Server: __goscriptShadow11.server}) })(), "*net.DNSError")
									break loop
								}
							}
							continue
							break
						}
					}
				}
			}
			if (hitStrictError) {

				addrs = null
				break
			}
			if (($.len(addrs) > 0) || (($.stringEqual(network, "CNAME")) && ($.uint(cname.Length, 8) > $.uint(0, 8)))) {
				break
			}
		}
		let __goscriptShadow17 = lastErr
		{
			let __goscriptTuple20: any = $.typeAssertTuple<__goscript_net.DNSError | $.VarRef<__goscript_net.DNSError> | null>(__goscriptShadow17, { kind: $.TypeKind.Pointer, elemType: "net.DNSError" })
			let __goscriptShadow18: __goscript_net.DNSError | $.VarRef<__goscript_net.DNSError> | null = __goscriptTuple20[0]
			let ok = __goscriptTuple20[1]
			if (ok) {

				$.pointerValue<__goscript_net.DNSError>(__goscriptShadow18).Name = name
			}
		}
		await __goscript_addrselect.sortByRFC6724(addrs)
		if (($.len(addrs) == 0) && !(($.stringEqual(network, "CNAME")) && ($.uint(cname.Length, 8) > $.uint(0, 8)))) {
			if (order == 2) {
				let canonical: string = ""
				let __goscriptTuple21: any = await __goscript_dnsclient_unix.goLookupIPFiles(name)
				addrs = __goscriptTuple21[0]
				canonical = __goscriptTuple21[1]
				if ($.len(addrs) > 0) {
					let __goscriptShadow19: $.GoError = null as $.GoError
					let __goscriptTuple22: any = dnsmessage.NewName(canonical)
					cname = __goscriptTuple22[0]
					__goscriptShadow19 = __goscriptTuple22[1]
					if (__goscriptShadow19 != null) {
						return [null, $.markAsStructValue(new dnsmessage.Name()), __goscriptShadow19]
					}
					return [addrs, $.markAsStructValue($.cloneStructValue(cname)), null]
				}
			}
			if (lastErr != null) {
				return [null, $.markAsStructValue(new dnsmessage.Name()), lastErr]
			}
		}
		return [addrs, $.markAsStructValue($.cloneStructValue(cname)), null]
	}

	public async goLookupMX(ctx: context.Context | null, name: string): globalThis.Promise<[$.Slice<__goscript_dnsclient.MX | $.VarRef<__goscript_dnsclient.MX> | null>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let __goscriptTuple23: any = await Resolver.prototype.lookup.call(r, ctx, name, $.uint(dnsmessage.TypeMX, 16), null)
		let p = $.varRef(__goscriptTuple23[0])
		let server = __goscriptTuple23[1]
		let err = __goscriptTuple23[2]
		if (err != null) {
			return [null, err]
		}
		let mxs: $.Slice<__goscript_dnsclient.MX | $.VarRef<__goscript_dnsclient.MX> | null> = null as $.Slice<__goscript_dnsclient.MX | $.VarRef<__goscript_dnsclient.MX> | null>
		while (true) {
			let [h, __goscriptShadow20] = p.value.AnswerHeader()
			if ($.comparableEqual(__goscriptShadow20, dnsmessage.ErrSectionDone)) {
				break
			}
			if (__goscriptShadow20 != null) {
				return [null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
			}
			if ($.uint(h.Type, 16) != $.uint(dnsmessage.TypeMX, 16)) {
				{
					let __goscriptShadow21 = p.value.SkipAnswer()
					if (__goscriptShadow21 != null) {
						return [null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
					}
				}
				continue
			}
			let __goscriptTuple24: any = p.value.MXResource()
			let mx = __goscriptTuple24[0]
			__goscriptShadow20 = __goscriptTuple24[1]
			if (__goscriptShadow20 != null) {
				return [null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
			}
			mxs = $.append(mxs, (() => { const __goscriptLiteralField5 = $.markAsStructValue($.cloneStructValue(mx.MX)).String(); return new __goscript_dnsclient.MX({Host: __goscriptLiteralField5, Pref: $.uint(mx.Pref, 16)}) })())
		}
		await __goscript_dnsclient.byPref_sort((mxs as __goscript_dnsclient.byPref))
		return [mxs, null]
	}

	public async goLookupNS(ctx: context.Context | null, name: string): globalThis.Promise<[$.Slice<__goscript_dnsclient.NS | $.VarRef<__goscript_dnsclient.NS> | null>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let __goscriptTuple25: any = await Resolver.prototype.lookup.call(r, ctx, name, $.uint(dnsmessage.TypeNS, 16), null)
		let p = $.varRef(__goscriptTuple25[0])
		let server = __goscriptTuple25[1]
		let err = __goscriptTuple25[2]
		if (err != null) {
			return [null, err]
		}
		let nss: $.Slice<__goscript_dnsclient.NS | $.VarRef<__goscript_dnsclient.NS> | null> = null as $.Slice<__goscript_dnsclient.NS | $.VarRef<__goscript_dnsclient.NS> | null>
		while (true) {
			let [h, __goscriptShadow22] = p.value.AnswerHeader()
			if ($.comparableEqual(__goscriptShadow22, dnsmessage.ErrSectionDone)) {
				break
			}
			if (__goscriptShadow22 != null) {
				return [null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
			}
			if ($.uint(h.Type, 16) != $.uint(dnsmessage.TypeNS, 16)) {
				{
					let __goscriptShadow23 = p.value.SkipAnswer()
					if (__goscriptShadow23 != null) {
						return [null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
					}
				}
				continue
			}
			let __goscriptTuple26: any = p.value.NSResource()
			let ns = __goscriptTuple26[0]
			__goscriptShadow22 = __goscriptTuple26[1]
			if (__goscriptShadow22 != null) {
				return [null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
			}
			nss = $.append(nss, (() => { const __goscriptLiteralField6 = $.markAsStructValue($.cloneStructValue(ns.NS)).String(); return new __goscript_dnsclient.NS({Host: __goscriptLiteralField6}) })())
		}
		return [nss, null]
	}

	public async goLookupPTR(ctx: context.Context | null, addr: string, order: __goscript_dnsclient_unix.hostLookupOrder, conf: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null): globalThis.Promise<[$.Slice<string>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		if ((order == 3) || (order == 1)) {
			let names: $.Slice<string> = await __goscript_hosts.lookupStaticAddr(addr)
			if ($.len(names) > 0) {
				return [names, null]
			}

			if (order == 3) {
				return [null, $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), addr, ""), "*net.DNSError")]
			}
		}

		let [arpa, err] = __goscript_dnsclient.reverseaddr(addr)
		if (err != null) {
			return [null, err]
		}
		let __goscriptTuple27: any = await Resolver.prototype.lookup.call(r, ctx, arpa, $.uint(dnsmessage.TypePTR, 16), conf)
		let p = $.varRef(__goscriptTuple27[0])
		let server = __goscriptTuple27[1]
		err = __goscriptTuple27[2]
		if (err != null) {
			{
				let __goscriptTuple28: any = errors.AsType({E: { type: { kind: $.TypeKind.Pointer, elemType: "net.DNSError" }, zero: () => null }}, $.pointerValueOrNil(err)!)
				let dnsErr: __goscript_net.DNSError | $.VarRef<__goscript_net.DNSError> | null = (__goscriptTuple28[0] as __goscript_net.DNSError | $.VarRef<__goscript_net.DNSError> | null)
				let ok = __goscriptTuple28[1]
				if (ok && $.pointerValue<__goscript_net.DNSError>(dnsErr).IsNotFound) {
					if (order == 2) {
						let names: $.Slice<string> = await __goscript_hosts.lookupStaticAddr(addr)
						if ($.len(names) > 0) {
							return [names, null]
						}
					}
				}
			}
			return [null, err]
		}
		let ptrs: $.Slice<string> = null as $.Slice<string>
		while (true) {
			let [h, __goscriptShadow24] = p.value.AnswerHeader()
			if ($.comparableEqual(__goscriptShadow24, dnsmessage.ErrSectionDone)) {
				break
			}
			if (__goscriptShadow24 != null) {
				return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField7 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_dnsclient_unix.errCannotUnmarshalDNSMessage).Error(); return new __goscript_net.DNSError({Err: __goscriptLiteralField7, Name: addr, Server: server}) })(), "*net.DNSError")]
			}
			if ($.uint(h.Type, 16) != $.uint(dnsmessage.TypePTR, 16)) {
				let __goscriptShadow25 = p.value.SkipAnswer()
				if (__goscriptShadow25 != null) {
					return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField8 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_dnsclient_unix.errCannotUnmarshalDNSMessage).Error(); return new __goscript_net.DNSError({Err: __goscriptLiteralField8, Name: addr, Server: server}) })(), "*net.DNSError")]
				}
				continue
			}
			let __goscriptTuple29: any = p.value.PTRResource()
			let ptr = __goscriptTuple29[0]
			__goscriptShadow24 = __goscriptTuple29[1]
			if (__goscriptShadow24 != null) {
				return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField9 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_dnsclient_unix.errCannotUnmarshalDNSMessage).Error(); return new __goscript_net.DNSError({Err: __goscriptLiteralField9, Name: addr, Server: server}) })(), "*net.DNSError")]
			}
			ptrs = $.append(ptrs, $.markAsStructValue($.cloneStructValue(ptr.PTR)).String())
		}

		return [ptrs, null]
	}

	public async goLookupSRV(ctx: context.Context | null, service: string, proto: string, name: string): globalThis.Promise<[string, $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let target: string = ""
		let srvs: $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null> = null as $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null>
		let err: $.GoError = null as $.GoError
		if (($.stringEqual(service, "")) && ($.stringEqual(proto, ""))) {
			target = name
		} else {
			target = (((("_" + service) + "._") + proto) + ".") + name
		}
		let __goscriptTuple30: any = await Resolver.prototype.lookup.call(r, ctx, target, $.uint(dnsmessage.TypeSRV, 16), null)
		let p = $.varRef(__goscriptTuple30[0])
		let server = __goscriptTuple30[1]
		err = __goscriptTuple30[2]
		if (err != null) {
			return ["", null, err]
		}
		let cname: dnsmessage.Name = $.markAsStructValue(new dnsmessage.Name())
		while (true) {
			let [h, __goscriptShadow26] = p.value.AnswerHeader()
			if ($.comparableEqual(__goscriptShadow26, dnsmessage.ErrSectionDone)) {
				break
			}
			if (__goscriptShadow26 != null) {
				return ["", null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
			}
			if ($.uint(h.Type, 16) != $.uint(dnsmessage.TypeSRV, 16)) {
				{
					let __goscriptShadow27 = p.value.SkipAnswer()
					if (__goscriptShadow27 != null) {
						return ["", null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
					}
				}
				continue
			}
			if (($.uint(cname.Length, 8) == $.uint(0, 8)) && ($.uint(h.Name.Length, 8) != $.uint(0, 8))) {
				cname = $.markAsStructValue($.cloneStructValue(h.Name))
			}
			let __goscriptTuple31: any = p.value.SRVResource()
			let srv = __goscriptTuple31[0]
			__goscriptShadow26 = __goscriptTuple31[1]
			if (__goscriptShadow26 != null) {
				return ["", null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
			}
			srvs = $.append(srvs, (() => { const __goscriptLiteralField10 = $.markAsStructValue($.cloneStructValue(srv.Target)).String(); return new __goscript_dnsclient.SRV({Target: __goscriptLiteralField10, Port: $.uint(srv.Port, 16), Priority: $.uint(srv.Priority, 16), Weight: $.uint(srv.Weight, 16)}) })())
		}
		await __goscript_dnsclient.byPriorityWeight_sort((srvs as __goscript_dnsclient.byPriorityWeight))
		return [$.markAsStructValue($.cloneStructValue(cname)).String(), srvs, null]
	}

	public async goLookupTXT(ctx: context.Context | null, name: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let __goscriptTuple32: any = await Resolver.prototype.lookup.call(r, ctx, name, $.uint(dnsmessage.TypeTXT, 16), null)
		let p = $.varRef(__goscriptTuple32[0])
		let server = __goscriptTuple32[1]
		let err = __goscriptTuple32[2]
		if (err != null) {
			return [null, err]
		}
		let txts: $.Slice<string> = null as $.Slice<string>
		while (true) {
			let [h, __goscriptShadow28] = p.value.AnswerHeader()
			if ($.comparableEqual(__goscriptShadow28, dnsmessage.ErrSectionDone)) {
				break
			}
			if (__goscriptShadow28 != null) {
				return [null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
			}
			if ($.uint(h.Type, 16) != $.uint(dnsmessage.TypeTXT, 16)) {
				{
					let __goscriptShadow29 = p.value.SkipAnswer()
					if (__goscriptShadow29 != null) {
						return [null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
					}
				}
				continue
			}
			let __goscriptTuple33: any = p.value.TXTResource()
			let txt = __goscriptTuple33[0]
			__goscriptShadow28 = __goscriptTuple33[1]
			if (__goscriptShadow28 != null) {
				return [null, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "cannot unmarshal DNS message", Name: name, Server: server}), "*net.DNSError")]
			}
			// Multiple strings in one TXT record need to be
			// concatenated without separator to be consistent
			// with previous Go resolver.
			let n = 0
			for (let __goscriptRangeTarget11 = txt.TXT, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget11); __rangeIndex++) {
				let s = __goscriptRangeTarget11![__rangeIndex]
				n = n + ($.len(s))
			}
			let txtJoin: $.Slice<number> = $.makeSlice<number>(0, n, "byte")
			for (let __goscriptRangeTarget12 = txt.TXT, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget12); __rangeIndex++) {
				let s = __goscriptRangeTarget12![__rangeIndex]
				txtJoin = $.appendSlice(txtJoin, $.stringToBytes(s))
			}
			if ($.len(txts) == 0) {
				txts = $.makeSlice<string>(0, 1, "string")
			}
			txts = $.append(txts, $.bytesToString(txtJoin))
		}
		return [txts, null]
	}

	public async internetAddrList(ctx: context.Context | null, net: string, addr: string): globalThis.Promise<[__goscript_ipsock.addrList, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let err: $.GoError = null as $.GoError
		let host: string = ""
		let port: string = ""
		let portnum: number = 0
		switch (net) {
			case "tcp":
			case "tcp4":
			case "tcp6":
			case "udp":
			case "udp4":
			case "udp6":
			{
				if (!$.stringEqual(addr, "")) {
					{
						let __goscriptTuple34: any = await __goscript_ipsock.SplitHostPort(addr)
						host = __goscriptTuple34[0]
						port = __goscriptTuple34[1]
						err = __goscriptTuple34[2]
						if (err != null) {
							return [(null as __goscript_ipsock.addrList), err]
						}
					}
					{
						let __goscriptTuple35: any = await Resolver.prototype.LookupPort.call(r, ctx, net, port)
						portnum = __goscriptTuple35[0]
						err = __goscriptTuple35[1]
						if (err != null) {
							return [(null as __goscript_ipsock.addrList), err]
						}
					}
				}
				break
			}
			case "ip":
			case "ip4":
			case "ip6":
			{
				if (!$.stringEqual(addr, "")) {
					host = addr
				}
				break
			}
			default:
			{
				return [(null as __goscript_ipsock.addrList), $.namedValueInterfaceValue<$.GoError>(net, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
				break
			}
		}
		let inetaddr: ((ip: __goscript_iprawsock.IPAddr) => __goscript_net.Addr | null | globalThis.Promise<__goscript_net.Addr | null>) | null = $.functionValue((ip: __goscript_iprawsock.IPAddr): __goscript_net.Addr | null => {
			switch (net) {
				case "tcp":
				case "tcp4":
				case "tcp6":
				{
					return $.interfaceValue<__goscript_net.Addr | null>(new __goscript_tcpsock.TCPAddr({IP: (ip.IP as __goscript_ip.IP), Port: portnum, Zone: ip.Zone}), "*net.TCPAddr")
					break
				}
				case "udp":
				case "udp4":
				case "udp6":
				{
					return $.interfaceValue<__goscript_net.Addr | null>(new __goscript_udpsock.UDPAddr({IP: (ip.IP as __goscript_ip.IP), Port: portnum, Zone: ip.Zone}), "*net.UDPAddr")
					break
				}
				case "ip":
				case "ip4":
				case "ip6":
				{
					return $.interfaceValue<__goscript_net.Addr | null>(new __goscript_iprawsock.IPAddr({IP: (ip.IP as __goscript_ip.IP), Zone: ip.Zone}), "*net.IPAddr")
					break
				}
				default:
				{
					$.panic("unexpected network: " + net)
					break
				}
			}
		}, ({ kind: $.TypeKind.Function, params: ["net.IPAddr"], results: ["net.Addr"] } as $.FunctionTypeInfo))
		if ($.stringEqual(host, "")) {
			return [($.arrayToSlice<__goscript_net.Addr | null>([await inetaddr!($.markAsStructValue(new __goscript_iprawsock.IPAddr()))]) as __goscript_ipsock.addrList), null]
		}

		let __goscriptTuple36: any = await Resolver.prototype.lookupIPAddr.call(r, ctx, net, host)
		let ips: $.Slice<__goscript_iprawsock.IPAddr> = __goscriptTuple36[0]
		err = __goscriptTuple36[1]
		if (err != null) {
			return [(null as __goscript_ipsock.addrList), err]
		}

		if (($.len(ips) == 1) && __goscript_ip.IP_Equal($.arrayIndex(ips!, 0).IP, (__goscript_ip.IPv6unspecified as __goscript_ip.IP))) {
			ips = $.append(ips, $.markAsStructValue(new __goscript_iprawsock.IPAddr({IP: (__goscript_ip.IPv4zero as __goscript_ip.IP)})))
		}

		let filter: ((_p0: __goscript_iprawsock.IPAddr) => boolean | globalThis.Promise<boolean>) | null = null as ((_p0: __goscript_iprawsock.IPAddr) => boolean | globalThis.Promise<boolean>) | null
		if ((!$.stringEqual(net, "")) && ($.uint($.indexStringOrBytes(net, $.len(net) - 1), 8) == $.uint(52, 8))) {
			filter = __goscript_ipsock.ipv4only
		}
		if ((!$.stringEqual(net, "")) && ($.uint($.indexStringOrBytes(net, $.len(net) - 1), 8) == $.uint(54, 8))) {
			filter = __goscript_ipsock.ipv6only
		}
		const __goscriptReturn6 = await __goscript_ipsock.filterAddrList(filter, ips, inetaddr, host)
		return [(__goscriptReturn6[0] as __goscript_ipsock.addrList), __goscriptReturn6[1]]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async lookup(ctx: context.Context | null, name: string, qtype: dnsmessage.Type, conf: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null): globalThis.Promise<[dnsmessage.Parser, string, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		if (!__goscript_dnsclient.isDomainName(name)) {

			return [$.markAsStructValue(new dnsmessage.Parser()), "", $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), name, ""), "*net.DNSError")]
		}

		if (conf == null) {
			conf = await __goscript_dnsclient_unix.getSystemDNSConfig()
		}

		let p: dnsmessage.Parser = $.markAsStructValue(new dnsmessage.Parser())
		let server: string = ""
		let err: $.GoError = null as $.GoError
		for (let __goscriptRangeTarget13 = __goscript_dnsconfig.dnsConfig.prototype.nameList.call(conf, name), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget13); __rangeIndex++) {
			let fqdn = __goscriptRangeTarget13![__rangeIndex]
			let __goscriptTuple37: any = await Resolver.prototype.tryOneName.call(r, ctx, conf, fqdn, $.uint(qtype, 16))
			p = __goscriptTuple37[0]
			server = __goscriptTuple37[1]
			err = __goscriptTuple37[2]
			if (err == null) {
				break
			}
			{
				let [nerr, ok] = $.typeAssertTuple<__goscript_net.Error | null>(err, "net.Error")
				if ((ok && await $.pointerValue<Exclude<__goscript_net.Error, null>>(nerr).Temporary()) && Resolver.prototype.strictErrors.call(r)) {

					break
				}
			}
		}
		if (err == null) {
			return [$.markAsStructValue($.cloneStructValue(p)), server, null]
		}
		let __goscriptShadow30 = err
		{
			let __goscriptTuple38: any = $.typeAssertTuple<__goscript_net.DNSError | $.VarRef<__goscript_net.DNSError> | null>(__goscriptShadow30, { kind: $.TypeKind.Pointer, elemType: "net.DNSError" })
			let __goscriptShadow31: __goscript_net.DNSError | $.VarRef<__goscript_net.DNSError> | null = __goscriptTuple38[0]
			let ok = __goscriptTuple38[1]
			if (ok) {

				$.pointerValue<__goscript_net.DNSError>(__goscriptShadow31).Name = name
			}
		}
		return [$.markAsStructValue(new dnsmessage.Parser()), "", err]
	}

	public async lookupAddr(ctx: context.Context | null, addr: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let __goscriptTuple39: any = await __goscript_conf.conf.prototype.addrLookupOrder.call(await __goscript_conf.systemConf(), r, addr)
		let order = __goscriptTuple39[0]
		let __goscriptShadow32: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null = __goscriptTuple39[1]
		if (order == 0) {
			return __goscript_cgo_stub.cgoLookupPTR(ctx, addr)
		}
		return Resolver.prototype.goLookupPTR.call(r, ctx, addr, order, __goscriptShadow32)
	}

	public async lookupCNAME(ctx: context.Context | null, name: string): globalThis.Promise<[string, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let __goscriptTuple40: any = await __goscript_conf.conf.prototype.hostLookupOrder.call(await __goscript_conf.systemConf(), r, name)
		let order = __goscriptTuple40[0]
		let __goscriptShadow33: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null = __goscriptTuple40[1]
		if (order == 0) {
			{
				let [cname, err] = __goscript_cgo_stub.cgoLookupCNAME(ctx, name)
				if (err == null) {
					return [cname, null]
				}
			}
		}
		return Resolver.prototype.goLookupCNAME.call(r, ctx, name, order, __goscriptShadow33)
	}

	public async lookupHost(ctx: context.Context | null, host: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let addrs: $.Slice<string> = null as $.Slice<string>
		let err: $.GoError = null as $.GoError
		let __goscriptTuple41: any = await __goscript_conf.conf.prototype.hostLookupOrder.call(await __goscript_conf.systemConf(), r, host)
		let order = __goscriptTuple41[0]
		let __goscriptShadow34: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null = __goscriptTuple41[1]
		if (order == 0) {
			return __goscript_cgo_stub.cgoLookupHost(ctx, host)
		}
		return Resolver.prototype.goLookupHostOrder.call(r, ctx, host, order, __goscriptShadow34)
	}

	public async lookupIP(ctx: context.Context | null, network: string, host: string): globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let addrs: $.Slice<__goscript_iprawsock.IPAddr> = null as $.Slice<__goscript_iprawsock.IPAddr>
		let err: $.GoError = null as $.GoError
		let __goscriptTuple42: any = await __goscript_conf.conf.prototype.hostLookupOrder.call(await __goscript_conf.systemConf(), r, host)
		let order = __goscriptTuple42[0]
		let __goscriptShadow35: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null = __goscriptTuple42[1]
		if (order == 0) {
			return __goscript_cgo_stub.cgoLookupIP(ctx, network, host)
		}
		let __goscriptTuple43: any = await Resolver.prototype.goLookupIPCNAMEOrder.call(r, ctx, network, host, order, __goscriptShadow35)
		let ips: $.Slice<__goscript_iprawsock.IPAddr> = __goscriptTuple43[0]
		err = __goscriptTuple43[2]
		return [ips, err]
	}

	public async lookupIPAddr(ctx: context.Context | null, network: string, host: string): globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		// Make sure that no matter what we do later, host=="" is rejected.
		if ($.stringEqual(host, "")) {
			return [null, $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), host, ""), "*net.DNSError")]
		}
		{
			let [ip, err] = netip.ParseAddr(host)
			if (err == null) {
				return [$.arrayToSlice<__goscript_iprawsock.IPAddr>([(() => { const __goscriptLiteralField11 = (__goscript_ip.IP_To16(($.markAsStructValue($.cloneStructValue(ip)).AsSlice() as __goscript_ip.IP)) as __goscript_ip.IP); const __goscriptLiteralField12 = $.markAsStructValue($.cloneStructValue(ip)).Zone(); return $.markAsStructValue(new __goscript_iprawsock.IPAddr({IP: __goscriptLiteralField11, Zone: __goscriptLiteralField12})) })()]), null]
			}
		}
		let __goscriptTuple44: any = $.typeAssertTuple<nettrace.Trace | $.VarRef<nettrace.Trace> | null>(await $.pointerValue<Exclude<context.Context, null>>(ctx).Value($.interfaceValue<any>($.markAsStructValue(new nettrace.TraceKey()), "nettrace.TraceKey")), { kind: $.TypeKind.Pointer, elemType: "nettrace.Trace" })
		let trace: nettrace.Trace | $.VarRef<nettrace.Trace> | null = __goscriptTuple44[0]
		if ((trace != null) && ($.pointerValue<nettrace.Trace>(trace).DNSStart != null)) {
			await $.pointerValue<nettrace.Trace>(trace).DNSStart!(host)
		}
		// The underlying resolver func is lookupIP by default but it
		// can be overridden by tests. This is needed by net/http, so it
		// uses a context key instead of unexported variables.
		let resolverFunc: ((ctx: context.Context | null, network: string, host: string) => [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] | globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>) | null = $.functionValue(((__receiver) => (ctx: context.Context | null, network: string, host: string) => __receiver.lookupIP(ctx, network, host))($.pointerValue<Resolver>(r)), ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Slice, elemType: "net.IPAddr" }, "error"] } as $.FunctionTypeInfo))
		{
			let [alt, ] = $.typeAssertTuple<((_p0: context.Context | null, _p1: string, _p2: string) => [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] | globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>) | null>(await $.pointerValue<Exclude<context.Context, null>>(ctx).Value($.interfaceValue<any>($.markAsStructValue(new nettrace.LookupIPAltResolverKey()), "nettrace.LookupIPAltResolverKey")), ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Slice, elemType: "net.IPAddr" }, "error"] } as $.FunctionTypeInfo))
			if (alt != null) {
				resolverFunc = alt
			}
		}

		// We don't want a cancellation of ctx to affect the
		// lookupGroup operation. Otherwise if our context gets
		// canceled it might cause an error to be returned to a lookup
		// using a completely different context. However we need to preserve
		// only the values in context. See Issue 28600.
		let [lookupGroupCtx, lookupGroupCancel] = context.WithCancel($.pointerValueOrNil(withUnexpiredValuesPreserved(ctx))!)

		let lookupKey = (network + "\x00") + host
		dnsWaitGroup.value.Add(1)
		let ch: $.Channel<singleflight.Result> | null = await singleflight.Group.prototype.DoChan.call(Resolver.prototype.getLookupGroup.call(r), lookupKey, $.functionValue(async (): globalThis.Promise<[any, $.GoError]> => {
			const __goscriptReturn13 = await __goscript_hook.__goscript_get_testHookLookupIP()!(lookupGroupCtx, resolverFunc, network, host)
			return [$.interfaceValue<any>(__goscriptReturn13[0], "[]net.IPAddr"), __goscriptReturn13[1]]
		}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }, "error"] } as $.FunctionTypeInfo)))

		let dnsWaitGroupDone: ((ch: $.Channel<singleflight.Result> | null, cancelFn: (() => void) | null) => void) | null = $.functionValue(async (ch: $.Channel<singleflight.Result> | null, cancelFn: context.CancelFunc | null): globalThis.Promise<void> => {
			await $.chanRecv(ch)
			dnsWaitGroup.value.Done()
			await cancelFn!()
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: "singleflight.Result" }, ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
				onSelected: async (__goscriptSelect0Result) => {
					if (await singleflight.Group.prototype.ForgetUnshared.call(Resolver.prototype.getLookupGroup.call(r), lookupKey)) {
						await lookupGroupCancel!()
						queueMicrotask(async () => { await dnsWaitGroupDone!(ch, $.functionValue((): void => {
						}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))) })
					} else {
						queueMicrotask(async () => { await dnsWaitGroupDone!(ch, lookupGroupCancel) })
					}
					let err: __goscript_net.DNSError | $.VarRef<__goscript_net.DNSError> | null = await __goscript_net.newDNSError(__goscript_net.mapErr(await $.pointerValue<Exclude<context.Context, null>>(ctx).Err()), host, "")
					if ((trace != null) && ($.pointerValue<nettrace.Trace>(trace).DNSDone != null)) {
						await $.pointerValue<nettrace.Trace>(trace).DNSDone!(null, false, $.interfaceValue<$.GoError>(err, "*net.DNSError"))
					}
					return [null, $.interfaceValue<$.GoError>(err, "*net.DNSError")]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: ch,
				onSelected: async (__goscriptSelect0Result) => {
					let r = __goscriptSelect0Result.value
					dnsWaitGroup.value.Done()
					await lookupGroupCancel!()
					let err = r.Err
					if (err != null) {
						{
							let [, ok] = $.typeAssertTuple<__goscript_net.DNSError | $.VarRef<__goscript_net.DNSError> | null>(err, { kind: $.TypeKind.Pointer, elemType: "net.DNSError" })
							if (!ok) {
								err = $.interfaceValue<$.GoError>(await __goscript_net.newDNSError(__goscript_net.mapErr(err), host, ""), "*net.DNSError")
							}
						}
					}
					if ((trace != null) && ($.pointerValue<nettrace.Trace>(trace).DNSDone != null)) {
						let __goscriptTuple45: any = $.typeAssertTuple<$.Slice<__goscript_iprawsock.IPAddr>>(r.Val, { kind: $.TypeKind.Slice, elemType: "net.IPAddr" })
						let addrs: $.Slice<__goscript_iprawsock.IPAddr> = __goscriptTuple45[0]
						await $.pointerValue<nettrace.Trace>(trace).DNSDone!(ipAddrsEface(addrs), r.Shared, err)
					}
					return lookupIPReturn(r.Val, err, r.Shared)
				}
			}
		], false)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async lookupMX(ctx: context.Context | null, name: string): globalThis.Promise<[$.Slice<__goscript_dnsclient.MX | $.VarRef<__goscript_dnsclient.MX> | null>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		return Resolver.prototype.goLookupMX.call(r, ctx, name)
	}

	public async lookupNS(ctx: context.Context | null, name: string): globalThis.Promise<[$.Slice<__goscript_dnsclient.NS | $.VarRef<__goscript_dnsclient.NS> | null>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		return Resolver.prototype.goLookupNS.call(r, ctx, name)
	}

	public async lookupPort(ctx: context.Context | null, network: string, service: string): globalThis.Promise<[number, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this

		if (!__goscript_conf.conf.prototype.mustUseGoResolver.call(await __goscript_conf.systemConf(), r)) {
			let [port, err] = __goscript_cgo_stub.cgoLookupPort(ctx, network, service)
			if (err != null) {

				{
					let [__goscriptShadow36, __goscriptShadow37] = await __goscript_port_unix.goLookupPort(network, service)
					if (__goscriptShadow37 == null) {
						return [__goscriptShadow36, null]
					}
				}
			}
			return [port, err]
		}
		return __goscript_port_unix.goLookupPort(network, service)
	}

	public async lookupSRV(ctx: context.Context | null, service: string, proto: string, name: string): globalThis.Promise<[string, $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		return Resolver.prototype.goLookupSRV.call(r, ctx, service, proto, name)
	}

	public async lookupTXT(ctx: context.Context | null, name: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		return Resolver.prototype.goLookupTXT.call(r, ctx, name)
	}

	public preferGo(): boolean {
		const r: Resolver | $.VarRef<Resolver> | null = this
		return (r != null) && $.pointerValue<Resolver>(r).PreferGo
	}

	public async resolveAddrList(ctx: context.Context | null, op: string, network: string, addr: string, hint: __goscript_net.Addr | null): globalThis.Promise<[__goscript_ipsock.addrList, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let [afnet, , err] = await __goscript_dial.parseNetwork(ctx, network, true)
		if (err != null) {
			return [(null as __goscript_ipsock.addrList), err]
		}
		if (($.stringEqual(op, "dial")) && ($.stringEqual(addr, ""))) {
			return [(null as __goscript_ipsock.addrList), __goscript_net.errMissingAddress]
		}
		switch (afnet) {
			case "unix":
			case "unixgram":
			case "unixpacket":
			{
				let __goscriptShadow38 = addr
				let __goscriptTuple46: any = __goscript_unixsock.ResolveUnixAddr(afnet, __goscriptShadow38)
				let __goscriptShadow39: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null = __goscriptTuple46[0]
				let __goscriptShadow40 = __goscriptTuple46[1]
				if (__goscriptShadow40 != null) {
					return [(null as __goscript_ipsock.addrList), __goscriptShadow40]
				}
				if ((($.stringEqual(op, "dial")) && (hint != null)) && (!$.stringEqual(__goscript_unixsock.UnixAddr.prototype.Network.call(__goscriptShadow39), await $.pointerValue<Exclude<__goscript_net.Addr, null>>(hint).Network()))) {
					return [(null as __goscript_ipsock.addrList), $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField13 = await $.pointerValue<Exclude<__goscript_net.Addr, null>>(hint).String(); return new __goscript_net.AddrError({Err: "mismatched local address type", Addr: __goscriptLiteralField13}) })()), "*net.AddrError")]
				}
				return [($.arrayToSlice<__goscript_net.Addr | null>([$.interfaceValue<__goscript_net.Addr | null>(__goscriptShadow39, "*net.UnixAddr")]) as __goscript_ipsock.addrList), null]
				break
			}
		}
		let __goscriptTuple47: any = await Resolver.prototype.internetAddrList.call(r, ctx, afnet, addr)
		let addrs: __goscript_ipsock.addrList = (__goscriptTuple47[0] as __goscript_ipsock.addrList)
		err = __goscriptTuple47[1]
		if (((err != null) || (!$.stringEqual(op, "dial"))) || (hint == null)) {
			return [(addrs as __goscript_ipsock.addrList), err]
		}
		let tcp: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = null as __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null
		let udp: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = null as __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null
		let ip: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null = null as __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null
		let wildcard: boolean = false
		{
			const __goscriptTypeSwitchValue = hint
			switch (true) {
				case $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).ok:
					{
						let hint: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).value
						tcp = hint
						wildcard = __goscript_tcpsock.TCPAddr.prototype.isWildcard.call(tcp)
					}
					break
				case $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).ok:
					{
						let hint: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).value
						udp = hint
						wildcard = __goscript_udpsock.UDPAddr.prototype.isWildcard.call(udp)
					}
					break
				case $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).ok:
					{
						let hint: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null = $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).value
						ip = hint
						wildcard = __goscript_iprawsock.IPAddr.prototype.isWildcard.call(ip)
					}
					break
			}
		}
		let naddrs: __goscript_ipsock.addrList = ($.goSlice(addrs, undefined, 0) as __goscript_ipsock.addrList)
		for (let __goscriptRangeTarget14 = addrs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget14); __rangeIndex++) {
			let addr = __goscriptRangeTarget14![__rangeIndex]
			if (!$.stringEqual(await $.pointerValue<Exclude<__goscript_net.Addr, null>>(addr).Network(), await $.pointerValue<Exclude<__goscript_net.Addr, null>>(hint).Network())) {
				return [(null as __goscript_ipsock.addrList), $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField14 = await $.pointerValue<Exclude<__goscript_net.Addr, null>>(hint).String(); return new __goscript_net.AddrError({Err: "mismatched local address type", Addr: __goscriptLiteralField14}) })()), "*net.AddrError")]
			}
			{
				const __goscriptTypeSwitchValue = addr
				switch (true) {
					case $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).ok:
						{
							let addr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).value
							if ((!wildcard && !__goscript_tcpsock.TCPAddr.prototype.isWildcard.call(addr)) && !__goscript_ip.IP_matchAddrFamily($.pointerValue<__goscript_tcpsock.TCPAddr>(addr).IP, ($.pointerValue<__goscript_tcpsock.TCPAddr>(tcp).IP as __goscript_ip.IP))) {
								continue
							}
							naddrs = ($.append((naddrs as __goscript_ipsock.addrList), $.interfaceValue<__goscript_net.Addr | null>(addr, "*net.TCPAddr")) as __goscript_ipsock.addrList)
						}
						break
					case $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).ok:
						{
							let addr: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).value
							if ((!wildcard && !__goscript_udpsock.UDPAddr.prototype.isWildcard.call(addr)) && !__goscript_ip.IP_matchAddrFamily($.pointerValue<__goscript_udpsock.UDPAddr>(addr).IP, ($.pointerValue<__goscript_udpsock.UDPAddr>(udp).IP as __goscript_ip.IP))) {
								continue
							}
							naddrs = ($.append((naddrs as __goscript_ipsock.addrList), $.interfaceValue<__goscript_net.Addr | null>(addr, "*net.UDPAddr")) as __goscript_ipsock.addrList)
						}
						break
					case $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).ok:
						{
							let addr: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null = $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).value
							if ((!wildcard && !__goscript_iprawsock.IPAddr.prototype.isWildcard.call(addr)) && !__goscript_ip.IP_matchAddrFamily($.pointerValue<__goscript_iprawsock.IPAddr>(addr).IP, ($.pointerValue<__goscript_iprawsock.IPAddr>(ip).IP as __goscript_ip.IP))) {
								continue
							}
							naddrs = ($.append((naddrs as __goscript_ipsock.addrList), $.interfaceValue<__goscript_net.Addr | null>(addr, "*net.IPAddr")) as __goscript_ipsock.addrList)
						}
						break
				}
			}
		}
		if ($.len((naddrs as __goscript_ipsock.addrList)) == 0) {
			return [(null as __goscript_ipsock.addrList), $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField15 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_net.errNoSuitableAddress).Error(); const __goscriptLiteralField16 = await $.pointerValue<Exclude<__goscript_net.Addr, null>>(hint).String(); return new __goscript_net.AddrError({Err: __goscriptLiteralField15, Addr: __goscriptLiteralField16}) })()), "*net.AddrError")]
		}
		return [(naddrs as __goscript_ipsock.addrList), null]
	}

	public strictErrors(): boolean {
		const r: Resolver | $.VarRef<Resolver> | null = this
		return (r != null) && $.pointerValue<Resolver>(r).StrictErrors
	}

	public async tryOneName(ctx: context.Context | null, cfg: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null, name: string, qtype: dnsmessage.Type): globalThis.Promise<[dnsmessage.Parser, string, $.GoError]> {
		const r: Resolver | $.VarRef<Resolver> | null = this
		let lastErr: $.GoError = null as $.GoError
		let serverOffset = $.uint(__goscript_dnsconfig.dnsConfig.prototype.serverOffset.call(cfg), 32)
		let sLen = $.uint($.uint($.len($.pointerValue<__goscript_dnsconfig.dnsConfig>(cfg).servers), 32), 32)

		let [n, err] = dnsmessage.NewName(name)
		if (err != null) {
			return [$.markAsStructValue(new dnsmessage.Parser()), "", $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField17 = $.pointerValue<Exclude<$.GoError, null>>(__goscript_dnsclient_unix.errCannotMarshalDNSMessage).Error(); return new __goscript_net.DNSError({Err: __goscriptLiteralField17, Name: name}) })(), "*net.DNSError")]
		}
		let q = $.markAsStructValue(new dnsmessage.Question({Name: $.markAsStructValue($.cloneStructValue(n)), Type: $.uint(qtype, 16), Class: $.uint(dnsmessage.ClassINET, 16)}))

		for (let i = 0; i < $.pointerValue<__goscript_dnsconfig.dnsConfig>(cfg).attempts; i++) {
			for (let j = $.uint($.uint(0, 32), 32); $.uint(j, 32) < $.uint(sLen, 32); j++) {
				let server = $.arrayIndex($.pointerValue<__goscript_dnsconfig.dnsConfig>(cfg).servers!, (serverOffset + j) % sLen)

				let __goscriptTuple48: any = await Resolver.prototype.exchange.call(r, ctx, server, $.markAsStructValue($.cloneStructValue(q)), $.pointerValue<__goscript_dnsconfig.dnsConfig>(cfg).timeout, $.pointerValue<__goscript_dnsconfig.dnsConfig>(cfg).useTCP, $.pointerValue<__goscript_dnsconfig.dnsConfig>(cfg).trustAD)
				let p = $.varRef(__goscriptTuple48[0])
				let h = __goscriptTuple48[1]
				let __goscriptShadow41 = __goscriptTuple48[2]
				if (__goscriptShadow41 != null) {
					let dnsErr: __goscript_net.DNSError | $.VarRef<__goscript_net.DNSError> | null = await __goscript_net.newDNSError(__goscriptShadow41, name, server)

					{
						let [, ok] = $.typeAssertTuple<__goscript_net.OpError | $.VarRef<__goscript_net.OpError> | null>(__goscriptShadow41, { kind: $.TypeKind.Pointer, elemType: "net.OpError" })
						if (ok) {
							$.pointerValue<__goscript_net.DNSError>(dnsErr).IsTemporary = true
						}
					}
					lastErr = $.interfaceValue<$.GoError>(dnsErr, "*net.DNSError")
					continue
				}

				{
					let __goscriptShadow42 = __goscript_dnsclient_unix.checkHeader(p, $.markAsStructValue($.cloneStructValue(h)))
					if (__goscriptShadow42 != null) {
						if ($.comparableEqual(__goscriptShadow42, __goscript_net.errNoSuchHost)) {

							return [$.markAsStructValue($.cloneStructValue(p.value)), server, $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), name, server), "*net.DNSError")]
						}
						lastErr = $.interfaceValue<$.GoError>(await __goscript_net.newDNSError(__goscriptShadow42, name, server), "*net.DNSError")
						continue
					}
				}

				{
					let __goscriptShadow43 = __goscript_dnsclient_unix.skipToAnswer(p, $.uint(qtype, 16))
					if (__goscriptShadow43 != null) {
						if ($.comparableEqual(__goscriptShadow43, __goscript_net.errNoSuchHost)) {

							return [$.markAsStructValue($.cloneStructValue(p.value)), server, $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError"), name, server), "*net.DNSError")]
						}
						lastErr = $.interfaceValue<$.GoError>(await __goscript_net.newDNSError(__goscriptShadow43, name, server), "*net.DNSError")
						continue
					}
				}

				return [$.markAsStructValue($.cloneStructValue(p.value)), server, null]
			}
		}
		return [$.markAsStructValue(new dnsmessage.Parser()), "", lastErr]
	}

	static __typeInfo = $.registerStructType(
		"net.Resolver",
		() => new Resolver(),
		[{ name: "LookupAddr", args: [{ name: "ctx", type: "context.Context" }, { name: "addr", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "_r1", type: "error" }] }, { name: "LookupCNAME", args: [{ name: "ctx", type: "context.Context" }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: "error" }] }, { name: "LookupHost", args: [{ name: "ctx", type: "context.Context" }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "addrs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "err", type: "error" }] }, { name: "LookupIP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "net.IP" } }, { name: "_r1", type: "error" }] }, { name: "LookupIPAddr", args: [{ name: "ctx", type: "context.Context" }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "net.IPAddr" } }, { name: "_r1", type: "error" }] }, { name: "LookupMX", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.MX" } } }, { name: "_r1", type: "error" }] }, { name: "LookupNS", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.NS" } } }, { name: "_r1", type: "error" }] }, { name: "LookupNetIP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "netip.Addr" } }, { name: "_r1", type: "error" }] }, { name: "LookupPort", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "port", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "LookupSRV", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "proto", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.SRV" } } }, { name: "_r2", type: "error" }] }, { name: "LookupTXT", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "_r1", type: "error" }] }, { name: "dial", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "server", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "exchange", args: [{ name: "ctx", type: "context.Context" }, { name: "server", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "q", type: "dnsmessage.Question" }, { name: "timeout", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" } }, { name: "useTCP", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "ad", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "dnsmessage.Parser" }, { name: "_r1", type: "dnsmessage.Header" }, { name: "_r2", type: "error" }] }, { name: "getLookupGroup", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "singleflight.Group" } }] }, { name: "goLookupCNAME", args: [{ name: "ctx", type: "context.Context" }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "order", type: { kind: $.TypeKind.Basic, name: "int", typeName: "net.hostLookupOrder" } }, { name: "conf", type: { kind: $.TypeKind.Pointer, elemType: "net.dnsConfig" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: "error" }] }, { name: "goLookupHostOrder", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "order", type: { kind: $.TypeKind.Basic, name: "int", typeName: "net.hostLookupOrder" } }, { name: "conf", type: { kind: $.TypeKind.Pointer, elemType: "net.dnsConfig" } }], returns: [{ name: "addrs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "err", type: "error" }] }, { name: "goLookupIP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "order", type: { kind: $.TypeKind.Basic, name: "int", typeName: "net.hostLookupOrder" } }, { name: "conf", type: { kind: $.TypeKind.Pointer, elemType: "net.dnsConfig" } }], returns: [{ name: "addrs", type: { kind: $.TypeKind.Slice, elemType: "net.IPAddr" } }, { name: "err", type: "error" }] }, { name: "goLookupIPCNAMEOrder", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "order", type: { kind: $.TypeKind.Basic, name: "int", typeName: "net.hostLookupOrder" } }, { name: "conf", type: { kind: $.TypeKind.Pointer, elemType: "net.dnsConfig" } }], returns: [{ name: "addrs", type: { kind: $.TypeKind.Slice, elemType: "net.IPAddr" } }, { name: "cname", type: "dnsmessage.Name" }, { name: "err", type: "error" }] }, { name: "goLookupMX", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.MX" } } }, { name: "_r1", type: "error" }] }, { name: "goLookupNS", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.NS" } } }, { name: "_r1", type: "error" }] }, { name: "goLookupPTR", args: [{ name: "ctx", type: "context.Context" }, { name: "addr", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "order", type: { kind: $.TypeKind.Basic, name: "int", typeName: "net.hostLookupOrder" } }, { name: "conf", type: { kind: $.TypeKind.Pointer, elemType: "net.dnsConfig" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "_r1", type: "error" }] }, { name: "goLookupSRV", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "proto", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "target", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "srvs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.SRV" } } }, { name: "err", type: "error" }] }, { name: "goLookupTXT", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "_r1", type: "error" }] }, { name: "internetAddrList", args: [{ name: "ctx", type: "context.Context" }, { name: "net", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "addr", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.addrList" }, { name: "_r1", type: "error" }] }, { name: "lookup", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "qtype", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "dnsmessage.Type" } }, { name: "conf", type: { kind: $.TypeKind.Pointer, elemType: "net.dnsConfig" } }], returns: [{ name: "_r0", type: "dnsmessage.Parser" }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r2", type: "error" }] }, { name: "lookupAddr", args: [{ name: "ctx", type: "context.Context" }, { name: "addr", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "_r1", type: "error" }] }, { name: "lookupCNAME", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: "error" }] }, { name: "lookupHost", args: [{ name: "ctx", type: "context.Context" }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "addrs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "err", type: "error" }] }, { name: "lookupIP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "addrs", type: { kind: $.TypeKind.Slice, elemType: "net.IPAddr" } }, { name: "err", type: "error" }] }, { name: "lookupIPAddr", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "net.IPAddr" } }, { name: "_r1", type: "error" }] }, { name: "lookupMX", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.MX" } } }, { name: "_r1", type: "error" }] }, { name: "lookupNS", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.NS" } } }, { name: "_r1", type: "error" }] }, { name: "lookupPort", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "lookupSRV", args: [{ name: "ctx", type: "context.Context" }, { name: "service", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "proto", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.SRV" } } }, { name: "_r2", type: "error" }] }, { name: "lookupTXT", args: [{ name: "ctx", type: "context.Context" }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "_r1", type: "error" }] }, { name: "preferGo", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "resolveAddrList", args: [{ name: "ctx", type: "context.Context" }, { name: "op", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "addr", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "hint", type: "net.Addr" }], returns: [{ name: "_r0", type: "net.addrList" }, { name: "_r1", type: "error" }] }, { name: "strictErrors", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "tryOneName", args: [{ name: "ctx", type: "context.Context" }, { name: "cfg", type: { kind: $.TypeKind.Pointer, elemType: "net.dnsConfig" } }, { name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "qtype", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "dnsmessage.Type" } }], returns: [{ name: "_r0", type: "dnsmessage.Parser" }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r2", type: "error" }] }],
		Resolver,
		[{ name: "PreferGo", key: "PreferGo", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [0], offset: 0, exported: true }, { name: "StrictErrors", key: "StrictErrors", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [1], offset: 1, exported: true }, { name: "Dial", key: "Dial", type: ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }], results: ["net.Conn", "error"] } as $.FunctionTypeInfo), index: [2], offset: 8, exported: true }, { name: "lookupGroup", key: "lookupGroup", type: "singleflight.Group", pkgPath: "net", index: [3], offset: 16, exported: false }]
	)
}

export class onlyValuesCtx {
	public get Context(): context.Context | null {
		return this._fields.Context.value
	}
	public set Context(value: context.Context | null) {
		this._fields.Context.value = value
	}

	public get lookupValues(): context.Context | null {
		return this._fields.lookupValues.value
	}
	public set lookupValues(value: context.Context | null) {
		this._fields.lookupValues.value = value
	}

	public _fields: {
		Context: $.VarRef<context.Context | null>
		lookupValues: $.VarRef<context.Context | null>
	}

	constructor(init?: Partial<{Context?: context.Context | null, lookupValues?: context.Context | null}>) {
		this._fields = {
			Context: $.varRef(init?.Context ?? (null as context.Context | null)),
			lookupValues: $.varRef(init?.lookupValues ?? (null as context.Context | null))
		}
	}

	public clone(): onlyValuesCtx {
		const cloned = new onlyValuesCtx()
		cloned._fields = {
			Context: $.varRef(this._fields.Context.value),
			lookupValues: $.varRef(this._fields.lookupValues.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Value(key: any): globalThis.Promise<any> {
		const ovc: onlyValuesCtx | $.VarRef<onlyValuesCtx> | null = this
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, any>([
			{
				id: 0,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<onlyValuesCtx>(ovc).lookupValues).Done(),
				onSelected: async (__goscriptSelect1Result) => {
					return null
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect1Result) => {
					return $.pointerValue<Exclude<context.Context, null>>($.pointerValue<onlyValuesCtx>(ovc).lookupValues).Value(key)
				}
			}
		], true)
		if (__goscriptSelect1HasReturn) {
			return __goscriptSelect1Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public Deadline(): any {
		return $.pointerValue<Exclude<context.Context | null, null>>(this.Context).Deadline()
	}

	public Done(): any {
		return $.pointerValue<Exclude<context.Context | null, null>>(this.Context).Done()
	}

	public async Err(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<context.Context | null, null>>(this.Context).Err()
	}

	static __typeInfo = $.registerStructType(
		"net.onlyValuesCtx",
		() => new onlyValuesCtx(),
		[{ name: "Value", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Deadline", args: [], returns: [{ name: "deadline", type: "time.Time" }, { name: "ok", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Done", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } } }] }, { name: "Err", args: [], returns: [{ name: "_r0", type: "error" }] }],
		onlyValuesCtx,
		[{ name: "Context", key: "Context", type: "context.Context", anonymous: true, index: [0], offset: 0, exported: true }, { name: "lookupValues", key: "lookupValues", type: "context.Context", pkgPath: "net", index: [1], offset: 16, exported: false }]
	)
}

export const maxProtoLength: number = 25

export const maxPortBufSize: number = 25

export var protocols: globalThis.Map<string, number> | null

export function __goscript_init_protocols(): void {
	if (((protocols) as any) === undefined) {
		protocols = new globalThis.Map<string, number>([["icmp", 1], ["igmp", 2], ["tcp", 6], ["udp", 17], ["ipv6-icmp", 58]])
	}
}

export function __goscript_get_protocols(): globalThis.Map<string, number> | null {
	if (((protocols) as any) === undefined) {
		__goscript_init_protocols()
	}
	return protocols
}

export function __goscript_set_protocols(__goscriptValue: globalThis.Map<string, number> | null): void {
	protocols = __goscriptValue
}

export let services: globalThis.Map<string, globalThis.Map<string, number> | null> | null = new globalThis.Map<string, globalThis.Map<string, number> | null>([["udp", new globalThis.Map<string, number>([["domain", 53]])], ["tcp", new globalThis.Map<string, number>([["ftp", 21], ["ftps", 990], ["gopher", 70], ["http", 80], ["https", 443], ["imap2", 143], ["imap3", 220], ["imaps", 993], ["pop3", 110], ["pop3s", 995], ["smtp", 25], ["submissions", 465], ["ssh", 22], ["telnet", 23]])]])

export function __goscript_set_services(__goscriptValue: globalThis.Map<string, globalThis.Map<string, number> | null> | null): void {
	services = __goscriptValue
}

export let dnsWaitGroup: $.VarRef<sync.WaitGroup> = $.varRef($.markAsStructValue(new sync.WaitGroup()))

export function __goscript_set_dnsWaitGroup(__goscriptValue: sync.WaitGroup): void {
	dnsWaitGroup.value = __goscriptValue
}

export function lookupProtocolMap(name: string): [number, $.GoError] {
	let lowerProtocol: Uint8Array = new Uint8Array(25)
	let n = $.copy($.goSlice(lowerProtocol, undefined, undefined), name)
	__goscript_parse.lowerASCIIBytes($.goSlice(lowerProtocol, undefined, n))
	let [proto, found] = $.mapGet<string, number, number>(__goscript_get_protocols(), $.bytesToString($.goSlice(lowerProtocol, undefined, n)), 0)
	if (!found || (n != $.len(name))) {
		return [0, $.interfaceValue<$.GoError>(new __goscript_net.AddrError({Err: "unknown IP protocol specified", Addr: name}), "*net.AddrError")]
	}
	return [proto, null]
}

export async function lookupPortMap(network: string, service: string): globalThis.Promise<[number, $.GoError]> {
	let port: number = 0
	let error: $.GoError = null as $.GoError
	switch (network) {
		case "ip":
		{
			{
				let [p, err] = await lookupPortMapWithNetwork("tcp", "ip", service)
				if (err == null) {
					return [p, null]
				}
			}
			return lookupPortMapWithNetwork("udp", "ip", service)
			break
		}
		case "tcp":
		case "tcp4":
		case "tcp6":
		{
			return lookupPortMapWithNetwork("tcp", "tcp", service)
			break
		}
		case "udp":
		case "udp4":
		case "udp6":
		{
			return lookupPortMapWithNetwork("udp", "udp", service)
			break
		}
	}
	return [0, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "unknown network", Name: (network + "/") + service}), "*net.DNSError")]
}

export async function lookupPortMapWithNetwork(network: string, errNetwork: string, service: string): globalThis.Promise<[number, $.GoError]> {
	let port: number = 0
	let error: $.GoError = null as $.GoError
	{
		let __goscriptTuple0: any = $.mapGet<string, globalThis.Map<string, number> | null, globalThis.Map<string, number> | null>(services, network, null)
		let m: globalThis.Map<string, number> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			let lowerService: Uint8Array = new Uint8Array(25)
			let n = $.copy($.goSlice(lowerService, undefined, undefined), service)
			__goscript_parse.lowerASCIIBytes($.goSlice(lowerService, undefined, n))
			{
				let [__goscriptShadow0, __goscriptShadow1] = $.mapGet<string, number, number>(m, $.bytesToString($.goSlice(lowerService, undefined, n)), 0)
				if (__goscriptShadow1 && (n == $.len(service))) {
					return [__goscriptShadow0, null]
				}
			}
			return [0, $.interfaceValue<$.GoError>(await __goscript_net.newDNSError($.interfaceValue<$.GoError>(__goscript_net.errUnknownPort, "*net.notFoundError"), (errNetwork + "/") + service, ""), "*net.DNSError")]
		}
	}
	return [0, $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "unknown network", Name: (errNetwork + "/") + service}), "*net.DNSError")]
}

export function ipVersion(network: string): number {
	if ($.stringEqual(network, "")) {
		return $.uint(0, 8)
	}
	let n = $.uint($.indexStringOrBytes(network, $.len(network) - 1), 8)
	if (($.uint(n, 8) != $.uint(52, 8)) && ($.uint(n, 8) != $.uint(54, 8))) {
		n = $.uint(0, 8)
	}
	return $.uint(n, 8)
}

export let DefaultResolver: Resolver | $.VarRef<Resolver> | null = new Resolver()

export function __goscript_set_DefaultResolver(__goscriptValue: Resolver | $.VarRef<Resolver> | null): void {
	DefaultResolver = __goscriptValue
}

export async function LookupHost(host: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
	let addrs: $.Slice<string> = null as $.Slice<string>
	let err: $.GoError = null as $.GoError
	return Resolver.prototype.LookupHost.call(DefaultResolver, context.Background(), host)
}

export async function LookupIP(host: string): globalThis.Promise<[$.Slice<__goscript_ip.IP>, $.GoError]> {
	let __goscriptTuple49: any = await Resolver.prototype.LookupIPAddr.call(DefaultResolver, context.Background(), host)
	let addrs: $.Slice<__goscript_iprawsock.IPAddr> = __goscriptTuple49[0]
	let err = __goscriptTuple49[1]
	if (err != null) {
		return [null, err]
	}
	let ips: $.Slice<__goscript_ip.IP> = $.makeSlice<__goscript_ip.IP>($.len(addrs))
	for (let __goscriptRangeTarget15 = addrs, i = 0; i < $.len(__goscriptRangeTarget15); i++) {
		let ia = __goscriptRangeTarget15![i]
		ips![i] = (ia.IP as __goscript_ip.IP)
	}
	return [ips, null]
}

export function withUnexpiredValuesPreserved(lookupCtx: context.Context | null): context.Context | null {
	return $.interfaceValue<context.Context | null>((() => { const __goscriptLiteralField18 = context.Background(); return new onlyValuesCtx({Context: __goscriptLiteralField18, lookupValues: lookupCtx}) })(), "*net.onlyValuesCtx")
}

export function lookupIPReturn(addrsi: any, err: $.GoError, shared: boolean): [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] {
	if (err != null) {
		return [null, err]
	}
	let addrs: $.Slice<__goscript_iprawsock.IPAddr> = $.mustTypeAssert<$.Slice<__goscript_iprawsock.IPAddr>>(addrsi, { kind: $.TypeKind.Slice, elemType: "net.IPAddr" })
	if (shared) {
		let clone: $.Slice<__goscript_iprawsock.IPAddr> = $.makeSlice<__goscript_iprawsock.IPAddr>($.len(addrs), undefined, undefined, () => $.markAsStructValue(new __goscript_iprawsock.IPAddr()))
		$.copy(clone, addrs)
		addrs = clone
	}
	return [addrs, null]
}

export function ipAddrsEface(addrs: $.Slice<__goscript_iprawsock.IPAddr>): $.Slice<any> {
	let s: $.Slice<any> = $.makeSlice<any>($.len(addrs))
	for (let __goscriptRangeTarget16 = addrs, i = 0; i < $.len(__goscriptRangeTarget16); i++) {
		let v = __goscriptRangeTarget16![i]
		s![i] = $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(v)), "net.IPAddr")
	}
	return s
}

export async function LookupPort(network: string, service: string): globalThis.Promise<[number, $.GoError]> {
	let port: number = 0
	let err: $.GoError = null as $.GoError
	return Resolver.prototype.LookupPort.call(DefaultResolver, context.Background(), network, service)
}

export async function LookupCNAME(host: string): globalThis.Promise<[string, $.GoError]> {
	let cname: string = ""
	let err: $.GoError = null as $.GoError
	return Resolver.prototype.LookupCNAME.call(DefaultResolver, context.Background(), host)
}

export async function LookupSRV(service: string, proto: string, name: string): globalThis.Promise<[string, $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null>, $.GoError]> {
	let cname: string = ""
	let addrs: $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null> = null as $.Slice<__goscript_dnsclient.SRV | $.VarRef<__goscript_dnsclient.SRV> | null>
	let err: $.GoError = null as $.GoError
	return Resolver.prototype.LookupSRV.call(DefaultResolver, context.Background(), service, proto, name)
}

export async function LookupMX(name: string): globalThis.Promise<[$.Slice<__goscript_dnsclient.MX | $.VarRef<__goscript_dnsclient.MX> | null>, $.GoError]> {
	return Resolver.prototype.LookupMX.call(DefaultResolver, context.Background(), name)
}

export async function LookupNS(name: string): globalThis.Promise<[$.Slice<__goscript_dnsclient.NS | $.VarRef<__goscript_dnsclient.NS> | null>, $.GoError]> {
	return Resolver.prototype.LookupNS.call(DefaultResolver, context.Background(), name)
}

export async function LookupTXT(name: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
	return Resolver.prototype.lookupTXT.call(DefaultResolver, context.Background(), name)
}

export async function LookupAddr(addr: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
	let names: $.Slice<string> = null as $.Slice<string>
	let err: $.GoError = null as $.GoError
	return Resolver.prototype.LookupAddr.call(DefaultResolver, context.Background(), addr)
}

export let errMalformedDNSRecordsDetail: string = "DNS response contained records which contain invalid names"

export function __goscript_set_errMalformedDNSRecordsDetail(__goscriptValue: string): void {
	errMalformedDNSRecordsDetail = __goscriptValue
}

export function parseCNAMEFromResources(resources: $.Slice<dnsmessage.Resource>): [string, $.GoError] {
	if ($.len(resources) == 0) {
		return ["", errors.New("no CNAME record received")]
	}
	let __goscriptTuple50: any = $.typeAssertTuple<dnsmessage.CNAMEResource | $.VarRef<dnsmessage.CNAMEResource> | null>($.arrayIndex(resources!, 0).Body, { kind: $.TypeKind.Pointer, elemType: "dnsmessage.CNAMEResource" })
	let c: dnsmessage.CNAMEResource | $.VarRef<dnsmessage.CNAMEResource> | null = __goscriptTuple50[0]
	let ok = __goscriptTuple50[1]
	if (!ok) {
		return ["", errors.New("could not parse CNAME record")]
	}
	return [$.markAsStructValue($.cloneStructValue($.pointerValue<dnsmessage.CNAMEResource>(c).CNAME)).String(), null]
}
