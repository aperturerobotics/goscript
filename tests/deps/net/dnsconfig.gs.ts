// Generated file based on dnsconfig.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as strconv from "@goscript/internal/strconv/index.js"

import * as stringslite from "@goscript/internal/stringslite/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import type * as singleflight from "@goscript/internal/singleflight/index.js"

import type * as fs from "@goscript/io/fs/index.js"

import * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.ts"
import "@goscript/context/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/internal/strconv/index.js"
import "@goscript/internal/stringslite/index.js"
import "@goscript/io/index.js"
import "@goscript/os/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"
import "./dnsclient_unix.gs.ts"

export class dnsConfig {
	public get servers(): $.Slice<string> {
		return this._fields.servers.value
	}
	public set servers(value: $.Slice<string>) {
		this._fields.servers.value = value
	}

	public get search(): $.Slice<string> {
		return this._fields.search.value
	}
	public set search(value: $.Slice<string>) {
		this._fields.search.value = value
	}

	public get ndots(): number {
		return this._fields.ndots.value
	}
	public set ndots(value: number) {
		this._fields.ndots.value = value
	}

	public get timeout(): time.Duration {
		return this._fields.timeout.value
	}
	public set timeout(value: time.Duration) {
		this._fields.timeout.value = value
	}

	public get attempts(): number {
		return this._fields.attempts.value
	}
	public set attempts(value: number) {
		this._fields.attempts.value = value
	}

	public get rotate(): boolean {
		return this._fields.rotate.value
	}
	public set rotate(value: boolean) {
		this._fields.rotate.value = value
	}

	public get unknownOpt(): boolean {
		return this._fields.unknownOpt.value
	}
	public set unknownOpt(value: boolean) {
		this._fields.unknownOpt.value = value
	}

	public get lookup(): $.Slice<string> {
		return this._fields.lookup.value
	}
	public set lookup(value: $.Slice<string>) {
		this._fields.lookup.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get mtime(): time.Time {
		return this._fields.mtime.value
	}
	public set mtime(value: time.Time) {
		this._fields.mtime.value = value
	}

	public get soffset(): number {
		return this._fields.soffset.value
	}
	public set soffset(value: number) {
		this._fields.soffset.value = value
	}

	public get singleRequest(): boolean {
		return this._fields.singleRequest.value
	}
	public set singleRequest(value: boolean) {
		this._fields.singleRequest.value = value
	}

	public get useTCP(): boolean {
		return this._fields.useTCP.value
	}
	public set useTCP(value: boolean) {
		this._fields.useTCP.value = value
	}

	public get trustAD(): boolean {
		return this._fields.trustAD.value
	}
	public set trustAD(value: boolean) {
		this._fields.trustAD.value = value
	}

	public get noReload(): boolean {
		return this._fields.noReload.value
	}
	public set noReload(value: boolean) {
		this._fields.noReload.value = value
	}

	public _fields: {
		servers: $.VarRef<$.Slice<string>>
		search: $.VarRef<$.Slice<string>>
		ndots: $.VarRef<number>
		timeout: $.VarRef<time.Duration>
		attempts: $.VarRef<number>
		rotate: $.VarRef<boolean>
		unknownOpt: $.VarRef<boolean>
		lookup: $.VarRef<$.Slice<string>>
		err: $.VarRef<$.GoError>
		mtime: $.VarRef<time.Time>
		soffset: $.VarRef<number>
		singleRequest: $.VarRef<boolean>
		useTCP: $.VarRef<boolean>
		trustAD: $.VarRef<boolean>
		noReload: $.VarRef<boolean>
	}

	constructor(init?: Partial<{servers?: $.Slice<string>, search?: $.Slice<string>, ndots?: number, timeout?: time.Duration, attempts?: number, rotate?: boolean, unknownOpt?: boolean, lookup?: $.Slice<string>, err?: $.GoError, mtime?: time.Time, soffset?: number, singleRequest?: boolean, useTCP?: boolean, trustAD?: boolean, noReload?: boolean}>) {
		this._fields = {
			servers: $.varRef(init?.servers ?? null),
			search: $.varRef(init?.search ?? null),
			ndots: $.varRef(init?.ndots ?? 0),
			timeout: $.varRef(init?.timeout ?? 0),
			attempts: $.varRef(init?.attempts ?? 0),
			rotate: $.varRef(init?.rotate ?? false),
			unknownOpt: $.varRef(init?.unknownOpt ?? false),
			lookup: $.varRef(init?.lookup ?? null),
			err: $.varRef(init?.err ?? null),
			mtime: $.varRef(init?.mtime ? $.markAsStructValue($.cloneStructValue(init.mtime)) : $.markAsStructValue(new time.Time())),
			soffset: $.varRef(init?.soffset ?? 0),
			singleRequest: $.varRef(init?.singleRequest ?? false),
			useTCP: $.varRef(init?.useTCP ?? false),
			trustAD: $.varRef(init?.trustAD ?? false),
			noReload: $.varRef(init?.noReload ?? false)
		}
	}

	public clone(): dnsConfig {
		const cloned = new dnsConfig()
		cloned._fields = {
			servers: $.varRef(this._fields.servers.value),
			search: $.varRef(this._fields.search.value),
			ndots: $.varRef(this._fields.ndots.value),
			timeout: $.varRef(this._fields.timeout.value),
			attempts: $.varRef(this._fields.attempts.value),
			rotate: $.varRef(this._fields.rotate.value),
			unknownOpt: $.varRef(this._fields.unknownOpt.value),
			lookup: $.varRef(this._fields.lookup.value),
			err: $.varRef(this._fields.err.value),
			mtime: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mtime.value))),
			soffset: $.varRef(this._fields.soffset.value),
			singleRequest: $.varRef(this._fields.singleRequest.value),
			useTCP: $.varRef(this._fields.useTCP.value),
			trustAD: $.varRef(this._fields.trustAD.value),
			noReload: $.varRef(this._fields.noReload.value)
		}
		return $.markAsStructValue(cloned)
	}

	public nameList(name: string): $.Slice<string> {
		const conf: dnsConfig | $.VarRef<dnsConfig> | null = this

		let l = $.len(name)
		let rooted = (l > 0) && ($.uint($.indexStringOrBytes(name, l - 1), 8) == $.uint(46, 8))
		if ((l > 254) || ((l == 254) && !rooted)) {
			return null
		}

		if (rooted) {
			if (__goscript_dnsclient_unix.avoidDNS(name)) {
				return null
			}
			return $.arrayToSlice<string>([name])
		}

		let hasNdots = bytealg.CountString(name, $.uint(46, 8)) >= $.pointerValue<dnsConfig>(conf).ndots
		name = name + (".")
		l++

		let names: $.Slice<string> = $.makeSlice<string>(0, 1 + $.len($.pointerValue<dnsConfig>(conf).search), "string")

		if (hasNdots && !__goscript_dnsclient_unix.avoidDNS(name)) {
			names = $.append(names, name)
		}

		for (let __goscriptRangeTarget0 = $.pointerValue<dnsConfig>(conf).search, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let suffix = __goscriptRangeTarget0![__rangeIndex]
			let fqdn = name + suffix
			if (!__goscript_dnsclient_unix.avoidDNS(fqdn) && ($.len(fqdn) <= 254)) {
				names = $.append(names, fqdn)
			}
		}

		if (!hasNdots && !__goscript_dnsclient_unix.avoidDNS(name)) {
			names = $.append(names, name)
		}
		return names
	}

	public serverOffset(): number {
		const c: dnsConfig | $.VarRef<dnsConfig> | null = this
		if ($.pointerValue<dnsConfig>(c).rotate) {
			return $.uint(atomic.AddUint32($.pointerValue<dnsConfig>(c)._fields.soffset, $.uint(1, 32)) - 1, 32)
		}
		return $.uint(0, 32)
	}

	static __typeInfo = $.registerStructType(
		"net.dnsConfig",
		() => new dnsConfig(),
		[{ name: "nameList", args: [{ name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }] }, { name: "serverOffset", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }],
		dnsConfig,
		[{ name: "servers", key: "servers", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "search", key: "search", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "net", index: [1], offset: 24, exported: false }, { name: "ndots", key: "ndots", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "net", index: [2], offset: 48, exported: false }, { name: "timeout", key: "timeout", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, pkgPath: "net", index: [3], offset: 56, exported: false }, { name: "attempts", key: "attempts", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "net", index: [4], offset: 64, exported: false }, { name: "rotate", key: "rotate", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [5], offset: 72, exported: false }, { name: "unknownOpt", key: "unknownOpt", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [6], offset: 73, exported: false }, { name: "lookup", key: "lookup", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "net", index: [7], offset: 80, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "net", index: [8], offset: 104, exported: false }, { name: "mtime", key: "mtime", type: "time.Time", pkgPath: "net", index: [9], offset: 120, exported: false }, { name: "soffset", key: "soffset", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "net", index: [10], offset: 144, exported: false }, { name: "singleRequest", key: "singleRequest", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [11], offset: 148, exported: false }, { name: "useTCP", key: "useTCP", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [12], offset: 149, exported: false }, { name: "trustAD", key: "trustAD", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [13], offset: 150, exported: false }, { name: "noReload", key: "noReload", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [14], offset: 151, exported: false }]
	)
}

export var defaultNS: $.Slice<string>

export function __goscript_init_defaultNS(): void {
	if (((defaultNS) as any) === undefined) {
		defaultNS = $.arrayToSlice<string>(["127.0.0.1:53", "[::1]:53"])
	}
}

export function __goscript_get_defaultNS(): $.Slice<string> {
	if (((defaultNS) as any) === undefined) {
		__goscript_init_defaultNS()
	}
	return defaultNS
}

export function __goscript_set_defaultNS(__goscriptValue: $.Slice<string>): void {
	defaultNS = __goscriptValue
}

export var getHostname: (() => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null

export function __goscript_init_getHostname(): void {
	if (((getHostname) as any) === undefined) {
		getHostname = os.Hostname
	}
}

export function __goscript_get_getHostname(): (() => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null {
	if (((getHostname) as any) === undefined) {
		__goscript_init_getHostname()
	}
	return getHostname
}

export function __goscript_set_getHostname(__goscriptValue: (() => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null): void {
	getHostname = __goscriptValue
}
