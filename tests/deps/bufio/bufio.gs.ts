// Generated file based on bufio.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as strings from "@goscript/strings/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"
import "@goscript/bytes/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/strings/index.js"
import "@goscript/unicode/utf8/index.js"

export class Reader {
	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public get rd(): io.Reader | null {
		return this._fields.rd.value
	}
	public set rd(value: io.Reader | null) {
		this._fields.rd.value = value
	}

	public get r(): number {
		return this._fields.r.value
	}
	public set r(value: number) {
		this._fields.r.value = value
	}

	public get w(): number {
		return this._fields.w.value
	}
	public set w(value: number) {
		this._fields.w.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get lastByte(): number {
		return this._fields.lastByte.value
	}
	public set lastByte(value: number) {
		this._fields.lastByte.value = value
	}

	public get lastRuneSize(): number {
		return this._fields.lastRuneSize.value
	}
	public set lastRuneSize(value: number) {
		this._fields.lastRuneSize.value = value
	}

	public _fields: {
		buf: $.VarRef<$.Slice<number>>
		rd: $.VarRef<io.Reader | null>
		r: $.VarRef<number>
		w: $.VarRef<number>
		err: $.VarRef<$.GoError>
		lastByte: $.VarRef<number>
		lastRuneSize: $.VarRef<number>
	}

	constructor(init?: Partial<{buf?: $.Slice<number>, rd?: io.Reader | null, r?: number, w?: number, err?: $.GoError, lastByte?: number, lastRuneSize?: number}>) {
		this._fields = {
			buf: $.varRef(init?.buf ?? (null as unknown as $.Slice<number>)),
			rd: $.varRef(init?.rd ?? (null as unknown as io.Reader | null)),
			r: $.varRef(init?.r ?? (0 as unknown as number)),
			w: $.varRef(init?.w ?? (0 as unknown as number)),
			err: $.varRef(init?.err ?? (null as unknown as $.GoError)),
			lastByte: $.varRef(init?.lastByte ?? (0 as unknown as number)),
			lastRuneSize: $.varRef(init?.lastRuneSize ?? (0 as unknown as number))
		}
	}

	public clone(): Reader {
		const cloned = new Reader()
		cloned._fields = {
			buf: $.varRef(this._fields.buf.value),
			rd: $.varRef(this._fields.rd.value),
			r: $.varRef(this._fields.r.value),
			w: $.varRef(this._fields.w.value),
			err: $.varRef(this._fields.err.value),
			lastByte: $.varRef(this._fields.lastByte.value),
			lastRuneSize: $.varRef(this._fields.lastRuneSize.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Buffered(): number {
		const b: Reader | $.VarRef<Reader> | null = this
		return $.pointerValue<Reader>(b).w - $.pointerValue<Reader>(b).r
	}

	public async Discard(n: number): globalThis.Promise<[number, $.GoError]> {
		let b: Reader | $.VarRef<Reader> | null = this
		let discarded: number = 0
		let err: $.GoError = null as $.GoError
		if (n < 0) {
			return [0, ErrNegativeCount]
		}
		if (n == 0) {
			return [discarded, err]
		}

		$.pointerValue<Reader>(b).lastByte = -1
		$.pointerValue<Reader>(b).lastRuneSize = -1

		let remain = n
		while (true) {
			let skip = Reader.prototype.Buffered.call(b)
			if (skip == 0) {
				await Reader.prototype.fill.call(b)
				skip = Reader.prototype.Buffered.call(b)
			}
			if (skip > remain) {
				skip = remain
			}
			$.pointerValue<Reader>(b).r = $.pointerValue<Reader>(b).r + (skip)
			remain = remain - (skip)
			if (remain == 0) {
				return [n, null]
			}
			if ($.pointerValue<Reader>(b).err != null) {
				return [n - remain, Reader.prototype.readErr.call(b)]
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Peek(n: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		let b: Reader | $.VarRef<Reader> | null = this
		if (n < 0) {
			return [null, ErrNegativeCount]
		}

		$.pointerValue<Reader>(b).lastByte = -1
		$.pointerValue<Reader>(b).lastRuneSize = -1

		while (((($.pointerValue<Reader>(b).w - $.pointerValue<Reader>(b).r) < n) && (($.pointerValue<Reader>(b).w - $.pointerValue<Reader>(b).r) < $.len($.pointerValue<Reader>(b).buf))) && ($.pointerValue<Reader>(b).err == null)) {
			await Reader.prototype.fill.call(b)
		}

		if (n > $.len($.pointerValue<Reader>(b).buf)) {
			return [$.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r, $.pointerValue<Reader>(b).w), ErrBufferFull]
		}

		// 0 <= n <= len(b.buf)
		let err: $.GoError = null as $.GoError
		{
			let avail = $.pointerValue<Reader>(b).w - $.pointerValue<Reader>(b).r
			if (avail < n) {
				// not enough data in buffer
				n = avail
				err = Reader.prototype.readErr.call(b)
				if (err == null) {
					err = ErrBufferFull
				}
			}
		}
		return [$.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r, $.pointerValue<Reader>(b).r + n), err]
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let b: Reader | $.VarRef<Reader> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		n = $.len(p)
		if (n == 0) {
			if (Reader.prototype.Buffered.call(b) > 0) {
				return [0, null]
			}
			return [0, Reader.prototype.readErr.call(b)]
		}
		if ($.pointerValue<Reader>(b).r == $.pointerValue<Reader>(b).w) {
			if ($.pointerValue<Reader>(b).err != null) {
				return [0, Reader.prototype.readErr.call(b)]
			}
			if ($.len(p) >= $.len($.pointerValue<Reader>(b).buf)) {
				// Large read, empty buffer.
				// Read directly into p to avoid copy.
				let __goscriptTuple0: any = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<Reader>(b).rd).Read(p)
				n = __goscriptTuple0[0]
				$.pointerValue<Reader>(b).err = __goscriptTuple0[1]
				if (n < 0) {
					$.panic((errNegativeRead as any))
				}
				if (n > 0) {
					$.pointerValue<Reader>(b).lastByte = $.int(p![n - 1])
					$.pointerValue<Reader>(b).lastRuneSize = -1
				}
				return [n, Reader.prototype.readErr.call(b)]
			}
			// One read.
			// Do not use b.fill, which will loop.
			$.pointerValue<Reader>(b).r = 0
			$.pointerValue<Reader>(b).w = 0
			let __goscriptTuple1: any = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<Reader>(b).rd).Read($.pointerValue<Reader>(b).buf)
			n = __goscriptTuple1[0]
			$.pointerValue<Reader>(b).err = __goscriptTuple1[1]
			if (n < 0) {
				$.panic((errNegativeRead as any))
			}
			if (n == 0) {
				return [0, Reader.prototype.readErr.call(b)]
			}
			$.pointerValue<Reader>(b).w = $.pointerValue<Reader>(b).w + (n)
		}

		// copy as much as we can
		// Note: if the slice panics here, it is probably because
		// the underlying reader returned a bad count. See issue 49795.
		n = $.copy(p, $.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r, $.pointerValue<Reader>(b).w))
		$.pointerValue<Reader>(b).r = $.pointerValue<Reader>(b).r + (n)
		$.pointerValue<Reader>(b).lastByte = $.int($.pointerValue<Reader>(b).buf![$.pointerValue<Reader>(b).r - 1])
		$.pointerValue<Reader>(b).lastRuneSize = -1
		return [n, null]
	}

	public async ReadByte(): globalThis.Promise<[number, $.GoError]> {
		let b: Reader | $.VarRef<Reader> | null = this
		$.pointerValue<Reader>(b).lastRuneSize = -1
		while ($.pointerValue<Reader>(b).r == $.pointerValue<Reader>(b).w) {
			if ($.pointerValue<Reader>(b).err != null) {
				return [$.uint(0, 8), Reader.prototype.readErr.call(b)]
			}
			await Reader.prototype.fill.call(b)
		}
		let c = $.uint($.pointerValue<Reader>(b).buf![$.pointerValue<Reader>(b).r], 8)
		$.pointerValue<Reader>(b).r++
		$.pointerValue<Reader>(b).lastByte = $.int(c)
		return [$.uint(c, 8), null]
	}

	public async ReadBytes(delim: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const b: Reader | $.VarRef<Reader> | null = this
		let __goscriptTuple2: any = await Reader.prototype.collectFragments.call(b, $.uint(delim, 8))
		let full: $.Slice<$.Slice<number>> = __goscriptTuple2[0]
		let frag: $.Slice<number> = __goscriptTuple2[1]
		let n = __goscriptTuple2[2]
		let err = __goscriptTuple2[3]
		// Allocate new buffer to hold the full pieces and the fragment.
		let buf: $.Slice<number> = $.makeSlice<number>(n, undefined, "byte")
		n = 0
		// Copy full pieces and fragment in.
		for (let __goscriptRangeTarget0 = full, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			n = n + ($.copy($.goSlice(buf, n, undefined), full![i]))
		}
		$.copy($.goSlice(buf, n, undefined), frag)
		return [buf, err]
	}

	public async ReadLine(): globalThis.Promise<[$.Slice<number>, boolean, $.GoError]> {
		let b: Reader | $.VarRef<Reader> | null = this
		let line: $.Slice<number> = null as $.Slice<number>
		let isPrefix: boolean = false
		let err: $.GoError = null as $.GoError
		let __goscriptTuple3: any = await Reader.prototype.ReadSlice.call(b, $.uint(10, 8))
		line = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
		if ($.comparableEqual(err, ErrBufferFull)) {
			// Handle the case where "\r\n" straddles the buffer.
			if (($.len(line) > 0) && ($.uint(line![$.len(line) - 1], 8) == $.uint(13, 8))) {
				// Put the '\r' back on buf and drop it from line.
				// Let the next call to ReadLine check for "\r\n".
				if ($.pointerValue<Reader>(b).r == 0) {
					// should be unreachable
					$.panic("bufio: tried to rewind past start of buffer")
				}
				$.pointerValue<Reader>(b).r--
				line = $.goSlice(line, undefined, $.len(line) - 1)
			}
			return [line, true, null]
		}

		if ($.len(line) == 0) {
			if (err != null) {
				line = null
			}
			return [line, isPrefix, err]
		}
		err = null

		if ($.uint(line![$.len(line) - 1], 8) == $.uint(10, 8)) {
			let drop = 1
			if (($.len(line) > 1) && ($.uint(line![$.len(line) - 2], 8) == $.uint(13, 8))) {
				drop = 2
			}
			line = $.goSlice(line, undefined, $.len(line) - drop)
		}
		return [line, isPrefix, err]
	}

	public async ReadRune(): globalThis.Promise<[number, number, $.GoError]> {
		let b: Reader | $.VarRef<Reader> | null = this
		let r: number = 0
		let size: number = 0
		let err: $.GoError = null as $.GoError
		while ((((($.pointerValue<Reader>(b).r + utf8.UTFMax) > $.pointerValue<Reader>(b).w) && !utf8.FullRune($.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r, $.pointerValue<Reader>(b).w))) && ($.pointerValue<Reader>(b).err == null)) && (($.pointerValue<Reader>(b).w - $.pointerValue<Reader>(b).r) < $.len($.pointerValue<Reader>(b).buf))) {
			await Reader.prototype.fill.call(b)
		}
		$.pointerValue<Reader>(b).lastRuneSize = -1
		if ($.pointerValue<Reader>(b).r == $.pointerValue<Reader>(b).w) {
			return [$.int(0, 32), 0, Reader.prototype.readErr.call(b)]
		}
		let __goscriptTuple4: any = utf8.DecodeRune($.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r, $.pointerValue<Reader>(b).w))
		r = $.int(__goscriptTuple4[0], 32)
		size = __goscriptTuple4[1]
		$.pointerValue<Reader>(b).r = $.pointerValue<Reader>(b).r + (size)
		$.pointerValue<Reader>(b).lastByte = $.int($.pointerValue<Reader>(b).buf![$.pointerValue<Reader>(b).r - 1])
		$.pointerValue<Reader>(b).lastRuneSize = size
		return [$.int(r, 32), size, null]
	}

	public async ReadSlice(delim: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		let b: Reader | $.VarRef<Reader> | null = this
		let line: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		let s = 0
		while (true) {
			// Search buffer.
			{
				let i = bytes.IndexByte($.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r + s, $.pointerValue<Reader>(b).w), $.uint(delim, 8))
				if (i >= 0) {
					i = i + (s)
					line = $.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r, ($.pointerValue<Reader>(b).r + i) + 1)
					$.pointerValue<Reader>(b).r = $.pointerValue<Reader>(b).r + (i + 1)
					break
				}
			}

			// Pending error?
			if ($.pointerValue<Reader>(b).err != null) {
				line = $.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r, $.pointerValue<Reader>(b).w)
				$.pointerValue<Reader>(b).r = $.pointerValue<Reader>(b).w
				err = Reader.prototype.readErr.call(b)
				break
			}

			// Buffer full?
			if (Reader.prototype.Buffered.call(b) >= $.len($.pointerValue<Reader>(b).buf)) {
				$.pointerValue<Reader>(b).r = $.pointerValue<Reader>(b).w
				line = $.pointerValue<Reader>(b).buf
				err = ErrBufferFull
				break
			}

			s = $.pointerValue<Reader>(b).w - $.pointerValue<Reader>(b).r

			await Reader.prototype.fill.call(b)
		}

		// Handle last byte, if any.
		{
			let i = $.len(line) - 1
			if (i >= 0) {
				$.pointerValue<Reader>(b).lastByte = $.int(line![i])
				$.pointerValue<Reader>(b).lastRuneSize = -1
			}
		}

		return [line, err]
	}

	public async ReadString(delim: number): globalThis.Promise<[string, $.GoError]> {
		const b: Reader | $.VarRef<Reader> | null = this
		let __goscriptTuple5: any = await Reader.prototype.collectFragments.call(b, $.uint(delim, 8))
		let full: $.Slice<$.Slice<number>> = __goscriptTuple5[0]
		let frag: $.Slice<number> = __goscriptTuple5[1]
		let n = __goscriptTuple5[2]
		let err = __goscriptTuple5[3]
		// Allocate new buffer to hold the full pieces and the fragment.
		let buf: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		buf.value.Grow(n)
		// Copy full pieces and fragment in.
		for (let __goscriptRangeTarget1 = full, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let fb = __goscriptRangeTarget1![__rangeIndex]
			buf.value.Write(fb)
		}
		buf.value.Write(frag)
		return [buf.value.String(), err]
	}

	public Reset(r: io.Reader | null): void {
		let b: Reader | $.VarRef<Reader> | null = this
		// If a Reader r is passed to NewReader, NewReader will return r.
		// Different layers of code may do that, and then later pass r
		// to Reset. Avoid infinite recursion in that case.
		if ($.comparableEqual(b, r)) {
			return
		}
		if ($.pointerValue<Reader>(b).buf == null) {
			$.pointerValue<Reader>(b).buf = $.makeSlice<number>(4096, undefined, "byte")
		}
		Reader.prototype.reset.call(b, $.pointerValue<Reader>(b).buf, r)
	}

	public Size(): number {
		const b: Reader | $.VarRef<Reader> | null = this
		return $.len($.pointerValue<Reader>(b).buf)
	}

	public UnreadByte(): $.GoError {
		let b: Reader | $.VarRef<Reader> | null = this
		if (($.pointerValue<Reader>(b).lastByte < 0) || (($.pointerValue<Reader>(b).r == 0) && ($.pointerValue<Reader>(b).w > 0))) {
			return ErrInvalidUnreadByte
		}
		// b.r > 0 || b.w == 0
		if ($.pointerValue<Reader>(b).r > 0) {
			$.pointerValue<Reader>(b).r--
		} else {
			// b.r == 0 && b.w == 0
			$.pointerValue<Reader>(b).w = 1
		}
		$.pointerValue<Reader>(b).buf![$.pointerValue<Reader>(b).r] = $.uint($.uint($.pointerValue<Reader>(b).lastByte, 8), 8)
		$.pointerValue<Reader>(b).lastByte = -1
		$.pointerValue<Reader>(b).lastRuneSize = -1
		return null
	}

	public UnreadRune(): $.GoError {
		let b: Reader | $.VarRef<Reader> | null = this
		if (($.pointerValue<Reader>(b).lastRuneSize < 0) || ($.pointerValue<Reader>(b).r < $.pointerValue<Reader>(b).lastRuneSize)) {
			return ErrInvalidUnreadRune
		}
		$.pointerValue<Reader>(b).r = $.pointerValue<Reader>(b).r - ($.pointerValue<Reader>(b).lastRuneSize)
		$.pointerValue<Reader>(b).lastByte = -1
		$.pointerValue<Reader>(b).lastRuneSize = -1
		return null
	}

	public async WriteTo(w: io.Writer | null): globalThis.Promise<[bigint, $.GoError]> {
		let b: Reader | $.VarRef<Reader> | null = this
		let n: bigint = 0n
		let err: $.GoError = null as $.GoError
		$.pointerValue<Reader>(b).lastByte = -1
		$.pointerValue<Reader>(b).lastRuneSize = -1

		if ($.pointerValue<Reader>(b).r < $.pointerValue<Reader>(b).w) {
			let __goscriptTuple6: any = await Reader.prototype.writeBuf.call(b, w)
			n = __goscriptTuple6[0]
			err = __goscriptTuple6[1]
			if (err != null) {
				return [n, err]
			}
		}

		{
			let [r, ok] = $.typeAssertTuple<io.WriterTo | null>($.pointerValue<Reader>(b).rd, "io.WriterTo")
			if (ok) {
				let [m, __goscriptShadow0] = await $.pointerValue<Exclude<io.WriterTo, null>>(r).WriteTo($.pointerValueOrNil(w)!)
				n = $.int64Add(n, m)
				return [n, __goscriptShadow0]
			}
		}

		let __goscriptShadow1 = w
		{
			let __goscriptTuple7: any = $.typeAssertTuple<io.ReaderFrom | null>(__goscriptShadow1, "io.ReaderFrom")
			let __goscriptShadow2 = __goscriptTuple7[0]
			let ok = __goscriptTuple7[1]
			if (ok) {
				let [m, __goscriptShadow3] = await $.pointerValue<Exclude<io.ReaderFrom, null>>(__goscriptShadow2).ReadFrom($.pointerValueOrNil($.pointerValue<Reader>(b).rd)!)
				n = $.int64Add(n, m)
				return [n, __goscriptShadow3]
			}
		}

		if (($.pointerValue<Reader>(b).w - $.pointerValue<Reader>(b).r) < $.len($.pointerValue<Reader>(b).buf)) {
			await Reader.prototype.fill.call(b)
		}

		while ($.pointerValue<Reader>(b).r < $.pointerValue<Reader>(b).w) {
			// b.r < b.w => buffer is not empty
			let [m, __goscriptShadow4] = await Reader.prototype.writeBuf.call(b, w)
			n = $.int64Add(n, m)
			if (__goscriptShadow4 != null) {
				return [n, __goscriptShadow4]
			}
			await Reader.prototype.fill.call(b)
		}

		if ($.comparableEqual($.pointerValue<Reader>(b).err, io.EOF)) {
			$.pointerValue<Reader>(b).err = null
		}

		return [n, Reader.prototype.readErr.call(b)]
	}

	public async collectFragments(delim: number): globalThis.Promise<[$.Slice<$.Slice<number>>, $.Slice<number>, number, $.GoError]> {
		const b: Reader | $.VarRef<Reader> | null = this
		let fullBuffers: $.Slice<$.Slice<number>> = null as $.Slice<$.Slice<number>>
		let finalFragment: $.Slice<number> = null as $.Slice<number>
		let totalLen: number = 0
		let err: $.GoError = null as $.GoError
		let frag: $.Slice<number> = null as $.Slice<number>
		// Use ReadSlice to look for delim, accumulating full buffers.
		while (true) {
			let e: $.GoError = null as $.GoError
			let __goscriptTuple8: any = await Reader.prototype.ReadSlice.call(b, $.uint(delim, 8))
			frag = __goscriptTuple8[0]
			e = __goscriptTuple8[1]
			if (e == null) {
				break
			}
			if (!$.comparableEqual(e, ErrBufferFull)) {
				err = e
				break
			}

			// Make a copy of the buffer.
			let buf: $.Slice<number> = bytes.Clone(frag)
			fullBuffers = $.append(fullBuffers, buf)
			totalLen = totalLen + ($.len(buf))
		}

		totalLen = totalLen + ($.len(frag))
		return [fullBuffers, frag, totalLen, err]
	}

	public async fill(): globalThis.Promise<void> {
		let b: Reader | $.VarRef<Reader> | null = this
		// Slide existing data to beginning.
		if ($.pointerValue<Reader>(b).r > 0) {
			$.copy($.pointerValue<Reader>(b).buf, $.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r, $.pointerValue<Reader>(b).w))
			$.pointerValue<Reader>(b).w = $.pointerValue<Reader>(b).w - ($.pointerValue<Reader>(b).r)
			$.pointerValue<Reader>(b).r = 0
		}

		if ($.pointerValue<Reader>(b).w >= $.len($.pointerValue<Reader>(b).buf)) {
			$.panic("bufio: tried to fill full buffer")
		}

		// Read new data: try a limited number of times.
		for (let i = 100; i > 0; i--) {
			let [n, err] = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<Reader>(b).rd).Read($.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).w, undefined))
			if (n < 0) {
				$.panic((errNegativeRead as any))
			}
			$.pointerValue<Reader>(b).w = $.pointerValue<Reader>(b).w + (n)
			if (err != null) {
				$.pointerValue<Reader>(b).err = err
				return
			}
			if (n > 0) {
				return
			}
		}
		$.pointerValue<Reader>(b).err = io.ErrNoProgress
	}

	public readErr(): $.GoError {
		let b: Reader | $.VarRef<Reader> | null = this
		let err = $.pointerValue<Reader>(b).err
		$.pointerValue<Reader>(b).err = null
		return err
	}

	public reset(buf: $.Slice<number>, r: io.Reader | null): void {
		let b: Reader | $.VarRef<Reader> | null = this
		$.assignStruct($.pointerValue<Reader>(b), $.markAsStructValue(new Reader({buf: buf, rd: r, lastByte: -1, lastRuneSize: -1})))
	}

	public async writeBuf(w: io.Writer | null): globalThis.Promise<[bigint, $.GoError]> {
		let b: Reader | $.VarRef<Reader> | null = this
		let [n, err] = await $.pointerValue<Exclude<io.Writer, null>>(w).Write($.goSlice($.pointerValue<Reader>(b).buf, $.pointerValue<Reader>(b).r, $.pointerValue<Reader>(b).w))
		if (n < 0) {
			$.panic((errNegativeWrite as any))
		}
		$.pointerValue<Reader>(b).r = $.pointerValue<Reader>(b).r + (n)
		return [$.int64(n), err]
	}

	static __typeInfo = $.registerStructType(
		"bufio.Reader",
		() => new Reader(),
		[{ name: "Buffered", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Discard", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "discarded", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Peek", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "ReadByte", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint8" } }, { name: "_r1", type: "error" }] }, { name: "ReadBytes", args: [{ name: "delim", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ReadLine", args: [], returns: [{ name: "line", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "isPrefix", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "err", type: "error" }] }, { name: "ReadRune", args: [], returns: [{ name: "r", type: { kind: $.TypeKind.Basic, name: "int32" } }, { name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "ReadSlice", args: [{ name: "delim", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "line", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "ReadString", args: [{ name: "delim", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: "error" }] }, { name: "Reset", args: [{ name: "r", type: "io.Reader" }], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "UnreadByte", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "UnreadRune", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteTo", args: [{ name: "w", type: "io.Writer" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "err", type: "error" }] }, { name: "collectFragments", args: [{ name: "delim", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "fullBuffers", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } }, { name: "finalFragment", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "totalLen", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "fill", args: [], returns: [] }, { name: "readErr", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "reset", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "r", type: "io.Reader" }], returns: [] }, { name: "writeBuf", args: [{ name: "w", type: "io.Writer" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }],
		Reader,
		[{ name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "bufio", index: [0], offset: 0, exported: false }, { name: "rd", key: "rd", type: "io.Reader", pkgPath: "bufio", index: [1], offset: 24, exported: false }, { name: "r", key: "r", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "bufio", index: [2], offset: 40, exported: false }, { name: "w", key: "w", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "bufio", index: [3], offset: 48, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "bufio", index: [4], offset: 56, exported: false }, { name: "lastByte", key: "lastByte", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "bufio", index: [5], offset: 72, exported: false }, { name: "lastRuneSize", key: "lastRuneSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "bufio", index: [6], offset: 80, exported: false }]
	)
}

export class Writer {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	public get wr(): io.Writer | null {
		return this._fields.wr.value
	}
	public set wr(value: io.Writer | null) {
		this._fields.wr.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>
		buf: $.VarRef<$.Slice<number>>
		n: $.VarRef<number>
		wr: $.VarRef<io.Writer | null>
	}

	constructor(init?: Partial<{err?: $.GoError, buf?: $.Slice<number>, n?: number, wr?: io.Writer | null}>) {
		this._fields = {
			err: $.varRef(init?.err ?? (null as unknown as $.GoError)),
			buf: $.varRef(init?.buf ?? (null as unknown as $.Slice<number>)),
			n: $.varRef(init?.n ?? (0 as unknown as number)),
			wr: $.varRef(init?.wr ?? (null as unknown as io.Writer | null))
		}
	}

	public clone(): Writer {
		const cloned = new Writer()
		cloned._fields = {
			err: $.varRef(this._fields.err.value),
			buf: $.varRef(this._fields.buf.value),
			n: $.varRef(this._fields.n.value),
			wr: $.varRef(this._fields.wr.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Available(): number {
		const b: Writer | $.VarRef<Writer> | null = this
		return $.len($.pointerValue<Writer>(b).buf) - $.pointerValue<Writer>(b).n
	}

	public AvailableBuffer(): $.Slice<number> {
		const b: Writer | $.VarRef<Writer> | null = this
		return $.goSlice($.goSlice($.pointerValue<Writer>(b).buf, $.pointerValue<Writer>(b).n, undefined), undefined, 0)
	}

	public Buffered(): number {
		const b: Writer | $.VarRef<Writer> | null = this
		return $.pointerValue<Writer>(b).n
	}

	public async Flush(): globalThis.Promise<$.GoError> {
		let b: Writer | $.VarRef<Writer> | null = this
		if ($.pointerValue<Writer>(b).err != null) {
			return $.pointerValue<Writer>(b).err
		}
		if ($.pointerValue<Writer>(b).n == 0) {
			return null
		}
		let __goscriptTuple10: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<Writer>(b).wr).Write($.goSlice($.pointerValue<Writer>(b).buf, 0, $.pointerValue<Writer>(b).n))
		let n = __goscriptTuple10[0]
		let err = __goscriptTuple10[1]
		if ((n < $.pointerValue<Writer>(b).n) && (err == null)) {
			err = io.ErrShortWrite
		}
		if (err != null) {
			if ((n > 0) && (n < $.pointerValue<Writer>(b).n)) {
				$.copy($.goSlice($.pointerValue<Writer>(b).buf, 0, $.pointerValue<Writer>(b).n - n), $.goSlice($.pointerValue<Writer>(b).buf, n, $.pointerValue<Writer>(b).n))
			}
			$.pointerValue<Writer>(b).n = $.pointerValue<Writer>(b).n - (n)
			$.pointerValue<Writer>(b).err = err
			return err
		}
		$.pointerValue<Writer>(b).n = 0
		return null
	}

	public async ReadFrom(r: io.Reader | null): globalThis.Promise<[bigint, $.GoError]> {
		let b: Writer | $.VarRef<Writer> | null = this
		let n: bigint = 0n
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<Writer>(b).err != null) {
			return [0n, $.pointerValue<Writer>(b).err]
		}
		let [readerFrom, readerFromOK] = $.typeAssertTuple<io.ReaderFrom | null>($.pointerValue<Writer>(b).wr, "io.ReaderFrom")
		let m: number = 0
		while (true) {
			if (Writer.prototype.Available.call(b) == 0) {
				{
					let err1 = await Writer.prototype.Flush.call(b)
					if (err1 != null) {
						return [n, err1]
					}
				}
			}
			if (readerFromOK && (Writer.prototype.Buffered.call(b) == 0)) {
				let [nn, __goscriptShadow5] = await $.pointerValue<Exclude<io.ReaderFrom, null>>(readerFrom).ReadFrom($.pointerValueOrNil(r)!)
				$.pointerValue<Writer>(b).err = __goscriptShadow5
				n = $.int64Add(n, nn)
				return [n, __goscriptShadow5]
			}
			let nr = 0
			while (nr < 100) {
				let __goscriptTuple11: any = await $.pointerValue<Exclude<io.Reader, null>>(r).Read($.goSlice($.pointerValue<Writer>(b).buf, $.pointerValue<Writer>(b).n, undefined))
				m = __goscriptTuple11[0]
				err = __goscriptTuple11[1]
				if ((m != 0) || (err != null)) {
					break
				}
				nr++
			}
			if (nr == 100) {
				return [n, io.ErrNoProgress]
			}
			$.pointerValue<Writer>(b).n = $.pointerValue<Writer>(b).n + (m)
			n = $.int64Add(n, $.int64(m))
			if (err != null) {
				break
			}
		}
		if ($.comparableEqual(err, io.EOF)) {
			// If we filled the buffer exactly, flush preemptively.
			if (Writer.prototype.Available.call(b) == 0) {
				err = await Writer.prototype.Flush.call(b)
			} else {
				err = null
			}
		}
		return [n, err]
	}

	public Reset(w: io.Writer | null): void {
		let b: Writer | $.VarRef<Writer> | null = this
		// If a Writer w is passed to NewWriter, NewWriter will return w.
		// Different layers of code may do that, and then later pass w
		// to Reset. Avoid infinite recursion in that case.
		if ($.comparableEqual(b, w)) {
			return
		}
		if ($.pointerValue<Writer>(b).buf == null) {
			$.pointerValue<Writer>(b).buf = $.makeSlice<number>(4096, undefined, "byte")
		}
		$.pointerValue<Writer>(b).err = null
		$.pointerValue<Writer>(b).n = 0
		$.pointerValue<Writer>(b).wr = w
	}

	public Size(): number {
		const b: Writer | $.VarRef<Writer> | null = this
		return $.len($.pointerValue<Writer>(b).buf)
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let b: Writer | $.VarRef<Writer> | null = this
		let nn: number = 0
		let err: $.GoError = null as $.GoError
		while (($.len(p) > Writer.prototype.Available.call(b)) && ($.pointerValue<Writer>(b).err == null)) {
			let n: number = 0
			if (Writer.prototype.Buffered.call(b) == 0) {
				// Large write, empty buffer.
				// Write directly from p to avoid copy.
				let __goscriptTuple12: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<Writer>(b).wr).Write(p)
				n = __goscriptTuple12[0]
				$.pointerValue<Writer>(b).err = __goscriptTuple12[1]
			} else {
				n = $.copy($.goSlice($.pointerValue<Writer>(b).buf, $.pointerValue<Writer>(b).n, undefined), p)
				$.pointerValue<Writer>(b).n = $.pointerValue<Writer>(b).n + (n)
				await Writer.prototype.Flush.call(b)
			}
			nn = nn + (n)
			p = $.goSlice(p, n, undefined)
		}
		if ($.pointerValue<Writer>(b).err != null) {
			return [nn, $.pointerValue<Writer>(b).err]
		}
		let n = $.copy($.goSlice($.pointerValue<Writer>(b).buf, $.pointerValue<Writer>(b).n, undefined), p)
		$.pointerValue<Writer>(b).n = $.pointerValue<Writer>(b).n + (n)
		nn = nn + (n)
		return [nn, null]
	}

	public async WriteByte(c: number): globalThis.Promise<$.GoError> {
		let b: Writer | $.VarRef<Writer> | null = this
		if ($.pointerValue<Writer>(b).err != null) {
			return $.pointerValue<Writer>(b).err
		}
		if ((Writer.prototype.Available.call(b) <= 0) && (await Writer.prototype.Flush.call(b) != null)) {
			return $.pointerValue<Writer>(b).err
		}
		$.pointerValue<Writer>(b).buf![$.pointerValue<Writer>(b).n] = $.uint(c, 8)
		$.pointerValue<Writer>(b).n++
		return null
	}

	public async WriteRune(r: number): globalThis.Promise<[number, $.GoError]> {
		let b: Writer | $.VarRef<Writer> | null = this
		let size: number = 0
		let err: $.GoError = null as $.GoError
		// Compare as uint32 to correctly handle negative runes.
		if ($.uint(r, 32) < utf8.RuneSelf) {
			err = await Writer.prototype.WriteByte.call(b, $.uint($.uint(r, 8), 8))
			if (err != null) {
				return [0, err]
			}
			return [1, null]
		}
		if ($.pointerValue<Writer>(b).err != null) {
			return [0, $.pointerValue<Writer>(b).err]
		}
		let n = Writer.prototype.Available.call(b)
		if (n < utf8.UTFMax) {
			{
				await Writer.prototype.Flush.call(b)
				if ($.pointerValue<Writer>(b).err != null) {
					return [0, $.pointerValue<Writer>(b).err]
				}
			}
			n = Writer.prototype.Available.call(b)
			if (n < utf8.UTFMax) {
				// Can only happen if buffer is silly small.
				return await Writer.prototype.WriteString.call(b, String.fromCodePoint(r))
			}
		}
		size = utf8.EncodeRune($.goSlice($.pointerValue<Writer>(b).buf, $.pointerValue<Writer>(b).n, undefined), $.int(r, 32))
		$.pointerValue<Writer>(b).n = $.pointerValue<Writer>(b).n + (size)
		return [size, null]
	}

	public async WriteString(s: string): globalThis.Promise<[number, $.GoError]> {
		let b: Writer | $.VarRef<Writer> | null = this
		let sw: io.StringWriter | null = null as io.StringWriter | null
		let tryStringWriter = true

		let nn = 0
		while (($.len(s) > Writer.prototype.Available.call(b)) && ($.pointerValue<Writer>(b).err == null)) {
			let n: number = 0
			if (((Writer.prototype.Buffered.call(b) == 0) && (sw == null)) && tryStringWriter) {
				// Check at most once whether b.wr is a StringWriter.
				let __goscriptTuple13: any = $.typeAssertTuple<io.StringWriter | null>($.pointerValue<Writer>(b).wr, "io.StringWriter")
				sw = __goscriptTuple13[0]
				tryStringWriter = __goscriptTuple13[1]
			}
			if ((Writer.prototype.Buffered.call(b) == 0) && tryStringWriter) {
				// Large write, empty buffer, and the underlying writer supports
				// WriteString: forward the write to the underlying StringWriter.
				// This avoids an extra copy.
				let __goscriptTuple14: any = await $.pointerValue<Exclude<io.StringWriter, null>>(sw).WriteString(s)
				n = __goscriptTuple14[0]
				$.pointerValue<Writer>(b).err = __goscriptTuple14[1]
			} else {
				n = $.copy($.goSlice($.pointerValue<Writer>(b).buf, $.pointerValue<Writer>(b).n, undefined), s)
				$.pointerValue<Writer>(b).n = $.pointerValue<Writer>(b).n + (n)
				await Writer.prototype.Flush.call(b)
			}
			nn = nn + (n)
			s = $.sliceStringOrBytes(s, n, undefined)
		}
		if ($.pointerValue<Writer>(b).err != null) {
			return [nn, $.pointerValue<Writer>(b).err]
		}
		let n = $.copy($.goSlice($.pointerValue<Writer>(b).buf, $.pointerValue<Writer>(b).n, undefined), s)
		$.pointerValue<Writer>(b).n = $.pointerValue<Writer>(b).n + (n)
		nn = nn + (n)
		return [nn, null]
	}

	static __typeInfo = $.registerStructType(
		"bufio.Writer",
		() => new Writer(),
		[{ name: "Available", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "AvailableBuffer", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Buffered", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Flush", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "ReadFrom", args: [{ name: "r", type: "io.Reader" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "err", type: "error" }] }, { name: "Reset", args: [{ name: "w", type: "io.Writer" }], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "nn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "WriteByte", args: [{ name: "c", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteRune", args: [{ name: "r", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [{ name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "WriteString", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		Writer,
		[{ name: "err", key: "err", type: "error", pkgPath: "bufio", index: [0], offset: 0, exported: false }, { name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "bufio", index: [1], offset: 16, exported: false }, { name: "n", key: "n", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "bufio", index: [2], offset: 40, exported: false }, { name: "wr", key: "wr", type: "io.Writer", pkgPath: "bufio", index: [3], offset: 48, exported: false }]
	)
}

export class ReadWriter {
	public get Reader(): Reader | $.VarRef<Reader> | null {
		return this._fields.Reader.value
	}
	public set Reader(value: Reader | $.VarRef<Reader> | null) {
		this._fields.Reader.value = value
	}

	public get Writer(): Writer | $.VarRef<Writer> | null {
		return this._fields.Writer.value
	}
	public set Writer(value: Writer | $.VarRef<Writer> | null) {
		this._fields.Writer.value = value
	}

	public _fields: {
		Reader: $.VarRef<Reader | $.VarRef<Reader> | null>
		Writer: $.VarRef<Writer | $.VarRef<Writer> | null>
	}

	constructor(init?: Partial<{Reader?: Reader | $.VarRef<Reader> | null, Writer?: Writer | $.VarRef<Writer> | null}>) {
		this._fields = {
			Reader: $.varRef(init?.Reader ?? (null as unknown as Reader | $.VarRef<Reader> | null)),
			Writer: $.varRef(init?.Writer ?? (null as unknown as Writer | $.VarRef<Writer> | null))
		}
	}

	public clone(): ReadWriter {
		const cloned = new ReadWriter()
		cloned._fields = {
			Reader: $.varRef(this._fields.Reader.value),
			Writer: $.varRef(this._fields.Writer.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Buffered(): any {
		return $.pointerValue<Reader>(this.Reader).Buffered()
	}

	public async Discard(n: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).Discard(n)
	}

	public async Peek(n: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).Peek(n)
	}

	public async Read(p: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).Read(p)
	}

	public async ReadByte(): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).ReadByte()
	}

	public async ReadBytes(delim: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).ReadBytes(delim)
	}

	public async ReadLine(): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).ReadLine()
	}

	public async ReadRune(): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).ReadRune()
	}

	public async ReadSlice(delim: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).ReadSlice(delim)
	}

	public async ReadString(delim: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).ReadString(delim)
	}

	public Reset(r: any): any {
		return $.pointerValue<Reader>(this.Reader).Reset(r)
	}

	public Size(): any {
		return $.pointerValue<Reader>(this.Reader).Size()
	}

	public UnreadByte(): any {
		return $.pointerValue<Reader>(this.Reader).UnreadByte()
	}

	public UnreadRune(): any {
		return $.pointerValue<Reader>(this.Reader).UnreadRune()
	}

	public async WriteTo(w: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).WriteTo(w)
	}

	public async collectFragments(delim: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).collectFragments(delim)
	}

	public async fill(): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).fill()
	}

	public readErr(): any {
		return $.pointerValue<Reader>(this.Reader).readErr()
	}

	public reset(buf: any, r: any): any {
		return $.pointerValue<Reader>(this.Reader).reset(buf, r)
	}

	public async writeBuf(w: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).writeBuf(w)
	}

	public Available(): any {
		return $.pointerValue<Writer>(this.Writer).Available()
	}

	public AvailableBuffer(): any {
		return $.pointerValue<Writer>(this.Writer).AvailableBuffer()
	}

	public async Flush(): globalThis.Promise<any> {
		return await $.pointerValue<Writer>(this.Writer).Flush()
	}

	public async ReadFrom(r: any): globalThis.Promise<any> {
		return await $.pointerValue<Writer>(this.Writer).ReadFrom(r)
	}

	public async Write(p: any): globalThis.Promise<any> {
		return await $.pointerValue<Writer>(this.Writer).Write(p)
	}

	public async WriteByte(c: any): globalThis.Promise<any> {
		return await $.pointerValue<Writer>(this.Writer).WriteByte(c)
	}

	public async WriteRune(r: any): globalThis.Promise<any> {
		return await $.pointerValue<Writer>(this.Writer).WriteRune(r)
	}

	public async WriteString(s: any): globalThis.Promise<any> {
		return await $.pointerValue<Writer>(this.Writer).WriteString(s)
	}

	static __typeInfo = $.registerStructType(
		"bufio.ReadWriter",
		() => new ReadWriter(),
		[{ name: "Buffered", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Discard", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "discarded", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Peek", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "ReadByte", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint8" } }, { name: "_r1", type: "error" }] }, { name: "ReadBytes", args: [{ name: "delim", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ReadLine", args: [], returns: [{ name: "line", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "isPrefix", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "err", type: "error" }] }, { name: "ReadRune", args: [], returns: [{ name: "r", type: { kind: $.TypeKind.Basic, name: "int32" } }, { name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "ReadSlice", args: [{ name: "delim", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "line", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "ReadString", args: [{ name: "delim", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: "error" }] }, { name: "Reset", args: [{ name: "r", type: "io.Reader" }], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "UnreadByte", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "UnreadRune", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteTo", args: [{ name: "w", type: "io.Writer" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "err", type: "error" }] }, { name: "collectFragments", args: [{ name: "delim", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "fullBuffers", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } }, { name: "finalFragment", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "totalLen", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "fill", args: [], returns: [] }, { name: "readErr", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "reset", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "r", type: "io.Reader" }], returns: [] }, { name: "writeBuf", args: [{ name: "w", type: "io.Writer" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: "error" }] }, { name: "Available", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "AvailableBuffer", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Flush", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "ReadFrom", args: [{ name: "r", type: "io.Reader" }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "err", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "nn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "WriteByte", args: [{ name: "c", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "WriteRune", args: [{ name: "r", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [{ name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "WriteString", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		ReadWriter,
		[{ name: "Reader", key: "Reader", type: { kind: $.TypeKind.Pointer, elemType: "bufio.Reader" }, anonymous: true, index: [0], offset: 0, exported: true }, { name: "Writer", key: "Writer", type: { kind: $.TypeKind.Pointer, elemType: "bufio.Writer" }, anonymous: true, index: [1], offset: 8, exported: true }]
	)
}

export const defaultBufSize: number = 4096

export const minReadBufferSize: number = 16

export const maxConsecutiveEmptyReads: number = 100

export let ErrInvalidUnreadByte: $.GoError = errors.New("bufio: invalid use of UnreadByte")

export function __goscript_set_ErrInvalidUnreadByte(__goscriptValue: $.GoError): void {
	ErrInvalidUnreadByte = __goscriptValue
}

export let ErrInvalidUnreadRune: $.GoError = errors.New("bufio: invalid use of UnreadRune")

export function __goscript_set_ErrInvalidUnreadRune(__goscriptValue: $.GoError): void {
	ErrInvalidUnreadRune = __goscriptValue
}

export let ErrBufferFull: $.GoError = errors.New("bufio: buffer full")

export function __goscript_set_ErrBufferFull(__goscriptValue: $.GoError): void {
	ErrBufferFull = __goscriptValue
}

export let ErrNegativeCount: $.GoError = errors.New("bufio: negative count")

export function __goscript_set_ErrNegativeCount(__goscriptValue: $.GoError): void {
	ErrNegativeCount = __goscriptValue
}

export function NewReaderSize(rd: io.Reader | null, size: number): Reader | $.VarRef<Reader> | null {
	// Is it already a Reader?
	let __goscriptTuple9: any = $.typeAssertTuple<Reader | $.VarRef<Reader> | null>(rd, { kind: $.TypeKind.Pointer, elemType: "bufio.Reader" })
	let b: Reader | $.VarRef<Reader> | null = __goscriptTuple9[0]
	let ok = __goscriptTuple9[1]
	if (ok && ($.len($.pointerValue<Reader>(b).buf) >= size)) {
		return b
	}
	let r: Reader | $.VarRef<Reader> | null = new Reader()
	Reader.prototype.reset.call(r, $.makeSlice<number>($.max(size, 16), undefined, "byte"), rd)
	return r
}

export function NewReader(rd: io.Reader | null): Reader | $.VarRef<Reader> | null {
	return NewReaderSize(rd, 4096)
}

export let errNegativeRead: $.GoError = errors.New("bufio: reader returned negative count from Read")

export function __goscript_set_errNegativeRead(__goscriptValue: $.GoError): void {
	errNegativeRead = __goscriptValue
}

export let errNegativeWrite: $.GoError = errors.New("bufio: writer returned negative count from Write")

export function __goscript_set_errNegativeWrite(__goscriptValue: $.GoError): void {
	errNegativeWrite = __goscriptValue
}

export function NewWriterSize(w: io.Writer | null, size: number): Writer | $.VarRef<Writer> | null {
	// Is it already a Writer?
	let __goscriptTuple15: any = $.typeAssertTuple<Writer | $.VarRef<Writer> | null>(w, { kind: $.TypeKind.Pointer, elemType: "bufio.Writer" })
	let b: Writer | $.VarRef<Writer> | null = __goscriptTuple15[0]
	let ok = __goscriptTuple15[1]
	if (ok && ($.len($.pointerValue<Writer>(b).buf) >= size)) {
		return b
	}
	if (size <= 0) {
		size = 4096
	}
	return new Writer({buf: $.makeSlice<number>(size, undefined, "byte"), wr: w})
}

export function NewWriter(w: io.Writer | null): Writer | $.VarRef<Writer> | null {
	return NewWriterSize(w, 4096)
}

export function NewReadWriter(r: Reader | $.VarRef<Reader> | null, w: Writer | $.VarRef<Writer> | null): ReadWriter | $.VarRef<ReadWriter> | null {
	return new ReadWriter({Reader: r, Writer: w})
}
