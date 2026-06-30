// Generated file based on netip.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as cmp from "@goscript/cmp/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as math from "@goscript/math/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as _unique from "@goscript/unique/index.js"

import * as __goscript_uint128 from "./uint128.gs.ts"
import "@goscript/cmp/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/math/index.js"
import "@goscript/strconv/index.js"
import "@goscript/unique/index.js"
import "./uint128.gs.ts"

export class Addr {
	// addr is the hi and lo bits of an IPv6 address. If z==z4,
	// hi and lo contain the IPv4-mapped IPv6 address.
	//
	// hi and lo are constructed by interpreting a 16-byte IPv6
	// address as a big-endian 128-bit number. The most significant
	// bits of that number go into hi, the rest into lo.
	//
	// For example, 0011:2233:4455:6677:8899:aabb:ccdd:eeff is stored as:
	//  addr.hi = 0x0011223344556677
	//  addr.lo = 0x8899aabbccddeeff
	//
	// We store IPs like this, rather than as [16]byte, because it
	// turns most operations on IPs into arithmetic and bit-twiddling
	// operations on 64-bit registers, which is much faster than
	// bytewise processing.
	public get addr(): __goscript_uint128.uint128 {
		return this._fields.addr.value
	}
	public set addr(value: __goscript_uint128.uint128) {
		this._fields.addr.value = value
	}

	// Details about the address, wrapped up together and canonicalized.
	public get z(): _unique.Handle<addrDetail> {
		return this._fields.z.value
	}
	public set z(value: _unique.Handle<addrDetail>) {
		this._fields.z.value = value
	}

	public _fields: {
		addr: $.VarRef<__goscript_uint128.uint128>
		z: $.VarRef<_unique.Handle<addrDetail>>
	}

	constructor(init?: Partial<{addr?: __goscript_uint128.uint128, z?: _unique.Handle<addrDetail>}>) {
		this._fields = {
			addr: $.varRef(init?.addr ? $.markAsStructValue($.cloneStructValue(init.addr)) : $.markAsStructValue(new __goscript_uint128.uint128())),
			z: $.varRef(init?.z ? $.markAsStructValue($.cloneStructValue(init.z)) : $.markAsStructValue(new _unique.Handle<addrDetail>()))
		}
	}

	public clone(): Addr {
		const cloned = new Addr()
		cloned._fields = {
			addr: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.addr.value))),
			z: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.z.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const ip = this
		switch (ip.z) {
			case z0:
			{
				break
			}
			case z4:
			{
				b = byteorder.BEAppendUint32(b, $.uint($.uint(ip.addr.lo, 32), 32))
				break
			}
			default:
			{
				b = byteorder.BEAppendUint64(b, ip.addr.hi)
				b = byteorder.BEAppendUint64(b, ip.addr.lo)
				b = $.appendSlice(b, $.stringToBytes($.markAsStructValue($.cloneStructValue(ip)).Zone()))
				break
			}
		}
		return [b, null]
	}

	public AppendText(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const ip = this
		return [$.markAsStructValue($.cloneStructValue(ip)).AppendTo(b), null]
	}

	public AppendTo(b: $.Slice<number>): $.Slice<number> {
		const ip = this
		switch (ip.z) {
			case z0:
			{
				return b
				break
			}
			case z4:
			{
				return $.markAsStructValue($.cloneStructValue(ip)).appendTo4(b)
				break
			}
			default:
			{
				if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
					return $.markAsStructValue($.cloneStructValue(ip)).appendTo4In6(b)
				}
				return $.markAsStructValue($.cloneStructValue(ip)).appendTo6(b)
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public As16(): Uint8Array {
		const ip = this
		let a16: Uint8Array = new Uint8Array(16)
		byteorder.BEPutUint64($.goSlice(a16, undefined, 8), ip.addr.hi)
		byteorder.BEPutUint64($.goSlice(a16, 8, undefined), ip.addr.lo)
		return a16
	}

	public As4(): Uint8Array {
		const ip = this
		let a4: Uint8Array = new Uint8Array(4)
		if (($.comparableEqual(ip.z, z4)) || $.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			byteorder.BEPutUint32($.goSlice(a4, undefined, undefined), $.uint($.uint(ip.addr.lo, 32), 32))
			return a4
		}
		if ($.comparableEqual(ip.z, z0)) {
			$.panic("As4 called on IP zero value")
		}
		$.panic("As4 called on IPv6 address")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public AsSlice(): $.Slice<number> {
		const ip = this
		switch (ip.z) {
			case z0:
			{
				return null
				break
			}
			case z4:
			{
				let ret: Uint8Array = new Uint8Array(4)
				byteorder.BEPutUint32($.goSlice(ret, undefined, undefined), $.uint($.uint(ip.addr.lo, 32), 32))
				return $.goSlice(ret, undefined, undefined)
				break
			}
			default:
			{
				let ret: Uint8Array = new Uint8Array(16)
				byteorder.BEPutUint64($.goSlice(ret, undefined, 8), ip.addr.hi)
				byteorder.BEPutUint64($.goSlice(ret, 8, undefined), ip.addr.lo)
				return $.goSlice(ret, undefined, undefined)
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public BitLen(): number {
		const ip = this
		switch (ip.z) {
			case z0:
			{
				return 0
				break
			}
			case z4:
			{
				return 32
				break
			}
		}
		return 128
	}

	public Compare(ip2: Addr): number {
		const ip = this
		let f1 = $.markAsStructValue($.cloneStructValue(ip)).BitLen()
		let f2 = $.markAsStructValue($.cloneStructValue(ip2)).BitLen()
		if (f1 < f2) {
			return -1
		}
		if (f1 > f2) {
			return 1
		}
		let hi1 = ip.addr.hi
		let hi2 = ip2.addr.hi
		if (hi1 < hi2) {
			return -1
		}
		if (hi1 > hi2) {
			return 1
		}
		let lo1 = ip.addr.lo
		let lo2 = ip2.addr.lo
		if (lo1 < lo2) {
			return -1
		}
		if (lo1 > lo2) {
			return 1
		}
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			let za = $.markAsStructValue($.cloneStructValue(ip)).Zone()
			let zb = $.markAsStructValue($.cloneStructValue(ip2)).Zone()
			if ($.stringCompare(za, zb) < 0) {
				return -1
			}
			if ($.stringCompare(za, zb) > 0) {
				return 1
			}
		}
		return 0
	}

	public Is4(): boolean {
		const ip = this
		return $.comparableEqual(ip.z, z4)
	}

	public Is4In6(): boolean {
		const ip = this
		return ($.markAsStructValue($.cloneStructValue(ip)).Is6() && (ip.addr.hi == 0n)) && (($.uint64Shr(ip.addr.lo, 32)) == 65535n)
	}

	public Is6(): boolean {
		const ip = this
		return (!$.comparableEqual(ip.z, z0)) && (!$.comparableEqual(ip.z, z4))
	}

	public IsGlobalUnicast(): boolean {
		let ip: Addr = this
		if ($.comparableEqual(ip.z, z0)) {
			// Invalid or zero-value.
			return false
		}

		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			ip = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap()))
		}

		// Match package net's IsGlobalUnicast logic. Notably private IPv4 addresses
		// and ULA IPv6 addresses are still considered "global unicast".
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4() && (($.comparableEqual(ip, IPv4Unspecified())) || ($.comparableEqual(ip, AddrFrom4(new Uint8Array([$.uint(255, 8), $.uint(255, 8), $.uint(255, 8), $.uint(255, 8)])))))) {
			return false
		}

		return (((!$.comparableEqual(ip, IPv6Unspecified())) && !$.markAsStructValue($.cloneStructValue(ip)).IsLoopback()) && !$.markAsStructValue($.cloneStructValue(ip)).IsMulticast()) && !$.markAsStructValue($.cloneStructValue(ip)).IsLinkLocalUnicast()
	}

	public IsInterfaceLocalMulticast(): boolean {
		const ip = this
		// IPv6 Addressing Architecture (2.7.1. Pre-Defined Multicast Addresses)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.7.1
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6() && !$.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v6u16($.uint(0, 8)) & 0xff0f), 16) == $.uint(0xff01, 16)
		}
		return false
	}

	public IsLinkLocalMulticast(): boolean {
		let ip: Addr = this
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			ip = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap()))
		}

		// IPv4 Multicast Guidelines (4. Local Network Control Block (224.0.0/24))
		// https://datatracker.ietf.org/doc/html/rfc5771#section-4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			return (($.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(0, 8)), 8) == $.uint(224, 8)) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(1, 8)), 8) == $.uint(0, 8))) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(2, 8)), 8) == $.uint(0, 8))
		}
		// IPv6 Addressing Architecture (2.7.1. Pre-Defined Multicast Addresses)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.7.1
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v6u16($.uint(0, 8)) & 0xff0f), 16) == $.uint(0xff02, 16)
		}
		return false
	}

	public IsLinkLocalUnicast(): boolean {
		let ip: Addr = this
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			ip = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap()))
		}

		// Dynamic Configuration of IPv4 Link-Local Addresses
		// https://datatracker.ietf.org/doc/html/rfc3927#section-2.1
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			return ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(0, 8)), 8) == $.uint(169, 8)) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(1, 8)), 8) == $.uint(254, 8))
		}
		// IP Version 6 Addressing Architecture (2.4 Address Type Identification)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v6u16($.uint(0, 8)) & 0xffc0), 16) == $.uint(0xfe80, 16)
		}
		return false
	}

	public IsLoopback(): boolean {
		let ip: Addr = this
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			ip = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap()))
		}

		// Requirements for Internet Hosts -- Communication Layers (3.2.1.3 Addressing)
		// https://datatracker.ietf.org/doc/html/rfc1122#section-3.2.1.3
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			return $.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(0, 8)), 8) == $.uint(127, 8)
		}
		// IP Version 6 Addressing Architecture (2.4 Address Type Identification)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return (ip.addr.hi == 0n) && (ip.addr.lo == 1n)
		}
		return false
	}

	public IsMulticast(): boolean {
		let ip: Addr = this
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			ip = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap()))
		}

		// Host Extensions for IP Multicasting (4. HOST GROUP ADDRESSES)
		// https://datatracker.ietf.org/doc/html/rfc1112#section-4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(0, 8)) & 0xf0), 8) == $.uint(0xe0, 8)
		}
		// IP Version 6 Addressing Architecture (2.4 Address Type Identification)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return ($.uint64Shr(ip.addr.hi, (64 - 8))) == 255n
		}
		return false
	}

	public IsPrivate(): boolean {
		let ip: Addr = this
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			ip = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap()))
		}

		// Match the stdlib's IsPrivate logic.
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			// RFC 1918 allocates 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 as
			// private IPv4 address subnets.
			return (($.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(0, 8)), 8) == $.uint(10, 8)) || (($.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(0, 8)), 8) == $.uint(172, 8)) && ($.uint(($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(1, 8)) & 0xf0), 8) == $.uint(16, 8)))) || (($.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(0, 8)), 8) == $.uint(192, 8)) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(1, 8)), 8) == $.uint(168, 8)))
		}

		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			// RFC 4193 allocates fc00::/7 as the unique local unicast IPv6 address
			// subnet.
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v6($.uint(0, 8)) & 0xfe), 8) == $.uint(0xfc, 8)
		}

		return false
	}

	public IsUnspecified(): boolean {
		const ip = this
		return ($.comparableEqual(ip, IPv4Unspecified())) || ($.comparableEqual(ip, IPv6Unspecified()))
	}

	public IsValid(): boolean {
		const ip = this
		return !$.comparableEqual(ip.z, z0)
	}

	public Less(ip2: Addr): boolean {
		const ip = this
		return $.markAsStructValue($.cloneStructValue(ip)).Compare($.markAsStructValue($.cloneStructValue(ip2))) == -1
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const ip = this
		return $.markAsStructValue($.cloneStructValue(ip)).AppendBinary($.makeSlice<number>(0, $.markAsStructValue($.cloneStructValue(ip)).marshalBinarySize(), "byte"))
	}

	public MarshalText(): [$.Slice<number>, $.GoError] {
		const ip = this
		let buf: $.Slice<number> = $.arrayToSlice<number>([])
		switch (ip.z) {
			case z0:
			{
				break
			}
			case z4:
			{
				const maxCap: number = 15
				buf = $.makeSlice<number>(0, 15, "byte")
				break
			}
			default:
			{
				if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
					const maxCap: number = 29
					buf = $.makeSlice<number>(0, 29, "byte")
					break
				}
				const maxCap: number = 46
				buf = $.makeSlice<number>(0, 46, "byte")
				break
			}
		}
		return $.markAsStructValue($.cloneStructValue(ip)).AppendText(buf)
	}

	public Next(): Addr {
		let ip: Addr = this
		ip.addr = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip.addr)).addOne()))
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			if ($.uint($.uint(ip.addr.lo, 32), 32) == $.uint(0, 32)) {
				// Overflowed.
				return $.markAsStructValue(new Addr())
			}
		} else {
			if ($.markAsStructValue($.cloneStructValue(ip.addr)).isZero()) {
				// Overflowed
				return $.markAsStructValue(new Addr())
			}
		}
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	public Prefix(b: number): [Prefix, $.GoError] {
		let ip: Addr = this
		if (b < 0) {
			return [$.markAsStructValue(new Prefix()), errors.New("negative Prefix bits")]
		}
		let effectiveBits = b
		switch (ip.z) {
			case z0:
			{
				return [$.markAsStructValue(new Prefix()), null]
				break
			}
			case z4:
			{
				if (b > 32) {
					return [$.markAsStructValue(new Prefix()), errors.New(("prefix length " + strconv.Itoa(b)) + " too large for IPv4")]
				}
				effectiveBits = effectiveBits + (96)
				break
			}
			default:
			{
				if (b > 128) {
					return [$.markAsStructValue(new Prefix()), errors.New(("prefix length " + strconv.Itoa(b)) + " too large for IPv6")]
				}
				break
			}
		}
		ip.addr = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip.addr)).and($.markAsStructValue($.cloneStructValue(__goscript_uint128.mask6(effectiveBits))))))
		return [$.markAsStructValue($.cloneStructValue(PrefixFrom($.markAsStructValue($.cloneStructValue(ip)), b))), null]
	}

	public Prev(): Addr {
		let ip: Addr = this
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			if ($.uint($.uint(ip.addr.lo, 32), 32) == $.uint(0, 32)) {
				return $.markAsStructValue(new Addr())
			}
		} else {
			if ($.markAsStructValue($.cloneStructValue(ip.addr)).isZero()) {
				return $.markAsStructValue(new Addr())
			}
		}
		ip.addr = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip.addr)).subOne()))
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	public String(): string {
		const ip = this
		switch (ip.z) {
			case z0:
			{
				return "invalid IP"
				break
			}
			case z4:
			{
				return $.markAsStructValue($.cloneStructValue(ip)).string4()
				break
			}
			default:
			{
				if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
					return $.markAsStructValue($.cloneStructValue(ip)).string4In6()
				}
				return $.markAsStructValue($.cloneStructValue(ip)).string6()
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public StringExpanded(): string {
		const ip = this
		switch (ip.z) {
			case z0:
			case z4:
			{
				return $.markAsStructValue($.cloneStructValue(ip)).String()
				break
			}
		}

		const size: number = 39
		let ret: $.Slice<number> = $.makeSlice<number>(0, 39, "byte")
		for (let i = $.uint($.uint(0, 8), 8); $.uint(i, 8) < $.uint(8, 8); i++) {
			if ($.uint(i, 8) > $.uint(0, 8)) {
				ret = $.append(ret, $.uint(58, 8))
			}

			ret = appendHexPad(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v6u16($.uint(i, 8)), 16))
		}

		if (!$.comparableEqual(ip.z, z6noz)) {
			// The addition of a zone will cause a second allocation, but when there
			// is no zone the ret slice will be stack allocated.
			ret = $.append(ret, $.uint(37, 8))
			ret = $.appendSlice(ret, $.stringToBytes($.markAsStructValue($.cloneStructValue(ip)).Zone()))
		}
		return $.bytesToString(ret)
	}

	public Unmap(): Addr {
		let ip: Addr = this
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			ip.z = $.markAsStructValue($.cloneStructValue(z4))
		}
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let ip: Addr | $.VarRef<Addr> | null = this
		let n = $.len(b)
		switch (true) {
			case n == 0:
			{
				$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue(new Addr()))
				return null
				break
			}
			case n == 4:
			{
				$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue($.cloneStructValue(AddrFrom4(($.sliceToArray<number>(b, 4, "byte") as Uint8Array)))))
				return null
				break
			}
			case n == 16:
			{
				$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue($.cloneStructValue(AddrFrom16(($.sliceToArray<number>(b, 16, "byte") as Uint8Array)))))
				return null
				break
			}
			case n > 16:
			{
				$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(AddrFrom16(($.sliceToArray<number>($.goSlice(b, undefined, 16), 16, "byte") as Uint8Array)))).WithZone($.bytesToString($.goSlice(b, 16, undefined))))))
				return null
				break
			}
		}
		return errors.New("unexpected slice size")
	}

	public UnmarshalText(text: $.Slice<number>): $.GoError {
		let ip: Addr | $.VarRef<Addr> | null = this
		if ($.len(text) == 0) {
			$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue(new Addr()))
			return null
		}
		let err: $.GoError = null as $.GoError
		let __goscriptTuple0: any = ParseAddr($.bytesToString(text))
		$.assignStruct($.pointerValue<Addr>(ip), __goscriptTuple0[0])
		err = __goscriptTuple0[1]
		return err
	}

	public WithZone(zone: string): Addr {
		let ip: Addr = this
		if (!$.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return $.markAsStructValue($.cloneStructValue(ip))
		}
		if ($.stringEqual(zone, "")) {
			ip.z = $.markAsStructValue($.cloneStructValue(z6noz))
			return $.markAsStructValue($.cloneStructValue(ip))
		}
		ip.z = ($.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new addrDetail({isV6: true, zoneV6: zone}))))) as _unique.Handle<addrDetail>)
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	public Zone(): string {
		const ip = this
		if ($.comparableEqual(ip.z, z0)) {
			return ""
		}
		return $.markAsStructValue($.cloneStructValue(ip.z)).Value().zoneV6
	}

	public appendTo4(ret: $.Slice<number>): $.Slice<number> {
		const ip = this
		ret = appendDecimal(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(0, 8)), 8))
		ret = $.append(ret, $.uint(46, 8))
		ret = appendDecimal(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(1, 8)), 8))
		ret = $.append(ret, $.uint(46, 8))
		ret = appendDecimal(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(2, 8)), 8))
		ret = $.append(ret, $.uint(46, 8))
		ret = appendDecimal(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v4($.uint(3, 8)), 8))
		return ret
	}

	public appendTo4In6(ret: $.Slice<number>): $.Slice<number> {
		const ip = this
		ret = $.appendSlice(ret, $.stringToBytes("::ffff:"))
		ret = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap())).appendTo4(ret)
		if (!$.comparableEqual(ip.z, z6noz)) {
			ret = $.append(ret, $.uint(37, 8))
			ret = $.appendSlice(ret, $.stringToBytes($.markAsStructValue($.cloneStructValue(ip)).Zone()))
		}
		return ret
	}

	public appendTo6(ret: $.Slice<number>): $.Slice<number> {
		const ip = this
		let zeroStart = $.uint($.uint(255, 8), 8)
		let zeroEnd = $.uint($.uint(255, 8), 8)
		for (let i = $.uint($.uint(0, 8), 8); $.uint(i, 8) < $.uint(8, 8); i++) {
			let j = $.uint(i, 8)
			while (($.uint(j, 8) < $.uint(8, 8)) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v6u16($.uint(j, 8)), 16) == $.uint(0, 16))) {
				j++
			}
			{
				let l = $.uint(j - i, 8)
				if (($.uint(l, 8) >= $.uint(2, 8)) && ($.uint(l, 8) > $.uint((zeroEnd - zeroStart), 8))) {
					let __goscriptAssign0_0: number = $.uint(i, 8)
					let __goscriptAssign0_1: number = $.uint(j, 8)
					zeroStart = __goscriptAssign0_0
					zeroEnd = __goscriptAssign0_1
				}
			}
		}

		for (let i = $.uint($.uint(0, 8), 8); $.uint(i, 8) < $.uint(8, 8); i++) {
			if ($.uint(i, 8) == $.uint(zeroStart, 8)) {
				ret = $.append(ret, $.uint(58, 8), $.uint(58, 8))
				i = $.uint(zeroEnd, 8)
				if ($.uint(i, 8) >= $.uint(8, 8)) {
					break
				}
			} else {
				if ($.uint(i, 8) > $.uint(0, 8)) {
					ret = $.append(ret, $.uint(58, 8))
				}
			}

			ret = appendHex(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v6u16($.uint(i, 8)), 16))
		}

		if (!$.comparableEqual(ip.z, z6noz)) {
			ret = $.append(ret, $.uint(37, 8))
			ret = $.appendSlice(ret, $.stringToBytes($.markAsStructValue($.cloneStructValue(ip)).Zone()))
		}
		return ret
	}

	public hasZone(): boolean {
		const ip = this
		return ((!$.comparableEqual(ip.z, z0)) && (!$.comparableEqual(ip.z, z4))) && (!$.comparableEqual(ip.z, z6noz))
	}

	public isZero(): boolean {
		const ip = this
		// Faster than comparing ip == Addr{}, but effectively equivalent,
		// as there's no way to make an IP with a nil z from this package.
		return $.comparableEqual(ip.z, z0)
	}

	public marshalBinarySize(): number {
		const ip = this
		switch (ip.z) {
			case z0:
			{
				return 0
				break
			}
			case z4:
			{
				return 4
				break
			}
			default:
			{
				return 16 + $.len($.markAsStructValue($.cloneStructValue(ip)).Zone())
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public string4(): string {
		const ip = this
		const max: number = 15
		let ret: $.Slice<number> = $.makeSlice<number>(0, 15, "byte")
		ret = $.markAsStructValue($.cloneStructValue(ip)).appendTo4(ret)
		return $.bytesToString(ret)
	}

	public string4In6(): string {
		const ip = this
		const max: number = 29
		let ret: $.Slice<number> = $.makeSlice<number>(0, 29, "byte")
		ret = $.markAsStructValue($.cloneStructValue(ip)).appendTo4In6(ret)
		return $.bytesToString(ret)
	}

	public string6(): string {
		const ip = this
		// Use a zone with a "plausibly long" name, so that most zone-ful
		// IP addresses won't require additional allocation.
		//
		// The compiler does a cool optimization here, where ret ends up
		// stack-allocated and so the only allocation this function does
		// is to construct the returned string. As such, it's okay to be a
		// bit greedy here, size-wise.
		const max: number = 46
		let ret: $.Slice<number> = $.makeSlice<number>(0, 46, "byte")
		ret = $.markAsStructValue($.cloneStructValue(ip)).appendTo6(ret)
		return $.bytesToString(ret)
	}

	public v4(i: number): number {
		const ip = this
		return $.uint($.uint($.uint64Shr(ip.addr.lo, ((3 - i) * 8)), 8), 8)
	}

	public v6(i: number): number {
		const ip = this
		return $.uint($.uint($.uint64Shr($.pointerValue<bigint>(($.arrayIndex(ip.addr.halves(), (Math.trunc(i / 8)) % 2))), ((7 - (i % 8)) * 8)), 8), 8)
	}

	public v6u16(i: number): number {
		const ip = this
		return $.uint($.uint($.uint64Shr($.pointerValue<bigint>(($.arrayIndex(ip.addr.halves(), (Math.trunc(i / 4)) % 2))), ((3 - (i % 4)) * 16)), 16), 16)
	}

	public withoutZone(): Addr {
		let ip: Addr = this
		if (!$.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return $.markAsStructValue($.cloneStructValue(ip))
		}
		ip.z = $.markAsStructValue($.cloneStructValue(z6noz))
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	static __typeInfo = $.registerStructType(
		"netip.Addr",
		() => new Addr(),
		[{ name: "AppendBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "AppendText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "AppendTo", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "As16", args: [], returns: [{ type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 } }] }, { name: "As4", args: [], returns: [{ type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 4 } }] }, { name: "AsSlice", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BitLen", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Compare", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Is4", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Is4In6", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Is6", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsGlobalUnicast", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsInterfaceLocalMulticast", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalMulticast", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalUnicast", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLoopback", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsMulticast", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsPrivate", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsUnspecified", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsValid", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Less", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalBinary", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "MarshalText", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "Next", args: [], returns: [{ type: "netip.Addr" }] }, { name: "Prefix", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "netip.Prefix" }, { type: "error" }] }, { name: "Prev", args: [], returns: [{ type: "netip.Addr" }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "StringExpanded", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Unmap", args: [], returns: [{ type: "netip.Addr" }] }, { name: "UnmarshalBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "UnmarshalText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "WithZone", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "netip.Addr" }] }, { name: "Zone", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "appendTo4", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "appendTo4In6", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "appendTo6", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "hasZone", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "isZero", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "marshalBinarySize", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "string4", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "string4In6", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "string6", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "v4", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint8" } }] }, { name: "v6", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint8" } }] }, { name: "v6u16", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "withoutZone", args: [], returns: [{ type: "netip.Addr" }] }],
		Addr,
		[{ name: "addr", key: "addr", type: "netip.uint128" }, { name: "z", key: "z", type: "unique.Handle" }]
	)
}

export class addrDetail {
	public get isV6(): boolean {
		return this._fields.isV6.value
	}
	public set isV6(value: boolean) {
		this._fields.isV6.value = value
	}

	public get zoneV6(): string {
		return this._fields.zoneV6.value
	}
	public set zoneV6(value: string) {
		this._fields.zoneV6.value = value
	}

	public _fields: {
		isV6: $.VarRef<boolean>
		zoneV6: $.VarRef<string>
	}

	constructor(init?: Partial<{isV6?: boolean, zoneV6?: string}>) {
		this._fields = {
			isV6: $.varRef(init?.isV6 ?? (false as boolean)),
			zoneV6: $.varRef(init?.zoneV6 ?? ("" as string))
		}
	}

	public clone(): addrDetail {
		const cloned = new addrDetail()
		cloned._fields = {
			isV6: $.varRef(this._fields.isV6.value),
			zoneV6: $.varRef(this._fields.zoneV6.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"netip.addrDetail",
		() => new addrDetail(),
		[],
		addrDetail,
		[{ name: "isV6", key: "isV6", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "zoneV6", key: "zoneV6", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export class parseAddrError {
	public get _in(): string {
		return this._fields._in.value
	}
	public set _in(value: string) {
		this._fields._in.value = value
	}

	public get msg(): string {
		return this._fields.msg.value
	}
	public set msg(value: string) {
		this._fields.msg.value = value
	}

	public get at(): string {
		return this._fields.at.value
	}
	public set at(value: string) {
		this._fields.at.value = value
	}

	public _fields: {
		_in: $.VarRef<string>
		msg: $.VarRef<string>
		at: $.VarRef<string>
	}

	constructor(init?: Partial<{_in?: string, msg?: string, at?: string}>) {
		this._fields = {
			_in: $.varRef(init?._in ?? ("" as string)),
			msg: $.varRef(init?.msg ?? ("" as string)),
			at: $.varRef(init?.at ?? ("" as string))
		}
	}

	public clone(): parseAddrError {
		const cloned = new parseAddrError()
		cloned._fields = {
			_in: $.varRef(this._fields._in.value),
			msg: $.varRef(this._fields.msg.value),
			at: $.varRef(this._fields.at.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const err = this
		let q: ((s: string) => string | globalThis.Promise<string>) | null = strconv.Quote
		if (!$.stringEqual(err.at, "")) {
			return ((((("ParseAddr(" + await q!(err._in)) + "): ") + err.msg) + " (at ") + await q!(err.at)) + ")"
		}
		return (("ParseAddr(" + await q!(err._in)) + "): ") + err.msg
	}

	static __typeInfo = $.registerStructType(
		"netip.parseAddrError",
		() => new parseAddrError(),
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		parseAddrError,
		[{ name: "in", key: "_in", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "msg", key: "msg", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "at", key: "at", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export class AddrPort {
	public get ip(): Addr {
		return this._fields.ip.value
	}
	public set ip(value: Addr) {
		this._fields.ip.value = value
	}

	public get port(): number {
		return this._fields.port.value
	}
	public set port(value: number) {
		this._fields.port.value = value
	}

	public _fields: {
		ip: $.VarRef<Addr>
		port: $.VarRef<number>
	}

	constructor(init?: Partial<{ip?: Addr, port?: number}>) {
		this._fields = {
			ip: $.varRef(init?.ip ? $.markAsStructValue($.cloneStructValue(init.ip)) : $.markAsStructValue(new Addr())),
			port: $.varRef(init?.port ?? (0 as number))
		}
	}

	public clone(): AddrPort {
		const cloned = new AddrPort()
		cloned._fields = {
			ip: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ip.value))),
			port: $.varRef(this._fields.port.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Addr(): Addr {
		const p = this
		return $.markAsStructValue($.cloneStructValue(p.ip))
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const p = this
		let __goscriptTuple1: any = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).AppendBinary(b)
		b = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		return [byteorder.LEAppendUint16(b, $.uint($.markAsStructValue($.cloneStructValue(p)).Port(), 16)), null]
	}

	public AppendText(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const p = this
		return [$.markAsStructValue($.cloneStructValue(p)).AppendTo(b), null]
	}

	public AppendTo(b: $.Slice<number>): $.Slice<number> {
		const p = this
		switch (p.ip.z) {
			case z0:
			{
				return b
				break
			}
			case z4:
			{
				b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4(b)
				break
			}
			default:
			{
				b = $.append(b, $.uint(91, 8))
				if ($.markAsStructValue($.cloneStructValue(p.ip)).Is4In6()) {
					b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4In6(b)
				} else {
					b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo6(b)
				}
				b = $.append(b, $.uint(93, 8))
				break
			}
		}
		b = $.append(b, $.uint(58, 8))
		b = strconv.AppendUint(b, $.uint64(p.port), 10)
		return b
	}

	public Compare(p2: AddrPort): number {
		const p = this
		{
			let c = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).Compare($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p2)).Addr())))
			if (c != 0) {
				return c
			}
		}
		return cmp.Compare($.uint($.markAsStructValue($.cloneStructValue(p)).Port(), 16), $.uint($.markAsStructValue($.cloneStructValue(p2)).Port(), 16))
	}

	public IsValid(): boolean {
		const p = this
		return $.markAsStructValue($.cloneStructValue(p.ip)).IsValid()
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const p = this
		return $.markAsStructValue($.cloneStructValue(p)).AppendBinary($.makeSlice<number>(0, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).marshalBinarySize() + 2, "byte"))
	}

	public MarshalText(): [$.Slice<number>, $.GoError] {
		const p = this
		let buf: $.Slice<number> = $.arrayToSlice<number>([])
		switch (p.ip.z) {
			case z0:
			{
				break
			}
			case z4:
			{
				const maxCap: number = 21
				buf = $.makeSlice<number>(0, 21, "byte")
				break
			}
			default:
			{
				const maxCap: number = 54
				buf = $.makeSlice<number>(0, 54, "byte")
				break
			}
		}
		return $.markAsStructValue($.cloneStructValue(p)).AppendText(buf)
	}

	public Port(): number {
		const p = this
		return $.uint(p.port, 16)
	}

	public String(): string {
		const p = this
		let b: $.Slice<number> = null as $.Slice<number>
		switch (p.ip.z) {
			case z0:
			{
				return "invalid AddrPort"
				break
			}
			case z4:
			{
				const max: number = 21
				b = $.makeSlice<number>(0, 21, "byte")
				b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4(b)
				break
			}
			default:
			{
				if ($.markAsStructValue($.cloneStructValue(p.ip)).Is4In6()) {
					const max: number = 37
					b = $.makeSlice<number>(0, 37, "byte")
					b = $.append(b, $.uint(91, 8))
					b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4In6(b)
				} else {
					const max: number = 54
					b = $.makeSlice<number>(0, 54, "byte")
					b = $.append(b, $.uint(91, 8))
					b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo6(b)
				}
				b = $.append(b, $.uint(93, 8))
				break
			}
		}
		b = $.append(b, $.uint(58, 8))
		b = strconv.AppendUint(b, $.uint64(p.port), 10)
		return $.bytesToString(b)
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let p: AddrPort | $.VarRef<AddrPort> | null = this
		if ($.len(b) < 2) {
			return errors.New("unexpected slice size")
		}
		let addr: $.VarRef<Addr> = $.varRef($.markAsStructValue(new Addr()))
		let err = addr.value.UnmarshalBinary($.goSlice(b, undefined, $.len(b) - 2))
		if (err != null) {
			return err
		}
		$.assignStruct($.pointerValue<AddrPort>(p), $.markAsStructValue($.cloneStructValue(AddrPortFrom($.markAsStructValue($.cloneStructValue(addr.value)), $.uint(byteorder.LEUint16($.goSlice(b, $.len(b) - 2, undefined)), 16)))))
		return null
	}

	public UnmarshalText(text: $.Slice<number>): $.GoError {
		let p: AddrPort | $.VarRef<AddrPort> | null = this
		if ($.len(text) == 0) {
			$.assignStruct($.pointerValue<AddrPort>(p), $.markAsStructValue(new AddrPort()))
			return null
		}
		let err: $.GoError = null as $.GoError
		let __goscriptTuple2: any = ParseAddrPort($.bytesToString(text))
		$.assignStruct($.pointerValue<AddrPort>(p), __goscriptTuple2[0])
		err = __goscriptTuple2[1]
		return err
	}

	static __typeInfo = $.registerStructType(
		"netip.AddrPort",
		() => new AddrPort(),
		[{ name: "Addr", args: [], returns: [{ type: "netip.Addr" }] }, { name: "AppendBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "AppendText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "AppendTo", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Compare", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "IsValid", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalBinary", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "MarshalText", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "Port", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "UnmarshalText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }],
		AddrPort,
		[{ name: "ip", key: "ip", type: "netip.Addr" }, { name: "port", key: "port", type: { kind: $.TypeKind.Basic, name: "uint16" } }]
	)
}

export class Prefix {
	public get ip(): Addr {
		return this._fields.ip.value
	}
	public set ip(value: Addr) {
		this._fields.ip.value = value
	}

	// bitsPlusOne stores the prefix bit length plus one.
	// A Prefix is valid if and only if bitsPlusOne is non-zero.
	public get bitsPlusOne(): number {
		return this._fields.bitsPlusOne.value
	}
	public set bitsPlusOne(value: number) {
		this._fields.bitsPlusOne.value = value
	}

	public _fields: {
		ip: $.VarRef<Addr>
		bitsPlusOne: $.VarRef<number>
	}

	constructor(init?: Partial<{ip?: Addr, bitsPlusOne?: number}>) {
		this._fields = {
			ip: $.varRef(init?.ip ? $.markAsStructValue($.cloneStructValue(init.ip)) : $.markAsStructValue(new Addr())),
			bitsPlusOne: $.varRef(init?.bitsPlusOne ?? (0 as number))
		}
	}

	public clone(): Prefix {
		const cloned = new Prefix()
		cloned._fields = {
			ip: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ip.value))),
			bitsPlusOne: $.varRef(this._fields.bitsPlusOne.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Addr(): Addr {
		const p = this
		return $.markAsStructValue($.cloneStructValue(p.ip))
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const p = this
		let __goscriptTuple5: any = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).withoutZone())).AppendBinary(b)
		b = __goscriptTuple5[0]
		let err = __goscriptTuple5[1]
		if (err != null) {
			return [null, err]
		}
		return [$.append(b, $.uint($.uint($.markAsStructValue($.cloneStructValue(p)).Bits(), 8), 8)), null]
	}

	public AppendText(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const p = this
		return [$.markAsStructValue($.cloneStructValue(p)).AppendTo(b), null]
	}

	public AppendTo(b: $.Slice<number>): $.Slice<number> {
		const p = this
		if ($.markAsStructValue($.cloneStructValue(p)).isZero()) {
			return b
		}
		if (!$.markAsStructValue($.cloneStructValue(p)).IsValid()) {
			return $.appendSlice(b, $.stringToBytes("invalid Prefix"))
		}

		// p.ip is non-nil, because p is valid.
		if ($.comparableEqual(p.ip.z, z4)) {
			b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4(b)
		} else {
			if ($.markAsStructValue($.cloneStructValue(p.ip)).Is4In6()) {
				b = $.appendSlice(b, $.stringToBytes("::ffff:"))
				b = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p.ip)).Unmap())).appendTo4(b)
			} else {
				b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo6(b)
			}
		}

		b = $.append(b, $.uint(47, 8))
		b = appendDecimal(b, $.uint($.uint($.markAsStructValue($.cloneStructValue(p)).Bits(), 8), 8))
		return b
	}

	public Bits(): number {
		const p = this
		return $.int(p.bitsPlusOne) - 1
	}

	public Compare(p2: Prefix): number {
		const p = this
		// Aside from sorting based on the masked address, this use of
		// Addr.Compare also enforces the valid vs. invalid and address
		// family ordering for the prefix.
		{
			let c = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Masked())).Addr())).Compare($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p2)).Masked())).Addr())))
			if (c != 0) {
				return c
			}
		}

		{
			let c = cmp.Compare($.markAsStructValue($.cloneStructValue(p)).Bits(), $.markAsStructValue($.cloneStructValue(p2)).Bits())
			if (c != 0) {
				return c
			}
		}

		return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).Compare($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p2)).Addr())))
	}

	public Contains(ip: Addr): boolean {
		const p = this
		if (!$.markAsStructValue($.cloneStructValue(p)).IsValid() || $.markAsStructValue($.cloneStructValue(ip)).hasZone()) {
			return false
		}
		{
			let f1 = $.markAsStructValue($.cloneStructValue(p.ip)).BitLen()
			let f2 = $.markAsStructValue($.cloneStructValue(ip)).BitLen()
			if (((f1 == 0) || (f2 == 0)) || (f1 != f2)) {
				return false
			}
		}
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			// xor the IP addresses together; mismatched bits are now ones.
			// Shift away the number of bits we don't care about.
			// Shifts in Go are more efficient if the compiler can prove
			// that the shift amount is smaller than the width of the shifted type (64 here).
			// We know that p.bits is in the range 0..32 because p is Valid;
			// the compiler doesn't know that, so mask with 63 to help it.
			// Now truncate to 32 bits, because this is IPv4.
			// If all the bits we care about are equal, the result will be zero.
			return $.uint($.uint($.uint64Shr(($.uint64Xor(ip.addr.lo, p.ip.addr.lo)), ((32 - $.markAsStructValue($.cloneStructValue(p)).Bits()) & 63)), 32), 32) == $.uint(0, 32)
		} else {
			// xor the IP addresses together.
			// Mask away the bits we don't care about.
			// If all the bits we care about are equal, the result will be zero.
			return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip.addr)).xor($.markAsStructValue($.cloneStructValue(p.ip.addr))))).and($.markAsStructValue($.cloneStructValue(__goscript_uint128.mask6($.markAsStructValue($.cloneStructValue(p)).Bits())))))).isZero()
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public IsSingleIP(): boolean {
		const p = this
		return $.markAsStructValue($.cloneStructValue(p)).IsValid() && ($.markAsStructValue($.cloneStructValue(p)).Bits() == $.markAsStructValue($.cloneStructValue(p.ip)).BitLen())
	}

	public IsValid(): boolean {
		const p = this
		return $.uint(p.bitsPlusOne, 8) > $.uint(0, 8)
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const p = this
		// without the zone the max length is 16, plus an additional byte is 17
		return $.markAsStructValue($.cloneStructValue(p)).AppendBinary($.makeSlice<number>(0, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).withoutZone())).marshalBinarySize() + 1, "byte"))
	}

	public MarshalText(): [$.Slice<number>, $.GoError] {
		const p = this
		let buf: $.Slice<number> = $.arrayToSlice<number>([])
		switch (p.ip.z) {
			case z0:
			{
				break
			}
			case z4:
			{
				const maxCap: number = 18
				buf = $.makeSlice<number>(0, 18, "byte")
				break
			}
			default:
			{
				const maxCap: number = 50
				buf = $.makeSlice<number>(0, 50, "byte")
				break
			}
		}
		return $.markAsStructValue($.cloneStructValue(p)).AppendText(buf)
	}

	public Masked(): Prefix {
		const p = this
		let [m, ] = $.markAsStructValue($.cloneStructValue(p.ip)).Prefix($.markAsStructValue($.cloneStructValue(p)).Bits())
		return $.markAsStructValue($.cloneStructValue(m))
	}

	public Overlaps(o: Prefix): boolean {
		let p: Prefix = this
		if (!$.markAsStructValue($.cloneStructValue(p)).IsValid() || !$.markAsStructValue($.cloneStructValue(o)).IsValid()) {
			return false
		}
		if ($.comparableEqual(p, o)) {
			return true
		}
		if ($.markAsStructValue($.cloneStructValue(p.ip)).Is4() != $.markAsStructValue($.cloneStructValue(o.ip)).Is4()) {
			return false
		}
		let minBits: number = 0
		{
			let pb = $.markAsStructValue($.cloneStructValue(p)).Bits()
			let ob = $.markAsStructValue($.cloneStructValue(o)).Bits()
			if (pb < ob) {
				minBits = pb
			} else {
				minBits = ob
			}
		}
		if (minBits == 0) {
			return true
		}
		// One of these Prefix calls might look redundant, but we don't require
		// that p and o values are normalized (via Prefix.Masked) first,
		// so the Prefix call on the one that's already minBits serves to zero
		// out any remaining bits in IP.
		let err: $.GoError = null as $.GoError
		{
			let __goscriptTuple6: any = $.markAsStructValue($.cloneStructValue(p.ip)).Prefix(minBits)
			p = __goscriptTuple6[0]
			err = __goscriptTuple6[1]
			if (err != null) {
				return false
			}
		}
		{
			let __goscriptTuple7: any = $.markAsStructValue($.cloneStructValue(o.ip)).Prefix(minBits)
			o = __goscriptTuple7[0]
			err = __goscriptTuple7[1]
			if (err != null) {
				return false
			}
		}
		return $.comparableEqual(p.ip, o.ip)
	}

	public String(): string {
		const p = this
		if (!$.markAsStructValue($.cloneStructValue(p)).IsValid()) {
			return "invalid Prefix"
		}
		return ($.markAsStructValue($.cloneStructValue(p.ip)).String() + "/") + strconv.Itoa($.markAsStructValue($.cloneStructValue(p)).Bits())
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let p: Prefix | $.VarRef<Prefix> | null = this
		if ($.len(b) < 1) {
			return errors.New("unexpected slice size")
		}
		let addr: $.VarRef<Addr> = $.varRef($.markAsStructValue(new Addr()))
		let err = addr.value.UnmarshalBinary($.goSlice(b, undefined, $.len(b) - 1))
		if (err != null) {
			return err
		}
		$.assignStruct($.pointerValue<Prefix>(p), $.markAsStructValue($.cloneStructValue(PrefixFrom($.markAsStructValue($.cloneStructValue(addr.value)), $.int($.arrayIndex(b!, $.len(b) - 1))))))
		return null
	}

	public UnmarshalText(text: $.Slice<number>): $.GoError {
		let p: Prefix | $.VarRef<Prefix> | null = this
		if ($.len(text) == 0) {
			$.assignStruct($.pointerValue<Prefix>(p), $.markAsStructValue(new Prefix()))
			return null
		}
		let err: $.GoError = null as $.GoError
		let __goscriptTuple8: any = ParsePrefix($.bytesToString(text))
		$.assignStruct($.pointerValue<Prefix>(p), __goscriptTuple8[0])
		err = __goscriptTuple8[1]
		return err
	}

	public isZero(): boolean {
		const p = this
		return $.comparableEqual(p, $.markAsStructValue(new Prefix()))
	}

	static __typeInfo = $.registerStructType(
		"netip.Prefix",
		() => new Prefix(),
		[{ name: "Addr", args: [], returns: [{ type: "netip.Addr" }] }, { name: "AppendBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "AppendText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "AppendTo", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Bits", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Compare", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Contains", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsSingleIP", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsValid", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalBinary", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "MarshalText", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "Masked", args: [], returns: [{ type: "netip.Prefix" }] }, { name: "Overlaps", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "UnmarshalText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "isZero", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		Prefix,
		[{ name: "ip", key: "ip", type: "netip.Addr" }, { name: "bitsPlusOne", key: "bitsPlusOne", type: { kind: $.TypeKind.Basic, name: "uint8" } }]
	)
}

export class parsePrefixError {
	public get _in(): string {
		return this._fields._in.value
	}
	public set _in(value: string) {
		this._fields._in.value = value
	}

	public get msg(): string {
		return this._fields.msg.value
	}
	public set msg(value: string) {
		this._fields.msg.value = value
	}

	public _fields: {
		_in: $.VarRef<string>
		msg: $.VarRef<string>
	}

	constructor(init?: Partial<{_in?: string, msg?: string}>) {
		this._fields = {
			_in: $.varRef(init?._in ?? ("" as string)),
			msg: $.varRef(init?.msg ?? ("" as string))
		}
	}

	public clone(): parsePrefixError {
		const cloned = new parsePrefixError()
		cloned._fields = {
			_in: $.varRef(this._fields._in.value),
			msg: $.varRef(this._fields.msg.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const err = this
		return (("netip.ParsePrefix(" + strconv.Quote(err._in)) + "): ") + err.msg
	}

	static __typeInfo = $.registerStructType(
		"netip.parsePrefixError",
		() => new parsePrefixError(),
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		parsePrefixError,
		[{ name: "in", key: "_in", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "msg", key: "msg", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export const digits: string = "0123456789abcdef"

export let z0: _unique.Handle<addrDetail> = $.markAsStructValue(new _unique.Handle<addrDetail>())

export function __goscript_set_z0(__goscriptValue: _unique.Handle<addrDetail>): void {
	z0 = __goscriptValue
}

export let z4: _unique.Handle<addrDetail> = $.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new addrDetail()))))

export function __goscript_set_z4(__goscriptValue: _unique.Handle<addrDetail>): void {
	z4 = __goscriptValue
}

export let z6noz: _unique.Handle<addrDetail> = $.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new addrDetail({isV6: true})))))

export function __goscript_set_z6noz(__goscriptValue: _unique.Handle<addrDetail>): void {
	z6noz = __goscriptValue
}

export function IPv6LinkLocalAllNodes(): Addr {
	return $.markAsStructValue($.cloneStructValue(AddrFrom16(new Uint8Array([$.uint(0xff, 8), $.uint(0x02, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, $.uint(0x01, 8)]))))
}

export function IPv6LinkLocalAllRouters(): Addr {
	return $.markAsStructValue($.cloneStructValue(AddrFrom16(new Uint8Array([$.uint(0xff, 8), $.uint(0x02, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, $.uint(0x02, 8)]))))
}

export function IPv6Loopback(): Addr {
	return $.markAsStructValue($.cloneStructValue(AddrFrom16(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, $.uint(0x01, 8)]))))
}

export function IPv6Unspecified(): Addr {
	return $.markAsStructValue(new Addr({z: $.markAsStructValue($.cloneStructValue(z6noz))}))
}

export function IPv4Unspecified(): Addr {
	return $.markAsStructValue($.cloneStructValue(AddrFrom4(new Uint8Array(4))))
}

export function AddrFrom4(addr: Uint8Array): Addr {
	return $.markAsStructValue(new Addr({addr: $.markAsStructValue(new __goscript_uint128.uint128({hi: 0n, lo: $.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(0xffff00000000, ($.uint64Shl($.uint64($.arrayIndex(addr, 0)), 24)))), ($.uint64Shl($.uint64($.arrayIndex(addr, 1)), 16)))), ($.uint64Shl($.uint64($.arrayIndex(addr, 2)), 8)))), $.uint64($.arrayIndex(addr, 3)))})), z: $.markAsStructValue($.cloneStructValue(z4))}))
}

export function AddrFrom16(addr: Uint8Array): Addr {
	return $.markAsStructValue(new Addr({addr: (() => { const __goscriptLiteralField0 = byteorder.BEUint64($.goSlice(addr, undefined, 8)); const __goscriptLiteralField1 = byteorder.BEUint64($.goSlice(addr, 8, undefined)); return $.markAsStructValue(new __goscript_uint128.uint128({hi: __goscriptLiteralField0, lo: __goscriptLiteralField1})) })(), z: $.markAsStructValue($.cloneStructValue(z6noz))}))
}

export function ParseAddr(s: string): [Addr, $.GoError] {
	for (let i = 0; i < $.len(s); i++) {
		switch ($.indexStringOrBytes(s, i)) {
			case 46:
			{
				return parseIPv4(s)
				break
			}
			case 58:
			{
				return parseIPv6(s)
				break
			}
			case 37:
			{
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: s, msg: "missing IPv6 address"})), "netip.parseAddrError")]
				break
			}
		}
	}
	return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: s, msg: "unable to parse IP"})), "netip.parseAddrError")]
}

export function MustParseAddr(s: string): Addr {
	let [ip, err] = ParseAddr(s)
	if (err != null) {
		$.panic((err as any))
	}
	return $.markAsStructValue($.cloneStructValue(ip))
}

export function parseIPv4Fields(_in: string, off: number, end: number, fields: $.Slice<number>): $.GoError {
	let val: number = 0
	let pos: number = 0
	let digLen: number = 0
	let s = $.sliceStringOrBytes(_in, off, end)
	for (let i = 0; i < $.len(s); i++) {
		if (($.uint($.indexStringOrBytes(s, i), 8) >= $.uint(48, 8)) && ($.uint($.indexStringOrBytes(s, i), 8) <= $.uint(57, 8))) {
			if ((digLen == 1) && (val == 0)) {
				return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 field has octet with leading zero"})), "netip.parseAddrError")
			}
			val = ((val * 10) + $.int($.indexStringOrBytes(s, i))) - 48
			digLen++
			if (val > 255) {
				return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 field has value >255"})), "netip.parseAddrError")
			}
		} else {
			if ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(46, 8)) {
				// .1.2.3
				// 1.2.3.
				// 1..2.3
				if (((i == 0) || (i == ($.len(s) - 1))) || ($.uint($.indexStringOrBytes(s, i - 1), 8) == $.uint(46, 8))) {
					return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 field must have at least one digit", at: $.sliceStringOrBytes(s, i, undefined)})), "netip.parseAddrError")
				}
				// 1.2.3.4.5
				if (pos == 3) {
					return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 address too long"})), "netip.parseAddrError")
				}
				fields![pos] = $.uint($.uint(val, 8), 8)
				pos++
				val = 0
				digLen = 0
			} else {
				return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "unexpected character", at: $.sliceStringOrBytes(s, i, undefined)})), "netip.parseAddrError")
			}
		}
	}
	if (pos < 3) {
		return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 address too short"})), "netip.parseAddrError")
	}
	fields![3] = $.uint($.uint(val, 8), 8)
	return null
}

export function parseIPv4(s: string): [Addr, $.GoError] {
	let ip: Addr = $.markAsStructValue(new Addr())
	let err: $.GoError = null as $.GoError
	let fields: Uint8Array = new Uint8Array(4)
	err = parseIPv4Fields(s, 0, $.len(s), $.goSlice(fields, undefined, undefined))
	if (err != null) {
		return [$.markAsStructValue(new Addr()), err]
	}
	return [$.markAsStructValue($.cloneStructValue(AddrFrom4(fields))), null]
}

export function parseIPv6(_in: string): [Addr, $.GoError] {
	let s = _in

	// Split off the zone right from the start. Yes it's a second scan
	// of the string, but trying to handle it inline makes a bunch of
	// other inner loop conditionals more expensive, and it ends up
	// being slower.
	let zone = ""
	let i = bytealg.IndexByteString(s, $.uint(37, 8))
	if (i != -1) {
		let __goscriptAssign1_0: string = $.sliceStringOrBytes(s, undefined, i)
		let __goscriptAssign1_1: string = $.sliceStringOrBytes(s, i + 1, undefined)
		s = __goscriptAssign1_0
		zone = __goscriptAssign1_1
		if ($.stringEqual(zone, "")) {
			// Not allowed to have an empty zone if explicitly specified.
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "zone must be a non-empty string"})), "netip.parseAddrError")]
		}
	}

	let ip: Uint8Array = new Uint8Array(16)
	let ellipsis = -1

	// Might have leading ellipsis
	if ((($.len(s) >= 2) && ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(58, 8))) && ($.uint($.indexStringOrBytes(s, 1), 8) == $.uint(58, 8))) {
		ellipsis = 0
		s = $.sliceStringOrBytes(s, 2, undefined)
		// Might be only ellipsis
		if ($.len(s) == 0) {
			return [$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(IPv6Unspecified())).WithZone(zone))), null]
		}
	}

	// Loop, parsing hex numbers followed by colon.
	i = 0
	while (i < 16) {
		// Hex number. Similar to parseIPv4, inlining the hex number
		// parsing yields a significant performance increase.
		let off = 0
		let acc = $.uint($.uint(0, 32), 32)
		for (; off < $.len(s); off++) {
			let c = $.uint($.indexStringOrBytes(s, off), 8)
			if (($.uint(c, 8) >= $.uint(48, 8)) && ($.uint(c, 8) <= $.uint(57, 8))) {
				acc = $.uint((acc << 4) + $.uint(c - 48, 32), 32)
			} else {
				if (($.uint(c, 8) >= $.uint(97, 8)) && ($.uint(c, 8) <= $.uint(102, 8))) {
					acc = $.uint((acc << 4) + $.uint((c - 97) + 10, 32), 32)
				} else {
					if (($.uint(c, 8) >= $.uint(65, 8)) && ($.uint(c, 8) <= $.uint(70, 8))) {
						acc = $.uint((acc << 4) + $.uint((c - 65) + 10, 32), 32)
					} else {
						break
					}
				}
			}
			if (off > 3) {
				//more than 4 digits in group, fail.
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "each group must have 4 or less digits", at: s})), "netip.parseAddrError")]
			}
			if ($.uint(acc, 32) > $.uint(math.MaxUint16, 32)) {
				// Overflow, fail.
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv6 field has value >=2^16", at: s})), "netip.parseAddrError")]
			}
		}
		if (off == 0) {
			// No digits found, fail.
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "each colon-separated field must have at least one digit", at: s})), "netip.parseAddrError")]
		}

		// If followed by dot, might be in trailing IPv4.
		if ((off < $.len(s)) && ($.uint($.indexStringOrBytes(s, off), 8) == $.uint(46, 8))) {
			if ((ellipsis < 0) && (i != 12)) {
				// Not the right place.
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "embedded IPv4 address must replace the final 2 fields of the address", at: s})), "netip.parseAddrError")]
			}
			if ((i + 4) > 16) {
				// Not enough room.
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "too many hex fields to fit an embedded IPv4 at the end of the address", at: s})), "netip.parseAddrError")]
			}

			let end = $.len(_in)
			if ($.len(zone) > 0) {
				end = end - ($.len(zone) + 1)
			}
			let err = parseIPv4Fields(_in, end - $.len(s), end, $.goSlice(ip, i, i + 4))
			if (err != null) {
				return [$.markAsStructValue(new Addr()), err]
			}
			s = ""
			i = i + (4)
			break
		}

		// Save this 16-bit chunk.
		ip[i] = $.uint($.uint($.uintShr(acc, 8, 32), 8), 8)
		ip[i + 1] = $.uint($.uint(acc, 8), 8)
		i = i + (2)

		// Stop at end of string.
		s = $.sliceStringOrBytes(s, off, undefined)
		if ($.len(s) == 0) {
			break
		}

		// Otherwise must be followed by colon and more.
		if ($.uint($.indexStringOrBytes(s, 0), 8) != $.uint(58, 8)) {
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "unexpected character, want colon", at: s})), "netip.parseAddrError")]
		} else {
			if ($.len(s) == 1) {
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "colon must be followed by more characters", at: s})), "netip.parseAddrError")]
			}
		}
		s = $.sliceStringOrBytes(s, 1, undefined)

		// Look for ellipsis.
		if ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(58, 8)) {
			if (ellipsis >= 0) {
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "multiple :: in address", at: s})), "netip.parseAddrError")]
			}
			ellipsis = i
			s = $.sliceStringOrBytes(s, 1, undefined)
			if ($.len(s) == 0) {
				break
			}
		}
	}

	// Must have used entire string.
	if ($.len(s) != 0) {
		return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "trailing garbage after address", at: s})), "netip.parseAddrError")]
	}

	// If didn't parse enough, expand ellipsis.
	if (i < 16) {
		if (ellipsis < 0) {
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "address string too short"})), "netip.parseAddrError")]
		}
		let n = 16 - i
		for (let j = i - 1; j >= ellipsis; j--) {
			ip[j + n] = $.uint($.arrayIndex(ip, j), 8)
		}
		$.clear($.goSlice(ip, ellipsis, ellipsis + n))
	} else {
		if (ellipsis >= 0) {
			// Ellipsis must represent at least one 0 group.
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "the :: must expand to at least one field of zeros"})), "netip.parseAddrError")]
		}
	}
	return [$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(AddrFrom16(ip))).WithZone(zone))), null]
}

export function AddrFromSlice(slice: $.Slice<number>): [Addr, boolean] {
	let ip: Addr = $.markAsStructValue(new Addr())
	let ok: boolean = false
	switch ($.len(slice)) {
		case 4:
		{
			return [$.markAsStructValue($.cloneStructValue(AddrFrom4(($.sliceToArray<number>(slice, 4, "byte") as Uint8Array)))), true]
			break
		}
		case 16:
		{
			return [$.markAsStructValue($.cloneStructValue(AddrFrom16(($.sliceToArray<number>(slice, 16, "byte") as Uint8Array)))), true]
			break
		}
	}
	return [$.markAsStructValue(new Addr()), false]
}

export function appendDecimal(b: $.Slice<number>, x: number): $.Slice<number> {
	// Using this function rather than strconv.AppendUint makes IPv4
	// string building 2x faster.

	if ($.uint(x, 8) >= $.uint(100, 8)) {
		b = $.append(b, $.uint($.indexStringOrBytes("0123456789abcdef", Math.trunc(x / 100)), 8))
	}
	if ($.uint(x, 8) >= $.uint(10, 8)) {
		b = $.append(b, $.uint($.indexStringOrBytes("0123456789abcdef", (Math.trunc(x / 10)) % 10), 8))
	}
	return $.append(b, $.uint($.indexStringOrBytes("0123456789abcdef", x % 10), 8))
}

export function appendHex(b: $.Slice<number>, x: number): $.Slice<number> {
	// Using this function rather than strconv.AppendUint makes IPv6
	// string building 2x faster.

	if ($.uint(x, 16) >= $.uint(0x1000, 16)) {
		b = $.append(b, $.uint($.indexStringOrBytes("0123456789abcdef", $.uintShr(x, 12, 16)), 8))
	}
	if ($.uint(x, 16) >= $.uint(0x100, 16)) {
		b = $.append(b, $.uint($.indexStringOrBytes("0123456789abcdef", ($.uintShr(x, 8, 16)) & 0xf), 8))
	}
	if ($.uint(x, 16) >= $.uint(0x10, 16)) {
		b = $.append(b, $.uint($.indexStringOrBytes("0123456789abcdef", ($.uintShr(x, 4, 16)) & 0xf), 8))
	}
	return $.append(b, $.uint($.indexStringOrBytes("0123456789abcdef", x & 0xf), 8))
}

export function appendHexPad(b: $.Slice<number>, x: number): $.Slice<number> {
	return $.append(b, $.uint($.indexStringOrBytes("0123456789abcdef", $.uintShr(x, 12, 16)), 8), $.uint($.indexStringOrBytes("0123456789abcdef", ($.uintShr(x, 8, 16)) & 0xf), 8), $.uint($.indexStringOrBytes("0123456789abcdef", ($.uintShr(x, 4, 16)) & 0xf), 8), $.uint($.indexStringOrBytes("0123456789abcdef", x & 0xf), 8))
}

export function AddrPortFrom(ip: Addr, port: number): AddrPort {
	return $.markAsStructValue(new AddrPort({ip: $.markAsStructValue($.cloneStructValue(ip)), port: $.uint(port, 16)}))
}

export function splitAddrPort(s: string): [string, string, boolean, $.GoError] {
	let ip: string = ""
	let port: string = ""
	let v6: boolean = false
	let err: $.GoError = null as $.GoError
	let i = bytealg.LastIndexByteString(s, $.uint(58, 8))
	if (i == -1) {
		return ["", "", false, errors.New("not an ip:port")]
	}

	let __goscriptAssign2_0: string = $.sliceStringOrBytes(s, undefined, i)
	let __goscriptAssign2_1: string = $.sliceStringOrBytes(s, i + 1, undefined)
	ip = __goscriptAssign2_0
	port = __goscriptAssign2_1
	if ($.len(ip) == 0) {
		return ["", "", false, errors.New("no IP")]
	}
	if ($.len(port) == 0) {
		return ["", "", false, errors.New("no port")]
	}
	if ($.uint($.indexStringOrBytes(ip, 0), 8) == $.uint(91, 8)) {
		if (($.len(ip) < 2) || ($.uint($.indexStringOrBytes(ip, $.len(ip) - 1), 8) != $.uint(93, 8))) {
			return ["", "", false, errors.New("missing ]")]
		}
		ip = $.sliceStringOrBytes(ip, 1, $.len(ip) - 1)
		v6 = true
	}

	return [ip, port, v6, null]
}

export function ParseAddrPort(s: string): [AddrPort, $.GoError] {
	let ipp: AddrPort = $.markAsStructValue(new AddrPort())
	let [ip, port, v6, err] = splitAddrPort(s)
	if (err != null) {
		return [$.markAsStructValue($.cloneStructValue(ipp)), err]
	}
	let __goscriptTuple3: any = strconv.ParseUint(port, 10, 16)
	let port16 = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	if (err != null) {
		return [$.markAsStructValue($.cloneStructValue(ipp)), errors.New((("invalid port " + strconv.Quote(port)) + " parsing ") + strconv.Quote(s))]
	}
	ipp.port = $.uint($.uint(port16, 16), 16)
	let __goscriptTuple4: any = ParseAddr(ip)
	ipp.ip = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		return [$.markAsStructValue(new AddrPort()), err]
	}
	if (v6 && $.markAsStructValue($.cloneStructValue(ipp.ip)).Is4()) {
		return [$.markAsStructValue(new AddrPort()), errors.New(("invalid ip:port " + strconv.Quote(s)) + ", square brackets can only be used with IPv6 addresses")]
	} else {
		if (!v6 && $.markAsStructValue($.cloneStructValue(ipp.ip)).Is6()) {
			return [$.markAsStructValue(new AddrPort()), errors.New(("invalid ip:port " + strconv.Quote(s)) + ", IPv6 addresses must be surrounded by square brackets")]
		}
	}
	return [$.markAsStructValue($.cloneStructValue(ipp)), null]
}

export function MustParseAddrPort(s: string): AddrPort {
	let [ip, err] = ParseAddrPort(s)
	if (err != null) {
		$.panic((err as any))
	}
	return $.markAsStructValue($.cloneStructValue(ip))
}

export function PrefixFrom(ip: Addr, bits: number): Prefix {
	let bitsPlusOne: number = 0
	if ((!$.markAsStructValue($.cloneStructValue(ip)).isZero() && (bits >= 0)) && (bits <= $.markAsStructValue($.cloneStructValue(ip)).BitLen())) {
		bitsPlusOne = $.uint($.uint(bits, 8) + 1, 8)
	}
	return (() => { const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).withoutZone())); return $.markAsStructValue(new Prefix({ip: __goscriptLiteralField2, bitsPlusOne: $.uint(bitsPlusOne, 8)})) })()
}

export function ParsePrefix(s: string): [Prefix, $.GoError] {
	let i = bytealg.LastIndexByteString(s, $.uint(47, 8))
	if (i < 0) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>($.markAsStructValue(new parsePrefixError({_in: s, msg: "no '/'"})), "netip.parsePrefixError")]
	}
	let [ip, err] = ParseAddr($.sliceStringOrBytes(s, undefined, i))
	if (err != null) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField3 = $.pointerValue<Exclude<$.GoError, null>>(err).Error(); return $.markAsStructValue(new parsePrefixError({_in: s, msg: __goscriptLiteralField3})) })(), "netip.parsePrefixError")]
	}
	// IPv6 zones are not allowed: https://go.dev/issue/51899
	if ($.markAsStructValue($.cloneStructValue(ip)).Is6() && (!$.comparableEqual(ip.z, z6noz))) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>($.markAsStructValue(new parsePrefixError({_in: s, msg: "IPv6 zones cannot be present in a prefix"})), "netip.parsePrefixError")]
	}

	let bitsStr = $.sliceStringOrBytes(s, i + 1, undefined)

	// strconv.Atoi accepts a leading sign and leading zeroes, but we don't want that.
	if (($.len(bitsStr) > 1) && (($.uint($.indexStringOrBytes(bitsStr, 0), 8) < $.uint(49, 8)) || ($.uint($.indexStringOrBytes(bitsStr, 0), 8) > $.uint(57, 8)))) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField4 = "bad bits after slash: " + strconv.Quote(bitsStr); return $.markAsStructValue(new parsePrefixError({_in: s, msg: __goscriptLiteralField4})) })(), "netip.parsePrefixError")]
	}

	let __goscriptTuple9: any = strconv.Atoi(bitsStr)
	let bits = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField5 = "bad bits after slash: " + strconv.Quote(bitsStr); return $.markAsStructValue(new parsePrefixError({_in: s, msg: __goscriptLiteralField5})) })(), "netip.parsePrefixError")]
	}
	let maxBits = 32
	if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
		maxBits = 128
	}
	if ((bits < 0) || (bits > maxBits)) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>($.markAsStructValue(new parsePrefixError({_in: s, msg: "prefix length out of range"})), "netip.parsePrefixError")]
	}
	return [$.markAsStructValue($.cloneStructValue(PrefixFrom($.markAsStructValue($.cloneStructValue(ip)), bits))), null]
}

export function MustParsePrefix(s: string): Prefix {
	let [ip, err] = ParsePrefix(s)
	if (err != null) {
		$.panic((err as any))
	}
	return $.markAsStructValue($.cloneStructValue(ip))
}
