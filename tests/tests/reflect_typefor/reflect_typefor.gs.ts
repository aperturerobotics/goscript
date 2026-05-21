// Generated file based on reflect_typefor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

export type MyInterface = null | {
	SomeMethod(): void
}

$.registerInterfaceType(
	"main.MyInterface",
	null,
	[{ name: "SomeMethod", args: [], returns: [] }]
)

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
		Name: $.VarRef<string>
		Age: $.VarRef<number>
	}

	constructor(init?: Partial<{Name?: string, Age?: number}>) {
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
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[],
		MyStruct,
		{"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	// Test TypeFor with named interface type
	let t1 = reflect.TypeFor({T: { type: "main.MyInterface", zero: () => null, methods: {SomeMethod: (receiver: any, ...args: any[]) => receiver.SomeMethod(...args)} }})
	$.println("TypeFor interface:", $.pointerValue(t1).String())

	// Test TypeFor with struct type
	let t2 = reflect.TypeFor({T: { type: "main.MyStruct", zero: () => new MyStruct() }})
	$.println("TypeFor struct:", $.pointerValue(t2).String())
	$.println("TypeFor struct kind:", $.pointerValue(t2).Kind() == reflect.Struct)

	// Test TypeFor with int type
	let t3 = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	$.println("TypeFor int:", $.pointerValue(t3).String())
	$.println("TypeFor int kind:", $.pointerValue(t3).Kind() == reflect.Int)

	// Test Pointer constant (should be same as Ptr)
	$.println("Pointer constant:", reflect.Pointer == reflect.Pointer)

	$.println("reflect_typefor test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
