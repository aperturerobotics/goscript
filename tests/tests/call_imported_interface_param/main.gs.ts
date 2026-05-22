// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/call_imported_interface_param/subpkg/index.js"

import * as __goscript_sink from "./sink.gs.ts"

export class Buffer {
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

	public clone(): Buffer {
		const cloned = new Buffer()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		let b: Buffer | $.VarRef<Buffer> | null = this
		$.pointerValue<Buffer>(b).data = $.append($.pointerValue<Buffer>(b).data, p)
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.Buffer",
		new Buffer(),
		[{ name: "Write", args: [], returns: [] }],
		Buffer,
		{"data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export async function main(): Promise<void> {
	let b: $.VarRef<Buffer> = $.varRef($.markAsStructValue(new Buffer()))
	__goscript_sink.Use($.interfaceValue<subpkg.Writer | null>(b, "*main.Buffer"))
	$.println($.bytesToString(b.value.data))
}


if ($.isMainScript(import.meta)) {
	await main()
}
