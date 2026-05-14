// Generated file based on struct_new.go
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
	let ptr = new MyStruct()
	$.println("ptr.MyInt (default):", $.pointerValue(ptr).MyInt)
	$.println("ptr.MyString (default):", $.pointerValue(ptr).MyString)
	$.println("ptr.myBool (default):", $.pointerValue(ptr).myBool)
	$.pointerValue(ptr).MyInt = 42
	$.pointerValue(ptr).MyString = "hello"
	$.pointerValue(ptr).myBool = true
	$.println("ptr.MyInt (assigned):", $.pointerValue(ptr).MyInt)
	$.println("ptr.MyString (assigned):", $.pointerValue(ptr).MyString)
	$.println("ptr.myBool (assigned):", $.pointerValue(ptr).myBool)
	let s: MyStruct = $.markAsStructValue($.pointerValue(new MyStruct()).clone())
	$.println("s.MyInt (default):", s.MyInt)
	$.println("s.MyString (default):", s.MyString)
	$.println("s.myBool (default):", s.myBool)
	s.MyInt = 100
	s.MyString = "world"
	s.myBool = false
	$.println("s.MyInt (assigned):", s.MyInt)
	$.println("s.MyString (assigned):", s.MyString)
	$.println("s.myBool (assigned):", s.myBool)
}


if ($.isMainScript(import.meta)) {
	await main()
}
