// Generated file based on hosts.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as os from "@goscript/os/index.js"

import * as __goscript_dnsclient from "./dnsclient.gs.ts"

import * as __goscript_hook_unix from "./hook_unix.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/io/fs/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "@goscript/os/index.js"
import "./dnsclient.gs.ts"
import "./hook_unix.gs.ts"
import "./parse.gs.ts"

export class byName {
	public get addrs(): $.Slice<string> {
		return this._fields.addrs.value
	}
	public set addrs(value: $.Slice<string>) {
		this._fields.addrs.value = value
	}

	public get canonicalName(): string {
		return this._fields.canonicalName.value
	}
	public set canonicalName(value: string) {
		this._fields.canonicalName.value = value
	}

	public _fields: {
		addrs: $.VarRef<$.Slice<string>>
		canonicalName: $.VarRef<string>
	}

	constructor(init?: Partial<{addrs?: $.Slice<string>, canonicalName?: string}>) {
		this._fields = {
			addrs: $.varRef(init?.addrs ?? (null as unknown as $.Slice<string>)),
			canonicalName: $.varRef(init?.canonicalName ?? ("" as unknown as string))
		}
	}

	public clone(): byName {
		const cloned = new byName()
		cloned._fields = {
			addrs: $.varRef(this._fields.addrs.value),
			canonicalName: $.varRef(this._fields.canonicalName.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.byName",
		() => new byName(),
		[],
		byName,
		[{ name: "addrs", key: "addrs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "canonicalName", key: "canonicalName", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [1], offset: 24, exported: false }]
	)
}

export const cacheMaxAge: time.Duration = 5000000000

export function parseLiteralIP(addr: string): string {
	let [ip, err] = netip.ParseAddr(addr)
	if (err != null) {
		return ""
	}
	return $.markAsStructValue($.cloneStructValue(ip)).String()
}

export let hosts: $.VarRef<{"Mutex": sync.Mutex, "byName": Map<string, byName> | null, "byAddr": Map<string, $.Slice<string>> | null, "expire": time.Time, "path": string, "mtime": time.Time, "size": number}> = $.varRef({"Mutex": $.markAsStructValue(new sync.Mutex()), "byName": null, "byAddr": null, "expire": $.markAsStructValue(new time.Time()), "path": "", "mtime": $.markAsStructValue(new time.Time()), "size": 0})

export function __goscript_set_hosts(__goscriptValue: {"Mutex": sync.Mutex, "byName": Map<string, byName> | null, "byAddr": Map<string, $.Slice<string>> | null, "expire": time.Time, "path": string, "mtime": time.Time, "size": number}): void {
	hosts.value = __goscriptValue
}

export async function readHosts(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let now = $.markAsStructValue($.cloneStructValue(time.Now()))
	let hp = __goscript_hook_unix.hostsFilePath

	if (($.markAsStructValue($.cloneStructValue(now)).Before($.markAsStructValue($.cloneStructValue(hosts.value.expire))) && ($.stringEqual(hosts.value.path, hp))) && ($.len(hosts.value.byName) > 0)) {
		return
	}
	let __goscriptTuple0: any = await __goscript_parse.stat(hp)
	let mtime = __goscriptTuple0[0]
	let size = $.int(__goscriptTuple0[1])
	let err = __goscriptTuple0[2]
	if ((((err == null) && ($.stringEqual(hosts.value.path, hp))) && $.markAsStructValue($.cloneStructValue(hosts.value.mtime)).Equal($.markAsStructValue($.cloneStructValue(mtime)))) && ($.int(hosts.value.size) == $.int(size))) {
		hosts.value.expire = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add(5000000000)))
		return
	}

	let hs: Map<string, byName> | null = $.makeMap<string, byName>()
	let _is: Map<string, $.Slice<string>> | null = $.makeMap<string, $.Slice<string>>()

	let __goscriptTuple1: any = __goscript_parse.open(hp)
	let __goscriptShadow0: __goscript_parse.file | $.VarRef<__goscript_parse.file> | null = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		if (!errors.Is($.pointerValueOrNil(err)!, $.pointerValueOrNil(fs.ErrNotExist)!) && !errors.Is($.pointerValueOrNil(err)!, $.pointerValueOrNil(fs.ErrPermission)!)) {
			return
		}
	}

	if (__goscriptShadow0 != null) {
		__defer.defer(() => { __goscript_parse.file.prototype.close.call(__goscriptShadow0) })
		for (let [line, ok] = await __goscript_parse.file.prototype.readLine.call(__goscriptShadow0); ok; [line, ok] = await __goscript_parse.file.prototype.readLine.call(__goscriptShadow0)) {
			{
				let i = bytealg.IndexByteString(line, $.uint(35, 8))
				if (i >= 0) {
					// Discard comments.
					line = $.sliceStringOrBytes(line, 0, i)
				}
			}
			let f: $.Slice<string> = __goscript_parse.getFields(line)
			if ($.len(f) < 2) {
				continue
			}
			let addr = parseLiteralIP(f![0])
			if ($.stringEqual(addr, "")) {
				continue
			}

			let canonical: string = ""
			for (let i = 1; i < $.len(f); i++) {
				let name = __goscript_dnsclient.absDomainName(f![i])
				let h: $.Slice<number> = $.stringToBytes(f![i])
				__goscript_parse.lowerASCIIBytes(h)
				let key = __goscript_dnsclient.absDomainName($.bytesToString(h))

				if (i == 1) {
					canonical = key
				}

				$.mapSet(_is, addr, $.append($.mapGet(_is, addr, null)[0], name))

				{
					let [v, __goscriptShadow1] = $.mapGet(hs, key, $.markAsStructValue(new byName()))
					if (__goscriptShadow1) {
						$.mapSet(hs, key, $.markAsStructValue(new byName({addrs: $.append(v.addrs, addr), canonicalName: v.canonicalName})))
						continue
					}
				}

				$.mapSet(hs, key, $.markAsStructValue(new byName({addrs: $.arrayToSlice<string>([addr]), canonicalName: canonical})))
			}
		}
	}
	// Update the data cache.
	hosts.value.expire = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add(5000000000)))
	hosts.value.path = hp
	hosts.value.byName = hs
	hosts.value.byAddr = _is
	hosts.value.mtime = $.markAsStructValue($.cloneStructValue(mtime))
	hosts.value.size = $.int(size)
}

export async function lookupStaticHost(host: string): globalThis.Promise<[$.Slice<string>, string]> {
	using __defer = new $.DisposableStack()
	await hosts.value.Mutex.Lock()
	__defer.defer(() => { hosts.value.Mutex.Unlock() })
	await readHosts()
	if ($.len(hosts.value.byName) != 0) {
		if (__goscript_parse.hasUpperCase(host)) {
			let lowerHost: $.Slice<number> = $.stringToBytes(host)
			__goscript_parse.lowerASCIIBytes(lowerHost)
			host = $.bytesToString(lowerHost)
		}
		{
			let __goscriptTuple2: any = $.mapGet(hosts.value.byName, __goscript_dnsclient.absDomainName(host), $.markAsStructValue(new byName()))
			let __goscriptShadow2 = __goscriptTuple2[0]
			let ok = __goscriptTuple2[1]
			if (ok) {
				let ipsCp: $.Slice<string> = $.makeSlice<string>($.len(__goscriptShadow2.addrs), undefined, "string")
				$.copy(ipsCp, __goscriptShadow2.addrs)
				return [ipsCp, __goscriptShadow2.canonicalName]
			}
		}
	}
	return [null, ""]
}

export async function lookupStaticAddr(addr: string): globalThis.Promise<$.Slice<string>> {
	using __defer = new $.DisposableStack()
	await hosts.value.Mutex.Lock()
	__defer.defer(() => { hosts.value.Mutex.Unlock() })
	await readHosts()
	addr = parseLiteralIP(addr)
	if ($.stringEqual(addr, "")) {
		return null
	}
	if ($.len(hosts.value.byAddr) != 0) {
		let __goscriptShadow3 = hosts.value
		{
			let __goscriptTuple3: any = $.mapGet(__goscriptShadow3.byAddr, addr, null)
			let __goscriptShadow4: $.Slice<string> = __goscriptTuple3[0]
			let ok = __goscriptTuple3[1]
			if (ok) {
				let hostsCp: $.Slice<string> = $.makeSlice<string>($.len(__goscriptShadow4), undefined, "string")
				$.copy(hostsCp, __goscriptShadow4)
				return hostsCp
			}
		}
	}
	return null
}
