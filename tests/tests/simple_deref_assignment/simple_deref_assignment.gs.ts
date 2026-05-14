// Generated file based on simple_deref_assignment.go
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

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[],
		MyStruct,
		{"MyInt": { kind: $.TypeKind.Basic, name: "int" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): Promise<void> {
	let structPointer = new MyStruct({MyInt: 4, MyString: "hello world"})
	let simpleDereferencedCopy = $.markAsStructValue($.pointerValue(structPointer).clone())
	simpleDereferencedCopy.MyString = "modified dereferenced copy"
	$.println("Original structPointer after modifying simpleDereferencedCopy: Expected: hello world, Actual: " + $.pointerValue(structPointer).MyString)
	$.println("Simple Dereferenced Copy: Expected: modified dereferenced copy, Actual: " + simpleDereferencedCopy.MyString)
}


if ($.isMainScript(import.meta)) {
	await main()
}
