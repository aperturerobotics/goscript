// Generated file based on tcpsock_posix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

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

import * as __goscript_hook from "./hook.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import type * as __goscript_iprawsock from "./iprawsock.gs.ts"

import type * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_ipsock_posix from "./ipsock_posix.gs.ts"

import * as __goscript_lookup from "./lookup.gs.ts"

import * as __goscript_lookup_unix from "./lookup_unix.gs.ts"

import * as __goscript_mac from "./mac.gs.ts"

import type * as __goscript_mptcpsock_stub from "./mptcpsock_stub.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_sendfile_stub from "./sendfile_stub.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_splice_stub from "./splice_stub.gs.ts"

import * as __goscript_tcpsock from "./tcpsock.gs.ts"

import type * as __goscript_tcpsock_unix from "./tcpsock_unix.gs.ts"

import type * as __goscript_udpsock from "./udpsock.gs.ts"

import type * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"

import type * as __goscript_unixsock from "./unixsock.gs.ts"

import type * as __goscript_unixsock_posix from "./unixsock_posix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
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
import "./hook.gs.ts"
import "./ip.gs.ts"
import "./ipsock.gs.ts"
import "./ipsock_posix.gs.ts"
import "./lookup.gs.ts"
import "./lookup_unix.gs.ts"
import "./mac.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sendfile_stub.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./splice_stub.gs.ts"
import "./tcpsock.gs.ts"

export async function sockaddrToTCP(sa: syscall.Sockaddr | null): globalThis.Promise<__goscript_net.Addr | null> {
	{
		const __goscriptTypeSwitchValue = sa
		switch (true) {
			case $.typeAssert<syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" }).ok:
				{
					let sa: syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null = $.typeAssert<syscall.SockaddrInet4 | $.VarRef<syscall.SockaddrInet4> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet4" }).value
					return $.interfaceValue<__goscript_net.Addr | null>(new __goscript_tcpsock.TCPAddr({IP: ($.goSlice($.pointerValue<syscall.SockaddrInet4>(sa).Addr, 0, undefined) as __goscript_ip.IP), Port: $.pointerValue<syscall.SockaddrInet4>(sa).Port}), "*net.TCPAddr")
				}
				break
			case $.typeAssert<syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" }).ok:
				{
					let sa: syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null = $.typeAssert<syscall.SockaddrInet6 | $.VarRef<syscall.SockaddrInet6> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "syscall.SockaddrInet6" }).value
					return $.interfaceValue<__goscript_net.Addr | null>((await (async () => { const __goscriptLiteralField0 = await $.pointerValue<__goscript__interface.ipv6ZoneCache>(__goscript__interface.zoneCache).name($.int($.pointerValue<syscall.SockaddrInet6>(sa).ZoneId)); return new __goscript_tcpsock.TCPAddr({IP: ($.goSlice($.pointerValue<syscall.SockaddrInet6>(sa).Addr, 0, undefined) as __goscript_ip.IP), Port: $.pointerValue<syscall.SockaddrInet6>(sa).Port, Zone: __goscriptLiteralField0}) })()), "*net.TCPAddr")
				}
				break
		}
	}
	return null
}

export function selfConnect(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, err: $.GoError): boolean {
	// If the connect failed, we clearly didn't connect to ourselves.
	if (err != null) {
		return false
	}

	// The socket constructor can return an fd with raddr nil under certain
	// unknown conditions. The errors in the calls there to Getpeername
	// are discarded, but we can't catch the problem there because those
	// calls are sometimes legally erroneous with a "socket not connected".
	// Since this code (selfConnect) is already trying to work around
	// a problem, we make sure if this happens we recognize trouble and
	// ask the DialTCP routine to try again.
	// TODO: try to understand what's really going on.
	if (($.pointerValue<__goscript_fd_fake.netFD>(fd).laddr == null) || ($.pointerValue<__goscript_fd_fake.netFD>(fd).raddr == null)) {
		return true
	}
	let l: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = $.mustTypeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>($.pointerValue<__goscript_fd_fake.netFD>(fd).laddr, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" })
	let r: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null = $.mustTypeAssert<__goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null>($.pointerValue<__goscript_fd_fake.netFD>(fd).raddr, { kind: $.TypeKind.Pointer, elemType: "net.TCPAddr" })
	return ($.pointerValue<__goscript_tcpsock.TCPAddr>(l).Port == $.pointerValue<__goscript_tcpsock.TCPAddr>(r).Port) && __goscript_ip.IP_Equal($.pointerValue<__goscript_tcpsock.TCPAddr>(l).IP, ($.pointerValue<__goscript_tcpsock.TCPAddr>(r).IP as __goscript_ip.IP))
}

export function spuriousENOTAVAIL(err: $.GoError): boolean {
	{
		let __goscriptTuple0: any = $.typeAssertTuple<__goscript_net.OpError | $.VarRef<__goscript_net.OpError> | null>(err, { kind: $.TypeKind.Pointer, elemType: "net.OpError" })
		let op: __goscript_net.OpError | $.VarRef<__goscript_net.OpError> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			err = $.pointerValue<__goscript_net.OpError>(op).Err
		}
	}
	{
		let __goscriptTuple1: any = $.typeAssertTuple<os.SyscallError | $.VarRef<os.SyscallError> | null>(err, { kind: $.TypeKind.Pointer, elemType: "os.SyscallError" })
		let sys: os.SyscallError | $.VarRef<os.SyscallError> | null = __goscriptTuple1[0]
		let ok = __goscriptTuple1[1]
		if (ok) {
			err = $.pointerValue<os.SyscallError>(sys).Err
		}
	}
	return $.comparableEqual(err, syscall.EADDRNOTAVAIL)
}
