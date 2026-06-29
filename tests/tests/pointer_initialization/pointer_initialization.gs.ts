// Generated file based on pointer_initialization.go
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
			MyInt: $.varRef(init?.MyInt ?? (0 as number)),
			MyString: $.varRef(init?.MyString ?? ("" as string))
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
		[{ name: "MyInt", key: "MyInt", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "MyString", key: "MyString", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	// === Pointer Initialization ===
	// Create a pointer to a MyStruct instance using a composite literal.
	let structPointer: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({MyInt: 4, MyString: "hello world"})
	// Expected: "hello world"
	$.println("Initial MyString (via pointer): Expected: hello world, Actual: " + $.pointerValue<MyStruct>(structPointer).MyString)
}

if ($.isMainScript(import.meta)) {
	await main()
}
