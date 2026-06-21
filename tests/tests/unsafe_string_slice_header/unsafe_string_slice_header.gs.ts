// Generated file based on unsafe_string_slice_header.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/reflect/index.js"
import "@goscript/unsafe/index.js"

export class localSliceHeader {
	public get s(): string {
		return this._fields.s.value
	}
	public set s(value: string) {
		this._fields.s.value = value
	}

	public get cap(): number {
		return this._fields.cap.value
	}
	public set cap(value: number) {
		this._fields.cap.value = value
	}

	public _fields: {
		s: $.VarRef<string>
		cap: $.VarRef<number>
	}

	constructor(init?: Partial<{s?: string, cap?: number}>) {
		this._fields = {
			s: $.varRef(init?.s ?? ("" as unknown as string)),
			cap: $.varRef(init?.cap ?? (0 as unknown as number))
		}
	}

	public clone(): localSliceHeader {
		const cloned = new localSliceHeader()
		cloned._fields = {
			s: $.varRef(this._fields.s.value),
			cap: $.varRef(this._fields.cap.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.localSliceHeader",
		() => new localSliceHeader(),
		[],
		localSliceHeader,
		[{ name: "s", key: "s", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/s4wave/goscript/tests/tests/unsafe_string_slice_header", index: [0], offset: 0, exported: false }, { name: "cap", key: "cap", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/s4wave/goscript/tests/tests/unsafe_string_slice_header", index: [1], offset: 16, exported: false }]
	)
}

export function stringBytes(__goscriptParam0: string): $.Slice<number> {
	let s: $.VarRef<string> = $.varRef(__goscriptParam0)
	let b: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let strh: reflect.StringHeader | $.VarRef<reflect.StringHeader> | null = ($.stringHeaderRef(s) as unknown as reflect.StringHeader | $.VarRef<reflect.StringHeader> | null)
	let sh: reflect.SliceHeader | $.VarRef<reflect.SliceHeader> | null = ($.sliceHeaderRef(b) as unknown as reflect.SliceHeader | $.VarRef<reflect.SliceHeader> | null)
	$.pointerValue<reflect.SliceHeader>(sh).Data = $.uint($.pointerValue<reflect.StringHeader>(strh).Data, 64)
	$.pointerValue<reflect.SliceHeader>(sh).Len = $.pointerValue<reflect.StringHeader>(strh).Len
	$.pointerValue<reflect.SliceHeader>(sh).Cap = $.pointerValue<reflect.StringHeader>(strh).Len
	return b.value
}

export function localStringBytes(s: string): $.Slice<number> {
	return $.stringToBytes(s)
}

export async function main(): globalThis.Promise<void> {
	let b: $.Slice<number> = stringBytes("abc")
	$.println($.len(b), $.cap(b), $.uint(b![0], 8), $.uint(b![1], 8), $.uint(b![2], 8))
	let local: $.Slice<number> = localStringBytes("wxyz")
	$.println($.len(local), $.cap(local), $.uint(local![0], 8), $.uint(local![3], 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
