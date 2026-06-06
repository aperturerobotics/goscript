// Generated file based on deflate.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as math from "@goscript/math/index.js"

import * as __goscript_deflatefast from "./deflatefast.gs.ts"

import * as __goscript_huffman_bit_writer from "./huffman_bit_writer.gs.ts"

import * as __goscript_huffman_code from "./huffman_code.gs.ts"

import * as __goscript_token from "./token.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/math/index.js"
import "./deflatefast.gs.ts"
import "./huffman_bit_writer.gs.ts"
import "./huffman_code.gs.ts"
import "./token.gs.ts"

export class compressionLevel {
	public get level(): number {
		return this._fields.level.value
	}
	public set level(value: number) {
		this._fields.level.value = value
	}

	public get good(): number {
		return this._fields.good.value
	}
	public set good(value: number) {
		this._fields.good.value = value
	}

	public get lazy(): number {
		return this._fields.lazy.value
	}
	public set lazy(value: number) {
		this._fields.lazy.value = value
	}

	public get nice(): number {
		return this._fields.nice.value
	}
	public set nice(value: number) {
		this._fields.nice.value = value
	}

	public get chain(): number {
		return this._fields.chain.value
	}
	public set chain(value: number) {
		this._fields.chain.value = value
	}

	public get fastSkipHashing(): number {
		return this._fields.fastSkipHashing.value
	}
	public set fastSkipHashing(value: number) {
		this._fields.fastSkipHashing.value = value
	}

	public _fields: {
		level: $.VarRef<number>
		good: $.VarRef<number>
		lazy: $.VarRef<number>
		nice: $.VarRef<number>
		chain: $.VarRef<number>
		fastSkipHashing: $.VarRef<number>
	}

	constructor(init?: Partial<{level?: number, good?: number, lazy?: number, nice?: number, chain?: number, fastSkipHashing?: number}>) {
		this._fields = {
			level: $.varRef(init?.level ?? (0 as unknown as number)),
			good: $.varRef(init?.good ?? (0 as unknown as number)),
			lazy: $.varRef(init?.lazy ?? (0 as unknown as number)),
			nice: $.varRef(init?.nice ?? (0 as unknown as number)),
			chain: $.varRef(init?.chain ?? (0 as unknown as number)),
			fastSkipHashing: $.varRef(init?.fastSkipHashing ?? (0 as unknown as number))
		}
	}

	public clone(): compressionLevel {
		const cloned = new compressionLevel()
		cloned._fields = {
			level: $.varRef(this._fields.level.value),
			good: $.varRef(this._fields.good.value),
			lazy: $.varRef(this._fields.lazy.value),
			nice: $.varRef(this._fields.nice.value),
			chain: $.varRef(this._fields.chain.value),
			fastSkipHashing: $.varRef(this._fields.fastSkipHashing.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"flate.compressionLevel",
		() => new compressionLevel(),
		[],
		compressionLevel,
		[{ name: "level", key: "level", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [0], offset: 0, exported: false }, { name: "good", key: "good", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [1], offset: 8, exported: false }, { name: "lazy", key: "lazy", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [2], offset: 16, exported: false }, { name: "nice", key: "nice", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [3], offset: 24, exported: false }, { name: "chain", key: "chain", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [4], offset: 32, exported: false }, { name: "fastSkipHashing", key: "fastSkipHashing", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [5], offset: 40, exported: false }]
	)
}

export class compressor {
	public get compressionLevel(): compressionLevel {
		return this._fields.compressionLevel.value
	}
	public set compressionLevel(value: compressionLevel) {
		this._fields.compressionLevel.value = value
	}

	public get w(): __goscript_huffman_bit_writer.huffmanBitWriter | $.VarRef<__goscript_huffman_bit_writer.huffmanBitWriter> | null {
		return this._fields.w.value
	}
	public set w(value: __goscript_huffman_bit_writer.huffmanBitWriter | $.VarRef<__goscript_huffman_bit_writer.huffmanBitWriter> | null) {
		this._fields.w.value = value
	}

	public get bulkHasher(): ((_p0: $.Slice<number>, _p1: $.Slice<number>) => void) | null {
		return this._fields.bulkHasher.value
	}
	public set bulkHasher(value: ((_p0: $.Slice<number>, _p1: $.Slice<number>) => void) | null) {
		this._fields.bulkHasher.value = value
	}

	// compression algorithm
	public get fill(): ((_p0: compressor | $.VarRef<compressor> | null, _p1: $.Slice<number>) => number | globalThis.Promise<number>) | null {
		return this._fields.fill.value
	}
	public set fill(value: ((_p0: compressor | $.VarRef<compressor> | null, _p1: $.Slice<number>) => number | globalThis.Promise<number>) | null) {
		this._fields.fill.value = value
	}

	public get step(): ((_p0: compressor | $.VarRef<compressor> | null) => void) | null {
		return this._fields.step.value
	}
	public set step(value: ((_p0: compressor | $.VarRef<compressor> | null) => void) | null) {
		this._fields.step.value = value
	}

	public get bestSpeed(): __goscript_deflatefast.deflateFast | $.VarRef<__goscript_deflatefast.deflateFast> | null {
		return this._fields.bestSpeed.value
	}
	public set bestSpeed(value: __goscript_deflatefast.deflateFast | $.VarRef<__goscript_deflatefast.deflateFast> | null) {
		this._fields.bestSpeed.value = value
	}

	// input window: unprocessed data is window[index:windowEnd]
	public get index(): number {
		return this._fields.index.value
	}
	public set index(value: number) {
		this._fields.index.value = value
	}

	public get window(): $.Slice<number> {
		return this._fields.window.value
	}
	public set window(value: $.Slice<number>) {
		this._fields.window.value = value
	}

	public get windowEnd(): number {
		return this._fields.windowEnd.value
	}
	public set windowEnd(value: number) {
		this._fields.windowEnd.value = value
	}

	public get blockStart(): number {
		return this._fields.blockStart.value
	}
	public set blockStart(value: number) {
		this._fields.blockStart.value = value
	}

	public get byteAvailable(): boolean {
		return this._fields.byteAvailable.value
	}
	public set byteAvailable(value: boolean) {
		this._fields.byteAvailable.value = value
	}

	public get sync(): boolean {
		return this._fields.sync.value
	}
	public set sync(value: boolean) {
		this._fields.sync.value = value
	}

	// queued output tokens
	public get tokens(): $.Slice<__goscript_token.token> {
		return this._fields.tokens.value
	}
	public set tokens(value: $.Slice<__goscript_token.token>) {
		this._fields.tokens.value = value
	}

	// deflate state
	public get length(): number {
		return this._fields.length.value
	}
	public set length(value: number) {
		this._fields.length.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public get maxInsertIndex(): number {
		return this._fields.maxInsertIndex.value
	}
	public set maxInsertIndex(value: number) {
		this._fields.maxInsertIndex.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	// Input hash chains
	// hashHead[hashValue] contains the largest inputIndex with the specified hash value
	// If hashHead[hashValue] is within the current window, then
	// hashPrev[hashHead[hashValue] & windowMask] contains the previous index
	// with the same hash value.
	// These are large and do not contain pointers, so put them
	// near the end of the struct so the GC has to scan less.
	public get chainHead(): number {
		return this._fields.chainHead.value
	}
	public set chainHead(value: number) {
		this._fields.chainHead.value = value
	}

	public get hashHead(): number[] {
		return this._fields.hashHead.value
	}
	public set hashHead(value: number[]) {
		this._fields.hashHead.value = value
	}

	public get hashPrev(): number[] {
		return this._fields.hashPrev.value
	}
	public set hashPrev(value: number[]) {
		this._fields.hashPrev.value = value
	}

	public get hashOffset(): number {
		return this._fields.hashOffset.value
	}
	public set hashOffset(value: number) {
		this._fields.hashOffset.value = value
	}

	// hashMatch must be able to contain hashes for the maximum match length.
	public get hashMatch(): number[] {
		return this._fields.hashMatch.value
	}
	public set hashMatch(value: number[]) {
		this._fields.hashMatch.value = value
	}

	public _fields: {
		compressionLevel: $.VarRef<compressionLevel>
		w: $.VarRef<__goscript_huffman_bit_writer.huffmanBitWriter | $.VarRef<__goscript_huffman_bit_writer.huffmanBitWriter> | null>
		bulkHasher: $.VarRef<((_p0: $.Slice<number>, _p1: $.Slice<number>) => void) | null>
		fill: $.VarRef<((_p0: compressor | $.VarRef<compressor> | null, _p1: $.Slice<number>) => number | globalThis.Promise<number>) | null>
		step: $.VarRef<((_p0: compressor | $.VarRef<compressor> | null) => void) | null>
		bestSpeed: $.VarRef<__goscript_deflatefast.deflateFast | $.VarRef<__goscript_deflatefast.deflateFast> | null>
		index: $.VarRef<number>
		window: $.VarRef<$.Slice<number>>
		windowEnd: $.VarRef<number>
		blockStart: $.VarRef<number>
		byteAvailable: $.VarRef<boolean>
		sync: $.VarRef<boolean>
		tokens: $.VarRef<$.Slice<__goscript_token.token>>
		length: $.VarRef<number>
		offset: $.VarRef<number>
		maxInsertIndex: $.VarRef<number>
		err: $.VarRef<$.GoError>
		chainHead: $.VarRef<number>
		hashHead: $.VarRef<number[]>
		hashPrev: $.VarRef<number[]>
		hashOffset: $.VarRef<number>
		hashMatch: $.VarRef<number[]>
	}

	constructor(init?: Partial<{compressionLevel?: compressionLevel, w?: __goscript_huffman_bit_writer.huffmanBitWriter | $.VarRef<__goscript_huffman_bit_writer.huffmanBitWriter> | null, bulkHasher?: ((_p0: $.Slice<number>, _p1: $.Slice<number>) => void) | null, fill?: ((_p0: compressor | $.VarRef<compressor> | null, _p1: $.Slice<number>) => number | globalThis.Promise<number>) | null, step?: ((_p0: compressor | $.VarRef<compressor> | null) => void) | null, bestSpeed?: __goscript_deflatefast.deflateFast | $.VarRef<__goscript_deflatefast.deflateFast> | null, index?: number, window?: $.Slice<number>, windowEnd?: number, blockStart?: number, byteAvailable?: boolean, sync?: boolean, tokens?: $.Slice<__goscript_token.token>, length?: number, offset?: number, maxInsertIndex?: number, err?: $.GoError, chainHead?: number, hashHead?: number[], hashPrev?: number[], hashOffset?: number, hashMatch?: number[]}>) {
		this._fields = {
			compressionLevel: $.varRef(init?.compressionLevel ? $.markAsStructValue($.cloneStructValue(init.compressionLevel)) : $.markAsStructValue(new compressionLevel())),
			w: $.varRef(init?.w ?? (null as unknown as __goscript_huffman_bit_writer.huffmanBitWriter | $.VarRef<__goscript_huffman_bit_writer.huffmanBitWriter> | null)),
			bulkHasher: $.varRef(init?.bulkHasher ?? (null as unknown as ((_p0: $.Slice<number>, _p1: $.Slice<number>) => void) | null)),
			fill: $.varRef(init?.fill ?? (null as unknown as ((_p0: compressor | $.VarRef<compressor> | null, _p1: $.Slice<number>) => number | globalThis.Promise<number>) | null)),
			step: $.varRef(init?.step ?? (null as unknown as ((_p0: compressor | $.VarRef<compressor> | null) => void) | null)),
			bestSpeed: $.varRef(init?.bestSpeed ?? (null as unknown as __goscript_deflatefast.deflateFast | $.VarRef<__goscript_deflatefast.deflateFast> | null)),
			index: $.varRef(init?.index ?? (0 as unknown as number)),
			window: $.varRef(init?.window ?? (null as unknown as $.Slice<number>)),
			windowEnd: $.varRef(init?.windowEnd ?? (0 as unknown as number)),
			blockStart: $.varRef(init?.blockStart ?? (0 as unknown as number)),
			byteAvailable: $.varRef(init?.byteAvailable ?? (false as unknown as boolean)),
			sync: $.varRef(init?.sync ?? (false as unknown as boolean)),
			tokens: $.varRef(init?.tokens ?? (null as unknown as $.Slice<__goscript_token.token>)),
			length: $.varRef(init?.length ?? (0 as unknown as number)),
			offset: $.varRef(init?.offset ?? (0 as unknown as number)),
			maxInsertIndex: $.varRef(init?.maxInsertIndex ?? (0 as unknown as number)),
			err: $.varRef(init?.err ?? (null as unknown as $.GoError)),
			chainHead: $.varRef(init?.chainHead ?? (0 as unknown as number)),
			hashHead: $.varRef(init?.hashHead !== undefined ? $.cloneArrayValue(init.hashHead) : Array.from({ length: 131072 }, () => 0)),
			hashPrev: $.varRef(init?.hashPrev !== undefined ? $.cloneArrayValue(init.hashPrev) : Array.from({ length: 32768 }, () => 0)),
			hashOffset: $.varRef(init?.hashOffset ?? (0 as unknown as number)),
			hashMatch: $.varRef(init?.hashMatch !== undefined ? $.cloneArrayValue(init.hashMatch) : Array.from({ length: 257 }, () => 0))
		}
	}

	public clone(): compressor {
		const cloned = new compressor()
		cloned._fields = {
			compressionLevel: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.compressionLevel.value))),
			w: $.varRef(this._fields.w.value),
			bulkHasher: $.varRef(this._fields.bulkHasher.value),
			fill: $.varRef(this._fields.fill.value),
			step: $.varRef(this._fields.step.value),
			bestSpeed: $.varRef(this._fields.bestSpeed.value),
			index: $.varRef(this._fields.index.value),
			window: $.varRef(this._fields.window.value),
			windowEnd: $.varRef(this._fields.windowEnd.value),
			blockStart: $.varRef(this._fields.blockStart.value),
			byteAvailable: $.varRef(this._fields.byteAvailable.value),
			sync: $.varRef(this._fields.sync.value),
			tokens: $.varRef(this._fields.tokens.value),
			length: $.varRef(this._fields.length.value),
			offset: $.varRef(this._fields.offset.value),
			maxInsertIndex: $.varRef(this._fields.maxInsertIndex.value),
			err: $.varRef(this._fields.err.value),
			chainHead: $.varRef(this._fields.chainHead.value),
			hashHead: $.varRef($.cloneArrayValue(this._fields.hashHead.value)),
			hashPrev: $.varRef($.cloneArrayValue(this._fields.hashPrev.value)),
			hashOffset: $.varRef(this._fields.hashOffset.value),
			hashMatch: $.varRef($.cloneArrayValue(this._fields.hashMatch.value))
		}
		return $.markAsStructValue(cloned)
	}

	public async close(): globalThis.Promise<$.GoError> {
		let d: compressor | $.VarRef<compressor> | null = this
		if ($.comparableEqual($.pointerValue<compressor>(d).err, errWriterClosed)) {
			return null
		}
		if ($.pointerValue<compressor>(d).err != null) {
			return $.pointerValue<compressor>(d).err
		}
		$.pointerValue<compressor>(d).sync = true
		await $.pointerValue<compressor>(d).step!(d)
		if ($.pointerValue<compressor>(d).err != null) {
			return $.pointerValue<compressor>(d).err
		}
		{
			await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.writeStoredHeader.call($.pointerValue<compressor>(d).w, 0, true)
			if ($.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err != null) {
				return $.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err
			}
		}
		await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.flush.call($.pointerValue<compressor>(d).w)
		if ($.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err != null) {
			return $.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err
		}
		$.pointerValue<compressor>(d).err = errWriterClosed
		return null
	}

	public async deflate(): globalThis.Promise<void> {
		let d: compressor | $.VarRef<compressor> | null = this
		if ((($.pointerValue<compressor>(d).windowEnd - $.pointerValue<compressor>(d).index) < (4 + 258)) && !$.pointerValue<compressor>(d).sync) {
			return
		}

		$.pointerValue<compressor>(d).maxInsertIndex = $.pointerValue<compressor>(d).windowEnd - (4 - 1)

		Loop: while (true) {
			if ($.pointerValue<compressor>(d).index > $.pointerValue<compressor>(d).windowEnd) {
				$.panic("index > windowEnd")
			}
			let lookahead = $.pointerValue<compressor>(d).windowEnd - $.pointerValue<compressor>(d).index
			if (lookahead < (4 + 258)) {
				if (!$.pointerValue<compressor>(d).sync) {
					break Loop
				}
				if ($.pointerValue<compressor>(d).index > $.pointerValue<compressor>(d).windowEnd) {
					$.panic("index > windowEnd")
				}
				if (lookahead == 0) {
					// Flush current output block if any.
					if ($.pointerValue<compressor>(d).byteAvailable) {
						// There is still one pending token that needs to be flushed
						$.pointerValue<compressor>(d).tokens = $.append($.pointerValue<compressor>(d).tokens, $.uint(__goscript_token.literalToken($.uint($.uint($.pointerValue<compressor>(d).window![$.pointerValue<compressor>(d).index - 1], 32), 32)), 32))
						$.pointerValue<compressor>(d).byteAvailable = false
					}
					if ($.len($.pointerValue<compressor>(d).tokens) > 0) {
						{
							$.pointerValue<compressor>(d).err = await compressor.prototype.writeBlock.call(d, $.pointerValue<compressor>(d).tokens, $.pointerValue<compressor>(d).index)
							if ($.pointerValue<compressor>(d).err != null) {
								return
							}
						}
						$.pointerValue<compressor>(d).tokens = $.goSlice($.pointerValue<compressor>(d).tokens, undefined, 0)
					}
					break Loop
				}
			}
			if ($.pointerValue<compressor>(d).index < $.pointerValue<compressor>(d).maxInsertIndex) {
				// Update the hash
				let hash = $.uint(hash4($.goSlice($.pointerValue<compressor>(d).window, $.pointerValue<compressor>(d).index, $.pointerValue<compressor>(d).index + 4)), 32)
				let hh = $.indexRef($.pointerValue<compressor>(d).hashHead, hash & 131071)
				$.pointerValue<compressor>(d).chainHead = $.int($.pointerValue<number>(hh))
				$.pointerValue<compressor>(d).hashPrev[$.pointerValue<compressor>(d).index & 32767] = $.uint($.uint($.pointerValue<compressor>(d).chainHead, 32), 32)
				hh!.value = $.uint($.uint($.pointerValue<compressor>(d).index + $.pointerValue<compressor>(d).hashOffset, 32), 32)
			}
			let prevLength = $.pointerValue<compressor>(d).length
			let prevOffset = $.pointerValue<compressor>(d).offset
			$.pointerValue<compressor>(d).length = 4 - 1
			$.pointerValue<compressor>(d).offset = 0
			let minIndex = $.pointerValue<compressor>(d).index - 32768
			if (minIndex < 0) {
				minIndex = 0
			}

			if ((($.pointerValue<compressor>(d).chainHead - $.pointerValue<compressor>(d).hashOffset) >= minIndex) && ((($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing != 2147483647) && (lookahead > (4 - 1))) || ((($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing == 2147483647) && (lookahead > prevLength)) && (prevLength < $.pointerValue<compressor>(d).compressionLevel.lazy)))) {
				{
					let [newLength, newOffset, ok] = compressor.prototype.findMatch.call(d, $.pointerValue<compressor>(d).index, $.pointerValue<compressor>(d).chainHead - $.pointerValue<compressor>(d).hashOffset, 4 - 1, lookahead)
					if (ok) {
						$.pointerValue<compressor>(d).length = newLength
						$.pointerValue<compressor>(d).offset = newOffset
					}
				}
			}
			if ((($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing != 2147483647) && ($.pointerValue<compressor>(d).length >= 4)) || ((($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing == 2147483647) && (prevLength >= 4)) && ($.pointerValue<compressor>(d).length <= prevLength))) {
				// There was a match at the previous step, and the current match is
				// not better. Output the previous match.
				if ($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing != 2147483647) {
					$.pointerValue<compressor>(d).tokens = $.append($.pointerValue<compressor>(d).tokens, $.uint(__goscript_token.matchToken($.uint($.uint($.pointerValue<compressor>(d).length - 3, 32), 32), $.uint($.uint($.pointerValue<compressor>(d).offset - 1, 32), 32)), 32))
				} else {
					$.pointerValue<compressor>(d).tokens = $.append($.pointerValue<compressor>(d).tokens, $.uint(__goscript_token.matchToken($.uint($.uint(prevLength - 3, 32), 32), $.uint($.uint(prevOffset - 1, 32), 32)), 32))
				}
				// Insert in the hash table all strings up to the end of the match.
				// index and index-1 are already inserted. If there is not enough
				// lookahead, the last two strings are not inserted into the hash
				// table.
				if ($.pointerValue<compressor>(d).length <= $.pointerValue<compressor>(d).compressionLevel.fastSkipHashing) {
					let newIndex: number = 0
					if ($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing != 2147483647) {
						newIndex = $.pointerValue<compressor>(d).index + $.pointerValue<compressor>(d).length
					} else {
						newIndex = ($.pointerValue<compressor>(d).index + prevLength) - 1
					}
					let index = $.pointerValue<compressor>(d).index
					for (index++; index < newIndex; index++) {
						if (index < $.pointerValue<compressor>(d).maxInsertIndex) {
							let hash = $.uint(hash4($.goSlice($.pointerValue<compressor>(d).window, index, index + 4)), 32)
							// Get previous value with the same hash.
							// Our chain should point to the previous value.
							let hh = $.indexRef($.pointerValue<compressor>(d).hashHead, hash & 131071)
							$.pointerValue<compressor>(d).hashPrev[index & 32767] = $.uint($.pointerValue<number>(hh), 32)
							// Set the head of the hash chain to us.
							hh!.value = $.uint($.uint(index + $.pointerValue<compressor>(d).hashOffset, 32), 32)
						}
					}
					$.pointerValue<compressor>(d).index = index

					if ($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing == 2147483647) {
						$.pointerValue<compressor>(d).byteAvailable = false
						$.pointerValue<compressor>(d).length = 4 - 1
					}
				} else {
					// For matches this long, we don't bother inserting each individual
					// item into the table.
					$.pointerValue<compressor>(d).index = $.pointerValue<compressor>(d).index + ($.pointerValue<compressor>(d).length)
				}
				if ($.len($.pointerValue<compressor>(d).tokens) == 16384) {
					// The block includes the current character
					{
						$.pointerValue<compressor>(d).err = await compressor.prototype.writeBlock.call(d, $.pointerValue<compressor>(d).tokens, $.pointerValue<compressor>(d).index)
						if ($.pointerValue<compressor>(d).err != null) {
							return
						}
					}
					$.pointerValue<compressor>(d).tokens = $.goSlice($.pointerValue<compressor>(d).tokens, undefined, 0)
				}
			} else {
				if (($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing != 2147483647) || $.pointerValue<compressor>(d).byteAvailable) {
					let i = $.pointerValue<compressor>(d).index - 1
					if ($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing != 2147483647) {
						i = $.pointerValue<compressor>(d).index
					}
					$.pointerValue<compressor>(d).tokens = $.append($.pointerValue<compressor>(d).tokens, $.uint(__goscript_token.literalToken($.uint($.uint($.pointerValue<compressor>(d).window![i], 32), 32)), 32))
					if ($.len($.pointerValue<compressor>(d).tokens) == 16384) {
						{
							$.pointerValue<compressor>(d).err = await compressor.prototype.writeBlock.call(d, $.pointerValue<compressor>(d).tokens, i + 1)
							if ($.pointerValue<compressor>(d).err != null) {
								return
							}
						}
						$.pointerValue<compressor>(d).tokens = $.goSlice($.pointerValue<compressor>(d).tokens, undefined, 0)
					}
				}
				$.pointerValue<compressor>(d).index++
				if ($.pointerValue<compressor>(d).compressionLevel.fastSkipHashing == 2147483647) {
					$.pointerValue<compressor>(d).byteAvailable = true
				}
			}
		}
	}

	public async encSpeed(): globalThis.Promise<void> {
		let d: compressor | $.VarRef<compressor> | null = this
		// We only compress if we have maxStoreBlockSize.
		if ($.pointerValue<compressor>(d).windowEnd < 65535) {
			if (!$.pointerValue<compressor>(d).sync) {
				return
			}

			// Handle small sizes.
			if ($.pointerValue<compressor>(d).windowEnd < 128) {
				switch (true) {
					case $.pointerValue<compressor>(d).windowEnd == 0:
					{
						return
						break
					}
					case $.pointerValue<compressor>(d).windowEnd <= 16:
					{
						$.pointerValue<compressor>(d).err = await compressor.prototype.writeStoredBlock.call(d, $.goSlice($.pointerValue<compressor>(d).window, undefined, $.pointerValue<compressor>(d).windowEnd))
						break
					}
					default:
					{
						await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.writeBlockHuff.call($.pointerValue<compressor>(d).w, false, $.goSlice($.pointerValue<compressor>(d).window, undefined, $.pointerValue<compressor>(d).windowEnd))
						$.pointerValue<compressor>(d).err = $.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err
						break
					}
				}
				$.pointerValue<compressor>(d).windowEnd = 0
				__goscript_deflatefast.deflateFast.prototype.reset.call($.pointerValue<compressor>(d).bestSpeed)
				return
			}
		}
		// Encode the block.
		$.pointerValue<compressor>(d).tokens = __goscript_deflatefast.deflateFast.prototype.encode.call($.pointerValue<compressor>(d).bestSpeed, $.goSlice($.pointerValue<compressor>(d).tokens, undefined, 0), $.goSlice($.pointerValue<compressor>(d).window, undefined, $.pointerValue<compressor>(d).windowEnd))

		// If we removed less than 1/16th, Huffman compress the block.
		if ($.len($.pointerValue<compressor>(d).tokens) > ($.pointerValue<compressor>(d).windowEnd - ($.pointerValue<compressor>(d).windowEnd >> 4))) {
			await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.writeBlockHuff.call($.pointerValue<compressor>(d).w, false, $.goSlice($.pointerValue<compressor>(d).window, undefined, $.pointerValue<compressor>(d).windowEnd))
		} else {
			await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.writeBlockDynamic.call($.pointerValue<compressor>(d).w, $.pointerValue<compressor>(d).tokens, false, $.goSlice($.pointerValue<compressor>(d).window, undefined, $.pointerValue<compressor>(d).windowEnd))
		}
		$.pointerValue<compressor>(d).err = $.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err
		$.pointerValue<compressor>(d).windowEnd = 0
	}

	public fillDeflate(b: $.Slice<number>): number {
		let d: compressor | $.VarRef<compressor> | null = this
		if ($.pointerValue<compressor>(d).index >= ((2 * 32768) - (4 + 258))) {
			// shift the window by windowSize
			$.copy($.pointerValue<compressor>(d).window, $.goSlice($.pointerValue<compressor>(d).window, 32768, 2 * 32768))
			$.pointerValue<compressor>(d).index = $.pointerValue<compressor>(d).index - (32768)
			$.pointerValue<compressor>(d).windowEnd = $.pointerValue<compressor>(d).windowEnd - (32768)
			if ($.pointerValue<compressor>(d).blockStart >= 32768) {
				$.pointerValue<compressor>(d).blockStart = $.pointerValue<compressor>(d).blockStart - (32768)
			} else {
				$.pointerValue<compressor>(d).blockStart = math.MaxInt32
			}
			$.pointerValue<compressor>(d).hashOffset = $.pointerValue<compressor>(d).hashOffset + (32768)
			if ($.pointerValue<compressor>(d).hashOffset > 16777216) {
				let delta = $.pointerValue<compressor>(d).hashOffset - 1
				$.pointerValue<compressor>(d).hashOffset = $.pointerValue<compressor>(d).hashOffset - (delta)
				$.pointerValue<compressor>(d).chainHead = $.pointerValue<compressor>(d).chainHead - (delta)

				// Iterate over slices instead of arrays to avoid copying
				// the entire table onto the stack (Issue #18625).
				for (let __goscriptRangeTarget0 = $.goSlice($.pointerValue<compressor>(d).hashPrev, undefined, undefined), i = 0; i < $.len(__goscriptRangeTarget0); i++) {
					let v = __goscriptRangeTarget0![i]
					if ($.int(v) > delta) {
						$.pointerValue<compressor>(d).hashPrev[i] = $.uint($.uint($.int(v) - delta, 32), 32)
					} else {
						$.pointerValue<compressor>(d).hashPrev[i] = $.uint(0, 32)
					}
				}
				for (let __goscriptRangeTarget1 = $.goSlice($.pointerValue<compressor>(d).hashHead, undefined, undefined), i = 0; i < $.len(__goscriptRangeTarget1); i++) {
					let v = __goscriptRangeTarget1![i]
					if ($.int(v) > delta) {
						$.pointerValue<compressor>(d).hashHead[i] = $.uint($.uint($.int(v) - delta, 32), 32)
					} else {
						$.pointerValue<compressor>(d).hashHead[i] = $.uint(0, 32)
					}
				}
			}
		}
		let n = $.copy($.goSlice($.pointerValue<compressor>(d).window, $.pointerValue<compressor>(d).windowEnd, undefined), b)
		$.pointerValue<compressor>(d).windowEnd = $.pointerValue<compressor>(d).windowEnd + (n)
		return n
	}

	public fillStore(b: $.Slice<number>): number {
		let d: compressor | $.VarRef<compressor> | null = this
		let n = $.copy($.goSlice($.pointerValue<compressor>(d).window, $.pointerValue<compressor>(d).windowEnd, undefined), b)
		$.pointerValue<compressor>(d).windowEnd = $.pointerValue<compressor>(d).windowEnd + (n)
		return n
	}

	public async fillWindow(b: $.Slice<number>): globalThis.Promise<void> {
		let d: compressor | $.VarRef<compressor> | null = this
		// Do not fill window if we are in store-only mode.
		if ($.pointerValue<compressor>(d).compressionLevel.level < 2) {
			return
		}
		if (($.pointerValue<compressor>(d).index != 0) || ($.pointerValue<compressor>(d).windowEnd != 0)) {
			$.panic("internal error: fillWindow called with stale data")
		}

		// If we are given too much, cut it.
		if ($.len(b) > 32768) {
			b = $.goSlice(b, $.len(b) - 32768, undefined)
		}
		// Add all to window.
		let n = $.copy($.pointerValue<compressor>(d).window, b)

		// Calculate 256 hashes at the time (more L1 cache hits)
		let loops = Math.trunc(((n + 256) - 4) / 256)
		for (let j = 0; j < loops; j++) {
			let index = j * 256
			let end = ((index + 256) + 4) - 1
			if (end > n) {
				end = n
			}
			let toCheck: $.Slice<number> = $.goSlice($.pointerValue<compressor>(d).window, index, end)
			let dstSize = ($.len(toCheck) - 4) + 1

			if (dstSize <= 0) {
				continue
			}

			let dst: $.Slice<number> = $.goSlice($.pointerValue<compressor>(d).hashMatch, undefined, dstSize)
			await $.pointerValue<compressor>(d).bulkHasher!(toCheck, dst)
			for (let __goscriptRangeTarget2 = dst, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
				let val = __goscriptRangeTarget2![i]
				let di = i + index
				let hh = $.indexRef($.pointerValue<compressor>(d).hashHead, val & 131071)
				// Get previous value with the same hash.
				// Our chain should point to the previous value.
				$.pointerValue<compressor>(d).hashPrev[di & 32767] = $.uint($.pointerValue<number>(hh), 32)
				// Set the head of the hash chain to us.
				hh!.value = $.uint($.uint(di + $.pointerValue<compressor>(d).hashOffset, 32), 32)
			}
		}
		// Update window information.
		$.pointerValue<compressor>(d).windowEnd = n
		$.pointerValue<compressor>(d).index = n
	}

	public findMatch(pos: number, prevHead: number, prevLength: number, lookahead: number): [number, number, boolean] {
		const d: compressor | $.VarRef<compressor> | null = this
		let length: number = 0
		let offset: number = 0
		let ok: boolean = false
		let minMatchLook = 258
		if (lookahead < minMatchLook) {
			minMatchLook = lookahead
		}

		let win: $.Slice<number> = $.goSlice($.pointerValue<compressor>(d).window, 0, pos + minMatchLook)

		// We quit when we get a match that's at least nice long
		let nice = $.len(win) - pos
		if ($.pointerValue<compressor>(d).compressionLevel.nice < nice) {
			nice = $.pointerValue<compressor>(d).compressionLevel.nice
		}

		// If we've got a match that's good enough, only look in 1/4 the chain.
		let tries = $.pointerValue<compressor>(d).compressionLevel.chain
		length = prevLength
		if (length >= $.pointerValue<compressor>(d).compressionLevel.good) {
			tries = tries >> (2)
		}

		let wEnd = $.uint(win![pos + length], 8)
		let wPos: $.Slice<number> = $.goSlice(win, pos, undefined)
		let minIndex = pos - 32768

		for (let i = prevHead; tries > 0; tries--) {
			if ($.uint(wEnd, 8) == $.uint(win![i + length], 8)) {
				let n = matchLen($.goSlice(win, i, undefined), wPos, minMatchLook)

				if ((n > length) && ((n > 4) || ((pos - i) <= 4096))) {
					length = n
					offset = pos - i
					ok = true
					if (n >= nice) {
						// The match is good enough that we don't try to find a better one.
						break
					}
					wEnd = $.uint(win![pos + n], 8)
				}
			}
			if (i == minIndex) {
				// hashPrev[i & windowMask] has already been overwritten, so stop now.
				break
			}
			i = $.int($.pointerValue<compressor>(d).hashPrev[i & 32767]) - $.pointerValue<compressor>(d).hashOffset
			if ((i < minIndex) || (i < 0)) {
				break
			}
		}
		return [length, offset, ok]
	}

	public init(w: io.Writer | null, level: number): $.GoError {
		let d: compressor | $.VarRef<compressor> | null = this
		let err: $.GoError = null as $.GoError
		$.pointerValue<compressor>(d).w = __goscript_huffman_bit_writer.newHuffmanBitWriter(w)

		switch (true) {
			case level == 0:
			{
				$.pointerValue<compressor>(d).window = $.makeSlice<number>(65535, undefined, "byte")
				$.pointerValue<compressor>(d).fill = $.functionValue((d: compressor | $.VarRef<compressor> | null, b: $.Slice<number>): number => $.pointerValue<compressor>(d).fillStore(b), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
				$.pointerValue<compressor>(d).step = $.functionValue(async (d: compressor | $.VarRef<compressor> | null): globalThis.Promise<void> => await $.pointerValue<compressor>(d).store(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }], results: [] } as $.FunctionTypeInfo))
				break
			}
			case level == -2:
			{
				$.pointerValue<compressor>(d).window = $.makeSlice<number>(65535, undefined, "byte")
				$.pointerValue<compressor>(d).fill = $.functionValue((d: compressor | $.VarRef<compressor> | null, b: $.Slice<number>): number => $.pointerValue<compressor>(d).fillStore(b), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
				$.pointerValue<compressor>(d).step = $.functionValue(async (d: compressor | $.VarRef<compressor> | null): globalThis.Promise<void> => await $.pointerValue<compressor>(d).storeHuff(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }], results: [] } as $.FunctionTypeInfo))
				break
			}
			case level == 1:
			{
				$.pointerValue<compressor>(d).compressionLevel = $.markAsStructValue($.cloneStructValue(levels![level]))
				$.pointerValue<compressor>(d).window = $.makeSlice<number>(65535, undefined, "byte")
				$.pointerValue<compressor>(d).fill = $.functionValue((d: compressor | $.VarRef<compressor> | null, b: $.Slice<number>): number => $.pointerValue<compressor>(d).fillStore(b), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
				$.pointerValue<compressor>(d).step = $.functionValue(async (d: compressor | $.VarRef<compressor> | null): globalThis.Promise<void> => await $.pointerValue<compressor>(d).encSpeed(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }], results: [] } as $.FunctionTypeInfo))
				$.pointerValue<compressor>(d).bestSpeed = __goscript_deflatefast.newDeflateFast()
				$.pointerValue<compressor>(d).tokens = $.makeSlice<__goscript_token.token>(65535, undefined, "number")
				break
			}
			case level == -1:
			{
				level = 6
			}
			case (2 <= level) && (level <= 9):
			{
				$.pointerValue<compressor>(d).compressionLevel = $.markAsStructValue($.cloneStructValue(levels![level]))
				compressor.prototype.initDeflate.call(d)
				$.pointerValue<compressor>(d).fill = $.functionValue((d: compressor | $.VarRef<compressor> | null, b: $.Slice<number>): number => $.pointerValue<compressor>(d).fillDeflate(b), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
				$.pointerValue<compressor>(d).step = $.functionValue(async (d: compressor | $.VarRef<compressor> | null): globalThis.Promise<void> => await $.pointerValue<compressor>(d).deflate(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }], results: [] } as $.FunctionTypeInfo))
				break
			}
			default:
			{
				return fmt.Errorf("flate: invalid compression level %d: want value in range [-2, 9]", $.namedValueInterfaceValue<any>(level, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
				break
			}
		}
		return null
	}

	public initDeflate(): void {
		let d: compressor | $.VarRef<compressor> | null = this
		$.pointerValue<compressor>(d).window = $.makeSlice<number>(2 * 32768, undefined, "byte")
		$.pointerValue<compressor>(d).hashOffset = 1
		$.pointerValue<compressor>(d).tokens = $.makeSlice<__goscript_token.token>(0, 16384 + 1, "number")
		$.pointerValue<compressor>(d).length = 4 - 1
		$.pointerValue<compressor>(d).offset = 0
		$.pointerValue<compressor>(d).byteAvailable = false
		$.pointerValue<compressor>(d).index = 0
		$.pointerValue<compressor>(d).chainHead = -1
		$.pointerValue<compressor>(d).bulkHasher = bulkHash4
	}

	public reset(w: io.Writer | null): void {
		let d: compressor | $.VarRef<compressor> | null = this
		__goscript_huffman_bit_writer.huffmanBitWriter.prototype.reset.call($.pointerValue<compressor>(d).w, w)
		$.pointerValue<compressor>(d).sync = false
		$.pointerValue<compressor>(d).err = null
		switch ($.pointerValue<compressor>(d).compressionLevel.level) {
			case 0:
			{
				$.pointerValue<compressor>(d).windowEnd = 0
				break
			}
			case 1:
			{
				$.pointerValue<compressor>(d).windowEnd = 0
				$.pointerValue<compressor>(d).tokens = $.goSlice($.pointerValue<compressor>(d).tokens, undefined, 0)
				__goscript_deflatefast.deflateFast.prototype.reset.call($.pointerValue<compressor>(d).bestSpeed)
				break
			}
			default:
			{
				$.pointerValue<compressor>(d).chainHead = -1
				$.clear($.goSlice($.pointerValue<compressor>(d).hashHead, undefined, undefined))
				$.clear($.goSlice($.pointerValue<compressor>(d).hashPrev, undefined, undefined))
				$.pointerValue<compressor>(d).hashOffset = 1
				let __goscriptAssign0_0: number = 0
				let __goscriptAssign0_1: number = 0
				$.pointerValue<compressor>(d).index = __goscriptAssign0_0
				$.pointerValue<compressor>(d).windowEnd = __goscriptAssign0_1
				let __goscriptAssign1_0: number = 0
				let __goscriptAssign1_1: boolean = false
				$.pointerValue<compressor>(d).blockStart = __goscriptAssign1_0
				$.pointerValue<compressor>(d).byteAvailable = __goscriptAssign1_1
				$.pointerValue<compressor>(d).tokens = $.goSlice($.pointerValue<compressor>(d).tokens, undefined, 0)
				$.pointerValue<compressor>(d).length = 4 - 1
				$.pointerValue<compressor>(d).offset = 0
				$.pointerValue<compressor>(d).maxInsertIndex = 0
				break
			}
		}
	}

	public async store(): globalThis.Promise<void> {
		let d: compressor | $.VarRef<compressor> | null = this
		if (($.pointerValue<compressor>(d).windowEnd > 0) && (($.pointerValue<compressor>(d).windowEnd == 65535) || $.pointerValue<compressor>(d).sync)) {
			$.pointerValue<compressor>(d).err = await compressor.prototype.writeStoredBlock.call(d, $.goSlice($.pointerValue<compressor>(d).window, undefined, $.pointerValue<compressor>(d).windowEnd))
			$.pointerValue<compressor>(d).windowEnd = 0
		}
	}

	public async storeHuff(): globalThis.Promise<void> {
		let d: compressor | $.VarRef<compressor> | null = this
		if ((($.pointerValue<compressor>(d).windowEnd < $.len($.pointerValue<compressor>(d).window)) && !$.pointerValue<compressor>(d).sync) || ($.pointerValue<compressor>(d).windowEnd == 0)) {
			return
		}
		await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.writeBlockHuff.call($.pointerValue<compressor>(d).w, false, $.goSlice($.pointerValue<compressor>(d).window, undefined, $.pointerValue<compressor>(d).windowEnd))
		$.pointerValue<compressor>(d).err = $.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err
		$.pointerValue<compressor>(d).windowEnd = 0
	}

	public async syncFlush(): globalThis.Promise<$.GoError> {
		let d: compressor | $.VarRef<compressor> | null = this
		if ($.pointerValue<compressor>(d).err != null) {
			return $.pointerValue<compressor>(d).err
		}
		$.pointerValue<compressor>(d).sync = true
		await $.pointerValue<compressor>(d).step!(d)
		if ($.pointerValue<compressor>(d).err == null) {
			await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.writeStoredHeader.call($.pointerValue<compressor>(d).w, 0, false)
			await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.flush.call($.pointerValue<compressor>(d).w)
			$.pointerValue<compressor>(d).err = $.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err
		}
		$.pointerValue<compressor>(d).sync = false
		return $.pointerValue<compressor>(d).err
	}

	public async write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const d: compressor | $.VarRef<compressor> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<compressor>(d).err != null) {
			return [0, $.pointerValue<compressor>(d).err]
		}
		n = $.len(b)
		while ($.len(b) > 0) {
			await $.pointerValue<compressor>(d).step!(d)
			b = $.goSlice(b, await $.pointerValue<compressor>(d).fill!(d, b), undefined)
			if ($.pointerValue<compressor>(d).err != null) {
				return [0, $.pointerValue<compressor>(d).err]
			}
		}
		return [n, null]
	}

	public async writeBlock(tokens: $.Slice<__goscript_token.token>, index: number): globalThis.Promise<$.GoError> {
		let d: compressor | $.VarRef<compressor> | null = this
		if (index > 0) {
			let window: $.Slice<number> = null as $.Slice<number>
			if ($.pointerValue<compressor>(d).blockStart <= index) {
				window = $.goSlice($.pointerValue<compressor>(d).window, $.pointerValue<compressor>(d).blockStart, index)
			}
			$.pointerValue<compressor>(d).blockStart = index
			await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.writeBlock.call($.pointerValue<compressor>(d).w, tokens, false, window)
			return $.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err
		}
		return null
	}

	public async writeStoredBlock(buf: $.Slice<number>): globalThis.Promise<$.GoError> {
		const d: compressor | $.VarRef<compressor> | null = this
		{
			await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.writeStoredHeader.call($.pointerValue<compressor>(d).w, $.len(buf), false)
			if ($.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err != null) {
				return $.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err
			}
		}
		await __goscript_huffman_bit_writer.huffmanBitWriter.prototype.writeBytes.call($.pointerValue<compressor>(d).w, buf)
		return $.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<compressor>(d).w).err
	}

	static __typeInfo = $.registerStructType(
		"flate.compressor",
		() => new compressor(),
		[{ name: "close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "deflate", args: [], returns: [] }, { name: "encSpeed", args: [], returns: [] }, { name: "fillDeflate", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "fillStore", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "fillWindow", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "findMatch", args: [{ name: "pos", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "prevHead", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "prevLength", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "lookahead", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "length", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "ok", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "init", args: [{ name: "w", type: "io.Writer" }, { name: "level", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "err", type: "error" }] }, { name: "initDeflate", args: [], returns: [] }, { name: "reset", args: [{ name: "w", type: "io.Writer" }], returns: [] }, { name: "store", args: [], returns: [] }, { name: "storeHuff", args: [], returns: [] }, { name: "syncFlush", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeBlock", args: [{ name: "tokens", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "flate.token" } } }, { name: "index", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "writeStoredBlock", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }],
		compressor,
		[{ name: "compressionLevel", key: "compressionLevel", type: "flate.compressionLevel", pkgPath: "compress/flate", anonymous: true, index: [0], offset: 0, exported: false }, { name: "w", key: "w", type: { kind: $.TypeKind.Pointer, elemType: "flate.huffmanBitWriter" }, pkgPath: "compress/flate", index: [1], offset: 48, exported: false }, { name: "bulkHasher", key: "bulkHasher", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }], results: [] } as $.FunctionTypeInfo), pkgPath: "compress/flate", index: [2], offset: 56, exported: false }, { name: "fill", key: "fill", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo), pkgPath: "compress/flate", index: [3], offset: 64, exported: false }, { name: "step", key: "step", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.compressor" }], results: [] } as $.FunctionTypeInfo), pkgPath: "compress/flate", index: [4], offset: 72, exported: false }, { name: "bestSpeed", key: "bestSpeed", type: { kind: $.TypeKind.Pointer, elemType: "flate.deflateFast" }, pkgPath: "compress/flate", index: [5], offset: 80, exported: false }, { name: "index", key: "index", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [6], offset: 88, exported: false }, { name: "window", key: "window", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "compress/flate", index: [7], offset: 96, exported: false }, { name: "windowEnd", key: "windowEnd", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [8], offset: 120, exported: false }, { name: "blockStart", key: "blockStart", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [9], offset: 128, exported: false }, { name: "byteAvailable", key: "byteAvailable", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "compress/flate", index: [10], offset: 136, exported: false }, { name: "sync", key: "sync", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "compress/flate", index: [11], offset: 137, exported: false }, { name: "tokens", key: "tokens", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "flate.token" } }, pkgPath: "compress/flate", index: [12], offset: 144, exported: false }, { name: "length", key: "length", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [13], offset: 168, exported: false }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [14], offset: 176, exported: false }, { name: "maxInsertIndex", key: "maxInsertIndex", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [15], offset: 184, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "compress/flate", index: [16], offset: 192, exported: false }, { name: "chainHead", key: "chainHead", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [17], offset: 208, exported: false }, { name: "hashHead", key: "hashHead", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint32" }, length: 131072 }, pkgPath: "compress/flate", index: [18], offset: 216, exported: false }, { name: "hashPrev", key: "hashPrev", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint32" }, length: 32768 }, pkgPath: "compress/flate", index: [19], offset: 524504, exported: false }, { name: "hashOffset", key: "hashOffset", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [20], offset: 655576, exported: false }, { name: "hashMatch", key: "hashMatch", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint32" }, length: 257 }, pkgPath: "compress/flate", index: [21], offset: 655584, exported: false }]
	)
}

export class dictWriter {
	public get w(): io.Writer | null {
		return this._fields.w.value
	}
	public set w(value: io.Writer | null) {
		this._fields.w.value = value
	}

	public _fields: {
		w: $.VarRef<io.Writer | null>
	}

	constructor(init?: Partial<{w?: io.Writer | null}>) {
		this._fields = {
			w: $.varRef(init?.w ?? (null as unknown as io.Writer | null))
		}
	}

	public clone(): dictWriter {
		const cloned = new dictWriter()
		cloned._fields = {
			w: $.varRef(this._fields.w.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const w: dictWriter | $.VarRef<dictWriter> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		return await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<dictWriter>(w).w).Write(b)
	}

	static __typeInfo = $.registerStructType(
		"flate.dictWriter",
		() => new dictWriter(),
		[{ name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		dictWriter,
		[{ name: "w", key: "w", type: "io.Writer", pkgPath: "compress/flate", index: [0], offset: 0, exported: false }]
	)
}

export class Writer {
	public get d(): compressor {
		return this._fields.d.value
	}
	public set d(value: compressor) {
		this._fields.d.value = value
	}

	public get dict(): $.Slice<number> {
		return this._fields.dict.value
	}
	public set dict(value: $.Slice<number>) {
		this._fields.dict.value = value
	}

	public _fields: {
		d: $.VarRef<compressor>
		dict: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{d?: compressor, dict?: $.Slice<number>}>) {
		this._fields = {
			d: $.varRef(init?.d ? $.markAsStructValue($.cloneStructValue(init.d)) : $.markAsStructValue(new compressor())),
			dict: $.varRef(init?.dict ?? (null as unknown as $.Slice<number>))
		}
	}

	public clone(): Writer {
		const cloned = new Writer()
		cloned._fields = {
			d: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.d.value))),
			dict: $.varRef(this._fields.dict.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const w: Writer | $.VarRef<Writer> | null = this
		return await $.pointerValue<Writer>(w).d.close()
	}

	public async Flush(): globalThis.Promise<$.GoError> {
		const w: Writer | $.VarRef<Writer> | null = this
		// For more about flushing:
		// https://www.bolet.org/~pornin/deflate-flush.html
		return await $.pointerValue<Writer>(w).d.syncFlush()
	}

	public async Reset(dst: io.Writer | null): globalThis.Promise<void> {
		const w: Writer | $.VarRef<Writer> | null = this
		{
			let __goscriptTuple1: any = $.typeAssertTuple<dictWriter | $.VarRef<dictWriter> | null>($.pointerValue<__goscript_huffman_bit_writer.huffmanBitWriter>($.pointerValue<Writer>(w).d.w).writer, { kind: $.TypeKind.Pointer, elemType: "flate.dictWriter" })
			let dw: dictWriter | $.VarRef<dictWriter> | null = __goscriptTuple1[0]
			let ok = __goscriptTuple1[1]
			if (ok) {
				// w was created with NewWriterDict
				$.pointerValue<dictWriter>(dw).w = dst
				$.pointerValue<Writer>(w).d.reset($.interfaceValue<io.Writer | null>(dw, "*flate.dictWriter"))
				await $.pointerValue<Writer>(w).d.fillWindow($.pointerValue<Writer>(w).dict)
			} else {
				// w was created with NewWriter
				$.pointerValue<Writer>(w).d.reset(dst)
			}
		}
	}

	public async Write(data: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const w: Writer | $.VarRef<Writer> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		return await $.pointerValue<Writer>(w).d.write(data)
	}

	static __typeInfo = $.registerStructType(
		"flate.Writer",
		() => new Writer(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Flush", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Reset", args: [{ name: "dst", type: "io.Writer" }], returns: [] }, { name: "Write", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		Writer,
		[{ name: "d", key: "d", type: "flate.compressor", pkgPath: "compress/flate", index: [0], offset: 0, exported: false }, { name: "dict", key: "dict", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "compress/flate", index: [1], offset: 656616, exported: false }]
	)
}

export const NoCompression: number = 0

export const BestSpeed: number = 1

export const BestCompression: number = 9

export const DefaultCompression: number = -1

export const HuffmanOnly: number = -2

export const logWindowSize: number = 15

export const windowSize: number = 32768

export const windowMask: number = 32767

export const baseMatchLength: number = 3

export const minMatchLength: number = 4

export const maxMatchLength: number = 258

export const baseMatchOffset: number = 1

export const maxMatchOffset: number = 32768

export const maxFlateBlockTokens: number = 16384

export const maxStoreBlockSize: number = 65535

export const hashBits: number = 17

export const hashSize: number = 131072

export const hashMask: number = 131071

export const maxHashOffset: number = 16777216

export const skipNever: number = 2147483647

export const hashmul: number = 506832829

export let levels: $.Slice<compressionLevel> = $.arrayToSlice<compressionLevel>([$.markAsStructValue(new compressionLevel({level: 0, good: 0, lazy: 0, nice: 0, chain: 0, fastSkipHashing: 0})), $.markAsStructValue(new compressionLevel({level: 1, good: 0, lazy: 0, nice: 0, chain: 0, fastSkipHashing: 0})), $.markAsStructValue(new compressionLevel({level: 2, good: 4, lazy: 0, nice: 16, chain: 8, fastSkipHashing: 5})), $.markAsStructValue(new compressionLevel({level: 3, good: 4, lazy: 0, nice: 32, chain: 32, fastSkipHashing: 6})), $.markAsStructValue(new compressionLevel({level: 4, good: 4, lazy: 4, nice: 16, chain: 16, fastSkipHashing: 2147483647})), $.markAsStructValue(new compressionLevel({level: 5, good: 8, lazy: 16, nice: 32, chain: 32, fastSkipHashing: 2147483647})), $.markAsStructValue(new compressionLevel({level: 6, good: 8, lazy: 16, nice: 128, chain: 128, fastSkipHashing: 2147483647})), $.markAsStructValue(new compressionLevel({level: 7, good: 8, lazy: 32, nice: 128, chain: 256, fastSkipHashing: 2147483647})), $.markAsStructValue(new compressionLevel({level: 8, good: 32, lazy: 128, nice: 258, chain: 1024, fastSkipHashing: 2147483647})), $.markAsStructValue(new compressionLevel({level: 9, good: 32, lazy: 258, nice: 258, chain: 4096, fastSkipHashing: 2147483647}))])

export function __goscript_set_levels(__goscriptValue: $.Slice<compressionLevel>): void {
	levels = __goscriptValue
}

export function hash4(b: $.Slice<number>): number {
	return $.uint($.uintShr((((($.uint(b![3], 32) | ($.uint(b![2], 32) << 8)) | ($.uint(b![1], 32) << 16)) | ($.uint(b![0], 32) << 24)) * 506832829), (32 - 17), 32), 32)
}

export function bulkHash4(b: $.Slice<number>, dst: $.Slice<number>): void {
	if ($.len(b) < 4) {
		return
	}
	let hb = $.uint((($.uint(b![3], 32) | ($.uint(b![2], 32) << 8)) | ($.uint(b![1], 32) << 16)) | ($.uint(b![0], 32) << 24), 32)
	dst![0] = $.uint($.uintShr((hb * 506832829), (32 - 17), 32), 32)
	let end = ($.len(b) - 4) + 1
	for (let i = 1; i < end; i++) {
		hb = $.uint((hb << 8) | $.uint(b![i + 3], 32), 32)
		dst![i] = $.uint($.uintShr((hb * 506832829), (32 - 17), 32), 32)
	}
}

export function matchLen(a: $.Slice<number>, b: $.Slice<number>, max: number): number {
	a = $.goSlice(a, undefined, max)
	b = $.goSlice(b, undefined, $.len(a))
	for (let __goscriptRangeTarget3 = a, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
		let av = __goscriptRangeTarget3![i]
		if ($.uint(b![i], 8) != $.uint(av, 8)) {
			return i
		}
	}
	return max
}

export function NewWriter(w: io.Writer | null, level: number): [Writer | $.VarRef<Writer> | null, $.GoError] {
	let dw: $.VarRef<Writer> = $.varRef($.markAsStructValue(new Writer()))
	{
		let err = dw.value.d.init(w, level)
		if (err != null) {
			return [null, err]
		}
	}
	return [dw, null]
}

export async function NewWriterDict(w: io.Writer | null, level: number, dict: $.Slice<number>): globalThis.Promise<[Writer | $.VarRef<Writer> | null, $.GoError]> {
	let dw: dictWriter | $.VarRef<dictWriter> | null = new dictWriter({w: w})
	let __goscriptTuple0: any = NewWriter($.interfaceValue<io.Writer | null>(dw, "*flate.dictWriter"), level)
	let zw: Writer | $.VarRef<Writer> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}
	await $.pointerValue<Writer>(zw).d.fillWindow(dict)
	$.pointerValue<Writer>(zw).dict = $.appendSlice($.pointerValue<Writer>(zw).dict, dict)
	return [zw, null]
}

export let errWriterClosed: $.GoError = errors.New("flate: closed writer")

export function __goscript_set_errWriterClosed(__goscriptValue: $.GoError): void {
	errWriterClosed = __goscriptValue
}
