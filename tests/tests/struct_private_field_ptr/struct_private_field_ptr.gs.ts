// Generated file based on struct_private_field_ptr.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class MyStruct {
	public get myPrivate(): $.VarRef<number> | null {
		return this._fields.myPrivate.value
	}
	public set myPrivate(value: $.VarRef<number> | null) {
		this._fields.myPrivate.value = value
	}

	public _fields: {
		myPrivate: $.VarRef<$.VarRef<number> | null>
	}

	constructor(init?: Partial<{myPrivate?: $.VarRef<number> | null}>) {
		this._fields = {
			myPrivate: $.varRef(init?.myPrivate ?? null)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			myPrivate: $.varRef(this._fields.myPrivate.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[],
		MyStruct,
		{"myPrivate": { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export async function main(): Promise<void> {
	let myStruct = new MyStruct({myPrivate: null})
	let intVar: $.VarRef<number> = $.varRef(10)
	$.pointerValue(myStruct).myPrivate = intVar
	intVar.value = 15
	$.println($.pointerValue($.pointerValue(myStruct).myPrivate))
}


if ($.isMainScript(import.meta)) {
	await main()
}
