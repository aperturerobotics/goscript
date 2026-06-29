// Generated file based on binary.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as math from "@goscript/math/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as slices from "@goscript/slices/index.js"

import * as sync from "@goscript/sync/index.js"

import type * as __goscript_native_endian_little from "./native_endian_little.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/math/index.js"
import "@goscript/reflect/index.js"
import "@goscript/slices/index.js"
import "@goscript/sync/index.js"

export type ByteOrder = {
	PutUint16(_p0: $.Slice<number>, _p1: number): void
	PutUint32(_p0: $.Slice<number>, _p1: number): void
	PutUint64(_p0: $.Slice<number>, _p1: number): void
	String(): string
	Uint16(_p0: $.Slice<number>): number
	Uint32(_p0: $.Slice<number>): number
	Uint64(_p0: $.Slice<number>): number
}

$.registerInterfaceType(
	"binary.ByteOrder",
	null,
	[{ name: "PutUint16", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_p1", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [] }, { name: "PutUint32", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_p1", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [] }, { name: "PutUint64", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_p1", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Uint16", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "Uint32", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Uint64", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }]
);

export type AppendByteOrder = {
	AppendUint16(_p0: $.Slice<number>, _p1: number): $.Slice<number>
	AppendUint32(_p0: $.Slice<number>, _p1: number): $.Slice<number>
	AppendUint64(_p0: $.Slice<number>, _p1: number): $.Slice<number>
	String(): string
}

$.registerInterfaceType(
	"binary.AppendByteOrder",
	null,
	[{ name: "AppendUint16", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_p1", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendUint32", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_p1", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendUint64", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_p1", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export class littleEndian {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): littleEndian {
		const cloned = new littleEndian()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public AppendUint16(b: $.Slice<number>, v: number): $.Slice<number> {
		return $.append(b, $.uint($.uint(v, 8), 8), $.uint($.uint($.uintShr(v, 8, 16), 8), 8))
	}

	public AppendUint32(b: $.Slice<number>, v: number): $.Slice<number> {
		return $.append(b, $.uint($.uint(v, 8), 8), $.uint($.uint($.uintShr(v, 8, 32), 8), 8), $.uint($.uint($.uintShr(v, 16, 32), 8), 8), $.uint($.uint($.uintShr(v, 24, 32), 8), 8))
	}

	public AppendUint64(b: $.Slice<number>, v: number): $.Slice<number> {
		return $.append(b, $.uint($.uint(v, 8), 8), $.uint($.uint($.uint64Shr(v, 8), 8), 8), $.uint($.uint($.uint64Shr(v, 16), 8), 8), $.uint($.uint($.uint64Shr(v, 24), 8), 8), $.uint($.uint($.uint64Shr(v, 32), 8), 8), $.uint($.uint($.uint64Shr(v, 40), 8), 8), $.uint($.uint($.uint64Shr(v, 48), 8), 8), $.uint($.uint($.uint64Shr(v, 56), 8), 8))
	}

	public GoString(): string {
		return "binary.LittleEndian"
	}

	public PutUint16(b: $.Slice<number>, v: number): void {
		b![1]
		b![0] = $.uint($.uint(v, 8), 8)
		b![1] = $.uint($.uint($.uintShr(v, 8, 16), 8), 8)
	}

	public PutUint32(b: $.Slice<number>, v: number): void {
		b![3]
		b![0] = $.uint($.uint(v, 8), 8)
		b![1] = $.uint($.uint($.uintShr(v, 8, 32), 8), 8)
		b![2] = $.uint($.uint($.uintShr(v, 16, 32), 8), 8)
		b![3] = $.uint($.uint($.uintShr(v, 24, 32), 8), 8)
	}

	public PutUint64(b: $.Slice<number>, v: number): void {
		b![7]
		b![0] = $.uint($.uint(v, 8), 8)
		b![1] = $.uint($.uint($.uint64Shr(v, 8), 8), 8)
		b![2] = $.uint($.uint($.uint64Shr(v, 16), 8), 8)
		b![3] = $.uint($.uint($.uint64Shr(v, 24), 8), 8)
		b![4] = $.uint($.uint($.uint64Shr(v, 32), 8), 8)
		b![5] = $.uint($.uint($.uint64Shr(v, 40), 8), 8)
		b![6] = $.uint($.uint($.uint64Shr(v, 48), 8), 8)
		b![7] = $.uint($.uint($.uint64Shr(v, 56), 8), 8)
	}

	public String(): string {
		return "LittleEndian"
	}

	public Uint16(b: $.Slice<number>): number {
		b![1]
		return $.uint($.uint(b![0], 16) | ($.uint(b![1], 16) << 8), 16)
	}

	public Uint32(b: $.Slice<number>): number {
		b![3]
		return $.uint((($.uint(b![0], 32) | ($.uint(b![1], 32) << 8)) | ($.uint(b![2], 32) << 16)) | ($.uint(b![3], 32) << 24), 32)
	}

	public Uint64(b: $.Slice<number>): number {
		b![7]
		return $.uint($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or($.uint(b![0], 64), ($.uint64Shl($.uint(b![1], 64), 8)))), ($.uint64Shl($.uint(b![2], 64), 16)))), ($.uint64Shl($.uint(b![3], 64), 24)))), ($.uint64Mul($.uint(b![4], 64), (2 ** 32))))), ($.uint64Mul($.uint(b![5], 64), (2 ** 40))))), ($.uint64Mul($.uint(b![6], 64), (2 ** 48))))), ($.uint64Mul($.uint(b![7], 64), (2 ** 56)))), 64)
	}

	static __typeInfo = $.registerStructType(
		"binary.littleEndian",
		() => new littleEndian(),
		[{ name: "AppendUint16", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendUint32", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendUint64", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "GoString", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "PutUint16", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [] }, { name: "PutUint32", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [] }, { name: "PutUint64", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Uint16", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "Uint32", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Uint64", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }],
		littleEndian,
		[]
	)
}

export class bigEndian {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): bigEndian {
		const cloned = new bigEndian()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public AppendUint16(b: $.Slice<number>, v: number): $.Slice<number> {
		return $.append(b, $.uint($.uint($.uintShr(v, 8, 16), 8), 8), $.uint($.uint(v, 8), 8))
	}

	public AppendUint32(b: $.Slice<number>, v: number): $.Slice<number> {
		return $.append(b, $.uint($.uint($.uintShr(v, 24, 32), 8), 8), $.uint($.uint($.uintShr(v, 16, 32), 8), 8), $.uint($.uint($.uintShr(v, 8, 32), 8), 8), $.uint($.uint(v, 8), 8))
	}

	public AppendUint64(b: $.Slice<number>, v: number): $.Slice<number> {
		return $.append(b, $.uint($.uint($.uint64Shr(v, 56), 8), 8), $.uint($.uint($.uint64Shr(v, 48), 8), 8), $.uint($.uint($.uint64Shr(v, 40), 8), 8), $.uint($.uint($.uint64Shr(v, 32), 8), 8), $.uint($.uint($.uint64Shr(v, 24), 8), 8), $.uint($.uint($.uint64Shr(v, 16), 8), 8), $.uint($.uint($.uint64Shr(v, 8), 8), 8), $.uint($.uint(v, 8), 8))
	}

	public GoString(): string {
		return "binary.BigEndian"
	}

	public PutUint16(b: $.Slice<number>, v: number): void {
		b![1]
		b![0] = $.uint($.uint($.uintShr(v, 8, 16), 8), 8)
		b![1] = $.uint($.uint(v, 8), 8)
	}

	public PutUint32(b: $.Slice<number>, v: number): void {
		b![3]
		b![0] = $.uint($.uint($.uintShr(v, 24, 32), 8), 8)
		b![1] = $.uint($.uint($.uintShr(v, 16, 32), 8), 8)
		b![2] = $.uint($.uint($.uintShr(v, 8, 32), 8), 8)
		b![3] = $.uint($.uint(v, 8), 8)
	}

	public PutUint64(b: $.Slice<number>, v: number): void {
		b![7]
		b![0] = $.uint($.uint($.uint64Shr(v, 56), 8), 8)
		b![1] = $.uint($.uint($.uint64Shr(v, 48), 8), 8)
		b![2] = $.uint($.uint($.uint64Shr(v, 40), 8), 8)
		b![3] = $.uint($.uint($.uint64Shr(v, 32), 8), 8)
		b![4] = $.uint($.uint($.uint64Shr(v, 24), 8), 8)
		b![5] = $.uint($.uint($.uint64Shr(v, 16), 8), 8)
		b![6] = $.uint($.uint($.uint64Shr(v, 8), 8), 8)
		b![7] = $.uint($.uint(v, 8), 8)
	}

	public String(): string {
		return "BigEndian"
	}

	public Uint16(b: $.Slice<number>): number {
		b![1]
		return $.uint($.uint(b![1], 16) | ($.uint(b![0], 16) << 8), 16)
	}

	public Uint32(b: $.Slice<number>): number {
		b![3]
		return $.uint((($.uint(b![3], 32) | ($.uint(b![2], 32) << 8)) | ($.uint(b![1], 32) << 16)) | ($.uint(b![0], 32) << 24), 32)
	}

	public Uint64(b: $.Slice<number>): number {
		b![7]
		return $.uint($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or($.uint(b![7], 64), ($.uint64Shl($.uint(b![6], 64), 8)))), ($.uint64Shl($.uint(b![5], 64), 16)))), ($.uint64Shl($.uint(b![4], 64), 24)))), ($.uint64Mul($.uint(b![3], 64), (2 ** 32))))), ($.uint64Mul($.uint(b![2], 64), (2 ** 40))))), ($.uint64Mul($.uint(b![1], 64), (2 ** 48))))), ($.uint64Mul($.uint(b![0], 64), (2 ** 56)))), 64)
	}

	static __typeInfo = $.registerStructType(
		"binary.bigEndian",
		() => new bigEndian(),
		[{ name: "AppendUint16", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendUint32", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendUint64", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "GoString", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "PutUint16", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [] }, { name: "PutUint32", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [] }, { name: "PutUint64", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Uint16", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "Uint32", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Uint64", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }],
		bigEndian,
		[]
	)
}

export class coder {
	public get order(): ByteOrder | null {
		return this._fields.order.value
	}
	public set order(value: ByteOrder | null) {
		this._fields.order.value = value
	}

	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public _fields: {
		order: $.VarRef<ByteOrder | null>
		buf: $.VarRef<$.Slice<number>>
		offset: $.VarRef<number>
	}

	constructor(init?: Partial<{order?: ByteOrder | null, buf?: $.Slice<number>, offset?: number}>) {
		this._fields = {
			order: $.varRef(init?.order ?? (null as ByteOrder | null)),
			buf: $.varRef(init?.buf ?? (null as $.Slice<number>)),
			offset: $.varRef(init?.offset ?? (0 as number))
		}
	}

	public clone(): coder {
		const cloned = new coder()
		cloned._fields = {
			order: $.varRef(this._fields.order.value),
			buf: $.varRef(this._fields.buf.value),
			offset: $.varRef(this._fields.offset.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"binary.coder",
		() => new coder(),
		[],
		coder,
		[{ name: "order", key: "order", type: "binary.ByteOrder", pkgPath: "encoding/binary", index: [0], offset: 0, exported: false }, { name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "encoding/binary", index: [1], offset: 16, exported: false }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "encoding/binary", index: [2], offset: 40, exported: false }]
	)
}

export class decoder {
	public get order(): ByteOrder | null {
		return this._fields.order.value
	}
	public set order(value: ByteOrder | null) {
		this._fields.order.value = value
	}

	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public _fields: {
		order: $.VarRef<ByteOrder | null>
		buf: $.VarRef<$.Slice<number>>
		offset: $.VarRef<number>
	}

	constructor(init?: Partial<{order?: ByteOrder | null, buf?: $.Slice<number>, offset?: number}>) {
		this._fields = {
			order: $.varRef(init?.order ?? (null as ByteOrder | null)),
			buf: $.varRef(init?.buf ?? (null as $.Slice<number>)),
			offset: $.varRef(init?.offset ?? (0 as number))
		}
	}

	public clone(): decoder {
		const cloned = new decoder()
		cloned._fields = {
			order: $.varRef(this._fields.order.value),
			buf: $.varRef(this._fields.buf.value),
			offset: $.varRef(this._fields.offset.value)
		}
		return $.markAsStructValue(cloned)
	}

	public bool(): boolean {
		let d: decoder | $.VarRef<decoder> | null = this
		let x = $.uint($.pointerValue<decoder>(d).buf![$.pointerValue<decoder>(d).offset], 8)
		$.pointerValue<decoder>(d).offset++
		return $.uint(x, 8) != $.uint(0, 8)
	}

	public async int16(): globalThis.Promise<number> {
		const d: decoder | $.VarRef<decoder> | null = this
		return $.int($.int(await decoder.prototype.uint16.call(d), 16), 16)
	}

	public async int32(): globalThis.Promise<number> {
		const d: decoder | $.VarRef<decoder> | null = this
		return $.int($.int(await decoder.prototype.uint32.call(d), 32), 32)
	}

	public async int64(): globalThis.Promise<number> {
		const d: decoder | $.VarRef<decoder> | null = this
		return $.int($.int(await decoder.prototype.uint64.call(d)))
	}

	public int8(): number {
		const d: decoder | $.VarRef<decoder> | null = this
		return $.int($.int(decoder.prototype.uint8.call(d), 8), 8)
	}

	public async skip(v: reflect.Value): globalThis.Promise<void> {
		let d: decoder | $.VarRef<decoder> | null = this
		$.pointerValue<decoder>(d).offset = $.pointerValue<decoder>(d).offset + (await dataSize($.markAsStructValue($.cloneStructValue(v))))
	}

	public async uint16(): globalThis.Promise<number> {
		let d: decoder | $.VarRef<decoder> | null = this
		let x = $.uint(await $.pointerValue<Exclude<ByteOrder, null>>($.pointerValue<decoder>(d).order).Uint16($.goSlice($.pointerValue<decoder>(d).buf, $.pointerValue<decoder>(d).offset, $.pointerValue<decoder>(d).offset + 2)), 16)
		$.pointerValue<decoder>(d).offset = $.pointerValue<decoder>(d).offset + (2)
		return $.uint(x, 16)
	}

	public async uint32(): globalThis.Promise<number> {
		let d: decoder | $.VarRef<decoder> | null = this
		let x = $.uint(await $.pointerValue<Exclude<ByteOrder, null>>($.pointerValue<decoder>(d).order).Uint32($.goSlice($.pointerValue<decoder>(d).buf, $.pointerValue<decoder>(d).offset, $.pointerValue<decoder>(d).offset + 4)), 32)
		$.pointerValue<decoder>(d).offset = $.pointerValue<decoder>(d).offset + (4)
		return $.uint(x, 32)
	}

	public async uint64(): globalThis.Promise<number> {
		let d: decoder | $.VarRef<decoder> | null = this
		let x = $.uint(await $.pointerValue<Exclude<ByteOrder, null>>($.pointerValue<decoder>(d).order).Uint64($.goSlice($.pointerValue<decoder>(d).buf, $.pointerValue<decoder>(d).offset, $.pointerValue<decoder>(d).offset + 8)), 64)
		$.pointerValue<decoder>(d).offset = $.pointerValue<decoder>(d).offset + (8)
		return $.uint(x, 64)
	}

	public uint8(): number {
		let d: decoder | $.VarRef<decoder> | null = this
		let x = $.uint($.pointerValue<decoder>(d).buf![$.pointerValue<decoder>(d).offset], 8)
		$.pointerValue<decoder>(d).offset++
		return $.uint(x, 8)
	}

	public async value(v: reflect.Value): globalThis.Promise<void> {
		const d: decoder | $.VarRef<decoder> | null = this
		switch ($.markAsStructValue($.cloneStructValue(v)).Kind()) {
			case reflect.Array:
			{
				let l = $.markAsStructValue($.cloneStructValue(v)).Len()
				for (let i = 0; i < l; i++) {
					await decoder.prototype.value.call(d, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Index(i))))
				}
				break
			}
			case reflect.Struct:
			{
				let t = $.markAsStructValue($.cloneStructValue(v)).Type()
				let l = $.markAsStructValue($.cloneStructValue(v)).NumField()
				for (let i = 0; i < l; i++) {
					// Note: Calling v.CanSet() below is an optimization.
					// It would be sufficient to check the field name,
					// but creating the StructField info for each field is
					// costly (run "go test -bench=ReadStruct" and compare
					// results when making changes to this code).
					let __goscriptShadow2 = v
					{
						let __goscriptShadow3 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(__goscriptShadow2)).Field(i)))
						if ($.markAsStructValue($.cloneStructValue(__goscriptShadow3)).CanSet() || (!$.stringEqual((await $.pointerValue<Exclude<reflect.Type, null>>(t).Field(i)).Name, "_"))) {
							await decoder.prototype.value.call(d, $.markAsStructValue($.cloneStructValue(__goscriptShadow3)))
						} else {
							await decoder.prototype.skip.call(d, $.markAsStructValue($.cloneStructValue(__goscriptShadow3)))
						}
					}
				}
				break
			}
			case reflect.Slice:
			{
				let l = $.markAsStructValue($.cloneStructValue(v)).Len()
				for (let i = 0; i < l; i++) {
					await decoder.prototype.value.call(d, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Index(i))))
				}
				break
			}
			case reflect.Bool:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetBool(decoder.prototype.bool.call(d))
				break
			}
			case reflect.Int8:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetInt($.int($.int(decoder.prototype.int8.call(d))))
				break
			}
			case reflect.Int16:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetInt($.int($.int(await decoder.prototype.int16.call(d))))
				break
			}
			case reflect.Int32:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetInt($.int($.int(await decoder.prototype.int32.call(d))))
				break
			}
			case reflect.Int64:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetInt($.int(await decoder.prototype.int64.call(d)))
				break
			}
			case reflect.Uint8:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetUint($.uint($.uint(decoder.prototype.uint8.call(d), 64), 64))
				break
			}
			case reflect.Uint16:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetUint($.uint($.uint(await decoder.prototype.uint16.call(d), 64), 64))
				break
			}
			case reflect.Uint32:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetUint($.uint($.uint(await decoder.prototype.uint32.call(d), 64), 64))
				break
			}
			case reflect.Uint64:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetUint($.uint(await decoder.prototype.uint64.call(d), 64))
				break
			}
			case reflect.Float32:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetFloat(math.Float32frombits($.uint(await decoder.prototype.uint32.call(d), 32)))
				break
			}
			case reflect.Float64:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetFloat(math.Float64frombits($.uint(await decoder.prototype.uint64.call(d), 64)))
				break
			}
			case reflect.Complex64:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetComplex($.complex(math.Float32frombits($.uint(await decoder.prototype.uint32.call(d), 32)), math.Float32frombits($.uint(await decoder.prototype.uint32.call(d), 32))))
				break
			}
			case reflect.Complex128:
			{
				$.markAsStructValue($.cloneStructValue(v)).SetComplex($.complex(math.Float64frombits($.uint(await decoder.prototype.uint64.call(d), 64)), math.Float64frombits($.uint(await decoder.prototype.uint64.call(d), 64))))
				break
			}
		}
	}

	static __typeInfo = $.registerStructType(
		"binary.decoder",
		() => new decoder(),
		[{ name: "bool", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "int16", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int16" } }] }, { name: "int32", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int32" } }] }, { name: "int64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "int8", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int8" } }] }, { name: "skip", args: [{ name: "v", type: "reflect.Value" }], returns: [] }, { name: "uint16", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "uint32", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "uint8", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint8" } }] }, { name: "value", args: [{ name: "v", type: "reflect.Value" }], returns: [] }],
		decoder,
		[{ name: "order", key: "order", type: "binary.ByteOrder", pkgPath: "encoding/binary", index: [0], offset: 0, exported: false }, { name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "encoding/binary", index: [1], offset: 16, exported: false }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "encoding/binary", index: [2], offset: 40, exported: false }]
	)
}

export class encoder {
	public get order(): ByteOrder | null {
		return this._fields.order.value
	}
	public set order(value: ByteOrder | null) {
		this._fields.order.value = value
	}

	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public _fields: {
		order: $.VarRef<ByteOrder | null>
		buf: $.VarRef<$.Slice<number>>
		offset: $.VarRef<number>
	}

	constructor(init?: Partial<{order?: ByteOrder | null, buf?: $.Slice<number>, offset?: number}>) {
		this._fields = {
			order: $.varRef(init?.order ?? (null as ByteOrder | null)),
			buf: $.varRef(init?.buf ?? (null as $.Slice<number>)),
			offset: $.varRef(init?.offset ?? (0 as number))
		}
	}

	public clone(): encoder {
		const cloned = new encoder()
		cloned._fields = {
			order: $.varRef(this._fields.order.value),
			buf: $.varRef(this._fields.buf.value),
			offset: $.varRef(this._fields.offset.value)
		}
		return $.markAsStructValue(cloned)
	}

	public bool(x: boolean): void {
		let e: encoder | $.VarRef<encoder> | null = this
		if (x) {
			$.pointerValue<encoder>(e).buf![$.pointerValue<encoder>(e).offset] = $.uint(1, 8)
		} else {
			$.pointerValue<encoder>(e).buf![$.pointerValue<encoder>(e).offset] = $.uint(0, 8)
		}
		$.pointerValue<encoder>(e).offset++
	}

	public async int16(x: number): globalThis.Promise<void> {
		const e: encoder | $.VarRef<encoder> | null = this
		await encoder.prototype.uint16.call(e, $.uint($.uint(x, 16), 16))
	}

	public async int32(x: number): globalThis.Promise<void> {
		const e: encoder | $.VarRef<encoder> | null = this
		await encoder.prototype.uint32.call(e, $.uint($.uint(x, 32), 32))
	}

	public async int64(x: number): globalThis.Promise<void> {
		const e: encoder | $.VarRef<encoder> | null = this
		await encoder.prototype.uint64.call(e, $.uint($.uint(x, 64), 64))
	}

	public int8(x: number): void {
		const e: encoder | $.VarRef<encoder> | null = this
		encoder.prototype.uint8.call(e, $.uint($.uint(x, 8), 8))
	}

	public async skip(v: reflect.Value): globalThis.Promise<void> {
		let e: encoder | $.VarRef<encoder> | null = this
		let n = await dataSize($.markAsStructValue($.cloneStructValue(v)))
		$.clear($.goSlice($.pointerValue<encoder>(e).buf, $.pointerValue<encoder>(e).offset, $.pointerValue<encoder>(e).offset + n))
		$.pointerValue<encoder>(e).offset = $.pointerValue<encoder>(e).offset + (n)
	}

	public async uint16(x: number): globalThis.Promise<void> {
		let e: encoder | $.VarRef<encoder> | null = this
		await $.pointerValue<Exclude<ByteOrder, null>>($.pointerValue<encoder>(e).order).PutUint16($.goSlice($.pointerValue<encoder>(e).buf, $.pointerValue<encoder>(e).offset, $.pointerValue<encoder>(e).offset + 2), $.uint(x, 16))
		$.pointerValue<encoder>(e).offset = $.pointerValue<encoder>(e).offset + (2)
	}

	public async uint32(x: number): globalThis.Promise<void> {
		let e: encoder | $.VarRef<encoder> | null = this
		await $.pointerValue<Exclude<ByteOrder, null>>($.pointerValue<encoder>(e).order).PutUint32($.goSlice($.pointerValue<encoder>(e).buf, $.pointerValue<encoder>(e).offset, $.pointerValue<encoder>(e).offset + 4), $.uint(x, 32))
		$.pointerValue<encoder>(e).offset = $.pointerValue<encoder>(e).offset + (4)
	}

	public async uint64(x: number): globalThis.Promise<void> {
		let e: encoder | $.VarRef<encoder> | null = this
		await $.pointerValue<Exclude<ByteOrder, null>>($.pointerValue<encoder>(e).order).PutUint64($.goSlice($.pointerValue<encoder>(e).buf, $.pointerValue<encoder>(e).offset, $.pointerValue<encoder>(e).offset + 8), $.uint(x, 64))
		$.pointerValue<encoder>(e).offset = $.pointerValue<encoder>(e).offset + (8)
	}

	public uint8(x: number): void {
		let e: encoder | $.VarRef<encoder> | null = this
		$.pointerValue<encoder>(e).buf![$.pointerValue<encoder>(e).offset] = $.uint(x, 8)
		$.pointerValue<encoder>(e).offset++
	}

	public async value(v: reflect.Value): globalThis.Promise<void> {
		const e: encoder | $.VarRef<encoder> | null = this
		switch ($.markAsStructValue($.cloneStructValue(v)).Kind()) {
			case reflect.Array:
			{
				let l = $.markAsStructValue($.cloneStructValue(v)).Len()
				for (let i = 0; i < l; i++) {
					await encoder.prototype.value.call(e, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Index(i))))
				}
				break
			}
			case reflect.Struct:
			{
				let t = $.markAsStructValue($.cloneStructValue(v)).Type()
				let l = $.markAsStructValue($.cloneStructValue(v)).NumField()
				for (let i = 0; i < l; i++) {
					// see comment for corresponding code in decoder.value()
					let __goscriptShadow4 = v
					{
						let __goscriptShadow5 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(__goscriptShadow4)).Field(i)))
						if ($.markAsStructValue($.cloneStructValue(__goscriptShadow5)).CanSet() || (!$.stringEqual((await $.pointerValue<Exclude<reflect.Type, null>>(t).Field(i)).Name, "_"))) {
							await encoder.prototype.value.call(e, $.markAsStructValue($.cloneStructValue(__goscriptShadow5)))
						} else {
							await encoder.prototype.skip.call(e, $.markAsStructValue($.cloneStructValue(__goscriptShadow5)))
						}
					}
				}
				break
			}
			case reflect.Slice:
			{
				let l = $.markAsStructValue($.cloneStructValue(v)).Len()
				for (let i = 0; i < l; i++) {
					await encoder.prototype.value.call(e, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Index(i))))
				}
				break
			}
			case reflect.Bool:
			{
				encoder.prototype.bool.call(e, $.markAsStructValue($.cloneStructValue(v)).Bool())
				break
			}
			case reflect.Int8:
			{
				encoder.prototype.int8.call(e, $.int($.int($.markAsStructValue($.cloneStructValue(v)).Int(), 8), 8))
				break
			}
			case reflect.Int16:
			{
				await encoder.prototype.int16.call(e, $.int($.int($.markAsStructValue($.cloneStructValue(v)).Int(), 16), 16))
				break
			}
			case reflect.Int32:
			{
				await encoder.prototype.int32.call(e, $.int($.int($.markAsStructValue($.cloneStructValue(v)).Int(), 32), 32))
				break
			}
			case reflect.Int64:
			{
				await encoder.prototype.int64.call(e, $.int($.markAsStructValue($.cloneStructValue(v)).Int()))
				break
			}
			case reflect.Uint8:
			{
				encoder.prototype.uint8.call(e, $.uint($.uint($.markAsStructValue($.cloneStructValue(v)).Uint(), 8), 8))
				break
			}
			case reflect.Uint16:
			{
				await encoder.prototype.uint16.call(e, $.uint($.uint($.markAsStructValue($.cloneStructValue(v)).Uint(), 16), 16))
				break
			}
			case reflect.Uint32:
			{
				await encoder.prototype.uint32.call(e, $.uint($.uint($.markAsStructValue($.cloneStructValue(v)).Uint(), 32), 32))
				break
			}
			case reflect.Uint64:
			{
				await encoder.prototype.uint64.call(e, $.uint($.markAsStructValue($.cloneStructValue(v)).Uint(), 64))
				break
			}
			case reflect.Float32:
			{
				await encoder.prototype.uint32.call(e, $.uint(math.Float32bits($.markAsStructValue($.cloneStructValue(v)).Float()), 32))
				break
			}
			case reflect.Float64:
			{
				await encoder.prototype.uint64.call(e, $.uint(math.Float64bits($.markAsStructValue($.cloneStructValue(v)).Float()), 64))
				break
			}
			case reflect.Complex64:
			{
				let x = $.markAsStructValue($.cloneStructValue(v)).Complex()
				await encoder.prototype.uint32.call(e, $.uint(math.Float32bits($.real(x)), 32))
				await encoder.prototype.uint32.call(e, $.uint(math.Float32bits($.imag(x)), 32))
				break
			}
			case reflect.Complex128:
			{
				let x = $.markAsStructValue($.cloneStructValue(v)).Complex()
				await encoder.prototype.uint64.call(e, $.uint(math.Float64bits($.real(x)), 64))
				await encoder.prototype.uint64.call(e, $.uint(math.Float64bits($.imag(x)), 64))
				break
			}
		}
	}

	static __typeInfo = $.registerStructType(
		"binary.encoder",
		() => new encoder(),
		[{ name: "bool", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }, { name: "int16", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "int16" } }], returns: [] }, { name: "int32", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [] }, { name: "int64", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [] }, { name: "int8", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "int8" } }], returns: [] }, { name: "skip", args: [{ name: "v", type: "reflect.Value" }], returns: [] }, { name: "uint16", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [] }, { name: "uint32", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [] }, { name: "uint64", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [] }, { name: "uint8", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [] }, { name: "value", args: [{ name: "v", type: "reflect.Value" }], returns: [] }],
		encoder,
		[{ name: "order", key: "order", type: "binary.ByteOrder", pkgPath: "encoding/binary", index: [0], offset: 0, exported: false }, { name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "encoding/binary", index: [1], offset: 16, exported: false }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "encoding/binary", index: [2], offset: 40, exported: false }]
	)
}

export let errBufferTooSmall: $.GoError = errors.New("buffer too small")

export function __goscript_set_errBufferTooSmall(__goscriptValue: $.GoError): void {
	errBufferTooSmall = __goscriptValue
}

export let LittleEndian: littleEndian = $.markAsStructValue(new littleEndian())

export function __goscript_set_LittleEndian(__goscriptValue: littleEndian): void {
	LittleEndian = __goscriptValue
}

export let BigEndian: bigEndian = $.markAsStructValue(new bigEndian())

export function __goscript_set_BigEndian(__goscriptValue: bigEndian): void {
	BigEndian = __goscriptValue
}

export async function Read(r: io.Reader | null, order: ByteOrder | null, data: any): globalThis.Promise<$.GoError> {
	// Fast path for basic types and slices.
	{
		let [n, ] = intDataSize(data)
		if (n != 0) {
			let bs: $.Slice<number> = $.makeSlice<number>(n, undefined, "byte")
			{
				let [, err] = await io.ReadFull($.pointerValueOrNil(r)!, bs)
				if (err != null) {
					return err
				}
			}

			if (await decodeFast(bs, order, data)) {
				return null
			}
		}
	}

	// Fallback to reflect-based decoding.
	let v = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(data)))
	let size = -1
	switch ($.markAsStructValue($.cloneStructValue(v)).Kind()) {
		case reflect.Pointer:
		{
			v = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Elem()))
			size = await dataSize($.markAsStructValue($.cloneStructValue(v)))
			break
		}
		case reflect.Slice:
		{
			size = await dataSize($.markAsStructValue($.cloneStructValue(v)))
			break
		}
	}
	if (size < 0) {
		return errors.New("binary.Read: invalid type " + await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf(data)).String())
	}

	let d: decoder | $.VarRef<decoder> | null = new decoder({order: order, buf: $.makeSlice<number>(size, undefined, "byte")})
	{
		let [, err] = await io.ReadFull($.pointerValueOrNil(r)!, $.pointerValue<decoder>(d).buf)
		if (err != null) {
			return err
		}
	}
	await decoder.prototype.value.call(d, $.markAsStructValue($.cloneStructValue(v)))
	return null
}

export async function Decode(buf: $.Slice<number>, order: ByteOrder | null, data: any): globalThis.Promise<[number, $.GoError]> {
	{
		let [n, ] = intDataSize(data)
		if (n != 0) {
			if ($.len(buf) < n) {
				return [0, errBufferTooSmall]
			}

			if (await decodeFast(buf, order, data)) {
				return [n, null]
			}
		}
	}

	// Fallback to reflect-based decoding.
	let v = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(data)))
	let size = -1
	switch ($.markAsStructValue($.cloneStructValue(v)).Kind()) {
		case reflect.Pointer:
		{
			v = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Elem()))
			size = await dataSize($.markAsStructValue($.cloneStructValue(v)))
			break
		}
		case reflect.Slice:
		{
			size = await dataSize($.markAsStructValue($.cloneStructValue(v)))
			break
		}
	}
	if (size < 0) {
		return [0, errors.New("binary.Decode: invalid type " + await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf(data)).String())]
	}

	if ($.len(buf) < size) {
		return [0, errBufferTooSmall]
	}
	let d: decoder | $.VarRef<decoder> | null = new decoder({order: order, buf: $.goSlice(buf, undefined, size)})
	await decoder.prototype.value.call(d, $.markAsStructValue($.cloneStructValue(v)))
	return [size, null]
}

export async function decodeFast(bs: $.Slice<number>, order: ByteOrder | null, data: any): globalThis.Promise<boolean> {
	{
		const __goscriptTypeSwitchValue = data
		switch (true) {
			case $.typeAssert<$.VarRef<boolean> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).ok:
				{
					let data: $.VarRef<boolean> | null = $.typeAssert<$.VarRef<boolean> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).value
					data!.value = $.uint(bs![0], 8) != $.uint(0, 8)
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).value
					data!.value = $.int($.int(bs![0], 8), 8)
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					data!.value = $.uint(bs![0], 8)
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).value
					data!.value = $.int($.int(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint16(bs), 16), 16)
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).value
					data!.value = $.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint16(bs), 16)
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).value
					data!.value = $.int($.int(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint32(bs), 32), 32)
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).value
					data!.value = $.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint32(bs), 32)
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).value
					data!.value = $.int($.int(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint64(bs)))
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).value
					data!.value = $.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint64(bs), 64)
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).value
					data!.value = math.Float32frombits($.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint32(bs), 32))
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).value
					data!.value = math.Float64frombits($.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint64(bs), 64))
				}
				break
			case $.typeAssert<$.Slice<boolean>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).ok:
				{
					let data: $.Slice<boolean> = $.typeAssert<$.Slice<boolean>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).value
					for (let __goscriptRangeTarget0 = bs, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
						let x = __goscriptRangeTarget0![i]
						data![i] = $.uint(x, 8) != $.uint(0, 8)
					}
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).value
					for (let __goscriptRangeTarget1 = bs, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
						let x = __goscriptRangeTarget1![i]
						data![i] = $.int($.int(x, 8), 8)
					}
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					$.copy(data, bs)
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).value
					for (let __goscriptRangeTarget2 = data, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
						data![i] = $.int($.int(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint16($.goSlice(bs, 2 * i, undefined)), 16), 16)
					}
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).value
					for (let __goscriptRangeTarget3 = data, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
						data![i] = $.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint16($.goSlice(bs, 2 * i, undefined)), 16)
					}
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).value
					for (let __goscriptRangeTarget4 = data, i = 0; i < $.len(__goscriptRangeTarget4); i++) {
						data![i] = $.int($.int(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint32($.goSlice(bs, 4 * i, undefined)), 32), 32)
					}
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).value
					for (let __goscriptRangeTarget5 = data, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
						data![i] = $.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint32($.goSlice(bs, 4 * i, undefined)), 32)
					}
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).value
					for (let __goscriptRangeTarget6 = data, i = 0; i < $.len(__goscriptRangeTarget6); i++) {
						data![i] = $.int($.int(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint64($.goSlice(bs, 8 * i, undefined))))
					}
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).value
					for (let __goscriptRangeTarget7 = data, i = 0; i < $.len(__goscriptRangeTarget7); i++) {
						data![i] = $.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint64($.goSlice(bs, 8 * i, undefined)), 64)
					}
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).value
					for (let __goscriptRangeTarget8 = data, i = 0; i < $.len(__goscriptRangeTarget8); i++) {
						data![i] = math.Float32frombits($.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint32($.goSlice(bs, 4 * i, undefined)), 32))
					}
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).value
					for (let __goscriptRangeTarget9 = data, i = 0; i < $.len(__goscriptRangeTarget9); i++) {
						data![i] = math.Float64frombits($.uint(await $.pointerValue<Exclude<ByteOrder, null>>(order).Uint64($.goSlice(bs, 8 * i, undefined)), 64))
					}
				}
				break
			default:
				{
					let data: any = __goscriptTypeSwitchValue
					return false
				}
				break
		}
	}
	return true
}

export async function Write(w: io.Writer | null, order: ByteOrder | null, data: any): globalThis.Promise<$.GoError> {
	// Fast path for basic types and slices.
	{
		let __goscriptTuple0: any = intDataSize(data)
		let n = __goscriptTuple0[0]
		let bs: $.Slice<number> = __goscriptTuple0[1]
		if (n != 0) {
			if (bs == null) {
				bs = $.makeSlice<number>(n, undefined, "byte")
				await encodeFast(bs, order, data)
			}

			let [, err] = await $.pointerValue<Exclude<io.Writer, null>>(w).Write(bs)
			return err
		}
	}

	// Fallback to reflect-based encoding.
	let v = $.markAsStructValue($.cloneStructValue(reflect.Indirect($.markAsStructValue($.cloneStructValue(reflect.ValueOf(data))))))
	let size = await dataSize($.markAsStructValue($.cloneStructValue(v)))
	if (size < 0) {
		return errors.New("binary.Write: some values are not fixed-sized in type " + await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf(data)).String())
	}

	let buf: $.Slice<number> = $.makeSlice<number>(size, undefined, "byte")
	let e: encoder | $.VarRef<encoder> | null = new encoder({order: order, buf: buf})
	await encoder.prototype.value.call(e, $.markAsStructValue($.cloneStructValue(v)))
	let [, err] = await $.pointerValue<Exclude<io.Writer, null>>(w).Write(buf)
	return err
}

export async function Encode(buf: $.Slice<number>, order: ByteOrder | null, data: any): globalThis.Promise<[number, $.GoError]> {
	// Fast path for basic types and slices.
	{
		let [n, ] = intDataSize(data)
		if (n != 0) {
			if ($.len(buf) < n) {
				return [0, errBufferTooSmall]
			}

			await encodeFast(buf, order, data)
			return [n, null]
		}
	}

	// Fallback to reflect-based encoding.
	let v = $.markAsStructValue($.cloneStructValue(reflect.Indirect($.markAsStructValue($.cloneStructValue(reflect.ValueOf(data))))))
	let size = await dataSize($.markAsStructValue($.cloneStructValue(v)))
	if (size < 0) {
		return [0, errors.New("binary.Encode: some values are not fixed-sized in type " + await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf(data)).String())]
	}

	if ($.len(buf) < size) {
		return [0, errBufferTooSmall]
	}
	let e: encoder | $.VarRef<encoder> | null = new encoder({order: order, buf: buf})
	await encoder.prototype.value.call(e, $.markAsStructValue($.cloneStructValue(v)))
	return [size, null]
}

export async function Append(buf: $.Slice<number>, order: ByteOrder | null, data: any): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	// Fast path for basic types and slices.
	{
		let [n, ] = intDataSize(data)
		if (n != 0) {
			let __goscriptShadow0 = buf
			let __goscriptTuple1: any = ensure(__goscriptShadow0, n)
			let __goscriptShadow1: $.Slice<number> = __goscriptTuple1[0]
			let pos: $.Slice<number> = __goscriptTuple1[1]
			await encodeFast(pos, order, data)
			return [__goscriptShadow1, null]
		}
	}

	// Fallback to reflect-based encoding.
	let v = $.markAsStructValue($.cloneStructValue(reflect.Indirect($.markAsStructValue($.cloneStructValue(reflect.ValueOf(data))))))
	let size = await dataSize($.markAsStructValue($.cloneStructValue(v)))
	if (size < 0) {
		return [null, errors.New("binary.Append: some values are not fixed-sized in type " + await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf(data)).String())]
	}

	let __goscriptTuple2: any = ensure(buf, size)
	buf = __goscriptTuple2[0]
	let pos: $.Slice<number> = __goscriptTuple2[1]
	let e: encoder | $.VarRef<encoder> | null = new encoder({order: order, buf: pos})
	await encoder.prototype.value.call(e, $.markAsStructValue($.cloneStructValue(v)))
	return [buf, null]
}

export async function encodeFast(bs: $.Slice<number>, order: ByteOrder | null, data: any): globalThis.Promise<void> {
	{
		const __goscriptTypeSwitchValue = data
		switch (true) {
			case $.typeAssert<$.VarRef<boolean> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).ok:
				{
					let v: $.VarRef<boolean> | null = $.typeAssert<$.VarRef<boolean> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).value
					if ($.pointerValue<boolean>(v)) {
						bs![0] = $.uint(1, 8)
					} else {
						bs![0] = $.uint(0, 8)
					}
				}
				break
			case $.typeAssert<boolean>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }).ok:
				{
					let v: boolean = $.typeAssert<boolean>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }).value
					if (v) {
						bs![0] = $.uint(1, 8)
					} else {
						bs![0] = $.uint(0, 8)
					}
				}
				break
			case $.typeAssert<$.Slice<boolean>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).ok:
				{
					let v: $.Slice<boolean> = $.typeAssert<$.Slice<boolean>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).value
					for (let __goscriptRangeTarget10 = v, i = 0; i < $.len(__goscriptRangeTarget10); i++) {
						let x = __goscriptRangeTarget10![i]
						if (x) {
							bs![i] = $.uint(1, 8)
						} else {
							bs![i] = $.uint(0, 8)
						}
					}
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).value
					bs![0] = $.uint($.uint($.pointerValue<number>(v), 8), 8)
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int8" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int8" }).value
					bs![0] = $.uint($.uint(v, 8), 8)
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).value
					for (let __goscriptRangeTarget11 = v, i = 0; i < $.len(__goscriptRangeTarget11); i++) {
						let x = __goscriptRangeTarget11![i]
						bs![i] = $.uint($.uint(x, 8), 8)
					}
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					bs![0] = $.uint($.pointerValue<number>(v), 8)
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint8" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint8" }).value
					bs![0] = $.uint(v, 8)
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					$.copy(bs, v)
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint16(bs, $.uint($.uint($.pointerValue<number>(v), 16), 16))
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int16" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int16" }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint16(bs, $.uint($.uint(v, 16), 16))
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).value
					for (let __goscriptRangeTarget12 = v, i = 0; i < $.len(__goscriptRangeTarget12); i++) {
						let x = __goscriptRangeTarget12![i]
						await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint16($.goSlice(bs, 2 * i, undefined), $.uint($.uint(x, 16), 16))
					}
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint16(bs, $.uint($.pointerValue<number>(v), 16))
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint16" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint16" }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint16(bs, $.uint(v, 16))
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).value
					for (let __goscriptRangeTarget13 = v, i = 0; i < $.len(__goscriptRangeTarget13); i++) {
						let x = __goscriptRangeTarget13![i]
						await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint16($.goSlice(bs, 2 * i, undefined), $.uint(x, 16))
					}
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint32(bs, $.uint($.uint($.pointerValue<number>(v), 32), 32))
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int32" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int32" }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint32(bs, $.uint($.uint(v, 32), 32))
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).value
					for (let __goscriptRangeTarget14 = v, i = 0; i < $.len(__goscriptRangeTarget14); i++) {
						let x = __goscriptRangeTarget14![i]
						await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint32($.goSlice(bs, 4 * i, undefined), $.uint($.uint(x, 32), 32))
					}
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint32(bs, $.uint($.pointerValue<number>(v), 32))
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint32" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint32" }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint32(bs, $.uint(v, 32))
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).value
					for (let __goscriptRangeTarget15 = v, i = 0; i < $.len(__goscriptRangeTarget15); i++) {
						let x = __goscriptRangeTarget15![i]
						await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint32($.goSlice(bs, 4 * i, undefined), $.uint(x, 32))
					}
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint64(bs, $.uint($.uint($.pointerValue<number>(v), 64), 64))
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int64" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int64" }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint64(bs, $.uint($.uint(v, 64), 64))
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).value
					for (let __goscriptRangeTarget16 = v, i = 0; i < $.len(__goscriptRangeTarget16); i++) {
						let x = __goscriptRangeTarget16![i]
						await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint64($.goSlice(bs, 8 * i, undefined), $.uint($.uint(x, 64), 64))
					}
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint64(bs, $.uint($.pointerValue<number>(v), 64))
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint64" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint64" }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint64(bs, $.uint(v, 64))
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).value
					for (let __goscriptRangeTarget17 = v, i = 0; i < $.len(__goscriptRangeTarget17); i++) {
						let x = __goscriptRangeTarget17![i]
						await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint64($.goSlice(bs, 8 * i, undefined), $.uint(x, 64))
					}
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint32(bs, $.uint(math.Float32bits($.pointerValue<number>(v)), 32))
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float32" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float32" }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint32(bs, $.uint(math.Float32bits(v), 32))
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).value
					for (let __goscriptRangeTarget18 = v, i = 0; i < $.len(__goscriptRangeTarget18); i++) {
						let x = __goscriptRangeTarget18![i]
						await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint32($.goSlice(bs, 4 * i, undefined), $.uint(math.Float32bits(x), 32))
					}
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).ok:
				{
					let v: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint64(bs, $.uint(math.Float64bits($.pointerValue<number>(v)), 64))
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float64" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float64" }).value
					await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint64(bs, $.uint(math.Float64bits(v), 64))
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).ok:
				{
					let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).value
					for (let __goscriptRangeTarget19 = v, i = 0; i < $.len(__goscriptRangeTarget19); i++) {
						let x = __goscriptRangeTarget19![i]
						await $.pointerValue<Exclude<ByteOrder, null>>(order).PutUint64($.goSlice(bs, 8 * i, undefined), $.uint(math.Float64bits(x), 64))
					}
				}
				break
		}
	}
}

export async function Size(v: any): globalThis.Promise<number> {
	{
		const __goscriptTypeSwitchValue = v
		switch (true) {
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int8" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint8" }):
				{
					let data = __goscriptTypeSwitchValue
					return 1
				}
				break
			case $.typeAssert<$.VarRef<boolean> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).ok:
				{
					let data: $.VarRef<boolean> | null = $.typeAssert<$.VarRef<boolean> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).value
					if (data == null) {
						return -1
					}
					return 1
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).value
					if (data == null) {
						return -1
					}
					return 1
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					if (data == null) {
						return -1
					}
					return 1
				}
				break
			case $.typeAssert<$.Slice<boolean>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).ok:
				{
					let data: $.Slice<boolean> = $.typeAssert<$.Slice<boolean>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).value
					return $.len(data)
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).value
					return $.len(data)
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					return $.len(data)
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int16" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint16" }):
				{
					let data = __goscriptTypeSwitchValue
					return 2
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).value
					if (data == null) {
						return -1
					}
					return 2
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).value
					if (data == null) {
						return -1
					}
					return 2
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).value
					return 2 * $.len(data)
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).value
					return 2 * $.len(data)
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int32" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint32" }):
				{
					let data = __goscriptTypeSwitchValue
					return 4
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).value
					if (data == null) {
						return -1
					}
					return 4
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).value
					if (data == null) {
						return -1
					}
					return 4
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).value
					return 4 * $.len(data)
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).value
					return 4 * $.len(data)
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int64" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint64" }):
				{
					let data = __goscriptTypeSwitchValue
					return 8
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).value
					if (data == null) {
						return -1
					}
					return 8
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).value
					if (data == null) {
						return -1
					}
					return 8
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).value
					return 8 * $.len(data)
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).value
					return 8 * $.len(data)
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float32" }).ok:
				{
					let data: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float32" }).value
					return 4
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).value
					if (data == null) {
						return -1
					}
					return 4
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float64" }).ok:
				{
					let data: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float64" }).value
					return 8
				}
				break
			case $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).ok:
				{
					let data: $.VarRef<number> | null = $.typeAssert<$.VarRef<number> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).value
					if (data == null) {
						return -1
					}
					return 8
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).value
					return 4 * $.len(data)
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).value
					return 8 * $.len(data)
				}
				break
		}
	}
	return await dataSize($.markAsStructValue($.cloneStructValue(reflect.Indirect($.markAsStructValue($.cloneStructValue(reflect.ValueOf(v)))))))
}

export let structSize: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_structSize(__goscriptValue: sync.Map): void {
	structSize.value = __goscriptValue
}

export async function dataSize(v: reflect.Value): globalThis.Promise<number> {
	switch ($.markAsStructValue($.cloneStructValue(v)).Kind()) {
		case reflect.Slice:
		case reflect.Array:
		{
			let t = await $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(v)).Type()).Elem()
			{
				let [size, ok] = await structSize.value.Load((t as any))
				if (ok) {
					return $.mustTypeAssert<number>(size, { kind: $.TypeKind.Basic, name: "int" }) * $.markAsStructValue($.cloneStructValue(v)).Len()
				}
			}

			let size = await sizeof(t)
			if (size >= 0) {
				if (await $.pointerValue<Exclude<reflect.Type, null>>(t).Kind() == reflect.Struct) {
					await structSize.value.Store((t as any), $.namedValueInterfaceValue<any>(size, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
				}
				return size * $.markAsStructValue($.cloneStructValue(v)).Len()
			}
			break
		}
		case reflect.Struct:
		{
			let t = $.markAsStructValue($.cloneStructValue(v)).Type()
			{
				let [size, ok] = await structSize.value.Load((t as any))
				if (ok) {
					return $.mustTypeAssert<number>(size, { kind: $.TypeKind.Basic, name: "int" })
				}
			}
			let size = await sizeof(t)
			await structSize.value.Store((t as any), $.namedValueInterfaceValue<any>(size, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
			return size
			break
		}
		default:
		{
			if ($.markAsStructValue($.cloneStructValue(v)).IsValid()) {
				return await sizeof($.markAsStructValue($.cloneStructValue(v)).Type())
			}
			break
		}
	}

	return -1
}

export async function sizeof(t: reflect.Type | null): globalThis.Promise<number> {
	switch (await $.pointerValue<Exclude<reflect.Type, null>>(t).Kind()) {
		case reflect.Array:
		{
			{
				let s = await sizeof(await $.pointerValue<Exclude<reflect.Type, null>>(t).Elem())
				if (s >= 0) {
					return s * await $.pointerValue<Exclude<reflect.Type, null>>(t).Len()
				}
			}
			break
		}
		case reflect.Struct:
		{
			let sum = 0
			for (let i = 0, n = await $.pointerValue<Exclude<reflect.Type, null>>(t).NumField(); i < n; i++) {
				let s = await sizeof((await $.pointerValue<Exclude<reflect.Type, null>>(t).Field(i)).Type)
				if (s < 0) {
					return -1
				}
				sum = sum + (s)
			}
			return sum
			break
		}
		case reflect.Bool:
		case reflect.Uint8:
		case reflect.Uint16:
		case reflect.Uint32:
		case reflect.Uint64:
		case reflect.Int8:
		case reflect.Int16:
		case reflect.Int32:
		case reflect.Int64:
		case reflect.Float32:
		case reflect.Float64:
		case reflect.Complex64:
		case reflect.Complex128:
		{
			return $.int(await $.pointerValue<Exclude<reflect.Type, null>>(t).Size())
			break
		}
	}

	return -1
}

export function intDataSize(data: any): [number, $.Slice<number>] {
	{
		const __goscriptTypeSwitchValue = data
		switch (true) {
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int8" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint8" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool" } }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }):
				{
					let data = __goscriptTypeSwitchValue
					return [1, null]
				}
				break
			case $.typeAssert<$.Slice<boolean>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).ok:
				{
					let data: $.Slice<boolean> = $.typeAssert<$.Slice<boolean>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }).value
					return [$.len(data), null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int8" } }).value
					return [$.len(data), null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					return [$.len(data), data]
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int16" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint16" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int16" } }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }):
				{
					let data = __goscriptTypeSwitchValue
					return [2, null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int16" } }).value
					return [2 * $.len(data), null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }).value
					return [2 * $.len(data), null]
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int32" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint32" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int32" } }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }):
				{
					let data = __goscriptTypeSwitchValue
					return [4, null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }).value
					return [4 * $.len(data), null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32" } }).value
					return [4 * $.len(data), null]
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int64" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint64" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }):
				{
					let data = __goscriptTypeSwitchValue
					return [8, null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int64" } }).value
					return [8 * $.len(data), null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }).value
					return [8 * $.len(data), null]
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float32" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float32" } }):
				{
					let data = __goscriptTypeSwitchValue
					return [4, null]
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float64" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "float64" } }):
				{
					let data = __goscriptTypeSwitchValue
					return [8, null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float32" } }).value
					return [4 * $.len(data), null]
				}
				break
			case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).ok:
				{
					let data: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "float64" } }).value
					return [8 * $.len(data), null]
				}
				break
		}
	}
	return [0, null]
}

export function ensure(buf: $.Slice<number>, n: number): [$.Slice<number>, $.Slice<number>] {
	let buf2: $.Slice<number> = null as $.Slice<number>
	let pos: $.Slice<number> = null as $.Slice<number>
	let l = $.len(buf)
	buf = $.goSlice(slices.Grow(buf, n), undefined, l + n)
	return [buf, $.goSlice(buf, l, undefined)]
}
