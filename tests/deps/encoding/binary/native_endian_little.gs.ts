// Generated file based on native_endian_little.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as math from "@goscript/math/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as slices from "@goscript/slices/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_binary from "./binary.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/math/index.js"
import "@goscript/reflect/index.js"
import "@goscript/slices/index.js"
import "@goscript/sync/index.js"
import "./binary.gs.ts"

export class nativeEndian {
	public get littleEndian(): __goscript_binary.littleEndian {
		return this._fields.littleEndian.value
	}
	public set littleEndian(value: __goscript_binary.littleEndian) {
		this._fields.littleEndian.value = value
	}

	public _fields: {
		littleEndian: $.VarRef<__goscript_binary.littleEndian>
	}

	constructor(init?: Partial<{littleEndian?: __goscript_binary.littleEndian}>) {
		this._fields = {
			littleEndian: $.varRef(init?.littleEndian ? $.markAsStructValue($.cloneStructValue(init.littleEndian)) : $.markAsStructValue(new __goscript_binary.littleEndian()))
		}
	}

	public clone(): nativeEndian {
		const cloned = new nativeEndian()
		cloned._fields = {
			littleEndian: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.littleEndian.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public GoString(): string {
		return "binary.NativeEndian"
	}

	public String(): string {
		return "NativeEndian"
	}

	public AppendUint16(b: any, v: any): any {
		return $.pointerValue<__goscript_binary.littleEndian>(this.littleEndian).AppendUint16(b, v)
	}

	public AppendUint32(b: any, v: any): any {
		return $.pointerValue<__goscript_binary.littleEndian>(this.littleEndian).AppendUint32(b, v)
	}

	public AppendUint64(b: any, v: any): any {
		return $.pointerValue<__goscript_binary.littleEndian>(this.littleEndian).AppendUint64(b, v)
	}

	public PutUint16(b: any, v: any): any {
		return $.pointerValue<__goscript_binary.littleEndian>(this.littleEndian).PutUint16(b, v)
	}

	public PutUint32(b: any, v: any): any {
		return $.pointerValue<__goscript_binary.littleEndian>(this.littleEndian).PutUint32(b, v)
	}

	public PutUint64(b: any, v: any): any {
		return $.pointerValue<__goscript_binary.littleEndian>(this.littleEndian).PutUint64(b, v)
	}

	public Uint16(b: any): any {
		return $.pointerValue<__goscript_binary.littleEndian>(this.littleEndian).Uint16(b)
	}

	public Uint32(b: any): any {
		return $.pointerValue<__goscript_binary.littleEndian>(this.littleEndian).Uint32(b)
	}

	public Uint64(b: any): any {
		return $.pointerValue<__goscript_binary.littleEndian>(this.littleEndian).Uint64(b)
	}

	static __typeInfo = $.registerStructType(
		"binary.nativeEndian",
		() => new nativeEndian(),
		[{ name: "GoString", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "AppendUint16", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendUint32", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendUint64", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "PutUint16", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [] }, { name: "PutUint32", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [] }, { name: "PutUint64", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "v", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [] }, { name: "Uint16", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "Uint32", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Uint64", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }],
		nativeEndian,
		[{ name: "littleEndian", key: "littleEndian", type: "binary.littleEndian", pkgPath: "encoding/binary", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export var NativeEndian: nativeEndian

export function __goscript_init_NativeEndian(): void {
	if (((NativeEndian) as any) === undefined) {
		NativeEndian = $.markAsStructValue(new nativeEndian())
	}
}

export function __goscript_get_NativeEndian(): nativeEndian {
	if (((NativeEndian) as any) === undefined) {
		__goscript_init_NativeEndian()
	}
	return NativeEndian
}

export function __goscript_set_NativeEndian(__goscriptValue: nativeEndian): void {
	NativeEndian = __goscriptValue
}
