// Generated file based on cgo_stub.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import type * as syscall from "@goscript/syscall/index.js"

import * as __goscript_ip from "./ip.gs.ts"

import type * as __goscript_iprawsock from "./iprawsock.gs.ts"

import type * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import type * as __goscript_net from "./net.gs.ts"

import type * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"
import "@goscript/context/index.js"
import "./ip.gs.ts"

export const cgoAvailable: boolean = false

export function cgoLookupHost(ctx: context.Context | null, name: string): [$.Slice<string>, $.GoError] {
	let addrs: $.Slice<string> = null as $.Slice<string>
	let err: $.GoError = null as $.GoError
	$.panic("cgo stub: cgo not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function cgoLookupPort(ctx: context.Context | null, network: string, service: string): [number, $.GoError] {
	let port: number = 0
	let err: $.GoError = null as $.GoError
	$.panic("cgo stub: cgo not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function cgoLookupIP(ctx: context.Context | null, network: string, name: string): [$.Slice<__goscript_iprawsock.IPAddr>, $.GoError] {
	let addrs: $.Slice<__goscript_iprawsock.IPAddr> = null as $.Slice<__goscript_iprawsock.IPAddr>
	let err: $.GoError = null as $.GoError
	$.panic("cgo stub: cgo not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function cgoLookupCNAME(ctx: context.Context | null, name: string): [string, $.GoError] {
	let cname: string = ""
	let err: $.GoError = null as $.GoError
	$.panic("cgo stub: cgo not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function cgoLookupPTR(ctx: context.Context | null, addr: string): [$.Slice<string>, $.GoError] {
	let ptrs: $.Slice<string> = null as $.Slice<string>
	let err: $.GoError = null as $.GoError
	$.panic("cgo stub: cgo not available")
	throw new globalThis.Error("goscript: unreachable return")
}
