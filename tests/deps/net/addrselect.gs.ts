// Generated file based on addrselect.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as slices from "@goscript/slices/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import type * as os from "@goscript/os/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import type * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_fd_fake from "./fd_fake.gs.ts"

import * as __goscript_fd_js from "./fd_js.gs.ts"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_iprawsock from "./iprawsock.gs.ts"

import * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_net_fake from "./net_fake.gs.ts"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.ts"

import * as __goscript_udpsock from "./udpsock.gs.ts"

import * as __goscript_udpsock_posix from "./udpsock_posix.gs.ts"
import "@goscript/net/netip/index.js"
import "@goscript/slices/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./fd_fake.gs.ts"
import "./fd_js.gs.ts"
import "./ip.gs.ts"
import "./iprawsock.gs.ts"
import "./iprawsock_posix.gs.ts"
import "./net.gs.ts"
import "./net_fake.gs.ts"
import "./sockaddr_posix.gs.ts"
import "./udpsock.gs.ts"
import "./udpsock_posix.gs.ts"

export class ipAttr {
	public get Scope(): scope {
		return this._fields.Scope.value
	}
	public set Scope(value: scope) {
		this._fields.Scope.value = value
	}

	public get Precedence(): number {
		return this._fields.Precedence.value
	}
	public set Precedence(value: number) {
		this._fields.Precedence.value = value
	}

	public get Label(): number {
		return this._fields.Label.value
	}
	public set Label(value: number) {
		this._fields.Label.value = value
	}

	public _fields: {
		Scope: $.VarRef<scope>
		Precedence: $.VarRef<number>
		Label: $.VarRef<number>
	}

	constructor(init?: Partial<{Scope?: scope, Precedence?: number, Label?: number}>) {
		this._fields = {
			Scope: $.varRef(init?.Scope ?? (0 as unknown as scope)),
			Precedence: $.varRef(init?.Precedence ?? (0 as unknown as number)),
			Label: $.varRef(init?.Label ?? (0 as unknown as number))
		}
	}

	public clone(): ipAttr {
		const cloned = new ipAttr()
		cloned._fields = {
			Scope: $.varRef(this._fields.Scope.value),
			Precedence: $.varRef(this._fields.Precedence.value),
			Label: $.varRef(this._fields.Label.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.ipAttr",
		() => new ipAttr(),
		[],
		ipAttr,
		[{ name: "Scope", key: "Scope", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "net.scope" }, index: [0], offset: 0, exported: true }, { name: "Precedence", key: "Precedence", type: { kind: $.TypeKind.Basic, name: "uint8" }, index: [1], offset: 1, exported: true }, { name: "Label", key: "Label", type: { kind: $.TypeKind.Basic, name: "uint8" }, index: [2], offset: 2, exported: true }]
	)
}

export class byRFC6724Info {
	public get addr(): __goscript_iprawsock.IPAddr {
		return this._fields.addr.value
	}
	public set addr(value: __goscript_iprawsock.IPAddr) {
		this._fields.addr.value = value
	}

	public get addrAttr(): ipAttr {
		return this._fields.addrAttr.value
	}
	public set addrAttr(value: ipAttr) {
		this._fields.addrAttr.value = value
	}

	public get src(): netip.Addr {
		return this._fields.src.value
	}
	public set src(value: netip.Addr) {
		this._fields.src.value = value
	}

	public get srcAttr(): ipAttr {
		return this._fields.srcAttr.value
	}
	public set srcAttr(value: ipAttr) {
		this._fields.srcAttr.value = value
	}

	public _fields: {
		addr: $.VarRef<__goscript_iprawsock.IPAddr>
		addrAttr: $.VarRef<ipAttr>
		src: $.VarRef<netip.Addr>
		srcAttr: $.VarRef<ipAttr>
	}

	constructor(init?: Partial<{addr?: __goscript_iprawsock.IPAddr, addrAttr?: ipAttr, src?: netip.Addr, srcAttr?: ipAttr}>) {
		this._fields = {
			addr: $.varRef(init?.addr ? $.markAsStructValue($.cloneStructValue(init.addr)) : $.markAsStructValue(new __goscript_iprawsock.IPAddr())),
			addrAttr: $.varRef(init?.addrAttr ? $.markAsStructValue($.cloneStructValue(init.addrAttr)) : $.markAsStructValue(new ipAttr())),
			src: $.varRef(init?.src ? $.markAsStructValue($.cloneStructValue(init.src)) : $.markAsStructValue(new netip.Addr())),
			srcAttr: $.varRef(init?.srcAttr ? $.markAsStructValue($.cloneStructValue(init.srcAttr)) : $.markAsStructValue(new ipAttr()))
		}
	}

	public clone(): byRFC6724Info {
		const cloned = new byRFC6724Info()
		cloned._fields = {
			addr: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.addr.value))),
			addrAttr: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.addrAttr.value))),
			src: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.src.value))),
			srcAttr: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.srcAttr.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.byRFC6724Info",
		() => new byRFC6724Info(),
		[],
		byRFC6724Info,
		[{ name: "addr", key: "addr", type: "net.IPAddr", pkgPath: "net", index: [0], offset: 0, exported: false }, { name: "addrAttr", key: "addrAttr", type: "net.ipAttr", pkgPath: "net", index: [1], offset: 40, exported: false }, { name: "src", key: "src", type: "netip.Addr", pkgPath: "net", index: [2], offset: 48, exported: false }, { name: "srcAttr", key: "srcAttr", type: "net.ipAttr", pkgPath: "net", index: [3], offset: 72, exported: false }]
	)
}

export class policyTableEntry {
	public get Prefix(): netip.Prefix {
		return this._fields.Prefix.value
	}
	public set Prefix(value: netip.Prefix) {
		this._fields.Prefix.value = value
	}

	public get Precedence(): number {
		return this._fields.Precedence.value
	}
	public set Precedence(value: number) {
		this._fields.Precedence.value = value
	}

	public get Label(): number {
		return this._fields.Label.value
	}
	public set Label(value: number) {
		this._fields.Label.value = value
	}

	public _fields: {
		Prefix: $.VarRef<netip.Prefix>
		Precedence: $.VarRef<number>
		Label: $.VarRef<number>
	}

	constructor(init?: Partial<{Prefix?: netip.Prefix, Precedence?: number, Label?: number}>) {
		this._fields = {
			Prefix: $.varRef(init?.Prefix ? $.markAsStructValue($.cloneStructValue(init.Prefix)) : $.markAsStructValue(new netip.Prefix())),
			Precedence: $.varRef(init?.Precedence ?? (0 as unknown as number)),
			Label: $.varRef(init?.Label ?? (0 as unknown as number))
		}
	}

	public clone(): policyTableEntry {
		const cloned = new policyTableEntry()
		cloned._fields = {
			Prefix: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Prefix.value))),
			Precedence: $.varRef(this._fields.Precedence.value),
			Label: $.varRef(this._fields.Label.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.policyTableEntry",
		() => new policyTableEntry(),
		[],
		policyTableEntry,
		[{ name: "Prefix", key: "Prefix", type: "netip.Prefix", index: [0], offset: 0, exported: true }, { name: "Precedence", key: "Precedence", type: { kind: $.TypeKind.Basic, name: "uint8" }, index: [1], offset: 32, exported: true }, { name: "Label", key: "Label", type: { kind: $.TypeKind.Basic, name: "uint8" }, index: [2], offset: 33, exported: true }]
	)
}

export const scopeInterfaceLocal: scope = 1

export const scopeLinkLocal: scope = 2

export const scopeAdminLocal: scope = 4

export const scopeSiteLocal: scope = 5

export const scopeOrgLocal: scope = 8

export const scopeGlobal: scope = 14

export async function sortByRFC6724(addrs: $.Slice<__goscript_iprawsock.IPAddr>): globalThis.Promise<void> {
	if ($.len(addrs) < 2) {
		return
	}
	sortByRFC6724withSrcs(addrs, await srcAddrs(addrs))
}

export function sortByRFC6724withSrcs(addrs: $.Slice<__goscript_iprawsock.IPAddr>, srcs: $.Slice<netip.Addr>): void {
	if ($.len(addrs) != $.len(srcs)) {
		$.panic("internal error")
	}
	let addrInfos: $.Slice<byRFC6724Info> = $.makeSlice<byRFC6724Info>($.len(addrs), undefined, undefined, () => $.markAsStructValue(new byRFC6724Info()))
	for (let __goscriptRangeTarget0 = addrs, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let v = __goscriptRangeTarget0![i]
		let [addrAttrIP, ] = netip.AddrFromSlice(v.IP)
		addrInfos![i] = (() => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue(ipAttrOf($.markAsStructValue($.cloneStructValue(addrAttrIP))))); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue(ipAttrOf($.markAsStructValue($.cloneStructValue(srcs![i]))))); return $.markAsStructValue(new byRFC6724Info({addr: $.markAsStructValue($.cloneStructValue(addrs![i])), addrAttr: __goscriptLiteralField0, src: $.markAsStructValue($.cloneStructValue(srcs![i])), srcAttr: __goscriptLiteralField1})) })()
	}
	slices.SortStableFunc(addrInfos, compareByRFC6724)
	for (let __goscriptRangeTarget1 = addrInfos, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		addrs![i] = $.markAsStructValue($.cloneStructValue(addrInfos![i].addr))
	}
}

export async function srcAddrs(addrs: $.Slice<__goscript_iprawsock.IPAddr>): globalThis.Promise<$.Slice<netip.Addr>> {
	let srcs: $.Slice<netip.Addr> = $.makeSlice<netip.Addr>($.len(addrs), undefined, undefined, () => $.markAsStructValue(new netip.Addr()))
	let dst = $.varRef($.markAsStructValue(new __goscript_udpsock.UDPAddr({Port: 53})))
	for (let __goscriptRangeTarget2 = addrs, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		dst.value.IP = (addrs![i].IP as __goscript_ip.IP)
		dst.value.Zone = addrs![i].Zone
		let __goscriptTuple0: any = await __goscript_udpsock.DialUDP("udp", null, dst)
		let c: __goscript_udpsock.UDPConn | $.VarRef<__goscript_udpsock.UDPConn> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err == null) {
			{
				let __goscriptTuple1: any = $.typeAssertTuple<__goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null>($.pointerValue<__goscript_udpsock.UDPConn>(c).conn.LocalAddr(), { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" })
				let src: __goscript_udpsock.UDPAddr | $.VarRef<__goscript_udpsock.UDPAddr> | null = __goscriptTuple1[0]
				let ok = __goscriptTuple1[1]
				if (ok) {
					let __goscriptTuple2: any = netip.AddrFromSlice($.pointerValue<__goscript_udpsock.UDPAddr>(src).IP)
					srcs![i] = __goscriptTuple2[0]
				}
			}
			await $.pointerValue<__goscript_udpsock.UDPConn>(c).conn.Close()
		}
	}
	return srcs
}

export function ipAttrOf(ip: netip.Addr): ipAttr {
	if (!$.markAsStructValue($.cloneStructValue(ip)).IsValid()) {
		return $.markAsStructValue(new ipAttr())
	}
	let match = $.markAsStructValue($.cloneStructValue(policyTable_Classify(rfc6724policyTable, $.markAsStructValue($.cloneStructValue(ip)))))
	return (() => { const __goscriptLiteralField2 = $.uint(classifyScope($.markAsStructValue($.cloneStructValue(ip))), 8); return $.markAsStructValue(new ipAttr({Scope: __goscriptLiteralField2, Precedence: $.uint(match.Precedence, 8), Label: $.uint(match.Label, 8)})) })()
}

export function compareByRFC6724(a: byRFC6724Info, b: byRFC6724Info): number {
	let DA: __goscript_ip.IP = (a.addr.IP as __goscript_ip.IP)
	let DB: __goscript_ip.IP = (b.addr.IP as __goscript_ip.IP)
	let SourceDA = $.markAsStructValue($.cloneStructValue(a.src))
	let SourceDB = $.markAsStructValue($.cloneStructValue(b.src))
	let attrDA: ipAttr | $.VarRef<ipAttr> | null = a._fields.addrAttr
	let attrDB: ipAttr | $.VarRef<ipAttr> | null = b._fields.addrAttr
	let attrSourceDA: ipAttr | $.VarRef<ipAttr> | null = a._fields.srcAttr
	let attrSourceDB: ipAttr | $.VarRef<ipAttr> | null = b._fields.srcAttr

	const preferDA: number = -1
	const preferDB: number = 1

	// Rule 1: Avoid unusable destinations.
	// If DB is known to be unreachable or if Source(DB) is undefined, then
	// prefer DA.  Similarly, if DA is known to be unreachable or if
	// Source(DA) is undefined, then prefer DB.
	if (!$.markAsStructValue($.cloneStructValue(SourceDA)).IsValid() && !$.markAsStructValue($.cloneStructValue(SourceDB)).IsValid()) {
		return 0
	}
	if (!$.markAsStructValue($.cloneStructValue(SourceDB)).IsValid()) {
		return -1
	}
	if (!$.markAsStructValue($.cloneStructValue(SourceDA)).IsValid()) {
		return 1
	}

	// Rule 2: Prefer matching scope.
	// If Scope(DA) = Scope(Source(DA)) and Scope(DB) <> Scope(Source(DB)),
	// then prefer DA.  Similarly, if Scope(DA) <> Scope(Source(DA)) and
	// Scope(DB) = Scope(Source(DB)), then prefer DB.
	if (($.uint($.pointerValue<ipAttr>(attrDA).Scope, 8) == $.uint($.pointerValue<ipAttr>(attrSourceDA).Scope, 8)) && ($.uint($.pointerValue<ipAttr>(attrDB).Scope, 8) != $.uint($.pointerValue<ipAttr>(attrSourceDB).Scope, 8))) {
		return -1
	}
	if (($.uint($.pointerValue<ipAttr>(attrDA).Scope, 8) != $.uint($.pointerValue<ipAttr>(attrSourceDA).Scope, 8)) && ($.uint($.pointerValue<ipAttr>(attrDB).Scope, 8) == $.uint($.pointerValue<ipAttr>(attrSourceDB).Scope, 8))) {
		return 1
	}

	// Rule 3: Avoid deprecated addresses.
	// If Source(DA) is deprecated and Source(DB) is not, then prefer DB.
	// Similarly, if Source(DA) is not deprecated and Source(DB) is
	// deprecated, then prefer DA.

	// TODO(bradfitz): implement? low priority for now.

	// Rule 4: Prefer home addresses.
	// If Source(DA) is simultaneously a home address and care-of address
	// and Source(DB) is not, then prefer DA.  Similarly, if Source(DB) is
	// simultaneously a home address and care-of address and Source(DA) is
	// not, then prefer DB.

	// TODO(bradfitz): implement? low priority for now.

	// Rule 5: Prefer matching label.
	// If Label(Source(DA)) = Label(DA) and Label(Source(DB)) <> Label(DB),
	// then prefer DA.  Similarly, if Label(Source(DA)) <> Label(DA) and
	// Label(Source(DB)) = Label(DB), then prefer DB.
	if (($.uint($.pointerValue<ipAttr>(attrSourceDA).Label, 8) == $.uint($.pointerValue<ipAttr>(attrDA).Label, 8)) && ($.uint($.pointerValue<ipAttr>(attrSourceDB).Label, 8) != $.uint($.pointerValue<ipAttr>(attrDB).Label, 8))) {
		return -1
	}
	if (($.uint($.pointerValue<ipAttr>(attrSourceDA).Label, 8) != $.uint($.pointerValue<ipAttr>(attrDA).Label, 8)) && ($.uint($.pointerValue<ipAttr>(attrSourceDB).Label, 8) == $.uint($.pointerValue<ipAttr>(attrDB).Label, 8))) {
		return 1
	}

	// Rule 6: Prefer higher precedence.
	// If Precedence(DA) > Precedence(DB), then prefer DA.  Similarly, if
	// Precedence(DA) < Precedence(DB), then prefer DB.
	if ($.pointerValue<ipAttr>(attrDA).Precedence > $.pointerValue<ipAttr>(attrDB).Precedence) {
		return -1
	}
	if ($.pointerValue<ipAttr>(attrDA).Precedence < $.pointerValue<ipAttr>(attrDB).Precedence) {
		return 1
	}

	// Rule 7: Prefer native transport.
	// If DA is reached via an encapsulating transition mechanism (e.g.,
	// IPv6 in IPv4) and DB is not, then prefer DB.  Similarly, if DB is
	// reached via encapsulation and DA is not, then prefer DA.

	// TODO(bradfitz): implement? low priority for now.

	// Rule 8: Prefer smaller scope.
	// If Scope(DA) < Scope(DB), then prefer DA.  Similarly, if Scope(DA) >
	// Scope(DB), then prefer DB.
	if ($.pointerValue<ipAttr>(attrDA).Scope < $.pointerValue<ipAttr>(attrDB).Scope) {
		return -1
	}
	if ($.pointerValue<ipAttr>(attrDA).Scope > $.pointerValue<ipAttr>(attrDB).Scope) {
		return 1
	}

	// Rule 9: Use the longest matching prefix.
	// When DA and DB belong to the same address family (both are IPv6 or
	// both are IPv4 [but see below]): If CommonPrefixLen(Source(DA), DA) >
	// CommonPrefixLen(Source(DB), DB), then prefer DA.  Similarly, if
	// CommonPrefixLen(Source(DA), DA) < CommonPrefixLen(Source(DB), DB),
	// then prefer DB.
	//
	// However, applying this rule to IPv4 addresses causes
	// problems (see issues 13283 and 18518), so limit to IPv6.
	if ((__goscript_ip.IP_To4(DA) == null) && (__goscript_ip.IP_To4(DB) == null)) {
		let commonA = commonPrefixLen($.markAsStructValue($.cloneStructValue(SourceDA)), (DA as __goscript_ip.IP))
		let commonB = commonPrefixLen($.markAsStructValue($.cloneStructValue(SourceDB)), (DB as __goscript_ip.IP))

		if (commonA > commonB) {
			return -1
		}
		if (commonA < commonB) {
			return 1
		}
	}

	// Rule 10: Otherwise, leave the order unchanged.
	// If DA preceded DB in the original list, prefer DA.
	// Otherwise, prefer DB.
	return 0
}

export type policyTable = $.Slice<policyTableEntry>

export let rfc6724policyTable: policyTable = await ($.arrayToSlice<policyTableEntry>([(() => { const __goscriptLiteralField3 = $.markAsStructValue($.cloneStructValue(netip.PrefixFrom($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(new Uint8Array([$.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0x01, 8)])))), 128))); return $.markAsStructValue(new policyTableEntry({Prefix: __goscriptLiteralField3, Precedence: $.uint(50, 8), Label: $.uint(0, 8)})) })(), (() => { const __goscriptLiteralField4 = $.markAsStructValue($.cloneStructValue(netip.PrefixFrom($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(new Uint8Array([$.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0xff, 8), $.uint(0xff, 8), 0, 0, 0, 0])))), 96))); return $.markAsStructValue(new policyTableEntry({Prefix: __goscriptLiteralField4, Precedence: $.uint(35, 8), Label: $.uint(4, 8)})) })(), (() => { const __goscriptLiteralField5 = $.markAsStructValue($.cloneStructValue(netip.PrefixFrom($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(new Uint8Array(16)))), 96))); return $.markAsStructValue(new policyTableEntry({Prefix: __goscriptLiteralField5, Precedence: $.uint(1, 8), Label: $.uint(3, 8)})) })(), (() => { const __goscriptLiteralField6 = $.markAsStructValue($.cloneStructValue(netip.PrefixFrom($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(new Uint8Array([$.uint(0x20, 8), $.uint(0x01, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])))), 32))); return $.markAsStructValue(new policyTableEntry({Prefix: __goscriptLiteralField6, Precedence: $.uint(5, 8), Label: $.uint(5, 8)})) })(), (() => { const __goscriptLiteralField7 = $.markAsStructValue($.cloneStructValue(netip.PrefixFrom($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(new Uint8Array([$.uint(0x20, 8), $.uint(0x02, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])))), 16))); return $.markAsStructValue(new policyTableEntry({Prefix: __goscriptLiteralField7, Precedence: $.uint(30, 8), Label: $.uint(2, 8)})) })(), (() => { const __goscriptLiteralField8 = $.markAsStructValue($.cloneStructValue(netip.PrefixFrom($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(new Uint8Array([$.uint(0x3f, 8), $.uint(0xfe, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])))), 16))); return $.markAsStructValue(new policyTableEntry({Prefix: __goscriptLiteralField8, Precedence: $.uint(1, 8), Label: $.uint(12, 8)})) })(), (() => { const __goscriptLiteralField9 = $.markAsStructValue($.cloneStructValue(netip.PrefixFrom($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(new Uint8Array([$.uint(0xfe, 8), $.uint(0xc0, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])))), 10))); return $.markAsStructValue(new policyTableEntry({Prefix: __goscriptLiteralField9, Precedence: $.uint(1, 8), Label: $.uint(11, 8)})) })(), (() => { const __goscriptLiteralField10 = $.markAsStructValue($.cloneStructValue(netip.PrefixFrom($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(new Uint8Array([$.uint(0xfc, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])))), 7))); return $.markAsStructValue(new policyTableEntry({Prefix: __goscriptLiteralField10, Precedence: $.uint(3, 8), Label: $.uint(13, 8)})) })(), (() => { const __goscriptLiteralField11 = $.markAsStructValue($.cloneStructValue(netip.PrefixFrom($.markAsStructValue($.cloneStructValue(netip.AddrFrom16(new Uint8Array(16)))), 0))); return $.markAsStructValue(new policyTableEntry({Prefix: __goscriptLiteralField11, Precedence: $.uint(40, 8), Label: $.uint(1, 8)})) })()]) as policyTable)

export function __goscript_set_rfc6724policyTable(__goscriptValue: policyTable): void {
	rfc6724policyTable = __goscriptValue
}

export function policyTable_Classify(t: policyTable, ip: netip.Addr): policyTableEntry {
	// Prefix.Contains() will not match an IPv6 prefix for an IPv4 address.
	if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
		ip = $.markAsStructValue($.cloneStructValue(netip.AddrFrom16($.markAsStructValue($.cloneStructValue(ip)).As16())))
	}
	for (let __goscriptRangeTarget3 = t, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let ent = __goscriptRangeTarget3![__rangeIndex]
		if ($.markAsStructValue($.cloneStructValue(ent.Prefix)).Contains($.markAsStructValue($.cloneStructValue(ip)))) {
			return $.markAsStructValue($.cloneStructValue(ent))
		}
	}
	return $.markAsStructValue(new policyTableEntry())
}

export type scope = number

export function classifyScope(ip: netip.Addr): scope {
	if ($.markAsStructValue($.cloneStructValue(ip)).IsLoopback() || $.markAsStructValue($.cloneStructValue(ip)).IsLinkLocalUnicast()) {
		return $.uint(2, 8)
	}
	let ipv6 = $.markAsStructValue($.cloneStructValue(ip)).Is6() && !$.markAsStructValue($.cloneStructValue(ip)).Is4In6()
	let ipv6AsBytes = $.markAsStructValue($.cloneStructValue(ip)).As16()
	if (ipv6 && $.markAsStructValue($.cloneStructValue(ip)).IsMulticast()) {
		return $.uint(ipv6AsBytes[1] & 0xf, 8)
	}
	// Site-local addresses are defined in RFC 3513 section 2.5.6
	// (and deprecated in RFC 3879).
	if ((ipv6 && ($.uint(ipv6AsBytes[0], 8) == $.uint(0xfe, 8))) && ($.uint((ipv6AsBytes[1] & 0xc0), 8) == $.uint(0xc0, 8))) {
		return $.uint(5, 8)
	}
	return $.uint(14, 8)
}

export function commonPrefixLen(a: netip.Addr, b: __goscript_ip.IP): number {
	let cpl: number = 0
	{
		let b4: __goscript_ip.IP = (__goscript_ip.IP_To4(b) as __goscript_ip.IP)
		if (b4 != null) {
			b = (b4 as __goscript_ip.IP)
		}
	}
	let aAsSlice: $.Slice<number> = $.markAsStructValue($.cloneStructValue(a)).AsSlice()
	if ($.len(aAsSlice) != $.len((b as __goscript_ip.IP))) {
		return 0
	}
	// If IPv6, only up to the prefix (first 64 bits)
	if ($.len(aAsSlice) > 8) {
		aAsSlice = $.goSlice(aAsSlice, undefined, 8)
		b = ($.goSlice(b, undefined, 8) as __goscript_ip.IP)
	}
	while ($.len(aAsSlice) > 0) {
		if ($.uint(aAsSlice![0], 8) == $.uint(b![0], 8)) {
			cpl = cpl + (8)
			aAsSlice = $.goSlice(aAsSlice, 1, undefined)
			b = ($.goSlice(b, 1, undefined) as __goscript_ip.IP)
			continue
		}
		let bits = 8
		let ab = $.uint(aAsSlice![0], 8)
		let bb = $.uint(b![0], 8)
		while (true) {
			ab = (ab >>> ($.uint(1, 8))) >>> 0
			bb = (bb >>> ($.uint(1, 8))) >>> 0
			bits--
			if ($.uint(ab, 8) == $.uint(bb, 8)) {
				cpl = cpl + (bits)
				return cpl
			}
		}
	}
	return cpl
}
