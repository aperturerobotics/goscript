// Generated file based on unsafe_noescape_uintptr_xor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export class sourceStruct {
	public get flag(): boolean {
		return this._fields.flag.value
	}
	public set flag(value: boolean) {
		this._fields.flag.value = value
	}

	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		flag: $.VarRef<boolean>
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{flag?: boolean, data?: $.Slice<number>}>) {
		this._fields = {
			flag: $.varRef(init?.flag ?? (false as boolean)),
			data: $.varRef(init?.data ?? (null as $.Slice<number>))
		}
	}

	public clone(): sourceStruct {
		const cloned = new sourceStruct()
		cloned._fields = {
			flag: $.varRef(this._fields.flag.value),
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.sourceStruct",
		() => new sourceStruct(),
		[],
		sourceStruct,
		[{ name: "flag", key: "flag", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint" } } }]
	)
}

export class viewStruct {
	public get flag(): boolean {
		return this._fields.flag.value
	}
	public set flag(value: boolean) {
		this._fields.flag.value = value
	}

	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		flag: $.VarRef<boolean>
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{flag?: boolean, data?: $.Slice<number>}>) {
		this._fields = {
			flag: $.varRef(init?.flag ?? (false as boolean)),
			data: $.varRef(init?.data ?? (null as $.Slice<number>))
		}
	}

	public clone(): viewStruct {
		const cloned = new viewStruct()
		cloned._fields = {
			flag: $.varRef(this._fields.flag.value),
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.viewStruct",
		() => new viewStruct(),
		[],
		viewStruct,
		[{ name: "flag", key: "flag", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint" } } }]
	)
}

export function noescape(p: any): any {
	let x = $.uint((p as any), 64)
	return (x as any)
}

export function inlineSlice(values: $.Slice<number>): $.Slice<number> {
	return $.goSlice($.pointerValue<number[]>($.unsafePointerCast<$.VarRef<number[]> | null>($.arrayPointerFromIndexRef<number>($.indexRef(values!, 0), 2, 8, 8))), undefined, undefined)
}

export function markThroughView(src: sourceStruct | $.VarRef<sourceStruct> | null): boolean {
	$.pointerValue<sourceStruct>(src).flag = true
	return $.pointerValue<sourceStruct>(src).flag
}

export async function main(): globalThis.Promise<void> {
	let values: $.Slice<number> = $.arrayToSlice<number>([1, 2])
	let p = ($.indexRef(values!, 1) as any)
	let q = noescape(p)

	$.println("same:", q == p)
	$.println("nil:", q == null)

	let inline: $.Slice<number> = inlineSlice(values)
	$.println("inline:", $.arrayIndex(inline!, 0), $.arrayIndex(inline!, 1))
	inline![0] = 9
	$.println("updated:", $.arrayIndex(values!, 0))

	let src: $.VarRef<sourceStruct> = $.varRef($.markAsStructValue(new sourceStruct()))
	$.println("struct:", markThroughView(src), src.value.flag)
}

if ($.isMainScript(import.meta)) {
	await main()
}
