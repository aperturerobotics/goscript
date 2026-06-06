// Generated file based on scan.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as __goscript_bufio from "./bufio.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/unicode/utf8/index.js"
import "./bufio.gs.ts"

export type SplitFunc = ((data: $.Slice<number>, atEOF: boolean) => [number, $.Slice<number>, $.GoError] | globalThis.Promise<[number, $.Slice<number>, $.GoError]>) | null

export class Scanner {
	public get r(): io.Reader | null {
		return this._fields.r.value
	}
	public set r(value: io.Reader | null) {
		this._fields.r.value = value
	}

	public get split(): ((data: $.Slice<number>, atEOF: boolean) => [number, $.Slice<number>, $.GoError] | globalThis.Promise<[number, $.Slice<number>, $.GoError]>) | null {
		return this._fields.split.value
	}
	public set split(value: ((data: $.Slice<number>, atEOF: boolean) => [number, $.Slice<number>, $.GoError] | globalThis.Promise<[number, $.Slice<number>, $.GoError]>) | null) {
		this._fields.split.value = value
	}

	public get maxTokenSize(): number {
		return this._fields.maxTokenSize.value
	}
	public set maxTokenSize(value: number) {
		this._fields.maxTokenSize.value = value
	}

	public get token(): $.Slice<number> {
		return this._fields.token.value
	}
	public set token(value: $.Slice<number>) {
		this._fields.token.value = value
	}

	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public get start(): number {
		return this._fields.start.value
	}
	public set start(value: number) {
		this._fields.start.value = value
	}

	public get end(): number {
		return this._fields.end.value
	}
	public set end(value: number) {
		this._fields.end.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get empties(): number {
		return this._fields.empties.value
	}
	public set empties(value: number) {
		this._fields.empties.value = value
	}

	public get scanCalled(): boolean {
		return this._fields.scanCalled.value
	}
	public set scanCalled(value: boolean) {
		this._fields.scanCalled.value = value
	}

	public get done(): boolean {
		return this._fields.done.value
	}
	public set done(value: boolean) {
		this._fields.done.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader | null>
		split: $.VarRef<((data: $.Slice<number>, atEOF: boolean) => [number, $.Slice<number>, $.GoError] | globalThis.Promise<[number, $.Slice<number>, $.GoError]>) | null>
		maxTokenSize: $.VarRef<number>
		token: $.VarRef<$.Slice<number>>
		buf: $.VarRef<$.Slice<number>>
		start: $.VarRef<number>
		end: $.VarRef<number>
		err: $.VarRef<$.GoError>
		empties: $.VarRef<number>
		scanCalled: $.VarRef<boolean>
		done: $.VarRef<boolean>
	}

	constructor(init?: Partial<{r?: io.Reader | null, split?: ((data: $.Slice<number>, atEOF: boolean) => [number, $.Slice<number>, $.GoError] | globalThis.Promise<[number, $.Slice<number>, $.GoError]>) | null, maxTokenSize?: number, token?: $.Slice<number>, buf?: $.Slice<number>, start?: number, end?: number, err?: $.GoError, empties?: number, scanCalled?: boolean, done?: boolean}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null as unknown as io.Reader | null)),
			split: $.varRef(init?.split ?? (null as unknown as ((data: $.Slice<number>, atEOF: boolean) => [number, $.Slice<number>, $.GoError] | globalThis.Promise<[number, $.Slice<number>, $.GoError]>) | null)),
			maxTokenSize: $.varRef(init?.maxTokenSize ?? (0 as unknown as number)),
			token: $.varRef(init?.token ?? (null as unknown as $.Slice<number>)),
			buf: $.varRef(init?.buf ?? (null as unknown as $.Slice<number>)),
			start: $.varRef(init?.start ?? (0 as unknown as number)),
			end: $.varRef(init?.end ?? (0 as unknown as number)),
			err: $.varRef(init?.err ?? (null as unknown as $.GoError)),
			empties: $.varRef(init?.empties ?? (0 as unknown as number)),
			scanCalled: $.varRef(init?.scanCalled ?? (false as unknown as boolean)),
			done: $.varRef(init?.done ?? (false as unknown as boolean))
		}
	}

	public clone(): Scanner {
		const cloned = new Scanner()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			split: $.varRef(this._fields.split.value),
			maxTokenSize: $.varRef(this._fields.maxTokenSize.value),
			token: $.varRef(this._fields.token.value),
			buf: $.varRef(this._fields.buf.value),
			start: $.varRef(this._fields.start.value),
			end: $.varRef(this._fields.end.value),
			err: $.varRef(this._fields.err.value),
			empties: $.varRef(this._fields.empties.value),
			scanCalled: $.varRef(this._fields.scanCalled.value),
			done: $.varRef(this._fields.done.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Buffer(buf: $.Slice<number>, max: number): void {
		let s: Scanner | $.VarRef<Scanner> | null = this
		if ($.pointerValue<Scanner>(s).scanCalled) {
			$.panic("Buffer called after Scan")
		}
		$.pointerValue<Scanner>(s).buf = $.goSlice(buf, 0, $.cap(buf))
		$.pointerValue<Scanner>(s).maxTokenSize = max
	}

	public Bytes(): $.Slice<number> {
		const s: Scanner | $.VarRef<Scanner> | null = this
		return $.pointerValue<Scanner>(s).token
	}

	public Err(): $.GoError {
		const s: Scanner | $.VarRef<Scanner> | null = this
		if ($.comparableEqual($.pointerValue<Scanner>(s).err, io.EOF)) {
			return null
		}
		return $.pointerValue<Scanner>(s).err
	}

	public async Scan(): globalThis.Promise<boolean> {
		let s: Scanner | $.VarRef<Scanner> | null = this
		if ($.pointerValue<Scanner>(s).done) {
			return false
		}
		$.pointerValue<Scanner>(s).scanCalled = true
		// Loop until we have a token.
		while (true) {
			// See if we can get a token with what we already have.
			// If we've run out of data but have an error, give the split function
			// a chance to recover any remaining, possibly empty token.
			if (($.pointerValue<Scanner>(s).end > $.pointerValue<Scanner>(s).start) || ($.pointerValue<Scanner>(s).err != null)) {
				let __goscriptTuple0: any = await $.pointerValue<Scanner>(s).split!($.goSlice($.pointerValue<Scanner>(s).buf, $.pointerValue<Scanner>(s).start, $.pointerValue<Scanner>(s).end), $.pointerValue<Scanner>(s).err != null)
				let advance = __goscriptTuple0[0]
				let token: $.Slice<number> = __goscriptTuple0[1]
				let err = __goscriptTuple0[2]
				if (err != null) {
					if ($.comparableEqual(err, ErrFinalToken)) {
						$.pointerValue<Scanner>(s).token = token
						$.pointerValue<Scanner>(s).done = true
						// When token is not nil, it means the scanning stops
						// with a trailing token, and thus the return value
						// should be true to indicate the existence of the token.
						return token != null
					}
					Scanner.prototype.setErr.call(s, err)
					return false
				}
				if (!Scanner.prototype.advance.call(s, advance)) {
					return false
				}
				$.pointerValue<Scanner>(s).token = token
				if (token != null) {
					if (($.pointerValue<Scanner>(s).err == null) || (advance > 0)) {
						$.pointerValue<Scanner>(s).empties = 0
					} else {
						// Returning tokens not advancing input at EOF.
						$.pointerValue<Scanner>(s).empties++
						if ($.pointerValue<Scanner>(s).empties > 100) {
							$.panic("bufio.Scan: too many empty tokens without progressing")
						}
					}
					return true
				}
			}
			// We cannot generate a token with what we are holding.
			// If we've already hit EOF or an I/O error, we are done.
			if ($.pointerValue<Scanner>(s).err != null) {
				// Shut it down.
				$.pointerValue<Scanner>(s).start = 0
				$.pointerValue<Scanner>(s).end = 0
				return false
			}
			// Must read more data.
			// First, shift data to beginning of buffer if there's lots of empty space
			// or space is needed.
			if (($.pointerValue<Scanner>(s).start > 0) && (($.pointerValue<Scanner>(s).end == $.len($.pointerValue<Scanner>(s).buf)) || ($.pointerValue<Scanner>(s).start > (Math.trunc($.len($.pointerValue<Scanner>(s).buf) / 2))))) {
				$.copy($.pointerValue<Scanner>(s).buf, $.goSlice($.pointerValue<Scanner>(s).buf, $.pointerValue<Scanner>(s).start, $.pointerValue<Scanner>(s).end))
				$.pointerValue<Scanner>(s).end = $.pointerValue<Scanner>(s).end - ($.pointerValue<Scanner>(s).start)
				$.pointerValue<Scanner>(s).start = 0
			}
			// Is the buffer full? If so, resize.
			if ($.pointerValue<Scanner>(s).end == $.len($.pointerValue<Scanner>(s).buf)) {
				// Guarantee no overflow in the multiplication below.
				const maxInt: number = 9223372036854775807
				if (($.len($.pointerValue<Scanner>(s).buf) >= $.pointerValue<Scanner>(s).maxTokenSize) || ($.len($.pointerValue<Scanner>(s).buf) > (4611686018427387903))) {
					Scanner.prototype.setErr.call(s, ErrTooLong)
					return false
				}
				let newSize = $.len($.pointerValue<Scanner>(s).buf) * 2
				if (newSize == 0) {
					newSize = 4096
				}
				newSize = $.min(newSize, $.pointerValue<Scanner>(s).maxTokenSize)
				let newBuf: $.Slice<number> = $.makeSlice<number>(newSize, undefined, "byte")
				$.copy(newBuf, $.goSlice($.pointerValue<Scanner>(s).buf, $.pointerValue<Scanner>(s).start, $.pointerValue<Scanner>(s).end))
				$.pointerValue<Scanner>(s).buf = newBuf
				$.pointerValue<Scanner>(s).end = $.pointerValue<Scanner>(s).end - ($.pointerValue<Scanner>(s).start)
				$.pointerValue<Scanner>(s).start = 0
			}
			// Finally we can read some input. Make sure we don't get stuck with
			// a misbehaving Reader. Officially we don't need to do this, but let's
			// be extra careful: Scanner is for safe, simple jobs.
			for (let loop = 0; ; ) {
				let [n, err] = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<Scanner>(s).r).Read($.goSlice($.pointerValue<Scanner>(s).buf, $.pointerValue<Scanner>(s).end, $.len($.pointerValue<Scanner>(s).buf)))
				if ((n < 0) || (($.len($.pointerValue<Scanner>(s).buf) - $.pointerValue<Scanner>(s).end) < n)) {
					Scanner.prototype.setErr.call(s, ErrBadReadCount)
					break
				}
				$.pointerValue<Scanner>(s).end = $.pointerValue<Scanner>(s).end + (n)
				if (err != null) {
					Scanner.prototype.setErr.call(s, err)
					break
				}
				if (n > 0) {
					$.pointerValue<Scanner>(s).empties = 0
					break
				}
				loop++
				if (loop > 100) {
					Scanner.prototype.setErr.call(s, io.ErrNoProgress)
					break
				}
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public Split(split: SplitFunc | null): void {
		let s: Scanner | $.VarRef<Scanner> | null = this
		if ($.pointerValue<Scanner>(s).scanCalled) {
			$.panic("Split called after Scan")
		}
		$.pointerValue<Scanner>(s).split = split
	}

	public Text(): string {
		const s: Scanner | $.VarRef<Scanner> | null = this
		return $.bytesToString($.pointerValue<Scanner>(s).token)
	}

	public advance(n: number): boolean {
		let s: Scanner | $.VarRef<Scanner> | null = this
		if (n < 0) {
			Scanner.prototype.setErr.call(s, ErrNegativeAdvance)
			return false
		}
		if (n > ($.pointerValue<Scanner>(s).end - $.pointerValue<Scanner>(s).start)) {
			Scanner.prototype.setErr.call(s, ErrAdvanceTooFar)
			return false
		}
		$.pointerValue<Scanner>(s).start = $.pointerValue<Scanner>(s).start + (n)
		return true
	}

	public setErr(err: $.GoError): void {
		let s: Scanner | $.VarRef<Scanner> | null = this
		if (($.pointerValue<Scanner>(s).err == null) || ($.comparableEqual($.pointerValue<Scanner>(s).err, io.EOF))) {
			$.pointerValue<Scanner>(s).err = err
		}
	}

	static __typeInfo = $.registerStructType(
		"bufio.Scanner",
		() => new Scanner(),
		[{ name: "Buffer", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "max", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Err", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Scan", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Split", args: [{ name: "split", type: ({ kind: $.TypeKind.Function, name: "bufio.SplitFunc", params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Basic, name: "bool" }], results: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo) }], returns: [] }, { name: "Text", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "advance", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "setErr", args: [{ name: "err", type: "error" }], returns: [] }],
		Scanner,
		[{ name: "r", key: "r", type: "io.Reader", pkgPath: "bufio", index: [0], offset: 0, exported: false }, { name: "split", key: "split", type: ({ kind: $.TypeKind.Function, name: "bufio.SplitFunc", params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Basic, name: "bool" }], results: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo), pkgPath: "bufio", index: [1], offset: 16, exported: false }, { name: "maxTokenSize", key: "maxTokenSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "bufio", index: [2], offset: 24, exported: false }, { name: "token", key: "token", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "bufio", index: [3], offset: 32, exported: false }, { name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "bufio", index: [4], offset: 56, exported: false }, { name: "start", key: "start", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "bufio", index: [5], offset: 80, exported: false }, { name: "end", key: "end", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "bufio", index: [6], offset: 88, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "bufio", index: [7], offset: 96, exported: false }, { name: "empties", key: "empties", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "bufio", index: [8], offset: 112, exported: false }, { name: "scanCalled", key: "scanCalled", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "bufio", index: [9], offset: 120, exported: false }, { name: "done", key: "done", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "bufio", index: [10], offset: 121, exported: false }]
	)
}

export const MaxScanTokenSize: number = 65536

export const startBufSize: number = 4096

export let ErrTooLong: $.GoError = errors.New("bufio.Scanner: token too long")

export function __goscript_set_ErrTooLong(__goscriptValue: $.GoError): void {
	ErrTooLong = __goscriptValue
}

export let ErrNegativeAdvance: $.GoError = errors.New("bufio.Scanner: SplitFunc returns negative advance count")

export function __goscript_set_ErrNegativeAdvance(__goscriptValue: $.GoError): void {
	ErrNegativeAdvance = __goscriptValue
}

export let ErrAdvanceTooFar: $.GoError = errors.New("bufio.Scanner: SplitFunc returns advance count beyond input")

export function __goscript_set_ErrAdvanceTooFar(__goscriptValue: $.GoError): void {
	ErrAdvanceTooFar = __goscriptValue
}

export let ErrBadReadCount: $.GoError = errors.New("bufio.Scanner: Read returned impossible count")

export function __goscript_set_ErrBadReadCount(__goscriptValue: $.GoError): void {
	ErrBadReadCount = __goscriptValue
}

export function NewScanner(r: io.Reader | null): Scanner | $.VarRef<Scanner> | null {
	return new Scanner({r: r, split: ScanLines, maxTokenSize: 65536})
}

export let ErrFinalToken: $.GoError = errors.New("final token")

export function __goscript_set_ErrFinalToken(__goscriptValue: $.GoError): void {
	ErrFinalToken = __goscriptValue
}

export function ScanBytes(data: $.Slice<number>, atEOF: boolean): [number, $.Slice<number>, $.GoError] {
	let advance: number = 0
	let token: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	if (atEOF && ($.len(data) == 0)) {
		return [0, null, null]
	}
	return [1, $.goSlice(data, 0, 1), null]
}

export let errorRune: $.Slice<number> = new Uint8Array([239, 191, 189])

export function __goscript_set_errorRune(__goscriptValue: $.Slice<number>): void {
	errorRune = __goscriptValue
}

export function ScanRunes(data: $.Slice<number>, atEOF: boolean): [number, $.Slice<number>, $.GoError] {
	let advance: number = 0
	let token: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	if (atEOF && ($.len(data) == 0)) {
		return [0, null, null]
	}

	// Fast path 1: ASCII.
	if (data![0] < utf8.RuneSelf) {
		return [1, $.goSlice(data, 0, 1), null]
	}

	// Fast path 2: Correct UTF-8 decode without error.
	let [, width] = utf8.DecodeRune(data)
	if (width > 1) {
		// It's a valid encoding. Width cannot be one for a correctly encoded
		// non-ASCII rune.
		return [width, $.goSlice(data, 0, width), null]
	}

	// We know it's an error: we have width==1 and implicitly r==utf8.RuneError.
	// Is the error because there wasn't a full rune to be decoded?
	// FullRune distinguishes correctly between erroneous and incomplete encodings.
	if (!atEOF && !utf8.FullRune(data)) {
		// Incomplete; get more bytes.
		return [0, null, null]
	}

	// We have a real UTF-8 encoding error. Return a properly encoded error rune
	// but advance only one byte. This matches the behavior of a range loop over
	// an incorrectly encoded string.
	return [1, errorRune, null]
}

export function dropCR(data: $.Slice<number>): $.Slice<number> {
	if (($.len(data) > 0) && ($.uint(data![$.len(data) - 1], 8) == $.uint(13, 8))) {
		return $.goSlice(data, 0, $.len(data) - 1)
	}
	return data
}

export function ScanLines(data: $.Slice<number>, atEOF: boolean): [number, $.Slice<number>, $.GoError] {
	let advance: number = 0
	let token: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	if (atEOF && ($.len(data) == 0)) {
		return [0, null, null]
	}
	{
		let i = bytes.IndexByte(data, $.uint(10, 8))
		if (i >= 0) {
			// We have a full newline-terminated line.
			return [i + 1, dropCR($.goSlice(data, 0, i)), null]
		}
	}
	// If we're at EOF, we have a final, non-terminated line. Return it.
	if (atEOF) {
		return [$.len(data), dropCR(data), null]
	}
	// Request more data.
	return [0, null, null]
}

export function isSpace(r: number): boolean {
	if (r <= 255) {
		// Obvious ASCII ones: \t through \r plus space. Plus two Latin-1 oddballs.
		switch (r) {
			case 32:
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
			{
				return true
				break
			}
			case 133:
			case 160:
			{
				return true
				break
			}
		}
		return false
	}
	// High-valued ones.
	if ((8192 <= r) && (r <= 8202)) {
		return true
	}
	switch (r) {
		case 5760:
		case 8232:
		case 8233:
		case 8239:
		case 8287:
		case 12288:
		{
			return true
			break
		}
	}
	return false
}

export function ScanWords(data: $.Slice<number>, atEOF: boolean): [number, $.Slice<number>, $.GoError] {
	let advance: number = 0
	let token: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	// Skip leading spaces.
	let start = 0
	for (let width = 0; start < $.len(data); start = start + (width)) {
		let r: number = 0
		let __goscriptTuple1: any = utf8.DecodeRune($.goSlice(data, start, undefined))
		r = $.int(__goscriptTuple1[0], 32)
		width = __goscriptTuple1[1]
		if (!isSpace($.int(r, 32))) {
			break
		}
	}
	// Scan until space, marking end of word.
	for (let width = 0, i = start; i < $.len(data); i = i + (width)) {
		let r: number = 0
		let __goscriptTuple2: any = utf8.DecodeRune($.goSlice(data, i, undefined))
		r = $.int(__goscriptTuple2[0], 32)
		width = __goscriptTuple2[1]
		if (isSpace($.int(r, 32))) {
			return [i + width, $.goSlice(data, start, i), null]
		}
	}
	// If we're at EOF, we have a final, non-empty, non-terminated word. Return it.
	if (atEOF && ($.len(data) > start)) {
		return [$.len(data), $.goSlice(data, start, undefined), null]
	}
	// Request more data.
	return [start, null, null]
}
