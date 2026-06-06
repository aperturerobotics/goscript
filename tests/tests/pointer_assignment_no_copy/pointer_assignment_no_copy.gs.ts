// Generated file based on pointer_assignment_no_copy.go
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
			MyInt: $.varRef(init?.MyInt ?? (0 as unknown as number)),
			MyString: $.varRef(init?.MyString ?? ("" as unknown as string))
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
		() => new MyStruct(),
		[],
		MyStruct,
		[{ name: "MyInt", key: "MyInt", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "MyString", key: "MyString", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 8, exported: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let original: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({MyInt: 10, MyString: "original"})

	// === Pointer Assignment (No Copy) ===
	// Assigning a pointer variable to another pointer variable.
	let pointerCopy: MyStruct | $.VarRef<MyStruct> | null = original

	// Modify the struct through the original pointer.
	$.pointerValue<MyStruct>(original).MyString = "modified original"

	// The change should be reflected when accessing through the copied pointer.
	// Expected: "modified original"
	$.println("Pointer copy value: Expected: modified original, Actual: " + $.pointerValue<MyStruct>(pointerCopy).MyString)

	// Modify the struct through the copied pointer.
	$.pointerValue<MyStruct>(pointerCopy).MyInt = 20

	// The change should be reflected when accessing through the original pointer.
	// Expected: 20
	$.println("Original value after pointer copy modification: Expected: 20, Actual:", $.pointerValue<MyStruct>(original).MyInt)
}

if ($.isMainScript(import.meta)) {
	await main()
}
