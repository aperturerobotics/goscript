// Generated file based on strings.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/unsafe/index.js"

export function HasPrefix(s: string, prefix: string): boolean {
	return ($.len(s) >= $.len(prefix)) && ($.stringEqual($.sliceStringOrBytes(s, undefined, $.len(prefix)), prefix))
}

export function HasSuffix(s: string, suffix: string): boolean {
	return ($.len(s) >= $.len(suffix)) && ($.stringEqual($.sliceStringOrBytes(s, $.len(s) - $.len(suffix), undefined), suffix))
}

export function IndexByte(s: string, c: number): number {
	return bytealg.IndexByteString(s, $.uint(c, 8))
}

export function Index(s: string, substr: string): number {
	let n = $.len(substr)
	switch (true) {
		case n == 0:
		{
			return 0
			break
		}
		case n == 1:
		{
			return IndexByte(s, $.uint($.indexStringOrBytes(substr, 0), 8))
			break
		}
		case n == $.len(s):
		{
			if ($.stringEqual(substr, s)) {
				return 0
			}
			return -1
			break
		}
		case n > $.len(s):
		{
			return -1
			break
		}
		case n <= bytealg.MaxLen:
		{
			if ($.len(s) <= bytealg.MaxBruteForce) {
				return bytealg.IndexString(s, substr)
			}
			let c0 = $.uint($.indexStringOrBytes(substr, 0), 8)
			let c1 = $.uint($.indexStringOrBytes(substr, 1), 8)
			let i = 0
			let t = ($.len(s) - n) + 1
			let fails = 0
			while (i < t) {
				if ($.uint($.indexStringOrBytes(s, i), 8) != $.uint(c0, 8)) {
					// IndexByte is faster than bytealg.IndexString, so use it as long as
					// we're not getting lots of false positives.
					let o = IndexByte($.sliceStringOrBytes(s, i + 1, t), $.uint(c0, 8))
					if (o < 0) {
						return -1
					}
					i = i + (o + 1)
				}
				if (($.uint($.indexStringOrBytes(s, i + 1), 8) == $.uint(c1, 8)) && ($.stringEqual($.sliceStringOrBytes(s, i, i + n), substr))) {
					return i
				}
				fails++
				i++
				// Switch to bytealg.IndexString when IndexByte produces too many false positives.
				if (fails > bytealg.Cutover(i)) {
					let r = bytealg.IndexString($.sliceStringOrBytes(s, i, undefined), substr)
					if (r >= 0) {
						return r + i
					}
					return -1
				}
			}
			return -1
			break
		}
	}
	let c0 = $.uint($.indexStringOrBytes(substr, 0), 8)
	let c1 = $.uint($.indexStringOrBytes(substr, 1), 8)
	let i = 0
	let t = ($.len(s) - n) + 1
	let fails = 0
	while (i < t) {
		if ($.uint($.indexStringOrBytes(s, i), 8) != $.uint(c0, 8)) {
			let o = IndexByte($.sliceStringOrBytes(s, i + 1, t), $.uint(c0, 8))
			if (o < 0) {
				return -1
			}
			i = i + (o + 1)
		}
		if (($.uint($.indexStringOrBytes(s, i + 1), 8) == $.uint(c1, 8)) && ($.stringEqual($.sliceStringOrBytes(s, i, i + n), substr))) {
			return i
		}
		i++
		fails++
		if ((fails >= (4 + (i >> 4))) && (i < t)) {
			// See comment in ../bytes/bytes.go.
			let j = bytealg.IndexRabinKarp($.sliceStringOrBytes(s, i, undefined), substr)
			if (j < 0) {
				return -1
			}
			return i + j
		}
	}
	return -1
}

export function Cut(s: string, sep: string): [string, string, boolean] {
	let before: string = ""
	let after: string = ""
	let found: boolean = false
	{
		let i = Index(s, sep)
		if (i >= 0) {
			return [$.sliceStringOrBytes(s, undefined, i), $.sliceStringOrBytes(s, i + $.len(sep), undefined), true]
		}
	}
	return [s, "", false]
}

export function CutPrefix(s: string, prefix: string): [string, boolean] {
	let after: string = ""
	let found: boolean = false
	if (!HasPrefix(s, prefix)) {
		return [s, false]
	}
	return [$.sliceStringOrBytes(s, $.len(prefix), undefined), true]
}

export function CutSuffix(s: string, suffix: string): [string, boolean] {
	let before: string = ""
	let found: boolean = false
	if (!HasSuffix(s, suffix)) {
		return [s, false]
	}
	return [$.sliceStringOrBytes(s, undefined, $.len(s) - $.len(suffix)), true]
}

export function TrimPrefix(s: string, prefix: string): string {
	if (HasPrefix(s, prefix)) {
		return $.sliceStringOrBytes(s, $.len(prefix), undefined)
	}
	return s
}

export function TrimSuffix(s: string, suffix: string): string {
	if (HasSuffix(s, suffix)) {
		return $.sliceStringOrBytes(s, undefined, $.len(s) - $.len(suffix))
	}
	return s
}

export function Clone(s: string): string {
	if ($.len(s) == 0) {
		return ""
	}
	let b: $.Slice<number> = $.makeSlice<number>($.len(s), undefined, "byte")
	$.copy(b, s)
	return unsafe.String!($.indexRef(b!, 0), $.len(b))
}
