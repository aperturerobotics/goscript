// Generated file based on make_slice_struct_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class code {
	public get len(): number {
		return this._fields.len.value
	}
	public set len(value: number) {
		this._fields.len.value = value
	}

	public _fields: {
		len: $.VarRef<number>
	}

	constructor(init?: Partial<{len?: number}>) {
		this._fields = {
			len: $.varRef(init?.len ?? 0)
		}
	}

	public clone(): code {
		const cloned = new code()
		cloned._fields = {
			len: $.varRef(this._fields.len.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.code",
		() => new code(),
		[],
		code,
		[{ name: "len", key: "len", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/make_slice_struct_zero", index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let codes: $.Slice<code> = $.makeSlice<code>(2, undefined, undefined, () => $.markAsStructValue(new code()))
	codes![0].len = 3
	$.println("first:", codes![0].len)
	$.println("second:", codes![1].len)
}

if ($.isMainScript(import.meta)) {
	await main()
}
