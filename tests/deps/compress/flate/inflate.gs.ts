// Generated file based on inflate.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bufio from "@goscript/bufio/index.js"

import * as io from "@goscript/io/index.js"

import * as bits2 from "@goscript/math/bits/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_deflate from "./deflate.gs.ts"

import * as __goscript_dict_decoder from "./dict_decoder.gs.ts"

import * as __goscript_huffman_bit_writer from "./huffman_bit_writer.gs.ts"
import "@goscript/bufio/index.js"
import "@goscript/io/index.js"
import "@goscript/math/bits/index.js"
import "@goscript/strconv/index.js"
import "@goscript/sync/index.js"
import "./deflate.gs.ts"
import "./dict_decoder.gs.ts"
import "./huffman_bit_writer.gs.ts"

export type CorruptInputError = number

export type InternalError = string

export type Resetter = {
	Reset(r: io.Reader | null, dict: $.Slice<number>): $.GoError
}

$.registerInterfaceType(
	"flate.Resetter",
	null,
	[{ name: "Reset", args: [{ name: "r", type: "io.Reader" }, { name: "dict", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }]
)

export type Reader = {
	Read(p: $.Slice<number>): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
	ReadByte(): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
}

$.registerInterfaceType(
	"flate.Reader",
	null,
	[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "ReadByte", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint8" } }, { name: "_r1", type: "error" }] }]
)

export class ReadError {
	public get Offset(): number {
		return this._fields.Offset.value
	}
	public set Offset(value: number) {
		this._fields.Offset.value = value
	}

	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public _fields: {
		Offset: $.VarRef<number>
		Err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{Offset?: number, Err?: $.GoError}>) {
		this._fields = {
			Offset: $.varRef(init?.Offset ?? 0),
			Err: $.varRef(init?.Err ?? null)
		}
	}

	public clone(): ReadError {
		const cloned = new ReadError()
		cloned._fields = {
			Offset: $.varRef(this._fields.Offset.value),
			Err: $.varRef(this._fields.Err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: ReadError | $.VarRef<ReadError> | null = this
		return (("flate: read error at offset " + strconv.FormatInt($.int($.pointerValue<ReadError>(e).Offset), 10)) + ": ") + $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<ReadError>(e).Err).Error()
	}

	static __typeInfo = $.registerStructType(
		"flate.ReadError",
		() => new ReadError(),
		[{ name: "Error", args: [], returns: [] }],
		ReadError,
		{"Offset": { kind: $.TypeKind.Basic, name: "int64" }, "Err": "error"}
	)
}

export class WriteError {
	public get Offset(): number {
		return this._fields.Offset.value
	}
	public set Offset(value: number) {
		this._fields.Offset.value = value
	}

	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public _fields: {
		Offset: $.VarRef<number>
		Err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{Offset?: number, Err?: $.GoError}>) {
		this._fields = {
			Offset: $.varRef(init?.Offset ?? 0),
			Err: $.varRef(init?.Err ?? null)
		}
	}

	public clone(): WriteError {
		const cloned = new WriteError()
		cloned._fields = {
			Offset: $.varRef(this._fields.Offset.value),
			Err: $.varRef(this._fields.Err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: WriteError | $.VarRef<WriteError> | null = this
		return (("flate: write error at offset " + strconv.FormatInt($.int($.pointerValue<WriteError>(e).Offset), 10)) + ": ") + $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<WriteError>(e).Err).Error()
	}

	static __typeInfo = $.registerStructType(
		"flate.WriteError",
		() => new WriteError(),
		[{ name: "Error", args: [], returns: [] }],
		WriteError,
		{"Offset": { kind: $.TypeKind.Basic, name: "int64" }, "Err": "error"}
	)
}

export class huffmanDecoder {
	public get min(): number {
		return this._fields.min.value
	}
	public set min(value: number) {
		this._fields.min.value = value
	}

	public get chunks(): number[] {
		return this._fields.chunks.value
	}
	public set chunks(value: number[]) {
		this._fields.chunks.value = value
	}

	public get links(): $.Slice<$.Slice<number>> {
		return this._fields.links.value
	}
	public set links(value: $.Slice<$.Slice<number>>) {
		this._fields.links.value = value
	}

	public get linkMask(): number {
		return this._fields.linkMask.value
	}
	public set linkMask(value: number) {
		this._fields.linkMask.value = value
	}

	public _fields: {
		min: $.VarRef<number>
		chunks: $.VarRef<number[]>
		links: $.VarRef<$.Slice<$.Slice<number>>>
		linkMask: $.VarRef<number>
	}

	constructor(init?: Partial<{min?: number, chunks?: number[], links?: $.Slice<$.Slice<number>>, linkMask?: number}>) {
		this._fields = {
			min: $.varRef(init?.min ?? 0),
			chunks: $.varRef(init?.chunks !== undefined ? $.cloneArrayValue(init.chunks) : Array.from({ length: 512 }, () => 0)),
			links: $.varRef(init?.links ?? null),
			linkMask: $.varRef(init?.linkMask ?? 0)
		}
	}

	public clone(): huffmanDecoder {
		const cloned = new huffmanDecoder()
		cloned._fields = {
			min: $.varRef(this._fields.min.value),
			chunks: $.varRef($.cloneArrayValue(this._fields.chunks.value)),
			links: $.varRef(this._fields.links.value),
			linkMask: $.varRef(this._fields.linkMask.value)
		}
		return $.markAsStructValue(cloned)
	}

	public init(lengths: $.Slice<number>): boolean {
		let h: huffmanDecoder | $.VarRef<huffmanDecoder> | null = this
		// Sanity enables additional runtime tests during Huffman
		// table construction. It's intended to be used during
		// development to supplement the currently ad-hoc unit tests.
		const sanity: boolean = false

		if ($.pointerValue<huffmanDecoder>(h).min != 0) {
			$.assignStruct($.pointerValue<huffmanDecoder>(h), $.markAsStructValue(new huffmanDecoder()))
		}

		// Count number of codes of each length,
		// compute min and max length.
		let count: number[] = Array.from({ length: 16 }, () => 0)
		let min: number = 0
		let max: number = 0
		for (let __goscriptRangeTarget0 = lengths, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let n = __goscriptRangeTarget0![__rangeIndex]
			if (n == 0) {
				continue
			}
			if ((min == 0) || (n < min)) {
				min = n
			}
			if (n > max) {
				max = n
			}
			count[n]++
		}

		// Empty tree. The decompressor.huffSym function will fail later if the tree
		// is used. Technically, an empty tree is only valid for the HDIST tree and
		// not the HCLEN and HLIT tree. However, a stream with an empty HCLEN tree
		// is guaranteed to fail since it will attempt to use the tree to decode the
		// codes for the HLIT and HDIST trees. Similarly, an empty HLIT tree is
		// guaranteed to fail later since the compressed data section must be
		// composed of at least one symbol (the end-of-block marker).
		if (max == 0) {
			return true
		}

		let code = 0
		let nextcode: number[] = Array.from({ length: 16 }, () => 0)
		for (let i = min; i <= max; i++) {
			code = code << (1)
			nextcode[i] = code
			code = code + (count[i])
		}

		// Check that the coding is complete (i.e., that we've
		// assigned all 2-to-the-max possible bit sequences).
		// Exception: To be compatible with zlib, we also need to
		// accept degenerate single-code codings. See also
		// TestDegenerateHuffmanCoding.
		if ((code != (1 << $.uint(max, 64))) && !((code == 1) && (max == 1))) {
			return false
		}

		$.pointerValue<huffmanDecoder>(h).min = min
		if (max > 9) {
			let numLinks = 1 << ($.uint64Sub($.uint(max, 64), 9))
			$.pointerValue<huffmanDecoder>(h).linkMask = $.uint($.uint(numLinks - 1, 32), 32)

			// create link tables
			let link = nextcode[9 + 1] >> 1
			$.pointerValue<huffmanDecoder>(h).links = $.makeSlice<$.Slice<number>>(512 - link)
			for (let j = $.uint(link, 64); j < 512; j++) {
				let reverse = $.int(bits2.Reverse16($.uint($.uint(j, 16), 16)))
				reverse = reverse >> ($.uint($.uint64Sub(16, 9), 64))
				let off = $.uint64Sub(j, $.uint(link, 64))
				if (false && ($.uint($.pointerValue<huffmanDecoder>(h).chunks[reverse], 32) != $.uint(0, 32))) {
					$.panic("impossible: overwriting existing chunk")
				}
				$.pointerValue<huffmanDecoder>(h).chunks[reverse] = $.uint($.uint($.uint64Or(($.uint64Shl(off, 4)), ($.uint64Add(9, 1))), 32), 32)
				$.pointerValue<huffmanDecoder>(h).links![off] = $.makeSlice<number>(numLinks, undefined, "number")
			}
		}

		for (let __goscriptRangeTarget1 = lengths, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			let n = __goscriptRangeTarget1![i]
			if (n == 0) {
				continue
			}
			let __goscriptShadow0 = nextcode[n]
			nextcode[n]++
			let chunk = $.uint($.uint((i << 4) | n, 32), 32)
			let reverse = $.int(bits2.Reverse16($.uint($.uint(__goscriptShadow0, 16), 16)))
			reverse = reverse >> ($.uint(16 - n, 64))
			if (n <= 9) {
				for (let off = reverse; off < $.len($.pointerValue<huffmanDecoder>(h).chunks); off = off + (1 << $.uint(n, 64))) {
					// We should never need to overwrite
					// an existing chunk. Also, 0 is
					// never a valid chunk, because the
					// lower 4 "count" bits should be
					// between 1 and 15.
					if (false && ($.uint($.pointerValue<huffmanDecoder>(h).chunks[off], 32) != $.uint(0, 32))) {
						$.panic("impossible: overwriting existing chunk")
					}
					$.pointerValue<huffmanDecoder>(h).chunks[off] = $.uint(chunk, 32)
				}
			} else {
				let j = reverse & (512 - 1)
				if (false && ($.uint(($.pointerValue<huffmanDecoder>(h).chunks[j] & 15), 32) != $.uint((9 + 1), 32))) {
					// Longer codes should have been
					// associated with a link table above.
					$.panic("impossible: not an indirect chunk")
				}
				let value = $.uint($.uintShr($.pointerValue<huffmanDecoder>(h).chunks[j], 4, 32), 32)
				let linktab: $.Slice<number> = $.pointerValue<huffmanDecoder>(h).links![value]
				reverse = reverse >> (9)
				for (let off = reverse; off < $.len(linktab); off = off + (1 << $.uint(n - 9, 64))) {
					if (false && ($.uint(linktab![off], 32) != $.uint(0, 32))) {
						$.panic("impossible: overwriting existing chunk")
					}
					linktab![off] = $.uint(chunk, 32)
				}
			}
		}

		if (false) {
			// Above we've sanity checked that we never overwrote
			// an existing entry. Here we additionally check that
			// we filled the tables completely.
			for (let __goscriptRangeTarget2 = $.pointerValue<huffmanDecoder>(h).chunks, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
				let chunk = __goscriptRangeTarget2[i]
				if ($.uint(chunk, 32) == $.uint(0, 32)) {
					// As an exception, in the degenerate
					// single-code case, we allow odd
					// chunks to be missing.
					if ((code == 1) && ((i % 2) == 1)) {
						continue
					}
					$.panic("impossible: missing chunk")
				}
			}
			for (let __goscriptRangeTarget4 = $.pointerValue<huffmanDecoder>(h).links, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
				let linktab = __goscriptRangeTarget4![__rangeIndex]
				for (let __goscriptRangeTarget3 = linktab, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
					let chunk = __goscriptRangeTarget3![__rangeIndex]
					if ($.uint(chunk, 32) == $.uint(0, 32)) {
						$.panic("impossible: missing chunk")
					}
				}
			}
		}

		return true
	}

	static __typeInfo = $.registerStructType(
		"flate.huffmanDecoder",
		() => new huffmanDecoder(),
		[{ name: "init", args: [], returns: [] }],
		huffmanDecoder,
		{"min": { kind: $.TypeKind.Basic, name: "int" }, "chunks": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint32" }, length: 512 }, "links": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } } }, "linkMask": { kind: $.TypeKind.Basic, name: "uint32" }}
	)
}

export class decompressor {
	// Input source.
	public get r(): Reader | null {
		return this._fields.r.value
	}
	public set r(value: Reader | null) {
		this._fields.r.value = value
	}

	public get rBuf(): bufio.Reader | $.VarRef<bufio.Reader> | null {
		return this._fields.rBuf.value
	}
	public set rBuf(value: bufio.Reader | $.VarRef<bufio.Reader> | null) {
		this._fields.rBuf.value = value
	}

	public get roffset(): number {
		return this._fields.roffset.value
	}
	public set roffset(value: number) {
		this._fields.roffset.value = value
	}

	// Input bits, in top of b.
	public get b(): number {
		return this._fields.b.value
	}
	public set b(value: number) {
		this._fields.b.value = value
	}

	public get nb(): number {
		return this._fields.nb.value
	}
	public set nb(value: number) {
		this._fields.nb.value = value
	}

	// Huffman decoders for literal/length, distance.
	public get h1(): huffmanDecoder {
		return this._fields.h1.value
	}
	public set h1(value: huffmanDecoder) {
		this._fields.h1.value = value
	}

	// Huffman decoders for literal/length, distance.
	public get h2(): huffmanDecoder {
		return this._fields.h2.value
	}
	public set h2(value: huffmanDecoder) {
		this._fields.h2.value = value
	}

	// Length arrays used to define Huffman codes.
	public get bits(): $.VarRef<number[]> | null {
		return this._fields.bits.value
	}
	public set bits(value: $.VarRef<number[]> | null) {
		this._fields.bits.value = value
	}

	public get codebits(): $.VarRef<number[]> | null {
		return this._fields.codebits.value
	}
	public set codebits(value: $.VarRef<number[]> | null) {
		this._fields.codebits.value = value
	}

	// Output history, buffer.
	public get dict(): __goscript_dict_decoder.dictDecoder {
		return this._fields.dict.value
	}
	public set dict(value: __goscript_dict_decoder.dictDecoder) {
		this._fields.dict.value = value
	}

	// Temporary buffer (avoids repeated allocation).
	public get buf(): Uint8Array {
		return this._fields.buf.value
	}
	public set buf(value: Uint8Array) {
		this._fields.buf.value = value
	}

	// Next step in the decompression,
	// and decompression state.
	public get step(): ((_p0: decompressor | $.VarRef<decompressor> | null) => void) | null {
		return this._fields.step.value
	}
	public set step(value: ((_p0: decompressor | $.VarRef<decompressor> | null) => void) | null) {
		this._fields.step.value = value
	}

	public get stepState(): number {
		return this._fields.stepState.value
	}
	public set stepState(value: number) {
		this._fields.stepState.value = value
	}

	public get final(): boolean {
		return this._fields.final.value
	}
	public set final(value: boolean) {
		this._fields.final.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get toRead(): $.Slice<number> {
		return this._fields.toRead.value
	}
	public set toRead(value: $.Slice<number>) {
		this._fields.toRead.value = value
	}

	public get hl(): huffmanDecoder | $.VarRef<huffmanDecoder> | null {
		return this._fields.hl.value
	}
	public set hl(value: huffmanDecoder | $.VarRef<huffmanDecoder> | null) {
		this._fields.hl.value = value
	}

	public get hd(): huffmanDecoder | $.VarRef<huffmanDecoder> | null {
		return this._fields.hd.value
	}
	public set hd(value: huffmanDecoder | $.VarRef<huffmanDecoder> | null) {
		this._fields.hd.value = value
	}

	public get copyLen(): number {
		return this._fields.copyLen.value
	}
	public set copyLen(value: number) {
		this._fields.copyLen.value = value
	}

	public get copyDist(): number {
		return this._fields.copyDist.value
	}
	public set copyDist(value: number) {
		this._fields.copyDist.value = value
	}

	public _fields: {
		r: $.VarRef<Reader | null>
		rBuf: $.VarRef<bufio.Reader | $.VarRef<bufio.Reader> | null>
		roffset: $.VarRef<number>
		b: $.VarRef<number>
		nb: $.VarRef<number>
		h1: $.VarRef<huffmanDecoder>
		h2: $.VarRef<huffmanDecoder>
		bits: $.VarRef<$.VarRef<number[]> | null>
		codebits: $.VarRef<$.VarRef<number[]> | null>
		dict: $.VarRef<__goscript_dict_decoder.dictDecoder>
		buf: $.VarRef<Uint8Array>
		step: $.VarRef<((_p0: decompressor | $.VarRef<decompressor> | null) => void) | null>
		stepState: $.VarRef<number>
		final: $.VarRef<boolean>
		err: $.VarRef<$.GoError>
		toRead: $.VarRef<$.Slice<number>>
		hl: $.VarRef<huffmanDecoder | $.VarRef<huffmanDecoder> | null>
		hd: $.VarRef<huffmanDecoder | $.VarRef<huffmanDecoder> | null>
		copyLen: $.VarRef<number>
		copyDist: $.VarRef<number>
	}

	constructor(init?: Partial<{r?: Reader | null, rBuf?: bufio.Reader | $.VarRef<bufio.Reader> | null, roffset?: number, b?: number, nb?: number, h1?: huffmanDecoder, h2?: huffmanDecoder, bits?: $.VarRef<number[]> | null, codebits?: $.VarRef<number[]> | null, dict?: __goscript_dict_decoder.dictDecoder, buf?: Uint8Array, step?: ((_p0: decompressor | $.VarRef<decompressor> | null) => void) | null, stepState?: number, final?: boolean, err?: $.GoError, toRead?: $.Slice<number>, hl?: huffmanDecoder | $.VarRef<huffmanDecoder> | null, hd?: huffmanDecoder | $.VarRef<huffmanDecoder> | null, copyLen?: number, copyDist?: number}>) {
		this._fields = {
			r: $.varRef(init?.r ?? null),
			rBuf: $.varRef(init?.rBuf ?? null),
			roffset: $.varRef(init?.roffset ?? 0),
			b: $.varRef(init?.b ?? 0),
			nb: $.varRef(init?.nb ?? 0),
			h1: $.varRef(init?.h1 ? $.markAsStructValue($.cloneStructValue(init.h1)) : $.markAsStructValue(new huffmanDecoder())),
			h2: $.varRef(init?.h2 ? $.markAsStructValue($.cloneStructValue(init.h2)) : $.markAsStructValue(new huffmanDecoder())),
			bits: $.varRef(init?.bits ?? null),
			codebits: $.varRef(init?.codebits ?? null),
			dict: $.varRef(init?.dict ? $.markAsStructValue($.cloneStructValue(init.dict)) : $.markAsStructValue(new __goscript_dict_decoder.dictDecoder())),
			buf: $.varRef(init?.buf !== undefined ? $.cloneArrayValue(init.buf) : new Uint8Array(4)),
			step: $.varRef(init?.step ?? null),
			stepState: $.varRef(init?.stepState ?? 0),
			final: $.varRef(init?.final ?? false),
			err: $.varRef(init?.err ?? null),
			toRead: $.varRef(init?.toRead ?? null),
			hl: $.varRef(init?.hl ?? null),
			hd: $.varRef(init?.hd ?? null),
			copyLen: $.varRef(init?.copyLen ?? 0),
			copyDist: $.varRef(init?.copyDist ?? 0)
		}
	}

	public clone(): decompressor {
		const cloned = new decompressor()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			rBuf: $.varRef(this._fields.rBuf.value),
			roffset: $.varRef(this._fields.roffset.value),
			b: $.varRef(this._fields.b.value),
			nb: $.varRef(this._fields.nb.value),
			h1: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.h1.value))),
			h2: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.h2.value))),
			bits: $.varRef(this._fields.bits.value),
			codebits: $.varRef(this._fields.codebits.value),
			dict: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.dict.value))),
			buf: $.varRef($.cloneArrayValue(this._fields.buf.value)),
			step: $.varRef(this._fields.step.value),
			stepState: $.varRef(this._fields.stepState.value),
			final: $.varRef(this._fields.final.value),
			err: $.varRef(this._fields.err.value),
			toRead: $.varRef(this._fields.toRead.value),
			hl: $.varRef(this._fields.hl.value),
			hd: $.varRef(this._fields.hd.value),
			copyLen: $.varRef(this._fields.copyLen.value),
			copyDist: $.varRef(this._fields.copyDist.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		const f: decompressor | $.VarRef<decompressor> | null = this
		if ($.comparableEqual($.pointerValue<decompressor>(f).err, io.EOF)) {
			return null
		}
		return $.pointerValue<decompressor>(f).err
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let f: decompressor | $.VarRef<decompressor> | null = this
		while (true) {
			if ($.len($.pointerValue<decompressor>(f).toRead) > 0) {
				let n = $.copy(b, $.pointerValue<decompressor>(f).toRead)
				$.pointerValue<decompressor>(f).toRead = $.goSlice($.pointerValue<decompressor>(f).toRead, n, undefined)
				if ($.len($.pointerValue<decompressor>(f).toRead) == 0) {
					return [n, $.pointerValue<decompressor>(f).err]
				}
				return [n, null]
			}
			if ($.pointerValue<decompressor>(f).err != null) {
				return [0, $.pointerValue<decompressor>(f).err]
			}
			await $.pointerValue<decompressor>(f).step!(f)
			if (($.pointerValue<decompressor>(f).err != null) && ($.len($.pointerValue<decompressor>(f).toRead) == 0)) {
				$.pointerValue<decompressor>(f).toRead = $.pointerValue<decompressor>(f).dict.readFlush()
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public Reset(r: io.Reader | null, dict: $.Slice<number>): $.GoError {
		let f: decompressor | $.VarRef<decompressor> | null = this
		$.assignStruct($.pointerValue<decompressor>(f), $.markAsStructValue(new decompressor({rBuf: $.pointerValue<decompressor>(f).rBuf, bits: $.pointerValue<decompressor>(f).bits, codebits: $.pointerValue<decompressor>(f).codebits, dict: $.markAsStructValue($.cloneStructValue($.pointerValue<decompressor>(f).dict)), step: $.functionValue(async (f: decompressor | $.VarRef<decompressor> | null): globalThis.Promise<void> => await $.pointerValue<decompressor>(f).nextBlock(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.decompressor" }], results: [] } as $.FunctionTypeInfo))})))
		decompressor.prototype.makeReader.call(f, r)
		$.pointerValue<decompressor>(f).dict.init(32768, dict)
		return null
	}

	public async copyData(): globalThis.Promise<void> {
		let f: decompressor | $.VarRef<decompressor> | null = this
		let buf: $.Slice<number> = $.pointerValue<decompressor>(f).dict.writeSlice()
		if ($.len(buf) > $.pointerValue<decompressor>(f).copyLen) {
			buf = $.goSlice(buf, undefined, $.pointerValue<decompressor>(f).copyLen)
		}

		let [cnt, err] = await io.ReadFull($.pointerValueOrNil(($.pointerValue<decompressor>(f).r as io.Reader | null))!, buf)
		$.pointerValue<decompressor>(f).roffset = $.int64Add($.pointerValue<decompressor>(f).roffset, $.int($.int(cnt)))
		$.pointerValue<decompressor>(f).copyLen = $.pointerValue<decompressor>(f).copyLen - (cnt)
		$.pointerValue<decompressor>(f).dict.writeMark(cnt)
		if (err != null) {
			$.pointerValue<decompressor>(f).err = noEOF(err)
			return
		}

		if (($.pointerValue<decompressor>(f).dict.availWrite() == 0) || ($.pointerValue<decompressor>(f).copyLen > 0)) {
			$.pointerValue<decompressor>(f).toRead = $.pointerValue<decompressor>(f).dict.readFlush()
			$.pointerValue<decompressor>(f).step = $.functionValue(async (f: decompressor | $.VarRef<decompressor> | null): globalThis.Promise<void> => await $.pointerValue<decompressor>(f).copyData(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.decompressor" }], results: [] } as $.FunctionTypeInfo))
			return
		}
		decompressor.prototype.finishBlock.call(f)
	}

	public async dataBlock(): globalThis.Promise<void> {
		let f: decompressor | $.VarRef<decompressor> | null = this
		// Uncompressed.
		// Discard current half-byte.
		$.pointerValue<decompressor>(f).nb = 0
		$.pointerValue<decompressor>(f).b = $.uint(0, 32)

		// Length then ones-complement of length.
		let [nr, err] = await io.ReadFull($.pointerValueOrNil(($.pointerValue<decompressor>(f).r as io.Reader | null))!, $.goSlice($.pointerValue<decompressor>(f).buf, 0, 4))
		$.pointerValue<decompressor>(f).roffset = $.int64Add($.pointerValue<decompressor>(f).roffset, $.int($.int(nr)))
		if (err != null) {
			$.pointerValue<decompressor>(f).err = noEOF(err)
			return
		}
		let n = $.int($.pointerValue<decompressor>(f).buf[0]) | ($.int($.pointerValue<decompressor>(f).buf[1]) << 8)
		let nn = $.int($.pointerValue<decompressor>(f).buf[2]) | ($.int($.pointerValue<decompressor>(f).buf[3]) << 8)
		if ($.uint($.uint(nn, 16), 16) != $.uint($.uint(~n, 16), 16)) {
			$.pointerValue<decompressor>(f).err = $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
			return
		}

		if (n == 0) {
			$.pointerValue<decompressor>(f).toRead = $.pointerValue<decompressor>(f).dict.readFlush()
			decompressor.prototype.finishBlock.call(f)
			return
		}

		$.pointerValue<decompressor>(f).copyLen = n
		await decompressor.prototype.copyData.call(f)
	}

	public finishBlock(): void {
		let f: decompressor | $.VarRef<decompressor> | null = this
		if ($.pointerValue<decompressor>(f).final) {
			if ($.pointerValue<decompressor>(f).dict.availRead() > 0) {
				$.pointerValue<decompressor>(f).toRead = $.pointerValue<decompressor>(f).dict.readFlush()
			}
			$.pointerValue<decompressor>(f).err = io.EOF
		}
		$.pointerValue<decompressor>(f).step = $.functionValue(async (f: decompressor | $.VarRef<decompressor> | null): globalThis.Promise<void> => await $.pointerValue<decompressor>(f).nextBlock(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.decompressor" }], results: [] } as $.FunctionTypeInfo))
	}

	public async huffSym(h: huffmanDecoder | $.VarRef<huffmanDecoder> | null): globalThis.Promise<[number, $.GoError]> {
		let f: decompressor | $.VarRef<decompressor> | null = this
		// Since a huffmanDecoder can be empty or be composed of a degenerate tree
		// with single element, huffSym must error on these two edge cases. In both
		// cases, the chunks slice will be 0 for the invalid sequence, leading it
		// satisfy the n == 0 check below.
		let n = $.uint($.pointerValue<huffmanDecoder>(h).min, 64)
		// Optimization. Compiler isn't smart enough to keep f.b,f.nb in registers,
		// but is smart enough to keep local variables in registers, so use nb and b,
		// inline call to moreBits and reassign b,nb back to f on return.
		let nb = $.pointerValue<decompressor>(f).nb
		let b = $.uint($.pointerValue<decompressor>(f).b, 32)
		while (true) {
			while (nb < n) {
				let __goscriptTuple0: any = await $.pointerValue<Exclude<Reader, null>>($.pointerValue<decompressor>(f).r).ReadByte()
				let c = $.uint(__goscriptTuple0[0], 8)
				let err = __goscriptTuple0[1]
				if (err != null) {
					$.pointerValue<decompressor>(f).b = $.uint(b, 32)
					$.pointerValue<decompressor>(f).nb = nb
					return [0, noEOF(err)]
				}
				$.pointerValue<decompressor>(f).roffset++
				b = b | ($.uint($.uint(c, 32) << ($.uint64And(nb, 31)), 32))
				nb = $.uint64Add(nb, 8)
			}
			let chunk = $.uint($.pointerValue<huffmanDecoder>(h).chunks[b & (512 - 1)], 32)
			n = $.uint(chunk & 15, 64)
			if (n > 9) {
				chunk = $.uint($.pointerValue<huffmanDecoder>(h).links![$.uintShr(chunk, 4, 32)]![($.uintShr(b, 9, 32)) & $.pointerValue<huffmanDecoder>(h).linkMask], 32)
				n = $.uint(chunk & 15, 64)
			}
			if (n <= nb) {
				if (n == 0) {
					$.pointerValue<decompressor>(f).b = $.uint(b, 32)
					$.pointerValue<decompressor>(f).nb = nb
					$.pointerValue<decompressor>(f).err = $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
					return [0, $.pointerValue<decompressor>(f).err]
				}
				$.pointerValue<decompressor>(f).b = $.uint($.uintShr(b, ($.uint64And(n, 31)), 32), 32)
				$.pointerValue<decompressor>(f).nb = $.uint64Sub(nb, n)
				return [$.int($.uintShr(chunk, 4, 32)), null]
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async huffmanBlock(): globalThis.Promise<void> {
		let f: decompressor | $.VarRef<decompressor> | null = this
		const stateInit: number = 0
		const stateDict: number = 1

		let __goscriptGotoState0 = "__entry"
		__goscriptGotoLoop0: while (true) {
			switch (__goscriptGotoState0) {
				case "__entry":
				{
					switch ($.pointerValue<decompressor>(f).stepState) {
						case 0:
						{
							__goscriptGotoState0 = "readLiteral"
							continue __goscriptGotoLoop0
							break
						}
						case 1:
						{
							__goscriptGotoState0 = "copyHistory"
							continue __goscriptGotoLoop0
							break
						}
					}
					__goscriptGotoState0 = "readLiteral"
					continue __goscriptGotoLoop0
					break
				}
				case "readLiteral":
				{
					// Read literal and/or (length, distance) according to RFC section 3.2.3.
					{
						let [v, err] = await decompressor.prototype.huffSym.call(f, $.pointerValue<decompressor>(f).hl)
						if (err != null) {
							$.pointerValue<decompressor>(f).err = err
							return
						}
						let n: number = 0
						let length: number = 0
						switch (true) {
							case v < 256:
							{
								$.pointerValue<decompressor>(f).dict.writeByte($.uint($.uint(v, 8), 8))
								if ($.pointerValue<decompressor>(f).dict.availWrite() == 0) {
									$.pointerValue<decompressor>(f).toRead = $.pointerValue<decompressor>(f).dict.readFlush()
									$.pointerValue<decompressor>(f).step = $.functionValue(async (f: decompressor | $.VarRef<decompressor> | null): globalThis.Promise<void> => await $.pointerValue<decompressor>(f).huffmanBlock(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.decompressor" }], results: [] } as $.FunctionTypeInfo))
									$.pointerValue<decompressor>(f).stepState = 0
									return
								}
								__goscriptGotoState0 = "readLiteral"
								continue __goscriptGotoLoop0
								break
							}
							case v == 256:
							{
								decompressor.prototype.finishBlock.call(f)
								return
								break
							}
							case v < 265:
							{
								length = v - (257 - 3)
								n = 0
								break
							}
							case v < 269:
							{
								length = (v * 2) - ((265 * 2) - 11)
								n = 1
								break
							}
							case v < 273:
							{
								length = (v * 4) - ((269 * 4) - 19)
								n = 2
								break
							}
							case v < 277:
							{
								length = (v * 8) - ((273 * 8) - 35)
								n = 3
								break
							}
							case v < 281:
							{
								length = (v * 16) - ((277 * 16) - 67)
								n = 4
								break
							}
							case v < 285:
							{
								length = (v * 32) - ((281 * 32) - 131)
								n = 5
								break
							}
							case v < 286:
							{
								length = 258
								n = 0
								break
							}
							default:
							{
								$.pointerValue<decompressor>(f).err = $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
								return
								break
							}
						}
						if (n > 0) {
							while ($.pointerValue<decompressor>(f).nb < n) {
								{
									err = await decompressor.prototype.moreBits.call(f)
									if (err != null) {
										$.pointerValue<decompressor>(f).err = err
										return
									}
								}
							}
							length = length + ($.int($.pointerValue<decompressor>(f).b & $.uint((1 << n) - 1, 32)))
							$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(n, 32))) >>> 0
							$.pointerValue<decompressor>(f).nb = $.uint64Sub($.pointerValue<decompressor>(f).nb, n)
						}

						let dist: number = 0
						if ($.pointerValue<decompressor>(f).hd == null) {
							while ($.pointerValue<decompressor>(f).nb < 5) {
								{
									err = await decompressor.prototype.moreBits.call(f)
									if (err != null) {
										$.pointerValue<decompressor>(f).err = err
										return
									}
								}
							}
							dist = $.int(bits2.Reverse8($.uint($.uint(($.pointerValue<decompressor>(f).b & 0x1F) << 3, 8), 8)))
							$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(5, 32))) >>> 0
							$.pointerValue<decompressor>(f).nb = $.uint64Sub($.pointerValue<decompressor>(f).nb, 5)
						} else {
							{
								let __goscriptTuple1: any = await decompressor.prototype.huffSym.call(f, $.pointerValue<decompressor>(f).hd)
								dist = __goscriptTuple1[0]
								err = __goscriptTuple1[1]
								if (err != null) {
									$.pointerValue<decompressor>(f).err = err
									return
								}
							}
						}

						switch (true) {
							case dist < 4:
							{
								dist++
								break
							}
							case dist < 30:
							{
								let nb = $.uint64Shr($.uint(dist - 2, 64), 1)
								// have 1 bit in bottom of dist, need nb more.
								let extra = (dist & 1) << nb
								while ($.pointerValue<decompressor>(f).nb < nb) {
									{
										err = await decompressor.prototype.moreBits.call(f)
										if (err != null) {
											$.pointerValue<decompressor>(f).err = err
											return
										}
									}
								}
								extra = extra | ($.int($.pointerValue<decompressor>(f).b & $.uint((1 << nb) - 1, 32)))
								$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(nb, 32))) >>> 0
								$.pointerValue<decompressor>(f).nb = $.uint64Sub($.pointerValue<decompressor>(f).nb, nb)
								dist = ((1 << ($.uint64Add(nb, 1))) + 1) + extra
								break
							}
							default:
							{
								$.pointerValue<decompressor>(f).err = $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
								return
								break
							}
						}

						// No check on length; encoding can be prescient.
						if (dist > $.pointerValue<decompressor>(f).dict.histSize()) {
							$.pointerValue<decompressor>(f).err = $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
							return
						}

						let __goscriptAssign0_0: number = length
						let __goscriptAssign0_1: number = dist
						$.pointerValue<decompressor>(f).copyLen = __goscriptAssign0_0
						$.pointerValue<decompressor>(f).copyDist = __goscriptAssign0_1
						__goscriptGotoState0 = "copyHistory"
						continue __goscriptGotoLoop0
					}
					__goscriptGotoState0 = "copyHistory"
					continue __goscriptGotoLoop0
					break
				}
				case "copyHistory":
				{
					// Perform a backwards copy according to RFC section 3.2.3.
					{
						let cnt = $.pointerValue<decompressor>(f).dict.tryWriteCopy($.pointerValue<decompressor>(f).copyDist, $.pointerValue<decompressor>(f).copyLen)
						if (cnt == 0) {
							cnt = $.pointerValue<decompressor>(f).dict.writeCopy($.pointerValue<decompressor>(f).copyDist, $.pointerValue<decompressor>(f).copyLen)
						}
						$.pointerValue<decompressor>(f).copyLen = $.pointerValue<decompressor>(f).copyLen - (cnt)

						if (($.pointerValue<decompressor>(f).dict.availWrite() == 0) || ($.pointerValue<decompressor>(f).copyLen > 0)) {
							$.pointerValue<decompressor>(f).toRead = $.pointerValue<decompressor>(f).dict.readFlush()
							$.pointerValue<decompressor>(f).step = $.functionValue(async (f: decompressor | $.VarRef<decompressor> | null): globalThis.Promise<void> => await $.pointerValue<decompressor>(f).huffmanBlock(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.decompressor" }], results: [] } as $.FunctionTypeInfo))
							$.pointerValue<decompressor>(f).stepState = 1
							return
						}
						__goscriptGotoState0 = "readLiteral"
						continue __goscriptGotoLoop0
					}
					break __goscriptGotoLoop0
					break
				}
			}
			break
		}
	}

	public makeReader(r: io.Reader | null): void {
		let f: decompressor | $.VarRef<decompressor> | null = this
		{
			let [rr, ok] = $.typeAssertTuple<Reader | null>(r, "flate.Reader")
			if (ok) {
				$.pointerValue<decompressor>(f).rBuf = null
				$.pointerValue<decompressor>(f).r = rr
				return
			}
		}
		// Reuse rBuf if possible. Invariant: rBuf is always created (and owned) by decompressor.
		if ($.pointerValue<decompressor>(f).rBuf != null) {
			bufio.Reader.prototype.Reset.call($.pointerValue<decompressor>(f).rBuf, r)
		} else {
			// bufio.NewReader will not return r, as r does not implement flate.Reader, so it is not bufio.Reader.
			$.pointerValue<decompressor>(f).rBuf = bufio.NewReader(r)
		}
		$.pointerValue<decompressor>(f).r = $.interfaceValue<Reader | null>($.pointerValue<decompressor>(f).rBuf, "*bufio.Reader")
	}

	public async moreBits(): globalThis.Promise<$.GoError> {
		let f: decompressor | $.VarRef<decompressor> | null = this
		let __goscriptTuple2: any = await $.pointerValue<Exclude<Reader, null>>($.pointerValue<decompressor>(f).r).ReadByte()
		let c = $.uint(__goscriptTuple2[0], 8)
		let err = __goscriptTuple2[1]
		if (err != null) {
			return noEOF(err)
		}
		$.pointerValue<decompressor>(f).roffset++
		$.pointerValue<decompressor>(f).b = $.pointerValue<decompressor>(f).b | ($.uint($.uint(c, 32) << $.pointerValue<decompressor>(f).nb, 32))
		$.pointerValue<decompressor>(f).nb = $.uint64Add($.pointerValue<decompressor>(f).nb, 8)
		return null
	}

	public async nextBlock(): globalThis.Promise<void> {
		let f: decompressor | $.VarRef<decompressor> | null = this
		while ($.pointerValue<decompressor>(f).nb < ($.uint64Add(1, 2))) {
			{
				$.pointerValue<decompressor>(f).err = await decompressor.prototype.moreBits.call(f)
				if ($.pointerValue<decompressor>(f).err != null) {
					return
				}
			}
		}
		$.pointerValue<decompressor>(f).final = $.uint(($.pointerValue<decompressor>(f).b & 1), 32) == $.uint(1, 32)
		$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(1, 32))) >>> 0
		let typ = $.uint($.pointerValue<decompressor>(f).b & 3, 32)
		$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(2, 32))) >>> 0
		$.pointerValue<decompressor>(f).nb = $.uint64Sub($.pointerValue<decompressor>(f).nb, $.uint64Add(1, 2))
		switch (typ) {
			case 0:
			{
				await decompressor.prototype.dataBlock.call(f)
				break
			}
			case 1:
			{
				$.pointerValue<decompressor>(f).hl = fixedHuffmanDecoder
				$.pointerValue<decompressor>(f).hd = null
				await decompressor.prototype.huffmanBlock.call(f)
				break
			}
			case 2:
			{
				{
					$.pointerValue<decompressor>(f).err = await decompressor.prototype.readHuffman.call(f)
					if ($.pointerValue<decompressor>(f).err != null) {
						break
					}
				}
				$.pointerValue<decompressor>(f).hl = $.pointerValue<decompressor>(f)._fields.h1
				$.pointerValue<decompressor>(f).hd = $.pointerValue<decompressor>(f)._fields.h2
				await decompressor.prototype.huffmanBlock.call(f)
				break
			}
			default:
			{
				$.pointerValue<decompressor>(f).err = $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
				break
			}
		}
	}

	public async readHuffman(): globalThis.Promise<$.GoError> {
		let f: decompressor | $.VarRef<decompressor> | null = this
		// HLIT[5], HDIST[5], HCLEN[4].
		while ($.pointerValue<decompressor>(f).nb < ($.uint64Add((5 + 5), 4))) {
			{
				let err = await decompressor.prototype.moreBits.call(f)
				if (err != null) {
					return err
				}
			}
		}
		let nlit = $.int($.pointerValue<decompressor>(f).b & 0x1F) + 257
		if (nlit > 286) {
			return $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
		}
		$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(5, 32))) >>> 0
		let ndist = $.int($.pointerValue<decompressor>(f).b & 0x1F) + 1
		if (ndist > 30) {
			return $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
		}
		$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(5, 32))) >>> 0
		let nclen = $.int($.pointerValue<decompressor>(f).b & 0xF) + 4
		// numCodes is 19, so nclen is always valid.
		$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(4, 32))) >>> 0
		$.pointerValue<decompressor>(f).nb = $.uint64Sub($.pointerValue<decompressor>(f).nb, $.uint64Add((5 + 5), 4))

		// (HCLEN+4)*3 bits: code lengths in the magic codeOrder order.
		for (let i = 0; i < nclen; i++) {
			while ($.pointerValue<decompressor>(f).nb < 3) {
				{
					let err = await decompressor.prototype.moreBits.call(f)
					if (err != null) {
						return err
					}
				}
			}
			$.pointerValue<number[]>($.pointerValue<decompressor>(f).codebits)[codeOrder[i]] = $.int($.pointerValue<decompressor>(f).b & 0x7)
			$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(3, 32))) >>> 0
			$.pointerValue<decompressor>(f).nb = $.uint64Sub($.pointerValue<decompressor>(f).nb, 3)
		}
		for (let i = nclen; i < $.len(codeOrder); i++) {
			$.pointerValue<number[]>($.pointerValue<decompressor>(f).codebits)[codeOrder[i]] = 0
		}
		if (!$.pointerValue<decompressor>(f).h1.init($.goSlice($.pointerValue<number[]>($.pointerValue<decompressor>(f).codebits), 0, undefined))) {
			return $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
		}

		// HLIT + 257 code lengths, HDIST + 1 code lengths,
		// using the code length Huffman code.
		for (let i = 0, n = nlit + ndist; i < n; ) {
			let [x, err] = await decompressor.prototype.huffSym.call(f, $.pointerValue<decompressor>(f)._fields.h1)
			if (err != null) {
				return err
			}
			if (x < 16) {
				// Actual length.
				$.pointerValue<number[]>($.pointerValue<decompressor>(f).bits)[i] = x
				i++
				continue
			}
			// Repeat previous length or zero.
			let rep: number = 0
			let nb: number = 0
			let b: number = 0
			switch (x) {
				default:
				{
					return $.namedValueInterfaceValue<$.GoError>("unexpected length code", "flate.InternalError", {"Error": InternalError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "flate.InternalError" })
					break
				}
				case 16:
				{
					rep = 3
					nb = 2
					if (i == 0) {
						return $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
					}
					b = $.pointerValue<number[]>($.pointerValue<decompressor>(f).bits)[i - 1]
					break
				}
				case 17:
				{
					rep = 3
					nb = 3
					b = 0
					break
				}
				case 18:
				{
					rep = 11
					nb = 7
					b = 0
					break
				}
			}
			while ($.pointerValue<decompressor>(f).nb < nb) {
				{
					let __goscriptShadow1 = await decompressor.prototype.moreBits.call(f)
					if (__goscriptShadow1 != null) {
						return __goscriptShadow1
					}
				}
			}
			rep = rep + ($.int($.pointerValue<decompressor>(f).b & $.uint((1 << nb) - 1, 32)))
			$.pointerValue<decompressor>(f).b = ($.pointerValue<decompressor>(f).b >>> ($.uint(nb, 32))) >>> 0
			$.pointerValue<decompressor>(f).nb = $.uint64Sub($.pointerValue<decompressor>(f).nb, nb)
			if ((i + rep) > n) {
				return $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
			}
			for (let j = 0; j < rep; j++) {
				$.pointerValue<number[]>($.pointerValue<decompressor>(f).bits)[i] = b
				i++
			}
		}

		if (!$.pointerValue<decompressor>(f).h1.init($.goSlice($.pointerValue<number[]>($.pointerValue<decompressor>(f).bits), 0, nlit)) || !$.pointerValue<decompressor>(f).h2.init($.goSlice($.pointerValue<number[]>($.pointerValue<decompressor>(f).bits), nlit, nlit + ndist))) {
			return $.namedValueInterfaceValue<$.GoError>($.pointerValue<decompressor>(f).roffset, "flate.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "flate.CorruptInputError" })
		}

		// As an optimization, we can initialize the min bits to read at a time
		// for the HLIT tree to the length of the EOB marker since we know that
		// every block must terminate with one. This preserves the property that
		// we never read any extra bytes after the end of the DEFLATE stream.
		if ($.pointerValue<decompressor>(f).h1.min < $.pointerValue<number[]>($.pointerValue<decompressor>(f).bits)[256]) {
			$.pointerValue<decompressor>(f).h1.min = $.pointerValue<number[]>($.pointerValue<decompressor>(f).bits)[256]
		}

		return null
	}

	static __typeInfo = $.registerStructType(
		"flate.decompressor",
		() => new decompressor(),
		[{ name: "Close", args: [], returns: [] }, { name: "Read", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "copyData", args: [], returns: [] }, { name: "dataBlock", args: [], returns: [] }, { name: "finishBlock", args: [], returns: [] }, { name: "huffSym", args: [], returns: [] }, { name: "huffmanBlock", args: [], returns: [] }, { name: "makeReader", args: [], returns: [] }, { name: "moreBits", args: [], returns: [] }, { name: "nextBlock", args: [], returns: [] }, { name: "readHuffman", args: [], returns: [] }],
		decompressor,
		{"r": "flate.Reader", "rBuf": { kind: $.TypeKind.Pointer, elemType: "bufio.Reader" }, "roffset": { kind: $.TypeKind.Basic, name: "int64" }, "b": { kind: $.TypeKind.Basic, name: "uint32" }, "nb": { kind: $.TypeKind.Basic, name: "uint" }, "h1": "flate.huffmanDecoder", "h2": "flate.huffmanDecoder", "bits": { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int" }, length: 316 } }, "codebits": { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int" }, length: 19 } }, "dict": "flate.dictDecoder", "buf": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 4 }, "step": ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.decompressor" }], results: [] } as $.FunctionTypeInfo), "stepState": { kind: $.TypeKind.Basic, name: "int" }, "final": { kind: $.TypeKind.Basic, name: "bool" }, "err": "error", "toRead": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "hl": { kind: $.TypeKind.Pointer, elemType: "flate.huffmanDecoder" }, "hd": { kind: $.TypeKind.Pointer, elemType: "flate.huffmanDecoder" }, "copyLen": { kind: $.TypeKind.Basic, name: "int" }, "copyDist": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export const maxCodeLen: number = 16

export const maxNumLit: number = 286

export const maxNumDist: number = 30

export const numCodes: number = 19

export const huffmanChunkBits: number = 9

export const huffmanNumChunks: number = 512

export const huffmanCountMask: number = 15

export const huffmanValueShift: number = 4

export let fixedOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_fixedOnce(__goscriptValue: sync.Once): void {
	fixedOnce.value = __goscriptValue
}

export let fixedHuffmanDecoder: $.VarRef<huffmanDecoder> = $.varRef($.markAsStructValue(new huffmanDecoder()))

export function __goscript_set_fixedHuffmanDecoder(__goscriptValue: huffmanDecoder): void {
	fixedHuffmanDecoder.value = __goscriptValue
}

export function CorruptInputError_Error(e: CorruptInputError): string {
	return "flate: corrupt input before offset " + strconv.FormatInt($.int($.int(e)), 10)
}

export function InternalError_Error(e: InternalError): string {
	return "flate: internal error: " + e
}

export let codeOrder: number[] = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]

export function __goscript_set_codeOrder(__goscriptValue: number[]): void {
	codeOrder = __goscriptValue
}

export function noEOF(e: $.GoError): $.GoError {
	if ($.comparableEqual(e, io.EOF)) {
		return io.ErrUnexpectedEOF
	}
	return e
}

export async function fixedHuffmanDecoderInit(): globalThis.Promise<void> {
	await fixedOnce.value.Do($.functionValue((): void => {
		// These come from the RFC section 3.2.6.
		let __goscriptShadow2: number[] = Array.from({ length: 288 }, () => 0)
		for (let i = 0; i < 144; i++) {
			__goscriptShadow2[i] = 8
		}
		for (let i = 144; i < 256; i++) {
			__goscriptShadow2[i] = 9
		}
		for (let i = 256; i < 280; i++) {
			__goscriptShadow2[i] = 7
		}
		for (let i = 280; i < 288; i++) {
			__goscriptShadow2[i] = 8
		}
		fixedHuffmanDecoder.value.init($.goSlice(__goscriptShadow2, undefined, undefined))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
}

export async function NewReader(r: io.Reader | null): globalThis.Promise<io.ReadCloser | null> {
	await fixedHuffmanDecoderInit()

	let f: $.VarRef<decompressor> = $.varRef($.markAsStructValue(new decompressor()))
	f.value.makeReader(r)
	f.value.bits = $.varRef<number[]>(Array.from({ length: 316 }, () => 0))
	f.value.codebits = $.varRef<number[]>(Array.from({ length: 19 }, () => 0))
	f.value.step = $.functionValue(async (f: decompressor | $.VarRef<decompressor> | null): globalThis.Promise<void> => await $.pointerValue<decompressor>(f).nextBlock(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.decompressor" }], results: [] } as $.FunctionTypeInfo))
	f.value.dict.init(32768, null)
	return $.interfaceValue<io.ReadCloser | null>(f, "*flate.decompressor")
}

export async function NewReaderDict(r: io.Reader | null, dict: $.Slice<number>): globalThis.Promise<io.ReadCloser | null> {
	await fixedHuffmanDecoderInit()

	let f: $.VarRef<decompressor> = $.varRef($.markAsStructValue(new decompressor()))
	f.value.makeReader(r)
	f.value.bits = $.varRef<number[]>(Array.from({ length: 316 }, () => 0))
	f.value.codebits = $.varRef<number[]>(Array.from({ length: 19 }, () => 0))
	f.value.step = $.functionValue(async (f: decompressor | $.VarRef<decompressor> | null): globalThis.Promise<void> => await $.pointerValue<decompressor>(f).nextBlock(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "flate.decompressor" }], results: [] } as $.FunctionTypeInfo))
	f.value.dict.init(32768, dict)
	return $.interfaceValue<io.ReadCloser | null>(f, "*flate.decompressor")
}
