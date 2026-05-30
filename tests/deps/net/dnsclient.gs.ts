// Generated file based on dnsclient.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as cmp from "@goscript/cmp/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as strconv from "@goscript/internal/strconv/index.js"

import * as slices from "@goscript/slices/index.js"

import * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import * as __goscript_ip from "./ip.gs.ts"

import * as __goscript_mac from "./mac.gs.ts"

import * as __goscript_net from "./net.gs.ts"
import "@goscript/cmp/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/internal/strconv/index.js"
import "@goscript/slices/index.js"
import "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"
import "./ip.gs.ts"
import "./mac.gs.ts"
import "./net.gs.ts"

export class SRV {
	public get Target(): string {
		return this._fields.Target.value
	}
	public set Target(value: string) {
		this._fields.Target.value = value
	}

	public get Port(): number {
		return this._fields.Port.value
	}
	public set Port(value: number) {
		this._fields.Port.value = value
	}

	public get Priority(): number {
		return this._fields.Priority.value
	}
	public set Priority(value: number) {
		this._fields.Priority.value = value
	}

	public get Weight(): number {
		return this._fields.Weight.value
	}
	public set Weight(value: number) {
		this._fields.Weight.value = value
	}

	public _fields: {
		Target: $.VarRef<string>
		Port: $.VarRef<number>
		Priority: $.VarRef<number>
		Weight: $.VarRef<number>
	}

	constructor(init?: Partial<{Target?: string, Port?: number, Priority?: number, Weight?: number}>) {
		this._fields = {
			Target: $.varRef(init?.Target ?? ""),
			Port: $.varRef(init?.Port ?? 0),
			Priority: $.varRef(init?.Priority ?? 0),
			Weight: $.varRef(init?.Weight ?? 0)
		}
	}

	public clone(): SRV {
		const cloned = new SRV()
		cloned._fields = {
			Target: $.varRef(this._fields.Target.value),
			Port: $.varRef(this._fields.Port.value),
			Priority: $.varRef(this._fields.Priority.value),
			Weight: $.varRef(this._fields.Weight.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.SRV",
		() => new SRV(),
		[],
		SRV,
		[{ name: "Target", key: "Target", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Port", key: "Port", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [1], offset: 16, exported: true }, { name: "Priority", key: "Priority", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [2], offset: 18, exported: true }, { name: "Weight", key: "Weight", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [3], offset: 20, exported: true }]
	)
}

export class MX {
	public get Host(): string {
		return this._fields.Host.value
	}
	public set Host(value: string) {
		this._fields.Host.value = value
	}

	public get Pref(): number {
		return this._fields.Pref.value
	}
	public set Pref(value: number) {
		this._fields.Pref.value = value
	}

	public _fields: {
		Host: $.VarRef<string>
		Pref: $.VarRef<number>
	}

	constructor(init?: Partial<{Host?: string, Pref?: number}>) {
		this._fields = {
			Host: $.varRef(init?.Host ?? ""),
			Pref: $.varRef(init?.Pref ?? 0)
		}
	}

	public clone(): MX {
		const cloned = new MX()
		cloned._fields = {
			Host: $.varRef(this._fields.Host.value),
			Pref: $.varRef(this._fields.Pref.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.MX",
		() => new MX(),
		[],
		MX,
		[{ name: "Host", key: "Host", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Pref", key: "Pref", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [1], offset: 16, exported: true }]
	)
}

export class NS {
	public get Host(): string {
		return this._fields.Host.value
	}
	public set Host(value: string) {
		this._fields.Host.value = value
	}

	public _fields: {
		Host: $.VarRef<string>
	}

	constructor(init?: Partial<{Host?: string}>) {
		this._fields = {
			Host: $.varRef(init?.Host ?? "")
		}
	}

	public clone(): NS {
		const cloned = new NS()
		cloned._fields = {
			Host: $.varRef(this._fields.Host.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"net.NS",
		() => new NS(),
		[],
		NS,
		[{ name: "Host", key: "Host", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }]
	)
}

export function runtime_rand(): number {
	return 0
}

export function randInt(): number {
	return $.int($.uint64Shr($.uint(runtime_rand(), 64), 1))
}

export function randIntn(n: number): number {
	return randInt() % n
}

export function reverseaddr(addr: string): [string, $.GoError] {
	let arpa: string = ""
	let err: $.GoError = null as $.GoError
	let ip: __goscript_ip.IP = (__goscript_ip.ParseIP(addr) as __goscript_ip.IP)
	if (ip == null) {
		return ["", $.interfaceValue<$.GoError>(new __goscript_net.DNSError({Err: "unrecognized address", Name: addr}), "*net.DNSError")]
	}
	if (__goscript_ip.IP_To4(ip) != null) {
		return [((((((strconv.Itoa($.int(ip![15])) + ".") + strconv.Itoa($.int(ip![14]))) + ".") + strconv.Itoa($.int(ip![13]))) + ".") + strconv.Itoa($.int(ip![12]))) + ".in-addr.arpa.", null]
	}
	// Must be IPv6
	let buf: $.Slice<number> = $.makeSlice<number>(0, ($.len((ip as __goscript_ip.IP)) * 4) + 9, "byte")
	// Add it, in reverse, to the buffer
	for (let i = $.len((ip as __goscript_ip.IP)) - 1; i >= 0; i--) {
		let v = $.uint(ip![i], 8)
		buf = $.append(buf, $.uint($.indexStringOrBytes("0123456789abcdef", v & 0xF), 8), $.uint(46, 8), $.uint($.indexStringOrBytes("0123456789abcdef", $.uintShr(v, 4, 8)), 8), $.uint(46, 8))
	}
	// Append "ip6.arpa." and return (buf already has the final .)
	buf = $.append(buf, ...($.stringToBytes("ip6.arpa.") ?? []))
	return [$.bytesToString(buf), null]
}

export function equalASCIIName(x: dnsmessage.Name, y: dnsmessage.Name): boolean {
	if ($.uint(x.Length, 8) != $.uint(y.Length, 8)) {
		return false
	}
	for (let i = 0; i < $.int(x.Length); i++) {
		let a = $.uint(x.Data[i], 8)
		let b = $.uint(y.Data[i], 8)
		if ((65 <= a) && (a <= 90)) {
			a = a + ($.uint(0x20, 8))
		}
		if ((65 <= b) && (b <= 90)) {
			b = b + ($.uint(0x20, 8))
		}
		if ($.uint(a, 8) != $.uint(b, 8)) {
			return false
		}
	}
	return true
}

export function isDomainName(s: string): boolean {
	// The root domain name is valid. See golang.org/issue/45715.
	if ($.stringEqual(s, ".")) {
		return true
	}

	// See RFC 1035, RFC 3696.
	// Presentation format has dots before every label except the first, and the
	// terminal empty label is optional here because we assume fully-qualified
	// (absolute) input. We must therefore reserve space for the first and last
	// labels' length octets in wire format, where they are necessary and the
	// maximum total length is 255.
	// So our _effective_ maximum is 253, but 254 is not rejected if the last
	// character is a dot.
	let l = $.len(s)
	if (((l == 0) || (l > 254)) || ((l == 254) && ($.uint($.indexStringOrBytes(s, l - 1), 8) != $.uint(46, 8)))) {
		return false
	}

	let last = $.uint($.uint(46, 8), 8)
	let nonNumeric = false
	let partlen = 0
	for (let i = 0; i < $.len(s); i++) {
		let c = $.uint($.indexStringOrBytes(s, i), 8)
		switch (true) {
			default:
			{
				return false
				break
			}
			case (((97 <= c) && (c <= 122)) || ((65 <= c) && (c <= 90))) || ($.uint(c, 8) == $.uint(95, 8)):
			{
				nonNumeric = true
				partlen++
				break
			}
			case (48 <= c) && (c <= 57):
			{
				partlen++
				break
			}
			case $.uint(c, 8) == $.uint(45, 8):
			{
				if ($.uint(last, 8) == $.uint(46, 8)) {
					return false
				}
				partlen++
				nonNumeric = true
				break
			}
			case $.uint(c, 8) == $.uint(46, 8):
			{
				if (($.uint(last, 8) == $.uint(46, 8)) || ($.uint(last, 8) == $.uint(45, 8))) {
					return false
				}
				if ((partlen > 63) || (partlen == 0)) {
					return false
				}
				partlen = 0
				break
			}
		}
		last = $.uint(c, 8)
	}
	if (($.uint(last, 8) == $.uint(45, 8)) || (partlen > 63)) {
		return false
	}

	return nonNumeric
}

export function absDomainName(s: string): string {
	if ((bytealg.IndexByteString(s, $.uint(46, 8)) != -1) && ($.uint($.indexStringOrBytes(s, $.len(s) - 1), 8) != $.uint(46, 8))) {
		s = s + (".")
	}
	return s
}

export type byPriorityWeight = $.Slice<SRV | $.VarRef<SRV> | null>

export function byPriorityWeight_shuffleByWeight(addrs: byPriorityWeight): void {
	let sum = 0
	for (let __goscriptRangeTarget0 = addrs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let addr = __goscriptRangeTarget0![__rangeIndex]
		sum = sum + ($.int($.pointerValue<SRV>(addr).Weight))
	}
	while ((sum > 0) && ($.len((addrs as byPriorityWeight)) > 1)) {
		let s = 0
		let n = randIntn(sum)
		for (let __goscriptRangeTarget1 = addrs, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			s = s + ($.int($.pointerValue<SRV>(addrs![i]).Weight))
			if (s > n) {
				if (i > 0) {
					let __goscriptAssign0_0: SRV | $.VarRef<SRV> | null = addrs![i]
					let __goscriptAssign0_1: SRV | $.VarRef<SRV> | null = addrs![0]
					addrs![0] = __goscriptAssign0_0
					addrs![i] = __goscriptAssign0_1
				}
				break
			}
		}
		sum = sum - ($.int($.pointerValue<SRV>(addrs![0]).Weight))
		addrs = ($.goSlice(addrs, 1, undefined) as byPriorityWeight)
	}
}

export function byPriorityWeight_sort(addrs: byPriorityWeight): void {
	slices.SortFunc((addrs as byPriorityWeight), $.functionValue((a: SRV | $.VarRef<SRV> | null, b: SRV | $.VarRef<SRV> | null): number => {
		{
			let r = cmp.Compare($.uint($.pointerValue<SRV>(a).Priority, 16), $.uint($.pointerValue<SRV>(b).Priority, 16))
			if (r != 0) {
				return r
			}
		}
		return cmp.Compare($.uint($.pointerValue<SRV>(a).Weight, 16), $.uint($.pointerValue<SRV>(b).Weight, 16))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "net.SRV" }, { kind: $.TypeKind.Pointer, elemType: "net.SRV" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))
	let i = 0
	for (let j = 1; j < $.len((addrs as byPriorityWeight)); j++) {
		if ($.uint($.pointerValue<SRV>(addrs![i]).Priority, 16) != $.uint($.pointerValue<SRV>(addrs![j]).Priority, 16)) {
			byPriorityWeight_shuffleByWeight($.goSlice(addrs, i, j))
			i = j
		}
	}
	byPriorityWeight_shuffleByWeight($.goSlice(addrs, i, undefined))
}

export type byPref = $.Slice<MX | $.VarRef<MX> | null>

export function byPref_sort(s: byPref): void {
	for (let __goscriptRangeTarget2 = s, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		let j = randIntn(i + 1)
		let __goscriptAssign1_0: MX | $.VarRef<MX> | null = s![j]
		let __goscriptAssign1_1: MX | $.VarRef<MX> | null = s![i]
		s![i] = __goscriptAssign1_0
		s![j] = __goscriptAssign1_1
	}
	slices.SortFunc((s as byPref), $.functionValue((a: MX | $.VarRef<MX> | null, b: MX | $.VarRef<MX> | null): number => {
		return cmp.Compare($.uint($.pointerValue<MX>(a).Pref, 16), $.uint($.pointerValue<MX>(b).Pref, 16))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "net.MX" }, { kind: $.TypeKind.Pointer, elemType: "net.MX" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))
}
