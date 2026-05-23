// Generated file based on interface_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInterface = null | {
	Method1(): number
}

$.registerInterfaceType(
	"main.MyInterface",
	null,
	[{ name: "Method1", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export class MyStruct {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<number>
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
		return $.markAsStructValue(cloned)
	}

	public Method1(): number {
		const m = this
		return m.Value
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[{ name: "Method1", args: [], returns: [] }],
		MyStruct,
		{"Value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let i: MyInterface | null = null as MyInterface | null
	let s = $.markAsStructValue(new MyStruct({Value: 10}))
	i = $.interfaceValue<MyInterface | null>($.markAsStructValue($.cloneStructValue(s)), "main.MyStruct")

	let [, ok] = $.typeAssertTuple<MyStruct>(i, "main.MyStruct")
	if (ok) {
		$.println("Type assertion successful")
	} else {
		$.println("Type assertion failed")
	}

	// try a second time since this generates something different when using = and not :=
	let __goscriptTuple0: any = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	ok = __goscriptTuple0[1]
	if (ok) {
		$.println("Type assertion successful")
	} else {
		// expected
		$.println("Type assertion failed")
	}

	// assign result to a variable
	let [val, ok2] = $.typeAssertTuple<MyStruct>(i, "main.MyStruct")
	if (!ok2) {
		$.println("type assertion failed")
	} else {
		$.println("type assertion success", val.Value)
	}

	let nilInterface: MyInterface | null = null as MyInterface | null
	let __goscriptTuple1: any = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(nilInterface, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let nilVal: MyStruct | $.VarRef<MyStruct> | null = __goscriptTuple1[0]
	let ok3 = __goscriptTuple1[1]
	if (ok3 && ($.pointerValue<MyStruct>(nilVal).Value == 0)) {
		$.println("nil interface pointer assertion succeeded")
	} else {
		$.println("nil interface pointer assertion failed")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
