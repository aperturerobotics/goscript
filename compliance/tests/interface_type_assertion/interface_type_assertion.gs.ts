// Generated file based on interface_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInterface = null | {
	Method1(): number
}

$.registerInterfaceType(
  'main.MyInterface',
  null, // Zero value for interface is null
  [{ name: "Method1", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export class MyStruct {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<number>;
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? 0)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return cloned
	}

	public Method1(): number {
		const m = this
		return m.Value
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyStruct',
	  new MyStruct(),
	  [{ name: "Method1", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
	  MyStruct,
	  {"Value": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export async function main(): Promise<void> {
	let i: MyInterface = null
	let s = $.markAsStructValue(new MyStruct({Value: 10}))
	i = $.markAsStructValue(s.clone())

	let { ok: ok } = $.typeAssert<MyStruct>(i, 'main.MyStruct')
	if (ok) {
		$.println("Type assertion successful")
	} else {
		$.println("Type assertion failed")
	}

	// try a second time since this generates something different when using = and not :=
	({ ok: ok } = $.typeAssert<MyStruct | null>(i, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'}))

	// expected
	if (ok) {
		$.println("Type assertion successful")
	} else {
		// expected
		$.println("Type assertion failed")
	}

	// assign result to a variable
	let { value: val, ok: ok2 } = $.typeAssert<MyStruct>(i, 'main.MyStruct')
	if (!ok2) {
		$.println("type assertion failed")
	} else {
		$.println("type assertion success", val.Value)
	}
}

