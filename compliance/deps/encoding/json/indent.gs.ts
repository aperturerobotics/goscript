import * as $ from "@goscript/builtin/index.js"
import { freeScanner, newScanner } from "./scanner.gs.js";
import { hex } from "./encode.gs.js";
import { scanContinue, scanEndArray, scanEndObject, scanError, scanSkipSpace } from "./scanner.gs.js";

import * as bytes from "@goscript/bytes/index.js"

export let indentGrowthFactor: number = 2

// HTMLEscape appends to dst the JSON-encoded src with <, >, &, U+2028 and U+2029
// characters inside string literals changed to \u003c, \u003e, \u0026, \u2028, \u2029
// so that the JSON will be safe to embed inside HTML <script> tags.
// For historical reasons, web browsers don't honor standard HTML
// escaping within <script> tags, so an alternative JSON encoding must be used.
export function HTMLEscape(dst: bytes.Buffer | null, src: $.Bytes): void {
	dst!.Grow($.len(src))
	dst!.Write(appendHTMLEscape(dst!.AvailableBuffer(), src))
}

export function appendHTMLEscape(dst: $.Bytes, src: $.Bytes): $.Bytes {
	// The characters can only appear in string literals,
	// so just scan the string one byte at a time.
	let start = 0

	// Convert U+2028 and U+2029 (E2 80 A8 and E2 80 A9).
	for (let i = 0; i < $.len(src); i++) {
		let c = src![i]
		{
			if (c == 60 || c == 62 || c == 38) {
				dst = $.append(dst, ...($.goSlice(src, start, i) || []))
				dst = $.append(dst, 92, 117, 48, 48, $.indexString("0123456789abcdef", (c >> 4)), $.indexString("0123456789abcdef", (c & 0xF)))
				start = i + 1
			}
			// Convert U+2028 and U+2029 (E2 80 A8 and E2 80 A9).
			if (c == 0xE2 && i + 2 < $.len(src) && src![i + 1] == 0x80 && (src![i + 2] & ~ 1) == 0xA8) {
				dst = $.append(dst, ...($.goSlice(src, start, i) || []))
				dst = $.append(dst, 92, 117, 50, 48, 50, $.indexString("0123456789abcdef", (src![i + 2] & 0xF)))
				start = i + $.len("\u2029")
			}
		}
	}
	return $.append(dst, ...($.goSlice(src, start, undefined) || []))
}

// Compact appends to dst the JSON-encoded src with
// insignificant space characters elided.
export function Compact(dst: bytes.Buffer | null, src: $.Bytes): $.GoError {
	dst!.Grow($.len(src))
	let b = dst!.AvailableBuffer()
	let err: $.GoError
	[b, err] = appendCompact(b, src, false)
	dst!.Write(b)
	return err
}

export function appendCompact(dst: $.Bytes, src: $.Bytes, escape: boolean): [$.Bytes, $.GoError] {
	using __defer = new $.DisposableStack();
	let origLen = $.len(dst)
	let scan = newScanner()
	__defer.defer(() => {
		freeScanner(scan)
	});
	let start = 0

	// Convert U+2028 and U+2029 (E2 80 A8 and E2 80 A9).
	for (let i = 0; i < $.len(src); i++) {
		let c = src![i]
		{
			if (escape && (c == 60 || c == 62 || c == 38)) {
				if (start < i) {
					dst = $.append(dst, ...($.goSlice(src, start, i) || []))
				}
				dst = $.append(dst, 92, 117, 48, 48, $.indexString("0123456789abcdef", (c >> 4)), $.indexString("0123456789abcdef", (c & 0xF)))
				start = i + 1
			}
			// Convert U+2028 and U+2029 (E2 80 A8 and E2 80 A9).
			if (escape && c == 0xE2 && i + 2 < $.len(src) && src![i + 1] == 0x80 && (src![i + 2] & ~ 1) == 0xA8) {
				if (start < i) {
					dst = $.append(dst, ...($.goSlice(src, start, i) || []))
				}
				dst = $.append(dst, 92, 117, 50, 48, 50, $.indexString("0123456789abcdef", (src![i + 2] & 0xF)))
				start = i + 3
			}
			let v = scan!.step!(scan, c)
			if (v >= 9) {
				if (v == 11) {
					break
				}
				if (start < i) {
					dst = $.append(dst, ...($.goSlice(src, start, i) || []))
				}
				start = i + 1
			}
		}
	}
	if (scan!.eof() == 11) {
		return [$.goSlice(dst, undefined, origLen), scan!.err]
	}
	if (start < $.len(src)) {
		dst = $.append(dst, ...($.goSlice(src, start, undefined) || []))
	}
	return [dst, null]
}

export function appendNewline(dst: $.Bytes, prefix: string, indent: string, depth: number): $.Bytes {
	dst = $.append(dst, 10)
	dst = $.append(dst, ...$.stringToBytes(prefix))
	for (let i = 0; i < depth; i++) {
		dst = $.append(dst, ...$.stringToBytes(indent))
	}
	return dst
}

// Indent appends to dst an indented form of the JSON-encoded src.
// Each element in a JSON object or array begins on a new,
// indented line beginning with prefix followed by one or more
// copies of indent according to the indentation nesting.
// The data appended to dst does not begin with the prefix nor
// any indentation, to make it easier to embed inside other formatted JSON data.
// Although leading space characters (space, tab, carriage return, newline)
// at the beginning of src are dropped, trailing space characters
// at the end of src are preserved and copied to dst.
// For example, if src has no trailing spaces, neither will dst;
// if src ends in a trailing newline, so will dst.
export function Indent(dst: bytes.Buffer | null, src: $.Bytes, prefix: string, indent: string): $.GoError {
	dst!.Grow(2 * $.len(src))
	let b = dst!.AvailableBuffer()
	let err: $.GoError
	[b, err] = appendIndent(b, src, prefix, indent)
	dst!.Write(b)
	return err
}

export function appendIndent(dst: $.Bytes, src: $.Bytes, prefix: string, indent: string): [$.Bytes, $.GoError] {
	using __defer = new $.DisposableStack();
	let origLen = $.len(dst)
	let scan = newScanner()
	__defer.defer(() => {
		freeScanner(scan)
	});
	let needIndent = false
	let depth = 0

	// Emit semantically uninteresting bytes
	// (in particular, punctuation in strings) unmodified.

	// Add spacing around real punctuation.

	// delay indent so that empty object and array are formatted as {} and [].

	// suppress indent in empty object/array
	for (let _i = 0; _i < $.len(src); _i++) {
		let c = src![_i]
		{
			scan!.bytes++
			let v = scan!.step!(scan, c)
			if (v == 9) {
				continue
			}
			if (v == 11) {
				break
			}
			if (needIndent && v != 5 && v != 8) {
				needIndent = false
				depth++
				dst = appendNewline(dst, prefix, indent, depth)
			}

			// Emit semantically uninteresting bytes
			// (in particular, punctuation in strings) unmodified.
			if (v == 0) {
				dst = $.append(dst, c)
				continue
			}

			// Add spacing around real punctuation.

			// delay indent so that empty object and array are formatted as {} and [].

			// suppress indent in empty object/array
			switch (c) {
				case 123:
				case 91: {
					needIndent = true
					dst = $.append(dst, c)
					break
				}
				case 44: {
					dst = $.append(dst, c)
					dst = appendNewline(dst, prefix, indent, depth)
					break
				}
				case 58: {
					dst = $.append(dst, c, 32)
					break
				}
				case 125:
				case 93: {
					if (needIndent) {
						// suppress indent in empty object/array
						needIndent = false
					} else {
						depth--
						dst = appendNewline(dst, prefix, indent, depth)
					}
					dst = $.append(dst, c)
					break
				}
				default: {
					dst = $.append(dst, c)
					break
				}
			}
		}
	}
	if (scan!.eof() == 11) {
		return [$.goSlice(dst, undefined, origLen), scan!.err]
	}
	return [dst, null]
}

