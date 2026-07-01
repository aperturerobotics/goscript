// Generated file based on hook.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import type * as io from "@goscript/io/index.js"

import type * as netip from "@goscript/net/netip/index.js"

import type * as os from "@goscript/os/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import type * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import type * as __goscript_iprawsock from "./iprawsock.gs.ts"

import type * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import type * as __goscript_tcpsock from "./tcpsock.gs.ts"

import type * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.ts"

import type * as __goscript_tcpsock_unix from "./tcpsock_unix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./ip.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sockaddr_posix.gs.ts"

export let testHookDialTCP: ((ctx: context.Context | null, net: string, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null) => [__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError] | globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]>) | null = null as ((ctx: context.Context | null, net: string, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null) => [__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError] | globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]>) | null

export function __goscript_set_testHookDialTCP(__goscriptValue: ((ctx: context.Context | null, net: string, laddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null, raddr: __goscript_tcpsock.TCPAddr | $.VarRef<__goscript_tcpsock.TCPAddr> | null) => [__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError] | globalThis.Promise<[__goscript_tcpsock.TCPConn | $.VarRef<__goscript_tcpsock.TCPConn> | null, $.GoError]>) | null): void {
	testHookDialTCP = __goscriptValue
}

export var testHookLookupIP: ((ctx: context.Context | null, fn: ((_p0: context.Context | null, _p1: string, _p2: string) => [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] | globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>) | null, network: string, host: string) => [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] | globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>) | null

export function __goscript_init_testHookLookupIP(): void {
	if (((testHookLookupIP) as any) === undefined) {
		testHookLookupIP = $.functionValue(async (ctx: context.Context | null, fn: ((_p0: context.Context | null, _p1: string, _p2: string) => [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] | globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>) | null, network: string, host: string): globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]> => {
	return fn!(ctx, network, host)
}, ({ kind: $.TypeKind.Function, params: ["context.Context", ({ kind: $.TypeKind.Function, params: ["context.Context", { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Slice, elemType: "net.IPAddr" }, "error"] } as $.FunctionTypeInfo), { kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Slice, elemType: "net.IPAddr" }, "error"] } as $.FunctionTypeInfo))
	}
}

export function __goscript_get_testHookLookupIP(): ((ctx: context.Context | null, fn: ((_p0: context.Context | null, _p1: string, _p2: string) => [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] | globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>) | null, network: string, host: string) => [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] | globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>) | null {
	if (((testHookLookupIP) as any) === undefined) {
		__goscript_init_testHookLookupIP()
	}
	return testHookLookupIP
}

export function __goscript_set_testHookLookupIP(__goscriptValue: ((ctx: context.Context | null, fn: ((_p0: context.Context | null, _p1: string, _p2: string) => [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] | globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>) | null, network: string, host: string) => [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] | globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, $.GoError]>) | null): void {
	testHookLookupIP = __goscriptValue
}

export var testPreHookSetKeepAlive: ((_p0: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null) => void) | null

export function __goscript_init_testPreHookSetKeepAlive(): void {
	if (((testPreHookSetKeepAlive) as any) === undefined) {
		testPreHookSetKeepAlive = $.functionValue((_p0: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null): void => {
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "net.netFD" }], results: [] } as $.FunctionTypeInfo))
	}
}

export function __goscript_get_testPreHookSetKeepAlive(): ((_p0: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null) => void) | null {
	if (((testPreHookSetKeepAlive) as any) === undefined) {
		__goscript_init_testPreHookSetKeepAlive()
	}
	return testPreHookSetKeepAlive
}

export function __goscript_set_testPreHookSetKeepAlive(__goscriptValue: ((_p0: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null) => void) | null): void {
	testPreHookSetKeepAlive = __goscriptValue
}

export var testHookSetKeepAlive: ((_p0: __goscript_tcpsock.KeepAliveConfig) => void) | null

export function __goscript_init_testHookSetKeepAlive(): void {
	if (((testHookSetKeepAlive) as any) === undefined) {
		testHookSetKeepAlive = $.functionValue((_p0: __goscript_tcpsock.KeepAliveConfig): void => {
}, ({ kind: $.TypeKind.Function, params: ["net.KeepAliveConfig"], results: [] } as $.FunctionTypeInfo))
	}
}

export function __goscript_get_testHookSetKeepAlive(): ((_p0: __goscript_tcpsock.KeepAliveConfig) => void) | null {
	if (((testHookSetKeepAlive) as any) === undefined) {
		__goscript_init_testHookSetKeepAlive()
	}
	return testHookSetKeepAlive
}

export function __goscript_set_testHookSetKeepAlive(__goscriptValue: ((_p0: __goscript_tcpsock.KeepAliveConfig) => void) | null): void {
	testHookSetKeepAlive = __goscriptValue
}

export let testHookStepTime: (() => void) | null = $.functionValue((): void => {
}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))

export function __goscript_set_testHookStepTime(__goscriptValue: (() => void) | null): void {
	testHookStepTime = __goscriptValue
}
