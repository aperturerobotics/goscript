import * as $ from "@goscript/builtin/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

// foldName returns a folded string such that foldName(x) == foldName(y)
// is identical to bytes.EqualFold(x, y).
export function foldName(_in: $.Bytes): $.Bytes {
	// This is inlinable to take advantage of "function outlining".
	// large enough for most JSON names
	let arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	return appendFoldedName($.goSlice(arr, undefined, 0), _in)
}

export function appendFoldedName(out: $.Bytes, _in: $.Bytes): $.Bytes {

	// Handle single-byte ASCII.

	// Handle multi-byte Unicode.
	for (let i = 0; i < $.len(_in); ) {
		// Handle single-byte ASCII.
		{
			let c = _in![i]
			if (c < utf8.RuneSelf) {
				if (97 <= c && c <= 122) {
					c -= 97 - 65
				}
				out = $.append(out, c)
				i++
				continue
			}
		}
		// Handle multi-byte Unicode.
		let [r, n] = utf8.DecodeRune($.goSlice(_in, i, undefined))
		out = utf8.AppendRune(out, foldRune(r))
		i += n
	}
	return out
}

// foldRune is returns the smallest rune for all runes in the same fold set.
export function foldRune(r: number): number {
	for (; ; ) {
		let r2 = unicode.SimpleFold(r)
		if (r2 <= r) {
			return r2
		}
		r = r2
	}
}

