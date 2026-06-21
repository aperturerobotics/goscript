// Generated file based on embedded_interface_null_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Reader = {
	Read(p: $.Slice<number>): [number, $.GoError]
}

$.registerInterfaceType(
	"main.Reader",
	null,
	[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }]
);

export class MyReader {
	public get Reader(): Reader | null {
		return this._fields.Reader.value
	}
	public set Reader(value: Reader | null) {
		this._fields.Reader.value = value
	}

	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		Reader: $.VarRef<Reader | null>
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{Reader?: Reader | null, name?: string}>) {
		this._fields = {
			Reader: $.varRef(init?.Reader ?? (null as unknown as Reader | null)),
			name: $.varRef(init?.name ?? ("" as unknown as string))
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

	public Read(p: any): any {
		return $.pointerValue<Exclude<Reader | null, null>>(this.Reader).Read(p)
	}

	static __typeInfo = $.registerStructType(
		"main.MyReader",
		() => new MyReader(),
		[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		MyReader,
		[{ name: "Reader", key: "Reader", type: "main.Reader", anonymous: true, index: [0], offset: 0, exported: true }, { name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/s4wave/goscript/tests/tests/embedded_interface_null_assertion", index: [1], offset: 16, exported: false }]
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
			data: $.varRef(init?.data ?? ("" as unknown as string)),
			pos: $.varRef(init?.pos ?? (0 as unknown as number))
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

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let s: StringReader | $.VarRef<StringReader> | null = this
		if ($.pointerValue<StringReader>(s).pos >= $.len($.pointerValue<StringReader>(s).data)) {
			return [0, null]
		}
		let n = $.copy(p, $.stringToBytes($.sliceStringOrBytes($.pointerValue<StringReader>(s).data, $.pointerValue<StringReader>(s).pos, undefined)))
		$.pointerValue<StringReader>(s).pos = $.pointerValue<StringReader>(s).pos + (n)
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.StringReader",
		() => new StringReader(),
		[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		StringReader,
		[{ name: "data", key: "data", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/s4wave/goscript/tests/tests/embedded_interface_null_assertion", index: [0], offset: 0, exported: false }, { name: "pos", key: "pos", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/s4wave/goscript/tests/tests/embedded_interface_null_assertion", index: [1], offset: 16, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let mr1: MyReader | $.VarRef<MyReader> | null = new MyReader({name: "test1"})
	$.println($.pointerValue<MyReader>(mr1).Reader == null)

	let sr: StringReader | $.VarRef<StringReader> | null = new StringReader({data: "hello", pos: 0})
	let mr2: MyReader | $.VarRef<MyReader> | null = new MyReader({Reader: $.interfaceValue<Reader | null>(sr, "*main.StringReader"), name: "test2"})
	$.println($.pointerValue<MyReader>(mr2).Reader != null)

	let buf: $.Slice<number> = $.makeSlice<number>(5, undefined, "byte")
	let [n, ] = $.pointerValue<Exclude<Reader, null>>($.pointerValue<MyReader>(mr2).Reader).Read(buf)
	$.println(n == 5)

	$.println(10)
	$.println(15)
	$.println(true)
}

if ($.isMainScript(import.meta)) {
	await main()
}
