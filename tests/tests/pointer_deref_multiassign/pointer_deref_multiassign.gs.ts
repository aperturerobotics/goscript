// Generated file based on pointer_deref_multiassign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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

	public get myBool(): boolean {
		return this._fields.myBool.value
	}
	public set myBool(value: boolean) {
		this._fields.myBool.value = value
	}

	public _fields: {
		MyInt: $.VarRef<number>
		MyString: $.VarRef<string>
		myBool: $.VarRef<boolean>
	}

	constructor(init?: Partial<{MyInt?: number, MyString?: string, myBool?: boolean}>) {
		this._fields = {
			MyInt: $.varRef(init?.MyInt ?? 0),
			MyString: $.varRef(init?.MyString ?? ""),
			myBool: $.varRef(init?.myBool ?? false)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			MyInt: $.varRef(this._fields.MyInt.value),
			MyString: $.varRef(this._fields.MyString.value),
			myBool: $.varRef(this._fields.myBool.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[],
		MyStruct,
		{"MyInt": { kind: $.TypeKind.Basic, name: "int" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }, "myBool": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export async function main(): Promise<void> {
	let structPointer = new MyStruct({MyInt: 4, MyString: "hello world"})
	let dereferencedStructCopy = $.markAsStructValue($.pointerValue(structPointer).clone())
	let unusedString = "hello"
	unusedString
	dereferencedStructCopy
}


if ($.isMainScript(import.meta)) {
	await main()
}
