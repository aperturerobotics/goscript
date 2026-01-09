// Generated file based on interface_subset_type_switch.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInterface1 = null | {
	MyString1(): string
	MyString2(): string
}

$.registerInterfaceType(
  'main.MyInterface1',
  null, // Zero value for interface is null
  [{ name: "MyString1", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MyString2", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export type MyInterface2 = null | {
	MyString1(): string
}

$.registerInterfaceType(
  'main.MyInterface2',
  null, // Zero value for interface is null
  [{ name: "MyString1", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export class MyStruct {
	public get Value1(): string {
		return this._fields.Value1.value
	}
	public set Value1(value: string) {
		this._fields.Value1.value = value
	}

	public get Value2(): string {
		return this._fields.Value2.value
	}
	public set Value2(value: string) {
		this._fields.Value2.value = value
	}

	public _fields: {
		Value1: $.VarRef<string>;
		Value2: $.VarRef<string>;
	}

	constructor(init?: Partial<{Value1?: string, Value2?: string}>) {
		this._fields = {
			Value1: $.varRef(init?.Value1 ?? ""),
			Value2: $.varRef(init?.Value2 ?? "")
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Value1: $.varRef(this._fields.Value1.value),
			Value2: $.varRef(this._fields.Value2.value)
		}
		return cloned
	}

	public MyString1(): string {
		const m = this
		return m.Value1
	}

	public MyString2(): string {
		const m = this
		return m.Value2
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyStruct',
	  new MyStruct(),
	  [{ name: "MyString1", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MyString2", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  MyStruct,
	  {"Value1": { kind: $.TypeKind.Basic, name: "string" }, "Value2": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export function processInterface(i: null | any): void {
	$.typeSwitch(i, [{ types: ['main.MyInterface1'], body: (v) => {
		$.println("MyInterface1:", v!.MyString1(), v!.MyString2())
	}},
	{ types: ['main.MyInterface2'], body: (v) => {
		$.println("MyInterface2:", v!.MyString1())
	}}], () => {
		$.println("Unknown type")
	})
}

export async function main(): Promise<void> {
	let s = $.markAsStructValue(new MyStruct({Value1: "hello", Value2: "world"}))

	// Test with MyInterface1
	let i1: MyInterface1 = $.markAsStructValue(s.clone())
	processInterface(i1)

	// Test with MyInterface2
	let i2: MyInterface2 = $.markAsStructValue(s.clone())
	processInterface(i2)

	// Test with concrete type
	processInterface(s)

	// Type switch with subset casting
	let i3: null | any = i1
	$.typeSwitch(i3, [{ types: ['main.MyInterface2'], body: (v) => {
		$.println("Matched MyInterface2 from i1:", v!.MyString1())
	}},
	{ types: ['main.MyInterface1'], body: (v) => {
		$.println("Matched MyInterface1 from i1:", v!.MyString1(), v!.MyString2())
	}}], () => {
		$.println("No match")
	})
}

