// Generated file based on lookup_unix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as sync from "@goscript/sync/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import type * as netip from "@goscript/net/netip/index.js"

import * as os from "@goscript/os/index.js"

import type * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import type * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import * as __goscript_cgo_stub from "./cgo_stub.gs.ts"

import * as __goscript_conf from "./conf.gs.ts"

import type * as __goscript_dial from "./dial.gs.ts"

import type * as __goscript_dnsclient from "./dnsclient.gs.ts"

import * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.ts"

import type * as __goscript_dnsconfig from "./dnsconfig.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import type * as __goscript_iprawsock from "./iprawsock.gs.ts"

import type * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import type * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_lookup from "./lookup.gs.ts"

import type * as __goscript_net from "./net.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"

import * as __goscript_port_unix from "./port_unix.gs.ts"

import type * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/sync/index.js"
import "@goscript/internal/singleflight/index.js"
import "@goscript/os/index.js"
import "@goscript/time/index.js"
import "./cgo_stub.gs.ts"
import "./conf.gs.ts"
import "./dnsclient_unix.gs.ts"
import "./ip.gs.ts"
import "./lookup.gs.ts"
import "./parse.gs.ts"
import "./port_unix.gs.ts"

export var readProtocolsOnce: (() => void) | null

export async function __goscript_init_readProtocolsOnce(): globalThis.Promise<void> {
	if (((readProtocolsOnce) as any) === undefined) {
		readProtocolsOnce = sync.OnceFunc($.functionValue(async (): globalThis.Promise<void> => {
	using __defer = new $.DisposableStack()
	let __goscriptTuple0: any = __goscript_parse.open("/etc/protocols")
	let __goscriptShadow0: __goscript_parse.file | $.VarRef<__goscript_parse.file> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return
	}
	__defer.defer(() => { __goscript_parse.file.prototype.close.call(__goscriptShadow0) })

	for (let [line, ok] = await __goscript_parse.file.prototype.readLine.call(__goscriptShadow0); ok; [line, ok] = await __goscript_parse.file.prototype.readLine.call(__goscriptShadow0)) {
		// tcp    6   TCP    # transmission control protocol
		{
			let i = bytealg.IndexByteString(line, $.uint(35, 8))
			if (i >= 0) {
				line = $.sliceStringOrBytes(line, 0, i)
			}
		}
		let f: $.Slice<string> = __goscript_parse.getFields(line)
		if ($.len(f) < 2) {
			continue
		}
		{
			let [proto, , __goscriptShadow1] = __goscript_parse.dtoi(f![1])
			if (__goscriptShadow1) {
				{
					let [, __goscriptShadow2] = $.mapGet(__goscript_lookup.__goscript_get_protocols(), f![0], 0)
					if (!__goscriptShadow2) {
						$.mapSet(__goscript_lookup.__goscript_get_protocols(), f![0], proto)
					}
				}
				for (let __goscriptRangeTarget0 = $.goSlice(f, 2, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
					let alias = __goscriptRangeTarget0![__rangeIndex]
					{
						let [, __goscriptShadow3] = $.mapGet(__goscript_lookup.__goscript_get_protocols(), alias, 0)
						if (!__goscriptShadow3) {
							$.mapSet(__goscript_lookup.__goscript_get_protocols(), alias, proto)
						}
					}
				}
			}
		}
	}
}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}
}

export function __goscript_get_readProtocolsOnce(): (() => void) | null {
	if (((readProtocolsOnce) as any) === undefined) {
		throw new Error("goscript package variable readProtocolsOnce read before initialization")
	}
	return readProtocolsOnce
}

export function __goscript_set_readProtocolsOnce(__goscriptValue: (() => void) | null): void {
	readProtocolsOnce = __goscriptValue
}

export async function lookupProtocol(_p0: context.Context | null, name: string): globalThis.Promise<[number, $.GoError]> {
	await __goscript_get_readProtocolsOnce()!()
	return __goscript_lookup.lookupProtocolMap(name)
}

await __goscript_init_readProtocolsOnce()
