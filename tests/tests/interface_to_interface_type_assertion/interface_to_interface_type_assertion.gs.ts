// Generated file based on interface_to_interface_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInterface = {
	Method1(): number
}

$.registerInterfaceType(
	"main.MyInterface",
	null,
	[{ name: "Method1", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export type MyOtherInterface = {
	Method1(): number
}

$.registerInterfaceType(
	"main.MyOtherInterface",
	null,
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
		Value: $.VarRef<number>
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? (0 as unknown as number))
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
		[{ name: "Method1", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		MyStruct,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let i: MyInterface | null = null as MyInterface | null
	let s = $.markAsStructValue(new MyStruct({Value: 10}))
	i = $.interfaceValue<MyInterface | null>($.markAsStructValue($.cloneStructValue(s)), "main.MyStruct")

	let [, ok] = $.typeAssertTuple<MyOtherInterface | null>(i, "main.MyOtherInterface")
	if (ok) {
		$.println("Type assertion successful")
	} else {
		$.println("Type assertion failed")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
