// Generated file based on method_call_on_pointer_receiver.go
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
		const m: MyStruct | $.VarRef<MyStruct> | null = this
		return $.pointerValue<MyStruct>(m).MyString
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[{ name: "GetMyString", args: [], returns: [] }],
		MyStruct,
		{"MyInt": { kind: $.TypeKind.Basic, name: "int" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class setterStruct {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): setterStruct {
		const cloned = new setterStruct()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public ["get"](): number {
		const s: setterStruct | $.VarRef<setterStruct> | null = this
		return $.pointerValue<setterStruct>(s).value
	}

	public ["set"](value: number): void {
		const s: setterStruct | $.VarRef<setterStruct> | null = this
		$.pointerValue<setterStruct>(s).value = value
	}

	static __typeInfo = $.registerStructType(
		"main.setterStruct",
		new setterStruct(),
		[{ name: "get", args: [], returns: [] }, { name: "set", args: [], returns: [] }],
		setterStruct,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let structPointer: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({MyInt: 4, MyString: "hello world"})
	// === Method Call on Pointer Receiver ===
	// Calling a method with a pointer receiver (*MyStruct) using a pointer variable.
	$.println("Method call on pointer (structPointer): Expected: hello world, Actual: " + $.pointerValue<MyStruct>(structPointer).GetMyString())

	let setter: setterStruct | $.VarRef<setterStruct> | null = new setterStruct()
	$.pointerValue<setterStruct>(setter).set(9)
	$.println("reserved pointer method:", $.pointerValue<setterStruct>(setter).get())
}


if ($.isMainScript(import.meta)) {
	await main()
}
