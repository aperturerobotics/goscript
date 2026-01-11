// Generated file based on reflect_typefor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

export type MyInterface = null | {
	SomeMethod(): void
}

$.registerInterfaceType(
  'main.MyInterface',
  null, // Zero value for interface is null
  [{ name: "SomeMethod", args: [], returns: [] }]
);

export class MyStruct {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Age(): number {
		return this._fields.Age.value
	}
	public set Age(value: number) {
		this._fields.Age.value = value
	}

	public _fields: {
		Name: $.VarRef<string>;
		Age: $.VarRef<number>;
	}

	constructor(init?: Partial<{Age?: number, Name?: string}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ""),
			Age: $.varRef(init?.Age ?? 0)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Age: $.varRef(this._fields.Age.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyStruct',
	  new MyStruct(),
	  [],
	  MyStruct,
	  {"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export async function main(): Promise<void> {
	// Test TypeFor with named interface type
	let t1 = reflect.getInterfaceTypeByName("main.MyInterface")
	$.println("TypeFor interface:", t1!.String())

	// Test TypeFor with struct type
	let t2 = reflect.TypeOf(new MyStruct())
	$.println("TypeFor struct:", t2!.String())
	$.println("TypeFor struct kind:", t2!.Kind() == reflect.Struct)

	// Test TypeFor with int type
	let t3 = reflect.TypeOf(0)
	$.println("TypeFor int:", t3!.String())
	$.println("TypeFor int kind:", t3!.Kind() == reflect.Int)

	// Test Pointer constant (should be same as Ptr)
	$.println("Pointer constant:", reflect.Ptr == reflect.Ptr)

	$.println("reflect_typefor test finished")
}

