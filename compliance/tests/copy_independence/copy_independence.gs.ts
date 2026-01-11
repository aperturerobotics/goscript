// Generated file based on copy_independence.go
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
		MyInt: $.VarRef<number>;
		MyString: $.VarRef<string>;
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
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyStruct',
	  new MyStruct(),
	  [],
	  MyStruct,
	  {"MyInt": { kind: $.TypeKind.Basic, name: "int" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export async function main(): Promise<void> {
	let structPointer = new MyStruct({MyInt: 4, MyString: "hello world"})
	let dereferencedStructCopy = $.markAsStructValue(structPointer!.clone())
	dereferencedStructCopy.MyString = "original dereferenced copy modified"
	let valueCopy1 = $.markAsStructValue(dereferencedStructCopy.clone())
	valueCopy1.MyString = "value copy 1"
	let valueCopy2 = $.markAsStructValue(dereferencedStructCopy.clone())
	valueCopy2.MyString = "value copy 2"
	let pointerCopy = structPointer

	// === Verifying Copy Independence ===
	// Expected: "hello world"
	$.println("pointerCopy (points to original structPointer): Expected: hello world, Actual: " + pointerCopy!.MyString)
	// Expected: "original dereferenced copy modified"
	$.println("dereferencedStructCopy (modified after copies were made): Expected: original dereferenced copy modified, Actual: " + dereferencedStructCopy.MyString)
	// Expected: "value copy 1"
	$.println("valueCopy1: Expected: value copy 1, Actual: " + valueCopy1.MyString)
	// Expected: "value copy 2"
	$.println("valueCopy2: Expected: value copy 2, Actual: " + valueCopy2.MyString)
}

