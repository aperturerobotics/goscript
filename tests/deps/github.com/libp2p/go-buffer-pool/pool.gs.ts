// Generated file based on pool.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/math/index.js"
import "@goscript/math/bits/index.js"
import "@goscript/sync/index.js"

export class BufferPool {
	public get pools(): sync.Pool[] {
		return this._fields.pools.value
	}
	public set pools(value: sync.Pool[]) {
		this._fields.pools.value = value
	}

	public get ptrs(): sync.Pool {
		return this._fields.ptrs.value
	}
	public set ptrs(value: sync.Pool) {
		this._fields.ptrs.value = value
	}

	public _fields: {
		pools: $.VarRef<sync.Pool[]>
		ptrs: $.VarRef<sync.Pool>
	}

	constructor(init?: Partial<{pools?: sync.Pool[], ptrs?: sync.Pool}>) {
		this._fields = {
			pools: $.varRef(init?.pools !== undefined ? $.cloneArrayValue(init.pools) : Array.from({ length: 32 }, () => $.markAsStructValue(new sync.Pool()))),
			ptrs: $.varRef(init?.ptrs ? $.markAsStructValue($.cloneStructValue(init.ptrs)) : $.markAsStructValue(new sync.Pool()))
		}
	}

	public clone(): BufferPool {
		const cloned = new BufferPool()
		cloned._fields = {
			pools: $.varRef($.cloneArrayValue(this._fields.pools.value)),
			ptrs: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ptrs.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Get(length: number): globalThis.Promise<$.Slice<number>> {
		const p: BufferPool | $.VarRef<BufferPool> | null = this
		if (length == 0) {
			return null
		}
		// Calling this function with a negative length is invalid.
		// make will panic if length is negative, so we don't have to.
		if ((length > 2147483647) || (length < 0)) {
			return $.makeSlice<number>(length, undefined, "byte")
		}
		let idx = $.uint(nextLogBase2($.uint($.uint(length, 32), 32)), 32)
		{
			let ptr = await $.pointerValue<BufferPool>(p).pools[idx].Get()
			if (ptr != null) {
				let bp: bufp | $.VarRef<bufp> | null = $.mustTypeAssert<bufp | $.VarRef<bufp> | null>(ptr, { kind: $.TypeKind.Pointer, elemType: "pool.bufp" })
				let buf: $.Slice<number> = $.goSlice($.pointerValue<bufp>(bp).buf, undefined, $.uint(length, 32))
				$.pointerValue<bufp>(bp).buf = null
				$.pointerValue<BufferPool>(p).ptrs.Put(ptr)
				return buf
			}
		}
		return $.goSlice($.makeSlice<number>(1 << idx, undefined, "byte"), undefined, $.uint(length, 32))
	}

	public async Put(buf: $.Slice<number>): globalThis.Promise<void> {
		const p: BufferPool | $.VarRef<BufferPool> | null = this
		let capacity = $.cap(buf)
		if ((capacity == 0) || (capacity > 2147483647)) {
			return
		}
		let idx = $.uint(prevLogBase2($.uint($.uint(capacity, 32), 32)), 32)
		let bp: bufp | $.VarRef<bufp> | null = null as bufp | $.VarRef<bufp> | null
		{
			let ptr = await $.pointerValue<BufferPool>(p).ptrs.Get()
			if (ptr != null) {
				bp = $.mustTypeAssert<bufp | $.VarRef<bufp> | null>(ptr, { kind: $.TypeKind.Pointer, elemType: "pool.bufp" })
			} else {
				bp = new bufp()
			}
		}
		$.pointerValue<bufp>(bp).buf = buf
		$.pointerValue<BufferPool>(p).pools[idx].Put($.interfaceValue<any>(bp, "*pool.bufp"))
	}

	static __typeInfo = $.registerStructType(
		"pool.BufferPool",
		() => new BufferPool(),
		[{ name: "Get", args: [{ name: "length", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Put", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }],
		BufferPool,
		[{ name: "pools", key: "pools", type: { kind: $.TypeKind.Array, elemType: "sync.Pool", length: 32 }, pkgPath: "github.com/libp2p/go-buffer-pool", index: [0], offset: 0, exported: false }, { name: "ptrs", key: "ptrs", type: "sync.Pool", pkgPath: "github.com/libp2p/go-buffer-pool", index: [1], offset: 1280, exported: false }]
	)
}

export class bufp {
	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public _fields: {
		buf: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{buf?: $.Slice<number>}>) {
		this._fields = {
			buf: $.varRef(init?.buf ?? (null as unknown as $.Slice<number>))
		}
	}

	public clone(): bufp {
		const cloned = new bufp()
		cloned._fields = {
			buf: $.varRef(this._fields.buf.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"pool.bufp",
		() => new bufp(),
		[],
		bufp,
		[{ name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/libp2p/go-buffer-pool", index: [0], offset: 0, exported: false }]
	)
}

export const MaxLength: number = 2147483647

export let GlobalPool: BufferPool | $.VarRef<BufferPool> | null = new BufferPool()

export function __goscript_set_GlobalPool(__goscriptValue: BufferPool | $.VarRef<BufferPool> | null): void {
	GlobalPool = __goscriptValue
}

export async function Get(length: number): globalThis.Promise<$.Slice<number>> {
	return await BufferPool.prototype.Get.call(GlobalPool, length)
}

export async function Put(slice: $.Slice<number>): globalThis.Promise<void> {
	await BufferPool.prototype.Put.call(GlobalPool, slice)
}

export function nextLogBase2(v: number): number {
	return $.uint($.uint(bits.Len32($.uint(v - 1, 32)), 32), 32)
}

export function prevLogBase2(num: number): number {
	let next = $.uint(nextLogBase2($.uint(num, 32)), 32)
	if ($.uint(num, 32) == $.uint((1 << $.uint(next, 32)), 32)) {
		return $.uint(next, 32)
	}
	return $.uint(next - 1, 32)
}
