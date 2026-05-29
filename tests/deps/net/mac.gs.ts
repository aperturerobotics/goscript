// Generated file based on mac.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_net from "./net.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"
import "./net.gs.ts"
import "./parse.gs.ts"

export type HardwareAddr = $.Slice<number>

export const hexDigit: string = "0123456789abcdef"

export function HardwareAddr_String(a: HardwareAddr): string {
	if ($.len((a as HardwareAddr)) == 0) {
		return ""
	}
	let buf: $.Slice<number> = $.makeSlice<number>(0, ($.len((a as HardwareAddr)) * 3) - 1, "byte")
	for (let __goscriptRangeTarget0 = a, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let b = __goscriptRangeTarget0![i]
		if (i > 0) {
			buf = $.append(buf, $.uint(58, 8))
		}
		buf = $.append(buf, $.uint($.indexStringOrBytes("0123456789abcdef", $.uintShr(b, 4, 8)), 8))
		buf = $.append(buf, $.uint($.indexStringOrBytes("0123456789abcdef", b & 0xF), 8))
	}
	return $.bytesToString(buf)
}

export function ParseMAC(s: string): [HardwareAddr, $.GoError] {
	let hw: HardwareAddr = null as HardwareAddr
	let err: $.GoError = null as $.GoError
	error: {
		if ($.len(s) < 12) {
			break error
		}

		if (($.uint($.indexStringOrBytes(s, 2), 8) == $.uint(58, 8)) || ($.uint($.indexStringOrBytes(s, 2), 8) == $.uint(45, 8))) {
			if ((($.len(s) + 1) % 3) != 0) {
				break error
			}
			let n = Math.trunc(($.len(s) + 1) / 3)
			if (((n != 6) && (n != 8)) && (n != 20)) {
				break error
			}
			hw = ($.makeSlice<number>(n, undefined, "byte") as HardwareAddr)
			for (let x = 0, i = 0; i < n; i++) {
				let ok: boolean = false
				{
					let __goscriptTuple0: any = __goscript_parse.xtoi2($.sliceStringOrBytes(s, x, undefined), $.uint($.indexStringOrBytes(s, 2), 8))
					hw![i] = $.uint(__goscriptTuple0[0], 8)
					ok = __goscriptTuple0[1]
					if (!ok) {
						break error
					}
				}
				x = x + (3)
			}
		} else {
			if ($.uint($.indexStringOrBytes(s, 4), 8) == $.uint(46, 8)) {
				if ((($.len(s) + 1) % 5) != 0) {
					break error
				}
				let n = Math.trunc((2 * ($.len(s) + 1)) / 5)
				if (((n != 6) && (n != 8)) && (n != 20)) {
					break error
				}
				hw = ($.makeSlice<number>(n, undefined, "byte") as HardwareAddr)
				for (let x = 0, i = 0; i < n; i = i + (2)) {
					let ok: boolean = false
					{
						let __goscriptTuple1: any = __goscript_parse.xtoi2($.sliceStringOrBytes(s, x, x + 2), $.uint(0, 8))
						hw![i] = $.uint(__goscriptTuple1[0], 8)
						ok = __goscriptTuple1[1]
						if (!ok) {
							break error
						}
					}
					{
						let __goscriptTuple2: any = __goscript_parse.xtoi2($.sliceStringOrBytes(s, x + 2, undefined), $.uint($.indexStringOrBytes(s, 4), 8))
						hw![i + 1] = $.uint(__goscriptTuple2[0], 8)
						ok = __goscriptTuple2[1]
						if (!ok) {
							break error
						}
					}
					x = x + (5)
				}
			} else {
				if (($.len(s) % 2) != 0) {
					break error
				}

				let n = Math.trunc($.len(s) / 2)
				if (((n != 6) && (n != 8)) && (n != 20)) {
					break error
				}

				hw = ($.makeSlice<number>(Math.trunc($.len(s) / 2), undefined, "byte") as HardwareAddr)
				for (let x = 0, i = 0; i < n; i++) {
					let ok: boolean = false
					{
						let __goscriptTuple3: any = __goscript_parse.xtoi2($.sliceStringOrBytes(s, x, x + 2), $.uint(0, 8))
						hw![i] = $.uint(__goscriptTuple3[0], 8)
						ok = __goscriptTuple3[1]
						if (!ok) {
							break error
						}
					}
					x = x + (2)
				}
			}
		}
		return [(hw as HardwareAddr), null]
	}
	return [(null as HardwareAddr), $.interfaceValue<$.GoError>(new __goscript_net.AddrError({Err: "invalid MAC address", Addr: s}), "*net.AddrError")]
}
