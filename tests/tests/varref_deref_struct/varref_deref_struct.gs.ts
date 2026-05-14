// Generated file based on varref_deref_struct.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class MyStruct {
	public get MyInt(): number {
		return this._fields.MyInt.value
	}
	public set MyInt(value: number) {
		this._fields.MyInt.value = value
	}

	public _fields: {
		MyInt: $.VarRef<number>
	}

	constructor(init?: Partial<{MyInt?: number}>) {
		this._fields = {
			MyInt: $.varRef(init?.MyInt ?? 0)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			MyInt: $.varRef(this._fields.MyInt.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[],
		MyStruct,
		{"MyInt": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let myStruct = new MyStruct()
	($.pointerValue(myStruct)).MyInt = 5
	$.println(($.pointerValue(myStruct)).MyInt)
	let myOtherStruct = new MyStruct({MyInt: 1})
	if (myOtherStruct != myStruct) {
		$.println("expected not equal")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
