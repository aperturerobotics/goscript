// Generated file based on composite_literal_field_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class buffer {
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

	public clone(): buffer {
		const cloned = new buffer()
		cloned._fields = {
			buf: $.varRef(this._fields.buf.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.buffer",
		() => new buffer(),
		[],
		buffer,
		[{ name: "buf", key: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }]
	)
}

export function newBuffer(data: $.Slice<number>): buffer | $.VarRef<buffer> | null {
	let buf: buffer | $.VarRef<buffer> | null = new buffer({buf: data})
	return buf
}

export async function main(): globalThis.Promise<void> {
	let buf: buffer | $.VarRef<buffer> | null = newBuffer($.arrayToSlice<number>([$.uint(7, 8)]))
	$.println($.uint($.pointerValue<buffer>(buf).buf![0], 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
