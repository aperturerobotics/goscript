// Generated file based on dnsconfig_unix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as stringslite from "@goscript/internal/stringslite/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as time from "@goscript/time/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as os from "@goscript/os/index.js"

import * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.ts"

import * as __goscript_dnsconfig from "./dnsconfig.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"
import "@goscript/internal/bytealg/index.js"
import "@goscript/internal/stringslite/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/time/index.js"
import "@goscript/io/fs/index.js"
import "@goscript/os/index.js"
import "./dnsclient_unix.gs.ts"
import "./dnsconfig.gs.ts"
import "./ipsock.gs.ts"
import "./parse.gs.ts"

export async function dnsReadConfig(filename: string): globalThis.Promise<__goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null> {
	using __defer = new $.DisposableStack()
	let __goscriptShadow0: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null = new __goscript_dnsconfig.dnsConfig({ndots: 1, timeout: $.int64Mul(5, time.Second), attempts: 2})
	let __goscriptTuple0: any = __goscript_parse.open(filename)
	let __goscriptShadow1: __goscript_parse.file | $.VarRef<__goscript_parse.file> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).servers = __goscript_dnsconfig.__goscript_get_defaultNS()
		$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).search = await dnsDefaultSearch()
		$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).err = err
		return __goscriptShadow0
	}
	__defer.defer(() => { __goscript_parse.file.prototype.close.call(__goscriptShadow1) })
	{
		let [fi, __goscriptShadow2] = os.File.prototype.Stat.call($.pointerValue<os.File>($.pointerValue<__goscript_parse.file>(__goscriptShadow1).file))
		if (__goscriptShadow2 == null) {
			$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).mtime = $.markAsStructValue($.cloneStructValue(await $.pointerValue<Exclude<fs.FileInfo, null>>(fi).ModTime()))
		} else {
			$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).servers = __goscript_dnsconfig.__goscript_get_defaultNS()
			$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).search = await dnsDefaultSearch()
			$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).err = __goscriptShadow2
			return __goscriptShadow0
		}
	}
	for (let [line, ok] = await __goscript_parse.file.prototype.readLine.call(__goscriptShadow1); ok; [line, ok] = await __goscript_parse.file.prototype.readLine.call(__goscriptShadow1)) {
		if (($.len(line) > 0) && (($.uint($.indexStringOrBytes(line, 0), 8) == $.uint(59, 8)) || ($.uint($.indexStringOrBytes(line, 0), 8) == $.uint(35, 8)))) {
			// comment.
			continue
		}
		let f: $.Slice<string> = __goscript_parse.getFields(line)
		if ($.len(f) < 1) {
			continue
		}
		switch (f![0]) {
			case "nameserver":
			{
				if (($.len(f) > 1) && ($.len($.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).servers) < 3)) {
					// One more check: make sure server name is
					// just an IP address. Otherwise we need DNS
					// to look it up.
					{
						let [, __goscriptShadow3] = netip.ParseAddr(f![1])
						if (__goscriptShadow3 == null) {
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).servers = $.append($.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).servers, __goscript_ipsock.JoinHostPort(f![1], "53"))
						}
					}
				}
				break
			}
			case "domain":
			{
				if ($.len(f) > 1) {
					$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).search = $.arrayToSlice<string>([ensureRooted(f![1])])
				}
				break
			}
			case "search":
			{
				$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).search = $.makeSlice<string>(0, $.len(f) - 1, "string")
				for (let i = 1; i < $.len(f); i++) {
					let name = ensureRooted(f![i])
					if ($.stringEqual(name, ".")) {
						continue
					}
					$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).search = $.append($.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).search, name)
				}
				break
			}
			case "options":
			{
				for (let __goscriptRangeTarget0 = $.goSlice(f, 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
					let s = __goscriptRangeTarget0![__rangeIndex]
					switch (true) {
						case stringslite.HasPrefix(s, "ndots:"):
						{
							let [n, , ] = __goscript_parse.dtoi($.sliceStringOrBytes(s, 6, undefined))
							if (n < 0) {
								n = 0
							} else {
								if (n > 15) {
									n = 15
								}
							}
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).ndots = n
							break
						}
						case stringslite.HasPrefix(s, "timeout:"):
						{
							let [n, , ] = __goscript_parse.dtoi($.sliceStringOrBytes(s, 8, undefined))
							if (n < 1) {
								n = 1
							}
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).timeout = $.int64Mul(n, time.Second)
							break
						}
						case stringslite.HasPrefix(s, "attempts:"):
						{
							let [n, , ] = __goscript_parse.dtoi($.sliceStringOrBytes(s, 9, undefined))
							if (n < 1) {
								n = 1
							}
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).attempts = n
							break
						}
						case $.stringEqual(s, "rotate"):
						{
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).rotate = true
							break
						}
						case ($.stringEqual(s, "single-request")) || ($.stringEqual(s, "single-request-reopen")):
						{
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).singleRequest = true
							break
						}
						case (($.stringEqual(s, "use-vc")) || ($.stringEqual(s, "usevc"))) || ($.stringEqual(s, "tcp")):
						{
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).useTCP = true
							break
						}
						case $.stringEqual(s, "trust-ad"):
						{
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).trustAD = true
							break
						}
						case $.stringEqual(s, "edns0"):
						{
							break
						}
						case $.stringEqual(s, "no-reload"):
						{
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).noReload = true
							break
						}
						default:
						{
							$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).unknownOpt = true
							break
						}
					}
				}
				break
			}
			case "lookup":
			{
				$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).lookup = $.goSlice(f, 1, undefined)
				break
			}
			default:
			{
				$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).unknownOpt = true
				break
			}
		}
	}
	if ($.len($.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).servers) == 0) {
		$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).servers = __goscript_dnsconfig.__goscript_get_defaultNS()
	}
	if ($.len($.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).search) == 0) {
		$.pointerValue<__goscript_dnsconfig.dnsConfig>(__goscriptShadow0).search = await dnsDefaultSearch()
	}
	return __goscriptShadow0
}

export async function dnsDefaultSearch(): globalThis.Promise<$.Slice<string>> {
	let [hn, err] = await __goscript_dnsconfig.__goscript_get_getHostname()!()
	if (err != null) {
		// best effort
		return null
	}
	{
		let i = bytealg.IndexByteString(hn, $.uint(46, 8))
		if ((i >= 0) && (i < ($.len(hn) - 1))) {
			return $.arrayToSlice<string>([ensureRooted($.sliceStringOrBytes(hn, i + 1, undefined))])
		}
	}
	return null
}

export function ensureRooted(s: string): string {
	if (($.len(s) > 0) && ($.uint($.indexStringOrBytes(s, $.len(s) - 1), 8) == $.uint(46, 8))) {
		return s
	}
	return s + "."
}
