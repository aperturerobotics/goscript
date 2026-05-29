// Generated file based on buffer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_pool from "./pool.gs.ts"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "./pool.gs.ts"

export class Buffer {
	// Pool is the buffer pool to use. If nil, this Buffer will use the
	// global buffer pool.
	public get Pool(): __goscript_pool.BufferPool | $.VarRef<__goscript_pool.BufferPool> | null {
		return this._fields.Pool.value
	}
	public set Pool(value: __goscript_pool.BufferPool | $.VarRef<__goscript_pool.BufferPool> | null) {
		this._fields.Pool.value = value
	}

	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public get rOff(): number {
		return this._fields.rOff.value
	}
	public set rOff(value: number) {
		this._fields.rOff.value = value
	}

	// Preallocated slice for samll reads/writes.
	// This is *really* important for performance and only costs 8 words.
	public get bootstrap(): Uint8Array {
		return this._fields.bootstrap.value
	}
	public set bootstrap(value: Uint8Array) {
		this._fields.bootstrap.value = value
	}

	public _fields: {
		Pool: $.VarRef<__goscript_pool.BufferPool | $.VarRef<__goscript_pool.BufferPool> | null>
		buf: $.VarRef<$.Slice<number>>
		rOff: $.VarRef<number>
		bootstrap: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{Pool?: __goscript_pool.BufferPool | $.VarRef<__goscript_pool.BufferPool> | null, buf?: $.Slice<number>, rOff?: number, bootstrap?: Uint8Array}>) {
		this._fields = {
			Pool: $.varRef(init?.Pool ?? null),
			buf: $.varRef(init?.buf ?? null),
			rOff: $.varRef(init?.rOff ?? 0),
			bootstrap: $.varRef(init?.bootstrap !== undefined ? $.cloneArrayValue(init.bootstrap) : new Uint8Array(64))
		}
	}

	public clone(): Buffer {
		const cloned = new Buffer()
		cloned._fields = {
			Pool: $.varRef(this._fields.Pool.value),
			buf: $.varRef(this._fields.buf.value),
			rOff: $.varRef(this._fields.rOff.value),
			bootstrap: $.varRef($.cloneArrayValue(this._fields.bootstrap.value))
		}
		return $.markAsStructValue(cloned)
	}

	public Bytes(): $.Slice<number> {
		const b: Buffer | $.VarRef<Buffer> | null = this
		return $.goSlice($.pointerValue<Buffer>(b).buf, $.pointerValue<Buffer>(b).rOff, undefined)
	}

	public Cap(): number {
		const b: Buffer | $.VarRef<Buffer> | null = this
		return $.cap($.pointerValue<Buffer>(b).buf)
	}

	public async Grow(n: number): globalThis.Promise<void> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		let wOff = await Buffer.prototype.grow.call(b, n)
		$.pointerValue<Buffer>(b).buf = $.goSlice($.pointerValue<Buffer>(b).buf, undefined, wOff)
	}

	public Len(): number {
		const b: Buffer | $.VarRef<Buffer> | null = this
		return $.len($.pointerValue<Buffer>(b).buf) - $.pointerValue<Buffer>(b).rOff
	}

	public Next(n: number): $.Slice<number> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		let m = Buffer.prototype.Len.call(b)
		if (m < n) {
			n = m
		}
		let data: $.Slice<number> = $.goSlice($.pointerValue<Buffer>(b).buf, $.pointerValue<Buffer>(b).rOff, $.pointerValue<Buffer>(b).rOff + n)
		$.pointerValue<Buffer>(b).rOff = $.pointerValue<Buffer>(b).rOff + (n)
		return data
	}

	public async Read(buf: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		if ($.len(buf) == 0) {
			return [0, null]
		}
		if ($.pointerValue<Buffer>(b).rOff >= $.len($.pointerValue<Buffer>(b).buf)) {
			return [0, io.EOF]
		}
		let n = $.copy(buf, $.goSlice($.pointerValue<Buffer>(b).buf, $.pointerValue<Buffer>(b).rOff, undefined))
		$.pointerValue<Buffer>(b).rOff = $.pointerValue<Buffer>(b).rOff + (n)
		await Buffer.prototype.shrink.call(b)
		return [n, null]
	}

	public ReadByte(): [number, $.GoError] {
		let b: Buffer | $.VarRef<Buffer> | null = this
		if ($.pointerValue<Buffer>(b).rOff >= $.len($.pointerValue<Buffer>(b).buf)) {
			return [$.uint(0, 8), io.EOF]
		}
		let c = $.uint($.pointerValue<Buffer>(b).buf![$.pointerValue<Buffer>(b).rOff], 8)
		$.pointerValue<Buffer>(b).rOff++
		return [$.uint(c, 8), null]
	}

	public async ReadFrom(r: io.Reader | null): globalThis.Promise<[number, $.GoError]> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		let n = $.int($.int(0))
		while (true) {
			let wOff = await Buffer.prototype.grow.call(b, 512)
			// Use *entire* buffer.
			$.pointerValue<Buffer>(b).buf = $.goSlice($.pointerValue<Buffer>(b).buf, undefined, $.cap($.pointerValue<Buffer>(b).buf))

			let [read, err] = await $.pointerValue<Exclude<io.Reader, null>>(r).Read($.goSlice($.pointerValue<Buffer>(b).buf, wOff, undefined))
			$.pointerValue<Buffer>(b).buf = $.goSlice($.pointerValue<Buffer>(b).buf, undefined, wOff + read)
			n = $.int64Add(n, $.int($.int(read)))
			{
				let __goscriptSwitch0 = err
				switch (true) {
					case $.comparableEqual(__goscriptSwitch0, null):
					{
						break
					}
					case $.comparableEqual(__goscriptSwitch0, io.EOF):
					{
						err = null
					}
					default:
					{
						await Buffer.prototype.shrink.call(b)
						return [$.int(n), err]
						break
					}
				}
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Reset(): globalThis.Promise<void> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		await Buffer.prototype.returnBuf.call(b)
		$.pointerValue<Buffer>(b).rOff = 0
	}

	public String(): string {
		const b: Buffer | $.VarRef<Buffer> | null = this
		if (b == null) {
			return "<nil>"
		}
		return $.bytesToString($.goSlice($.pointerValue<Buffer>(b).buf, $.pointerValue<Buffer>(b).rOff, undefined))
	}

	public async Truncate(n: number): globalThis.Promise<void> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		if ((n < 0) || (n > Buffer.prototype.Len.call(b))) {
			$.panic("truncation out of range")
		}
		$.pointerValue<Buffer>(b).buf = $.goSlice($.pointerValue<Buffer>(b).buf, undefined, $.pointerValue<Buffer>(b).rOff + n)
		await Buffer.prototype.shrink.call(b)
	}

	public async Write(buf: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const b: Buffer | $.VarRef<Buffer> | null = this
		let wOff = await Buffer.prototype.grow.call(b, $.len(buf))
		return [$.copy($.goSlice($.pointerValue<Buffer>(b).buf, wOff, undefined), buf), null]
	}

	public async WriteByte(c: number): globalThis.Promise<$.GoError> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		let wOff = await Buffer.prototype.grow.call(b, 1)
		$.pointerValue<Buffer>(b).buf![wOff] = $.uint(c, 8)
		return null
	}

	public async WriteString(buf: string): globalThis.Promise<[number, $.GoError]> {
		const b: Buffer | $.VarRef<Buffer> | null = this
		let wOff = await Buffer.prototype.grow.call(b, $.len(buf))
		return [$.copy($.goSlice($.pointerValue<Buffer>(b).buf, wOff, undefined), buf), null]
	}

	public async WriteTo(w: io.Writer | null): globalThis.Promise<[number, $.GoError]> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		if ($.pointerValue<Buffer>(b).rOff < $.len($.pointerValue<Buffer>(b).buf)) {
			let [n, err] = await $.pointerValue<Exclude<io.Writer, null>>(w).Write($.goSlice($.pointerValue<Buffer>(b).buf, $.pointerValue<Buffer>(b).rOff, undefined))
			$.pointerValue<Buffer>(b).rOff = $.pointerValue<Buffer>(b).rOff + (n)
			if ($.pointerValue<Buffer>(b).rOff > $.len($.pointerValue<Buffer>(b).buf)) {
				$.panic("invalid write count")
			}
			await Buffer.prototype.shrink.call(b)
			return [$.int($.int(n)), err]
		}
		return [$.int(0), null]
	}

	public async getBuf(n: number): globalThis.Promise<$.Slice<number>> {
		const b: Buffer | $.VarRef<Buffer> | null = this
		if (n <= $.len($.pointerValue<Buffer>(b).bootstrap)) {
			return $.goSlice($.pointerValue<Buffer>(b).bootstrap, undefined, n)
		}
		return await __goscript_pool.BufferPool.prototype.Get.call(Buffer.prototype.getPool.call(b), n)
	}

	public getPool(): __goscript_pool.BufferPool | $.VarRef<__goscript_pool.BufferPool> | null {
		const b: Buffer | $.VarRef<Buffer> | null = this
		if ($.pointerValue<Buffer>(b).Pool == null) {
			return __goscript_pool.GlobalPool
		}
		return $.pointerValue<Buffer>(b).Pool
	}

	public async grow(n: number): globalThis.Promise<number> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		let wOff = $.len($.pointerValue<Buffer>(b).buf)
		let bCap = $.cap($.pointerValue<Buffer>(b).buf)

		if (bCap >= (wOff + n)) {
			$.pointerValue<Buffer>(b).buf = $.goSlice($.pointerValue<Buffer>(b).buf, undefined, wOff + n)
			return wOff
		}

		let bSize = Buffer.prototype.Len.call(b)

		let minCap = (2 * bSize) + n

		// Slide if cap >= minCap.
		// Reallocate otherwise.
		if (bCap >= minCap) {
			$.copy($.pointerValue<Buffer>(b).buf, $.goSlice($.pointerValue<Buffer>(b).buf, $.pointerValue<Buffer>(b).rOff, undefined))
		} else {
			// Needs new buffer.
			let newBuf: $.Slice<number> = await Buffer.prototype.getBuf.call(b, minCap)
			$.copy(newBuf, $.goSlice($.pointerValue<Buffer>(b).buf, $.pointerValue<Buffer>(b).rOff, undefined))
			await Buffer.prototype.returnBuf.call(b)
			$.pointerValue<Buffer>(b).buf = newBuf
		}

		$.pointerValue<Buffer>(b).rOff = 0
		$.pointerValue<Buffer>(b).buf = $.goSlice($.pointerValue<Buffer>(b).buf, undefined, bSize + n)
		return bSize
	}

	public async returnBuf(): globalThis.Promise<void> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		if ($.cap($.pointerValue<Buffer>(b).buf) > $.len($.pointerValue<Buffer>(b).bootstrap)) {
			await __goscript_pool.BufferPool.prototype.Put.call(Buffer.prototype.getPool.call(b), $.pointerValue<Buffer>(b).buf)
		}
		$.pointerValue<Buffer>(b).buf = null
	}

	public async shrink(): globalThis.Promise<void> {
		let b: Buffer | $.VarRef<Buffer> | null = this
		let c = Buffer.prototype.Cap.call(b)
		// Either nil or bootstrap.
		if (c <= $.len($.pointerValue<Buffer>(b).bootstrap)) {
			return
		}

		let l = Buffer.prototype.Len.call(b)
		if (l == 0) {
			// Shortcut if empty.
			await Buffer.prototype.returnBuf.call(b)
			$.pointerValue<Buffer>(b).rOff = 0
		} else {
			if ((l * 8) < c) {
				// Only shrink when capacity > 8x length. Avoids shrinking too aggressively.
				let newBuf: $.Slice<number> = await Buffer.prototype.getBuf.call(b, l)
				$.copy(newBuf, $.goSlice($.pointerValue<Buffer>(b).buf, $.pointerValue<Buffer>(b).rOff, undefined))
				await Buffer.prototype.returnBuf.call(b)
				$.pointerValue<Buffer>(b).rOff = 0
				$.pointerValue<Buffer>(b).buf = $.goSlice(newBuf, undefined, l)
			}
		}
	}

	static __typeInfo = $.registerStructType(
		"pool.Buffer",
		() => new Buffer(),
		[{ name: "Bytes", args: [], returns: [] }, { name: "Cap", args: [], returns: [] }, { name: "Grow", args: [], returns: [] }, { name: "Len", args: [], returns: [] }, { name: "Next", args: [], returns: [] }, { name: "Read", args: [], returns: [] }, { name: "ReadByte", args: [], returns: [] }, { name: "ReadFrom", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "Truncate", args: [], returns: [] }, { name: "Write", args: [], returns: [] }, { name: "WriteByte", args: [], returns: [] }, { name: "WriteString", args: [], returns: [] }, { name: "WriteTo", args: [], returns: [] }, { name: "getBuf", args: [], returns: [] }, { name: "getPool", args: [], returns: [] }, { name: "grow", args: [], returns: [] }, { name: "returnBuf", args: [], returns: [] }, { name: "shrink", args: [], returns: [] }],
		Buffer,
		{"Pool": { kind: $.TypeKind.Pointer, elemType: "pool.BufferPool" }, "buf": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "rOff": { kind: $.TypeKind.Basic, name: "int" }, "bootstrap": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 64 }}
	)
}

export const MinRead: number = 512

export async function NewBuffer(buf: $.Slice<number>): globalThis.Promise<Buffer | $.VarRef<Buffer> | null> {
	let b: Buffer | $.VarRef<Buffer> | null = new Buffer()
	if ($.len(buf) > 0) {
		$.pointerValue<Buffer>(b).buf = await Buffer.prototype.getBuf.call(b, $.len(buf))
		$.copy($.pointerValue<Buffer>(b).buf, buf)
	}
	return b
}

export async function NewBufferString(buf: string): globalThis.Promise<Buffer | $.VarRef<Buffer> | null> {
	let b: Buffer | $.VarRef<Buffer> | null = new Buffer()
	if ($.len(buf) > 0) {
		$.pointerValue<Buffer>(b).buf = await Buffer.prototype.getBuf.call(b, $.len(buf))
		$.copy($.pointerValue<Buffer>(b).buf, buf)
	}
	return b
}
