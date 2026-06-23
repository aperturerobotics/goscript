// Generated file based on port_unix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as sync from "@goscript/sync/index.js"

import * as os from "@goscript/os/index.js"

import type * as time from "@goscript/time/index.js"

import * as __goscript_lookup from "./lookup.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"
import "@goscript/internal/bytealg/index.js"
import "@goscript/sync/index.js"
import "@goscript/os/index.js"
import "./lookup.gs.ts"
import "./parse.gs.ts"

export let onceReadServices: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_onceReadServices(__goscriptValue: sync.Once): void {
	onceReadServices.value = __goscriptValue
}

export async function readServices(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let __goscriptTuple0: any = __goscript_parse.open("/etc/services")
	let __goscriptShadow0: __goscript_parse.file | $.VarRef<__goscript_parse.file> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return
	}
	__defer.defer(() => { __goscript_parse.file.prototype.close.call(__goscriptShadow0) })

	for (let [line, ok] = await __goscript_parse.file.prototype.readLine.call(__goscriptShadow0); ok; [line, ok] = await __goscript_parse.file.prototype.readLine.call(__goscriptShadow0)) {
		// "http 80/tcp www www-http # World Wide Web HTTP"
		{
			let i = bytealg.IndexByteString(line, $.uint(35, 8))
			if (i >= 0) {
				line = $.sliceStringOrBytes(line, undefined, i)
			}
		}
		let f: $.Slice<string> = __goscript_parse.getFields(line)
		if ($.len(f) < 2) {
			continue
		}
		let portnet = $.arrayIndex(f!, 1)
		let [port, j, __goscriptShadow1] = __goscript_parse.dtoi(portnet)
		if (((!__goscriptShadow1 || (port <= 0)) || (j >= $.len(portnet))) || ($.uint($.indexStringOrBytes(portnet, j), 8) != $.uint(47, 8))) {
			continue
		}
		let netw = $.sliceStringOrBytes(portnet, j + 1, undefined)
		let __goscriptTuple1: any = $.mapGet<string, globalThis.Map<string, number> | null, globalThis.Map<string, number> | null>(__goscript_lookup.services, netw, null)
		let m: globalThis.Map<string, number> | null = __goscriptTuple1[0]
		let ok1 = __goscriptTuple1[1]
		if (!ok1) {
			m = $.makeMap<string, number>()
			$.mapSet(__goscript_lookup.services, netw, m)
		}
		for (let i = 0; i < $.len(f); i++) {
			if (i != 1) {
				$.mapSet(m, $.arrayIndex(f!, i), port)
			}
		}
	}
}

export async function goLookupPort(network: string, service: string): globalThis.Promise<[number, $.GoError]> {
	let port: number = 0
	let err: $.GoError = null as $.GoError
	await onceReadServices.value.Do(readServices)
	return await __goscript_lookup.lookupPortMap(network, service)
}
