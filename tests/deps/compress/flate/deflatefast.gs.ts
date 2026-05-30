// Generated file based on deflatefast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

import * as __goscript_deflate from "./deflate.gs.ts"

import * as __goscript_token from "./token.gs.ts"
import "@goscript/math/index.js"
import "./deflate.gs.ts"
import "./token.gs.ts"

export class tableEntry {
	public get val(): number {
		return this._fields.val.value
	}
	public set val(value: number) {
		this._fields.val.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public _fields: {
		val: $.VarRef<number>
		offset: $.VarRef<number>
	}

	constructor(init?: Partial<{val?: number, offset?: number}>) {
		this._fields = {
			val: $.varRef(init?.val ?? 0),
			offset: $.varRef(init?.offset ?? 0)
		}
	}

	public clone(): tableEntry {
		const cloned = new tableEntry()
		cloned._fields = {
			val: $.varRef(this._fields.val.value),
			offset: $.varRef(this._fields.offset.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"flate.tableEntry",
		() => new tableEntry(),
		[],
		tableEntry,
		[{ name: "val", key: "val", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "compress/flate", index: [0], offset: 0, exported: false }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "int32" }, pkgPath: "compress/flate", index: [1], offset: 4, exported: false }]
	)
}

export class deflateFast {
	public get table(): tableEntry[] {
		return this._fields.table.value
	}
	public set table(value: tableEntry[]) {
		this._fields.table.value = value
	}

	public get prev(): $.Slice<number> {
		return this._fields.prev.value
	}
	public set prev(value: $.Slice<number>) {
		this._fields.prev.value = value
	}

	public get cur(): number {
		return this._fields.cur.value
	}
	public set cur(value: number) {
		this._fields.cur.value = value
	}

	public _fields: {
		table: $.VarRef<tableEntry[]>
		prev: $.VarRef<$.Slice<number>>
		cur: $.VarRef<number>
	}

	constructor(init?: Partial<{table?: tableEntry[], prev?: $.Slice<number>, cur?: number}>) {
		this._fields = {
			table: $.varRef(init?.table !== undefined ? $.cloneArrayValue(init.table) : Array.from({ length: 16384 }, () => $.markAsStructValue(new tableEntry()))),
			prev: $.varRef(init?.prev ?? null),
			cur: $.varRef(init?.cur ?? 0)
		}
	}

	public clone(): deflateFast {
		const cloned = new deflateFast()
		cloned._fields = {
			table: $.varRef($.cloneArrayValue(this._fields.table.value)),
			prev: $.varRef(this._fields.prev.value),
			cur: $.varRef(this._fields.cur.value)
		}
		return $.markAsStructValue(cloned)
	}

	public encode(dst: $.Slice<__goscript_token.token>, src: $.Slice<number>): $.Slice<__goscript_token.token> {
		let e: deflateFast | $.VarRef<deflateFast> | null = this
		// Ensure that e.cur doesn't wrap.
		if ($.pointerValue<deflateFast>(e).cur >= 2147352577) {
			deflateFast.prototype.shiftOffsets.call(e)
		}

		// This check isn't in the Snappy implementation, but there, the caller
		// instead of the callee handles this case.
		if ($.len(src) < 17) {
			$.pointerValue<deflateFast>(e).cur = $.pointerValue<deflateFast>(e).cur + ($.int(65535, 32))
			$.pointerValue<deflateFast>(e).prev = $.goSlice($.pointerValue<deflateFast>(e).prev, undefined, 0)
			return emitLiteral(dst, src)
		}

		// sLimit is when to stop looking for offset/length copies. The inputMargin
		// lets us use a fast path for emitLiteral in the main loop, while we are
		// looking for copies.
		let sLimit = $.int($.int($.len(src) - 15, 32), 32)

		// nextEmit is where in src the next emitLiteral should start from.
		let nextEmit = $.int($.int(0, 32), 32)
		let s = $.int($.int(0, 32), 32)
		let cv = $.uint(load32(src, $.int(s, 32)), 32)
		let nextHash = $.uint(hash($.uint(cv, 32)), 32)

		emitRemainder: {

			while (true) {
				// Copied from the C++ snappy implementation:
				//
				// Heuristic match skipping: If 32 bytes are scanned with no matches
				// found, start looking only at every other byte. If 32 more bytes are
				// scanned (or skipped), look at every third byte, etc.. When a match
				// is found, immediately go back to looking at every byte. This is a
				// small loss (~5% performance, ~0.1% density) for compressible data
				// due to more bookkeeping, but for non-compressible data (such as
				// JPEG) it's a huge win since the compressor quickly "realizes" the
				// data is incompressible and doesn't bother looking for matches
				// everywhere.
				//
				// The "skip" variable keeps track of how many bytes there are since
				// the last match; dividing it by 32 (ie. right-shifting by five) gives
				// the number of bytes to move ahead for each iteration.
				let skip = $.int($.int(32, 32), 32)

				let nextS = $.int(s, 32)
				let candidate: tableEntry = $.markAsStructValue(new tableEntry())
				while (true) {
					s = $.int(nextS, 32)
					let bytesBetweenHashLookups = $.int(skip >> 5, 32)
					nextS = $.int(s + bytesBetweenHashLookups, 32)
					skip = skip + ($.int(bytesBetweenHashLookups, 32))
					if (nextS > sLimit) {
						break emitRemainder
					}
					candidate = $.markAsStructValue($.cloneStructValue($.pointerValue<deflateFast>(e).table[nextHash & 16383]))
					let now = $.uint(load32(src, $.int(nextS, 32)), 32)
					$.pointerValue<deflateFast>(e).table[nextHash & 16383] = $.markAsStructValue(new tableEntry({offset: $.int(s + $.pointerValue<deflateFast>(e).cur, 32), val: $.uint(cv, 32)}))
					nextHash = $.uint(hash($.uint(now, 32)), 32)

					let offset = $.int(s - (candidate.offset - $.pointerValue<deflateFast>(e).cur), 32)
					if ((offset > 32768) || ($.uint(cv, 32) != $.uint(candidate.val, 32))) {
						// Out of range or not matched.
						cv = $.uint(now, 32)
						continue
					}
					break
				}

				// A 4-byte match has been found. We'll later see if more than 4 bytes
				// match. But, prior to the match, src[nextEmit:s] are unmatched. Emit
				// them as literal bytes.
				dst = emitLiteral(dst, $.goSlice(src, nextEmit, s))

				// Call emitCopy, and then see if another emitCopy could be our next
				// move. Repeat until we find no match for the input immediately after
				// what was consumed by the last emitCopy call.
				//
				// If we exit this loop normally then we need to call emitLiteral next,
				// though we don't yet know how big the literal will be. We handle that
				// by proceeding to the next iteration of the main loop. We also can
				// exit this loop via goto if we get close to exhausting the input.
				while (true) {
					// Invariant: we have a 4-byte match at s, and no need to emit any
					// literal bytes prior to s.

					// Extend the 4-byte match as long as possible.
					//
					s = s + ($.int(4, 32))
					let t = $.int((candidate.offset - $.pointerValue<deflateFast>(e).cur) + 4, 32)
					let l = $.int(deflateFast.prototype.matchLen.call(e, $.int(s, 32), $.int(t, 32), src), 32)

					// matchToken is flate's equivalent of Snappy's emitCopy. (length,offset)
					dst = $.append(dst, $.uint(__goscript_token.matchToken($.uint($.uint((l + 4) - 3, 32), 32), $.uint($.uint((s - t) - 1, 32), 32)), 32))
					s = s + ($.int(l, 32))
					nextEmit = $.int(s, 32)
					if (s >= sLimit) {
						break emitRemainder
					}

					// We could immediately start working at s now, but to improve
					// compression we first update the hash table at s-1 and at s. If
					// another emitCopy is not our next move, also calculate nextHash
					// at s+1. At least on GOARCH=amd64, these three hash calculations
					// are faster as one load64 call (with some shifts) instead of
					// three load32 calls.
					let x = $.uint(load64(src, $.int(s - 1, 32)), 64)
					let prevHash = $.uint(hash($.uint($.uint(x, 32), 32)), 32)
					$.pointerValue<deflateFast>(e).table[prevHash & 16383] = $.markAsStructValue(new tableEntry({offset: $.int(($.pointerValue<deflateFast>(e).cur + s) - 1, 32), val: $.uint($.uint(x, 32), 32)}))
					x = $.uint64Shr(x, $.uint(8, 64))
					let currHash = $.uint(hash($.uint($.uint(x, 32), 32)), 32)
					candidate = $.markAsStructValue($.cloneStructValue($.pointerValue<deflateFast>(e).table[currHash & 16383]))
					$.pointerValue<deflateFast>(e).table[currHash & 16383] = $.markAsStructValue(new tableEntry({offset: $.int($.pointerValue<deflateFast>(e).cur + s, 32), val: $.uint($.uint(x, 32), 32)}))

					let offset = $.int(s - (candidate.offset - $.pointerValue<deflateFast>(e).cur), 32)
					if ((offset > 32768) || ($.uint($.uint(x, 32), 32) != $.uint(candidate.val, 32))) {
						cv = $.uint($.uint($.uint64Shr(x, 8), 32), 32)
						nextHash = $.uint(hash($.uint(cv, 32)), 32)
						s++
						break
					}
				}
			}
		}
		if ($.int(nextEmit) < $.len(src)) {
			dst = emitLiteral(dst, $.goSlice(src, nextEmit, undefined))
		}
		$.pointerValue<deflateFast>(e).cur = $.pointerValue<deflateFast>(e).cur + ($.int($.int($.len(src), 32), 32))
		$.pointerValue<deflateFast>(e).prev = $.goSlice($.pointerValue<deflateFast>(e).prev, undefined, $.len(src))
		$.copy($.pointerValue<deflateFast>(e).prev, src)
		return dst
	}

	public matchLen(s: number, t: number, src: $.Slice<number>): number {
		const e: deflateFast | $.VarRef<deflateFast> | null = this
		let s1 = ($.int(s) + 258) - 4
		if (s1 > $.len(src)) {
			s1 = $.len(src)
		}

		// If we are inside the current block
		if (t >= 0) {
			let b: $.Slice<number> = $.goSlice(src, t, undefined)
			let a: $.Slice<number> = $.goSlice(src, s, s1)
			b = $.goSlice(b, undefined, $.len(a))
			// Extend the match to be as long as possible.
			for (let __goscriptRangeTarget0 = a, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
				if ($.uint(a![i], 8) != $.uint(b![i], 8)) {
					return $.int($.int(i, 32), 32)
				}
			}
			return $.int($.int($.len(a), 32), 32)
		}

		// We found a match in the previous block.
		let tp = $.int($.int($.len($.pointerValue<deflateFast>(e).prev), 32) + t, 32)
		if (tp < 0) {
			return $.int(0, 32)
		}

		// Extend the match to be as long as possible.
		let a: $.Slice<number> = $.goSlice(src, s, s1)
		let b: $.Slice<number> = $.goSlice($.pointerValue<deflateFast>(e).prev, tp, undefined)
		if ($.len(b) > $.len(a)) {
			b = $.goSlice(b, undefined, $.len(a))
		}
		a = $.goSlice(a, undefined, $.len(b))
		for (let __goscriptRangeTarget1 = b, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			if ($.uint(a![i], 8) != $.uint(b![i], 8)) {
				return $.int($.int(i, 32), 32)
			}
		}

		// If we reached our limit, we matched everything we are
		// allowed to in the previous block and we return.
		let n = $.int($.int($.len(b), 32), 32)
		if ($.int(s + n) == s1) {
			return $.int(n, 32)
		}

		// Continue looking for more matches in the current block.
		a = $.goSlice(src, s + n, s1)
		b = $.goSlice(src, undefined, $.len(a))
		for (let __goscriptRangeTarget2 = a, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
			if ($.uint(a![i], 8) != $.uint(b![i], 8)) {
				return $.int($.int(i, 32) + n, 32)
			}
		}
		return $.int($.int($.len(a), 32) + n, 32)
	}

	public reset(): void {
		let e: deflateFast | $.VarRef<deflateFast> | null = this
		$.pointerValue<deflateFast>(e).prev = $.goSlice($.pointerValue<deflateFast>(e).prev, undefined, 0)
		// Bump the offset, so all matches will fail distance check.
		// Nothing should be >= e.cur in the table.
		$.pointerValue<deflateFast>(e).cur = $.pointerValue<deflateFast>(e).cur + ($.int(32768, 32))

		// Protect against e.cur wraparound.
		if ($.pointerValue<deflateFast>(e).cur >= 2147352577) {
			deflateFast.prototype.shiftOffsets.call(e)
		}
	}

	public shiftOffsets(): void {
		let e: deflateFast | $.VarRef<deflateFast> | null = this
		if ($.len($.pointerValue<deflateFast>(e).prev) == 0) {
			// We have no history; just clear the table.
			$.clear($.goSlice($.pointerValue<deflateFast>(e).table, undefined, undefined))
			$.pointerValue<deflateFast>(e).cur = $.int(32768 + 1, 32)
			return
		}

		// Shift down everything in the table that isn't already too far away.
		for (let __goscriptRangeTarget3 = $.goSlice($.pointerValue<deflateFast>(e).table, undefined, undefined), i = 0; i < $.len(__goscriptRangeTarget3); i++) {
			let v = $.int((($.pointerValue<deflateFast>(e).table[i].offset - $.pointerValue<deflateFast>(e).cur) + 32768) + 1, 32)
			if (v < 0) {
				// We want to reset e.cur to maxMatchOffset + 1, so we need to shift
				// all table entries down by (e.cur - (maxMatchOffset + 1)).
				// Because we ignore matches > maxMatchOffset, we can cap
				// any negative offsets at 0.
				v = $.int(0, 32)
			}
			$.pointerValue<deflateFast>(e).table[i].offset = $.int(v, 32)
		}
		$.pointerValue<deflateFast>(e).cur = $.int(32768 + 1, 32)
	}

	static __typeInfo = $.registerStructType(
		"flate.deflateFast",
		() => new deflateFast(),
		[{ name: "encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "flate.token" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "flate.token" } } }] }, { name: "matchLen", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "int32" } }, { name: "t", type: { kind: $.TypeKind.Basic, name: "int32" } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int32" } }] }, { name: "reset", args: [], returns: [] }, { name: "shiftOffsets", args: [], returns: [] }],
		deflateFast,
		[{ name: "table", key: "table", type: { kind: $.TypeKind.Array, elemType: "flate.tableEntry", length: 16384 }, pkgPath: "compress/flate", index: [0], offset: 0, exported: false }, { name: "prev", key: "prev", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "compress/flate", index: [1], offset: 131072, exported: false }, { name: "cur", key: "cur", type: { kind: $.TypeKind.Basic, name: "int32" }, pkgPath: "compress/flate", index: [2], offset: 131096, exported: false }]
	)
}

export const tableBits: number = 14

export const tableSize: number = 16384

export const tableMask: number = 16383

export const tableShift: number = 18

export const bufferReset: number = 2147352577

export const inputMargin: number = 15

export const minNonLiteralBlockSize: number = 17

export function load32(b: $.Slice<number>, i: number): number {
	b = $.goSlice(b, i, i + 4, $.len(b))
	return $.uint((($.uint(b![0], 32) | ($.uint(b![1], 32) << 8)) | ($.uint(b![2], 32) << 16)) | ($.uint(b![3], 32) << 24), 32)
}

export function load64(b: $.Slice<number>, i: number): number {
	b = $.goSlice(b, i, i + 8, $.len(b))
	return $.uint($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or($.uint(b![0], 64), ($.uint64Shl($.uint(b![1], 64), 8)))), ($.uint64Shl($.uint(b![2], 64), 16)))), ($.uint64Shl($.uint(b![3], 64), 24)))), ($.uint64Mul($.uint(b![4], 64), (2 ** 32))))), ($.uint64Mul($.uint(b![5], 64), (2 ** 40))))), ($.uint64Mul($.uint(b![6], 64), (2 ** 48))))), ($.uint64Mul($.uint(b![7], 64), (2 ** 56)))), 64)
}

export function hash(u: number): number {
	return $.uint($.uintShr((u * 0x1e35a7bd), 18, 32), 32)
}

export function newDeflateFast(): deflateFast | $.VarRef<deflateFast> | null {
	return new deflateFast({cur: $.int(65535, 32), prev: $.makeSlice<number>(0, 65535, "byte")})
}

export function emitLiteral(dst: $.Slice<__goscript_token.token>, lit: $.Slice<number>): $.Slice<__goscript_token.token> {
	for (let __goscriptRangeTarget4 = lit, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let v = __goscriptRangeTarget4![__rangeIndex]
		dst = $.append(dst, $.uint(__goscript_token.literalToken($.uint($.uint(v, 32), 32)), 32))
	}
	return dst
}
