// Generated file based on package_import_io_readfull.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as io from "@goscript/io/index.js"

export class fixedReader {
	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public get size(): number {
		return this._fields.size.value
	}
	public set size(value: number) {
		this._fields.size.value = value
	}

	public _fields: {
		data: $.VarRef<$.Slice<number>>
		size: $.VarRef<number>
	}

	constructor(init?: Partial<{data?: $.Slice<number>, size?: number}>) {
		this._fields = {
			data: $.varRef(init?.data ?? null),
			size: $.varRef(init?.size ?? 0)
		}
	}

	public clone(): fixedReader {
		const cloned = new fixedReader()
		cloned._fields = {
			data: $.varRef(this._fields.data.value),
			size: $.varRef(this._fields.size.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let r: fixedReader | $.VarRef<fixedReader> | null = this
		if ($.len($.pointerValue<fixedReader>(r).data) == 0) {
			return [0, io.EOF]
		}
		if (($.pointerValue<fixedReader>(r).size > 0) && ($.len(p) > $.pointerValue<fixedReader>(r).size)) {
			p = $.goSlice(p, undefined, $.pointerValue<fixedReader>(r).size)
		}
		let n = $.copy(p, $.pointerValue<fixedReader>(r).data)
		$.pointerValue<fixedReader>(r).data = $.goSlice($.pointerValue<fixedReader>(r).data, n, undefined)
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.fixedReader",
		() => new fixedReader(),
		[{ name: "Read", args: [], returns: [] }],
		fixedReader,
		{"data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "size": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let buf = $.makeSlice<number>(2, undefined, "byte")
	let [n, err] = await io.ReadFull($.pointerValue($.interfaceValue<io.Reader | null>(new fixedReader({data: new Uint8Array([97, 98, 99])}), "*main.fixedReader")), buf)
	$.println("read:", n, $.bytesToString(buf), err == null)
	let __goscriptTuple0: any = await io.ReadFull($.pointerValue($.interfaceValue<io.Reader | null>(bytes.NewReader(null), "*bytes.Reader")), buf)
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println("empty:", n, err == io.EOF)
	let __goscriptTuple1: any = await io.ReadFull($.pointerValue($.interfaceValue<io.Reader | null>(bytes.NewReader(new Uint8Array([120])), "*bytes.Reader")), buf)
	n = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	$.println("short:", n, $.bytesToString($.goSlice(buf, undefined, 1)), err == io.ErrUnexpectedEOF)
	let __goscriptTuple2: any = await io.ReadAll($.pointerValue($.interfaceValue<io.Reader | null>(new fixedReader({data: new Uint8Array([97, 98, 99, 68, 69, 70, 103, 104, 105]), size: 3}), "*main.fixedReader")))
	let all = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	$.println("readall:", $.bytesToString(all), err == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
