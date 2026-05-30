// Generated file based on simple_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[],
		MyStruct,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let original = $.varRef($.markAsStructValue(new MyStruct({Value: 30})))
	let pAlias: MyStruct | $.VarRef<MyStruct> | null = original

	let jAlias: any = $.interfaceValue<any>(pAlias, "*main.MyStruct")

	let [, ok] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(jAlias, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("pointer assertion result:", ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}
