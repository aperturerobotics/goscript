// Generated file based on function_call_result_assignment.go
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
			MyInt: $.varRef(init?.MyInt ?? (0 as unknown as number)),
			MyString: $.varRef(init?.MyString ?? ("" as unknown as string)),
			myBool: $.varRef(init?.myBool ?? (false as unknown as boolean))
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
		() => new MyStruct(),
		[],
		MyStruct,
		[{ name: "MyInt", key: "MyInt", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "MyString", key: "MyString", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 8, exported: true }, { name: "myBool", key: "myBool", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/function_call_result_assignment", index: [2], offset: 24, exported: false }]
	)
}

export function NewMyStruct(s: string): MyStruct {
	return $.markAsStructValue(new MyStruct({MyString: s}))
}

export async function main(): globalThis.Promise<void> {
	// === Function Call Result Assignment (Value Copy) ===
	// Assigning the result of a function that returns a struct creates a copy.
	let structFromFunc = $.markAsStructValue($.cloneStructValue(NewMyStruct("function result")))
	let structFromFuncCopy = $.markAsStructValue($.cloneStructValue(structFromFunc))
	structFromFuncCopy.MyString = "modified function result copy"
	// Expected: "function result"
	$.println("Original struct from function: Expected: function result, Actual: " + structFromFunc.MyString)
	// Expected: "modified function result copy"
	$.println("Modified struct from function copy: Expected: modified function result copy, Actual: " + structFromFuncCopy.MyString)
}

if ($.isMainScript(import.meta)) {
	await main()
}
