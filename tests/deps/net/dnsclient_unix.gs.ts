// Generated file based on dnsclient_unix.go
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

import * as singleflight from "@goscript/internal/singleflight/index.js"

import * as fs from "@goscript/io/fs/index.js"

import type * as netip from "@goscript/net/netip/index.js"

import type * as syscall from "@goscript/syscall/index.js"

import * as __goscript_addrselect from "./addrselect.gs.ts"

import type * as __goscript_dial from "./dial.gs.ts"

import * as __goscript_dnsclient from "./dnsclient.gs.ts"

import * as __goscript_dnsconfig from "./dnsconfig.gs.ts"

import * as __goscript_dnsconfig_unix from "./dnsconfig_unix.gs.ts"

import * as __goscript_hosts from "./hosts.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_iprawsock from "./iprawsock.gs.ts"

import * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_ipsock from "./ipsock.gs.ts"

import * as __goscript_lookup from "./lookup.gs.ts"

import type * as __goscript_lookup_unix from "./lookup_unix.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"

import type * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"
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
import "@goscript/internal/singleflight/index.js"
import "@goscript/io/fs/index.js"
import "./addrselect.gs.ts"
import "./dnsclient.gs.ts"
import "./dnsconfig.gs.ts"
import "./dnsconfig_unix.gs.ts"
import "./hosts.gs.ts"
import "./ip.gs.ts"
import "./iprawsock.gs.ts"
import "./iprawsock_posix.gs.ts"
import "./ipsock.gs.ts"
import "./lookup.gs.ts"
import "./net.gs.ts"
import "./parse.gs.ts"

export class resolverConfig {
	public get initOnce(): sync.Once {
		return this._fields.initOnce.value
	}
	public set initOnce(value: sync.Once) {
		this._fields.initOnce.value = value
	}

	// ch is used as a semaphore that only allows one lookup at a
	// time to recheck resolv.conf.
	public get ch(): $.Channel<{}> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<{}> | null) {
		this._fields.ch.value = value
	}

	public get lastChecked(): time.Time {
		return this._fields.lastChecked.value
	}
	public set lastChecked(value: time.Time) {
		this._fields.lastChecked.value = value
	}

	public get dnsConfig(): atomic.Pointer<__goscript_dnsconfig.dnsConfig> {
		return this._fields.dnsConfig.value
	}
	public set dnsConfig(value: atomic.Pointer<__goscript_dnsconfig.dnsConfig>) {
		this._fields.dnsConfig.value = value
	}

	public _fields: {
		initOnce: $.VarRef<sync.Once>
		ch: $.VarRef<$.Channel<{}> | null>
		lastChecked: $.VarRef<time.Time>
		dnsConfig: $.VarRef<atomic.Pointer<__goscript_dnsconfig.dnsConfig>>
	}

	constructor(init?: Partial<{initOnce?: sync.Once, ch?: $.Channel<{}> | null, lastChecked?: time.Time, dnsConfig?: atomic.Pointer<__goscript_dnsconfig.dnsConfig>}>) {
		this._fields = {
			initOnce: $.varRef(init?.initOnce ? $.markAsStructValue($.cloneStructValue(init.initOnce)) : $.markAsStructValue(new sync.Once())),
			ch: $.varRef(init?.ch ?? (null as unknown as $.Channel<{}> | null)),
			lastChecked: $.varRef(init?.lastChecked ? $.markAsStructValue($.cloneStructValue(init.lastChecked)) : $.markAsStructValue(new time.Time())),
			dnsConfig: $.varRef(init?.dnsConfig ? $.markAsStructValue($.cloneStructValue(init.dnsConfig)) : $.markAsStructValue(new atomic.Pointer<__goscript_dnsconfig.dnsConfig>()))
		}
	}

	public clone(): resolverConfig {
		const cloned = new resolverConfig()
		cloned._fields = {
			initOnce: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.initOnce.value))),
			ch: $.varRef(this._fields.ch.value),
			lastChecked: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.lastChecked.value))),
			dnsConfig: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.dnsConfig.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async init(): globalThis.Promise<void> {
		let conf: resolverConfig | $.VarRef<resolverConfig> | null = this
		// Set dnsConfig and lastChecked so we don't parse
		// resolv.conf twice the first time.
		$.pointerValue<resolverConfig>(conf).dnsConfig.Store(await __goscript_dnsconfig_unix.dnsReadConfig("/etc/resolv.conf"))
		$.pointerValue<resolverConfig>(conf).lastChecked = $.markAsStructValue($.cloneStructValue(time.Now()))

		// Prepare ch so that only one update of resolverConfig may
		// run at once.
		$.pointerValue<resolverConfig>(conf).ch = $.makeChannel<{}>(1, {}, "both")
	}

	public async releaseSema(): globalThis.Promise<void> {
		const conf: resolverConfig | $.VarRef<resolverConfig> | null = this
		await $.chanRecv($.pointerValue<resolverConfig>(conf).ch)
	}

	public async tryAcquireSema(): globalThis.Promise<boolean> {
		const conf: resolverConfig | $.VarRef<resolverConfig> | null = this
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, boolean>([
			{
				id: 0,
				isSend: true,
				channel: $.pointerValue<resolverConfig>(conf).ch,
				value: {},
				onSelected: async (__goscriptSelect0Result) => {
					return true
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect0Result) => {
					return false
				}
			}
		], true)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async tryUpdate(name: string): globalThis.Promise<void> {
		let conf: resolverConfig | $.VarRef<resolverConfig> | null = this
		await using __defer = new $.AsyncDisposableStack()
		await $.pointerValue<resolverConfig>(conf).initOnce.Do($.functionValue(((__receiver) => () => __receiver.init())($.pointerValue<resolverConfig>(conf)), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))

		if ($.pointerValue<__goscript_dnsconfig.dnsConfig>($.pointerValue<resolverConfig>(conf).dnsConfig.Load()).noReload) {
			return
		}

		// Ensure only one update at a time checks resolv.conf.
		if (!await resolverConfig.prototype.tryAcquireSema.call(conf)) {
			return
		}
		__defer.defer(async () => { await resolverConfig.prototype.releaseSema.call(conf) })

		let now = $.markAsStructValue($.cloneStructValue(time.Now()))
		if ($.markAsStructValue($.cloneStructValue($.pointerValue<resolverConfig>(conf).lastChecked)).After($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add(-5000000000n))))) {
			return
		}
		$.pointerValue<resolverConfig>(conf).lastChecked = $.markAsStructValue($.cloneStructValue(now))

		switch ((runtime.GOOS as string)) {
			case "windows":
			{
				break
			}
			default:
			{
				let mtime: time.Time = $.markAsStructValue(new time.Time())
				{
					let [fi, err] = os.Stat(name)
					if (err == null) {
						mtime = $.markAsStructValue($.cloneStructValue(await $.pointerValue<Exclude<fs.FileInfo, null>>(fi).ModTime()))
					}
				}
				if ($.markAsStructValue($.cloneStructValue(mtime)).Equal($.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_dnsconfig.dnsConfig>($.pointerValue<resolverConfig>(conf).dnsConfig.Load()).mtime)))) {
					return
				}
				break
			}
		}

		let dnsConf: __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null = await __goscript_dnsconfig_unix.dnsReadConfig(name)
		$.pointerValue<resolverConfig>(conf).dnsConfig.Store(dnsConf)
	}

	static __typeInfo = $.registerStructType(
		"net.resolverConfig",
		() => new resolverConfig(),
		[{ name: "init", args: [], returns: [] }, { name: "releaseSema", args: [], returns: [] }, { name: "tryAcquireSema", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "tryUpdate", args: [{ name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }],
		resolverConfig,
		[{ name: "initOnce", key: "initOnce", type: "sync.Once", pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "ch", key: "ch", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "net", index: [1], offset: 16, exported: false }, { name: "lastChecked", key: "lastChecked", type: "time.Time", pkgPath: "net", index: [2], offset: 24, exported: false }, { name: "dnsConfig", key: "dnsConfig", type: "atomic.Pointer", pkgPath: "net", index: [3], offset: 48, exported: false }]
	)
}

export const useTCPOnly: boolean = true

export const useUDPOrTCP: boolean = false

export const maxDNSPacketSize: number = 1232

export const hostLookupCgo: hostLookupOrder = 0

export const hostLookupFilesDNS: hostLookupOrder = 1

export const hostLookupDNSFiles: hostLookupOrder = 2

export const hostLookupFiles: hostLookupOrder = 3

export const hostLookupDNS: hostLookupOrder = 4

export let errLameReferral: $.GoError = errors.New("lame referral")

export function __goscript_set_errLameReferral(__goscriptValue: $.GoError): void {
	errLameReferral = __goscriptValue
}

export let errCannotUnmarshalDNSMessage: $.GoError = errors.New("cannot unmarshal DNS message")

export function __goscript_set_errCannotUnmarshalDNSMessage(__goscriptValue: $.GoError): void {
	errCannotUnmarshalDNSMessage = __goscriptValue
}

export let errCannotMarshalDNSMessage: $.GoError = errors.New("cannot marshal DNS message")

export function __goscript_set_errCannotMarshalDNSMessage(__goscriptValue: $.GoError): void {
	errCannotMarshalDNSMessage = __goscriptValue
}

export let errServerMisbehaving: $.GoError = errors.New("server misbehaving")

export function __goscript_set_errServerMisbehaving(__goscriptValue: $.GoError): void {
	errServerMisbehaving = __goscriptValue
}

export let errInvalidDNSResponse: $.GoError = errors.New("invalid DNS response")

export function __goscript_set_errInvalidDNSResponse(__goscriptValue: $.GoError): void {
	errInvalidDNSResponse = __goscriptValue
}

export let errNoAnswerFromDNSServer: $.GoError = errors.New("no answer from DNS server")

export function __goscript_set_errNoAnswerFromDNSServer(__goscriptValue: $.GoError): void {
	errNoAnswerFromDNSServer = __goscriptValue
}

export var errServerTemporarilyMisbehaving: __goscript_net.temporaryError | $.VarRef<__goscript_net.temporaryError> | null

export function __goscript_init_errServerTemporarilyMisbehaving(): void {
	if (((errServerTemporarilyMisbehaving) as any) === undefined) {
		errServerTemporarilyMisbehaving = new __goscript_net.temporaryError({s: "server misbehaving"})
	}
}

export function __goscript_get_errServerTemporarilyMisbehaving(): __goscript_net.temporaryError | $.VarRef<__goscript_net.temporaryError> | null {
	if (((errServerTemporarilyMisbehaving) as any) === undefined) {
		__goscript_init_errServerTemporarilyMisbehaving()
	}
	return errServerTemporarilyMisbehaving
}

export function __goscript_set_errServerTemporarilyMisbehaving(__goscriptValue: __goscript_net.temporaryError | $.VarRef<__goscript_net.temporaryError> | null): void {
	errServerTemporarilyMisbehaving = __goscriptValue
}

export let netedns0: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("netedns0")

export function __goscript_set_netedns0(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	netedns0 = __goscriptValue
}

export function newRequest(q: dnsmessage.Question, ad: boolean): [number, $.Slice<number>, $.Slice<number>, $.GoError] {
	let id: number = 0
	let udpReq: $.Slice<number> = null as $.Slice<number>
	let tcpReq: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	id = $.uint($.uint(__goscript_dnsclient.randInt(), 16), 16)
	let b = $.varRef($.markAsStructValue($.cloneStructValue(dnsmessage.NewBuilder($.makeSlice<number>(2, 514, "byte"), $.markAsStructValue(new dnsmessage.Header({ID: $.uint(id, 16), RecursionDesired: true, AuthenticData: ad}))))))
	{
		let __goscriptShadow0 = b.value.StartQuestions()
		if (__goscriptShadow0 != null) {
			return [$.uint(0, 16), null, null, __goscriptShadow0]
		}
	}
	{
		let __goscriptShadow1 = b.value.Question($.markAsStructValue($.cloneStructValue(q)))
		if (__goscriptShadow1 != null) {
			return [$.uint(0, 16), null, null, __goscriptShadow1]
		}
	}

	if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(netedns0)), "0")) {
		godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(netedns0))
	} else {
		// Accept packets up to maxDNSPacketSize.  RFC 6891.
		{
			let __goscriptShadow2 = b.value.StartAdditionals()
			if (__goscriptShadow2 != null) {
				return [$.uint(0, 16), null, null, __goscriptShadow2]
			}
		}
		let rh: $.VarRef<dnsmessage.ResourceHeader> = $.varRef($.markAsStructValue(new dnsmessage.ResourceHeader()))
		{
			let __goscriptShadow3 = rh.value.SetEDNS0(1232, $.uint(dnsmessage.RCodeSuccess, 16), false)
			if (__goscriptShadow3 != null) {
				return [$.uint(0, 16), null, null, __goscriptShadow3]
			}
		}
		{
			let __goscriptShadow4 = b.value.OPTResource($.markAsStructValue($.cloneStructValue(rh.value)), $.markAsStructValue(new dnsmessage.OPTResource()))
			if (__goscriptShadow4 != null) {
				return [$.uint(0, 16), null, null, __goscriptShadow4]
			}
		}
	}

	let __goscriptTuple0: any = b.value.Finish()
	tcpReq = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	if (err != null) {
		return [$.uint(0, 16), null, null, err]
	}
	udpReq = $.goSlice(tcpReq, 2, undefined)
	let l = $.len(tcpReq) - 2
	tcpReq![0] = $.uint($.uint(l >> 8, 8), 8)
	tcpReq![1] = $.uint($.uint(l, 8), 8)
	return [$.uint(id, 16), udpReq, tcpReq, null]
}

export function checkResponse(reqID: number, reqQues: dnsmessage.Question, respHdr: dnsmessage.Header, respQues: dnsmessage.Question): boolean {
	if (!respHdr.Response) {
		return false
	}
	if ($.uint(reqID, 16) != $.uint(respHdr.ID, 16)) {
		return false
	}
	if ((($.uint(reqQues.Type, 16) != $.uint(respQues.Type, 16)) || ($.uint(reqQues.Class, 16) != $.uint(respQues.Class, 16))) || !__goscript_dnsclient.equalASCIIName($.markAsStructValue($.cloneStructValue(reqQues.Name)), $.markAsStructValue($.cloneStructValue(respQues.Name)))) {
		return false
	}
	return true
}

export async function dnsPacketRoundTrip(c: __goscript_net.Conn | null, id: number, query: dnsmessage.Question, b: $.Slice<number>): globalThis.Promise<[dnsmessage.Parser, dnsmessage.Header, $.GoError]> {
	{
		let [, err] = await $.pointerValue<Exclude<__goscript_net.Conn, null>>(c).Write(b)
		if (err != null) {
			return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), err]
		}
	}

	b = $.makeSlice<number>(1232, undefined, "byte")
	while (true) {
		let [n, err] = await $.pointerValue<Exclude<__goscript_net.Conn, null>>(c).Read(b)
		if (err != null) {
			return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), err]
		}
		let p: $.VarRef<dnsmessage.Parser> = $.varRef($.markAsStructValue(new dnsmessage.Parser()))
		// Ignore invalid responses as they may be malicious
		// forgery attempts. Instead continue waiting until
		// timeout. See golang.org/issue/13281.
		let __goscriptTuple1: any = p.value.Start($.goSlice(b, undefined, n))
		let h = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		if (err != null) {
			continue
		}
		let __goscriptTuple2: any = p.value.Question()
		let q = __goscriptTuple2[0]
		err = __goscriptTuple2[1]
		if ((err != null) || !checkResponse($.uint(id, 16), $.markAsStructValue($.cloneStructValue(query)), $.markAsStructValue($.cloneStructValue(h)), $.markAsStructValue($.cloneStructValue(q)))) {
			continue
		}
		return [$.markAsStructValue($.cloneStructValue(p.value)), $.markAsStructValue($.cloneStructValue(h)), null]
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function dnsStreamRoundTrip(c: __goscript_net.Conn | null, id: number, query: dnsmessage.Question, b: $.Slice<number>): globalThis.Promise<[dnsmessage.Parser, dnsmessage.Header, $.GoError]> {
	{
		let [, err] = await $.pointerValue<Exclude<__goscript_net.Conn, null>>(c).Write(b)
		if (err != null) {
			return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), err]
		}
	}

	b = $.makeSlice<number>(1280, undefined, "byte")
	{
		let [, err] = await io.ReadFull($.pointerValueOrNil((c as io.Reader | null))!, $.goSlice(b, undefined, 2))
		if (err != null) {
			return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), err]
		}
	}
	let l = ($.int(b![0]) << 8) | $.int(b![1])
	if (l > $.len(b)) {
		b = $.makeSlice<number>(l, undefined, "byte")
	}
	let [n, err] = await io.ReadFull($.pointerValueOrNil((c as io.Reader | null))!, $.goSlice(b, undefined, l))
	if (err != null) {
		return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), err]
	}
	let p: $.VarRef<dnsmessage.Parser> = $.varRef($.markAsStructValue(new dnsmessage.Parser()))
	let __goscriptTuple3: any = p.value.Start($.goSlice(b, undefined, n))
	let h = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	if (err != null) {
		return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), errCannotUnmarshalDNSMessage]
	}
	let __goscriptTuple4: any = p.value.Question()
	let q = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), errCannotUnmarshalDNSMessage]
	}
	if (!checkResponse($.uint(id, 16), $.markAsStructValue($.cloneStructValue(query)), $.markAsStructValue($.cloneStructValue(h)), $.markAsStructValue($.cloneStructValue(q)))) {
		return [$.markAsStructValue(new dnsmessage.Parser()), $.markAsStructValue(new dnsmessage.Header()), errInvalidDNSResponse]
	}
	return [$.markAsStructValue($.cloneStructValue(p.value)), $.markAsStructValue($.cloneStructValue(h)), null]
}

export function checkHeader(p: dnsmessage.Parser | $.VarRef<dnsmessage.Parser> | null, h: dnsmessage.Header): $.GoError {
	let __goscriptTuple5: any = extractExtendedRCode($.markAsStructValue($.cloneStructValue($.pointerValue<dnsmessage.Parser>(p))), $.markAsStructValue($.cloneStructValue(h)))
	let rcode = $.uint(__goscriptTuple5[0], 16)
	let hasAdd = __goscriptTuple5[1]

	if ($.uint(rcode, 16) == $.uint(dnsmessage.RCodeNameError, 16)) {
		return $.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError")
	}

	let [, err] = dnsmessage.Parser.prototype.AnswerHeader.call(p)
	if ((err != null) && (!$.comparableEqual(err, dnsmessage.ErrSectionDone))) {
		return errCannotUnmarshalDNSMessage
	}

	// libresolv continues to the next server when it receives
	// an invalid referral response. See golang.org/issue/15434.
	if ((((($.uint(rcode, 16) == $.uint(dnsmessage.RCodeSuccess, 16)) && !h.Authoritative) && !h.RecursionAvailable) && ($.comparableEqual(err, dnsmessage.ErrSectionDone))) && !hasAdd) {
		return errLameReferral
	}

	if (($.uint(rcode, 16) != $.uint(dnsmessage.RCodeSuccess, 16)) && ($.uint(rcode, 16) != $.uint(dnsmessage.RCodeNameError, 16))) {
		// None of the error codes make sense
		// for the query we sent. If we didn't get
		// a name error and we didn't get success,
		// the server is behaving incorrectly or
		// having temporary trouble.
		if ($.uint(rcode, 16) == $.uint(dnsmessage.RCodeServerFailure, 16)) {
			return $.interfaceValue<$.GoError>(__goscript_get_errServerTemporarilyMisbehaving(), "*net.temporaryError")
		}
		return errServerMisbehaving
	}

	return null
}

export function skipToAnswer(p: dnsmessage.Parser | $.VarRef<dnsmessage.Parser> | null, qtype: dnsmessage.Type): $.GoError {
	while (true) {
		let [h, err] = dnsmessage.Parser.prototype.AnswerHeader.call(p)
		if ($.comparableEqual(err, dnsmessage.ErrSectionDone)) {
			return $.interfaceValue<$.GoError>(__goscript_net.errNoSuchHost, "*net.notFoundError")
		}
		if (err != null) {
			return errCannotUnmarshalDNSMessage
		}
		if ($.uint(h.Type, 16) == $.uint(qtype, 16)) {
			return null
		}
		{
			let __goscriptShadow5 = dnsmessage.Parser.prototype.SkipAnswer.call(p)
			if (__goscriptShadow5 != null) {
				return errCannotUnmarshalDNSMessage
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function extractExtendedRCode(__goscriptParam0: dnsmessage.Parser, hdr: dnsmessage.Header): [dnsmessage.RCode, boolean] {
	let p: $.VarRef<dnsmessage.Parser> = $.varRef(__goscriptParam0)
	p.value.SkipAllAnswers()
	p.value.SkipAllAuthorities()
	let hasAdd = false
	while (true) {
		let __goscriptTuple6: any = p.value.AdditionalHeader()
		let ahdr = $.varRef(__goscriptTuple6[0])
		let err = __goscriptTuple6[1]
		if (err != null) {
			return [$.uint(hdr.RCode, 16), hasAdd]
		}
		hasAdd = true
		if ($.uint(ahdr.value.Type, 16) == $.uint(dnsmessage.TypeOPT, 16)) {
			return [$.uint(ahdr.value.ExtendedRCode($.uint(hdr.RCode, 16)), 16), hasAdd]
		}
		{
			let __goscriptShadow6 = p.value.SkipAdditional()
			if (__goscriptShadow6 != null) {
				return [$.uint(hdr.RCode, 16), hasAdd]
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export let resolvConf: $.VarRef<resolverConfig> = $.varRef($.markAsStructValue(new resolverConfig()))

export function __goscript_set_resolvConf(__goscriptValue: resolverConfig): void {
	resolvConf.value = __goscriptValue
}

export async function getSystemDNSConfig(): globalThis.Promise<__goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null> {
	await resolvConf.value.tryUpdate("/etc/resolv.conf")
	return (resolvConf.value.dnsConfig.Load() as __goscript_dnsconfig.dnsConfig | $.VarRef<__goscript_dnsconfig.dnsConfig> | null)
}

export function avoidDNS(name: string): boolean {
	if ($.stringEqual(name, "")) {
		return true
	}
	name = stringslite.TrimSuffix(name, ".")
	return __goscript_parse.stringsHasSuffixFold(name, ".onion")
}

export type hostLookupOrder = number

export let lookupOrderName: globalThis.Map<hostLookupOrder, string> | null = new globalThis.Map<hostLookupOrder, string>([[0, "cgo"], [1, "files,dns"], [2, "dns,files"], [3, "files"], [4, "dns"]])

export function __goscript_set_lookupOrderName(__goscriptValue: globalThis.Map<hostLookupOrder, string> | null): void {
	lookupOrderName = __goscriptValue
}

export function hostLookupOrder_String(o: hostLookupOrder): string {
	{
		let [s, ok] = $.mapGet<hostLookupOrder, string, string>(lookupOrderName, o, "")
		if (ok) {
			return s
		}
	}
	return ("hostLookupOrder=" + strconv.Itoa($.int(o))) + "??"
}

export async function goLookupIPFiles(name: string): globalThis.Promise<[$.Slice<__goscript_iprawsock.IPAddr>, string]> {
	let addrs: $.Slice<__goscript_iprawsock.IPAddr> = null as $.Slice<__goscript_iprawsock.IPAddr>
	let canonical: string = ""
	let __goscriptTuple7: any = await __goscript_hosts.lookupStaticHost(name)
	let addr: $.Slice<string> = __goscriptTuple7[0]
	canonical = __goscriptTuple7[1]
	for (let __goscriptRangeTarget0 = addr, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let haddr = __goscriptRangeTarget0![__rangeIndex]
		let __goscriptShadow7 = haddr
		let __goscriptTuple8: any = __goscript_ipsock.splitHostZone(__goscriptShadow7)
		let __goscriptShadow8 = __goscriptTuple8[0]
		let zone = __goscriptTuple8[1]
		{
			let ip: __goscript_ip.IP = (__goscript_ip.ParseIP(__goscriptShadow8) as __goscript_ip.IP)
			if (ip != null) {
				let __goscriptShadow9 = $.markAsStructValue(new __goscript_iprawsock.IPAddr({IP: (ip as __goscript_ip.IP), Zone: zone}))
				addrs = $.append(addrs, __goscriptShadow9)
			}
		}
	}
	await __goscript_addrselect.sortByRFC6724(addrs)
	return [addrs, canonical]
}
