// Generated file based on buffer_value_field_error.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class buffer {
	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{data?: $.Slice<number>}>) {
		this._fields = {
			data: $.varRef(init?.data ?? null)
		}
	}

	public clone(): buffer {
		const cloned = new buffer()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	public write(p: $.Slice<number>): void {
		const b = this
		$.pointerValue(b).data = $.append($.pointerValue(b).data, p)
	}

	public writeByte(c: number): void {
		const b = this
		$.pointerValue(b).data = $.append($.pointerValue(b).data, c)
	}

	public writeString(s: string): void {
		const b = this
		$.pointerValue(b).data = $.append($.pointerValue(b).data, s)
	}

	static __typeInfo = $.registerStructType(
		"main.buffer",
		new buffer(),
		[{ name: "write", args: [], returns: [] }, { name: "writeByte", args: [], returns: [] }, { name: "writeString", args: [], returns: [] }],
		buffer,
		{"data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export async function main(): Promise<void> {
	let buf = new buffer()
	$.pointerValue(buf).write($.stringToBytes("hello"))
	$.println("After write:", $.bytesToString($.pointerValue(buf).data))
	$.pointerValue(buf).writeString(" world")
	$.println("After writeString:", $.bytesToString($.pointerValue(buf).data))
	$.pointerValue(buf).writeByte(33)
	$.println("After writeByte:", $.bytesToString($.pointerValue(buf).data))
}


if ($.isMainScript(import.meta)) {
	await main()
}
