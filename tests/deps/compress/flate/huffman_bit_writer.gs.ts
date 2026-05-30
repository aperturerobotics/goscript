// Generated file based on huffman_bit_writer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as __goscript_deflate from "./deflate.gs.ts"

import * as __goscript_huffman_code from "./huffman_code.gs.ts"

import * as __goscript_inflate from "./inflate.gs.ts"

import * as __goscript_token from "./token.gs.ts"
import "@goscript/io/index.js"
import "./deflate.gs.ts"
import "./huffman_code.gs.ts"
import "./inflate.gs.ts"
import "./token.gs.ts"

export class huffmanBitWriter {
	// writer is the underlying writer.
	// Do not use it directly; use the write method, which ensures
	// that Write errors are sticky.
	public get writer(): io.Writer | null {
		return this._fields.writer.value
	}
	public set writer(value: io.Writer | null) {
		this._fields.writer.value = value
	}

	// Data waiting to be written is bytes[0:nbytes]
	// and then the low nbits of bits.  Data is always written
	// sequentially into the bytes array.
	public get bits(): number {
		return this._fields.bits.value
	}
	public set bits(value: number) {
		this._fields.bits.value = value
	}

	public get nbits(): number {
		return this._fields.nbits.value
	}
	public set nbits(value: number) {
		this._fields.nbits.value = value
	}

	public get bytes(): Uint8Array {
		return this._fields.bytes.value
	}
	public set bytes(value: Uint8Array) {
		this._fields.bytes.value = value
	}

	public get codegenFreq(): number[] {
		return this._fields.codegenFreq.value
	}
	public set codegenFreq(value: number[]) {
		this._fields.codegenFreq.value = value
	}

	public get nbytes(): number {
		return this._fields.nbytes.value
	}
	public set nbytes(value: number) {
		this._fields.nbytes.value = value
	}

	public get literalFreq(): $.Slice<number> {
		return this._fields.literalFreq.value
	}
	public set literalFreq(value: $.Slice<number>) {
		this._fields.literalFreq.value = value
	}

	public get offsetFreq(): $.Slice<number> {
		return this._fields.offsetFreq.value
	}
	public set offsetFreq(value: $.Slice<number>) {
		this._fields.offsetFreq.value = value
	}

	public get codegen(): $.Slice<number> {
		return this._fields.codegen.value
	}
	public set codegen(value: $.Slice<number>) {
		this._fields.codegen.value = value
	}

	public get literalEncoding(): __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null {
		return this._fields.literalEncoding.value
	}
	public set literalEncoding(value: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null) {
		this._fields.literalEncoding.value = value
	}

	public get offsetEncoding(): __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null {
		return this._fields.offsetEncoding.value
	}
	public set offsetEncoding(value: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null) {
		this._fields.offsetEncoding.value = value
	}

	public get codegenEncoding(): __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null {
		return this._fields.codegenEncoding.value
	}
	public set codegenEncoding(value: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null) {
		this._fields.codegenEncoding.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public _fields: {
		writer: $.VarRef<io.Writer | null>
		bits: $.VarRef<number>
		nbits: $.VarRef<number>
		bytes: $.VarRef<Uint8Array>
		codegenFreq: $.VarRef<number[]>
		nbytes: $.VarRef<number>
		literalFreq: $.VarRef<$.Slice<number>>
		offsetFreq: $.VarRef<$.Slice<number>>
		codegen: $.VarRef<$.Slice<number>>
		literalEncoding: $.VarRef<__goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null>
		offsetEncoding: $.VarRef<__goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null>
		codegenEncoding: $.VarRef<__goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null>
		err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{writer?: io.Writer | null, bits?: number, nbits?: number, bytes?: Uint8Array, codegenFreq?: number[], nbytes?: number, literalFreq?: $.Slice<number>, offsetFreq?: $.Slice<number>, codegen?: $.Slice<number>, literalEncoding?: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null, offsetEncoding?: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null, codegenEncoding?: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null, err?: $.GoError}>) {
		this._fields = {
			writer: $.varRef(init?.writer ?? null),
			bits: $.varRef(init?.bits ?? 0),
			nbits: $.varRef(init?.nbits ?? 0),
			bytes: $.varRef(init?.bytes !== undefined ? $.cloneArrayValue(init.bytes) : new Uint8Array(248)),
			codegenFreq: $.varRef(init?.codegenFreq !== undefined ? $.cloneArrayValue(init.codegenFreq) : Array.from({ length: 19 }, () => 0)),
			nbytes: $.varRef(init?.nbytes ?? 0),
			literalFreq: $.varRef(init?.literalFreq ?? null),
			offsetFreq: $.varRef(init?.offsetFreq ?? null),
			codegen: $.varRef(init?.codegen ?? null),
			literalEncoding: $.varRef(init?.literalEncoding ?? null),
			offsetEncoding: $.varRef(init?.offsetEncoding ?? null),
			codegenEncoding: $.varRef(init?.codegenEncoding ?? null),
			err: $.varRef(init?.err ?? null)
		}
	}

	public clone(): huffmanBitWriter {
		const cloned = new huffmanBitWriter()
		cloned._fields = {
			writer: $.varRef(this._fields.writer.value),
			bits: $.varRef(this._fields.bits.value),
			nbits: $.varRef(this._fields.nbits.value),
			bytes: $.varRef($.cloneArrayValue(this._fields.bytes.value)),
			codegenFreq: $.varRef($.cloneArrayValue(this._fields.codegenFreq.value)),
			nbytes: $.varRef(this._fields.nbytes.value),
			literalFreq: $.varRef(this._fields.literalFreq.value),
			offsetFreq: $.varRef(this._fields.offsetFreq.value),
			codegen: $.varRef(this._fields.codegen.value),
			literalEncoding: $.varRef(this._fields.literalEncoding.value),
			offsetEncoding: $.varRef(this._fields.offsetEncoding.value),
			codegenEncoding: $.varRef(this._fields.codegenEncoding.value),
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public dynamicSize(litEnc: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null, offEnc: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null, extraBits: number): [number, number] {
		const w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		let size: number = 0
		let numCodegens: number = 0
		numCodegens = $.len($.pointerValue<huffmanBitWriter>(w).codegenFreq)
		while ((numCodegens > 4) && ($.int($.pointerValue<huffmanBitWriter>(w).codegenFreq[codegenOrder![numCodegens - 1]], 32) == $.int(0, 32))) {
			numCodegens--
		}
		let header = (((((((3 + 5) + 5) + 4) + (3 * numCodegens)) + __goscript_huffman_code.huffmanEncoder.prototype.bitLength.call($.pointerValue<huffmanBitWriter>(w).codegenEncoding, $.goSlice($.pointerValue<huffmanBitWriter>(w).codegenFreq, undefined, undefined))) + ($.int($.pointerValue<huffmanBitWriter>(w).codegenFreq[16]) * 2)) + ($.int($.pointerValue<huffmanBitWriter>(w).codegenFreq[17]) * 3)) + ($.int($.pointerValue<huffmanBitWriter>(w).codegenFreq[18]) * 7)
		size = ((header + __goscript_huffman_code.huffmanEncoder.prototype.bitLength.call(litEnc, $.pointerValue<huffmanBitWriter>(w).literalFreq)) + __goscript_huffman_code.huffmanEncoder.prototype.bitLength.call(offEnc, $.pointerValue<huffmanBitWriter>(w).offsetFreq)) + extraBits

		return [size, numCodegens]
	}

	public fixedSize(extraBits: number): number {
		const w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		return ((3 + __goscript_huffman_code.huffmanEncoder.prototype.bitLength.call(__goscript_huffman_code.fixedLiteralEncoding, $.pointerValue<huffmanBitWriter>(w).literalFreq)) + __goscript_huffman_code.huffmanEncoder.prototype.bitLength.call(__goscript_huffman_code.fixedOffsetEncoding, $.pointerValue<huffmanBitWriter>(w).offsetFreq)) + extraBits
	}

	public async flush(): globalThis.Promise<void> {
		let w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			$.pointerValue<huffmanBitWriter>(w).nbits = 0
			return
		}
		let n = $.pointerValue<huffmanBitWriter>(w).nbytes
		while ($.pointerValue<huffmanBitWriter>(w).nbits != 0) {
			$.pointerValue<huffmanBitWriter>(w).bytes[n] = $.uint($.uint($.pointerValue<huffmanBitWriter>(w).bits, 8), 8)
			$.pointerValue<huffmanBitWriter>(w).bits = $.uint64Shr($.pointerValue<huffmanBitWriter>(w).bits, $.uint(8, 64))
			if ($.pointerValue<huffmanBitWriter>(w).nbits > 8) {
				$.pointerValue<huffmanBitWriter>(w).nbits = $.uint64Sub($.pointerValue<huffmanBitWriter>(w).nbits, 8)
			} else {
				$.pointerValue<huffmanBitWriter>(w).nbits = 0
			}
			n++
		}
		$.pointerValue<huffmanBitWriter>(w).bits = $.uint(0, 64)
		await huffmanBitWriter.prototype.write.call(w, $.goSlice($.pointerValue<huffmanBitWriter>(w).bytes, undefined, n))
		$.pointerValue<huffmanBitWriter>(w).nbytes = 0
	}

	public generateCodegen(numLiterals: number, numOffsets: number, litEnc: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null, offEnc: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null): void {
		let w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		$.clear($.goSlice($.pointerValue<huffmanBitWriter>(w).codegenFreq, undefined, undefined))
		// Note that we are using codegen both as a temporary variable for holding
		// a copy of the frequencies, and as the place where we put the result.
		// This is fine because the output is always shorter than the input used
		// so far.
		let codegen: $.Slice<number> = $.pointerValue<huffmanBitWriter>(w).codegen
		// Copy the concatenated code sizes to codegen. Put a marker at the end.
		let cgnl: $.Slice<number> = $.goSlice(codegen, undefined, numLiterals)
		for (let __goscriptRangeTarget0 = cgnl, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			cgnl![i] = $.uint($.uint($.pointerValue<__goscript_huffman_code.huffmanEncoder>(litEnc).codes![i].len, 8), 8)
		}

		cgnl = $.goSlice(codegen, numLiterals, numLiterals + numOffsets)
		for (let __goscriptRangeTarget1 = cgnl, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			cgnl![i] = $.uint($.uint($.pointerValue<__goscript_huffman_code.huffmanEncoder>(offEnc).codes![i].len, 8), 8)
		}
		codegen![numLiterals + numOffsets] = $.uint(255, 8)

		let size = $.uint(codegen![0], 8)
		let count = 1
		let outIndex = 0
		for (let inIndex = 1; $.uint(size, 8) != $.uint(255, 8); inIndex++) {
			// INVARIANT: We have seen "count" copies of size that have not yet
			// had output generated for them.
			let nextSize = $.uint(codegen![inIndex], 8)
			if ($.uint(nextSize, 8) == $.uint(size, 8)) {
				count++
				continue
			}
			// We need to generate codegen indicating "count" of size.
			if ($.uint(size, 8) != $.uint(0, 8)) {
				codegen![outIndex] = $.uint(size, 8)
				outIndex++
				$.pointerValue<huffmanBitWriter>(w).codegenFreq[size]++
				count--
				while (count >= 3) {
					let n = 6
					if (n > count) {
						n = count
					}
					codegen![outIndex] = $.uint(16, 8)
					outIndex++
					codegen![outIndex] = $.uint($.uint(n - 3, 8), 8)
					outIndex++
					$.pointerValue<huffmanBitWriter>(w).codegenFreq[16]++
					count = count - (n)
				}
			} else {
				while (count >= 11) {
					let n = 138
					if (n > count) {
						n = count
					}
					codegen![outIndex] = $.uint(18, 8)
					outIndex++
					codegen![outIndex] = $.uint($.uint(n - 11, 8), 8)
					outIndex++
					$.pointerValue<huffmanBitWriter>(w).codegenFreq[18]++
					count = count - (n)
				}
				if (count >= 3) {
					// count >= 3 && count <= 10
					codegen![outIndex] = $.uint(17, 8)
					outIndex++
					codegen![outIndex] = $.uint($.uint(count - 3, 8), 8)
					outIndex++
					$.pointerValue<huffmanBitWriter>(w).codegenFreq[17]++
					count = 0
				}
			}
			count--
			for (; count >= 0; count--) {
				codegen![outIndex] = $.uint(size, 8)
				outIndex++
				$.pointerValue<huffmanBitWriter>(w).codegenFreq[size]++
			}
			// Set up invariant for next time through the loop.
			size = $.uint(nextSize, 8)
			count = 1
		}
		// Marker indicating the end of the codegen.
		codegen![outIndex] = $.uint(255, 8)
	}

	public indexTokens(tokens: $.Slice<__goscript_token.token>): [number, number] {
		let w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		let numLiterals: number = 0
		let numOffsets: number = 0
		$.clear($.pointerValue<huffmanBitWriter>(w).literalFreq)
		$.clear($.pointerValue<huffmanBitWriter>(w).offsetFreq)

		for (let __goscriptRangeTarget2 = tokens, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let t = __goscriptRangeTarget2![__rangeIndex]
			if (t < 1073741824) {
				$.pointerValue<huffmanBitWriter>(w).literalFreq![__goscript_token.token_literal(t)]++
				continue
			}
			let length = $.uint(__goscript_token.token_length(t), 32)
			let offset = $.uint(__goscript_token.token_offset(t), 32)
			$.pointerValue<huffmanBitWriter>(w).literalFreq![257 + __goscript_token.lengthCode($.uint(length, 32))]++
			$.pointerValue<huffmanBitWriter>(w).offsetFreq![__goscript_token.offsetCode($.uint(offset, 32))]++
		}

		// get the number of literals
		numLiterals = $.len($.pointerValue<huffmanBitWriter>(w).literalFreq)
		while ($.int($.pointerValue<huffmanBitWriter>(w).literalFreq![numLiterals - 1], 32) == $.int(0, 32)) {
			numLiterals--
		}
		// get the number of offsets
		numOffsets = $.len($.pointerValue<huffmanBitWriter>(w).offsetFreq)
		while ((numOffsets > 0) && ($.int($.pointerValue<huffmanBitWriter>(w).offsetFreq![numOffsets - 1], 32) == $.int(0, 32))) {
			numOffsets--
		}
		if (numOffsets == 0) {
			// We haven't found a single match. If we want to go with the dynamic encoding,
			// we should count at least one offset to be sure that the offset huffman tree could be encoded.
			$.pointerValue<huffmanBitWriter>(w).offsetFreq![0] = $.int(1, 32)
			numOffsets = 1
		}
		__goscript_huffman_code.huffmanEncoder.prototype.generate.call($.pointerValue<huffmanBitWriter>(w).literalEncoding, $.pointerValue<huffmanBitWriter>(w).literalFreq, $.int(15, 32))
		__goscript_huffman_code.huffmanEncoder.prototype.generate.call($.pointerValue<huffmanBitWriter>(w).offsetEncoding, $.pointerValue<huffmanBitWriter>(w).offsetFreq, $.int(15, 32))
		return [numLiterals, numOffsets]
	}

	public reset(writer: io.Writer | null): void {
		let w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		$.pointerValue<huffmanBitWriter>(w).writer = writer
		let __goscriptAssign0_0: number = $.uint(0, 64)
		let __goscriptAssign0_1: number = 0
		let __goscriptAssign0_2: number = 0
		let __goscriptAssign0_3: $.GoError = null
		$.pointerValue<huffmanBitWriter>(w).bits = __goscriptAssign0_0
		$.pointerValue<huffmanBitWriter>(w).nbits = __goscriptAssign0_1
		$.pointerValue<huffmanBitWriter>(w).nbytes = __goscriptAssign0_2
		$.pointerValue<huffmanBitWriter>(w).err = __goscriptAssign0_3
	}

	public storedSize(_in: $.Slice<number>): [number, boolean] {
		const w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if (_in == null) {
			return [0, false]
		}
		if ($.len(_in) <= 65535) {
			return [($.len(_in) + 5) * 8, true]
		}
		return [0, false]
	}

	public async write(b: $.Slice<number>): globalThis.Promise<void> {
		let w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}
		let __goscriptTuple0: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<huffmanBitWriter>(w).writer).Write(b)
		$.pointerValue<huffmanBitWriter>(w).err = __goscriptTuple0[1]
	}

	public async writeBits(b: number, nb: number): globalThis.Promise<void> {
		let w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}
		$.pointerValue<huffmanBitWriter>(w).bits = $.uint64Or($.pointerValue<huffmanBitWriter>(w).bits, $.uint($.uint64Shl($.uint(b, 64), $.pointerValue<huffmanBitWriter>(w).nbits), 64))
		$.pointerValue<huffmanBitWriter>(w).nbits = $.uint64Add($.pointerValue<huffmanBitWriter>(w).nbits, nb)
		if ($.pointerValue<huffmanBitWriter>(w).nbits >= 48) {
			let bits = $.uint($.pointerValue<huffmanBitWriter>(w).bits, 64)
			$.pointerValue<huffmanBitWriter>(w).bits = $.uint64Shr($.pointerValue<huffmanBitWriter>(w).bits, $.uint(48, 64))
			$.pointerValue<huffmanBitWriter>(w).nbits = $.uint64Sub($.pointerValue<huffmanBitWriter>(w).nbits, 48)
			let n = $.pointerValue<huffmanBitWriter>(w).nbytes
			let bytes: $.Slice<number> = $.goSlice($.pointerValue<huffmanBitWriter>(w).bytes, n, n + 6)
			bytes![0] = $.uint($.uint(bits, 8), 8)
			bytes![1] = $.uint($.uint($.uint64Shr(bits, 8), 8), 8)
			bytes![2] = $.uint($.uint($.uint64Shr(bits, 16), 8), 8)
			bytes![3] = $.uint($.uint($.uint64Shr(bits, 24), 8), 8)
			bytes![4] = $.uint($.uint($.uint64Shr(bits, 32), 8), 8)
			bytes![5] = $.uint($.uint($.uint64Shr(bits, 40), 8), 8)
			n = n + (6)
			if (n >= 240) {
				await huffmanBitWriter.prototype.write.call(w, $.goSlice($.pointerValue<huffmanBitWriter>(w).bytes, undefined, n))
				n = 0
			}
			$.pointerValue<huffmanBitWriter>(w).nbytes = n
		}
	}

	public async writeBlock(tokens: $.Slice<__goscript_token.token>, eof: boolean, input: $.Slice<number>): globalThis.Promise<void> {
		const w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}

		tokens = $.append(tokens, $.uint(256, 32))
		let [numLiterals, numOffsets] = huffmanBitWriter.prototype.indexTokens.call(w, tokens)

		let extraBits: number = 0
		let __goscriptTuple1: any = huffmanBitWriter.prototype.storedSize.call(w, input)
		let storedSize = __goscriptTuple1[0]
		let storable = __goscriptTuple1[1]
		if (storable) {
			// We only bother calculating the costs of the extra bits required by
			// the length of offset fields (which will be the same for both fixed
			// and dynamic encoding), if we need to compare those two encodings
			// against stored encoding.
			for (let lengthCode = 257 + 8; lengthCode < numLiterals; lengthCode++) {
				// First eight length codes have extra size = 0.
				extraBits = extraBits + ($.int($.pointerValue<huffmanBitWriter>(w).literalFreq![lengthCode]) * $.int(lengthExtraBits![lengthCode - 257]))
			}
			for (let offsetCode = 4; offsetCode < numOffsets; offsetCode++) {
				// First four offset codes have extra size = 0.
				extraBits = extraBits + ($.int($.pointerValue<huffmanBitWriter>(w).offsetFreq![offsetCode]) * $.int(offsetExtraBits![offsetCode]))
			}
		}

		// Figure out smallest code.
		// Fixed Huffman baseline.
		let literalEncoding: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null = __goscript_huffman_code.fixedLiteralEncoding
		let offsetEncoding: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null = __goscript_huffman_code.fixedOffsetEncoding
		let size: number = huffmanBitWriter.prototype.fixedSize.call(w, extraBits)

		// Dynamic Huffman?
		let numCodegens: number = 0

		// Generate codegen and codegenFrequencies, which indicates how to encode
		// the literalEncoding and the offsetEncoding.
		huffmanBitWriter.prototype.generateCodegen.call(w, numLiterals, numOffsets, $.pointerValue<huffmanBitWriter>(w).literalEncoding, $.pointerValue<huffmanBitWriter>(w).offsetEncoding)
		__goscript_huffman_code.huffmanEncoder.prototype.generate.call($.pointerValue<huffmanBitWriter>(w).codegenEncoding, $.goSlice($.pointerValue<huffmanBitWriter>(w).codegenFreq, undefined, undefined), $.int(7, 32))
		let __goscriptTuple2: any = huffmanBitWriter.prototype.dynamicSize.call(w, $.pointerValue<huffmanBitWriter>(w).literalEncoding, $.pointerValue<huffmanBitWriter>(w).offsetEncoding, extraBits)
		let dynamicSize = __goscriptTuple2[0]
		numCodegens = __goscriptTuple2[1]

		if (dynamicSize < size) {
			size = dynamicSize
			literalEncoding = $.pointerValue<huffmanBitWriter>(w).literalEncoding
			offsetEncoding = $.pointerValue<huffmanBitWriter>(w).offsetEncoding
		}

		// Stored bytes?
		if (storable && (storedSize < size)) {
			await huffmanBitWriter.prototype.writeStoredHeader.call(w, $.len(input), eof)
			await huffmanBitWriter.prototype.writeBytes.call(w, input)
			return
		}

		// Huffman.
		if (literalEncoding == __goscript_huffman_code.fixedLiteralEncoding) {
			await huffmanBitWriter.prototype.writeFixedHeader.call(w, eof)
		} else {
			await huffmanBitWriter.prototype.writeDynamicHeader.call(w, numLiterals, numOffsets, numCodegens, eof)
		}

		// Write the tokens.
		await huffmanBitWriter.prototype.writeTokens.call(w, tokens, $.pointerValue<__goscript_huffman_code.huffmanEncoder>(literalEncoding).codes, $.pointerValue<__goscript_huffman_code.huffmanEncoder>(offsetEncoding).codes)
	}

	public async writeBlockDynamic(tokens: $.Slice<__goscript_token.token>, eof: boolean, input: $.Slice<number>): globalThis.Promise<void> {
		const w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}

		tokens = $.append(tokens, $.uint(256, 32))
		let [numLiterals, numOffsets] = huffmanBitWriter.prototype.indexTokens.call(w, tokens)

		// Generate codegen and codegenFrequencies, which indicates how to encode
		// the literalEncoding and the offsetEncoding.
		huffmanBitWriter.prototype.generateCodegen.call(w, numLiterals, numOffsets, $.pointerValue<huffmanBitWriter>(w).literalEncoding, $.pointerValue<huffmanBitWriter>(w).offsetEncoding)
		__goscript_huffman_code.huffmanEncoder.prototype.generate.call($.pointerValue<huffmanBitWriter>(w).codegenEncoding, $.goSlice($.pointerValue<huffmanBitWriter>(w).codegenFreq, undefined, undefined), $.int(7, 32))
		let [size, numCodegens] = huffmanBitWriter.prototype.dynamicSize.call(w, $.pointerValue<huffmanBitWriter>(w).literalEncoding, $.pointerValue<huffmanBitWriter>(w).offsetEncoding, 0)

		// Store bytes, if we don't get a reasonable improvement.
		{
			let [ssize, storable] = huffmanBitWriter.prototype.storedSize.call(w, input)
			if (storable && (ssize < (size + (size >> 4)))) {
				await huffmanBitWriter.prototype.writeStoredHeader.call(w, $.len(input), eof)
				await huffmanBitWriter.prototype.writeBytes.call(w, input)
				return
			}
		}

		// Write Huffman table.
		await huffmanBitWriter.prototype.writeDynamicHeader.call(w, numLiterals, numOffsets, numCodegens, eof)

		// Write the tokens.
		await huffmanBitWriter.prototype.writeTokens.call(w, tokens, $.pointerValue<__goscript_huffman_code.huffmanEncoder>($.pointerValue<huffmanBitWriter>(w).literalEncoding).codes, $.pointerValue<__goscript_huffman_code.huffmanEncoder>($.pointerValue<huffmanBitWriter>(w).offsetEncoding).codes)
	}

	public async writeBlockHuff(eof: boolean, input: $.Slice<number>): globalThis.Promise<void> {
		let w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}

		// Clear histogram
		$.clear($.pointerValue<huffmanBitWriter>(w).literalFreq)

		// Add everything as literals
		histogram(input, $.pointerValue<huffmanBitWriter>(w).literalFreq)

		$.pointerValue<huffmanBitWriter>(w).literalFreq![256] = $.int(1, 32)

		const numLiterals: number = 257
		$.pointerValue<huffmanBitWriter>(w).offsetFreq![0] = $.int(1, 32)
		const numOffsets: number = 1

		__goscript_huffman_code.huffmanEncoder.prototype.generate.call($.pointerValue<huffmanBitWriter>(w).literalEncoding, $.pointerValue<huffmanBitWriter>(w).literalFreq, $.int(15, 32))

		// Figure out smallest code.
		// Always use dynamic Huffman or Store
		let numCodegens: number = 0

		// Generate codegen and codegenFrequencies, which indicates how to encode
		// the literalEncoding and the offsetEncoding.
		huffmanBitWriter.prototype.generateCodegen.call(w, 257, 1, $.pointerValue<huffmanBitWriter>(w).literalEncoding, huffOffset)
		__goscript_huffman_code.huffmanEncoder.prototype.generate.call($.pointerValue<huffmanBitWriter>(w).codegenEncoding, $.goSlice($.pointerValue<huffmanBitWriter>(w).codegenFreq, undefined, undefined), $.int(7, 32))
		let __goscriptTuple3: any = huffmanBitWriter.prototype.dynamicSize.call(w, $.pointerValue<huffmanBitWriter>(w).literalEncoding, huffOffset, 0)
		let size = __goscriptTuple3[0]
		numCodegens = __goscriptTuple3[1]

		// Store bytes, if we don't get a reasonable improvement.
		{
			let [ssize, storable] = huffmanBitWriter.prototype.storedSize.call(w, input)
			if (storable && (ssize < (size + (size >> 4)))) {
				await huffmanBitWriter.prototype.writeStoredHeader.call(w, $.len(input), eof)
				await huffmanBitWriter.prototype.writeBytes.call(w, input)
				return
			}
		}

		// Huffman.
		await huffmanBitWriter.prototype.writeDynamicHeader.call(w, 257, 1, numCodegens, eof)
		let encoding: $.Slice<__goscript_huffman_code.hcode> = $.goSlice($.pointerValue<__goscript_huffman_code.huffmanEncoder>($.pointerValue<huffmanBitWriter>(w).literalEncoding).codes, undefined, 257)
		let n = $.pointerValue<huffmanBitWriter>(w).nbytes
		for (let __goscriptRangeTarget3 = input, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let t = __goscriptRangeTarget3![__rangeIndex]
			// Bitwriting inlined, ~30% speedup
			let c = $.markAsStructValue($.cloneStructValue(encoding![t]))
			$.pointerValue<huffmanBitWriter>(w).bits = $.uint64Or($.pointerValue<huffmanBitWriter>(w).bits, $.uint($.uint64Shl($.uint(c.code, 64), $.pointerValue<huffmanBitWriter>(w).nbits), 64))
			$.pointerValue<huffmanBitWriter>(w).nbits = $.uint64Add($.pointerValue<huffmanBitWriter>(w).nbits, $.uint(c.len, 64))
			if ($.pointerValue<huffmanBitWriter>(w).nbits < 48) {
				continue
			}
			// Store 6 bytes
			let bits = $.uint($.pointerValue<huffmanBitWriter>(w).bits, 64)
			$.pointerValue<huffmanBitWriter>(w).bits = $.uint64Shr($.pointerValue<huffmanBitWriter>(w).bits, $.uint(48, 64))
			$.pointerValue<huffmanBitWriter>(w).nbits = $.uint64Sub($.pointerValue<huffmanBitWriter>(w).nbits, 48)
			let bytes: $.Slice<number> = $.goSlice($.pointerValue<huffmanBitWriter>(w).bytes, n, n + 6)
			bytes![0] = $.uint($.uint(bits, 8), 8)
			bytes![1] = $.uint($.uint($.uint64Shr(bits, 8), 8), 8)
			bytes![2] = $.uint($.uint($.uint64Shr(bits, 16), 8), 8)
			bytes![3] = $.uint($.uint($.uint64Shr(bits, 24), 8), 8)
			bytes![4] = $.uint($.uint($.uint64Shr(bits, 32), 8), 8)
			bytes![5] = $.uint($.uint($.uint64Shr(bits, 40), 8), 8)
			n = n + (6)
			if (n < 240) {
				continue
			}
			await huffmanBitWriter.prototype.write.call(w, $.goSlice($.pointerValue<huffmanBitWriter>(w).bytes, undefined, n))
			if ($.pointerValue<huffmanBitWriter>(w).err != null) {
				return
			}
			n = 0
		}
		$.pointerValue<huffmanBitWriter>(w).nbytes = n
		await huffmanBitWriter.prototype.writeCode.call(w, $.markAsStructValue($.cloneStructValue(encoding![256])))
	}

	public async writeBytes(bytes: $.Slice<number>): globalThis.Promise<void> {
		let w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}
		let n = $.pointerValue<huffmanBitWriter>(w).nbytes
		if (($.uint64And($.pointerValue<huffmanBitWriter>(w).nbits, 7)) != 0) {
			$.pointerValue<huffmanBitWriter>(w).err = $.namedValueInterfaceValue<$.GoError>("writeBytes with unfinished bits", "flate.InternalError", {"Error": __goscript_inflate.InternalError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "flate.InternalError" })
			return
		}
		while ($.pointerValue<huffmanBitWriter>(w).nbits != 0) {
			$.pointerValue<huffmanBitWriter>(w).bytes[n] = $.uint($.uint($.pointerValue<huffmanBitWriter>(w).bits, 8), 8)
			$.pointerValue<huffmanBitWriter>(w).bits = $.uint64Shr($.pointerValue<huffmanBitWriter>(w).bits, $.uint(8, 64))
			$.pointerValue<huffmanBitWriter>(w).nbits = $.uint64Sub($.pointerValue<huffmanBitWriter>(w).nbits, 8)
			n++
		}
		if (n != 0) {
			await huffmanBitWriter.prototype.write.call(w, $.goSlice($.pointerValue<huffmanBitWriter>(w).bytes, undefined, n))
		}
		$.pointerValue<huffmanBitWriter>(w).nbytes = 0
		await huffmanBitWriter.prototype.write.call(w, bytes)
	}

	public async writeCode(c: __goscript_huffman_code.hcode): globalThis.Promise<void> {
		let w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}
		$.pointerValue<huffmanBitWriter>(w).bits = $.uint64Or($.pointerValue<huffmanBitWriter>(w).bits, $.uint($.uint64Shl($.uint(c.code, 64), $.pointerValue<huffmanBitWriter>(w).nbits), 64))
		$.pointerValue<huffmanBitWriter>(w).nbits = $.uint64Add($.pointerValue<huffmanBitWriter>(w).nbits, $.uint(c.len, 64))
		if ($.pointerValue<huffmanBitWriter>(w).nbits >= 48) {
			let bits = $.uint($.pointerValue<huffmanBitWriter>(w).bits, 64)
			$.pointerValue<huffmanBitWriter>(w).bits = $.uint64Shr($.pointerValue<huffmanBitWriter>(w).bits, $.uint(48, 64))
			$.pointerValue<huffmanBitWriter>(w).nbits = $.uint64Sub($.pointerValue<huffmanBitWriter>(w).nbits, 48)
			let n = $.pointerValue<huffmanBitWriter>(w).nbytes
			let bytes: $.Slice<number> = $.goSlice($.pointerValue<huffmanBitWriter>(w).bytes, n, n + 6)
			bytes![0] = $.uint($.uint(bits, 8), 8)
			bytes![1] = $.uint($.uint($.uint64Shr(bits, 8), 8), 8)
			bytes![2] = $.uint($.uint($.uint64Shr(bits, 16), 8), 8)
			bytes![3] = $.uint($.uint($.uint64Shr(bits, 24), 8), 8)
			bytes![4] = $.uint($.uint($.uint64Shr(bits, 32), 8), 8)
			bytes![5] = $.uint($.uint($.uint64Shr(bits, 40), 8), 8)
			n = n + (6)
			if (n >= 240) {
				await huffmanBitWriter.prototype.write.call(w, $.goSlice($.pointerValue<huffmanBitWriter>(w).bytes, undefined, n))
				n = 0
			}
			$.pointerValue<huffmanBitWriter>(w).nbytes = n
		}
	}

	public async writeDynamicHeader(numLiterals: number, numOffsets: number, numCodegens: number, isEof: boolean): globalThis.Promise<void> {
		const w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}
		let firstBits: number = $.int(4, 32)
		if (isEof) {
			firstBits = $.int(5, 32)
		}
		await huffmanBitWriter.prototype.writeBits.call(w, $.int(firstBits, 32), 3)
		await huffmanBitWriter.prototype.writeBits.call(w, $.int($.int(numLiterals - 257, 32), 32), 5)
		await huffmanBitWriter.prototype.writeBits.call(w, $.int($.int(numOffsets - 1, 32), 32), 5)
		await huffmanBitWriter.prototype.writeBits.call(w, $.int($.int(numCodegens - 4, 32), 32), 4)

		for (let i = 0; i < numCodegens; i++) {
			let value = $.uint($.pointerValue<__goscript_huffman_code.huffmanEncoder>($.pointerValue<huffmanBitWriter>(w).codegenEncoding).codes![codegenOrder![i]].len, 64)
			await huffmanBitWriter.prototype.writeBits.call(w, $.int($.int(value, 32), 32), 3)
		}

		let i = 0
		while (true) {
			let codeWord: number = $.int($.pointerValue<huffmanBitWriter>(w).codegen![i])
			i++
			if (codeWord == 255) {
				break
			}
			await huffmanBitWriter.prototype.writeCode.call(w, $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_huffman_code.huffmanEncoder>($.pointerValue<huffmanBitWriter>(w).codegenEncoding).codes![$.uint(codeWord, 32)])))

			switch (codeWord) {
				case 16:
				{
					await huffmanBitWriter.prototype.writeBits.call(w, $.int($.int($.pointerValue<huffmanBitWriter>(w).codegen![i], 32), 32), 2)
					i++
					break
				}
				case 17:
				{
					await huffmanBitWriter.prototype.writeBits.call(w, $.int($.int($.pointerValue<huffmanBitWriter>(w).codegen![i], 32), 32), 3)
					i++
					break
				}
				case 18:
				{
					await huffmanBitWriter.prototype.writeBits.call(w, $.int($.int($.pointerValue<huffmanBitWriter>(w).codegen![i], 32), 32), 7)
					i++
					break
				}
			}
		}
	}

	public async writeFixedHeader(isEof: boolean): globalThis.Promise<void> {
		const w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}
		// Indicate that we are a fixed Huffman block
		let value: number = $.int(2, 32)
		if (isEof) {
			value = $.int(3, 32)
		}
		await huffmanBitWriter.prototype.writeBits.call(w, $.int(value, 32), 3)
	}

	public async writeStoredHeader(length: number, isEof: boolean): globalThis.Promise<void> {
		const w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}
		let flag: number = 0
		if (isEof) {
			flag = $.int(1, 32)
		}
		await huffmanBitWriter.prototype.writeBits.call(w, $.int(flag, 32), 3)
		await huffmanBitWriter.prototype.flush.call(w)
		await huffmanBitWriter.prototype.writeBits.call(w, $.int($.int(length, 32), 32), 16)
		await huffmanBitWriter.prototype.writeBits.call(w, $.int($.int($.uint(~$.uint(length, 16), 16), 32), 32), 16)
	}

	public async writeTokens(tokens: $.Slice<__goscript_token.token>, leCodes: $.Slice<__goscript_huffman_code.hcode>, oeCodes: $.Slice<__goscript_huffman_code.hcode>): globalThis.Promise<void> {
		const w: huffmanBitWriter | $.VarRef<huffmanBitWriter> | null = this
		if ($.pointerValue<huffmanBitWriter>(w).err != null) {
			return
		}
		for (let __goscriptRangeTarget4 = tokens, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
			let t = __goscriptRangeTarget4![__rangeIndex]
			if (t < 1073741824) {
				await huffmanBitWriter.prototype.writeCode.call(w, $.markAsStructValue($.cloneStructValue(leCodes![__goscript_token.token_literal(t)])))
				continue
			}
			// Write the length
			let length = $.uint(__goscript_token.token_length(t), 32)
			let __goscriptShadow0 = __goscript_token.lengthCode
			let __goscriptShadow1 = $.uint(__goscriptShadow0($.uint(length, 32)), 32)
			await huffmanBitWriter.prototype.writeCode.call(w, $.markAsStructValue($.cloneStructValue(leCodes![__goscriptShadow1 + 257])))
			let extraLengthBits = $.uint(lengthExtraBits![__goscriptShadow1], 64)
			if (extraLengthBits > 0) {
				let extraLength = $.int($.int(length - lengthBase![__goscriptShadow1], 32), 32)
				await huffmanBitWriter.prototype.writeBits.call(w, $.int(extraLength, 32), extraLengthBits)
			}
			// Write the offset
			let offset = $.uint(__goscript_token.token_offset(t), 32)
			let __goscriptShadow2 = __goscript_token.offsetCode
			let __goscriptShadow3 = $.uint(__goscriptShadow2($.uint(offset, 32)), 32)
			await huffmanBitWriter.prototype.writeCode.call(w, $.markAsStructValue($.cloneStructValue(oeCodes![__goscriptShadow3])))
			let extraOffsetBits = $.uint(offsetExtraBits![__goscriptShadow3], 64)
			if (extraOffsetBits > 0) {
				let extraOffset = $.int($.int(offset - offsetBase![__goscriptShadow3], 32), 32)
				await huffmanBitWriter.prototype.writeBits.call(w, $.int(extraOffset, 32), extraOffsetBits)
			}
		}
	}

	static __typeInfo = $.registerStructType(
		"flate.huffmanBitWriter",
		() => new huffmanBitWriter(),
		[{ name: "dynamicSize", args: [{ name: "litEnc", type: { kind: $.TypeKind.Pointer, elemType: "flate.huffmanEncoder" } }, { name: "offEnc", type: { kind: $.TypeKind.Pointer, elemType: "flate.huffmanEncoder" } }, { name: "extraBits", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "numCodegens", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "fixedSize", args: [{ name: "extraBits", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "flush", args: [], returns: [] }, { name: "generateCodegen", args: [{ name: "numLiterals", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "numOffsets", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "litEnc", type: { kind: $.TypeKind.Pointer, elemType: "flate.huffmanEncoder" } }, { name: "offEnc", type: { kind: $.TypeKind.Pointer, elemType: "flate.huffmanEncoder" } }], returns: [] }, { name: "indexTokens", args: [{ name: "tokens", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "flate.token" } } }], returns: [{ name: "numLiterals", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "numOffsets", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "reset", args: [{ name: "writer", type: "io.Writer" }], returns: [] }, { name: "storedSize", args: [{ name: "in", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "writeBits", args: [{ name: "b", type: { kind: $.TypeKind.Basic, name: "int32" } }, { name: "nb", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [] }, { name: "writeBlock", args: [{ name: "tokens", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "flate.token" } } }, { name: "eof", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "input", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "writeBlockDynamic", args: [{ name: "tokens", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "flate.token" } } }, { name: "eof", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "input", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "writeBlockHuff", args: [{ name: "eof", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "input", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "writeBytes", args: [{ name: "bytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "writeCode", args: [{ name: "c", type: "flate.hcode" }], returns: [] }, { name: "writeDynamicHeader", args: [{ name: "numLiterals", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "numOffsets", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "numCodegens", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "isEof", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }, { name: "writeFixedHeader", args: [{ name: "isEof", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }, { name: "writeStoredHeader", args: [{ name: "length", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "isEof", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }, { name: "writeTokens", args: [{ name: "tokens", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "flate.token" } } }, { name: "leCodes", type: { kind: $.TypeKind.Slice, elemType: "flate.hcode" } }, { name: "oeCodes", type: { kind: $.TypeKind.Slice, elemType: "flate.hcode" } }], returns: [] }],
		huffmanBitWriter,
		[{ name: "writer", key: "writer", type: "io.Writer", pkgPath: "compress/flate", index: [0], offset: 0, exported: false }, { name: "bits", key: "bits", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "compress/flate", index: [1], offset: 16, exported: false }, { name: "nbits", key: "nbits", type: { kind: $.TypeKind.Basic, name: "uint" }, pkgPath: "compress/flate", index: [2], offset: 24, exported: false }, { name: "bytes", key: "bytes", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 248 }, pkgPath: "compress/flate", index: [3], offset: 32, exported: false }, { name: "codegenFreq", key: "codegenFreq", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int32" }, length: 19 }, pkgPath: "compress/flate", index: [4], offset: 280, exported: false }, { name: "nbytes", key: "nbytes", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "compress/flate", index: [5], offset: 360, exported: false }, { name: "literalFreq", key: "literalFreq", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }, pkgPath: "compress/flate", index: [6], offset: 368, exported: false }, { name: "offsetFreq", key: "offsetFreq", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }, pkgPath: "compress/flate", index: [7], offset: 392, exported: false }, { name: "codegen", key: "codegen", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "compress/flate", index: [8], offset: 416, exported: false }, { name: "literalEncoding", key: "literalEncoding", type: { kind: $.TypeKind.Pointer, elemType: "flate.huffmanEncoder" }, pkgPath: "compress/flate", index: [9], offset: 440, exported: false }, { name: "offsetEncoding", key: "offsetEncoding", type: { kind: $.TypeKind.Pointer, elemType: "flate.huffmanEncoder" }, pkgPath: "compress/flate", index: [10], offset: 448, exported: false }, { name: "codegenEncoding", key: "codegenEncoding", type: { kind: $.TypeKind.Pointer, elemType: "flate.huffmanEncoder" }, pkgPath: "compress/flate", index: [11], offset: 456, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "compress/flate", index: [12], offset: 464, exported: false }]
	)
}

export const offsetCodeCount: number = 30

export const endBlockMarker: number = 256

export const lengthCodesStart: number = 257

export const codegenCodeCount: number = 19

export const badCode: number = 255

export const bufferFlushSize: number = 240

export const bufferSize: number = 248

export let lengthExtraBits: $.Slice<number> = $.arrayToSlice<number>([$.int(0, 8), $.int(0, 8), $.int(0, 8), $.int(0, 8), $.int(0, 8), $.int(0, 8), $.int(0, 8), $.int(0, 8), $.int(1, 8), $.int(1, 8), $.int(1, 8), $.int(1, 8), $.int(2, 8), $.int(2, 8), $.int(2, 8), $.int(2, 8), $.int(3, 8), $.int(3, 8), $.int(3, 8), $.int(3, 8), $.int(4, 8), $.int(4, 8), $.int(4, 8), $.int(4, 8), $.int(5, 8), $.int(5, 8), $.int(5, 8), $.int(5, 8), $.int(0, 8)])

export function __goscript_set_lengthExtraBits(__goscriptValue: $.Slice<number>): void {
	lengthExtraBits = __goscriptValue
}

export let lengthBase: $.Slice<number> = $.arrayToSlice<number>([$.uint(0, 32), $.uint(1, 32), $.uint(2, 32), $.uint(3, 32), $.uint(4, 32), $.uint(5, 32), $.uint(6, 32), $.uint(7, 32), $.uint(8, 32), $.uint(10, 32), $.uint(12, 32), $.uint(14, 32), $.uint(16, 32), $.uint(20, 32), $.uint(24, 32), $.uint(28, 32), $.uint(32, 32), $.uint(40, 32), $.uint(48, 32), $.uint(56, 32), $.uint(64, 32), $.uint(80, 32), $.uint(96, 32), $.uint(112, 32), $.uint(128, 32), $.uint(160, 32), $.uint(192, 32), $.uint(224, 32), $.uint(255, 32)])

export function __goscript_set_lengthBase(__goscriptValue: $.Slice<number>): void {
	lengthBase = __goscriptValue
}

export let offsetExtraBits: $.Slice<number> = $.arrayToSlice<number>([$.int(0, 8), $.int(0, 8), $.int(0, 8), $.int(0, 8), $.int(1, 8), $.int(1, 8), $.int(2, 8), $.int(2, 8), $.int(3, 8), $.int(3, 8), $.int(4, 8), $.int(4, 8), $.int(5, 8), $.int(5, 8), $.int(6, 8), $.int(6, 8), $.int(7, 8), $.int(7, 8), $.int(8, 8), $.int(8, 8), $.int(9, 8), $.int(9, 8), $.int(10, 8), $.int(10, 8), $.int(11, 8), $.int(11, 8), $.int(12, 8), $.int(12, 8), $.int(13, 8), $.int(13, 8)])

export function __goscript_set_offsetExtraBits(__goscriptValue: $.Slice<number>): void {
	offsetExtraBits = __goscriptValue
}

export let offsetBase: $.Slice<number> = $.arrayToSlice<number>([$.uint(0x000000, 32), $.uint(0x000001, 32), $.uint(0x000002, 32), $.uint(0x000003, 32), $.uint(0x000004, 32), $.uint(0x000006, 32), $.uint(0x000008, 32), $.uint(0x00000c, 32), $.uint(0x000010, 32), $.uint(0x000018, 32), $.uint(0x000020, 32), $.uint(0x000030, 32), $.uint(0x000040, 32), $.uint(0x000060, 32), $.uint(0x000080, 32), $.uint(0x0000c0, 32), $.uint(0x000100, 32), $.uint(0x000180, 32), $.uint(0x000200, 32), $.uint(0x000300, 32), $.uint(0x000400, 32), $.uint(0x000600, 32), $.uint(0x000800, 32), $.uint(0x000c00, 32), $.uint(0x001000, 32), $.uint(0x001800, 32), $.uint(0x002000, 32), $.uint(0x003000, 32), $.uint(0x004000, 32), $.uint(0x006000, 32)])

export function __goscript_set_offsetBase(__goscriptValue: $.Slice<number>): void {
	offsetBase = __goscriptValue
}

export let codegenOrder: $.Slice<number> = $.arrayToSlice<number>([$.uint(16, 32), $.uint(17, 32), $.uint(18, 32), $.uint(0, 32), $.uint(8, 32), $.uint(7, 32), $.uint(9, 32), $.uint(6, 32), $.uint(10, 32), $.uint(5, 32), $.uint(11, 32), $.uint(4, 32), $.uint(12, 32), $.uint(3, 32), $.uint(13, 32), $.uint(2, 32), $.uint(14, 32), $.uint(1, 32), $.uint(15, 32)])

export function __goscript_set_codegenOrder(__goscriptValue: $.Slice<number>): void {
	codegenOrder = __goscriptValue
}

export function newHuffmanBitWriter(w: io.Writer | null): huffmanBitWriter | $.VarRef<huffmanBitWriter> | null {
	return (() => { const __goscriptLiteralField0 = __goscript_huffman_code.newHuffmanEncoder(286); const __goscriptLiteralField1 = __goscript_huffman_code.newHuffmanEncoder(19); const __goscriptLiteralField2 = __goscript_huffman_code.newHuffmanEncoder(30); return new huffmanBitWriter({writer: w, literalFreq: $.makeSlice<number>(286, undefined, "number"), offsetFreq: $.makeSlice<number>(30, undefined, "number"), codegen: $.makeSlice<number>((286 + 30) + 1, undefined, "byte"), literalEncoding: __goscriptLiteralField0, codegenEncoding: __goscriptLiteralField1, offsetEncoding: __goscriptLiteralField2}) })()
}

export let huffOffset: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null = null as __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null

export function __goscript_set_huffOffset(__goscriptValue: __goscript_huffman_code.huffmanEncoder | $.VarRef<__goscript_huffman_code.huffmanEncoder> | null): void {
	huffOffset = __goscriptValue
}

function __goscriptInit0(): void {
	let offsetFreq: $.Slice<number> = $.makeSlice<number>(30, undefined, "number")
	offsetFreq![0] = $.int(1, 32)
	huffOffset = __goscript_huffman_code.newHuffmanEncoder(30)
	__goscript_huffman_code.huffmanEncoder.prototype.generate.call(huffOffset, offsetFreq, $.int(15, 32))
}

export function histogram(b: $.Slice<number>, h: $.Slice<number>): void {
	h = $.goSlice(h, undefined, 256)
	for (let __goscriptRangeTarget5 = b, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
		let t = __goscriptRangeTarget5![__rangeIndex]
		h![t]++
	}
}

__goscriptInit0()
