import * as $ from "@goscript/builtin/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as io from "@goscript/io/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

// Standard padding character
export let StdPadding: number = 61

// No padding
export let NoPadding: number = -1

export let decodeMapInitialize: string = "" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff" + "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"

export let invalidIndex: number = 255

export type CorruptInputError = number;

export function CorruptInputError_Error(e: CorruptInputError): string {
	return "illegal base64 data at input byte " + strconv.FormatInt(e, 10)
}


export class Encoding {
	// mapping of symbol index to symbol byte value
	public get encode(): number[] {
		return this._fields.encode.value
	}
	public set encode(value: number[]) {
		this._fields.encode.value = value
	}

	// mapping of symbol byte value to symbol index
	public get decodeMap(): number[] {
		return this._fields.decodeMap.value
	}
	public set decodeMap(value: number[]) {
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
		encode: $.VarRef<number[]>;
		decodeMap: $.VarRef<number[]>;
		padChar: $.VarRef<number>;
		strict: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{decodeMap?: number[], encode?: number[], padChar?: number, strict?: boolean}>) {
		this._fields = {
			encode: $.varRef(init?.encode ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
			decodeMap: $.varRef(init?.decodeMap ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
			padChar: $.varRef(init?.padChar ?? 0),
			strict: $.varRef(init?.strict ?? false)
		}
	}

	public clone(): Encoding {
		const cloned = new Encoding()
		cloned._fields = {
			encode: $.varRef(this._fields.encode.value),
			decodeMap: $.varRef(this._fields.decodeMap.value),
			padChar: $.varRef(this._fields.padChar.value),
			strict: $.varRef(this._fields.strict.value)
		}
		return cloned
	}

	// WithPadding creates a new encoding identical to enc except
	// with a specified padding character, or [NoPadding] to disable padding.
	// The padding character must not be '\r' or '\n',
	// must not be contained in the encoding's alphabet,
	// must not be negative, and must be a rune equal or below '\xff'.
	// Padding characters above '\x7f' are encoded as their exact byte value
	// rather than using the UTF-8 representation of the codepoint.
	public WithPadding(padding: number): Encoding | null {
		const enc = this
		switch (true) {
			case padding < -1 || padding == 13 || padding == 10 || padding > 0xff: {
				$.panic("invalid padding")
				break
			}
			case padding != -1 && enc.decodeMap![$.byte(padding)] != 255: {
				$.panic("padding contained in alphabet")
				break
			}
		}
		enc.padChar = padding
		return enc
	}

	// Strict creates a new encoding identical to enc except with
	// strict decoding enabled. In this mode, the decoder requires that
	// trailing padding bits are zero, as described in RFC 4648 section 3.5.
	//
	// Note that the input is still malleable, as new line characters
	// (CR and LF) are still ignored.
	public Strict(): Encoding | null {
		const enc = this
		enc.strict = true
		return enc
	}

	// Encode encodes src using the encoding enc,
	// writing [Encoding.EncodedLen](len(src)) bytes to dst.
	//
	// The encoding pads the output to a multiple of 4 bytes,
	// so Encode is not appropriate for use on individual blocks
	// of a large data stream. Use [NewEncoder] instead.
	public Encode(dst: $.Bytes, src: $.Bytes): void {
		const enc = this
		if ($.len(src) == 0) {
			return 
		}
		/* _ = */ enc.encode
		let [di, si] = [0, 0]
		let n = (Math.trunc($.len(src) / 3)) * 3
		for (; si < n; ) {
			// Convert 3x 8bit source bytes into 4 bytes
			let val = ((((src![si + 0] as number) << 16) | ((src![si + 1] as number) << 8)) | (src![si + 2] as number))

			dst![di + 0] = enc.encode![((val >> 18) & 0x3F)]
			dst![di + 1] = enc.encode![((val >> 12) & 0x3F)]
			dst![di + 2] = enc.encode![((val >> 6) & 0x3F)]
			dst![di + 3] = enc.encode![(val & 0x3F)]

			si += 3
			di += 4
		}
		let remain = $.len(src) - si
		if (remain == 0) {
			return 
		}
		let val = ((src![si + 0] as number) << 16)
		if (remain == 2) {
			val |= ((src![si + 1] as number) << 8)
		}
		dst![di + 0] = enc.encode![((val >> 18) & 0x3F)]
		dst![di + 1] = enc.encode![((val >> 12) & 0x3F)]
		switch (remain) {
			case 2: {
				dst![di + 2] = enc.encode![((val >> 6) & 0x3F)]
				if (Number(enc.padChar) != -1) {
					dst![di + 3] = $.byte(enc.padChar)
				}
				break
			}
			case 1: {
				if (Number(enc.padChar) != -1) {
					dst![di + 2] = $.byte(enc.padChar)
					dst![di + 3] = $.byte(enc.padChar)
				}
				break
			}
		}
	}

	// AppendEncode appends the base64 encoded src to dst
	// and returns the extended buffer.
	public AppendEncode(dst: $.Bytes, src: $.Bytes): $.Bytes {
		const enc = this
		let n = enc.EncodedLen($.len(src))
		dst = slices.Grow(dst, n)
		enc.Encode($.goSlice($.goSlice(dst, $.len(dst), undefined), undefined, n), src)
		return $.goSlice(dst, undefined, $.len(dst) + n)
	}

	// EncodeToString returns the base64 encoding of src.
	public EncodeToString(src: $.Bytes): string {
		const enc = this
		let buf = new Uint8Array(enc.EncodedLen($.len(src)))
		enc.Encode(buf, src)
		return $.bytesToString(buf)
	}

	// EncodedLen returns the length in bytes of the base64 encoding
	// of an input buffer of length n.
	public EncodedLen(n: number): number {
		const enc = this
		if (Number(enc.padChar) == -1) {
			return Math.trunc(n / 3) * 4 + Math.trunc((n % 3 * 8 + 5) / 6)
		}
		return Math.trunc((n + 2) / 3) * 4
	}

	// decodeQuantum decodes up to 4 base64 bytes. The received parameters are
	// the destination buffer dst, the source buffer src and an index in the
	// source buffer si.
	// It returns the number of bytes read from src, the number of bytes written
	// to dst, and an error, if any.
	public decodeQuantum(dst: $.Bytes, src: $.Bytes, si: number): [number, number, $.GoError] {
		const enc = this
		let nsi: number = 0
		let n: number = 0
		let err: $.GoError = null
		let dbuf: number[] = [0, 0, 0, 0]
		let dlen = 4
		/* _ = */ enc.decodeMap
		for (let j = 0; j < $.len(dbuf); j++) {
			if ($.len(src) == si) {
				switch (true) {
					case j == 0: {
						return [si, 0, null]
						break
					}
					case j == 1:
					case Number(enc.padChar) != -1: {
						return [si, 0, $.wrapPrimitiveError((si - j as CorruptInputError), CorruptInputError_Error)]
						break
					}
				}
				dlen = j
				break
			}
			let _in = src![si]
			si++

			let out = enc.decodeMap![_in]
			if (out != 0xff) {
				dbuf![j] = out
				continue
			}

			if (_in == 10 || _in == 13) {
				j--
				continue
			}

			if ((_in as number) != enc.padChar) {
				return [si, 0, $.wrapPrimitiveError((si - 1 as CorruptInputError), CorruptInputError_Error)]
			}

			// We've reached the end and there's padding

			// incorrect padding

			// "==" is expected, the first "=" is already consumed.
			// skip over newlines

			// not enough padding

			// incorrect padding
			switch (j) {
				case 0:
				case 1: {
					return [si, 0, $.wrapPrimitiveError((si - 1 as CorruptInputError), CorruptInputError_Error)]
					break
				}
				case 2: {
					for (; si < $.len(src) && (src![si] == 10 || src![si] == 13); ) {
						si++
					}
					if (si == $.len(src)) {
						// not enough padding
						return [si, 0, $.wrapPrimitiveError(($.len(src) as CorruptInputError), CorruptInputError_Error)]
					}
					if ((src![si] as number) != enc.padChar) {
						// incorrect padding
						return [si, 0, $.wrapPrimitiveError((si - 1 as CorruptInputError), CorruptInputError_Error)]
					}
					si++
					break
				}
			}

			// skip over newlines
			for (; si < $.len(src) && (src![si] == 10 || src![si] == 13); ) {
				si++
			}

			// trailing garbage
			if (si < $.len(src)) {
				// trailing garbage
				err = $.wrapPrimitiveError((si as CorruptInputError), CorruptInputError_Error)
			}
			dlen = j
			break
		}
		let val = (((((dbuf![0] as number) << 18) | ((dbuf![1] as number) << 12)) | ((dbuf![2] as number) << 6)) | (dbuf![3] as number))
		;[dbuf![2], dbuf![1], dbuf![0]] = [$.byte((val >> 0)), $.byte((val >> 8)), $.byte((val >> 16))]
		switch (dlen) {
			case 4: {
				dst![2] = dbuf![2]
				dbuf![2] = 0
				// fallthrough // fallthrough statement skipped
				break
			}
			case 3: {
				dst![1] = dbuf![1]
				if (enc.strict && dbuf![2] != 0) {
					return [si, 0, $.wrapPrimitiveError((si - 1 as CorruptInputError), CorruptInputError_Error)]
				}
				dbuf![1] = 0
				// fallthrough // fallthrough statement skipped
				break
			}
			case 2: {
				dst![0] = dbuf![0]
				if (enc.strict && (dbuf![1] != 0 || dbuf![2] != 0)) {
					return [si, 0, $.wrapPrimitiveError((si - 2 as CorruptInputError), CorruptInputError_Error)]
				}
				break
			}
		}
		return [si, dlen - 1, err]
	}

	// AppendDecode appends the base64 decoded src to dst
	// and returns the extended buffer.
	// If the input is malformed, it returns the partially decoded src and an error.
	// New line characters (\r and \n) are ignored.
	public AppendDecode(dst: $.Bytes, src: $.Bytes): [$.Bytes, $.GoError] {
		const enc = this
		let n = $.len(src)
		for (; n > 0 && (src![n - 1] as number) == enc.padChar; ) {
			n--
		}
		n = decodedLen(n, -1)
		dst = slices.Grow(dst, n)
		let err: $.GoError
		[n, err] = enc.Decode($.goSlice($.goSlice(dst, $.len(dst), undefined), undefined, n), src)
		return [$.goSlice(dst, undefined, $.len(dst) + n), err]
	}

	// DecodeString returns the bytes represented by the base64 string s.
	// If the input is malformed, it returns the partially decoded data and
	// [CorruptInputError]. New line characters (\r and \n) are ignored.
	public DecodeString(s: string): [$.Bytes, $.GoError] {
		const enc = this
		let dbuf = new Uint8Array(enc.DecodedLen($.len(s)))
		let [n, err] = enc.Decode(dbuf, $.stringToBytes(s))
		return [$.goSlice(dbuf, undefined, n), err]
	}

	// Decode decodes src using the encoding enc. It writes at most
	// [Encoding.DecodedLen](len(src)) bytes to dst and returns the number of bytes
	// written. The caller must ensure that dst is large enough to hold all
	// the decoded data. If src contains invalid base64 data, it will return the
	// number of bytes successfully written and [CorruptInputError].
	// New line characters (\r and \n) are ignored.
	public Decode(dst: $.Bytes, src: $.Bytes): [number, $.GoError] {
		const enc = this
		let n: number = 0
		let err: $.GoError = null
		if ($.len(src) == 0) {
			return [0, null]
		}
		/* _ = */ enc.decodeMap
		let si = 0
		for (; strconv.IntSize >= 64 && $.len(src) - si >= 8 && $.len(dst) - n >= 8; ) {
			let src2 = $.goSlice(src, si, si + 8)
			{
				let [dn, ok] = assemble64(enc.decodeMap![src2![0]], enc.decodeMap![src2![1]], enc.decodeMap![src2![2]], enc.decodeMap![src2![3]], enc.decodeMap![src2![4]], enc.decodeMap![src2![5]], enc.decodeMap![src2![6]], enc.decodeMap![src2![7]])
				if (ok) {
					byteorder.BEPutUint64($.goSlice(dst, n, undefined), dn)
					n += 6
					si += 8
				} else {
					let ninc: number = 0
					;[si, ninc, err] = enc.decodeQuantum($.goSlice(dst, n, undefined), src, si)
					n += ninc
					if (err != null) {
						return [n, err]
					}
				}
			}
		}
		for (; $.len(src) - si >= 4 && $.len(dst) - n >= 4; ) {
			let src2 = $.goSlice(src, si, si + 4)
			{
				let [dn, ok] = assemble32(enc.decodeMap![src2![0]], enc.decodeMap![src2![1]], enc.decodeMap![src2![2]], enc.decodeMap![src2![3]])
				if (ok) {
					byteorder.BEPutUint32($.goSlice(dst, n, undefined), dn)
					n += 3
					si += 4
				} else {
					let ninc: number = 0
					;[si, ninc, err] = enc.decodeQuantum($.goSlice(dst, n, undefined), src, si)
					n += ninc
					if (err != null) {
						return [n, err]
					}
				}
			}
		}
		for (; si < $.len(src); ) {
			let ninc: number = 0
			;[si, ninc, err] = enc.decodeQuantum($.goSlice(dst, n, undefined), src, si)
			n += ninc
			if (err != null) {
				return [n, err]
			}
		}
		return [n, err]
	}

	// DecodedLen returns the maximum length in bytes of the decoded data
	// corresponding to n bytes of base64-encoded data.
	public DecodedLen(n: number): number {
		const enc = this
		return decodedLen(n, enc.padChar)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/base64.Encoding',
	  new Encoding(),
	  [{ name: "WithPadding", args: [{ name: "padding", type: { kind: $.TypeKind.Basic, name: "rune" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Encoding" } }] }, { name: "Strict", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Encoding" } }] }, { name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [] }, { name: "AppendEncode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }] }, { name: "EncodeToString", args: [{ name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "EncodedLen", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "decodeQuantum", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "si", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "AppendDecode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "DecodeString", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Decode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "DecodedLen", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
	  Encoding,
	  {"encode": { kind: $.TypeKind.Array, length: 64, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "decodeMap": { kind: $.TypeKind.Array, length: 256, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "padChar": { kind: $.TypeKind.Basic, name: "rune" }, "strict": { kind: $.TypeKind.Basic, name: "bool" }}
	);
}

export class decoder {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	// error from r.Read
	public get readErr(): $.GoError {
		return this._fields.readErr.value
	}
	public set readErr(value: $.GoError) {
		this._fields.readErr.value = value
	}

	public get enc(): Encoding | null {
		return this._fields.enc.value
	}
	public set enc(value: Encoding | null) {
		this._fields.enc.value = value
	}

	public get r(): null | io.Reader {
		return this._fields.r.value
	}
	public set r(value: null | io.Reader) {
		this._fields.r.value = value
	}

	// leftover input
	public get buf(): number[] {
		return this._fields.buf.value
	}
	public set buf(value: number[]) {
		this._fields.buf.value = value
	}

	public get nbuf(): number {
		return this._fields.nbuf.value
	}
	public set nbuf(value: number) {
		this._fields.nbuf.value = value
	}

	// leftover decoded output
	public get out(): $.Bytes {
		return this._fields.out.value
	}
	public set out(value: $.Bytes) {
		this._fields.out.value = value
	}

	public get outbuf(): number[] {
		return this._fields.outbuf.value
	}
	public set outbuf(value: number[]) {
		this._fields.outbuf.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>;
		readErr: $.VarRef<$.GoError>;
		enc: $.VarRef<Encoding | null>;
		r: $.VarRef<null | io.Reader>;
		buf: $.VarRef<number[]>;
		nbuf: $.VarRef<number>;
		out: $.VarRef<$.Bytes>;
		outbuf: $.VarRef<number[]>;
	}

	constructor(init?: Partial<{buf?: number[], enc?: Encoding | null, err?: $.GoError, nbuf?: number, out?: $.Bytes, outbuf?: number[], r?: null | io.Reader, readErr?: $.GoError}>) {
		this._fields = {
			err: $.varRef(init?.err ?? null),
			readErr: $.varRef(init?.readErr ?? null),
			enc: $.varRef(init?.enc ?? null),
			r: $.varRef(init?.r ?? null),
			buf: $.varRef(init?.buf ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
			nbuf: $.varRef(init?.nbuf ?? 0),
			out: $.varRef(init?.out ?? new Uint8Array(0)),
			outbuf: $.varRef(init?.outbuf ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
		}
	}

	public clone(): decoder {
		const cloned = new decoder()
		cloned._fields = {
			err: $.varRef(this._fields.err.value),
			readErr: $.varRef(this._fields.readErr.value),
			enc: $.varRef(this._fields.enc.value ? $.markAsStructValue(this._fields.enc.value.clone()) : null),
			r: $.varRef(this._fields.r.value),
			buf: $.varRef(this._fields.buf.value),
			nbuf: $.varRef(this._fields.nbuf.value),
			out: $.varRef(this._fields.out.value),
			outbuf: $.varRef(this._fields.outbuf.value)
		}
		return cloned
	}

	public Read(p: $.Bytes): [number, $.GoError] {
		const d = this
		let n: number = 0
		let err: $.GoError = null
		if ($.len(d.out) > 0) {
			n = $.copy(p, d.out)
			d.out = $.goSlice(d.out, n, undefined)
			return [n, null]
		}
		if (d.err != null) {
			return [0, d.err]
		}
		for (; d.nbuf < 4 && d.readErr == null; ) {
			let nn = Math.trunc($.len(p) / 3) * 4
			if (nn < 4) {
				nn = 4
			}
			if (nn > $.len(d.buf)) {
				nn = $.len(d.buf)
			}
			{
			  const _tmp = d.r!.Read($.goSlice(d.buf, d.nbuf, nn))
			  nn = _tmp[0]
			  d.readErr = _tmp[1]
			}
			d.nbuf += nn
		}
		if (d.nbuf < 4) {

			// Decode final fragment, without padding.
			if (Number(d.enc!.padChar) == -1 && d.nbuf > 0) {
				// Decode final fragment, without padding.
				let nw: number = 0
				{
				  const _tmp = d.enc!.Decode($.goSlice(d.outbuf, undefined, undefined), $.goSlice(d.buf, undefined, d.nbuf))
				  nw = _tmp[0]
				  d.err = _tmp[1]
				}
				d.nbuf = 0
				d.out = $.goSlice(d.outbuf, undefined, nw)
				n = $.copy(p, d.out)
				d.out = $.goSlice(d.out, n, undefined)
				if (n > 0 || $.len(p) == 0 && $.len(d.out) > 0) {
					return [n, null]
				}
				if (d.err != null) {
					return [0, d.err]
				}
			}
			d.err = d.readErr
			if (d.err == io.EOF && d.nbuf > 0) {
				d.err = io.ErrUnexpectedEOF
			}
			return [0, d.err]
		}
		let nr = Math.trunc(d.nbuf / 4) * 4
		let nw = Math.trunc(d.nbuf / 4) * 3
		if (nw > $.len(p)) {
			{
			  const _tmp = d.enc!.Decode($.goSlice(d.outbuf, undefined, undefined), $.goSlice(d.buf, undefined, nr))
			  nw = _tmp[0]
			  d.err = _tmp[1]
			}
			d.out = $.goSlice(d.outbuf, undefined, nw)
			n = $.copy(p, d.out)
			d.out = $.goSlice(d.out, n, undefined)
		} else {
			{
			  const _tmp = d.enc!.Decode(p, $.goSlice(d.buf, undefined, nr))
			  n = _tmp[0]
			  d.err = _tmp[1]
			}
		}
		d.nbuf -= nr
		$.copy($.goSlice(d.buf, undefined, d.nbuf), $.goSlice(d.buf, nr, undefined))
		return [n, d.err]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/base64.decoder',
	  new decoder(),
	  [{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  decoder,
	  {"err": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }, "readErr": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }, "enc": { kind: $.TypeKind.Pointer, elemType: "Encoding" }, "r": "Reader", "buf": { kind: $.TypeKind.Array, length: 1024, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "nbuf": { kind: $.TypeKind.Basic, name: "int" }, "out": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "outbuf": { kind: $.TypeKind.Array, length: 768, elemType: { kind: $.TypeKind.Basic, name: "byte" } }}
	);
}

export class encoder {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get enc(): Encoding | null {
		return this._fields.enc.value
	}
	public set enc(value: Encoding | null) {
		this._fields.enc.value = value
	}

	public get w(): null | io.Writer {
		return this._fields.w.value
	}
	public set w(value: null | io.Writer) {
		this._fields.w.value = value
	}

	// buffered data waiting to be encoded
	public get buf(): number[] {
		return this._fields.buf.value
	}
	public set buf(value: number[]) {
		this._fields.buf.value = value
	}

	// number of bytes in buf
	public get nbuf(): number {
		return this._fields.nbuf.value
	}
	public set nbuf(value: number) {
		this._fields.nbuf.value = value
	}

	// output buffer
	public get out(): number[] {
		return this._fields.out.value
	}
	public set out(value: number[]) {
		this._fields.out.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>;
		enc: $.VarRef<Encoding | null>;
		w: $.VarRef<null | io.Writer>;
		buf: $.VarRef<number[]>;
		nbuf: $.VarRef<number>;
		out: $.VarRef<number[]>;
	}

	constructor(init?: Partial<{buf?: number[], enc?: Encoding | null, err?: $.GoError, nbuf?: number, out?: number[], w?: null | io.Writer}>) {
		this._fields = {
			err: $.varRef(init?.err ?? null),
			enc: $.varRef(init?.enc ?? null),
			w: $.varRef(init?.w ?? null),
			buf: $.varRef(init?.buf ?? [0, 0, 0]),
			nbuf: $.varRef(init?.nbuf ?? 0),
			out: $.varRef(init?.out ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
		}
	}

	public clone(): encoder {
		const cloned = new encoder()
		cloned._fields = {
			err: $.varRef(this._fields.err.value),
			enc: $.varRef(this._fields.enc.value ? $.markAsStructValue(this._fields.enc.value.clone()) : null),
			w: $.varRef(this._fields.w.value),
			buf: $.varRef(this._fields.buf.value),
			nbuf: $.varRef(this._fields.nbuf.value),
			out: $.varRef(this._fields.out.value)
		}
		return cloned
	}

	public Write(p: $.Bytes): [number, $.GoError] {
		const e = this
		let n: number = 0
		let err: $.GoError = null
		if (e.err != null) {
			return [0, e.err]
		}
		if (e.nbuf > 0) {
			let i: number = 0
			for (i = 0; i < $.len(p) && e.nbuf < 3; i++) {
				e.buf![e.nbuf] = p![i]
				e.nbuf++
			}
			n += i
			p = $.goSlice(p, i, undefined)
			if (e.nbuf < 3) {
				return [n, err]
			}
			e.enc!.Encode($.goSlice(e.out, undefined, undefined), $.goSlice(e.buf, undefined, undefined))
			{
				{
				  const _tmp = e.w!.Write($.goSlice(e.out, undefined, 4))
				  e.err = _tmp[1]
				}
				if (e.err != null) {
					return [n, e.err]
				}
			}
			e.nbuf = 0
		}
		for (; $.len(p) >= 3; ) {
			let nn = Math.trunc($.len(e.out) / 4) * 3
			if (nn > $.len(p)) {
				nn = $.len(p)
				nn -= nn % 3
			}
			e.enc!.Encode($.goSlice(e.out, undefined, undefined), $.goSlice(p, undefined, nn))
			{
				{
				  const _tmp = e.w!.Write($.goSlice(e.out, 0, Math.trunc(nn / 3) * 4))
				  e.err = _tmp[1]
				}
				if (e.err != null) {
					return [n, e.err]
				}
			}
			n += nn
			p = $.goSlice(p, nn, undefined)
		}
		$.copy($.goSlice(e.buf, undefined, undefined), p)
		e.nbuf = $.len(p)
		n += $.len(p)
		return [n, err]
	}

	// Close flushes any pending output from the encoder.
	// It is an error to call Write after calling Close.
	public Close(): $.GoError {
		const e = this
		if (e.err == null && e.nbuf > 0) {
			e.enc!.Encode($.goSlice(e.out, undefined, undefined), $.goSlice(e.buf, undefined, e.nbuf))
			{
			  const _tmp = e.w!.Write($.goSlice(e.out, undefined, e.enc!.EncodedLen(e.nbuf)))
			  e.err = _tmp[1]
			}
			e.nbuf = 0
		}
		return e.err
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/base64.encoder',
	  new encoder(),
	  [{ name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Close", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  encoder,
	  {"err": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }, "enc": { kind: $.TypeKind.Pointer, elemType: "Encoding" }, "w": "Writer", "buf": { kind: $.TypeKind.Array, length: 3, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "nbuf": { kind: $.TypeKind.Basic, name: "int" }, "out": { kind: $.TypeKind.Array, length: 1024, elemType: { kind: $.TypeKind.Basic, name: "byte" } }}
	);
}

export class newlineFilteringReader {
	public get wrapped(): null | io.Reader {
		return this._fields.wrapped.value
	}
	public set wrapped(value: null | io.Reader) {
		this._fields.wrapped.value = value
	}

	public _fields: {
		wrapped: $.VarRef<null | io.Reader>;
	}

	constructor(init?: Partial<{wrapped?: null | io.Reader}>) {
		this._fields = {
			wrapped: $.varRef(init?.wrapped ?? null)
		}
	}

	public clone(): newlineFilteringReader {
		const cloned = new newlineFilteringReader()
		cloned._fields = {
			wrapped: $.varRef(this._fields.wrapped.value)
		}
		return cloned
	}

	public Read(p: $.Bytes): [number, $.GoError] {
		const r = this
		let [n, err] = r.wrapped!.Read(p)
		for (; n > 0; ) {
			let offset = 0
			for (let i = 0; i < $.len($.goSlice(p, undefined, n)); i++) {
				let b = $.goSlice(p, undefined, n)![i]
				{
					if (b != 13 && b != 10) {
						if (i != offset) {
							p![offset] = b
						}
						offset++
					}
				}
			}
			if (offset > 0) {
				return [offset, err]
			}
			// Previous buffer entirely whitespace, read again
			;[n, err] = r.wrapped!.Read(p)
		}
		return [n, err]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/base64.newlineFilteringReader',
	  new newlineFilteringReader(),
	  [{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  newlineFilteringReader,
	  {"wrapped": "Reader"}
	);
}

export let StdEncoding: Encoding | null = NewEncoding("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")

export let URLEncoding: Encoding | null = NewEncoding("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_")

export let RawStdEncoding: Encoding | null = StdEncoding!.WithPadding(-1)

export let RawURLEncoding: Encoding | null = URLEncoding!.WithPadding(-1)

// NewEncoding returns a new padded Encoding defined by the given alphabet,
// which must be a 64-byte string that contains unique byte values and
// does not contain the padding character or CR / LF ('\r', '\n').
// The alphabet is treated as a sequence of byte values
// without any special treatment for multi-byte UTF-8.
// The resulting Encoding uses the default padding character ('='),
// which may be changed or disabled via [Encoding.WithPadding].
export function NewEncoding(encoder: string): Encoding | null {
	if ($.len(encoder) != 64) {
		$.panic("encoding alphabet is not 64-bytes long")
	}

	let e = new Encoding()
	e!.padChar = 61
	$.copy($.goSlice(e!.encode, undefined, undefined), encoder)
	$.copy($.goSlice(e!.decodeMap, undefined, undefined), "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff")

	// Note: While we document that the alphabet cannot contain
	// the padding character, we do not enforce it since we do not know
	// if the caller intends to switch the padding from StdPadding later.
	for (let i = 0; i < $.len(encoder); i++) {
		// Note: While we document that the alphabet cannot contain
		// the padding character, we do not enforce it since we do not know
		// if the caller intends to switch the padding from StdPadding later.
		switch (true) {
			case $.indexString(encoder, i) == 10 || $.indexString(encoder, i) == 13: {
				$.panic("encoding alphabet contains newline character")
				break
			}
			case e!.decodeMap![$.indexString(encoder, i)] != 255: {
				$.panic("encoding alphabet includes duplicate symbols")
				break
			}
		}
		e!.decodeMap![$.indexString(encoder, i)] = (i as number)
	}
	return e
}

// NewEncoder returns a new base64 stream encoder. Data written to
// the returned writer will be encoded using enc and then written to w.
// Base64 encodings operate in 4-byte blocks; when finished
// writing, the caller must Close the returned encoder to flush any
// partially written blocks.
export function NewEncoder(enc: Encoding | null, w: null | io.Writer): null | io.WriteCloser {
	return new encoder({enc: enc, w: w})
}

// assemble32 assembles 4 base64 digits into 3 bytes.
// Each digit comes from the decode map, and will be 0xff
// if it came from an invalid character.
export function assemble32(n1: number, n2: number, n3: number, n4: number): [number, boolean] {
	let dn: number = 0
	let ok: boolean = false
	{
		// Check that all the digits are valid. If any of them was 0xff, their
		// bitwise OR will be 0xff.
		if ((((n1 | n2) | n3) | n4) == 0xff) {
			return [0, false]
		}
		return [(((((n1 as number) << 26) | ((n2 as number) << 20)) | ((n3 as number) << 14)) | ((n4 as number) << 8)), true]
	}
}

// assemble64 assembles 8 base64 digits into 6 bytes.
// Each digit comes from the decode map, and will be 0xff
// if it came from an invalid character.
export function assemble64(n1: number, n2: number, n3: number, n4: number, n5: number, n6: number, n7: number, n8: number): [number, boolean] {
	let dn: number = 0
	let ok: boolean = false
	{
		// Check that all the digits are valid. If any of them was 0xff, their
		// bitwise OR will be 0xff.
		if ((((((((n1 | n2) | n3) | n4) | n5) | n6) | n7) | n8) == 0xff) {
			return [0, false]
		}
		return [(((((((((n1 as number) << 58) | ((n2 as number) << 52)) | ((n3 as number) << 46)) | ((n4 as number) << 40)) | ((n5 as number) << 34)) | ((n6 as number) << 28)) | ((n7 as number) << 22)) | ((n8 as number) << 16)), true]
	}
}

// NewDecoder constructs a new base64 stream decoder.
export function NewDecoder(enc: Encoding | null, r: null | io.Reader): null | io.Reader {
	return new decoder({enc: enc, r: new newlineFilteringReader({wrapped: r})})
}

export function decodedLen(n: number, padChar: number): number {

	// Unpadded data may end with partial block of 2-3 characters.
	if (padChar == -1) {
		// Unpadded data may end with partial block of 2-3 characters.
		return Math.trunc(n / 4) * 3 + Math.trunc(n % 4 * 6 / 8)
	}
	// Padded base64 should always be a multiple of 4 characters in length.
	return Math.trunc(n / 4) * 3
}

