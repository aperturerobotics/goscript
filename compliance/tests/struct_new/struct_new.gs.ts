// Generated file based on struct_new.go
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
		MyInt: $.VarRef<number>;
		MyString: $.VarRef<string>;
		myBool: $.VarRef<boolean>;
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
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyStruct',
	  new MyStruct(),
	  [],
	  MyStruct,
	  {"MyInt": { kind: $.TypeKind.Basic, name: "int" }, "MyString": { kind: $.TypeKind.Basic, name: "string" }, "myBool": { kind: $.TypeKind.Basic, name: "bool" }}
	);
}

export async function main(): Promise<void> {
	// Test new(MyStruct)
	let ptr = new MyStruct()
	$.println("ptr.MyInt (default):", ptr!.MyInt) // Expected: 0
	$.println("ptr.MyString (default):", ptr!.MyString) // Expected: ""
	$.println("ptr.myBool (default):", ptr!.myBool) // Expected: false

	ptr!.MyInt = 42
	ptr!.MyString = "hello"
	ptr!.myBool = true

	$.println("ptr.MyInt (assigned):", ptr!.MyInt) // Expected: 42
	$.println("ptr.MyString (assigned):", ptr!.MyString) // Expected: "hello"
	$.println("ptr.myBool (assigned):", ptr!.myBool) // Expected: true

	// Test assignment to a dereferenced new struct
	let s: MyStruct = $.markAsStructValue(new MyStruct()!.clone())
	$.println("s.MyInt (default):", s.MyInt) // Expected: 0
	$.println("s.MyString (default):", s.MyString) // Expected: ""
	$.println("s.myBool (default):", s.myBool) // Expected: false

	s.MyInt = 100
	s.MyString = "world"
	s.myBool = false // though private, it's in the same package

	$.println("s.MyInt (assigned):", s.MyInt) // Expected: 100
	$.println("s.MyString (assigned):", s.MyString) // Expected: "world"
	$.println("s.myBool (assigned):", s.myBool) // Expected: false
}

