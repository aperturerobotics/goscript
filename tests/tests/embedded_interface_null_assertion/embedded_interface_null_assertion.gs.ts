// Generated file based on embedded_interface_null_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type Reader = null | {
	Read(p: $.Slice<number>): [number, error]
}

$.registerInterfaceType(
	"main.Reader",
	null,
	[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }]
)

export class MyReader {
	public get Reader(): Reader {
		return this._fields.Reader.value
	}
	public set Reader(value: Reader) {
		this._fields.Reader.value = value
	}

	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		Reader: $.VarRef<Reader>
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{Reader?: Reader, name?: string}>) {
		this._fields = {
			Reader: $.varRef(init?.Reader ?? null),
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): MyReader {
		const cloned = new MyReader()
		cloned._fields = {
			Reader: $.varRef(this._fields.Reader.value),
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyReader",
		new MyReader(),
		[],
		MyReader,
		{"Reader": "main.Reader", "name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class StringReader {
	public get data(): string {
		return this._fields.data.value
	}
	public set data(value: string) {
		this._fields.data.value = value
	}

	public get pos(): number {
		return this._fields.pos.value
	}
	public set pos(value: number) {
		this._fields.pos.value = value
	}

	public _fields: {
		data: $.VarRef<string>
		pos: $.VarRef<number>
	}

	constructor(init?: Partial<{data?: string, pos?: number}>) {
		this._fields = {
			data: $.varRef(init?.data ?? ""),
			pos: $.varRef(init?.pos ?? 0)
		}
	}

	public clone(): StringReader {
		const cloned = new StringReader()
		cloned._fields = {
			data: $.varRef(this._fields.data.value),
			pos: $.varRef(this._fields.pos.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Read(p: $.Slice<number>): void {
		const s = this
		if ($.pointerValue(s).pos >= $.len($.pointerValue(s).data)) {
			return [0, null]
		}
		let n = $.copy(p, $.stringToBytes($.sliceStringOrBytes($.pointerValue(s).data, $.pointerValue(s).pos, undefined)))
		$.pointerValue(s).pos += n
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.StringReader",
		new StringReader(),
		[{ name: "Read", args: [], returns: [] }],
		StringReader,
		{"data": { kind: $.TypeKind.Basic, name: "string" }, "pos": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let mr1 = new MyReader({name: "test1"})
	$.println($.pointerValue(mr1).Reader == null)
	let sr = new StringReader({data: "hello", pos: 0})
	let mr2 = new MyReader({Reader: sr, name: "test2"})
	$.println($.pointerValue(mr2).Reader != null)
	let buf = $.makeSlice<number>(5, undefined, "byte")
	let [n, ] = $.markAsStructValue($.pointerValue(mr2).clone()).Read(buf)
	$.println(n == 5)
	$.println(10)
	$.println(15)
	$.println(true)
}


if ($.isMainScript(import.meta)) {
	await main()
}
