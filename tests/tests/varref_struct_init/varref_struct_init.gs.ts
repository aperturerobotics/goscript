// Generated file based on varref_struct_init.go
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
	let val = $.varRef($.markAsStructValue(new MyStruct({MyInt: 10})))
	let ptrToVal = val
	val.value.MyInt = 20
	let ptr = new MyStruct({MyInt: 30})
	$.pointerValue(ptr).MyInt = 40
	$.println("ptr.MyInt:", $.pointerValue(ptr).MyInt)
	$.println("ptrToVal.MyInt:", $.pointerValue(ptrToVal).MyInt)
	let myIntVal = $.pointerValue(ptrToVal).MyInt
	$.println("myIntVal:", myIntVal)
}


if ($.isMainScript(import.meta)) {
	await main()
}
