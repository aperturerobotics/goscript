// Generated file based on method_call_on_value_receiver.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public get MyInt(): number {
		return this._fields.MyInt.value
	}
	public set MyInt(value: number) {
		this._fields.MyInt.value = value
	}

	public get MyString(): string {
		return this._fields.MyString.value
	}
	public set MyString(value: string) {
		this._fields.MyString.value = value
	}

	public _fields: {
		MyInt: $.VarRef<number>
		MyString: $.VarRef<string>
	}

	constructor(init?: Partial<{MyInt?: number, MyString?: string}>) {
		this._fields = {
			MyInt: $.varRef(init?.MyInt ?? 0),
			MyString: $.varRef(init?.MyString ?? "")
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			MyInt: $.varRef(this._fields.MyInt.value),
			MyString: $.varRef(this._fields.MyString.value)
		}
		return $.markAsStructValue(cloned)
	}

	public GetMyString(): string {
		const m = this
		return m.MyString
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[{ name: "GetMyString", args: [], returns: [] }],
		MyStruct,
		{"MyInt": { kind: $.TypeKind.Basic, name: "int" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): Promise<void> {
	let ms = $.markAsStructValue(new MyStruct({MyInt: 1, MyString: "bar"}))
	$.println("Method call on value: Expected: bar, Actual:", $.markAsStructValue(ms.clone()).GetMyString())
}


if ($.isMainScript(import.meta)) {
	await main()
}
