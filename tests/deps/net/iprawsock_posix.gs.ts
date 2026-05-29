// Generated file based on iprawsock_posix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import type * as io from "@goscript/io/index.js"

import type * as netip from "@goscript/net/netip/index.js"

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

import * as __goscript_iprawsock from "./iprawsock.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_ipsock_posix from "./ipsock_posix.gs.ts"

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

import type * as __goscript_unixsock from "./unixsock.gs.ts"

import type * as __goscript_unixsock_posix from "./unixsock_posix.gs.ts"
import "@goscript/context/index.js"
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
import "./iprawsock.gs.ts"
import "./ipsock.gs.ts"
import "./ipsock_posix.gs.ts"
import "./lookup.gs.ts"
import "./lookup_unix.gs.ts"
import "./mac.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./tcpsock.gs.ts"

export async function sockaddrToIP(sa: syscall.Sockaddr | null): globalThis.Promise<__goscript_net.Addr | null> {
	{
		const __goscriptTypeSwitchValue = sa
		switch (true) {
			case $.typeAssert<syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" }).ok:
				{
					let sa: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null = $.typeAssert<syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" }).value
					return $.interfaceValue<__goscript_net.Addr | null>(new __goscript_iprawsock.IPAddr({IP: ($.goSlice($.pointerValue<syscall.SockaddrInet4>(sa).Addr, 0, undefined) as __goscript_ip.IP)}), "*net.IPAddr")
				}
				break
			case $.typeAssert<syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" }).ok:
				{
					let sa: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null = $.typeAssert<syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" }).value
					return $.interfaceValue<__goscript_net.Addr | null>((await (async () => { const __goscriptLiteralField0 = await $.pointerValue<__goscript__interface.ipv6ZoneCache>(__goscript__interface.zoneCache).name($.int($.pointerValue<syscall.SockaddrInet6>(sa).ZoneId)); return new __goscript_iprawsock.IPAddr({IP: ($.goSlice($.pointerValue<syscall.SockaddrInet6>(sa).Addr, 0, undefined) as __goscript_ip.IP), Zone: __goscriptLiteralField0}) })()), "*net.IPAddr")
				}
				break
		}
	}
	return null
}

export function stripIPv4Header(n: number, b: $.Slice<number>): number {
	if ($.len(b) < 20) {
		return n
	}
	let l = $.int(b![0] & 0x0f) << 2
	if ((20 > l) || (l > $.len(b))) {
		return n
	}
	if ($.uint(($.uintShr(b![0], 4, 8)), 8) != $.uint(4, 8)) {
		return n
	}
	$.copy(b, $.goSlice(b, l, undefined))
	return n - l
}
