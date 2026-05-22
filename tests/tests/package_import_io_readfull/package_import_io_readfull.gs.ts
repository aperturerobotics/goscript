// Generated file based on package_import_io_readfull.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

export class fixedReader {
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

	public clone(): fixedReader {
		const cloned = new fixedReader()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let r: fixedReader | $.VarRef<fixedReader> | null = this
		let n = $.copy(p, $.pointerValue<fixedReader>(r).data)
		$.pointerValue<fixedReader>(r).data = $.goSlice($.pointerValue<fixedReader>(r).data, n, undefined)
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.fixedReader",
		new fixedReader(),
		[{ name: "Read", args: [], returns: [] }],
		fixedReader,
		{"data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export async function main(): globalThis.Promise<void> {
	let buf = $.makeSlice<number>(2, undefined, "byte")
	let [n, err] = io.ReadFull($.pointerValue($.interfaceValue<io.Reader | null>(new fixedReader({data: $.stringToBytes("abc")}), "*main.fixedReader")), buf)
	$.println("read:", n, $.bytesToString(buf), err == null)
}


if ($.isMainScript(import.meta)) {
	await main()
}
