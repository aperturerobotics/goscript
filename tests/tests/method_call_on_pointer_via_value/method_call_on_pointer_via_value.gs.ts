// Generated file based on method_call_on_pointer_via_value.go
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

	public GetValue(): number {
		const m = this
		return m.MyInt
	}

	public SetValue(v: number): void {
		let m: MyStruct | $.VarRef<MyStruct> | null = this
		$.pointerValue<MyStruct>(m).MyInt = v
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[{ name: "GetValue", args: [], returns: [] }, { name: "SetValue", args: [], returns: [] }],
		MyStruct,
		{"MyInt": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): globalThis.Promise<void> {
	// Create a struct value
	let msValue = $.varRef($.markAsStructValue(new MyStruct({MyInt: 100})))

	// === Method Call on Pointer Receiver via Value ===
	// Call the pointer-receiver method using the value variable.
	// Go implicitly takes the address of msValue (&msValue) to call SetValue.
	msValue.value.SetValue(200)

	// Verify the value was modified through the method call.
	// Expected: 200
	$.println("Value after pointer method call via value: Expected: 200, Actual:", $.markAsStructValue($.cloneStructValue(msValue.value)).GetValue())
}


if ($.isMainScript(import.meta)) {
	await main()
}
