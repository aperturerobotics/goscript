// Generated file based on ip.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as strconv from "@goscript/internal/strconv/index.js"

import * as stringslite from "@goscript/internal/stringslite/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as __goscript_mac from "./mac.gs.ts"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"
import "@goscript/internal/bytealg/index.js"
import "@goscript/internal/strconv/index.js"
import "@goscript/internal/stringslite/index.js"
import "@goscript/net/netip/index.js"
import "./mac.gs.ts"
import "./net.gs.ts"
import "./parse.gs.ts"

export type IP = $.Slice<number>

export type IPMask = $.Slice<number>

export class IPNet {
	public get IP(): IP {
		return this._fields.IP.value
	}
	public set IP(value: IP) {
		this._fields.IP.value = value
	}

	public get Mask(): IPMask {
		return this._fields.Mask.value
	}
	public set Mask(value: IPMask) {
		this._fields.Mask.value = value
	}

	public _fields: {
		IP: $.VarRef<IP>
		Mask: $.VarRef<IPMask>
	}

	constructor(init?: Partial<{IP?: IP, Mask?: IPMask}>) {
		this._fields = {
			IP: $.varRef(init?.IP ?? null),
			Mask: $.varRef(init?.Mask ?? null)
		}
	}

	public clone(): IPNet {
		const cloned = new IPNet()
		cloned._fields = {
			IP: $.varRef(this._fields.IP.value),
			Mask: $.varRef(this._fields.Mask.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Contains(ip: IP): boolean {
		const n: IPNet | $.VarRef<IPNet> | null = this
		let __goscriptTuple0: any = networkNumberAndMask(n)
		let nn: IP = (__goscriptTuple0[0] as IP)
		let m: IPMask = (__goscriptTuple0[1] as IPMask)
		{
			let x: IP = (IP_To4(ip) as IP)
			if (x != null) {
				ip = (x as IP)
			}
		}
		let l = $.len((ip as IP))
		if (l != $.len((nn as IP))) {
			return false
		}
		for (let i = 0; i < l; i++) {
			if ($.uint((nn![i] & m![i]), 8) != $.uint((ip![i] & m![i]), 8)) {
				return false
			}
		}
		return true
	}

	public Network(): string {
		const n: IPNet | $.VarRef<IPNet> | null = this
		return "ip+net"
	}

	public String(): string {
		const n: IPNet | $.VarRef<IPNet> | null = this
		if (n == null) {
			return "<nil>"
		}
		let __goscriptTuple1: any = networkNumberAndMask(n)
		let nn: IP = (__goscriptTuple1[0] as IP)
		let m: IPMask = (__goscriptTuple1[1] as IPMask)
		if ((nn == null) || (m == null)) {
			return "<nil>"
		}
		let l = simpleMaskLength((m as IPMask))
		if (l == -1) {
			return (IP_String(nn) + "/") + IPMask_String(m)
		}
		return (IP_String(nn) + "/") + strconv.Itoa(l)
	}

	static __typeInfo = $.registerStructType(
		"net.IPNet",
		() => new IPNet(),
		[{ name: "Contains", args: [], returns: [] }, { name: "Network", args: [], returns: [] }, { name: "String", args: [], returns: [] }],
		IPNet,
		{"IP": "net.IP", "Mask": "net.IPMask"}
	)
}

export const IPv4len: number = 4

export const IPv6len: number = 16

export function IPv4(a: number, b: number, c: number, d: number): IP {
	let p: IP = ($.makeSlice<number>(16, undefined, "byte") as IP)
	$.copy((p as IP), v4InV6Prefix)
	p![12] = $.uint(a, 8)
	p![13] = $.uint(b, 8)
	p![14] = $.uint(c, 8)
	p![15] = $.uint(d, 8)
	return (p as IP)
}

export let v4InV6Prefix: $.Slice<number> = $.arrayToSlice<number>([$.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0xff, 8), $.uint(0xff, 8)])

export function __goscript_set_v4InV6Prefix(__goscriptValue: $.Slice<number>): void {
	v4InV6Prefix = __goscriptValue
}

export function IPv4Mask(a: number, b: number, c: number, d: number): IPMask {
	let p: IPMask = ($.makeSlice<number>(4, undefined, "byte") as IPMask)
	p![0] = $.uint(a, 8)
	p![1] = $.uint(b, 8)
	p![2] = $.uint(c, 8)
	p![3] = $.uint(d, 8)
	return (p as IPMask)
}

export function CIDRMask(ones: number, bits: number): IPMask {
	if ((bits != (8 * 4)) && (bits != (8 * 16))) {
		return (null as IPMask)
	}
	if ((ones < 0) || (ones > bits)) {
		return (null as IPMask)
	}
	let l = Math.trunc(bits / 8)
	let m: IPMask = ($.makeSlice<number>(l, undefined, "byte") as IPMask)
	let n = $.uint(ones, 64)
	for (let i = 0; i < l; i++) {
		if (n >= 8) {
			m![i] = $.uint(0xff, 8)
			n = $.uint64Sub(n, 8)
			continue
		}
		m![i] = $.uint($.uint(~$.uint($.uintShr(0xff, n, 8), 8), 8), 8)
		n = 0
	}
	return (m as IPMask)
}

export let IPv4bcast: IP = (IPv4($.uint(255, 8), $.uint(255, 8), $.uint(255, 8), $.uint(255, 8)) as IP)

export function __goscript_set_IPv4bcast(__goscriptValue: IP): void {
	IPv4bcast = __goscriptValue
}

export let IPv4allsys: IP = (IPv4($.uint(224, 8), $.uint(0, 8), $.uint(0, 8), $.uint(1, 8)) as IP)

export function __goscript_set_IPv4allsys(__goscriptValue: IP): void {
	IPv4allsys = __goscriptValue
}

export let IPv4allrouter: IP = (IPv4($.uint(224, 8), $.uint(0, 8), $.uint(0, 8), $.uint(2, 8)) as IP)

export function __goscript_set_IPv4allrouter(__goscriptValue: IP): void {
	IPv4allrouter = __goscriptValue
}

export let IPv4zero: IP = (IPv4($.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8)) as IP)

export function __goscript_set_IPv4zero(__goscriptValue: IP): void {
	IPv4zero = __goscriptValue
}

export let IPv6zero: IP = ($.arrayToSlice<number>([$.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8)]) as IP)

export function __goscript_set_IPv6zero(__goscriptValue: IP): void {
	IPv6zero = __goscriptValue
}

export let IPv6unspecified: IP = ($.arrayToSlice<number>([$.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8)]) as IP)

export function __goscript_set_IPv6unspecified(__goscriptValue: IP): void {
	IPv6unspecified = __goscriptValue
}

export let IPv6loopback: IP = ($.arrayToSlice<number>([$.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(1, 8)]) as IP)

export function __goscript_set_IPv6loopback(__goscriptValue: IP): void {
	IPv6loopback = __goscriptValue
}

export let IPv6interfacelocalallnodes: IP = ($.arrayToSlice<number>([$.uint(0xff, 8), $.uint(0x01, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0x01, 8)]) as IP)

export function __goscript_set_IPv6interfacelocalallnodes(__goscriptValue: IP): void {
	IPv6interfacelocalallnodes = __goscriptValue
}

export let IPv6linklocalallnodes: IP = ($.arrayToSlice<number>([$.uint(0xff, 8), $.uint(0x02, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0x01, 8)]) as IP)

export function __goscript_set_IPv6linklocalallnodes(__goscriptValue: IP): void {
	IPv6linklocalallnodes = __goscriptValue
}

export let IPv6linklocalallrouters: IP = ($.arrayToSlice<number>([$.uint(0xff, 8), $.uint(0x02, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0x02, 8)]) as IP)

export function __goscript_set_IPv6linklocalallrouters(__goscriptValue: IP): void {
	IPv6linklocalallrouters = __goscriptValue
}

export function IP_IsUnspecified(ip: IP): boolean {
	return IP_Equal(ip, (IPv4zero as IP)) || IP_Equal(ip, (IPv6unspecified as IP))
}

export function IP_IsLoopback(ip: IP): boolean {
	{
		let ip4: IP = (IP_To4(ip) as IP)
		if (ip4 != null) {
			return $.uint(ip4![0], 8) == $.uint(127, 8)
		}
	}
	return IP_Equal(ip, (IPv6loopback as IP))
}

export function IP_IsPrivate(ip: IP): boolean {
	{
		let ip4: IP = (IP_To4(ip) as IP)
		if (ip4 != null) {
			// Following RFC 1918, Section 3. Private Address Space which says:
			//   The Internet Assigned Numbers Authority (IANA) has reserved the
			//   following three blocks of the IP address space for private internets:
			//     10.0.0.0        -   10.255.255.255  (10/8 prefix)
			//     172.16.0.0      -   172.31.255.255  (172.16/12 prefix)
			//     192.168.0.0     -   192.168.255.255 (192.168/16 prefix)
			return (($.uint(ip4![0], 8) == $.uint(10, 8)) || (($.uint(ip4![0], 8) == $.uint(172, 8)) && ($.uint((ip4![1] & 0xf0), 8) == $.uint(16, 8)))) || (($.uint(ip4![0], 8) == $.uint(192, 8)) && ($.uint(ip4![1], 8) == $.uint(168, 8)))
		}
	}
	// Following RFC 4193, Section 8. IANA Considerations which says:
	//   The IANA has assigned the FC00::/7 prefix to "Unique Local Unicast".
	return ($.len((ip as IP)) == 16) && ($.uint((ip![0] & 0xfe), 8) == $.uint(0xfc, 8))
}

export function IP_IsMulticast(ip: IP): boolean {
	{
		let ip4: IP = (IP_To4(ip) as IP)
		if (ip4 != null) {
			return $.uint((ip4![0] & 0xf0), 8) == $.uint(0xe0, 8)
		}
	}
	return ($.len((ip as IP)) == 16) && ($.uint(ip![0], 8) == $.uint(0xff, 8))
}

export function IP_IsInterfaceLocalMulticast(ip: IP): boolean {
	return (($.len((ip as IP)) == 16) && ($.uint(ip![0], 8) == $.uint(0xff, 8))) && ($.uint((ip![1] & 0x0f), 8) == $.uint(0x01, 8))
}

export function IP_IsLinkLocalMulticast(ip: IP): boolean {
	{
		let ip4: IP = (IP_To4(ip) as IP)
		if (ip4 != null) {
			return (($.uint(ip4![0], 8) == $.uint(224, 8)) && ($.uint(ip4![1], 8) == $.uint(0, 8))) && ($.uint(ip4![2], 8) == $.uint(0, 8))
		}
	}
	return (($.len((ip as IP)) == 16) && ($.uint(ip![0], 8) == $.uint(0xff, 8))) && ($.uint((ip![1] & 0x0f), 8) == $.uint(0x02, 8))
}

export function IP_IsLinkLocalUnicast(ip: IP): boolean {
	{
		let ip4: IP = (IP_To4(ip) as IP)
		if (ip4 != null) {
			return ($.uint(ip4![0], 8) == $.uint(169, 8)) && ($.uint(ip4![1], 8) == $.uint(254, 8))
		}
	}
	return (($.len((ip as IP)) == 16) && ($.uint(ip![0], 8) == $.uint(0xfe, 8))) && ($.uint((ip![1] & 0xc0), 8) == $.uint(0x80, 8))
}

export function IP_IsGlobalUnicast(ip: IP): boolean {
	return (((((($.len((ip as IP)) == 4) || ($.len((ip as IP)) == 16)) && !IP_Equal(ip, (IPv4bcast as IP))) && !IP_IsUnspecified(ip)) && !IP_IsLoopback(ip)) && !IP_IsMulticast(ip)) && !IP_IsLinkLocalUnicast(ip)
}

export function isZeros(p: IP): boolean {
	for (let i = 0; i < $.len((p as IP)); i++) {
		if ($.uint(p![i], 8) != $.uint(0, 8)) {
			return false
		}
	}
	return true
}

export function IP_To4(ip: IP): IP {
	if ($.len((ip as IP)) == 4) {
		return (ip as IP)
	}
	if (((($.len((ip as IP)) == 16) && isZeros(($.goSlice(ip, 0, 10) as IP))) && ($.uint(ip![10], 8) == $.uint(0xff, 8))) && ($.uint(ip![11], 8) == $.uint(0xff, 8))) {
		return ($.goSlice(ip, 12, 16) as IP)
	}
	return (null as IP)
}

export function IP_To16(ip: IP): IP {
	if ($.len((ip as IP)) == 4) {
		return (IPv4($.uint(ip![0], 8), $.uint(ip![1], 8), $.uint(ip![2], 8), $.uint(ip![3], 8)) as IP)
	}
	if ($.len((ip as IP)) == 16) {
		return (ip as IP)
	}
	return (null as IP)
}

export let classAMask: IPMask = (IPv4Mask($.uint(0xff, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8)) as IPMask)

export function __goscript_set_classAMask(__goscriptValue: IPMask): void {
	classAMask = __goscriptValue
}

export let classBMask: IPMask = (IPv4Mask($.uint(0xff, 8), $.uint(0xff, 8), $.uint(0, 8), $.uint(0, 8)) as IPMask)

export function __goscript_set_classBMask(__goscriptValue: IPMask): void {
	classBMask = __goscriptValue
}

export let classCMask: IPMask = (IPv4Mask($.uint(0xff, 8), $.uint(0xff, 8), $.uint(0xff, 8), $.uint(0, 8)) as IPMask)

export function __goscript_set_classCMask(__goscriptValue: IPMask): void {
	classCMask = __goscriptValue
}

export function IP_DefaultMask(ip: IP): IPMask {
	{
		ip = (IP_To4(ip) as IP)
		if (ip == null) {
			return (null as IPMask)
		}
	}
	switch (true) {
		case ip![0] < 0x80:
		{
			return (classAMask as IPMask)
			break
		}
		case ip![0] < 0xC0:
		{
			return (classBMask as IPMask)
			break
		}
		default:
		{
			return (classCMask as IPMask)
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function allFF(b: $.Slice<number>): boolean {
	for (let __goscriptRangeTarget0 = b, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let c = __goscriptRangeTarget0![__rangeIndex]
		if ($.uint(c, 8) != $.uint(0xff, 8)) {
			return false
		}
	}
	return true
}

export function IP_Mask(ip: IP, mask: IPMask): IP {
	if ((($.len((mask as IPMask)) == 16) && ($.len((ip as IP)) == 4)) && allFF($.goSlice(mask, undefined, 12))) {
		mask = ($.goSlice(mask, 12, undefined) as IPMask)
	}
	if ((($.len((mask as IPMask)) == 4) && ($.len((ip as IP)) == 16)) && bytealg.Equal($.goSlice(ip, undefined, 12), v4InV6Prefix)) {
		ip = ($.goSlice(ip, 12, undefined) as IP)
	}
	let n = $.len((ip as IP))
	if (n != $.len((mask as IPMask))) {
		return (null as IP)
	}
	let out: IP = ($.makeSlice<number>(n, undefined, "byte") as IP)
	for (let i = 0; i < n; i++) {
		out![i] = $.uint(ip![i] & mask![i], 8)
	}
	return (out as IP)
}

export function IP_String(ip: IP): string {
	if ($.len((ip as IP)) == 0) {
		return "<nil>"
	}

	if (($.len((ip as IP)) != 4) && ($.len((ip as IP)) != 16)) {
		return "?" + hexString(ip)
	}

	let buf: $.Slice<number> = null as $.Slice<number>
	switch ($.len((ip as IP))) {
		case 4:
		{
			const maxCap: number = 15
			buf = $.makeSlice<number>(0, 15, "byte")
			break
		}
		case 16:
		{
			const maxCap: number = 39
			buf = $.makeSlice<number>(0, 39, "byte")
			break
		}
	}
	buf = IP_appendTo(ip, buf)
	return $.bytesToString(buf)
}

export function hexString(b: $.Slice<number>): string {
	let s: $.Slice<number> = $.makeSlice<number>($.len(b) * 2, undefined, "byte")
	for (let __goscriptRangeTarget1 = b, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		let tn = __goscriptRangeTarget1![i]
		let __goscriptAssign0_0: number = $.uint($.indexStringOrBytes("0123456789abcdef", $.uintShr(tn, 4, 8)), 8)
		let __goscriptAssign0_1: number = $.uint($.indexStringOrBytes("0123456789abcdef", tn & 0xf), 8)
		s![i * 2] = __goscriptAssign0_0
		s![(i * 2) + 1] = __goscriptAssign0_1
	}
	return $.bytesToString(s)
}

export function ipEmptyString(ip: IP): string {
	if ($.len((ip as IP)) == 0) {
		return ""
	}
	return IP_String(ip)
}

export function IP_appendTo(ip: IP, b: $.Slice<number>): $.Slice<number> {
	// If IPv4, use dotted notation.
	{
		let p4: IP = (IP_To4(ip) as IP)
		if ($.len((p4 as IP)) == 4) {
			ip = (p4 as IP)
		}
	}
	let [addr, ] = netip.AddrFromSlice(ip)
	return $.markAsStructValue($.cloneStructValue(addr)).AppendTo(b)
}

export function IP_AppendText(ip: IP, b: $.Slice<number>): [$.Slice<number>, $.GoError] {
	if ($.len((ip as IP)) == 0) {
		return [b, null]
	}
	if (($.len((ip as IP)) != 4) && ($.len((ip as IP)) != 16)) {
		return [b, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField0 = hexString(ip); return new __goscript_net.AddrError({Err: "invalid IP address", Addr: __goscriptLiteralField0}) })(), "*net.AddrError")]
	}

	return [IP_appendTo(ip, b), null]
}

export function IP_MarshalText(ip: IP): [$.Slice<number>, $.GoError] {
	// 24 is satisfied with all IPv4 addresses and short IPv6 addresses
	let __goscriptTuple2: any = IP_AppendText(ip, $.makeSlice<number>(0, 24, "byte"))
	let b: $.Slice<number> = __goscriptTuple2[0]
	let err = __goscriptTuple2[1]
	if (err != null) {
		return [null, err]
	}
	return [b, null]
}

export function IP_UnmarshalText(ip: $.VarRef<IP> | null, text: $.Slice<number>): $.GoError {
	if ($.len(text) == 0) {
		ip!.value = (null as IP)
		return null
	}
	let s = $.bytesToString(text)
	let x: IP = (ParseIP(s) as IP)
	if (x == null) {
		return $.interfaceValue<$.GoError>(new __goscript_net.ParseError({Type: "IP address", Text: s}), "*net.ParseError")
	}
	ip!.value = (x as IP)
	return null
}

export function IP_Equal(ip: IP, x: IP): boolean {
	if ($.len((ip as IP)) == $.len((x as IP))) {
		return bytealg.Equal(ip, x)
	}
	if (($.len((ip as IP)) == 4) && ($.len((x as IP)) == 16)) {
		return bytealg.Equal($.goSlice(x, 0, 12), v4InV6Prefix) && bytealg.Equal(ip, $.goSlice(x, 12, undefined))
	}
	if (($.len((ip as IP)) == 16) && ($.len((x as IP)) == 4)) {
		return bytealg.Equal($.goSlice(ip, 0, 12), v4InV6Prefix) && bytealg.Equal($.goSlice(ip, 12, undefined), x)
	}
	return false
}

export function IP_matchAddrFamily(ip: IP, x: IP): boolean {
	return ((IP_To4(ip) != null) && (IP_To4(x) != null)) || ((((IP_To16(ip) != null) && (IP_To4(ip) == null)) && (IP_To16(x) != null)) && (IP_To4(x) == null))
}

export function simpleMaskLength(mask: IPMask): number {
	let n: number = 0
	for (let __goscriptRangeTarget2 = mask, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		let v = __goscriptRangeTarget2![i]
		if ($.uint(v, 8) == $.uint(0xff, 8)) {
			n = n + (8)
			continue
		}
		// found non-ff byte
		// count 1 bits
		while ($.uint((v & 0x80), 8) != $.uint(0, 8)) {
			n++
			v = v << ($.uint(1, 8))
		}
		// rest must be 0 bits
		if ($.uint(v, 8) != $.uint(0, 8)) {
			return -1
		}
		for (i++; i < $.len((mask as IPMask)); i++) {
			if ($.uint(mask![i], 8) != $.uint(0, 8)) {
				return -1
			}
		}
		break
	}
	return n
}

export function IPMask_Size(m: IPMask): [number, number] {
	let ones: number = 0
	let bits: number = 0
	let __goscriptAssign1_0: number = simpleMaskLength((m as IPMask))
	let __goscriptAssign1_1: number = $.len((m as IPMask)) * 8
	ones = __goscriptAssign1_0
	bits = __goscriptAssign1_1
	if (ones == -1) {
		return [0, 0]
	}
	return [ones, bits]
}

export function IPMask_String(m: IPMask): string {
	if ($.len((m as IPMask)) == 0) {
		return "<nil>"
	}
	return hexString(m)
}

export function networkNumberAndMask(n: IPNet | $.VarRef<IPNet> | null): [IP, IPMask] {
	let ip: IP = null as IP
	let m: IPMask = null as IPMask
	{
		ip = (IP_To4($.pointerValue<IPNet>(n).IP) as IP)
		if (ip == null) {
			ip = ($.pointerValue<IPNet>(n).IP as IP)
			if ($.len((ip as IP)) != 16) {
				return [(null as IP), (null as IPMask)]
			}
		}
	}
	m = ($.pointerValue<IPNet>(n).Mask as IPMask)
	switch ($.len((m as IPMask))) {
		case 4:
		{
			if ($.len((ip as IP)) != 4) {
				return [(null as IP), (null as IPMask)]
			}
			break
		}
		case 16:
		{
			if ($.len((ip as IP)) == 4) {
				m = ($.goSlice(m, 12, undefined) as IPMask)
			}
			break
		}
		default:
		{
			return [(null as IP), (null as IPMask)]
			break
		}
	}
	return [ip, m]
}

export function ParseIP(s: string): IP {
	{
		let [addr, valid] = parseIP(s)
		if (valid) {
			return (($.goSlice(addr, undefined, undefined) as IP) as IP)
		}
	}
	return (null as IP)
}

export function parseIP(s: string): [Uint8Array, boolean] {
	let [ip, err] = netip.ParseAddr(s)
	if ((err != null) || (!$.stringEqual($.markAsStructValue($.cloneStructValue(ip)).Zone(), ""))) {
		return [new Uint8Array(16), false]
	}
	return [$.markAsStructValue($.cloneStructValue(ip)).As16(), true]
}

export function ParseCIDR(s: string): [IP, IPNet | $.VarRef<IPNet> | null, $.GoError] {
	let [addr, mask, found] = stringslite.Cut(s, "/")
	if (!found) {
		return [(null as IP), null, $.interfaceValue<$.GoError>(new __goscript_net.ParseError({Type: "CIDR address", Text: s}), "*net.ParseError")]
	}

	let [ipAddr, err] = netip.ParseAddr(addr)
	if ((err != null) || (!$.stringEqual($.markAsStructValue($.cloneStructValue(ipAddr)).Zone(), ""))) {
		return [(null as IP), null, $.interfaceValue<$.GoError>(new __goscript_net.ParseError({Type: "CIDR address", Text: s}), "*net.ParseError")]
	}

	let [n, i, ok] = __goscript_parse.dtoi(mask)
	if (((!ok || (i != $.len(mask))) || (n < 0)) || (n > $.markAsStructValue($.cloneStructValue(ipAddr)).BitLen())) {
		return [(null as IP), null, $.interfaceValue<$.GoError>(new __goscript_net.ParseError({Type: "CIDR address", Text: s}), "*net.ParseError")]
	}
	let m: IPMask = (CIDRMask(n, $.markAsStructValue($.cloneStructValue(ipAddr)).BitLen()) as IPMask)
	let addr16 = $.markAsStructValue($.cloneStructValue(ipAddr)).As16()
	return [(($.goSlice(addr16, undefined, undefined) as IP) as IP), (() => { const __goscriptLiteralField1 = (IP_Mask(($.goSlice(addr16, undefined, undefined) as IP), (m as IPMask)) as IP); return new IPNet({IP: __goscriptLiteralField1, Mask: (m as IPMask)}) })(), null]
}

export function copyIP(x: IP): IP {
	let y: IP = ($.makeSlice<number>($.len((x as IP)), undefined, "byte") as IP)
	$.copy((y as IP), (x as IP))
	return (y as IP)
}
