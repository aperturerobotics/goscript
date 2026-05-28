// Generated file based on varint.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"

export const MaxVarintLen16: number = 3

export const MaxVarintLen32: number = 5

export const MaxVarintLen64: number = 10

export function AppendUvarint(buf: $.Slice<number>, x: number): $.Slice<number> {
	while (x >= 0x80) {
		buf = $.append(buf, $.uint($.uint(x, 8) | 0x80, 8))
		x = $.uint64Shr(x, $.uint(7, 64))
	}
	return $.append(buf, $.uint($.uint(x, 8), 8))
}

export function PutUvarint(buf: $.Slice<number>, x: number): number {
	let i = 0
	while (x >= 0x80) {
		buf![i] = $.uint($.uint(x, 8) | 0x80, 8)
		x = $.uint64Shr(x, $.uint(7, 64))
		i++
	}
	buf![i] = $.uint($.uint(x, 8), 8)
	return i + 1
}

export function Uvarint(buf: $.Slice<number>): [number, number] {
	let x: number = 0
	let s: number = 0
	for (let __goscriptRangeTarget0 = buf, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let b = __goscriptRangeTarget0![i]
		if (i == 10) {
			// Catch byte reads past MaxVarintLen64.
			// See issue https://golang.org/issues/41185
			return [$.uint(0, 64), -(i + 1)]
		}
		if (b < 0x80) {
			if ((i == (10 - 1)) && (b > 1)) {
				return [$.uint(0, 64), -(i + 1)]
			}
			return [$.uint($.uint64Or(x, ($.uint64Shl($.uint(b, 64), s))), 64), i + 1]
		}
		x = $.uint64Or(x, $.uint($.uint64Shl($.uint(b & 0x7f, 64), s), 64))
		s = $.uint64Add(s, 7)
	}
	return [$.uint(0, 64), 0]
}

export function AppendVarint(buf: $.Slice<number>, x: number): $.Slice<number> {
	let ux = $.uint($.uint64Shl($.uint(x, 64), 1), 64)
	if (x < 0) {
		ux = $.uint(~ux, 64)
	}
	return AppendUvarint(buf, $.uint(ux, 64))
}

export function PutVarint(buf: $.Slice<number>, x: number): number {
	let ux = $.uint($.uint64Shl($.uint(x, 64), 1), 64)
	if (x < 0) {
		ux = $.uint(~ux, 64)
	}
	return PutUvarint(buf, $.uint(ux, 64))
}

export function Varint(buf: $.Slice<number>): [number, number] {
	let __goscriptTuple0: any = Uvarint(buf)
	let ux = $.uint(__goscriptTuple0[0], 64)
	let n = __goscriptTuple0[1]
	let x = $.int($.int($.uint64Shr(ux, 1)))
	if ($.uint(($.uint64And(ux, 1)), 64) != $.uint(0, 64)) {
		x = $.int(~x)
	}
	return [$.int(x), n]
}

export let errOverflow: $.GoError = errors.New("binary: varint overflows a 64-bit integer")

export function __goscript_set_errOverflow(__goscriptValue: $.GoError): void {
	errOverflow = __goscriptValue
}

export async function ReadUvarint(r: io.ByteReader | null): globalThis.Promise<[number, $.GoError]> {
	let x: number = 0
	let s: number = 0
	for (let i = 0; i < 10; i++) {
		let __goscriptTuple1: any = await $.pointerValue<Exclude<io.ByteReader, null>>(r).ReadByte()
		let b = $.uint(__goscriptTuple1[0], 8)
		let err = __goscriptTuple1[1]
		if (err != null) {
			if ((i > 0) && ($.comparableEqual(err, io.EOF))) {
				err = io.ErrUnexpectedEOF
			}
			return [$.uint(x, 64), err]
		}
		if (b < 0x80) {
			if ((i == (10 - 1)) && (b > 1)) {
				return [$.uint(x, 64), errOverflow]
			}
			return [$.uint($.uint64Or(x, ($.uint64Shl($.uint(b, 64), s))), 64), null]
		}
		x = $.uint64Or(x, $.uint($.uint64Shl($.uint(b & 0x7f, 64), s), 64))
		s = $.uint64Add(s, 7)
	}
	return [$.uint(x, 64), errOverflow]
}

export async function ReadVarint(r: io.ByteReader | null): globalThis.Promise<[number, $.GoError]> {
	let __goscriptTuple2: any = await ReadUvarint(r)
	let ux = $.uint(__goscriptTuple2[0], 64)
	let err = __goscriptTuple2[1]
	let x = $.int($.int($.uint64Shr(ux, 1)))
	if ($.uint(($.uint64And(ux, 1)), 64) != $.uint(0, 64)) {
		x = $.int(~x)
	}
	return [$.int(x), err]
}
