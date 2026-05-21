// Generated file based on varref_struct_init.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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
	// Scenario 1: Value type that NeedsVarRef
	// 'val' is a value type, but its address is taken, so it should be varrefed in TS.
	let val = $.varRef($.markAsStructValue(new MyStruct({MyInt: 10})))
	let ptrToVal: MyStruct | $.VarRef<MyStruct> | null = val

	// Accessing field on varrefed value type: Should generate val.value.MyInt
	val.value.MyInt = 20

	// Scenario 2: Pointer type
	// We never take the address of ptr so it should not be varrefed.
	let ptr: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({MyInt: 30})

	// Accessing field on pointer type: Should generate ptr.MyInt
	$.pointerValue<MyStruct>(ptr).MyInt = 40
	$.println("ptr.MyInt:", $.pointerValue<MyStruct>(ptr).MyInt)

	// Accessing pointer value, should use .value
	$.println("ptrToVal.MyInt:", $.pointerValue<MyStruct>(ptrToVal).MyInt)

	let myIntVal = $.pointerValue<MyStruct>(ptrToVal).MyInt
	$.println("myIntVal:", myIntVal)
}


if ($.isMainScript(import.meta)) {
	await main()
}
