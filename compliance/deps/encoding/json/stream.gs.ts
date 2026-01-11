import * as $ from "@goscript/builtin/index.js"
import { newEncodeState } from "./encode.gs.js";
import { appendIndent } from "./indent.gs.js";
import { isSpace, quoteChar, stateEndValue } from "./scanner.gs.js";
import { Unmarshaler, decodeState } from "./decode.gs.js";
import { Marshaler, encOpts } from "./encode.gs.js";
import { SyntaxError, scanner } from "./scanner.gs.js";
import { encodeStatePool } from "./encode.gs.js";
import { scanEnd, scanEndArray, scanEndObject, scanError } from "./scanner.gs.js";

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

export let tokenTopValue: number = 0

export let tokenArrayStart: number = 0

export let tokenArrayValue: number = 0

export let tokenArrayComma: number = 0

export let tokenObjectStart: number = 0

export let tokenObjectKey: number = 0

export let tokenObjectColon: number = 0

export let tokenObjectValue: number = 0

export let tokenObjectComma: number = 0

export class Decoder {
	public get r(): null | io.Reader {
		return this._fields.r.value
	}
	public set r(value: null | io.Reader) {
		this._fields.r.value = value
	}

	public get buf(): $.Bytes {
		return this._fields.buf.value
	}
	public set buf(value: $.Bytes) {
		this._fields.buf.value = value
	}

	public get d(): decodeState {
		return this._fields.d.value
	}
	public set d(value: decodeState) {
		this._fields.d.value = value
	}

	// start of unread data in buf
	public get scanp(): number {
		return this._fields.scanp.value
	}
	public set scanp(value: number) {
		this._fields.scanp.value = value
	}

	// amount of data already scanned
	public get scanned(): number {
		return this._fields.scanned.value
	}
	public set scanned(value: number) {
		this._fields.scanned.value = value
	}

	public get scan(): scanner {
		return this._fields.scan.value
	}
	public set scan(value: scanner) {
		this._fields.scan.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get tokenState(): number {
		return this._fields.tokenState.value
	}
	public set tokenState(value: number) {
		this._fields.tokenState.value = value
	}

	public get tokenStack(): $.Slice<number> {
		return this._fields.tokenStack.value
	}
	public set tokenStack(value: $.Slice<number>) {
		this._fields.tokenStack.value = value
	}

	public _fields: {
		r: $.VarRef<null | io.Reader>;
		buf: $.VarRef<$.Bytes>;
		d: $.VarRef<decodeState>;
		scanp: $.VarRef<number>;
		scanned: $.VarRef<number>;
		scan: $.VarRef<scanner>;
		err: $.VarRef<$.GoError>;
		tokenState: $.VarRef<number>;
		tokenStack: $.VarRef<$.Slice<number>>;
	}

	constructor(init?: Partial<{buf?: $.Bytes, d?: decodeState, err?: $.GoError, r?: null | io.Reader, scan?: scanner, scanned?: number, scanp?: number, tokenStack?: $.Slice<number>, tokenState?: number}>) {
		this._fields = {
			r: $.varRef(init?.r ?? null),
			buf: $.varRef(init?.buf ?? new Uint8Array(0)),
			d: $.varRef(init?.d ? $.markAsStructValue(init.d.clone()) : new decodeState()),
			scanp: $.varRef(init?.scanp ?? 0),
			scanned: $.varRef(init?.scanned ?? 0),
			scan: $.varRef(init?.scan ? $.markAsStructValue(init.scan.clone()) : new scanner()),
			err: $.varRef(init?.err ?? null),
			tokenState: $.varRef(init?.tokenState ?? 0),
			tokenStack: $.varRef(init?.tokenStack ?? null)
		}
	}

	public clone(): Decoder {
		const cloned = new Decoder()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			buf: $.varRef(this._fields.buf.value),
			d: $.varRef($.markAsStructValue(this._fields.d.value.clone())),
			scanp: $.varRef(this._fields.scanp.value),
			scanned: $.varRef(this._fields.scanned.value),
			scan: $.varRef($.markAsStructValue(this._fields.scan.value.clone())),
			err: $.varRef(this._fields.err.value),
			tokenState: $.varRef(this._fields.tokenState.value),
			tokenStack: $.varRef(this._fields.tokenStack.value)
		}
		return cloned
	}

	// UseNumber causes the Decoder to unmarshal a number into an
	// interface value as a [Number] instead of as a float64.
	public UseNumber(): void {
		const dec = this
		dec.d.useNumber = true
	}

	// DisallowUnknownFields causes the Decoder to return an error when the destination
	// is a struct and the input contains object keys which do not match any
	// non-ignored, exported fields in the destination.
	public DisallowUnknownFields(): void {
		const dec = this
		dec.d.disallowUnknownFields = true
	}

	// Decode reads the next JSON-encoded value from its
	// input and stores it in the value pointed to by v.
	//
	// See the documentation for [Unmarshal] for details about
	// the conversion of JSON into a Go value.
	public async Decode(v: null | any): Promise<$.GoError> {
		const dec = this
		if (dec.err != null) {
			return dec.err
		}
		{
			let err = dec.tokenPrepareForDecode()
			if (err != null) {
				return err
			}
		}
		if (!dec.tokenValueAllowed()) {
			return new SyntaxError({Offset: dec.InputOffset(), msg: "not at beginning of value"})
		}
		let [n, err] = dec.readValue()
		if (err != null) {
			return err
		}
		dec.d.init($.goSlice(dec.buf, dec.scanp, dec.scanp + n))
		dec.scanp += n
		err = await dec.d.unmarshal(v)
		dec.tokenValueEnd()
		return err
	}

	// Buffered returns a reader of the data remaining in the Decoder's
	// buffer. The reader is valid until the next call to [Decoder.Decode].
	public Buffered(): null | io.Reader {
		const dec = this
		return bytes.NewReader($.goSlice(dec.buf, dec.scanp, undefined))
	}

	// readValue reads a JSON value into dec.buf.
	// It returns the length of the encoding.
	public readValue(): [number, $.GoError] {
		const dec = this
		dec.scan.reset()
		let scanp = dec.scanp
		let err: $.GoError = null
		Input: for (; scanp >= 0; ) {

			// Look in the buffer for a new value.

			// scanEnd is delayed one byte so we decrement
			// the scanner bytes count by 1 to ensure that
			// this value is correct in the next call of Decode.

			// scanEnd is delayed one byte.
			// We might block trying to get that byte from src,
			// so instead invent a space byte.
			for (; scanp < $.len(dec.buf); scanp++) {
				let c = dec.buf![scanp]
				dec.scan.bytes++

				// scanEnd is delayed one byte so we decrement
				// the scanner bytes count by 1 to ensure that
				// this value is correct in the next call of Decode.

				// scanEnd is delayed one byte.
				// We might block trying to get that byte from src,
				// so instead invent a space byte.
				switch (dec.scan.step!(dec.scan, c)) {
					case 10: {
						dec.scan.bytes--
						break Input
						break
					}
					case 5:
					case 8: {
						if (stateEndValue(dec.scan, 32) == 10) {
							scanp++
							break Input
						}
						break
					}
					case 11: {
						dec.err = dec.scan.err
						return [0, dec.scan.err]
						break
					}
				}
			}

			// Did the last read have an error?
			// Delayed until now to allow buffer scan.
			if (err != null) {
				if (err == io.EOF) {
					if (dec.scan.step!(dec.scan, 32) == 10) {
						break Input
					}
					if (nonSpace(dec.buf)) {
						err = io.ErrUnexpectedEOF
					}
				}
				dec.err = err
				return [0, err]
			}

			let n = scanp - dec.scanp
			err = dec.refill()
			scanp = dec.scanp + n
		}
		return [scanp - dec.scanp, null]
	}

	public refill(): $.GoError {
		const dec = this
		if (dec.scanp > 0) {
			dec.scanned += (dec.scanp as number)
			let n = $.copy(dec.buf, $.goSlice(dec.buf, dec.scanp, undefined))
			dec.buf = $.goSlice(dec.buf, undefined, n)
			dec.scanp = 0
		}
		let minRead: number = 512
		if ($.cap(dec.buf) - $.len(dec.buf) < 512) {
			let newBuf = $.makeSlice<number>($.len(dec.buf), 2 * $.cap(dec.buf) + 512, 'byte')
			$.copy(newBuf, dec.buf)
			dec.buf = newBuf
		}
		let [n, err] = dec.r!.Read($.goSlice(dec.buf, $.len(dec.buf), $.cap(dec.buf)))
		dec.buf = $.goSlice(dec.buf, 0, $.len(dec.buf) + n)
		return err
	}

	// advance tokenstate from a separator state to a value state
	public tokenPrepareForDecode(): $.GoError {
		const dec = this
		switch (dec.tokenState) {
			case 3: {
				let [c, err] = dec.peek()
				if (err != null) {
					return err
				}
				if (c != 44) {
					return new SyntaxError({Offset: dec.InputOffset(), msg: "expected comma after array element"})
				}
				dec.scanp++
				dec.tokenState = 2
				break
			}
			case 6: {
				let [c, err] = dec.peek()
				if (err != null) {
					return err
				}
				if (c != 58) {
					return new SyntaxError({Offset: dec.InputOffset(), msg: "expected colon after object key"})
				}
				dec.scanp++
				dec.tokenState = 7
				break
			}
		}
		return null
	}

	public tokenValueAllowed(): boolean {
		const dec = this
		switch (dec.tokenState) {
			case 0:
			case 1:
			case 2:
			case 7: {
				return true
				break
			}
		}
		return false
	}

	public tokenValueEnd(): void {
		const dec = this
		switch (dec.tokenState) {
			case 1:
			case 2: {
				dec.tokenState = 3
				break
			}
			case 7: {
				dec.tokenState = 8
				break
			}
		}
	}

	// Token returns the next JSON token in the input stream.
	// At the end of the input stream, Token returns nil, [io.EOF].
	//
	// Token guarantees that the delimiters [ ] { } it returns are
	// properly nested and matched: if Token encounters an unexpected
	// delimiter in the input, it will return an error.
	//
	// The input stream consists of basic JSON values—bool, string,
	// number, and null—along with delimiters [ ] { } of type [Delim]
	// to mark the start and end of arrays and objects.
	// Commas and colons are elided.
	public async Token(): Promise<[Token, $.GoError]> {
		const dec = this
		for (; ; ) {
			let [c, err] = dec.peek()
			if (err != null) {
				return [null, err]
			}
			switch (c) {
				case 91: {
					if (!dec.tokenValueAllowed()) {
						return dec.tokenError(c)
					}
					dec.scanp++
					dec.tokenStack = $.append(dec.tokenStack, dec.tokenState)
					dec.tokenState = 1
					return [(91 as Delim), null]
					break
				}
				case 93: {
					if (Number(dec.tokenState) != 1 && Number(dec.tokenState) != 3) {
						return dec.tokenError(c)
					}
					dec.scanp++
					dec.tokenState = dec.tokenStack![$.len(dec.tokenStack) - 1]
					dec.tokenStack = $.goSlice(dec.tokenStack, undefined, $.len(dec.tokenStack) - 1)
					dec.tokenValueEnd()
					return [(93 as Delim), null]
					break
				}
				case 123: {
					if (!dec.tokenValueAllowed()) {
						return dec.tokenError(c)
					}
					dec.scanp++
					dec.tokenStack = $.append(dec.tokenStack, dec.tokenState)
					dec.tokenState = 4
					return [(123 as Delim), null]
					break
				}
				case 125: {
					if (Number(dec.tokenState) != 4 && Number(dec.tokenState) != 8) {
						return dec.tokenError(c)
					}
					dec.scanp++
					dec.tokenState = dec.tokenStack![$.len(dec.tokenStack) - 1]
					dec.tokenStack = $.goSlice(dec.tokenStack, undefined, $.len(dec.tokenStack) - 1)
					dec.tokenValueEnd()
					return [(125 as Delim), null]
					break
				}
				case 58: {
					if (Number(dec.tokenState) != 6) {
						return dec.tokenError(c)
					}
					dec.scanp++
					dec.tokenState = 7
					continue
					break
				}
				case 44: {
					if (Number(dec.tokenState) == 3) {
						dec.scanp++
						dec.tokenState = 2
						continue
					}
					if (Number(dec.tokenState) == 8) {
						dec.scanp++
						dec.tokenState = 5
						continue
					}
					return dec.tokenError(c)
					break
				}
				case 34: {
					if (Number(dec.tokenState) == 4 || Number(dec.tokenState) == 5) {
						let x: $.VarRef<string> = $.varRef("")
						let old = dec.tokenState
						dec.tokenState = 0
						let err = await dec.Decode(x)
						dec.tokenState = old
						if (err != null) {
							return [null, err]
						}
						dec.tokenState = 6
						return [x!.value, null]
					}
					// fallthrough // fallthrough statement skipped
					break
				}
				default: {
					if (!dec.tokenValueAllowed()) {
						return dec.tokenError(c)
					}
					let x: $.VarRef<null | any> = $.varRef(null)
					{
						let err = await dec.Decode(x)
						if (err != null) {
							return [null, err]
						}
					}
					return [x!.value, null]
					break
				}
			}
		}
	}

	public tokenError(c: number): [Token, $.GoError] {
		const dec = this
		let context: string = ""
		switch (dec.tokenState) {
			case 0: {
				context = " looking for beginning of value"
				break
			}
			case 1:
			case 2:
			case 7: {
				context = " looking for beginning of value"
				break
			}
			case 3: {
				context = " after array element"
				break
			}
			case 5: {
				context = " looking for beginning of object key string"
				break
			}
			case 6: {
				context = " after object key"
				break
			}
			case 8: {
				context = " after object key:value pair"
				break
			}
		}
		return [null, new SyntaxError({Offset: dec.InputOffset(), msg: "invalid character " + quoteChar(c) + context})]
	}

	// More reports whether there is another element in the
	// current array or object being parsed.
	public More(): boolean {
		const dec = this
		let [c, err] = dec.peek()
		return err == null && c != 93 && c != 125
	}

	public peek(): [number, $.GoError] {
		const dec = this
		let err: $.GoError = null
		for (; ; ) {
			for (let i = dec.scanp; i < $.len(dec.buf); i++) {
				let c = dec.buf![i]
				if (isSpace(c)) {
					continue
				}
				dec.scanp = i
				return [c, null]
			}
			// buffer has been scanned, now report any error
			if (err != null) {
				return [0, err]
			}
			err = dec.refill()
		}
	}

	// InputOffset returns the input stream byte offset of the current decoder position.
	// The offset gives the location of the end of the most recently returned token
	// and the beginning of the next token.
	public InputOffset(): number {
		const dec = this
		return dec.scanned + (dec.scanp as number)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.Decoder',
	  new Decoder(),
	  [{ name: "UseNumber", args: [], returns: [] }, { name: "DisallowUnknownFields", args: [], returns: [] }, { name: "Decode", args: [{ name: "v", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Buffered", args: [], returns: [{ type: "Reader" }] }, { name: "readValue", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "refill", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "tokenPrepareForDecode", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "tokenValueAllowed", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "tokenValueEnd", args: [], returns: [] }, { name: "Token", args: [], returns: [{ type: "Token" }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "tokenError", args: [{ name: "c", type: { kind: $.TypeKind.Basic, name: "byte" } }], returns: [{ type: "Token" }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "More", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "peek", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "byte" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "InputOffset", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }] }],
	  Decoder,
	  {"r": "Reader", "buf": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "d": "decodeState", "scanp": { kind: $.TypeKind.Basic, name: "int" }, "scanned": { kind: $.TypeKind.Basic, name: "int64" }, "scan": "scanner", "err": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }, "tokenState": { kind: $.TypeKind.Basic, name: "int" }, "tokenStack": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	);
}

export type Delim = number;

export function Delim_String(d: Delim): string {
	return $.runeOrStringToString(d)
}


export class Encoder {
	public get w(): null | io.Writer {
		return this._fields.w.value
	}
	public set w(value: null | io.Writer) {
		this._fields.w.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get escapeHTML(): boolean {
		return this._fields.escapeHTML.value
	}
	public set escapeHTML(value: boolean) {
		this._fields.escapeHTML.value = value
	}

	public get indentBuf(): $.Bytes {
		return this._fields.indentBuf.value
	}
	public set indentBuf(value: $.Bytes) {
		this._fields.indentBuf.value = value
	}

	public get indentPrefix(): string {
		return this._fields.indentPrefix.value
	}
	public set indentPrefix(value: string) {
		this._fields.indentPrefix.value = value
	}

	public get indentValue(): string {
		return this._fields.indentValue.value
	}
	public set indentValue(value: string) {
		this._fields.indentValue.value = value
	}

	public _fields: {
		w: $.VarRef<null | io.Writer>;
		err: $.VarRef<$.GoError>;
		escapeHTML: $.VarRef<boolean>;
		indentBuf: $.VarRef<$.Bytes>;
		indentPrefix: $.VarRef<string>;
		indentValue: $.VarRef<string>;
	}

	constructor(init?: Partial<{err?: $.GoError, escapeHTML?: boolean, indentBuf?: $.Bytes, indentPrefix?: string, indentValue?: string, w?: null | io.Writer}>) {
		this._fields = {
			w: $.varRef(init?.w ?? null),
			err: $.varRef(init?.err ?? null),
			escapeHTML: $.varRef(init?.escapeHTML ?? false),
			indentBuf: $.varRef(init?.indentBuf ?? new Uint8Array(0)),
			indentPrefix: $.varRef(init?.indentPrefix ?? ""),
			indentValue: $.varRef(init?.indentValue ?? "")
		}
	}

	public clone(): Encoder {
		const cloned = new Encoder()
		cloned._fields = {
			w: $.varRef(this._fields.w.value),
			err: $.varRef(this._fields.err.value),
			escapeHTML: $.varRef(this._fields.escapeHTML.value),
			indentBuf: $.varRef(this._fields.indentBuf.value),
			indentPrefix: $.varRef(this._fields.indentPrefix.value),
			indentValue: $.varRef(this._fields.indentValue.value)
		}
		return cloned
	}

	// Encode writes the JSON encoding of v to the stream,
	// with insignificant space characters elided,
	// followed by a newline character.
	//
	// See the documentation for [Marshal] for details about the
	// conversion of Go values to JSON.
	public async Encode(v: null | any): Promise<$.GoError> {
		const enc = this
		using __defer = new $.DisposableStack();
		if (enc.err != null) {
			return enc.err
		}
		let e = newEncodeState()
		__defer.defer(() => {
			encodeStatePool!.value.Put(e)
		});
		let err = await e!.marshal(v, $.markAsStructValue(new encOpts({escapeHTML: enc.escapeHTML})))
		if (err != null) {
			return err
		}
		e!.WriteByte(10)
		let b = e!.Bytes()
		if (enc.indentPrefix != "" || enc.indentValue != "") {
			{
			  const _tmp = appendIndent($.goSlice(enc.indentBuf, undefined, 0), b, enc.indentPrefix, enc.indentValue)
			  enc.indentBuf = _tmp[0]
			  err = _tmp[1]
			}
			if (err != null) {
				return err
			}
			b = enc.indentBuf
		}
		{
			;[, err] = enc.w!.Write(b)
			if (err != null) {
				enc.err = err
			}
		}
		return err
	}

	// SetIndent instructs the encoder to format each subsequent encoded
	// value as if indented by the package-level function Indent(dst, src, prefix, indent).
	// Calling SetIndent("", "") disables indentation.
	public SetIndent(prefix: string, indent: string): void {
		const enc = this
		enc.indentPrefix = prefix
		enc.indentValue = indent
	}

	// SetEscapeHTML specifies whether problematic HTML characters
	// should be escaped inside JSON quoted strings.
	// The default behavior is to escape &, <, and > to \u0026, \u003c, and \u003e
	// to avoid certain safety problems that can arise when embedding JSON in HTML.
	//
	// In non-HTML settings where the escaping interferes with the readability
	// of the output, SetEscapeHTML(false) disables this behavior.
	public SetEscapeHTML(on: boolean): void {
		const enc = this
		enc.escapeHTML = on
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.Encoder',
	  new Encoder(),
	  [{ name: "Encode", args: [{ name: "v", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "SetIndent", args: [{ name: "prefix", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "indent", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "SetEscapeHTML", args: [{ name: "on", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }],
	  Encoder,
	  {"w": "Writer", "err": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }, "escapeHTML": { kind: $.TypeKind.Basic, name: "bool" }, "indentBuf": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "indentPrefix": { kind: $.TypeKind.Basic, name: "string" }, "indentValue": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export type RawMessage = $.Bytes;

export function RawMessage_MarshalJSON(m: RawMessage): [$.Bytes, $.GoError] {
	if (m == null) {
		return [$.stringToBytes("null"), null]
	}
	return [m, null]
}

export function RawMessage_UnmarshalJSON(m: $.VarRef<RawMessage>, data: $.Bytes): $.GoError {
	if (m == null) {
		return errors.New("json.RawMessage: UnmarshalJSON on nil pointer")
	}
	m!.value = $.append($.goSlice((m!.value), 0, 0), ...(data || []))
	return null
}


export type Token = null | any;


// NewDecoder returns a new decoder that reads from r.
//
// The decoder introduces its own buffering and may
// read data from r beyond the JSON values requested.
export function NewDecoder(r: null | io.Reader): Decoder | null {
	return new Decoder({r: r})
}

export function nonSpace(b: $.Bytes): boolean {
	for (let _i = 0; _i < $.len(b); _i++) {
		let c = b![_i]
		{
			if (!isSpace(c)) {
				return true
			}
		}
	}
	return false
}

// NewEncoder returns a new encoder that writes to w.
export function NewEncoder(w: null | io.Writer): Encoder | null {
	return new Encoder({escapeHTML: true, w: w})
}

