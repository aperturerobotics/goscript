// Generated file based on interface_subset_cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInterface1 = null | {
	MyString1(): string
	MyString2(): string
}

$.registerInterfaceType(
	"main.MyInterface1",
	null,
	[{ name: "MyString1", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MyString2", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export type MyInterface2 = null | {
	MyString1(): string
}

$.registerInterfaceType(
	"main.MyInterface2",
	null,
	[{ name: "MyString1", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export class MyStruct {
	public get Value1(): string {
		return this._fields.Value1.value
	}
	public set Value1(value: string) {
		this._fields.Value1.value = value
	}

	public get Value2(): string {
		return this._fields.Value2.value
	}
	public set Value2(value: string) {
		this._fields.Value2.value = value
	}

	public _fields: {
		Value1: $.VarRef<string>
		Value2: $.VarRef<string>
	}

	constructor(init?: Partial<{Value1?: string, Value2?: string}>) {
		this._fields = {
			Value1: $.varRef(init?.Value1 ?? ""),
			Value2: $.varRef(init?.Value2 ?? "")
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Value1: $.varRef(this._fields.Value1.value),
			Value2: $.varRef(this._fields.Value2.value)
		}
		return $.markAsStructValue(cloned)
	}

	public MyString1(): string {
		const m = this
		return m.Value1
	}

	public MyString2(): string {
		const m = this
		return m.Value2
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[{ name: "MyString1", args: [], returns: [] }, { name: "MyString2", args: [], returns: [] }],
		MyStruct,
		{"Value1": { kind: $.TypeKind.Basic, name: "string" }, "Value2": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): Promise<void> {
	let s = $.markAsStructValue(new MyStruct({Value1: "hello", Value2: "world"}))
	let i1: MyInterface1 | null = $.markAsStructValue(s.clone())

	// Cast from larger interface to smaller interface (subset)
	let i2: MyInterface2 | null = i1

	$.println("i1.MyString1():", $.pointerValue(i1).MyString1())
	$.println("i1.MyString2():", $.pointerValue(i1).MyString2())
	$.println("i2.MyString1():", $.pointerValue(i2).MyString1())

	// Type assertion from larger to smaller interface
	let [i3, ok] = $.typeAssertTuple<MyInterface2 | null>(i1, "main.MyInterface2")
	if (ok) {
		$.println("Type assertion successful")
		$.println("i3.MyString1():", $.pointerValue(i3).MyString1())
	} else {
		$.println("Type assertion failed")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
