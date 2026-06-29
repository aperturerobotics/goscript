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
			len: $.varRef(init?.len ?? (0 as number))
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
		[{ name: "len", key: "len", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let codes: $.Slice<code> = $.makeSlice<code>(2, undefined, undefined, () => $.markAsStructValue(new code()))
	$.arrayIndex(codes!, 0).len = 3
	$.println("first:", $.arrayIndex(codes!, 0).len)
	$.println("second:", $.arrayIndex(codes!, 1).len)
}

if ($.isMainScript(import.meta)) {
	await main()
}
