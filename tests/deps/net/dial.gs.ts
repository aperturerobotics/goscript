// Generated file based on dial.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as nettrace from "@goscript/internal/nettrace/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as errors from "@goscript/errors/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import type * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import * as __goscript__interface from "./interface.gs.ts"

import type * as __goscript_dnsclient from "./dnsclient.gs.ts"

import * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.ts"

import type * as __goscript_dnsconfig from "./dnsconfig.gs.ts"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_hook from "./hook.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_iprawsock from "./iprawsock.gs.ts"

import * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_ipsock_posix from "./ipsock_posix.gs.ts"

import * as __goscript_lookup from "./lookup.gs.ts"

import * as __goscript_lookup_unix from "./lookup_unix.gs.ts"

import * as __goscript_mac from "./mac.gs.ts"

import * as __goscript_mptcpsock_stub from "./mptcpsock_stub.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"

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
import "@goscript/io/index.js"
import "@goscript/os/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/internal/singleflight/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "./interface.gs.ts"
import "./dnsclient_unix.gs.ts"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./hook.gs.ts"
import "./ip.gs.ts"
import "./iprawsock.gs.ts"
import "./iprawsock_posix.gs.ts"
import "./ipsock.gs.ts"
import "./ipsock_posix.gs.ts"
import "./lookup.gs.ts"
import "./lookup_unix.gs.ts"
import "./mac.gs.ts"
import "./mptcpsock_stub.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./parse.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./tcpsock.gs.ts"
import "./tcpsock_posix.gs.ts"
import "./udpsock.gs.ts"
import "./udpsock_posix.gs.ts"
import "./unixsock.gs.ts"
import "./unixsock_posix.gs.ts"

export class Dialer {
	// Timeout is the maximum amount of time a dial will wait for
	// a connect to complete. If Deadline is also set, it may fail
	// earlier.
	//
	// The default is no timeout.
	//
	// When using TCP and dialing a host name with multiple IP
	// addresses, the timeout may be divided between them.
	//
	// With or without a timeout, the operating system may impose
	// its own earlier timeout. For instance, TCP timeouts are
	// often around 3 minutes.
	public get Timeout(): time.Duration {
		return this._fields.Timeout.value
	}
	public set Timeout(value: time.Duration) {
		this._fields.Timeout.value = value
	}

	// Deadline is the absolute point in time after which dials
	// will fail. If Timeout is set, it may fail earlier.
	// Zero means no deadline, or dependent on the operating system
	// as with the Timeout option.
	public get Deadline(): time.Time {
		return this._fields.Deadline.value
	}
	public set Deadline(value: time.Time) {
		this._fields.Deadline.value = value
	}

	// LocalAddr is the local address to use when dialing an
	// address. The address must be of a compatible type for the
	// network being dialed.
	// If nil, a local address is automatically chosen.
	public get LocalAddr(): __goscript_net.Addr | null {
		return this._fields.LocalAddr.value
	}
	public set LocalAddr(value: __goscript_net.Addr | null) {
		this._fields.LocalAddr.value = value
	}

	// DualStack previously enabled RFC 6555 Fast Fallback
	// support, also known as "Happy Eyeballs", in which IPv4 is
	// tried soon if IPv6 appears to be misconfigured and
	// hanging.
	//
	// Deprecated: Fast Fallback is enabled by default. To
	// disable, set FallbackDelay to a negative value.
	public get DualStack(): boolean {
		return this._fields.DualStack.value
	}
	public set DualStack(value: boolean) {
		this._fields.DualStack.value = value
	}

	// FallbackDelay specifies the length of time to wait before
	// spawning a RFC 6555 Fast Fallback connection. That is, this
	// is the amount of time to wait for IPv6 to succeed before
	// assuming that IPv6 is misconfigured and falling back to
	// IPv4.
	//
	// If zero, a default delay of 300ms is used.
	// A negative value disables Fast Fallback support.
	public get FallbackDelay(): time.Duration {
		return this._fields.FallbackDelay.value
	}
	public set FallbackDelay(value: time.Duration) {
		this._fields.FallbackDelay.value = value
	}

	// KeepAlive specifies the interval between keep-alive
	// probes for an active network connection.
	//
	// KeepAlive is ignored if KeepAliveConfig.Enable is true.
	//
	// If zero, keep-alive probes are sent with a default value
	// (currently 15 seconds), if supported by the protocol and operating
	// system. Network protocols or operating systems that do
	// not support keep-alive ignore this field.
	// If negative, keep-alive probes are disabled.
	public get KeepAlive(): time.Duration {
		return this._fields.KeepAlive.value
	}
	public set KeepAlive(value: time.Duration) {
		this._fields.KeepAlive.value = value
	}

	// KeepAliveConfig specifies the keep-alive probe configuration
	// for an active network connection, when supported by the
	// protocol and operating system.
	//
	// If KeepAliveConfig.Enable is true, keep-alive probes are enabled.
	// If KeepAliveConfig.Enable is false and KeepAlive is negative,
	// keep-alive probes are disabled.
	public get KeepAliveConfig(): __goscript_tcpsock.KeepAliveConfig {
		return this._fields.KeepAliveConfig.value
	}
	public set KeepAliveConfig(value: __goscript_tcpsock.KeepAliveConfig) {
		this._fields.KeepAliveConfig.value = value
	}

	// Resolver optionally specifies an alternate resolver to use.
	public get Resolver(): __goscript_lookup.Resolver | $.VarRef<__goscript_lookup.Resolver> | null {
		return this._fields.Resolver.value
	}
	public set Resolver(value: __goscript_lookup.Resolver | $.VarRef<__goscript_lookup.Resolver> | null) {
		this._fields.Resolver.value = value
	}

	// Cancel is an optional channel whose closure indicates that
	// the dial should be canceled. Not all types of dials support
	// cancellation.
	//
	// Deprecated: Use DialContext instead.
	public get Cancel(): $.Channel<{}> | null {
		return this._fields.Cancel.value
	}
	public set Cancel(value: $.Channel<{}> | null) {
		this._fields.Cancel.value = value
	}

	// If Control is not nil, it is called after creating the network
	// connection but before actually dialing.
	//
	// Network and address parameters passed to Control function are not
	// necessarily the ones passed to Dial. Calling Dial with TCP networks
	// will cause the Control function to be called with "tcp4" or "tcp6",
	// UDP networks become "udp4" or "udp6", IP networks become "ip4" or "ip6",
	// and other known networks are passed as-is.
	//
	// Control is ignored if ControlContext is not nil.
	public get Control(): ((network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.Control.value
	}
	public set Control(value: ((network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.Control.value = value
	}

	// If ControlContext is not nil, it is called after creating the network
	// connection but before actually dialing.
	//
	// Network and address parameters passed to ControlContext function are not
	// necessarily the ones passed to Dial. Calling Dial with TCP networks
	// will cause the ControlContext function to be called with "tcp4" or "tcp6",
	// UDP networks become "udp4" or "udp6", IP networks become "ip4" or "ip6",
	// and other known networks are passed as-is.
	//
	// If ControlContext is not nil, Control is ignored.
	public get ControlContext(): ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.ControlContext.value
	}
	public set ControlContext(value: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.ControlContext.value = value
	}

	// If mptcpStatus is set to a value allowing Multipath TCP (MPTCP) to be
	// used, any call to Dial with "tcp(4|6)" as network will use MPTCP if
	// supported by the operating system.
	public get mptcpStatus(): mptcpStatusDial {
		return this._fields.mptcpStatus.value
	}
	public set mptcpStatus(value: mptcpStatusDial) {
		this._fields.mptcpStatus.value = value
	}

	public _fields: {
		Timeout: $.VarRef<time.Duration>
		Deadline: $.VarRef<time.Time>
		LocalAddr: $.VarRef<__goscript_net.Addr | null>
		DualStack: $.VarRef<boolean>
		FallbackDelay: $.VarRef<time.Duration>
		KeepAlive: $.VarRef<time.Duration>
		KeepAliveConfig: $.VarRef<__goscript_tcpsock.KeepAliveConfig>
		Resolver: $.VarRef<__goscript_lookup.Resolver | $.VarRef<__goscript_lookup.Resolver> | null>
		Cancel: $.VarRef<$.Channel<{}> | null>
		Control: $.VarRef<((network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null>
		ControlContext: $.VarRef<((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null>
		mptcpStatus: $.VarRef<mptcpStatusDial>
	}

	constructor(init?: Partial<{Timeout?: time.Duration, Deadline?: time.Time, LocalAddr?: __goscript_net.Addr | null, DualStack?: boolean, FallbackDelay?: time.Duration, KeepAlive?: time.Duration, KeepAliveConfig?: __goscript_tcpsock.KeepAliveConfig, Resolver?: __goscript_lookup.Resolver | $.VarRef<__goscript_lookup.Resolver> | null, Cancel?: $.Channel<{}> | null, Control?: ((network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null, ControlContext?: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null, mptcpStatus?: mptcpStatusDial}>) {
		this._fields = {
			Timeout: $.varRef(init?.Timeout ?? 0),
			Deadline: $.varRef(init?.Deadline ? $.markAsStructValue($.cloneStructValue(init.Deadline)) : $.markAsStructValue(new time.Time())),
			LocalAddr: $.varRef(init?.LocalAddr ?? null),
			DualStack: $.varRef(init?.DualStack ?? false),
			FallbackDelay: $.varRef(init?.FallbackDelay ?? 0),
			KeepAlive: $.varRef(init?.KeepAlive ?? 0),
			KeepAliveConfig: $.varRef(init?.KeepAliveConfig ? $.markAsStructValue($.cloneStructValue(init.KeepAliveConfig)) : $.markAsStructValue(new __goscript_tcpsock.KeepAliveConfig())),
			Resolver: $.varRef(init?.Resolver ?? null),
			Cancel: $.varRef(init?.Cancel ?? null),
			Control: $.varRef(init?.Control ?? null),
			ControlContext: $.varRef(init?.ControlContext ?? null),
			mptcpStatus: $.varRef(init?.mptcpStatus ?? 0)
		}
	}

	public clone(): Dialer {
		const cloned = new Dialer()
		cloned._fields = {
			Timeout: $.varRef(this._fields.Timeout.value),
			Deadline: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Deadline.value))),
			LocalAddr: $.varRef(this._fields.LocalAddr.value),
			DualStack: $.varRef(this._fields.DualStack.value),
			FallbackDelay: $.varRef(this._fields.FallbackDelay.value),
			KeepAlive: $.varRef(this._fields.KeepAlive.value),
			KeepAliveConfig: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.KeepAliveConfig.value))),
			Resolver: $.varRef(this._fields.Resolver.value),
			Cancel: $.varRef(this._fields.Cancel.value),
			Control: $.varRef(this._fields.Control.value),
			ControlContext: $.varRef(this._fields.ControlContext.value),
			mptcpStatus: $.varRef(this._fields.mptcpStatus.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Dial(network: string, address: string): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
		const d: Dialer | $.VarRef<Dialer> | null = this
		return await Dialer.prototype.DialContext.call(d, context.Background(), network, address)
	}

	public async DialContext(ctx: context.Context | null, network: string, address: string): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
		const d: Dialer | $.VarRef<Dialer> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let __goscriptTuple0: any = await Dialer.prototype.dialCtx.call(d, ctx)
		ctx = __goscriptTuple0[0]
		let cancel = __goscriptTuple0[1]
		__defer.defer(async () => { await cancel!() })

		// Shadow the nettrace (if any) during resolve so Connect events don't fire for DNS lookups.
		let resolveCtx: context.Context | null = ctx
		{
			let __goscriptTuple1: any = $.typeAssertTuple<nettrace.Trace | $.VarRef<nettrace.Trace> | null>(await $.pointerValue<Exclude<context.Context, null>>(ctx).Value($.interfaceValue<any>($.markAsStructValue(new nettrace.TraceKey()), "nettrace.TraceKey")), { kind: $.TypeKind.Pointer, elemType: "nettrace.Trace" })
			let trace: nettrace.Trace | $.VarRef<nettrace.Trace> | null = __goscriptTuple1[0]
			if (trace != null) {
				let shadow = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<nettrace.Trace>(trace))))
				shadow.value.ConnectStart = (null as ((network: string, addr: string) => void) | null)
				shadow.value.ConnectDone = (null as ((network: string, addr: string, err: $.GoError) => void) | null)
				resolveCtx = context.WithValue($.pointerValueOrNil(resolveCtx)!, $.interfaceValue<any>($.markAsStructValue(new nettrace.TraceKey()), "nettrace.TraceKey"), $.interfaceValue<any>(shadow, "*nettrace.Trace"))
			}
		}

		let __goscriptTuple2: any = await __goscript_lookup.Resolver.prototype.resolveAddrList.call(Dialer.prototype.resolver.call(d), resolveCtx, "dial", network, address, $.pointerValue<Dialer>(d).LocalAddr)
		let addrs: __goscript_ipsock.addrList = (__goscriptTuple2[0] as __goscript_ipsock.addrList)
		let err = __goscriptTuple2[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "dial", Net: network, Source: null, Addr: null, Err: err}), "*net.OpError")]
		}

		let sd: sysDialer | $.VarRef<sysDialer> | null = new sysDialer({Dialer: $.markAsStructValue($.cloneStructValue($.pointerValue<Dialer>(d))), network: network, address: address})

		let primaries: __goscript_ipsock.addrList = null as __goscript_ipsock.addrList
		let fallbacks: __goscript_ipsock.addrList = null as __goscript_ipsock.addrList
		if (Dialer.prototype.dualStack.call(d) && ($.stringEqual(network, "tcp"))) {
			let __goscriptTuple3: any = await __goscript_ipsock.addrList_partition(addrs, __goscript_ipsock.isIPv4)
			primaries = (__goscriptTuple3[0] as __goscript_ipsock.addrList)
			fallbacks = (__goscriptTuple3[1] as __goscript_ipsock.addrList)
		} else {
			primaries = (addrs as __goscript_ipsock.addrList)
		}

		return await sysDialer.prototype.dialParallel.call(sd, ctx, (primaries as __goscript_ipsock.addrList), (fallbacks as __goscript_ipsock.addrList))
	}

	public async DialIP(ctx: context.Context | null, network: string, laddr: netip.Addr, raddr: netip.Addr): globalThis.Promise<[__goscript_iprawsock.IPConn | $.VarRef<__goscript_iprawsock.IPConn> | null, $.GoError]> {
		const d: Dialer | $.VarRef<Dialer> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let __goscriptTuple4: any = await Dialer.prototype.dialCtx.call(d, ctx)
		ctx = __goscriptTuple4[0]
		let cancel = __goscriptTuple4[1]
		__defer.defer(async () => { await cancel!() })
		return await __goscript_iprawsock.dialIP(ctx, d, network, __goscript_iprawsock.ipAddrFromAddr($.markAsStructValue($.cloneStructValue(laddr))), __goscript_iprawsock.ipAddrFromAddr($.markAsStructValue($.cloneStructValue(raddr))))
	}

	public async DialTCP(ctx: context.Context | null, network: string, laddr: netip.AddrPort, raddr: netip.AddrPort): globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]> {
		const d: Dialer | $.VarRef<Dialer> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let __goscriptTuple5: any = await Dialer.prototype.dialCtx.call(d, ctx)
		ctx = __goscriptTuple5[0]
		let cancel = __goscriptTuple5[1]
		__defer.defer(async () => { await cancel!() })
		return await __goscript_tcpsock.dialTCP(ctx, d, network, __goscript_tcpsock.TCPAddrFromAddrPort($.markAsStructValue($.cloneStructValue(laddr))), __goscript_tcpsock.TCPAddrFromAddrPort($.markAsStructValue($.cloneStructValue(raddr))))
	}

	public async DialUDP(ctx: context.Context | null, network: string, laddr: netip.AddrPort, raddr: netip.AddrPort): globalThis.Promise<[__goscript_udpsock.UDPConn | $.VarRef<__goscript_udpsock.UDPConn> | null, $.GoError]> {
		const d: Dialer | $.VarRef<Dialer> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let __goscriptTuple6: any = await Dialer.prototype.dialCtx.call(d, ctx)
		ctx = __goscriptTuple6[0]
		let cancel = __goscriptTuple6[1]
		__defer.defer(async () => { await cancel!() })
		return await __goscript_udpsock.dialUDP(ctx, d, network, __goscript_udpsock.UDPAddrFromAddrPort($.markAsStructValue($.cloneStructValue(laddr))), __goscript_udpsock.UDPAddrFromAddrPort($.markAsStructValue($.cloneStructValue(raddr))))
	}

	public async DialUnix(ctx: context.Context | null, network: string, laddr: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null, raddr: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null): globalThis.Promise<[__goscript_unixsock.UnixConn | $.VarRef<__goscript_unixsock.UnixConn> | null, $.GoError]> {
		const d: Dialer | $.VarRef<Dialer> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let __goscriptTuple7: any = await Dialer.prototype.dialCtx.call(d, ctx)
		ctx = __goscriptTuple7[0]
		let cancel = __goscriptTuple7[1]
		__defer.defer(async () => { await cancel!() })
		return await __goscript_unixsock.dialUnix(ctx, d, network, laddr, raddr)
	}

	public MultipathTCP(): boolean {
		const d: Dialer | $.VarRef<Dialer> | null = this
		return mptcpStatusDial__get($.pointerValue<Dialer>(d)._fields.mptcpStatus)
	}

	public SetMultipathTCP(use: boolean): void {
		const d: Dialer | $.VarRef<Dialer> | null = this
		mptcpStatusDial__set($.pointerValue<Dialer>(d)._fields.mptcpStatus, use)
	}

	public deadline(ctx: context.Context | null, now: time.Time): time.Time {
		const d: Dialer | $.VarRef<Dialer> | null = this
		let earliest: time.Time = $.markAsStructValue(new time.Time())
		if ($.pointerValue<Dialer>(d).Timeout != 0) {
			earliest = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add($.pointerValue<Dialer>(d).Timeout)))
		}
		{
			let [__goscriptShadow0, ok] = $.pointerValue<Exclude<context.Context, null>>(ctx).Deadline()
			if (ok) {
				earliest = $.markAsStructValue($.cloneStructValue(minNonzeroTime($.markAsStructValue($.cloneStructValue(earliest)), $.markAsStructValue($.cloneStructValue(__goscriptShadow0)))))
			}
		}
		return $.markAsStructValue($.cloneStructValue(minNonzeroTime($.markAsStructValue($.cloneStructValue(earliest)), $.markAsStructValue($.cloneStructValue($.pointerValue<Dialer>(d).Deadline)))))
	}

	public async dialCtx(ctx: context.Context | null): globalThis.Promise<[context.Context | null, context.CancelFunc | null]> {
		const d: Dialer | $.VarRef<Dialer> | null = this
		if (ctx == null) {
			$.panic("nil context")
		}
		let deadline = $.markAsStructValue($.cloneStructValue(Dialer.prototype.deadline.call(d, ctx, $.markAsStructValue($.cloneStructValue(time.Now())))))
		let cancel1: context.CancelFunc | null = null as unknown as context.CancelFunc | null
		let cancel2: context.CancelFunc | null = null as unknown as context.CancelFunc | null
		if (!$.markAsStructValue($.cloneStructValue(deadline)).IsZero()) {
			await __goscript_hook.testHookStepTime!()
			{
				let [__goscriptShadow1, ok] = $.pointerValue<Exclude<context.Context, null>>(ctx).Deadline()
				if (!ok || $.markAsStructValue($.cloneStructValue(deadline)).Before($.markAsStructValue($.cloneStructValue(__goscriptShadow1)))) {
					let subCtx: context.Context | null = null as context.Context | null
					let __goscriptTuple8: any = context.WithDeadline($.pointerValueOrNil(ctx)!, $.markAsStructValue($.cloneStructValue(deadline)))
					subCtx = __goscriptTuple8[0]
					cancel1 = __goscriptTuple8[1]
					ctx = subCtx
				}
			}
		}
		{
			let oldCancel = $.pointerValue<Dialer>(d).Cancel
			if (oldCancel != null) {
				let [subCtx, __goscriptShadow2] = context.WithCancel($.pointerValueOrNil(ctx)!)
				queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
					const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
						{
							id: 0,
							isSend: false,
							channel: oldCancel,
							onSelected: async (__goscriptSelect0Result) => {
								await __goscriptShadow2!()
							}
						},
						{
							id: 1,
							isSend: false,
							channel: $.pointerValue<Exclude<context.Context, null>>(subCtx).Done(),
							onSelected: async (__goscriptSelect0Result) => {
							}
						}
					], false)
					if (__goscriptSelect0HasReturn) {
						return __goscriptSelect0Value
					}
				}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })
				ctx = subCtx
			}
		}
		return [ctx, $.functionValue(async (): globalThis.Promise<void> => {
			if (cancel1 != null) {
				await cancel1!()
			}
			if (cancel2 != null) {
				await cancel2!()
			}
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))]
	}

	public dualStack(): boolean {
		const d: Dialer | $.VarRef<Dialer> | null = this
		return $.pointerValue<Dialer>(d).FallbackDelay >= 0
	}

	public fallbackDelay(): time.Duration {
		const d: Dialer | $.VarRef<Dialer> | null = this
		if ($.pointerValue<Dialer>(d).FallbackDelay > 0) {
			return $.pointerValue<Dialer>(d).FallbackDelay
		} else {
			return $.int64Mul(300, time.Millisecond)
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public resolver(): __goscript_lookup.Resolver | $.VarRef<__goscript_lookup.Resolver> | null {
		const d: Dialer | $.VarRef<Dialer> | null = this
		if ($.pointerValue<Dialer>(d).Resolver != null) {
			return $.pointerValue<Dialer>(d).Resolver
		}
		return __goscript_lookup.DefaultResolver
	}

	static __typeInfo = $.registerStructType(
		"net.Dialer",
		() => new Dialer(),
		[{ name: "Dial", args: [{ name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "address", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "DialContext", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "address", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "DialIP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "laddr", type: "netip.Addr" }, { name: "raddr", type: "netip.Addr" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.IPConn" } }, { name: "_r1", type: "error" }] }, { name: "DialTCP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "laddr", type: "netip.AddrPort" }, { name: "raddr", type: "netip.AddrPort" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPConn" } }, { name: "_r1", type: "error" }] }, { name: "DialUDP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "laddr", type: "netip.AddrPort" }, { name: "raddr", type: "netip.AddrPort" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UDPConn" } }, { name: "_r1", type: "error" }] }, { name: "DialUnix", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }, { name: "raddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixConn" } }, { name: "_r1", type: "error" }] }, { name: "MultipathTCP", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "SetMultipathTCP", args: [{ name: "use", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }, { name: "deadline", args: [{ name: "ctx", type: "context.Context" }, { name: "now", type: "time.Time" }], returns: [{ name: "earliest", type: "time.Time" }] }, { name: "dialCtx", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "context.Context" }, { name: "_r1", type: ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo) }] }, { name: "dualStack", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "fallbackDelay", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" } }] }, { name: "resolver", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.Resolver" } }] }],
		Dialer,
		[{ name: "Timeout", key: "Timeout", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, index: [0], offset: 0, exported: true }, { name: "Deadline", key: "Deadline", type: "time.Time", index: [1], offset: 8, exported: true }, { name: "LocalAddr", key: "LocalAddr", type: "net.Addr", index: [2], offset: 32, exported: true }, { name: "DualStack", key: "DualStack", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [3], offset: 48, exported: true }, { name: "FallbackDelay", key: "FallbackDelay", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, index: [4], offset: 56, exported: true }, { name: "KeepAlive", key: "KeepAlive", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, index: [5], offset: 64, exported: true }, { name: "KeepAliveConfig", key: "KeepAliveConfig", type: "net.KeepAliveConfig", index: [6], offset: 72, exported: true }, { name: "Resolver", key: "Resolver", type: { kind: $.TypeKind.Pointer, elemType: "net.Resolver" }, index: [7], offset: 104, exported: true }, { name: "Cancel", key: "Cancel", type: { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, index: [8], offset: 112, exported: true }, { name: "Control", key: "Control", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo), index: [9], offset: 120, exported: true }, { name: "ControlContext", key: "ControlContext", type: ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo), index: [10], offset: 128, exported: true }, { name: "mptcpStatus", key: "mptcpStatus", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "net.mptcpStatusDial" }, pkgPath: "net", index: [11], offset: 136, exported: false }]
	)
}

export class sysDialer {
	public get Dialer(): Dialer {
		return this._fields.Dialer.value
	}
	public set Dialer(value: Dialer) {
		this._fields.Dialer.value = value
	}

	public get network(): string {
		return this._fields.network.value
	}
	public set network(value: string) {
		this._fields.network.value = value
	}

	public get address(): string {
		return this._fields.address.value
	}
	public set address(value: string) {
		this._fields.address.value = value
	}

	public get testHookDialTCP(): ((ctx: context.Context | null, net: string, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null) => [__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError] | globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]>) | null {
		return this._fields.testHookDialTCP.value
	}
	public set testHookDialTCP(value: ((ctx: context.Context | null, net: string, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null) => [__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError] | globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]>) | null) {
		this._fields.testHookDialTCP.value = value
	}

	public _fields: {
		Dialer: $.VarRef<Dialer>
		network: $.VarRef<string>
		address: $.VarRef<string>
		testHookDialTCP: $.VarRef<((ctx: context.Context | null, net: string, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null) => [__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError] | globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]>) | null>
	}

	constructor(init?: Partial<{Dialer?: Dialer, network?: string, address?: string, testHookDialTCP?: ((ctx: context.Context | null, net: string, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null) => [__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError] | globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]>) | null}>) {
		this._fields = {
			Dialer: $.varRef(init?.Dialer ? $.markAsStructValue($.cloneStructValue(init.Dialer)) : $.markAsStructValue(new Dialer())),
			network: $.varRef(init?.network ?? ""),
			address: $.varRef(init?.address ?? ""),
			testHookDialTCP: $.varRef(init?.testHookDialTCP ?? null)
		}
	}

	public clone(): sysDialer {
		const cloned = new sysDialer()
		cloned._fields = {
			Dialer: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Dialer.value))),
			network: $.varRef(this._fields.network.value),
			address: $.varRef(this._fields.address.value),
			testHookDialTCP: $.varRef(this._fields.testHookDialTCP.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async dialIP(ctx: context.Context | null, laddr: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null, raddr: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null): globalThis.Promise<[__goscript_iprawsock.IPConn | $.VarRef<__goscript_iprawsock.IPConn> | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		let __goscriptTuple10: any = await parseNetwork(ctx, $.pointerValue<sysDialer>(sd).network, true)
		let network = __goscriptTuple10[0]
		let proto = __goscriptTuple10[1]
		let err = __goscriptTuple10[2]
		if (err != null) {
			return [null, err]
		}
		switch (network) {
			case "ip":
			case "ip4":
			case "ip6":
			{
				break
			}
			default:
			{
				return [null, $.namedValueInterfaceValue<$.GoError>($.pointerValue<sysDialer>(sd).network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
				break
			}
		}
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = $.pointerValue<sysDialer>(sd).Dialer.ControlContext
		if ((ctrlCtxFn == null) && ($.pointerValue<sysDialer>(sd).Dialer.Control != null)) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysDialer>(sd).Dialer.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple11: any = await __goscript_ipsock_posix.internetSocket(ctx, network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.IPAddr"), $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(raddr, "*net.IPAddr"), syscall.SOCK_RAW, proto, "dial", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple11[0]
		err = __goscriptTuple11[1]
		if (err != null) {
			return [null, err]
		}
		return [__goscript_iprawsock.newIPConn(fd), null]
	}

	public async dialMPTCP(ctx: context.Context | null, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null): globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		return await sysDialer.prototype.dialTCP.call(sd, ctx, laddr, raddr)
	}

	public async dialParallel(ctx: context.Context | null, primaries: __goscript_ipsock.addrList, fallbacks: __goscript_ipsock.addrList): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		await using __defer = new $.AsyncDisposableStack()
		if ($.len((fallbacks as __goscript_ipsock.addrList)) == 0) {
			return await sysDialer.prototype.dialSerial.call(sd, ctx, (primaries as __goscript_ipsock.addrList))
		}

		let returned = $.makeChannel<{}>(0, {}, "both")
		__defer.defer(() => { returned!.close() })

		class dialResult {
			public get Conn(): __goscript_net.Conn | null {
				return this._fields.Conn.value
			}
			public set Conn(value: __goscript_net.Conn | null) {
				this._fields.Conn.value = value
			}

			public get error(): $.GoError {
				return this._fields.error.value
			}
			public set error(value: $.GoError) {
				this._fields.error.value = value
			}

			public get primary(): boolean {
				return this._fields.primary.value
			}
			public set primary(value: boolean) {
				this._fields.primary.value = value
			}

			public get done(): boolean {
				return this._fields.done.value
			}
			public set done(value: boolean) {
				this._fields.done.value = value
			}

			public _fields: {
				Conn: $.VarRef<__goscript_net.Conn | null>
				error: $.VarRef<$.GoError>
				primary: $.VarRef<boolean>
				done: $.VarRef<boolean>
			}

			constructor(init?: Partial<{Conn?: __goscript_net.Conn | null, error?: $.GoError, primary?: boolean, done?: boolean}>) {
				this._fields = {
					Conn: $.varRef(init?.Conn ?? null),
					error: $.varRef(init?.error ?? null),
					primary: $.varRef(init?.primary ?? false),
					done: $.varRef(init?.done ?? false)
				}
			}

			public clone(): dialResult {
				const cloned = new dialResult()
				cloned._fields = {
					Conn: $.varRef(this._fields.Conn.value),
					error: $.varRef(this._fields.error.value),
					primary: $.varRef(this._fields.primary.value),
					done: $.varRef(this._fields.done.value)
				}
				return $.markAsStructValue(cloned)
			}

			public async Close(): globalThis.Promise<any> {
				return await $.pointerValue<Exclude<__goscript_net.Conn | null, null>>(this.Conn).Close()
			}

			public LocalAddr(): any {
				return $.pointerValue<Exclude<__goscript_net.Conn | null, null>>(this.Conn).LocalAddr()
			}

			public async Read(b: any): globalThis.Promise<any> {
				return await $.pointerValue<Exclude<__goscript_net.Conn | null, null>>(this.Conn).Read(b)
			}

			public RemoteAddr(): any {
				return $.pointerValue<Exclude<__goscript_net.Conn | null, null>>(this.Conn).RemoteAddr()
			}

			public async SetDeadline(t: any): globalThis.Promise<any> {
				return await $.pointerValue<Exclude<__goscript_net.Conn | null, null>>(this.Conn).SetDeadline(t)
			}

			public async SetReadDeadline(t: any): globalThis.Promise<any> {
				return await $.pointerValue<Exclude<__goscript_net.Conn | null, null>>(this.Conn).SetReadDeadline(t)
			}

			public async SetWriteDeadline(t: any): globalThis.Promise<any> {
				return await $.pointerValue<Exclude<__goscript_net.Conn | null, null>>(this.Conn).SetWriteDeadline(t)
			}

			public async Write(b: any): globalThis.Promise<any> {
				return await $.pointerValue<Exclude<__goscript_net.Conn | null, null>>(this.Conn).Write(b)
			}

			public async Error(): globalThis.Promise<any> {
				return await $.pointerValue<Exclude<$.GoError, null>>(this.error).Error()
			}

			static __typeInfo = $.registerStructType(
				"net.dialResult",
				() => new dialResult(),
				[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
				dialResult,
				[{ name: "Conn", key: "Conn", type: "net.Conn", anonymous: true, index: [0], offset: 0, exported: true }, { name: "error", key: "error", type: "error", pkgPath: "net", anonymous: true, index: [1], offset: 16, exported: false }, { name: "primary", key: "primary", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [2], offset: 32, exported: false }, { name: "done", key: "done", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [3], offset: 33, exported: false }]
			)
		}
		let results = $.makeChannel<dialResult>(0, $.markAsStructValue(new dialResult()), "both")

		let startRacer: ((ctx: context.Context | null, primary: boolean) => void) | null = $.functionValue(async (ctx: context.Context | null, primary: boolean): globalThis.Promise<void> => {
			let ras: __goscript_ipsock.addrList = (primaries as __goscript_ipsock.addrList)
			if (!primary) {
				ras = (fallbacks as __goscript_ipsock.addrList)
			}
			let [c, err] = await sysDialer.prototype.dialSerial.call(sd, ctx, (ras as __goscript_ipsock.addrList))
			const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, void>([
				{
					id: 0,
					isSend: true,
					channel: results,
					value: $.markAsStructValue(new dialResult({Conn: c, error: err, primary: primary, done: true})),
					onSelected: async (__goscriptSelect1Result) => {
					}
				},
				{
					id: 1,
					isSend: false,
					channel: returned,
					onSelected: async (__goscriptSelect1Result) => {
						if (c != null) {
							await $.pointerValue<Exclude<__goscript_net.Conn, null>>(c).Close()
						}
					}
				}
			], false)
			if (__goscriptSelect1HasReturn) {
				return __goscriptSelect1Value
			}
		}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "bool" }], results: [] } as $.FunctionTypeInfo))

		let primary: dialResult = $.markAsStructValue(new dialResult())
		let fallback: dialResult = $.markAsStructValue(new dialResult())

		// Start the main racer.
		let [primaryCtx, primaryCancel] = context.WithCancel($.pointerValueOrNil(ctx)!)
		__defer.defer(async () => { await primaryCancel!() })
		queueMicrotask(async () => { await startRacer!(primaryCtx, true) })

		// Start the timer for the fallback racer.
		let fallbackTimer: time.Timer | $.VarRef<time.Timer> | null = time.NewTimer($.pointerValue<sysDialer>(sd).Dialer.fallbackDelay())
		__defer.defer(() => { time.Timer.prototype.Stop.call($.pointerValue<time.Timer>(fallbackTimer)) })

		while (true) {
			const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, [__goscript_net.Conn | null, $.GoError]>([
				{
					id: 0,
					isSend: false,
					channel: $.pointerValue<time.Timer>(fallbackTimer).C,
					onSelected: async (__goscriptSelect2Result) => {
						let [fallbackCtx, fallbackCancel] = context.WithCancel($.pointerValueOrNil(ctx)!)
						__defer.defer(async () => { await fallbackCancel!() })
						queueMicrotask(async () => { await startRacer!(fallbackCtx, false) })
					}
				},
				{
					id: 1,
					isSend: false,
					channel: results,
					onSelected: async (__goscriptSelect2Result) => {
						let res = __goscriptSelect2Result.value
						if (res.error == null) {
							return [res.Conn, null]
						}
						if (res.primary) {
							primary = $.markAsStructValue($.cloneStructValue(res))
						} else {
							fallback = $.markAsStructValue($.cloneStructValue(res))
						}
						if (primary.done && fallback.done) {
							return [null, primary.error]
						}
						if (res.primary && time.Timer.prototype.Stop.call($.pointerValue<time.Timer>(fallbackTimer))) {
							// If we were able to stop the timer, that means it
							// was running (hadn't yet started the fallback), but
							// we just got an error on the primary path, so start
							// the fallback immediately (in 0 nanoseconds).
							time.Timer.prototype.Reset.call($.pointerValue<time.Timer>(fallbackTimer), 0)
						}
					}
				}
			], false)
			if (__goscriptSelect2HasReturn) {
				return __goscriptSelect2Value
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async dialSerial(ctx: context.Context | null, ras: __goscript_ipsock.addrList): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let firstErr: $.GoError = null as $.GoError

		for (let __goscriptRangeTarget0 = ras, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			let ra = __goscriptRangeTarget0![i]
			const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, [__goscript_net.Conn | null, $.GoError]>([
				{
					id: 0,
					isSend: false,
					channel: $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
					onSelected: async (__goscriptSelect3Result) => {
						return [null, $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField0 = __goscript_net.mapErr(await $.pointerValue<Exclude<context.Context, null>>(ctx).Err()); return new __goscript_net.OpError({Op: "dial", Net: $.pointerValue<sysDialer>(sd).network, Source: $.pointerValue<sysDialer>(sd).Dialer.LocalAddr, Addr: ra, Err: __goscriptLiteralField0}) })()), "*net.OpError")]
					}
				},
				{
					id: -1,
					isSend: false,
					channel: null,
					onSelected: async (__goscriptSelect3Result) => {
					}
				}
			], true)
			if (__goscriptSelect3HasReturn) {
				return __goscriptSelect3Value
			}

			let dialCtx: context.Context | null = ctx
			{
				let [deadline, hasDeadline] = $.pointerValue<Exclude<context.Context, null>>(ctx).Deadline()
				if (hasDeadline) {
					let __goscriptShadow6 = partialDeadline
					let __goscriptTuple12: any = __goscriptShadow6($.markAsStructValue($.cloneStructValue(time.Now())), $.markAsStructValue($.cloneStructValue(deadline)), $.len((ras as __goscript_ipsock.addrList)) - i)
					let __goscriptShadow7 = __goscriptTuple12[0]
					let err = __goscriptTuple12[1]
					if (err != null) {
						// Ran out of time.
						if (firstErr == null) {
							firstErr = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "dial", Net: $.pointerValue<sysDialer>(sd).network, Source: $.pointerValue<sysDialer>(sd).Dialer.LocalAddr, Addr: ra, Err: err}), "*net.OpError")
						}
						break
					}
					if ($.markAsStructValue($.cloneStructValue(__goscriptShadow7)).Before($.markAsStructValue($.cloneStructValue(deadline)))) {
						let cancel: context.CancelFunc | null = null as unknown as context.CancelFunc | null
						let __goscriptTuple13: any = context.WithDeadline($.pointerValueOrNil(ctx)!, $.markAsStructValue($.cloneStructValue(__goscriptShadow7)))
						dialCtx = __goscriptTuple13[0]
						cancel = __goscriptTuple13[1]
						__defer.defer(async () => { await cancel!() })
					}
				}
			}

			let [c, err] = await sysDialer.prototype.dialSingle.call(sd, dialCtx, ra)
			if (err == null) {
				return [c, null]
			}
			if (firstErr == null) {
				firstErr = err
			}
		}

		if (firstErr == null) {
			firstErr = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "dial", Net: $.pointerValue<sysDialer>(sd).network, Source: null, Addr: null, Err: __goscript_net.errMissingAddress}), "*net.OpError")
		}
		return [null, firstErr]
	}

	public async dialSingle(ctx: context.Context | null, ra: __goscript_net.Addr | null): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		let c: __goscript_net.Conn | null = null as __goscript_net.Conn | null
		let err: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		let __goscriptTuple14: any = $.typeAssertTuple<nettrace.Trace | $.VarRef<nettrace.Trace> | null>(await $.pointerValue<Exclude<context.Context, null>>(ctx).Value($.interfaceValue<any>($.markAsStructValue(new nettrace.TraceKey()), "nettrace.TraceKey")), { kind: $.TypeKind.Pointer, elemType: "nettrace.Trace" })
		let trace: nettrace.Trace | $.VarRef<nettrace.Trace> | null = __goscriptTuple14[0]
		if (trace != null) {
			let raStr = $.pointerValue<Exclude<__goscript_net.Addr, null>>(ra).String()
			if ($.pointerValue<nettrace.Trace>(trace).ConnectStart != null) {
				await $.pointerValue<nettrace.Trace>(trace).ConnectStart!($.pointerValue<sysDialer>(sd).network, raStr)
			}
			if ($.pointerValue<nettrace.Trace>(trace).ConnectDone != null) {
				__defer.defer(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
					await $.pointerValue<nettrace.Trace>(trace).ConnectDone!($.pointerValue<sysDialer>(sd).network, raStr, err)
				}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })
			}
		}
		let la = $.pointerValue<sysDialer>(sd).Dialer.LocalAddr
		{
			const __goscriptTypeSwitchValue = ra
			switch (true) {
				case $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).ok:
					{
						let ra: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).value
						let __goscriptShadow8 = la
						let __goscriptTuple15: any = $.typeAssertTuple<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptShadow8, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" })
						let __goscriptShadow9: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = __goscriptTuple15[0]
						if ($.pointerValue<sysDialer>(sd).Dialer.MultipathTCP()) {
							let __goscriptTuple16: any = await sysDialer.prototype.dialMPTCP.call(sd, ctx, __goscriptShadow9, ra)
							c = $.interfaceValue<__goscript_net.Conn | null>(__goscriptTuple16[0], "*net.TCPConn")
							err = __goscriptTuple16[1]
						} else {
							let __goscriptTuple17: any = await sysDialer.prototype.dialTCP.call(sd, ctx, __goscriptShadow9, ra)
							c = $.interfaceValue<__goscript_net.Conn | null>(__goscriptTuple17[0], "*net.TCPConn")
							err = __goscriptTuple17[1]
						}
					}
					break
				case $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).ok:
					{
						let ra: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).value
						let __goscriptShadow10 = la
						let __goscriptTuple18: any = $.typeAssertTuple<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptShadow10, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" })
						let __goscriptShadow11: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = __goscriptTuple18[0]
						let __goscriptTuple19: any = await sysDialer.prototype.dialUDP.call(sd, ctx, __goscriptShadow11, ra)
						c = $.interfaceValue<__goscript_net.Conn | null>(__goscriptTuple19[0], "*net.UDPConn")
						err = __goscriptTuple19[1]
					}
					break
				case $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).ok:
					{
						let ra: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null = $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).value
						let __goscriptShadow12 = la
						let __goscriptTuple20: any = $.typeAssertTuple<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptShadow12, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" })
						let __goscriptShadow13: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null = __goscriptTuple20[0]
						let __goscriptTuple21: any = await sysDialer.prototype.dialIP.call(sd, ctx, __goscriptShadow13, ra)
						c = $.interfaceValue<__goscript_net.Conn | null>(__goscriptTuple21[0], "*net.IPConn")
						err = __goscriptTuple21[1]
					}
					break
				case $.typeAssert<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" }).ok:
					{
						let ra: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null = $.typeAssert<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" }).value
						let __goscriptShadow14 = la
						let __goscriptTuple22: any = $.typeAssertTuple<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>(__goscriptShadow14, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" })
						let __goscriptShadow15: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null = __goscriptTuple22[0]
						let __goscriptTuple23: any = await sysDialer.prototype.dialUnix.call(sd, ctx, __goscriptShadow15, ra)
						c = $.interfaceValue<__goscript_net.Conn | null>(__goscriptTuple23[0], "*net.UnixConn")
						err = __goscriptTuple23[1]
					}
					break
				default:
					{
						let ra: any = __goscriptTypeSwitchValue
						const __goscriptReturn10: [__goscript_net.Conn | null, $.GoError] = [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "dial", Net: $.pointerValue<sysDialer>(sd).network, Source: la, Addr: ra, Err: $.interfaceValue<$.GoError>(new __goscript_net.AddrError({Err: "unexpected address type", Addr: $.pointerValue<sysDialer>(sd).address}), "*net.AddrError")}), "*net.OpError")]
						c = __goscriptReturn10[0]
						err = __goscriptReturn10[1]
						await __defer[Symbol.asyncDispose]()
						return [c, err]
					}
					break
			}
		}
		if (err != null) {
			const __goscriptReturn11: [__goscript_net.Conn | null, $.GoError] = [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "dial", Net: $.pointerValue<sysDialer>(sd).network, Source: la, Addr: ra, Err: err}), "*net.OpError")]
			c = __goscriptReturn11[0]
			err = __goscriptReturn11[1]
			await __defer[Symbol.asyncDispose]()
			return [c, err]
		}
		const __goscriptReturn12: [__goscript_net.Conn | null, $.GoError] = [c, null]
		c = __goscriptReturn12[0]
		err = __goscriptReturn12[1]
		await __defer[Symbol.asyncDispose]()
		return [c, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async dialTCP(ctx: context.Context | null, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null): globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		{
			let h: ((ctx: context.Context | null, net: string, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null) => [__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError] | globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]>) | null = $.pointerValue<sysDialer>(sd).testHookDialTCP
			if (h != null) {
				return await h!(ctx, $.pointerValue<sysDialer>(sd).network, laddr, raddr)
			}
		}
		{
			let h: ((ctx: context.Context | null, net: string, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null) => [__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError] | globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]>) | null = __goscript_hook.testHookDialTCP
			if (h != null) {
				return await h!(ctx, $.pointerValue<sysDialer>(sd).network, laddr, raddr)
			}
		}
		return await sysDialer.prototype.doDialTCP.call(sd, ctx, laddr, raddr)
	}

	public async dialUDP(ctx: context.Context | null, laddr: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null, raddr: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null): globalThis.Promise<[__goscript_udpsock.UDPConn | $.VarRef<__goscript_udpsock.UDPConn> | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = $.pointerValue<sysDialer>(sd).Dialer.ControlContext
		if ((ctrlCtxFn == null) && ($.pointerValue<sysDialer>(sd).Dialer.Control != null)) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysDialer>(sd).Dialer.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple24: any = await __goscript_ipsock_posix.internetSocket(ctx, $.pointerValue<sysDialer>(sd).network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.UDPAddr"), $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(raddr, "*net.UDPAddr"), syscall.SOCK_DGRAM, 0, "dial", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple24[0]
		let err = __goscriptTuple24[1]
		if (err != null) {
			return [null, err]
		}
		return [__goscript_udpsock.newUDPConn(fd), null]
	}

	public async dialUnix(ctx: context.Context | null, laddr: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null, raddr: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null): globalThis.Promise<[__goscript_unixsock.UnixConn | $.VarRef<__goscript_unixsock.UnixConn> | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = $.pointerValue<sysDialer>(sd).Dialer.ControlContext
		if ((ctrlCtxFn == null) && ($.pointerValue<sysDialer>(sd).Dialer.Control != null)) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysDialer>(sd).Dialer.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple25: any = await __goscript_unixsock_posix.unixSocket(ctx, $.pointerValue<sysDialer>(sd).network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.UnixAddr"), $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(raddr, "*net.UnixAddr"), "dial", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple25[0]
		let err = __goscriptTuple25[1]
		if (err != null) {
			return [null, err]
		}
		return [__goscript_unixsock.newUnixConn(fd), null]
	}

	public async doDialTCP(ctx: context.Context | null, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null): globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		return await sysDialer.prototype.doDialTCPProto.call(sd, ctx, laddr, raddr, 0)
	}

	public async doDialTCPProto(ctx: context.Context | null, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, proto: number): globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]> {
		const sd: sysDialer | $.VarRef<sysDialer> | null = this
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = $.pointerValue<sysDialer>(sd).Dialer.ControlContext
		if ((ctrlCtxFn == null) && ($.pointerValue<sysDialer>(sd).Dialer.Control != null)) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysDialer>(sd).Dialer.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple26: any = await __goscript_ipsock_posix.internetSocket(ctx, $.pointerValue<sysDialer>(sd).network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.TCPAddr"), $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(raddr, "*net.TCPAddr"), syscall.SOCK_STREAM, proto, "dial", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple26[0]
		let err = __goscriptTuple26[1]
		// The value 0 is the system default, linked to defaultMPTCPEnabledListen

		// If MPTCP is disabled via GODEBUG=multipathtcp=0 or only
		// enabled on dialers, but not on listeners.

		for (let i = 0; ((i < 2) && ((laddr == null) || ($.pointerValue<__goscript_tcpsock.TCPAddr>(laddr).Port == 0))) && (__goscript_tcpsock_posix.selfConnect(fd, err) || __goscript_tcpsock_posix.spuriousENOTAVAIL(err)); i++) {
			if (err == null) {
				await __goscript_fd_fake.netFD.prototype.Close.call(fd)
			}
			let __goscriptTuple27: any = await __goscript_ipsock_posix.internetSocket(ctx, $.pointerValue<sysDialer>(sd).network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.TCPAddr"), $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(raddr, "*net.TCPAddr"), syscall.SOCK_STREAM, proto, "dial", ctrlCtxFn)
			fd = __goscriptTuple27[0]
			err = __goscriptTuple27[1]
		}

		if (err != null) {
			return [null, err]
		}
		return [await __goscript_tcpsock.newTCPConn(fd, $.pointerValue<sysDialer>(sd).Dialer.KeepAlive, $.markAsStructValue($.cloneStructValue($.pointerValue<sysDialer>(sd).Dialer.KeepAliveConfig)), __goscript_hook.__goscript_get_testPreHookSetKeepAlive(), __goscript_hook.__goscript_get_testHookSetKeepAlive()), null]
	}

	public async Dial(network: any, address: any): globalThis.Promise<any> {
		return await $.pointerValue<Dialer>(this.Dialer).Dial(network, address)
	}

	public async DialContext(ctx: any, network: any, address: any): globalThis.Promise<any> {
		return await $.pointerValue<Dialer>(this.Dialer).DialContext(ctx, network, address)
	}

	public async DialIP(ctx: any, network: any, laddr: any, raddr: any): globalThis.Promise<any> {
		return await $.pointerValue<Dialer>(this.Dialer).DialIP(ctx, network, laddr, raddr)
	}

	public async DialTCP(ctx: any, network: any, laddr: any, raddr: any): globalThis.Promise<any> {
		return await $.pointerValue<Dialer>(this.Dialer).DialTCP(ctx, network, laddr, raddr)
	}

	public async DialUDP(ctx: any, network: any, laddr: any, raddr: any): globalThis.Promise<any> {
		return await $.pointerValue<Dialer>(this.Dialer).DialUDP(ctx, network, laddr, raddr)
	}

	public async DialUnix(ctx: any, network: any, laddr: any, raddr: any): globalThis.Promise<any> {
		return await $.pointerValue<Dialer>(this.Dialer).DialUnix(ctx, network, laddr, raddr)
	}

	public MultipathTCP(): any {
		return $.pointerValue<Dialer>(this.Dialer).MultipathTCP()
	}

	public SetMultipathTCP(use: any): any {
		return $.pointerValue<Dialer>(this.Dialer).SetMultipathTCP(use)
	}

	public deadline(ctx: any, now: any): any {
		return $.pointerValue<Dialer>(this.Dialer).deadline(ctx, now)
	}

	public async dialCtx(ctx: any): globalThis.Promise<any> {
		return await $.pointerValue<Dialer>(this.Dialer).dialCtx(ctx)
	}

	public dualStack(): any {
		return $.pointerValue<Dialer>(this.Dialer).dualStack()
	}

	public fallbackDelay(): any {
		return $.pointerValue<Dialer>(this.Dialer).fallbackDelay()
	}

	public resolver(): any {
		return $.pointerValue<Dialer>(this.Dialer).resolver()
	}

	static __typeInfo = $.registerStructType(
		"net.sysDialer",
		() => new sysDialer(),
		[{ name: "dialIP", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }, { name: "raddr", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.IPConn" } }, { name: "_r1", type: "error" }] }, { name: "dialMPTCP", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }, { name: "raddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPConn" } }, { name: "_r1", type: "error" }] }, { name: "dialParallel", args: [{ name: "ctx", type: "context.Context" }, { name: "primaries", type: "net.addrList" }, { name: "fallbacks", type: "net.addrList" }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "dialSerial", args: [{ name: "ctx", type: "context.Context" }, { name: "ras", type: "net.addrList" }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "dialSingle", args: [{ name: "ctx", type: "context.Context" }, { name: "ra", type: "net.Addr" }], returns: [{ name: "c", type: "net.Conn" }, { name: "err", type: "error" }] }, { name: "dialTCP", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }, { name: "raddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPConn" } }, { name: "_r1", type: "error" }] }, { name: "dialUDP", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" } }, { name: "raddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UDPConn" } }, { name: "_r1", type: "error" }] }, { name: "dialUnix", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }, { name: "raddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixConn" } }, { name: "_r1", type: "error" }] }, { name: "doDialTCP", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }, { name: "raddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPConn" } }, { name: "_r1", type: "error" }] }, { name: "doDialTCPProto", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }, { name: "raddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }, { name: "proto", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPConn" } }, { name: "_r1", type: "error" }] }, { name: "Dial", args: [{ name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "address", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "DialContext", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "address", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "DialIP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "laddr", type: "netip.Addr" }, { name: "raddr", type: "netip.Addr" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.IPConn" } }, { name: "_r1", type: "error" }] }, { name: "DialTCP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "laddr", type: "netip.AddrPort" }, { name: "raddr", type: "netip.AddrPort" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPConn" } }, { name: "_r1", type: "error" }] }, { name: "DialUDP", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "laddr", type: "netip.AddrPort" }, { name: "raddr", type: "netip.AddrPort" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UDPConn" } }, { name: "_r1", type: "error" }] }, { name: "DialUnix", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }, { name: "raddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixConn" } }, { name: "_r1", type: "error" }] }, { name: "MultipathTCP", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "SetMultipathTCP", args: [{ name: "use", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }, { name: "deadline", args: [{ name: "ctx", type: "context.Context" }, { name: "now", type: "time.Time" }], returns: [{ name: "earliest", type: "time.Time" }] }, { name: "dialCtx", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "context.Context" }, { name: "_r1", type: ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo) }] }, { name: "dualStack", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "fallbackDelay", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" } }] }, { name: "resolver", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.Resolver" } }] }],
		sysDialer,
		[{ name: "Dialer", key: "Dialer", type: "net.Dialer", anonymous: true, index: [0], offset: 0, exported: true }, { name: "network", key: "network", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [1], offset: 144, exported: false }, { name: "address", key: "address", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [2], offset: 160, exported: false }, { name: "testHookDialTCP", key: "testHookDialTCP", type: ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }], results: [{ kind: $.TypeKind.Pointer, elemType: "net.TCPConn" }, "error"] } as $.FunctionTypeInfo), pkgPath: "net", index: [3], offset: 176, exported: false }]
	)
}

export class ListenConfig {
	// If Control is not nil, it is called after creating the network
	// connection but before binding it to the operating system.
	//
	// Network and address parameters passed to Control function are not
	// necessarily the ones passed to Listen. Calling Listen with TCP networks
	// will cause the Control function to be called with "tcp4" or "tcp6",
	// UDP networks become "udp4" or "udp6", IP networks become "ip4" or "ip6",
	// and other known networks are passed as-is.
	public get Control(): ((network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.Control.value
	}
	public set Control(value: ((network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.Control.value = value
	}

	// KeepAlive specifies the keep-alive period for network
	// connections accepted by this listener.
	//
	// KeepAlive is ignored if KeepAliveConfig.Enable is true.
	//
	// If zero, keep-alive are enabled if supported by the protocol
	// and operating system. Network protocols or operating systems
	// that do not support keep-alive ignore this field.
	// If negative, keep-alive are disabled.
	public get KeepAlive(): time.Duration {
		return this._fields.KeepAlive.value
	}
	public set KeepAlive(value: time.Duration) {
		this._fields.KeepAlive.value = value
	}

	// KeepAliveConfig specifies the keep-alive probe configuration
	// for an active network connection, when supported by the
	// protocol and operating system.
	//
	// If KeepAliveConfig.Enable is true, keep-alive probes are enabled.
	// If KeepAliveConfig.Enable is false and KeepAlive is negative,
	// keep-alive probes are disabled.
	public get KeepAliveConfig(): __goscript_tcpsock.KeepAliveConfig {
		return this._fields.KeepAliveConfig.value
	}
	public set KeepAliveConfig(value: __goscript_tcpsock.KeepAliveConfig) {
		this._fields.KeepAliveConfig.value = value
	}

	// If mptcpStatus is set to a value allowing Multipath TCP (MPTCP) to be
	// used, any call to Listen with "tcp(4|6)" as network will use MPTCP if
	// supported by the operating system.
	public get mptcpStatus(): mptcpStatusListen {
		return this._fields.mptcpStatus.value
	}
	public set mptcpStatus(value: mptcpStatusListen) {
		this._fields.mptcpStatus.value = value
	}

	public _fields: {
		Control: $.VarRef<((network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null>
		KeepAlive: $.VarRef<time.Duration>
		KeepAliveConfig: $.VarRef<__goscript_tcpsock.KeepAliveConfig>
		mptcpStatus: $.VarRef<mptcpStatusListen>
	}

	constructor(init?: Partial<{Control?: ((network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null, KeepAlive?: time.Duration, KeepAliveConfig?: __goscript_tcpsock.KeepAliveConfig, mptcpStatus?: mptcpStatusListen}>) {
		this._fields = {
			Control: $.varRef(init?.Control ?? null),
			KeepAlive: $.varRef(init?.KeepAlive ?? 0),
			KeepAliveConfig: $.varRef(init?.KeepAliveConfig ? $.markAsStructValue($.cloneStructValue(init.KeepAliveConfig)) : $.markAsStructValue(new __goscript_tcpsock.KeepAliveConfig())),
			mptcpStatus: $.varRef(init?.mptcpStatus ?? 0)
		}
	}

	public clone(): ListenConfig {
		const cloned = new ListenConfig()
		cloned._fields = {
			Control: $.varRef(this._fields.Control.value),
			KeepAlive: $.varRef(this._fields.KeepAlive.value),
			KeepAliveConfig: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.KeepAliveConfig.value))),
			mptcpStatus: $.varRef(this._fields.mptcpStatus.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Listen(ctx: context.Context | null, network: string, address: string): globalThis.Promise<[__goscript_net.Listener | null, $.GoError]> {
		const lc: ListenConfig | $.VarRef<ListenConfig> | null = this
		let __goscriptTuple28: any = await __goscript_lookup.Resolver.prototype.resolveAddrList.call(__goscript_lookup.DefaultResolver, ctx, "listen", network, address, null)
		let addrs: __goscript_ipsock.addrList = (__goscriptTuple28[0] as __goscript_ipsock.addrList)
		let err = __goscriptTuple28[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: null, Err: err}), "*net.OpError")]
		}
		let sl: sysListener | $.VarRef<sysListener> | null = new sysListener({ListenConfig: $.markAsStructValue($.cloneStructValue($.pointerValue<ListenConfig>(lc))), network: network, address: address})
		let l: __goscript_net.Listener | null = null as __goscript_net.Listener | null
		let la = await __goscript_ipsock.addrList_first(addrs, __goscript_ipsock.isIPv4)
		{
			const __goscriptTypeSwitchValue = la
			switch (true) {
				case $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).ok:
					{
						let la: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = $.typeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" }).value
						if ($.pointerValue<sysListener>(sl).ListenConfig.MultipathTCP()) {
							let __goscriptTuple29: any = await sysListener.prototype.listenMPTCP.call(sl, ctx, la)
							l = $.interfaceValue<__goscript_net.Listener | null>(__goscriptTuple29[0], "*net.TCPListener")
							err = __goscriptTuple29[1]
						} else {
							let __goscriptTuple30: any = await sysListener.prototype.listenTCP.call(sl, ctx, la)
							l = $.interfaceValue<__goscript_net.Listener | null>(__goscriptTuple30[0], "*net.TCPListener")
							err = __goscriptTuple30[1]
						}
					}
					break
				case $.typeAssert<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" }).ok:
					{
						let la: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null = $.typeAssert<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" }).value
						let __goscriptTuple31: any = await sysListener.prototype.listenUnix.call(sl, ctx, la)
						l = $.interfaceValue<__goscript_net.Listener | null>(__goscriptTuple31[0], "*net.UnixListener")
						err = __goscriptTuple31[1]
					}
					break
				default:
					{
						let la: any = __goscriptTypeSwitchValue
						return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "listen", Net: $.pointerValue<sysListener>(sl).network, Source: null, Addr: la, Err: $.interfaceValue<$.GoError>(new __goscript_net.AddrError({Err: "unexpected address type", Addr: address}), "*net.AddrError")}), "*net.OpError")]
					}
					break
			}
		}
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "listen", Net: $.pointerValue<sysListener>(sl).network, Source: null, Addr: la, Err: err}), "*net.OpError")]
		}
		return [l, null]
	}

	public async ListenPacket(ctx: context.Context | null, network: string, address: string): globalThis.Promise<[__goscript_net.PacketConn | null, $.GoError]> {
		const lc: ListenConfig | $.VarRef<ListenConfig> | null = this
		let __goscriptTuple32: any = await __goscript_lookup.Resolver.prototype.resolveAddrList.call(__goscript_lookup.DefaultResolver, ctx, "listen", network, address, null)
		let addrs: __goscript_ipsock.addrList = (__goscriptTuple32[0] as __goscript_ipsock.addrList)
		let err = __goscriptTuple32[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "listen", Net: network, Source: null, Addr: null, Err: err}), "*net.OpError")]
		}
		let sl: sysListener | $.VarRef<sysListener> | null = new sysListener({ListenConfig: $.markAsStructValue($.cloneStructValue($.pointerValue<ListenConfig>(lc))), network: network, address: address})
		let c: __goscript_net.PacketConn | null = null as __goscript_net.PacketConn | null
		let la = await __goscript_ipsock.addrList_first(addrs, __goscript_ipsock.isIPv4)
		{
			const __goscriptTypeSwitchValue = la
			switch (true) {
				case $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).ok:
					{
						let la: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = $.typeAssert<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" }).value
						let __goscriptTuple33: any = await sysListener.prototype.listenUDP.call(sl, ctx, la)
						c = $.interfaceValue<__goscript_net.PacketConn | null>(__goscriptTuple33[0], "*net.UDPConn")
						err = __goscriptTuple33[1]
					}
					break
				case $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).ok:
					{
						let la: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null = $.typeAssert<__goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" }).value
						let __goscriptTuple34: any = await sysListener.prototype.listenIP.call(sl, ctx, la)
						c = $.interfaceValue<__goscript_net.PacketConn | null>(__goscriptTuple34[0], "*net.IPConn")
						err = __goscriptTuple34[1]
					}
					break
				case $.typeAssert<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" }).ok:
					{
						let la: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null = $.typeAssert<__goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" }).value
						let __goscriptTuple35: any = await sysListener.prototype.listenUnixgram.call(sl, ctx, la)
						c = $.interfaceValue<__goscript_net.PacketConn | null>(__goscriptTuple35[0], "*net.UnixConn")
						err = __goscriptTuple35[1]
					}
					break
				default:
					{
						let la: any = __goscriptTypeSwitchValue
						return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "listen", Net: $.pointerValue<sysListener>(sl).network, Source: null, Addr: la, Err: $.interfaceValue<$.GoError>(new __goscript_net.AddrError({Err: "unexpected address type", Addr: address}), "*net.AddrError")}), "*net.OpError")]
					}
					break
			}
		}
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "listen", Net: $.pointerValue<sysListener>(sl).network, Source: null, Addr: la, Err: err}), "*net.OpError")]
		}
		return [c, null]
	}

	public MultipathTCP(): boolean {
		const lc: ListenConfig | $.VarRef<ListenConfig> | null = this
		return mptcpStatusListen__get($.pointerValue<ListenConfig>(lc)._fields.mptcpStatus)
	}

	public SetMultipathTCP(use: boolean): void {
		const lc: ListenConfig | $.VarRef<ListenConfig> | null = this
		mptcpStatusListen__set($.pointerValue<ListenConfig>(lc)._fields.mptcpStatus, use)
	}

	static __typeInfo = $.registerStructType(
		"net.ListenConfig",
		() => new ListenConfig(),
		[{ name: "Listen", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "address", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.Listener" }, { name: "_r1", type: "error" }] }, { name: "ListenPacket", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "address", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.PacketConn" }, { name: "_r1", type: "error" }] }, { name: "MultipathTCP", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "SetMultipathTCP", args: [{ name: "use", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }],
		ListenConfig,
		[{ name: "Control", key: "Control", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo), index: [0], offset: 0, exported: true }, { name: "KeepAlive", key: "KeepAlive", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, index: [1], offset: 8, exported: true }, { name: "KeepAliveConfig", key: "KeepAliveConfig", type: "net.KeepAliveConfig", index: [2], offset: 16, exported: true }, { name: "mptcpStatus", key: "mptcpStatus", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "net.mptcpStatusListen" }, pkgPath: "net", index: [3], offset: 48, exported: false }]
	)
}

export class sysListener {
	public get ListenConfig(): ListenConfig {
		return this._fields.ListenConfig.value
	}
	public set ListenConfig(value: ListenConfig) {
		this._fields.ListenConfig.value = value
	}

	public get network(): string {
		return this._fields.network.value
	}
	public set network(value: string) {
		this._fields.network.value = value
	}

	public get address(): string {
		return this._fields.address.value
	}
	public set address(value: string) {
		this._fields.address.value = value
	}

	public _fields: {
		ListenConfig: $.VarRef<ListenConfig>
		network: $.VarRef<string>
		address: $.VarRef<string>
	}

	constructor(init?: Partial<{ListenConfig?: ListenConfig, network?: string, address?: string}>) {
		this._fields = {
			ListenConfig: $.varRef(init?.ListenConfig ? $.markAsStructValue($.cloneStructValue(init.ListenConfig)) : $.markAsStructValue(new ListenConfig())),
			network: $.varRef(init?.network ?? ""),
			address: $.varRef(init?.address ?? "")
		}
	}

	public clone(): sysListener {
		const cloned = new sysListener()
		cloned._fields = {
			ListenConfig: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ListenConfig.value))),
			network: $.varRef(this._fields.network.value),
			address: $.varRef(this._fields.address.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async listenIP(ctx: context.Context | null, laddr: __goscript_iprawsock.IPAddr | $.VarRef<__goscript_iprawsock.IPAddr> | null): globalThis.Promise<[__goscript_iprawsock.IPConn | $.VarRef<__goscript_iprawsock.IPConn> | null, $.GoError]> {
		const sl: sysListener | $.VarRef<sysListener> | null = this
		let __goscriptTuple36: any = await parseNetwork(ctx, $.pointerValue<sysListener>(sl).network, true)
		let network = __goscriptTuple36[0]
		let proto = __goscriptTuple36[1]
		let err = __goscriptTuple36[2]
		if (err != null) {
			return [null, err]
		}
		switch (network) {
			case "ip":
			case "ip4":
			case "ip6":
			{
				break
			}
			default:
			{
				return [null, $.namedValueInterfaceValue<$.GoError>($.pointerValue<sysListener>(sl).network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
				break
			}
		}
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = null as unknown as ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null
		if ($.pointerValue<sysListener>(sl).ListenConfig.Control != null) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysListener>(sl).ListenConfig.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple37: any = await __goscript_ipsock_posix.internetSocket(ctx, network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.IPAddr"), null, syscall.SOCK_RAW, proto, "listen", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple37[0]
		err = __goscriptTuple37[1]
		if (err != null) {
			return [null, err]
		}
		return [__goscript_iprawsock.newIPConn(fd), null]
	}

	public async listenMPTCP(ctx: context.Context | null, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null): globalThis.Promise<[__goscript_tcpsock.TCPListener | $.VarRef<__goscript_tcpsock.TCPListener> | null, $.GoError]> {
		const sl: sysListener | $.VarRef<sysListener> | null = this
		return await sysListener.prototype.listenTCP.call(sl, ctx, laddr)
	}

	public async listenMulticastUDP(ctx: context.Context | null, ifi: __goscript__interface.Interface | $.VarRef<__goscript__interface.Interface> | null, gaddr: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null): globalThis.Promise<[__goscript_udpsock.UDPConn | $.VarRef<__goscript_udpsock.UDPConn> | null, $.GoError]> {
		const sl: sysListener | $.VarRef<sysListener> | null = this
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = null as unknown as ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null
		if ($.pointerValue<sysListener>(sl).ListenConfig.Control != null) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysListener>(sl).ListenConfig.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple38: any = await __goscript_ipsock_posix.internetSocket(ctx, $.pointerValue<sysListener>(sl).network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(gaddr, "*net.UDPAddr"), null, syscall.SOCK_DGRAM, 0, "listen", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple38[0]
		let err = __goscriptTuple38[1]
		if (err != null) {
			return [null, err]
		}
		let c: __goscript_udpsock.UDPConn | $.VarRef<__goscript_udpsock.UDPConn> | null = __goscript_udpsock.newUDPConn(fd)
		{
			let ip4: __goscript_ip.IP = (__goscript_ip.IP_To4($.pointerValue<__goscript_udpsock.UDPAddr>(gaddr).IP) as __goscript_ip.IP)
			if (ip4 != null) {
				{
					let __goscriptShadow16 = __goscript_udpsock_posix.listenIPv4MulticastUDP(c, ifi, (ip4 as __goscript_ip.IP))
					if (__goscriptShadow16 != null) {
						await $.pointerValue<__goscript_udpsock.UDPConn>(c).conn.Close()
						return [null, __goscriptShadow16]
					}
				}
			} else {
				{
					let __goscriptShadow17 = __goscript_udpsock_posix.listenIPv6MulticastUDP(c, ifi, ($.pointerValue<__goscript_udpsock.UDPAddr>(gaddr).IP as __goscript_ip.IP))
					if (__goscriptShadow17 != null) {
						await $.pointerValue<__goscript_udpsock.UDPConn>(c).conn.Close()
						return [null, __goscriptShadow17]
					}
				}
			}
		}
		return [c, null]
	}

	public async listenTCP(ctx: context.Context | null, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null): globalThis.Promise<[__goscript_tcpsock.TCPListener | $.VarRef<__goscript_tcpsock.TCPListener> | null, $.GoError]> {
		const sl: sysListener | $.VarRef<sysListener> | null = this
		return await sysListener.prototype.listenTCPProto.call(sl, ctx, laddr, 0)
	}

	public async listenTCPProto(ctx: context.Context | null, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, proto: number): globalThis.Promise<[__goscript_tcpsock.TCPListener | $.VarRef<__goscript_tcpsock.TCPListener> | null, $.GoError]> {
		const sl: sysListener | $.VarRef<sysListener> | null = this
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = null as unknown as ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null
		if ($.pointerValue<sysListener>(sl).ListenConfig.Control != null) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysListener>(sl).ListenConfig.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple39: any = await __goscript_ipsock_posix.internetSocket(ctx, $.pointerValue<sysListener>(sl).network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.TCPAddr"), null, syscall.SOCK_STREAM, proto, "listen", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple39[0]
		let err = __goscriptTuple39[1]
		if (err != null) {
			return [null, err]
		}
		return [new __goscript_tcpsock.TCPListener({fd: fd, lc: $.markAsStructValue($.cloneStructValue($.pointerValue<sysListener>(sl).ListenConfig))}), null]
	}

	public async listenUDP(ctx: context.Context | null, laddr: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null): globalThis.Promise<[__goscript_udpsock.UDPConn | $.VarRef<__goscript_udpsock.UDPConn> | null, $.GoError]> {
		const sl: sysListener | $.VarRef<sysListener> | null = this
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = null as unknown as ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null
		if ($.pointerValue<sysListener>(sl).ListenConfig.Control != null) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysListener>(sl).ListenConfig.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple40: any = await __goscript_ipsock_posix.internetSocket(ctx, $.pointerValue<sysListener>(sl).network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.UDPAddr"), null, syscall.SOCK_DGRAM, 0, "listen", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple40[0]
		let err = __goscriptTuple40[1]
		if (err != null) {
			return [null, err]
		}
		return [__goscript_udpsock.newUDPConn(fd), null]
	}

	public async listenUnix(ctx: context.Context | null, laddr: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null): globalThis.Promise<[__goscript_unixsock.UnixListener | $.VarRef<__goscript_unixsock.UnixListener> | null, $.GoError]> {
		const sl: sysListener | $.VarRef<sysListener> | null = this
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = null as unknown as ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null
		if ($.pointerValue<sysListener>(sl).ListenConfig.Control != null) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysListener>(sl).ListenConfig.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple41: any = await __goscript_unixsock_posix.unixSocket(ctx, $.pointerValue<sysListener>(sl).network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.UnixAddr"), null, "listen", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple41[0]
		let err = __goscriptTuple41[1]
		if (err != null) {
			return [null, err]
		}
		return [(() => { const __goscriptLiteralField1 = $.pointerValue<Exclude<__goscript_net.Addr, null>>($.pointerValue<__goscript_fd_fake.netFD>(fd).laddr).String(); return new __goscript_unixsock.UnixListener({fd: fd, path: __goscriptLiteralField1, unlink: true}) })(), null]
	}

	public async listenUnixgram(ctx: context.Context | null, laddr: __goscript_unixsock.UnixAddr | $.VarRef<__goscript_unixsock.UnixAddr> | null): globalThis.Promise<[__goscript_unixsock.UnixConn | $.VarRef<__goscript_unixsock.UnixConn> | null, $.GoError]> {
		const sl: sysListener | $.VarRef<sysListener> | null = this
		let ctrlCtxFn: ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null = null as unknown as ((ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null) => $.GoError | globalThis.Promise<$.GoError>) | null
		if ($.pointerValue<sysListener>(sl).ListenConfig.Control != null) {
			ctrlCtxFn = $.functionValue(async (ctx: context.Context | null, network: string, address: string, c: syscall.RawConn | null): globalThis.Promise<$.GoError> => {
				return await $.pointerValue<sysListener>(sl).ListenConfig.Control!(network, address, c)
			}, ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "syscall.RawConn"], results: ["error"] } as $.FunctionTypeInfo))
		}
		let __goscriptTuple42: any = await __goscript_unixsock_posix.unixSocket(ctx, $.pointerValue<sysListener>(sl).network, $.interfaceValue<__goscript_sockaddr_posix.sockaddr | null>(laddr, "*net.UnixAddr"), null, "listen", ctrlCtxFn)
		let fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null = __goscriptTuple42[0]
		let err = __goscriptTuple42[1]
		if (err != null) {
			return [null, err]
		}
		return [__goscript_unixsock.newUnixConn(fd), null]
	}

	public async Listen(ctx: any, network: any, address: any): globalThis.Promise<any> {
		return await $.pointerValue<ListenConfig>(this.ListenConfig).Listen(ctx, network, address)
	}

	public async ListenPacket(ctx: any, network: any, address: any): globalThis.Promise<any> {
		return await $.pointerValue<ListenConfig>(this.ListenConfig).ListenPacket(ctx, network, address)
	}

	public MultipathTCP(): any {
		return $.pointerValue<ListenConfig>(this.ListenConfig).MultipathTCP()
	}

	public SetMultipathTCP(use: any): any {
		return $.pointerValue<ListenConfig>(this.ListenConfig).SetMultipathTCP(use)
	}

	static __typeInfo = $.registerStructType(
		"net.sysListener",
		() => new sysListener(),
		[{ name: "listenIP", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.IPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.IPConn" } }, { name: "_r1", type: "error" }] }, { name: "listenMPTCP", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPListener" } }, { name: "_r1", type: "error" }] }, { name: "listenMulticastUDP", args: [{ name: "ctx", type: "context.Context" }, { name: "ifi", type: { kind: $.TypeKind.Pointer, elemType: "net.Interface" } }, { name: "gaddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UDPConn" } }, { name: "_r1", type: "error" }] }, { name: "listenTCP", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPListener" } }, { name: "_r1", type: "error" }] }, { name: "listenTCPProto", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" } }, { name: "proto", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.TCPListener" } }, { name: "_r1", type: "error" }] }, { name: "listenUDP", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UDPConn" } }, { name: "_r1", type: "error" }] }, { name: "listenUnix", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixListener" } }, { name: "_r1", type: "error" }] }, { name: "listenUnixgram", args: [{ name: "ctx", type: "context.Context" }, { name: "laddr", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixAddr" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.UnixConn" } }, { name: "_r1", type: "error" }] }, { name: "Listen", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "address", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.Listener" }, { name: "_r1", type: "error" }] }, { name: "ListenPacket", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "address", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.PacketConn" }, { name: "_r1", type: "error" }] }, { name: "MultipathTCP", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "SetMultipathTCP", args: [{ name: "use", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }],
		sysListener,
		[{ name: "ListenConfig", key: "ListenConfig", type: "net.ListenConfig", anonymous: true, index: [0], offset: 0, exported: true }, { name: "network", key: "network", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [1], offset: 56, exported: false }, { name: "address", key: "address", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [2], offset: 72, exported: false }]
	)
}

export const defaultTCPKeepAliveIdle: time.Duration = 15000000000

export const defaultTCPKeepAliveInterval: time.Duration = 15000000000

export const defaultTCPKeepAliveCount: number = 9

export const defaultMPTCPEnabledListen: boolean = true

export const defaultMPTCPEnabledDial: boolean = false

export const mptcpUseDefaultDial: mptcpStatusDial = 0

export const mptcpEnabledDial: mptcpStatusDial = 1

export const mptcpDisabledDial: mptcpStatusDial = 2

export const mptcpUseDefaultListen: mptcpStatusListen = 0

export const mptcpEnabledListen: mptcpStatusListen = 1

export const mptcpDisabledListen: mptcpStatusListen = 2

export let multipathtcp: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("multipathtcp")

export function __goscript_set_multipathtcp(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	multipathtcp = __goscriptValue
}

export type mptcpStatusDial = number

export function mptcpStatusDial__get(m: $.VarRef<mptcpStatusDial> | null): boolean {
	switch ($.pointerValue<mptcpStatusDial>(m)) {
		case 1:
		{
			return true
			break
		}
		case 2:
		{
			return false
			break
		}
	}

	// If MPTCP is forced via GODEBUG=multipathtcp=1
	if (($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(multipathtcp)), "1")) || ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(multipathtcp)), "3"))) {
		godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(multipathtcp))

		return true
	}

	return false
}

export function mptcpStatusDial__set(m: $.VarRef<mptcpStatusDial> | null, use: boolean): void {
	if (use) {
		m!.value = $.uint(1, 8)
	} else {
		m!.value = $.uint(2, 8)
	}
}

export type mptcpStatusListen = number

export function mptcpStatusListen__get(m: $.VarRef<mptcpStatusListen> | null): boolean {
	switch ($.pointerValue<mptcpStatusListen>(m)) {
		case 1:
		{
			return true
			break
		}
		case 2:
		{
			return false
			break
		}
	}

	// If MPTCP is disabled via GODEBUG=multipathtcp=0 or only
	// enabled on dialers, but not on listeners.
	if (($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(multipathtcp)), "0")) || ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(multipathtcp)), "3"))) {
		godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(multipathtcp))

		return false
	}

	return true
}

export function mptcpStatusListen__set(m: $.VarRef<mptcpStatusListen> | null, use: boolean): void {
	if (use) {
		m!.value = $.uint(1, 8)
	} else {
		m!.value = $.uint(2, 8)
	}
}

export function minNonzeroTime(a: time.Time, b: time.Time): time.Time {
	if ($.markAsStructValue($.cloneStructValue(a)).IsZero()) {
		return $.markAsStructValue($.cloneStructValue(b))
	}
	if ($.markAsStructValue($.cloneStructValue(b)).IsZero() || $.markAsStructValue($.cloneStructValue(a)).Before($.markAsStructValue($.cloneStructValue(b)))) {
		return $.markAsStructValue($.cloneStructValue(a))
	}
	return $.markAsStructValue($.cloneStructValue(b))
}

export function partialDeadline(now: time.Time, deadline: time.Time, addrsRemaining: number): [time.Time, $.GoError] {
	if ($.markAsStructValue($.cloneStructValue(deadline)).IsZero()) {
		return [$.markAsStructValue($.cloneStructValue(deadline)), null]
	}
	let timeRemaining = $.markAsStructValue($.cloneStructValue(deadline)).Sub($.markAsStructValue($.cloneStructValue(now)))
	if (timeRemaining <= 0) {
		return [$.markAsStructValue(new time.Time()), __goscript_net.errTimeout]
	}
	// Tentatively allocate equal time to each remaining address.
	let __goscriptShadow3 = $.int64Div(timeRemaining, addrsRemaining)
	// If the time per address is too short, steal from the end of the list.
	const saneMinimum: time.Duration = 2000000000
	if (__goscriptShadow3 < 2000000000) {
		if (timeRemaining < 2000000000) {
			__goscriptShadow3 = timeRemaining
		} else {
			__goscriptShadow3 = 2000000000
		}
	}
	return [$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add(__goscriptShadow3))), null]
}

export async function parseNetwork(ctx: context.Context | null, network: string, needsProto: boolean): globalThis.Promise<[string, number, $.GoError]> {
	let afnet: string = ""
	let proto: number = 0
	let err: $.GoError = null as $.GoError
	let i = bytealg.LastIndexByteString(network, $.uint(58, 8))
	if (i < 0) {
		switch (network) {
			case "tcp":
			case "tcp4":
			case "tcp6":
			{
				break
			}
			case "udp":
			case "udp4":
			case "udp6":
			{
				break
			}
			case "ip":
			case "ip4":
			case "ip6":
			{
				if (needsProto) {
					return ["", 0, $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
				}
				break
			}
			case "unix":
			case "unixgram":
			case "unixpacket":
			{
				break
			}
			default:
			{
				return ["", 0, $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
				break
			}
		}
		return [network, 0, null]
	}
	afnet = $.sliceStringOrBytes(network, undefined, i)
	switch (afnet) {
		case "ip":
		case "ip4":
		case "ip6":
		{
			let protostr = $.sliceStringOrBytes(network, i + 1, undefined)
			let [__goscriptShadow4, __goscriptShadow5, ok] = __goscript_parse.dtoi(protostr)
			if (!ok || (__goscriptShadow5 != $.len(protostr))) {
				let __goscriptTuple9: any = await __goscript_lookup_unix.lookupProtocol(ctx, protostr)
				__goscriptShadow4 = __goscriptTuple9[0]
				err = __goscriptTuple9[1]
				if (err != null) {
					return ["", 0, err]
				}
			}
			return [afnet, __goscriptShadow4, null]
			break
		}
	}
	return ["", 0, $.namedValueInterfaceValue<$.GoError>(network, "net.UnknownNetworkError", {"Error": __goscript_net.UnknownNetworkError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "net.UnknownNetworkError" })]
}

export async function Dial(network: string, address: string): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
	let d: $.VarRef<Dialer> = $.varRef($.markAsStructValue(new Dialer()))
	return await d.value.Dial(network, address)
}

export async function DialTimeout(network: string, address: string, timeout: time.Duration): globalThis.Promise<[__goscript_net.Conn | null, $.GoError]> {
	let d = $.varRef($.markAsStructValue(new Dialer({Timeout: timeout})))
	return await d.value.Dial(network, address)
}

export async function Listen(network: string, address: string): globalThis.Promise<[__goscript_net.Listener | null, $.GoError]> {
	let lc: $.VarRef<ListenConfig> = $.varRef($.markAsStructValue(new ListenConfig()))
	return await lc.value.Listen(context.Background(), network, address)
}

export async function ListenPacket(network: string, address: string): globalThis.Promise<[__goscript_net.PacketConn | null, $.GoError]> {
	let lc: $.VarRef<ListenConfig> = $.varRef($.markAsStructValue(new ListenConfig()))
	return await lc.value.ListenPacket(context.Background(), network, address)
}
