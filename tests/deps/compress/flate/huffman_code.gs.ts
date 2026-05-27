// Generated file based on huffman_code.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

import * as bits2 from "@goscript/math/bits/index.js"

import * as sort2 from "@goscript/sort/index.js"

import * as __goscript_inflate from "./inflate.gs.ts"
import "@goscript/math/index.js"
import "@goscript/math/bits/index.js"
import "@goscript/sort/index.js"
import "./inflate.gs.ts"

export class hcode {
	public get code(): number {
		return this._fields.code.value
	}
	public set code(value: number) {
		this._fields.code.value = value
	}

	public get len(): number {
		return this._fields.len.value
	}
	public set len(value: number) {
		this._fields.len.value = value
	}

	public _fields: {
		code: $.VarRef<number>
		len: $.VarRef<number>
	}

	constructor(init?: Partial<{code?: number, len?: number}>) {
		this._fields = {
			code: $.varRef(init?.code ?? 0),
			len: $.varRef(init?.len ?? 0)
		}
	}

	public clone(): hcode {
		const cloned = new hcode()
		cloned._fields = {
			code: $.varRef(this._fields.code.value),
			len: $.varRef(this._fields.len.value)
		}
		return $.markAsStructValue(cloned)
	}

	public ["set"](code: number, length: number): void {
		let h: hcode | $.VarRef<hcode> | null = this
		$.pointerValue<hcode>(h).len = $.uint(length, 16)
		$.pointerValue<hcode>(h).code = $.uint(code, 16)
	}

	static __typeInfo = $.registerStructType(
		"flate.hcode",
		() => new hcode(),
		[{ name: "set", args: [], returns: [] }],
		hcode,
		{"code": { kind: $.TypeKind.Basic, name: "int" }, "len": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class huffmanEncoder {
	public get codes(): $.Slice<hcode> {
		return this._fields.codes.value
	}
	public set codes(value: $.Slice<hcode>) {
		this._fields.codes.value = value
	}

	public get freqcache(): $.Slice<literalNode> {
		return this._fields.freqcache.value
	}
	public set freqcache(value: $.Slice<literalNode>) {
		this._fields.freqcache.value = value
	}

	public get bitCount(): number[] {
		return this._fields.bitCount.value
	}
	public set bitCount(value: number[]) {
		this._fields.bitCount.value = value
	}

	public get lns(): byLiteral {
		return this._fields.lns.value
	}
	public set lns(value: byLiteral) {
		this._fields.lns.value = value
	}

	public get lfs(): byFreq {
		return this._fields.lfs.value
	}
	public set lfs(value: byFreq) {
		this._fields.lfs.value = value
	}

	public _fields: {
		codes: $.VarRef<$.Slice<hcode>>
		freqcache: $.VarRef<$.Slice<literalNode>>
		bitCount: $.VarRef<number[]>
		lns: $.VarRef<byLiteral>
		lfs: $.VarRef<byFreq>
	}

	constructor(init?: Partial<{codes?: $.Slice<hcode>, freqcache?: $.Slice<literalNode>, bitCount?: number[], lns?: byLiteral, lfs?: byFreq}>) {
		this._fields = {
			codes: $.varRef(init?.codes ?? null),
			freqcache: $.varRef(init?.freqcache ?? null),
			bitCount: $.varRef(init?.bitCount !== undefined ? $.cloneArrayValue(init.bitCount) : Array.from({ length: 17 }, () => 0)),
			lns: $.varRef(init?.lns ?? null),
			lfs: $.varRef(init?.lfs ?? null)
		}
	}

	public clone(): huffmanEncoder {
		const cloned = new huffmanEncoder()
		cloned._fields = {
			codes: $.varRef(this._fields.codes.value),
			freqcache: $.varRef(this._fields.freqcache.value),
			bitCount: $.varRef($.cloneArrayValue(this._fields.bitCount.value)),
			lns: $.varRef(this._fields.lns.value),
			lfs: $.varRef(this._fields.lfs.value)
		}
		return $.markAsStructValue(cloned)
	}

	public assignEncodingAndSize(bitCount: $.Slice<number>, list: $.Slice<literalNode>): void {
		let h: huffmanEncoder | $.VarRef<huffmanEncoder> | null = this
		let code = $.uint($.uint(0, 16), 16)
		for (let __goscriptRangeTarget1 = bitCount, n = 0; n < $.len(__goscriptRangeTarget1); n++) {
			let bits = __goscriptRangeTarget1![n]
			code = code << ($.uint(1, 16))
			if ((n == 0) || ($.int(bits, 32) == $.int(0, 32))) {
				continue
			}
			// The literals list[len(list)-bits] .. list[len(list)-bits]
			// are encoded using "bits" bits, and get the values
			// code, code + 1, ....  The code values are
			// assigned in literal order (not frequency order).
			let chunk: $.Slice<literalNode> = $.goSlice(list, $.len(list) - $.int(bits), undefined)

			byLiteral_sort($.pointerValue<huffmanEncoder>(h)._fields.lns, chunk)
			for (let __goscriptRangeTarget0 = chunk, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
				let node = __goscriptRangeTarget0![__rangeIndex]
				$.pointerValue<huffmanEncoder>(h).codes![node.literal] = (() => { const __goscriptLiteralField0 = $.uint(reverseBits($.uint(code, 16), $.uint($.uint(n, 8), 8)), 16); return $.markAsStructValue(new hcode({code: __goscriptLiteralField0, len: $.uint($.uint(n, 16), 16)})) })()
				code++
			}
			list = $.goSlice(list, 0, $.len(list) - $.int(bits))
		}
	}

	public bitCounts(list: $.Slice<literalNode>, maxBits: number): $.Slice<number> {
		const h: huffmanEncoder | $.VarRef<huffmanEncoder> | null = this
		if (maxBits >= maxBitsLimit) {
			$.panic("flate: maxBits too large")
		}
		let n = $.int($.int($.len(list), 32), 32)
		list = $.goSlice(list, 0, n + 1)
		list![n] = $.markAsStructValue($.cloneStructValue(maxNode()))

		// The tree can't have greater depth than n - 1, no matter what. This
		// saves a little bit of work in some small cases
		if (maxBits > (n - 1)) {
			maxBits = $.int(n - 1, 32)
		}

		// Create information about each of the levels.
		// A bogus "Level 0" whose sole purpose is so that
		// level1.prev.needed==0.  This makes level1.nextPairFreq
		// be a legitimate value that never gets chosen.
		let __goscriptShadow0: levelInfo[] = Array.from({ length: 16 }, () => $.markAsStructValue(new levelInfo()))
		// leafCounts[i] counts the number of literals at the left
		// of ancestors of the rightmost node at level i.
		// leafCounts[i][j] is the number of literals at the left
		// of the level j ancestor.
		let leafCounts: number[][] = Array.from({ length: 16 }, () => Array.from({ length: 16 }, () => 0))

		for (let level = $.int($.int(1, 32), 32); level <= maxBits; level++) {
			// For every level, the first two items are the first two characters.
			// We initialize the levels as if we had already figured this out.
			__goscriptShadow0[level] = $.markAsStructValue(new levelInfo({level: $.int(level, 32), lastFreq: $.int(list![1].freq, 32), nextCharFreq: $.int(list![2].freq, 32), nextPairFreq: $.int(list![0].freq + list![1].freq, 32)}))
			leafCounts[level][level] = $.int(2, 32)
			if ($.int(level, 32) == $.int(1, 32)) {
				__goscriptShadow0[level].nextPairFreq = $.int(math.MaxInt32, 32)
			}
		}

		// We need a total of 2*n - 2 items at top level and have already generated 2.
		__goscriptShadow0[maxBits].needed = $.int((2 * n) - 4, 32)

		let level = $.int(maxBits, 32)
		while (true) {
			let l: levelInfo | $.VarRef<levelInfo> | null = $.indexRef(__goscriptShadow0, level)
			if (($.int($.pointerValue<levelInfo>(l).nextPairFreq, 32) == $.int(math.MaxInt32, 32)) && ($.int($.pointerValue<levelInfo>(l).nextCharFreq, 32) == $.int(math.MaxInt32, 32))) {
				// We've run out of both leaves and pairs.
				// End all calculations for this level.
				// To make sure we never come back to this level or any lower level,
				// set nextPairFreq impossibly large.
				$.pointerValue<levelInfo>(l).needed = $.int(0, 32)
				__goscriptShadow0[level + 1].nextPairFreq = $.int(math.MaxInt32, 32)
				level++
				continue
			}

			let prevFreq = $.int($.pointerValue<levelInfo>(l).lastFreq, 32)
			if ($.pointerValue<levelInfo>(l).nextCharFreq < $.pointerValue<levelInfo>(l).nextPairFreq) {
				// The next item on this row is a leaf node.
				let __goscriptShadow1 = $.int(leafCounts[level][level] + 1, 32)
				$.pointerValue<levelInfo>(l).lastFreq = $.int($.pointerValue<levelInfo>(l).nextCharFreq, 32)
				// Lower leafCounts are the same of the previous node.
				leafCounts[level][level] = $.int(__goscriptShadow1, 32)
				$.pointerValue<levelInfo>(l).nextCharFreq = $.int(list![__goscriptShadow1].freq, 32)
			} else {
				// The next item on this row is a pair from the previous row.
				// nextPairFreq isn't valid until we generate two
				// more values in the level below
				$.pointerValue<levelInfo>(l).lastFreq = $.int($.pointerValue<levelInfo>(l).nextPairFreq, 32)
				// Take leaf counts from the lower level, except counts[level] remains the same.
				$.copy($.goSlice(leafCounts[level], undefined, level), $.goSlice(leafCounts[level - 1], undefined, level))
				__goscriptShadow0[$.pointerValue<levelInfo>(l).level - 1].needed = $.int(2, 32)
			}

			{
				$.pointerValue<levelInfo>(l).needed--
				if ($.int($.pointerValue<levelInfo>(l).needed, 32) == $.int(0, 32)) {
					// We've done everything we need to do for this level.
					// Continue calculating one level up. Fill in nextPairFreq
					// of that level with the sum of the two nodes we've just calculated on
					// this level.
					if ($.int($.pointerValue<levelInfo>(l).level, 32) == $.int(maxBits, 32)) {
						// All done!
						break
					}
					__goscriptShadow0[$.pointerValue<levelInfo>(l).level + 1].nextPairFreq = $.int(prevFreq + $.pointerValue<levelInfo>(l).lastFreq, 32)
					level++
				} else {
					// If we stole from below, move down temporarily to replenish it.
					while (__goscriptShadow0[level - 1].needed > 0) {
						level--
					}
				}
			}
		}

		// Somethings is wrong if at the end, the top level is null or hasn't used
		// all of the leaves.
		if ($.int(leafCounts[maxBits][maxBits], 32) != $.int(n, 32)) {
			$.panic("leafCounts[maxBits][maxBits] != n")
		}

		let bitCount: $.Slice<number> = $.goSlice($.pointerValue<huffmanEncoder>(h).bitCount, undefined, maxBits + 1)
		let __goscriptShadow2 = 1
		let counts = $.indexRef(leafCounts, maxBits)
		for (let __goscriptShadow3 = $.int(maxBits, 32); __goscriptShadow3 > 0; __goscriptShadow3--) {
			// chain.leafCount gives the number of literals requiring at least "bits"
			// bits to encode.
			bitCount![__goscriptShadow2] = $.int($.pointerValue<number[]>(counts)[__goscriptShadow3] - $.pointerValue<number[]>(counts)[__goscriptShadow3 - 1], 32)
			__goscriptShadow2++
		}
		return bitCount
	}

	public bitLength(freq: $.Slice<number>): number {
		const h: huffmanEncoder | $.VarRef<huffmanEncoder> | null = this
		let total: number = 0
		for (let __goscriptRangeTarget2 = freq, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
			let f = __goscriptRangeTarget2![i]
			if ($.int(f, 32) != $.int(0, 32)) {
				total = total + ($.int(f) * $.int($.pointerValue<huffmanEncoder>(h).codes![i].len))
			}
		}
		return total
	}

	public generate(freq: $.Slice<number>, maxBits: number): void {
		let h: huffmanEncoder | $.VarRef<huffmanEncoder> | null = this
		if ($.pointerValue<huffmanEncoder>(h).freqcache == null) {
			// Allocate a reusable buffer with the longest possible frequency table.
			// Possible lengths are codegenCodeCount, offsetCodeCount and maxNumLit.
			// The largest of these is maxNumLit, so we allocate for that case.
			$.pointerValue<huffmanEncoder>(h).freqcache = $.makeSlice<literalNode>(286 + 1, undefined, undefined, () => $.markAsStructValue(new literalNode()))
		}
		let list: $.Slice<literalNode> = $.goSlice($.pointerValue<huffmanEncoder>(h).freqcache, undefined, $.len(freq) + 1)
		// Number of non-zero literals
		let count = 0
		// Set list to be the set of all non-zero literals and their frequencies
		for (let __goscriptRangeTarget3 = freq, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
			let f = __goscriptRangeTarget3![i]
			if ($.int(f, 32) != $.int(0, 32)) {
				list![count] = $.markAsStructValue(new literalNode({literal: $.uint($.uint(i, 16), 16), freq: $.int(f, 32)}))
				count++
			} else {
				$.pointerValue<huffmanEncoder>(h).codes![i].len = $.uint(0, 16)
			}
		}

		list = $.goSlice(list, undefined, count)
		if (count <= 2) {
			// Handle the small cases here, because they are awkward for the general case code. With
			// two or fewer literals, everything has bit length 1.
			for (let __goscriptRangeTarget4 = list, i = 0; i < $.len(__goscriptRangeTarget4); i++) {
				let node = __goscriptRangeTarget4![i]
				// "list" is in order of increasing literal value.
				$.pointerValue<huffmanEncoder>(h).codes![node.literal].set($.uint($.uint(i, 16), 16), $.uint(1, 16))
			}
			return
		}
		byFreq_sort($.pointerValue<huffmanEncoder>(h)._fields.lfs, list)

		// Get the number of literals for each bit count
		let bitCount: $.Slice<number> = huffmanEncoder.prototype.bitCounts.call(h, list, $.int(maxBits, 32))
		// And do the assignment
		huffmanEncoder.prototype.assignEncodingAndSize.call(h, bitCount, list)
	}

	static __typeInfo = $.registerStructType(
		"flate.huffmanEncoder",
		() => new huffmanEncoder(),
		[{ name: "assignEncodingAndSize", args: [], returns: [] }, { name: "bitCounts", args: [], returns: [] }, { name: "bitLength", args: [], returns: [] }, { name: "generate", args: [], returns: [] }],
		huffmanEncoder,
		{"codes": { kind: $.TypeKind.Slice, elemType: "flate.hcode" }, "freqcache": { kind: $.TypeKind.Slice, elemType: "flate.literalNode" }, "bitCount": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int" }, length: 17 }, "lns": "flate.byLiteral", "lfs": "flate.byFreq"}
	)
}

export class literalNode {
	public get literal(): number {
		return this._fields.literal.value
	}
	public set literal(value: number) {
		this._fields.literal.value = value
	}

	public get freq(): number {
		return this._fields.freq.value
	}
	public set freq(value: number) {
		this._fields.freq.value = value
	}

	public _fields: {
		literal: $.VarRef<number>
		freq: $.VarRef<number>
	}

	constructor(init?: Partial<{literal?: number, freq?: number}>) {
		this._fields = {
			literal: $.varRef(init?.literal ?? 0),
			freq: $.varRef(init?.freq ?? 0)
		}
	}

	public clone(): literalNode {
		const cloned = new literalNode()
		cloned._fields = {
			literal: $.varRef(this._fields.literal.value),
			freq: $.varRef(this._fields.freq.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"flate.literalNode",
		() => new literalNode(),
		[],
		literalNode,
		{"literal": { kind: $.TypeKind.Basic, name: "int" }, "freq": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class levelInfo {
	// Our level.  for better printing
	public get level(): number {
		return this._fields.level.value
	}
	public set level(value: number) {
		this._fields.level.value = value
	}

	// The frequency of the last node at this level
	public get lastFreq(): number {
		return this._fields.lastFreq.value
	}
	public set lastFreq(value: number) {
		this._fields.lastFreq.value = value
	}

	// The frequency of the next character to add to this level
	public get nextCharFreq(): number {
		return this._fields.nextCharFreq.value
	}
	public set nextCharFreq(value: number) {
		this._fields.nextCharFreq.value = value
	}

	// The frequency of the next pair (from level below) to add to this level.
	// Only valid if the "needed" value of the next lower level is 0.
	public get nextPairFreq(): number {
		return this._fields.nextPairFreq.value
	}
	public set nextPairFreq(value: number) {
		this._fields.nextPairFreq.value = value
	}

	// The number of chains remaining to generate for this level before moving
	// up to the next level
	public get needed(): number {
		return this._fields.needed.value
	}
	public set needed(value: number) {
		this._fields.needed.value = value
	}

	public _fields: {
		level: $.VarRef<number>
		lastFreq: $.VarRef<number>
		nextCharFreq: $.VarRef<number>
		nextPairFreq: $.VarRef<number>
		needed: $.VarRef<number>
	}

	constructor(init?: Partial<{level?: number, lastFreq?: number, nextCharFreq?: number, nextPairFreq?: number, needed?: number}>) {
		this._fields = {
			level: $.varRef(init?.level ?? 0),
			lastFreq: $.varRef(init?.lastFreq ?? 0),
			nextCharFreq: $.varRef(init?.nextCharFreq ?? 0),
			nextPairFreq: $.varRef(init?.nextPairFreq ?? 0),
			needed: $.varRef(init?.needed ?? 0)
		}
	}

	public clone(): levelInfo {
		const cloned = new levelInfo()
		cloned._fields = {
			level: $.varRef(this._fields.level.value),
			lastFreq: $.varRef(this._fields.lastFreq.value),
			nextCharFreq: $.varRef(this._fields.nextCharFreq.value),
			nextPairFreq: $.varRef(this._fields.nextPairFreq.value),
			needed: $.varRef(this._fields.needed.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"flate.levelInfo",
		() => new levelInfo(),
		[],
		levelInfo,
		{"level": { kind: $.TypeKind.Basic, name: "int" }, "lastFreq": { kind: $.TypeKind.Basic, name: "int" }, "nextCharFreq": { kind: $.TypeKind.Basic, name: "int" }, "nextPairFreq": { kind: $.TypeKind.Basic, name: "int" }, "needed": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export const maxBitsLimit: number = 16

export function maxNode(): literalNode {
	return $.markAsStructValue(new literalNode({literal: $.uint(math.MaxUint16, 16), freq: $.int(math.MaxInt32, 32)}))
}

export function newHuffmanEncoder(size: number): huffmanEncoder | $.VarRef<huffmanEncoder> | null {
	return new huffmanEncoder({codes: $.makeSlice<hcode>(size, undefined, undefined, () => $.markAsStructValue(new hcode()))})
}

export function generateFixedLiteralEncoding(): huffmanEncoder | $.VarRef<huffmanEncoder> | null {
	let h: huffmanEncoder | $.VarRef<huffmanEncoder> | null = newHuffmanEncoder(286)
	let codes: $.Slice<hcode> = $.pointerValue<huffmanEncoder>(h).codes
	let ch: number = 0
	for (ch = $.uint(0, 16); ch < 286; ch++) {
		let __goscriptShadow4: number = 0
		let size: number = 0
		switch (true) {
			case ch < 144:
			{
				__goscriptShadow4 = $.uint(ch + 48, 16)
				size = $.uint(8, 16)
				break
			}
			case ch < 256:
			{
				__goscriptShadow4 = $.uint((ch + 400) - 144, 16)
				size = $.uint(9, 16)
				break
			}
			case ch < 280:
			{
				__goscriptShadow4 = $.uint(ch - 256, 16)
				size = $.uint(7, 16)
				break
			}
			default:
			{
				__goscriptShadow4 = $.uint((ch + 192) - 280, 16)
				size = $.uint(8, 16)
				break
			}
		}
		codes![ch] = (() => { const __goscriptLiteralField1 = $.uint(reverseBits($.uint(__goscriptShadow4, 16), $.uint($.uint(size, 8), 8)), 16); return $.markAsStructValue(new hcode({code: __goscriptLiteralField1, len: $.uint(size, 16)})) })()
	}
	return h
}

export function generateFixedOffsetEncoding(): huffmanEncoder | $.VarRef<huffmanEncoder> | null {
	let h: huffmanEncoder | $.VarRef<huffmanEncoder> | null = newHuffmanEncoder(30)
	let codes: $.Slice<hcode> = $.pointerValue<huffmanEncoder>(h).codes
	for (let __goscriptRangeTarget5 = codes, ch = 0; ch < $.len(__goscriptRangeTarget5); ch++) {
		codes![ch] = (() => { const __goscriptLiteralField2 = $.uint(reverseBits($.uint($.uint(ch, 16), 16), $.uint(5, 8)), 16); return $.markAsStructValue(new hcode({code: __goscriptLiteralField2, len: $.uint(5, 16)})) })()
	}
	return h
}

export let fixedLiteralEncoding: huffmanEncoder | $.VarRef<huffmanEncoder> | null = generateFixedLiteralEncoding()

export function __goscript_set_fixedLiteralEncoding(__goscriptValue: huffmanEncoder | $.VarRef<huffmanEncoder> | null): void {
	fixedLiteralEncoding = __goscriptValue
}

export let fixedOffsetEncoding: huffmanEncoder | $.VarRef<huffmanEncoder> | null = generateFixedOffsetEncoding()

export function __goscript_set_fixedOffsetEncoding(__goscriptValue: huffmanEncoder | $.VarRef<huffmanEncoder> | null): void {
	fixedOffsetEncoding = __goscriptValue
}

export type byLiteral = $.Slice<literalNode>

export function byLiteral_sort(s: $.VarRef<byLiteral> | null, a: $.Slice<literalNode>): void {
	s!.value = ((a as byLiteral) as byLiteral)
	sort2.Sort($.pointerValueOrNil($.namedValueInterfaceValue<sort2.Interface | null>(s, "*flate.byLiteral", {Len: (receiver: any, ...args: any[]) => (byLiteral_Len as any)($.pointerValue(receiver), ...args), Less: (receiver: any, ...args: any[]) => (byLiteral_Less as any)($.pointerValue(receiver), ...args), Swap: (receiver: any, ...args: any[]) => (byLiteral_Swap as any)($.pointerValue(receiver), ...args), sort: (receiver: any, ...args: any[]) => (byLiteral_sort as any)(receiver, ...args)}))!)
}

export function byLiteral_Len(s: byLiteral): number {
	return $.len((s as byLiteral))
}

export function byLiteral_Less(s: byLiteral, i: number, j: number): boolean {
	return s![i].literal < s![j].literal
}

export function byLiteral_Swap(s: byLiteral, i: number, j: number): void {
	let __goscriptAssign0_0: literalNode = $.markAsStructValue($.cloneStructValue(s![j]))
	let __goscriptAssign0_1: literalNode = $.markAsStructValue($.cloneStructValue(s![i]))
	s![i] = __goscriptAssign0_0
	s![j] = __goscriptAssign0_1
}

export type byFreq = $.Slice<literalNode>

export function byFreq_sort(s: $.VarRef<byFreq> | null, a: $.Slice<literalNode>): void {
	s!.value = ((a as byFreq) as byFreq)
	sort2.Sort($.pointerValueOrNil($.namedValueInterfaceValue<sort2.Interface | null>(s, "*flate.byFreq", {Len: (receiver: any, ...args: any[]) => (byFreq_Len as any)($.pointerValue(receiver), ...args), Less: (receiver: any, ...args: any[]) => (byFreq_Less as any)($.pointerValue(receiver), ...args), Swap: (receiver: any, ...args: any[]) => (byFreq_Swap as any)($.pointerValue(receiver), ...args), sort: (receiver: any, ...args: any[]) => (byFreq_sort as any)(receiver, ...args)}))!)
}

export function byFreq_Len(s: byFreq): number {
	return $.len((s as byFreq))
}

export function byFreq_Less(s: byFreq, i: number, j: number): boolean {
	if ($.int(s![i].freq, 32) == $.int(s![j].freq, 32)) {
		return s![i].literal < s![j].literal
	}
	return s![i].freq < s![j].freq
}

export function byFreq_Swap(s: byFreq, i: number, j: number): void {
	let __goscriptAssign1_0: literalNode = $.markAsStructValue($.cloneStructValue(s![j]))
	let __goscriptAssign1_1: literalNode = $.markAsStructValue($.cloneStructValue(s![i]))
	s![i] = __goscriptAssign1_0
	s![j] = __goscriptAssign1_1
}

export function reverseBits(_number: number, bitLength: number): number {
	return $.uint(bits2.Reverse16($.uint(_number << (16 - bitLength), 16)), 16)
}
