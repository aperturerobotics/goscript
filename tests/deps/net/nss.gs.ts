// Generated file based on nss.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as __goscript_parse from "./parse.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/os/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "@goscript/io/fs/index.js"
import "./parse.gs.ts"

export class nsswitchConfig {
	public get initOnce(): sync.Once {
		return this._fields.initOnce.value
	}
	public set initOnce(value: sync.Once) {
		this._fields.initOnce.value = value
	}

	// ch is used as a semaphore that only allows one lookup at a
	// time to recheck nsswitch.conf
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

	public get mu(): sync.Mutex {
		return this._fields.mu.value
	}
	public set mu(value: sync.Mutex) {
		this._fields.mu.value = value
	}

	public get nssConf(): nssConf | $.VarRef<nssConf> | null {
		return this._fields.nssConf.value
	}
	public set nssConf(value: nssConf | $.VarRef<nssConf> | null) {
		this._fields.nssConf.value = value
	}

	public _fields: {
		initOnce: $.VarRef<sync.Once>
		ch: $.VarRef<$.Channel<{}> | null>
		lastChecked: $.VarRef<time.Time>
		mu: $.VarRef<sync.Mutex>
		nssConf: $.VarRef<nssConf | $.VarRef<nssConf> | null>
	}

	constructor(init?: Partial<{initOnce?: sync.Once, ch?: $.Channel<{}> | null, lastChecked?: time.Time, mu?: sync.Mutex, nssConf?: nssConf | $.VarRef<nssConf> | null}>) {
		this._fields = {
			initOnce: $.varRef(init?.initOnce ? $.markAsStructValue($.cloneStructValue(init.initOnce)) : $.markAsStructValue(new sync.Once())),
			ch: $.varRef(init?.ch ?? (null as unknown as $.Channel<{}> | null)),
			lastChecked: $.varRef(init?.lastChecked ? $.markAsStructValue($.cloneStructValue(init.lastChecked)) : $.markAsStructValue(new time.Time())),
			mu: $.varRef(init?.mu ? $.markAsStructValue($.cloneStructValue(init.mu)) : $.markAsStructValue(new sync.Mutex())),
			nssConf: $.varRef(init?.nssConf ?? (null as unknown as nssConf | $.VarRef<nssConf> | null))
		}
	}

	public clone(): nsswitchConfig {
		const cloned = new nsswitchConfig()
		cloned._fields = {
			initOnce: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.initOnce.value))),
			ch: $.varRef(this._fields.ch.value),
			lastChecked: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.lastChecked.value))),
			mu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mu.value))),
			nssConf: $.varRef(this._fields.nssConf.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async acquireSema(): globalThis.Promise<void> {
		const conf: nsswitchConfig | $.VarRef<nsswitchConfig> | null = this
		await $.chanSend($.pointerValue<nsswitchConfig>(conf).ch, {})
	}

	public async init(): globalThis.Promise<void> {
		let conf: nsswitchConfig | $.VarRef<nsswitchConfig> | null = this
		$.pointerValue<nsswitchConfig>(conf).nssConf = await parseNSSConfFile("/etc/nsswitch.conf")
		$.pointerValue<nsswitchConfig>(conf).lastChecked = $.markAsStructValue($.cloneStructValue(time.Now()))
		$.pointerValue<nsswitchConfig>(conf).ch = $.makeChannel<{}>(1, {}, "both")
	}

	public async releaseSema(): globalThis.Promise<void> {
		const conf: nsswitchConfig | $.VarRef<nsswitchConfig> | null = this
		await $.chanRecv($.pointerValue<nsswitchConfig>(conf).ch)
	}

	public async tryAcquireSema(): globalThis.Promise<boolean> {
		const conf: nsswitchConfig | $.VarRef<nsswitchConfig> | null = this
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, boolean>([
			{
				id: 0,
				isSend: true,
				channel: $.pointerValue<nsswitchConfig>(conf).ch,
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

	public async tryUpdate(): globalThis.Promise<void> {
		let conf: nsswitchConfig | $.VarRef<nsswitchConfig> | null = this
		await using __defer = new $.AsyncDisposableStack()
		await $.pointerValue<nsswitchConfig>(conf).initOnce.Do($.functionValue(((__receiver) => () => __receiver.init())($.pointerValue<nsswitchConfig>(conf)), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))

		// Ensure only one update at a time checks nsswitch.conf
		if (!await nsswitchConfig.prototype.tryAcquireSema.call(conf)) {
			return
		}
		__defer.defer(async () => { await nsswitchConfig.prototype.releaseSema.call(conf) })

		let now = $.markAsStructValue($.cloneStructValue(time.Now()))
		if ($.markAsStructValue($.cloneStructValue($.pointerValue<nsswitchConfig>(conf).lastChecked)).After($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add($.int64Mul(-5, time.Second)))))) {
			return
		}
		$.pointerValue<nsswitchConfig>(conf).lastChecked = $.markAsStructValue($.cloneStructValue(now))

		let mtime: time.Time = $.markAsStructValue(new time.Time())
		{
			let [fi, err] = os.Stat("/etc/nsswitch.conf")
			if (err == null) {
				mtime = $.markAsStructValue($.cloneStructValue(await $.pointerValue<Exclude<fs.FileInfo, null>>(fi).ModTime()))
			}
		}
		if ($.markAsStructValue($.cloneStructValue(mtime)).Equal($.markAsStructValue($.cloneStructValue($.pointerValue<nssConf>($.pointerValue<nsswitchConfig>(conf).nssConf).mtime)))) {
			return
		}

		let __goscriptShadow0: nssConf | $.VarRef<nssConf> | null = await parseNSSConfFile("/etc/nsswitch.conf")
		await $.pointerValue<nsswitchConfig>(conf).mu.Lock()
		$.pointerValue<nsswitchConfig>(conf).nssConf = __goscriptShadow0
		$.pointerValue<nsswitchConfig>(conf).mu.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"net.nsswitchConfig",
		() => new nsswitchConfig(),
		[{ name: "acquireSema", args: [], returns: [] }, { name: "init", args: [], returns: [] }, { name: "releaseSema", args: [], returns: [] }, { name: "tryAcquireSema", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "tryUpdate", args: [], returns: [] }],
		nsswitchConfig,
		[{ name: "initOnce", key: "initOnce", type: "sync.Once", pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "ch", key: "ch", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "net", index: [1], offset: 16, exported: false }, { name: "lastChecked", key: "lastChecked", type: "time.Time", pkgPath: "net", index: [2], offset: 24, exported: false }, { name: "mu", key: "mu", type: "sync.Mutex", pkgPath: "net", index: [3], offset: 48, exported: false }, { name: "nssConf", key: "nssConf", type: { kind: $.TypeKind.Pointer, elemType: "net.nssConf" }, pkgPath: "net", index: [4], offset: 56, exported: false }]
	)
}

export class nssConf {
	public get mtime(): time.Time {
		return this._fields.mtime.value
	}
	public set mtime(value: time.Time) {
		this._fields.mtime.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get sources(): Map<string, $.Slice<nssSource>> | null {
		return this._fields.sources.value
	}
	public set sources(value: Map<string, $.Slice<nssSource>> | null) {
		this._fields.sources.value = value
	}

	public _fields: {
		mtime: $.VarRef<time.Time>
		err: $.VarRef<$.GoError>
		sources: $.VarRef<Map<string, $.Slice<nssSource>> | null>
	}

	constructor(init?: Partial<{mtime?: time.Time, err?: $.GoError, sources?: Map<string, $.Slice<nssSource>> | null}>) {
		this._fields = {
			mtime: $.varRef(init?.mtime ? $.markAsStructValue($.cloneStructValue(init.mtime)) : $.markAsStructValue(new time.Time())),
			err: $.varRef(init?.err ?? (null as unknown as $.GoError)),
			sources: $.varRef(init?.sources ?? (null as unknown as Map<string, $.Slice<nssSource>> | null))
		}
	}

	public clone(): nssConf {
		const cloned = new nssConf()
		cloned._fields = {
			mtime: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mtime.value))),
			err: $.varRef(this._fields.err.value),
			sources: $.varRef(this._fields.sources.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.nssConf",
		() => new nssConf(),
		[],
		nssConf,
		[{ name: "mtime", key: "mtime", type: "time.Time", pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "net", index: [1], offset: 24, exported: false }, { name: "sources", key: "sources", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Slice, elemType: "net.nssSource" } }, pkgPath: "net", index: [2], offset: 40, exported: false }]
	)
}

export class nssSource {
	public get source(): string {
		return this._fields.source.value
	}
	public set source(value: string) {
		this._fields.source.value = value
	}

	public get criteria(): $.Slice<nssCriterion> {
		return this._fields.criteria.value
	}
	public set criteria(value: $.Slice<nssCriterion>) {
		this._fields.criteria.value = value
	}

	public _fields: {
		source: $.VarRef<string>
		criteria: $.VarRef<$.Slice<nssCriterion>>
	}

	constructor(init?: Partial<{source?: string, criteria?: $.Slice<nssCriterion>}>) {
		this._fields = {
			source: $.varRef(init?.source ?? ("" as unknown as string)),
			criteria: $.varRef(init?.criteria ?? (null as unknown as $.Slice<nssCriterion>))
		}
	}

	public clone(): nssSource {
		const cloned = new nssSource()
		cloned._fields = {
			source: $.varRef(this._fields.source.value),
			criteria: $.varRef(this._fields.criteria.value)
		}
		return $.markAsStructValue(cloned)
	}

	public standardCriteria(): boolean {
		const s = this
		for (let __goscriptRangeTarget0 = s.criteria, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			let crit = __goscriptRangeTarget0![i]
			if (!$.markAsStructValue($.cloneStructValue(crit)).standardStatusAction(i == ($.len(s.criteria) - 1))) {
				return false
			}
		}
		return true
	}

	static __typeInfo = $.registerStructType(
		"net.nssSource",
		() => new nssSource(),
		[{ name: "standardCriteria", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		nssSource,
		[{ name: "source", key: "source", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "criteria", key: "criteria", type: { kind: $.TypeKind.Slice, elemType: "net.nssCriterion" }, pkgPath: "net", index: [1], offset: 16, exported: false }]
	)
}

export class nssCriterion {
	public get negate(): boolean {
		return this._fields.negate.value
	}
	public set negate(value: boolean) {
		this._fields.negate.value = value
	}

	public get status(): string {
		return this._fields.status.value
	}
	public set status(value: string) {
		this._fields.status.value = value
	}

	public get action(): string {
		return this._fields.action.value
	}
	public set action(value: string) {
		this._fields.action.value = value
	}

	public _fields: {
		negate: $.VarRef<boolean>
		status: $.VarRef<string>
		action: $.VarRef<string>
	}

	constructor(init?: Partial<{negate?: boolean, status?: string, action?: string}>) {
		this._fields = {
			negate: $.varRef(init?.negate ?? (false as unknown as boolean)),
			status: $.varRef(init?.status ?? ("" as unknown as string)),
			action: $.varRef(init?.action ?? ("" as unknown as string))
		}
	}

	public clone(): nssCriterion {
		const cloned = new nssCriterion()
		cloned._fields = {
			negate: $.varRef(this._fields.negate.value),
			status: $.varRef(this._fields.status.value),
			action: $.varRef(this._fields.action.value)
		}
		return $.markAsStructValue(cloned)
	}

	public standardStatusAction(last: boolean): boolean {
		const c = this
		if (c.negate) {
			return false
		}
		let def: string = ""
		switch (c.status) {
			case "success":
			{
				def = "return"
				break
			}
			case "notfound":
			case "unavail":
			case "tryagain":
			{
				def = "continue"
				break
			}
			default:
			{
				return false
				break
			}
		}
		if (last && ($.stringEqual(c.action, "return"))) {
			return true
		}
		return $.stringEqual(c.action, def)
	}

	static __typeInfo = $.registerStructType(
		"net.nssCriterion",
		() => new nssCriterion(),
		[{ name: "standardStatusAction", args: [{ name: "last", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		nssCriterion,
		[{ name: "negate", key: "negate", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "status", key: "status", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [1], offset: 8, exported: false }, { name: "action", key: "action", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net", index: [2], offset: 24, exported: false }]
	)
}

export const nssConfigPath: string = "/etc/nsswitch.conf"

export let nssConfig: $.VarRef<nsswitchConfig> = $.varRef($.markAsStructValue(new nsswitchConfig()))

export function __goscript_set_nssConfig(__goscriptValue: nsswitchConfig): void {
	nssConfig.value = __goscriptValue
}

export async function getSystemNSS(): globalThis.Promise<nssConf | $.VarRef<nssConf> | null> {
	await nssConfig.value.tryUpdate()
	await nssConfig.value.mu.Lock()
	let __goscriptShadow1: nssConf | $.VarRef<nssConf> | null = nssConfig.value.nssConf
	nssConfig.value.mu.Unlock()
	return __goscriptShadow1
}

export async function parseNSSConfFile(file: string): globalThis.Promise<nssConf | $.VarRef<nssConf> | null> {
	using __defer = new $.DisposableStack()
	let __goscriptTuple0: any = __goscript_parse.open(file)
	let f: __goscript_parse.file | $.VarRef<__goscript_parse.file> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return new nssConf({err: err})
	}
	__defer.defer(() => { __goscript_parse.file.prototype.close.call(f) })
	let __goscriptTuple1: any = await __goscript_parse.file.prototype.stat.call(f)
	let mtime = __goscriptTuple1[0]
	err = __goscriptTuple1[2]
	if (err != null) {
		return new nssConf({err: err})
	}

	let __goscriptShadow2: nssConf | $.VarRef<nssConf> | null = await parseNSSConf(f)
	$.pointerValue<nssConf>(__goscriptShadow2).mtime = $.markAsStructValue($.cloneStructValue(mtime))
	return __goscriptShadow2
}

export async function parseNSSConf(f: __goscript_parse.file | $.VarRef<__goscript_parse.file> | null): globalThis.Promise<nssConf | $.VarRef<nssConf> | null> {
	let __goscriptShadow3: nssConf | $.VarRef<nssConf> | null = new nssConf()
	for (let [line, ok] = await __goscript_parse.file.prototype.readLine.call(f); ok; [line, ok] = await __goscript_parse.file.prototype.readLine.call(f)) {
		line = __goscript_parse.trimSpace(__goscript_parse.removeComment(line))
		if ($.len(line) == 0) {
			continue
		}
		let colon = bytealg.IndexByteString(line, $.uint(58, 8))
		if (colon == -1) {
			$.pointerValue<nssConf>(__goscriptShadow3).err = errors.New("no colon on line")
			return __goscriptShadow3
		}
		let db = __goscript_parse.trimSpace($.sliceStringOrBytes(line, undefined, colon))
		let srcs = $.sliceStringOrBytes(line, colon + 1, undefined)
		while (true) {
			srcs = __goscript_parse.trimSpace(srcs)
			if ($.len(srcs) == 0) {
				break
			}
			let sp = bytealg.IndexByteString(srcs, $.uint(32, 8))
			let src: string = ""
			if (sp == -1) {
				src = srcs
				srcs = ""
			} else {
				src = $.sliceStringOrBytes(srcs, undefined, sp)
				srcs = __goscript_parse.trimSpace($.sliceStringOrBytes(srcs, sp + 1, undefined))
			}
			let criteria: $.Slice<nssCriterion> = null as $.Slice<nssCriterion>
			// See if there's a criteria block in brackets.
			if (($.len(srcs) > 0) && ($.uint($.indexStringOrBytes(srcs, 0), 8) == $.uint(91, 8))) {
				let bclose = bytealg.IndexByteString(srcs, $.uint(93, 8))
				if (bclose == -1) {
					$.pointerValue<nssConf>(__goscriptShadow3).err = errors.New("unclosed criterion bracket")
					return __goscriptShadow3
				}
				let err: $.GoError = null as $.GoError
				let __goscriptTuple2: any = await parseCriteria($.sliceStringOrBytes(srcs, 1, bclose))
				criteria = __goscriptTuple2[0]
				err = __goscriptTuple2[1]
				if (err != null) {
					$.pointerValue<nssConf>(__goscriptShadow3).err = errors.New("invalid criteria: " + $.sliceStringOrBytes(srcs, 1, bclose))
					return __goscriptShadow3
				}
				srcs = $.sliceStringOrBytes(srcs, bclose + 1, undefined)
			}
			if ($.pointerValue<nssConf>(__goscriptShadow3).sources == null) {
				$.pointerValue<nssConf>(__goscriptShadow3).sources = $.makeMap<string, $.Slice<nssSource>>()
			}
			$.mapSet($.pointerValue<nssConf>(__goscriptShadow3).sources, db, $.append($.mapGet($.pointerValue<nssConf>(__goscriptShadow3).sources, db, null)[0], $.markAsStructValue(new nssSource({source: src, criteria: criteria}))))
		}
	}
	return __goscriptShadow3
}

export async function parseCriteria(x: string): globalThis.Promise<[$.Slice<nssCriterion>, $.GoError]> {
	let c: $.Slice<nssCriterion> = null as $.Slice<nssCriterion>
	let err: $.GoError = null as $.GoError
	err = await __goscript_parse.foreachField(x, $.functionValue((f: string): $.GoError => {
		let not = false
		if (($.len(f) > 0) && ($.uint($.indexStringOrBytes(f, 0), 8) == $.uint(33, 8))) {
			not = true
			f = $.sliceStringOrBytes(f, 1, undefined)
		}
		if ($.len(f) < 3) {
			return errors.New("criterion too short")
		}
		let eq = bytealg.IndexByteString(f, $.uint(61, 8))
		if (eq == -1) {
			return errors.New("criterion lacks equal sign")
		}
		if (__goscript_parse.hasUpperCase(f)) {
			let lower: $.Slice<number> = $.stringToBytes(f)
			__goscript_parse.lowerASCIIBytes(lower)
			f = $.bytesToString(lower)
		}
		c = $.append(c, $.markAsStructValue(new nssCriterion({negate: not, status: $.sliceStringOrBytes(f, undefined, eq), action: $.sliceStringOrBytes(f, eq + 1, undefined)})))
		return null
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: ["error"] } as $.FunctionTypeInfo)))
	return [c, err]
}
