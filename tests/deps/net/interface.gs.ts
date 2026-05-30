// Generated file based on interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as strconv from "@goscript/internal/strconv/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_interface_stub from "./interface_stub.gs.ts"

import * as __goscript_mac from "./mac.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/internal/strconv/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./interface_stub.gs.ts"
import "./mac.gs.ts"
import "./net.gs.ts"
import "./parse.gs.ts"

export type Flags = number

export class Interface {
	public get Index(): number {
		return this._fields.Index.value
	}
	public set Index(value: number) {
		this._fields.Index.value = value
	}

	public get MTU(): number {
		return this._fields.MTU.value
	}
	public set MTU(value: number) {
		this._fields.MTU.value = value
	}

	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get HardwareAddr(): __goscript_mac.HardwareAddr {
		return this._fields.HardwareAddr.value
	}
	public set HardwareAddr(value: __goscript_mac.HardwareAddr) {
		this._fields.HardwareAddr.value = value
	}

	public get Flags(): Flags {
		return this._fields.Flags.value
	}
	public set Flags(value: Flags) {
		this._fields.Flags.value = value
	}

	public _fields: {
		Index: $.VarRef<number>
		MTU: $.VarRef<number>
		Name: $.VarRef<string>
		HardwareAddr: $.VarRef<__goscript_mac.HardwareAddr>
		Flags: $.VarRef<Flags>
	}

	constructor(init?: Partial<{Index?: number, MTU?: number, Name?: string, HardwareAddr?: __goscript_mac.HardwareAddr, Flags?: Flags}>) {
		this._fields = {
			Index: $.varRef(init?.Index ?? 0),
			MTU: $.varRef(init?.MTU ?? 0),
			Name: $.varRef(init?.Name ?? ""),
			HardwareAddr: $.varRef(init?.HardwareAddr ?? null),
			Flags: $.varRef(init?.Flags ?? 0)
		}
	}

	public clone(): Interface {
		const cloned = new Interface()
		cloned._fields = {
			Index: $.varRef(this._fields.Index.value),
			MTU: $.varRef(this._fields.MTU.value),
			Name: $.varRef(this._fields.Name.value),
			HardwareAddr: $.varRef(this._fields.HardwareAddr.value),
			Flags: $.varRef(this._fields.Flags.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Addrs(): [$.Slice<__goscript_net.Addr | null>, $.GoError] {
		const ifi: Interface | $.VarRef<Interface> | null = this
		if (ifi == null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: errInvalidInterface}), "*net.OpError")]
		}
		let __goscriptTuple0: any = __goscript_interface_stub.interfaceAddrTable(ifi)
		let ifat: $.Slice<__goscript_net.Addr | null> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: err}), "*net.OpError")
		}
		return [ifat, err]
	}

	public MulticastAddrs(): [$.Slice<__goscript_net.Addr | null>, $.GoError] {
		const ifi: Interface | $.VarRef<Interface> | null = this
		if (ifi == null) {
			return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: errInvalidInterface}), "*net.OpError")]
		}
		let __goscriptTuple1: any = __goscript_interface_stub.interfaceMulticastAddrTable(ifi)
		let ifat: $.Slice<__goscript_net.Addr | null> = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: err}), "*net.OpError")
		}
		return [ifat, err]
	}

	static __typeInfo = $.registerStructType(
		"net.Interface",
		() => new Interface(),
		[{ name: "Addrs", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "net.Addr" } }, { name: "_r1", type: "error" }] }, { name: "MulticastAddrs", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "net.Addr" } }, { name: "_r1", type: "error" }] }],
		Interface,
		[{ name: "Index", key: "Index", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "MTU", key: "MTU", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 8, exported: true }, { name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, index: [2], offset: 16, exported: true }, { name: "HardwareAddr", key: "HardwareAddr", type: "net.HardwareAddr", index: [3], offset: 32, exported: true }, { name: "Flags", key: "Flags", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "net.Flags" }, index: [4], offset: 56, exported: true }]
	)
}

export class ipv6ZoneCache {
	public get RWMutex(): sync.RWMutex {
		return this._fields.RWMutex.value
	}
	public set RWMutex(value: sync.RWMutex) {
		this._fields.RWMutex.value = value
	}

	public get lastFetched(): time.Time {
		return this._fields.lastFetched.value
	}
	public set lastFetched(value: time.Time) {
		this._fields.lastFetched.value = value
	}

	public get toIndex(): Map<string, number> | null {
		return this._fields.toIndex.value
	}
	public set toIndex(value: Map<string, number> | null) {
		this._fields.toIndex.value = value
	}

	public get toName(): Map<number, string> | null {
		return this._fields.toName.value
	}
	public set toName(value: Map<number, string> | null) {
		this._fields.toName.value = value
	}

	public _fields: {
		RWMutex: $.VarRef<sync.RWMutex>
		lastFetched: $.VarRef<time.Time>
		toIndex: $.VarRef<Map<string, number> | null>
		toName: $.VarRef<Map<number, string> | null>
	}

	constructor(init?: Partial<{RWMutex?: sync.RWMutex, lastFetched?: time.Time, toIndex?: Map<string, number> | null, toName?: Map<number, string> | null}>) {
		this._fields = {
			RWMutex: $.varRef(init?.RWMutex ? $.markAsStructValue($.cloneStructValue(init.RWMutex)) : $.markAsStructValue(new sync.RWMutex())),
			lastFetched: $.varRef(init?.lastFetched ? $.markAsStructValue($.cloneStructValue(init.lastFetched)) : $.markAsStructValue(new time.Time())),
			toIndex: $.varRef(init?.toIndex ?? null),
			toName: $.varRef(init?.toName ?? null)
		}
	}

	public clone(): ipv6ZoneCache {
		const cloned = new ipv6ZoneCache()
		cloned._fields = {
			RWMutex: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.RWMutex.value))),
			lastFetched: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.lastFetched.value))),
			toIndex: $.varRef(this._fields.toIndex.value),
			toName: $.varRef(this._fields.toName.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async index(name: string): globalThis.Promise<number> {
		const zc: ipv6ZoneCache | $.VarRef<ipv6ZoneCache> | null = this
		if ($.stringEqual(name, "")) {
			return 0
		}
		let updated = await zoneCache.value.update(null, false)
		await zoneCache.value.RWMutex.RLock()
		let [index, ok] = $.mapGet(zoneCache.value.toIndex, name, 0)
		zoneCache.value.RWMutex.RUnlock()
		if (!ok && !updated) {
			await zoneCache.value.update(null, true)
			await zoneCache.value.RWMutex.RLock()
			let __goscriptTuple7: any = $.mapGet(zoneCache.value.toIndex, name, 0)
			index = __goscriptTuple7[0]
			ok = __goscriptTuple7[1]
			zoneCache.value.RWMutex.RUnlock()
		}
		if (!ok) {
			let __goscriptTuple8: any = __goscript_parse.dtoi(name)
			index = __goscriptTuple8[0]
		}
		return index
	}

	public async name(index: number): globalThis.Promise<string> {
		const zc: ipv6ZoneCache | $.VarRef<ipv6ZoneCache> | null = this
		if (index == 0) {
			return ""
		}
		let updated = await zoneCache.value.update(null, false)
		await zoneCache.value.RWMutex.RLock()
		let [name, ok] = $.mapGet(zoneCache.value.toName, index, "")
		zoneCache.value.RWMutex.RUnlock()
		if (!ok && !updated) {
			await zoneCache.value.update(null, true)
			await zoneCache.value.RWMutex.RLock()
			let __goscriptTuple9: any = $.mapGet(zoneCache.value.toName, index, "")
			name = __goscriptTuple9[0]
			ok = __goscriptTuple9[1]
			zoneCache.value.RWMutex.RUnlock()
		}
		if (!ok) {
			name = strconv.Itoa(index)
		}
		return name
	}

	public async update(ift: $.Slice<Interface>, force: boolean): globalThis.Promise<boolean> {
		let zc: ipv6ZoneCache | $.VarRef<ipv6ZoneCache> | null = this
		let updated: boolean = false
		using __defer = new $.DisposableStack()
		await $.pointerValue<ipv6ZoneCache>(zc).RWMutex.Lock()
		__defer.defer(() => { $.pointerValue<ipv6ZoneCache>(zc).RWMutex.Unlock() })
		let now = $.markAsStructValue($.cloneStructValue(time.Now()))
		if (!force && $.markAsStructValue($.cloneStructValue($.pointerValue<ipv6ZoneCache>(zc).lastFetched)).After($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add($.int64Mul(-60, time.Second)))))) {
			const __goscriptReturn0: boolean = false
			updated = __goscriptReturn0
			__defer[Symbol.dispose]()
			return updated
		}
		$.pointerValue<ipv6ZoneCache>(zc).lastFetched = $.markAsStructValue($.cloneStructValue(now))
		if ($.len(ift) == 0) {
			let err: $.GoError = null as $.GoError
			{
				let __goscriptTuple10: any = __goscript_interface_stub.interfaceTable(0)
				ift = __goscriptTuple10[0]
				err = __goscriptTuple10[1]
				if (err != null) {
					const __goscriptReturn1: boolean = false
					updated = __goscriptReturn1
					__defer[Symbol.dispose]()
					return updated
				}
			}
		}
		$.pointerValue<ipv6ZoneCache>(zc).toIndex = $.makeMap<string, number>()
		$.pointerValue<ipv6ZoneCache>(zc).toName = $.makeMap<number, string>()
		for (let __goscriptRangeTarget3 = ift, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let ifi = __goscriptRangeTarget3![__rangeIndex]
			if (!$.stringEqual(ifi.Name, "")) {
				$.mapSet($.pointerValue<ipv6ZoneCache>(zc).toIndex, ifi.Name, ifi.Index)
				{
					let [, ok] = $.mapGet($.pointerValue<ipv6ZoneCache>(zc).toName, ifi.Index, "")
					if (!ok) {
						$.mapSet($.pointerValue<ipv6ZoneCache>(zc).toName, ifi.Index, ifi.Name)
					}
				}
			}
		}
		const __goscriptReturn2: boolean = true
		updated = __goscriptReturn2
		__defer[Symbol.dispose]()
		return updated
		throw new globalThis.Error("goscript: unreachable return")
	}

	public Lock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).Lock()
	}

	public RLock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).RLock()
	}

	public RLocker(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).RLocker()
	}

	public RUnlock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).RUnlock()
	}

	public TryLock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).TryLock()
	}

	public TryRLock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).TryRLock()
	}

	public Unlock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).Unlock()
	}

	static __typeInfo = $.registerStructType(
		"net.ipv6ZoneCache",
		() => new ipv6ZoneCache(),
		[{ name: "index", args: [{ name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "name", args: [{ name: "index", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "update", args: [{ name: "ift", type: { kind: $.TypeKind.Slice, elemType: "net.Interface" } }, { name: "force", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "updated", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Lock", args: [], returns: [] }, { name: "RLock", args: [], returns: [] }, { name: "RLocker", args: [], returns: [{ name: "_r0", type: "sync.Locker" }] }, { name: "RUnlock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "TryRLock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unlock", args: [], returns: [] }],
		ipv6ZoneCache,
		[{ name: "RWMutex", key: "RWMutex", type: "sync.RWMutex", anonymous: true, index: [0], offset: 0, exported: true }, { name: "lastFetched", key: "lastFetched", type: "time.Time", pkgPath: "net", index: [1], offset: 24, exported: false }, { name: "toIndex", key: "toIndex", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } }, pkgPath: "net", index: [2], offset: 48, exported: false }, { name: "toName", key: "toName", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "int" }, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "net", index: [3], offset: 56, exported: false }]
	)
}

export const FlagUp: Flags = 1

export const FlagBroadcast: Flags = 2

export const FlagLoopback: Flags = 4

export const FlagPointToPoint: Flags = 8

export const FlagMulticast: Flags = 16

export const FlagRunning: Flags = 32

export let errInvalidInterface: $.GoError = errors.New("invalid network interface")

export function __goscript_set_errInvalidInterface(__goscriptValue: $.GoError): void {
	errInvalidInterface = __goscriptValue
}

export let errInvalidInterfaceIndex: $.GoError = errors.New("invalid network interface index")

export function __goscript_set_errInvalidInterfaceIndex(__goscriptValue: $.GoError): void {
	errInvalidInterfaceIndex = __goscriptValue
}

export let errInvalidInterfaceName: $.GoError = errors.New("invalid network interface name")

export function __goscript_set_errInvalidInterfaceName(__goscriptValue: $.GoError): void {
	errInvalidInterfaceName = __goscriptValue
}

export let errNoSuchInterface: $.GoError = errors.New("no such network interface")

export function __goscript_set_errNoSuchInterface(__goscriptValue: $.GoError): void {
	errNoSuchInterface = __goscriptValue
}

export let errNoSuchMulticastInterface: $.GoError = errors.New("no such multicast network interface")

export function __goscript_set_errNoSuchMulticastInterface(__goscriptValue: $.GoError): void {
	errNoSuchMulticastInterface = __goscriptValue
}

export let flagNames: $.Slice<string> = $.arrayToSlice<string>(["up", "broadcast", "loopback", "pointtopoint", "multicast", "running"])

export function __goscript_set_flagNames(__goscriptValue: $.Slice<string>): void {
	flagNames = __goscriptValue
}

export function Flags_String(f: Flags): string {
	let s = ""
	for (let __goscriptRangeTarget0 = flagNames, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let name = __goscriptRangeTarget0![i]
		if (($.uint64And(f, ($.uint64Shl(1, $.uint(i, 64))))) != 0) {
			if (!$.stringEqual(s, "")) {
				s = s + ("|")
			}
			s = s + (name)
		}
	}
	if ($.stringEqual(s, "")) {
		s = "0"
	}
	return s
}

export async function Interfaces(): globalThis.Promise<[$.Slice<Interface>, $.GoError]> {
	let __goscriptTuple2: any = __goscript_interface_stub.interfaceTable(0)
	let ift: $.Slice<Interface> = __goscriptTuple2[0]
	let err = __goscriptTuple2[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: err}), "*net.OpError")]
	}
	if ($.len(ift) != 0) {
		await zoneCache.value.update(ift, false)
	}
	return [ift, null]
}

export function InterfaceAddrs(): [$.Slice<__goscript_net.Addr | null>, $.GoError] {
	let __goscriptTuple3: any = __goscript_interface_stub.interfaceAddrTable(null)
	let ifat: $.Slice<__goscript_net.Addr | null> = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: err}), "*net.OpError")
	}
	return [ifat, err]
}

export function InterfaceByIndex(index: number): [Interface | $.VarRef<Interface> | null, $.GoError] {
	if (index <= 0) {
		return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: errInvalidInterfaceIndex}), "*net.OpError")]
	}
	let __goscriptTuple4: any = __goscript_interface_stub.interfaceTable(index)
	let ift: $.Slice<Interface> = __goscriptTuple4[0]
	let err = __goscriptTuple4[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: err}), "*net.OpError")]
	}
	let __goscriptTuple5: any = interfaceByIndex(ift, index)
	let ifi: Interface | $.VarRef<Interface> | null = __goscriptTuple5[0]
	err = __goscriptTuple5[1]
	if (err != null) {
		err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: err}), "*net.OpError")
	}
	return [ifi, err]
}

export function interfaceByIndex(ift: $.Slice<Interface>, index: number): [Interface | $.VarRef<Interface> | null, $.GoError] {
	for (let __goscriptRangeTarget1 = ift, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let ifi = $.varRef(__goscriptRangeTarget1![__rangeIndex])
		if (index == ifi.value.Index) {
			return [ifi, null]
		}
	}
	return [null, errNoSuchInterface]
}

export async function InterfaceByName(name: string): globalThis.Promise<[Interface | $.VarRef<Interface> | null, $.GoError]> {
	if ($.stringEqual(name, "")) {
		return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: errInvalidInterfaceName}), "*net.OpError")]
	}
	let __goscriptTuple6: any = __goscript_interface_stub.interfaceTable(0)
	let ift: $.Slice<Interface> = __goscriptTuple6[0]
	let err = __goscriptTuple6[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: err}), "*net.OpError")]
	}
	if ($.len(ift) != 0) {
		await zoneCache.value.update(ift, false)
	}
	for (let __goscriptRangeTarget2 = ift, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let ifi = $.varRef(__goscriptRangeTarget2![__rangeIndex])
		if ($.stringEqual(name, ifi.value.Name)) {
			return [ifi, null]
		}
	}
	return [null, $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "route", Net: "ip+net", Source: null, Addr: null, Err: errNoSuchInterface}), "*net.OpError")]
}

export let zoneCache: $.VarRef<ipv6ZoneCache> = $.varRef($.markAsStructValue(new ipv6ZoneCache({toIndex: $.makeMap<string, number>(), toName: $.makeMap<number, string>()})))

export function __goscript_set_zoneCache(__goscriptValue: ipv6ZoneCache): void {
	zoneCache.value = __goscriptValue
}
