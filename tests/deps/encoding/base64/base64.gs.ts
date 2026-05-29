// Generated file based on base64.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as io from "@goscript/io/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/io/index.js"
import "@goscript/slices/index.js"
import "@goscript/strconv/index.js"

export type CorruptInputError = number

export class Encoding {
	public get encode(): Uint8Array {
		return this._fields.encode.value
	}
	public set encode(value: Uint8Array) {
		this._fields.encode.value = value
	}

	public get decodeMap(): Uint8Array {
		return this._fields.decodeMap.value
	}
	public set decodeMap(value: Uint8Array) {
		this._fields.decodeMap.value = value
	}

	public get padChar(): number {
		return this._fields.padChar.value
	}
	public set padChar(value: number) {
		this._fields.padChar.value = value
	}

	public get strict(): boolean {
		return this._fields.strict.value
	}
	public set strict(value: boolean) {
		this._fields.strict.value = value
	}

	public _fields: {
		encode: $.VarRef<Uint8Array>
		decodeMap: $.VarRef<Uint8Array>
		padChar: $.VarRef<number>
		strict: $.VarRef<boolean>
	}

	constructor(init?: Partial<{encode?: Uint8Array, decodeMap?: Uint8Array, padChar?: number, strict?: boolean}>) {
		this._fields = {
			encode: $.varRef(init?.encode !== undefined ? $.cloneArrayValue(init.encode) : new Uint8Array(64)),
			decodeMap: $.varRef(init?.decodeMap !== undefined ? $.cloneArrayValue(init.decodeMap) : new Uint8Array(256)),
			padChar: $.varRef(init?.padChar ?? 0),
			strict: $.varRef(init?.strict ?? false)
		}
	}

	public clone(): Encoding {
		const cloned = new Encoding()
		cloned._fields = {
			encode: $.varRef($.cloneArrayValue(this._fields.encode.value)),
			decodeMap: $.varRef($.cloneArrayValue(this._fields.decodeMap.value)),
			padChar: $.varRef(this._fields.padChar.value),
			strict: $.varRef(this._fields.strict.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendDecode(dst: $.Slice<number>, src: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const enc: Encoding | $.VarRef<Encoding> | null = this
		// Compute the output size without padding to avoid over allocating.
		let n = $.len(src)
		while ((n > 0) && ($.int($.int(src![n - 1], 32), 32) == $.int($.pointerValue<Encoding>(enc).padChar, 32))) {
			n--
		}
		n = decodedLen(n, $.int(-1, 32))

		dst = (slices.Grow(dst, n) as $.Slice<number>)
		let __goscriptTuple0: any = Encoding.prototype.Decode.call(enc, $.goSlice($.goSlice(dst, $.len(dst), undefined), undefined, n), src)
		n = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		return [$.goSlice(dst, undefined, $.len(dst) + n), err]
	}

	public AppendEncode(dst: $.Slice<number>, src: $.Slice<number>): $.Slice<number> {
		const enc: Encoding | $.VarRef<Encoding> | null = this
		let n = Encoding.prototype.EncodedLen.call(enc, $.len(src))
		dst = (slices.Grow(dst, n) as $.Slice<number>)
		Encoding.prototype.Encode.call(enc, $.goSlice($.goSlice(dst, $.len(dst), undefined), undefined, n), src)
		return $.goSlice(dst, undefined, $.len(dst) + n)
	}

	public Decode(dst: $.Slice<number>, src: $.Slice<number>): [number, $.GoError] {
		const enc: Encoding | $.VarRef<Encoding> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.len(src) == 0) {
			return [0, null]
		}

		// Lift the nil check outside of the loop. enc.decodeMap is directly
		// used later in this function, to let the compiler know that the
		// receiver can't be nil.
		$.pointerValue<Encoding>(enc).decodeMap

		let si = 0
		while (((strconv.IntSize >= 64) && (($.len(src) - si) >= 8)) && (($.len(dst) - n) >= 8)) {
			let src2: $.Slice<number> = $.goSlice(src, si, si + 8)
			{
				let __goscriptTuple1: any = assemble64($.uint($.pointerValue<Encoding>(enc).decodeMap[src2![0]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![1]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![2]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![3]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![4]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![5]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![6]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![7]], 8))
				let dn = $.uint(__goscriptTuple1[0], 64)
				let ok = __goscriptTuple1[1]
				if (ok) {
					byteorder.BEPutUint64($.goSlice(dst, n, undefined), $.uint(dn, 64))
					n = n + (6)
					si = si + (8)
				} else {
					let ninc: number = 0
					let __goscriptTuple2: any = Encoding.prototype.decodeQuantum.call(enc, $.goSlice(dst, n, undefined), src, si)
					si = __goscriptTuple2[0]
					ninc = __goscriptTuple2[1]
					err = __goscriptTuple2[2]
					n = n + (ninc)
					if (err != null) {
						return [n, err]
					}
				}
			}
		}

		while ((($.len(src) - si) >= 4) && (($.len(dst) - n) >= 4)) {
			let src2: $.Slice<number> = $.goSlice(src, si, si + 4)
			{
				let __goscriptTuple3: any = assemble32($.uint($.pointerValue<Encoding>(enc).decodeMap[src2![0]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![1]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![2]], 8), $.uint($.pointerValue<Encoding>(enc).decodeMap[src2![3]], 8))
				let dn = $.uint(__goscriptTuple3[0], 32)
				let ok = __goscriptTuple3[1]
				if (ok) {
					byteorder.BEPutUint32($.goSlice(dst, n, undefined), $.uint(dn, 32))
					n = n + (3)
					si = si + (4)
				} else {
					let ninc: number = 0
					let __goscriptTuple4: any = Encoding.prototype.decodeQuantum.call(enc, $.goSlice(dst, n, undefined), src, si)
					si = __goscriptTuple4[0]
					ninc = __goscriptTuple4[1]
					err = __goscriptTuple4[2]
					n = n + (ninc)
					if (err != null) {
						return [n, err]
					}
				}
			}
		}

		while (si < $.len(src)) {
			let ninc: number = 0
			let __goscriptTuple5: any = Encoding.prototype.decodeQuantum.call(enc, $.goSlice(dst, n, undefined), src, si)
			si = __goscriptTuple5[0]
			ninc = __goscriptTuple5[1]
			err = __goscriptTuple5[2]
			n = n + (ninc)
			if (err != null) {
				return [n, err]
			}
		}
		return [n, err]
	}

	public DecodeString(s: string): [$.Slice<number>, $.GoError] {
		const enc: Encoding | $.VarRef<Encoding> | null = this
		let dbuf: $.Slice<number> = $.makeSlice<number>(Encoding.prototype.DecodedLen.call(enc, $.len(s)), undefined, "byte")
		let [n, err] = Encoding.prototype.Decode.call(enc, dbuf, $.stringToBytes(s))
		return [$.goSlice(dbuf, undefined, n), err]
	}

	public DecodedLen(n: number): number {
		const enc: Encoding | $.VarRef<Encoding> | null = this
		return decodedLen(n, $.int($.pointerValue<Encoding>(enc).padChar, 32))
	}

	public Encode(dst: $.Slice<number>, src: $.Slice<number>): void {
		const enc: Encoding | $.VarRef<Encoding> | null = this
		if ($.len(src) == 0) {
			return
		}
		// enc is a pointer receiver, so the use of enc.encode within the hot
		// loop below means a nil check at every operation. Lift that nil check
		// outside of the loop to speed up the encoder.
		$.pointerValue<Encoding>(enc).encode

		let di = 0
		let si = 0
		let n = (Math.trunc($.len(src) / 3)) * 3
		while (si < n) {
			// Convert 3x 8bit source bytes into 4 bytes
			let val = $.uint64Or(($.uint64Or(($.uint64Shl($.uint(src![si + 0], 64), 16)), ($.uint64Shl($.uint(src![si + 1], 64), 8)))), $.uint(src![si + 2], 64))

			dst![di + 0] = $.uint($.pointerValue<Encoding>(enc).encode[$.uint64And(($.uint64Shr(val, 18)), 0x3F)], 8)
			dst![di + 1] = $.uint($.pointerValue<Encoding>(enc).encode[$.uint64And(($.uint64Shr(val, 12)), 0x3F)], 8)
			dst![di + 2] = $.uint($.pointerValue<Encoding>(enc).encode[$.uint64And(($.uint64Shr(val, 6)), 0x3F)], 8)
			dst![di + 3] = $.uint($.pointerValue<Encoding>(enc).encode[$.uint64And(val, 0x3F)], 8)

			si = si + (3)
			di = di + (4)
		}

		let remain = $.len(src) - si
		if (remain == 0) {
			return
		}
		// Add the remaining small block
		let val = $.uint64Shl($.uint(src![si + 0], 64), 16)
		if (remain == 2) {
			val = $.uint64Or(val, $.uint64Shl($.uint(src![si + 1], 64), 8))
		}

		dst![di + 0] = $.uint($.pointerValue<Encoding>(enc).encode[$.uint64And(($.uint64Shr(val, 18)), 0x3F)], 8)
		dst![di + 1] = $.uint($.pointerValue<Encoding>(enc).encode[$.uint64And(($.uint64Shr(val, 12)), 0x3F)], 8)

		switch (remain) {
			case 2:
			{
				dst![di + 2] = $.uint($.pointerValue<Encoding>(enc).encode[$.uint64And(($.uint64Shr(val, 6)), 0x3F)], 8)
				if ($.int($.pointerValue<Encoding>(enc).padChar, 32) != $.int(-1, 32)) {
					dst![di + 3] = $.uint($.uint($.pointerValue<Encoding>(enc).padChar, 8), 8)
				}
				break
			}
			case 1:
			{
				if ($.int($.pointerValue<Encoding>(enc).padChar, 32) != $.int(-1, 32)) {
					dst![di + 2] = $.uint($.uint($.pointerValue<Encoding>(enc).padChar, 8), 8)
					dst![di + 3] = $.uint($.uint($.pointerValue<Encoding>(enc).padChar, 8), 8)
				}
				break
			}
		}
	}

	public EncodeToString(src: $.Slice<number>): string {
		const enc: Encoding | $.VarRef<Encoding> | null = this
		let buf: $.Slice<number> = $.makeSlice<number>(Encoding.prototype.EncodedLen.call(enc, $.len(src)), undefined, "byte")
		Encoding.prototype.Encode.call(enc, buf, src)
		return $.bytesToString(buf)
	}

	public EncodedLen(n: number): number {
		const enc: Encoding | $.VarRef<Encoding> | null = this
		if ($.int($.pointerValue<Encoding>(enc).padChar, 32) == $.int(-1, 32)) {
			return ((Math.trunc(n / 3)) * 4) + (Math.trunc((((n % 3) * 8) + 5) / 6))
		}
		return (Math.trunc((n + 2) / 3)) * 4
	}

	public Strict(): Encoding | $.VarRef<Encoding> | null {
		let enc = $.varRef(this)
		enc.value.strict = true
		return enc
	}

	public WithPadding(padding: number): Encoding | $.VarRef<Encoding> | null {
		let enc = $.varRef(this)
		switch (true) {
			case (((padding < -1) || ($.int(padding, 32) == $.int(13, 32))) || ($.int(padding, 32) == $.int(10, 32))) || (padding > 0xff):
			{
				$.panic("invalid padding")
				break
			}
			case ($.int(padding, 32) != $.int(-1, 32)) && ($.uint(enc.value.decodeMap[$.uint(padding, 8)], 8) != $.uint(255, 8)):
			{
				$.panic("padding contained in alphabet")
				break
			}
		}
		enc.value.padChar = $.int(padding, 32)
		return enc
	}

	public decodeQuantum(dst: $.Slice<number>, src: $.Slice<number>, si: number): [number, number, $.GoError] {
		const enc: Encoding | $.VarRef<Encoding> | null = this
		let nsi: number = 0
		let n: number = 0
		let err: $.GoError = null as $.GoError
		// Decode quantum using the base64 alphabet
		let dbuf: Uint8Array = new Uint8Array(4)
		let dlen = 4

		// Lift the nil check outside of the loop.
		$.pointerValue<Encoding>(enc).decodeMap

		for (let j = 0; j < $.len(dbuf); j++) {
			if ($.len(src) == si) {
				switch (true) {
					case j == 0:
					{
						return [si, 0, null]
						break
					}
					case j == 1:
					case $.int($.pointerValue<Encoding>(enc).padChar, 32) != $.int(-1, 32):
					{
						return [si, 0, $.namedValueInterfaceValue<$.GoError>(si - j, "base64.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "base64.CorruptInputError" })]
						break
					}
				}
				dlen = j
				break
			}
			let _in = $.uint(src![si], 8)
			si++

			let out = $.uint($.pointerValue<Encoding>(enc).decodeMap[_in], 8)
			if ($.uint(out, 8) != $.uint(0xff, 8)) {
				dbuf[j] = $.uint(out, 8)
				continue
			}

			if (($.uint(_in, 8) == $.uint(10, 8)) || ($.uint(_in, 8) == $.uint(13, 8))) {
				j--
				continue
			}

			if ($.int($.int(_in, 32), 32) != $.int($.pointerValue<Encoding>(enc).padChar, 32)) {
				return [si, 0, $.namedValueInterfaceValue<$.GoError>(si - 1, "base64.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "base64.CorruptInputError" })]
			}

			// We've reached the end and there's padding
			switch (j) {
				case 0:
				case 1:
				{
					return [si, 0, $.namedValueInterfaceValue<$.GoError>(si - 1, "base64.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "base64.CorruptInputError" })]
					break
				}
				case 2:
				{
					while ((si < $.len(src)) && (($.uint(src![si], 8) == $.uint(10, 8)) || ($.uint(src![si], 8) == $.uint(13, 8)))) {
						si++
					}
					if (si == $.len(src)) {
						// not enough padding
						return [si, 0, $.namedValueInterfaceValue<$.GoError>($.len(src), "base64.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "base64.CorruptInputError" })]
					}
					if ($.int($.int(src![si], 32), 32) != $.int($.pointerValue<Encoding>(enc).padChar, 32)) {
						// incorrect padding
						return [si, 0, $.namedValueInterfaceValue<$.GoError>(si - 1, "base64.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "base64.CorruptInputError" })]
					}

					si++
					break
				}
			}

			// skip over newlines
			while ((si < $.len(src)) && (($.uint(src![si], 8) == $.uint(10, 8)) || ($.uint(src![si], 8) == $.uint(13, 8)))) {
				si++
			}
			if (si < $.len(src)) {
				// trailing garbage
				err = $.namedValueInterfaceValue<$.GoError>(si, "base64.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "base64.CorruptInputError" })
			}
			dlen = j
			break
		}

		// Convert 4x 6bit source bytes into 3 bytes
		let val = $.uint64Or(($.uint64Or(($.uint64Or(($.uint64Shl($.uint(dbuf[0], 64), 18)), ($.uint64Shl($.uint(dbuf[1], 64), 12)))), ($.uint64Shl($.uint(dbuf[2], 64), 6)))), $.uint(dbuf[3], 64))
		let __goscriptAssign0_0: number = $.uint($.uint($.uint64Shr(val, 0), 8), 8)
		let __goscriptAssign0_1: number = $.uint($.uint($.uint64Shr(val, 8), 8), 8)
		let __goscriptAssign0_2: number = $.uint($.uint($.uint64Shr(val, 16), 8), 8)
		dbuf[2] = __goscriptAssign0_0
		dbuf[1] = __goscriptAssign0_1
		dbuf[0] = __goscriptAssign0_2
		switch (dlen) {
			case 4:
			{
				dst![2] = $.uint(dbuf[2], 8)
				dbuf[2] = $.uint(0, 8)
			}
			case 3:
			{
				dst![1] = $.uint(dbuf[1], 8)
				if ($.pointerValue<Encoding>(enc).strict && ($.uint(dbuf[2], 8) != $.uint(0, 8))) {
					return [si, 0, $.namedValueInterfaceValue<$.GoError>(si - 1, "base64.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "base64.CorruptInputError" })]
				}
				dbuf[1] = $.uint(0, 8)
			}
			case 2:
			{
				dst![0] = $.uint(dbuf[0], 8)
				if ($.pointerValue<Encoding>(enc).strict && (($.uint(dbuf[1], 8) != $.uint(0, 8)) || ($.uint(dbuf[2], 8) != $.uint(0, 8)))) {
					return [si, 0, $.namedValueInterfaceValue<$.GoError>(si - 2, "base64.CorruptInputError", {"Error": CorruptInputError_Error}, { kind: $.TypeKind.Basic, name: "int64", typeName: "base64.CorruptInputError" })]
				}
				break
			}
		}

		return [si, dlen - 1, err]
	}

	static __typeInfo = $.registerStructType(
		"base64.Encoding",
		() => new Encoding(),
		[{ name: "AppendDecode", args: [], returns: [] }, { name: "AppendEncode", args: [], returns: [] }, { name: "Decode", args: [], returns: [] }, { name: "DecodeString", args: [], returns: [] }, { name: "DecodedLen", args: [], returns: [] }, { name: "Encode", args: [], returns: [] }, { name: "EncodeToString", args: [], returns: [] }, { name: "EncodedLen", args: [], returns: [] }, { name: "Strict", args: [], returns: [] }, { name: "WithPadding", args: [], returns: [] }, { name: "decodeQuantum", args: [], returns: [] }],
		Encoding,
		{"encode": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 64 }, "decodeMap": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 256 }, "padChar": { kind: $.TypeKind.Basic, name: "int32" }, "strict": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export class encoder {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get enc(): Encoding | $.VarRef<Encoding> | null {
		return this._fields.enc.value
	}
	public set enc(value: Encoding | $.VarRef<Encoding> | null) {
		this._fields.enc.value = value
	}

	public get w(): io.Writer | null {
		return this._fields.w.value
	}
	public set w(value: io.Writer | null) {
		this._fields.w.value = value
	}

	public get buf(): Uint8Array {
		return this._fields.buf.value
	}
	public set buf(value: Uint8Array) {
		this._fields.buf.value = value
	}

	public get nbuf(): number {
		return this._fields.nbuf.value
	}
	public set nbuf(value: number) {
		this._fields.nbuf.value = value
	}

	public get out(): Uint8Array {
		return this._fields.out.value
	}
	public set out(value: Uint8Array) {
		this._fields.out.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>
		enc: $.VarRef<Encoding | $.VarRef<Encoding> | null>
		w: $.VarRef<io.Writer | null>
		buf: $.VarRef<Uint8Array>
		nbuf: $.VarRef<number>
		out: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{err?: $.GoError, enc?: Encoding | $.VarRef<Encoding> | null, w?: io.Writer | null, buf?: Uint8Array, nbuf?: number, out?: Uint8Array}>) {
		this._fields = {
			err: $.varRef(init?.err ?? null),
			enc: $.varRef(init?.enc ?? null),
			w: $.varRef(init?.w ?? null),
			buf: $.varRef(init?.buf !== undefined ? $.cloneArrayValue(init.buf) : new Uint8Array(3)),
			nbuf: $.varRef(init?.nbuf ?? 0),
			out: $.varRef(init?.out !== undefined ? $.cloneArrayValue(init.out) : new Uint8Array(1024))
		}
	}

	public clone(): encoder {
		const cloned = new encoder()
		cloned._fields = {
			err: $.varRef(this._fields.err.value),
			enc: $.varRef(this._fields.enc.value),
			w: $.varRef(this._fields.w.value),
			buf: $.varRef($.cloneArrayValue(this._fields.buf.value)),
			nbuf: $.varRef(this._fields.nbuf.value),
			out: $.varRef($.cloneArrayValue(this._fields.out.value))
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		let e: encoder | $.VarRef<encoder> | null = this
		// If there's anything left in the buffer, flush it out
		if (($.pointerValue<encoder>(e).err == null) && ($.pointerValue<encoder>(e).nbuf > 0)) {
			Encoding.prototype.Encode.call($.pointerValue<encoder>(e).enc, $.goSlice($.pointerValue<encoder>(e).out, undefined, undefined), $.goSlice($.pointerValue<encoder>(e).buf, undefined, $.pointerValue<encoder>(e).nbuf))
			let __goscriptTuple6: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<encoder>(e).w).Write($.goSlice($.pointerValue<encoder>(e).out, undefined, Encoding.prototype.EncodedLen.call($.pointerValue<encoder>(e).enc, $.pointerValue<encoder>(e).nbuf)))
			$.pointerValue<encoder>(e).err = __goscriptTuple6[1]
			$.pointerValue<encoder>(e).nbuf = 0
		}
		return $.pointerValue<encoder>(e).err
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let e: encoder | $.VarRef<encoder> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<encoder>(e).err != null) {
			return [0, $.pointerValue<encoder>(e).err]
		}

		// Leading fringe.
		if ($.pointerValue<encoder>(e).nbuf > 0) {
			let i: number = 0
			for (i = 0; (i < $.len(p)) && ($.pointerValue<encoder>(e).nbuf < 3); i++) {
				$.pointerValue<encoder>(e).buf[$.pointerValue<encoder>(e).nbuf] = $.uint(p![i], 8)
				$.pointerValue<encoder>(e).nbuf++
			}
			n = n + (i)
			p = $.goSlice(p, i, undefined)
			if ($.pointerValue<encoder>(e).nbuf < 3) {
				return [n, err]
			}
			Encoding.prototype.Encode.call($.pointerValue<encoder>(e).enc, $.goSlice($.pointerValue<encoder>(e).out, undefined, undefined), $.goSlice($.pointerValue<encoder>(e).buf, undefined, undefined))
			{
				let __goscriptTuple7: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<encoder>(e).w).Write($.goSlice($.pointerValue<encoder>(e).out, undefined, 4))
				$.pointerValue<encoder>(e).err = __goscriptTuple7[1]
				if ($.pointerValue<encoder>(e).err != null) {
					return [n, $.pointerValue<encoder>(e).err]
				}
			}
			$.pointerValue<encoder>(e).nbuf = 0
		}

		// Large interior chunks.
		while ($.len(p) >= 3) {
			let nn = (Math.trunc($.len($.pointerValue<encoder>(e).out) / 4)) * 3
			if (nn > $.len(p)) {
				nn = $.len(p)
				nn = nn - (nn % 3)
			}
			Encoding.prototype.Encode.call($.pointerValue<encoder>(e).enc, $.goSlice($.pointerValue<encoder>(e).out, undefined, undefined), $.goSlice(p, undefined, nn))
			{
				let __goscriptTuple8: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<encoder>(e).w).Write($.goSlice($.pointerValue<encoder>(e).out, 0, (Math.trunc(nn / 3)) * 4))
				$.pointerValue<encoder>(e).err = __goscriptTuple8[1]
				if ($.pointerValue<encoder>(e).err != null) {
					return [n, $.pointerValue<encoder>(e).err]
				}
			}
			n = n + (nn)
			p = $.goSlice(p, nn, undefined)
		}

		// Trailing fringe.
		$.copy($.goSlice($.pointerValue<encoder>(e).buf, undefined, undefined), p)
		$.pointerValue<encoder>(e).nbuf = $.len(p)
		n = n + ($.len(p))
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"base64.encoder",
		() => new encoder(),
		[{ name: "Close", args: [], returns: [] }, { name: "Write", args: [], returns: [] }],
		encoder,
		{"err": "error", "enc": { kind: $.TypeKind.Pointer, elemType: "base64.Encoding" }, "w": "io.Writer", "buf": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 3 }, "nbuf": { kind: $.TypeKind.Basic, name: "int" }, "out": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 1024 }}
	)
}

export class decoder {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get readErr(): $.GoError {
		return this._fields.readErr.value
	}
	public set readErr(value: $.GoError) {
		this._fields.readErr.value = value
	}

	public get enc(): Encoding | $.VarRef<Encoding> | null {
		return this._fields.enc.value
	}
	public set enc(value: Encoding | $.VarRef<Encoding> | null) {
		this._fields.enc.value = value
	}

	public get r(): io.Reader | null {
		return this._fields.r.value
	}
	public set r(value: io.Reader | null) {
		this._fields.r.value = value
	}

	public get buf(): Uint8Array {
		return this._fields.buf.value
	}
	public set buf(value: Uint8Array) {
		this._fields.buf.value = value
	}

	public get nbuf(): number {
		return this._fields.nbuf.value
	}
	public set nbuf(value: number) {
		this._fields.nbuf.value = value
	}

	public get out(): $.Slice<number> {
		return this._fields.out.value
	}
	public set out(value: $.Slice<number>) {
		this._fields.out.value = value
	}

	public get outbuf(): Uint8Array {
		return this._fields.outbuf.value
	}
	public set outbuf(value: Uint8Array) {
		this._fields.outbuf.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>
		readErr: $.VarRef<$.GoError>
		enc: $.VarRef<Encoding | $.VarRef<Encoding> | null>
		r: $.VarRef<io.Reader | null>
		buf: $.VarRef<Uint8Array>
		nbuf: $.VarRef<number>
		out: $.VarRef<$.Slice<number>>
		outbuf: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{err?: $.GoError, readErr?: $.GoError, enc?: Encoding | $.VarRef<Encoding> | null, r?: io.Reader | null, buf?: Uint8Array, nbuf?: number, out?: $.Slice<number>, outbuf?: Uint8Array}>) {
		this._fields = {
			err: $.varRef(init?.err ?? null),
			readErr: $.varRef(init?.readErr ?? null),
			enc: $.varRef(init?.enc ?? null),
			r: $.varRef(init?.r ?? null),
			buf: $.varRef(init?.buf !== undefined ? $.cloneArrayValue(init.buf) : new Uint8Array(1024)),
			nbuf: $.varRef(init?.nbuf ?? 0),
			out: $.varRef(init?.out ?? null),
			outbuf: $.varRef(init?.outbuf !== undefined ? $.cloneArrayValue(init.outbuf) : new Uint8Array(768))
		}
	}

	public clone(): decoder {
		const cloned = new decoder()
		cloned._fields = {
			err: $.varRef(this._fields.err.value),
			readErr: $.varRef(this._fields.readErr.value),
			enc: $.varRef(this._fields.enc.value),
			r: $.varRef(this._fields.r.value),
			buf: $.varRef($.cloneArrayValue(this._fields.buf.value)),
			nbuf: $.varRef(this._fields.nbuf.value),
			out: $.varRef(this._fields.out.value),
			outbuf: $.varRef($.cloneArrayValue(this._fields.outbuf.value))
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let d: decoder | $.VarRef<decoder> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		// Use leftover decoded output from last read.
		if ($.len($.pointerValue<decoder>(d).out) > 0) {
			n = $.copy(p, $.pointerValue<decoder>(d).out)
			$.pointerValue<decoder>(d).out = $.goSlice($.pointerValue<decoder>(d).out, n, undefined)
			return [n, null]
		}

		if ($.pointerValue<decoder>(d).err != null) {
			return [0, $.pointerValue<decoder>(d).err]
		}

		// This code assumes that d.r strips supported whitespace ('\r' and '\n').

		// Refill buffer.
		while (($.pointerValue<decoder>(d).nbuf < 4) && ($.pointerValue<decoder>(d).readErr == null)) {
			let nn = (Math.trunc($.len(p) / 3)) * 4
			if (nn < 4) {
				nn = 4
			}
			if (nn > $.len($.pointerValue<decoder>(d).buf)) {
				nn = $.len($.pointerValue<decoder>(d).buf)
			}
			let __goscriptTuple9: any = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<decoder>(d).r).Read($.goSlice($.pointerValue<decoder>(d).buf, $.pointerValue<decoder>(d).nbuf, nn))
			nn = __goscriptTuple9[0]
			$.pointerValue<decoder>(d).readErr = __goscriptTuple9[1]
			$.pointerValue<decoder>(d).nbuf = $.pointerValue<decoder>(d).nbuf + (nn)
		}

		if ($.pointerValue<decoder>(d).nbuf < 4) {
			if (($.int($.pointerValue<Encoding>($.pointerValue<decoder>(d).enc).padChar, 32) == $.int(-1, 32)) && ($.pointerValue<decoder>(d).nbuf > 0)) {
				// Decode final fragment, without padding.
				let nw: number = 0
				let __goscriptTuple10: any = Encoding.prototype.Decode.call($.pointerValue<decoder>(d).enc, $.goSlice($.pointerValue<decoder>(d).outbuf, undefined, undefined), $.goSlice($.pointerValue<decoder>(d).buf, undefined, $.pointerValue<decoder>(d).nbuf))
				nw = __goscriptTuple10[0]
				$.pointerValue<decoder>(d).err = __goscriptTuple10[1]
				$.pointerValue<decoder>(d).nbuf = 0
				$.pointerValue<decoder>(d).out = $.goSlice($.pointerValue<decoder>(d).outbuf, undefined, nw)
				n = $.copy(p, $.pointerValue<decoder>(d).out)
				$.pointerValue<decoder>(d).out = $.goSlice($.pointerValue<decoder>(d).out, n, undefined)
				if ((n > 0) || (($.len(p) == 0) && ($.len($.pointerValue<decoder>(d).out) > 0))) {
					return [n, null]
				}
				if ($.pointerValue<decoder>(d).err != null) {
					return [0, $.pointerValue<decoder>(d).err]
				}
			}
			$.pointerValue<decoder>(d).err = $.pointerValue<decoder>(d).readErr
			if (($.comparableEqual($.pointerValue<decoder>(d).err, io.EOF)) && ($.pointerValue<decoder>(d).nbuf > 0)) {
				$.pointerValue<decoder>(d).err = io.ErrUnexpectedEOF
			}
			return [0, $.pointerValue<decoder>(d).err]
		}

		// Decode chunk into p, or d.out and then p if p is too small.
		let nr = (Math.trunc($.pointerValue<decoder>(d).nbuf / 4)) * 4
		let nw = (Math.trunc($.pointerValue<decoder>(d).nbuf / 4)) * 3
		if (nw > $.len(p)) {
			let __goscriptTuple11: any = Encoding.prototype.Decode.call($.pointerValue<decoder>(d).enc, $.goSlice($.pointerValue<decoder>(d).outbuf, undefined, undefined), $.goSlice($.pointerValue<decoder>(d).buf, undefined, nr))
			nw = __goscriptTuple11[0]
			$.pointerValue<decoder>(d).err = __goscriptTuple11[1]
			$.pointerValue<decoder>(d).out = $.goSlice($.pointerValue<decoder>(d).outbuf, undefined, nw)
			n = $.copy(p, $.pointerValue<decoder>(d).out)
			$.pointerValue<decoder>(d).out = $.goSlice($.pointerValue<decoder>(d).out, n, undefined)
		} else {
			let __goscriptTuple12: any = Encoding.prototype.Decode.call($.pointerValue<decoder>(d).enc, p, $.goSlice($.pointerValue<decoder>(d).buf, undefined, nr))
			n = __goscriptTuple12[0]
			$.pointerValue<decoder>(d).err = __goscriptTuple12[1]
		}
		$.pointerValue<decoder>(d).nbuf = $.pointerValue<decoder>(d).nbuf - (nr)
		$.copy($.goSlice($.pointerValue<decoder>(d).buf, undefined, $.pointerValue<decoder>(d).nbuf), $.goSlice($.pointerValue<decoder>(d).buf, nr, undefined))
		return [n, $.pointerValue<decoder>(d).err]
	}

	static __typeInfo = $.registerStructType(
		"base64.decoder",
		() => new decoder(),
		[{ name: "Read", args: [], returns: [] }],
		decoder,
		{"err": "error", "readErr": "error", "enc": { kind: $.TypeKind.Pointer, elemType: "base64.Encoding" }, "r": "io.Reader", "buf": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 1024 }, "nbuf": { kind: $.TypeKind.Basic, name: "int" }, "out": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "outbuf": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 768 }}
	)
}

export class newlineFilteringReader {
	public get wrapped(): io.Reader | null {
		return this._fields.wrapped.value
	}
	public set wrapped(value: io.Reader | null) {
		this._fields.wrapped.value = value
	}

	public _fields: {
		wrapped: $.VarRef<io.Reader | null>
	}

	constructor(init?: Partial<{wrapped?: io.Reader | null}>) {
		this._fields = {
			wrapped: $.varRef(init?.wrapped ?? null)
		}
	}

	public clone(): newlineFilteringReader {
		const cloned = new newlineFilteringReader()
		cloned._fields = {
			wrapped: $.varRef(this._fields.wrapped.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: newlineFilteringReader | $.VarRef<newlineFilteringReader> | null = this
		let [n, err] = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<newlineFilteringReader>(r).wrapped).Read(p)
		while (n > 0) {
			let offset = 0
			for (let __goscriptRangeTarget0 = $.goSlice(p, undefined, n), i = 0; i < $.len(__goscriptRangeTarget0); i++) {
				let b = __goscriptRangeTarget0![i]
				if (($.uint(b, 8) != $.uint(13, 8)) && ($.uint(b, 8) != $.uint(10, 8))) {
					if (i != offset) {
						p![offset] = $.uint(b, 8)
					}
					offset++
				}
			}
			if (offset > 0) {
				return [offset, err]
			}
			// Previous buffer entirely whitespace, read again
			let __goscriptTuple13: any = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<newlineFilteringReader>(r).wrapped).Read(p)
			n = __goscriptTuple13[0]
			err = __goscriptTuple13[1]
		}
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"base64.newlineFilteringReader",
		() => new newlineFilteringReader(),
		[{ name: "Read", args: [], returns: [] }],
		newlineFilteringReader,
		{"wrapped": "io.Reader"}
	)
}

export const StdPadding: number = 61

export const NoPadding: number = -1

export const decodeMapInitialize: string = $.bytesToString(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]))

export const invalidIndex: number = 255

export function NewEncoding(encoder: string): Encoding | $.VarRef<Encoding> | null {
	if ($.len(encoder) != 64) {
		$.panic("encoding alphabet is not 64-bytes long")
	}

	let e: Encoding | $.VarRef<Encoding> | null = new Encoding()
	$.pointerValue<Encoding>(e).padChar = $.int(61, 32)
	$.copy($.goSlice($.pointerValue<Encoding>(e).encode, undefined, undefined), encoder)
	$.copy($.goSlice($.pointerValue<Encoding>(e).decodeMap, undefined, undefined), $.bytesToString(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])))

	for (let i = 0; i < $.len(encoder); i++) {
		// Note: While we document that the alphabet cannot contain
		// the padding character, we do not enforce it since we do not know
		// if the caller intends to switch the padding from StdPadding later.
		switch (true) {
			case ($.uint($.indexStringOrBytes(encoder, i), 8) == $.uint(10, 8)) || ($.uint($.indexStringOrBytes(encoder, i), 8) == $.uint(13, 8)):
			{
				$.panic("encoding alphabet contains newline character")
				break
			}
			case $.uint($.pointerValue<Encoding>(e).decodeMap[$.indexStringOrBytes(encoder, i)], 8) != $.uint(255, 8):
			{
				$.panic("encoding alphabet includes duplicate symbols")
				break
			}
		}
		$.pointerValue<Encoding>(e).decodeMap[$.indexStringOrBytes(encoder, i)] = $.uint($.uint(i, 8), 8)
	}
	return e
}

export let StdEncoding: Encoding | $.VarRef<Encoding> | null = NewEncoding("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")

export function __goscript_set_StdEncoding(__goscriptValue: Encoding | $.VarRef<Encoding> | null): void {
	StdEncoding = __goscriptValue
}

export let URLEncoding: Encoding | $.VarRef<Encoding> | null = NewEncoding("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_")

export function __goscript_set_URLEncoding(__goscriptValue: Encoding | $.VarRef<Encoding> | null): void {
	URLEncoding = __goscriptValue
}

export let RawStdEncoding: Encoding | $.VarRef<Encoding> | null = $.markAsStructValue($.cloneStructValue($.pointerValue<Encoding>(StdEncoding))).WithPadding($.int(-1, 32))

export function __goscript_set_RawStdEncoding(__goscriptValue: Encoding | $.VarRef<Encoding> | null): void {
	RawStdEncoding = __goscriptValue
}

export let RawURLEncoding: Encoding | $.VarRef<Encoding> | null = $.markAsStructValue($.cloneStructValue($.pointerValue<Encoding>(URLEncoding))).WithPadding($.int(-1, 32))

export function __goscript_set_RawURLEncoding(__goscriptValue: Encoding | $.VarRef<Encoding> | null): void {
	RawURLEncoding = __goscriptValue
}

export function NewEncoder(enc: Encoding | $.VarRef<Encoding> | null, w: io.Writer | null): io.WriteCloser | null {
	return $.interfaceValue<io.WriteCloser | null>(new encoder({enc: enc, w: w}), "*base64.encoder")
}

export function CorruptInputError_Error(e: CorruptInputError): string {
	return "illegal base64 data at input byte " + strconv.FormatInt($.int($.int(e)), 10)
}

export function assemble32(n1: number, n2: number, n3: number, n4: number): [number, boolean] {
	let dn: number = 0
	let ok: boolean = false
	// Check that all the digits are valid. If any of them was 0xff, their
	// bitwise OR will be 0xff.
	if ($.uint((((n1 | n2) | n3) | n4), 8) == $.uint(0xff, 8)) {
		return [$.uint(0, 32), false]
	}
	return [$.uint(((($.uint(n1, 32) << 26) | ($.uint(n2, 32) << 20)) | ($.uint(n3, 32) << 14)) | ($.uint(n4, 32) << 8), 32), true]
}

export function assemble64(n1: number, n2: number, n3: number, n4: number, n5: number, n6: number, n7: number, n8: number): [number, boolean] {
	let dn: number = 0
	let ok: boolean = false
	// Check that all the digits are valid. If any of them was 0xff, their
	// bitwise OR will be 0xff.
	if ($.uint((((((((n1 | n2) | n3) | n4) | n5) | n6) | n7) | n8), 8) == $.uint(0xff, 8)) {
		return [$.uint(0, 64), false]
	}
	return [$.uint($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Mul($.uint(n1, 64), (2 ** 58))), ($.uint64Mul($.uint(n2, 64), (2 ** 52))))), ($.uint64Mul($.uint(n3, 64), (2 ** 46))))), ($.uint64Mul($.uint(n4, 64), (2 ** 40))))), ($.uint64Mul($.uint(n5, 64), (2 ** 34))))), ($.uint64Shl($.uint(n6, 64), 28)))), ($.uint64Shl($.uint(n7, 64), 22)))), ($.uint64Shl($.uint(n8, 64), 16))), 64), true]
}

export function NewDecoder(enc: Encoding | $.VarRef<Encoding> | null, r: io.Reader | null): io.Reader | null {
	return $.interfaceValue<io.Reader | null>(new decoder({enc: enc, r: $.interfaceValue<io.Reader | null>(new newlineFilteringReader({wrapped: r}), "*base64.newlineFilteringReader")}), "*base64.decoder")
}

export function decodedLen(n: number, padChar: number): number {
	if ($.int(padChar, 32) == $.int(-1, 32)) {
		// Unpadded data may end with partial block of 2-3 characters.
		return ((Math.trunc(n / 4)) * 3) + (Math.trunc(((n % 4) * 6) / 8))
	}
	// Padded base64 should always be a multiple of 4 characters in length.
	return (Math.trunc(n / 4)) * 3
}
