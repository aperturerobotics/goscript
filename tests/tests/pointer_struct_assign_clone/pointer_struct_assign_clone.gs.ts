// Generated file based on pointer_struct_assign_clone.go
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
		new MyStruct(),
		[],
		MyStruct,
		{"Value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let s1 = $.markAsStructValue(new MyStruct({Value: 10}))
	let p: MyStruct | $.VarRef<MyStruct> | null = null
	p = new MyStruct({Value: 20})

	// This assignment should trigger the .clone() on s1
	// because s1 is a struct and *p is being assigned.
	$.assignStruct($.pointerValue<MyStruct>(p), $.markAsStructValue(s1.clone()))

	$.println($.pointerValue<MyStruct>(p).Value)

	// Modify s1 to ensure p is a clone and not a reference
	s1.Value = 30
	$.println($.pointerValue<MyStruct>(p).Value)

	// Test assignment from a pointer to a struct (should not clone)
	let s2 = new MyStruct({Value: 40})
	let p2 = new MyStruct({Value: 50})
	$.assignStruct($.pointerValue<MyStruct>(p2), $.markAsStructValue($.pointerValue<MyStruct>(s2).clone()))
	$.println($.pointerValue<MyStruct>(p2).Value)

	$.pointerValue<MyStruct>(s2).Value = 60
	$.println($.pointerValue<MyStruct>(p2).Value)
	// GoScript should replicate this by cloning if the RHS is a struct value.
	// In *p2 = *s2, *s2 is a struct value.

	// Test assignment of a struct from a function call
	let s3 = $.markAsStructValue(new MyStruct({Value: 70}))
	let p3 = new MyStruct({Value: 80})
	$.assignStruct($.pointerValue<MyStruct>(p3), $.markAsStructValue(getStruct().clone()))
	$.println($.pointerValue<MyStruct>(p3).Value)
	$.println(s3.Value)

	// Test assignment of a struct from a pointer returned by a function call
	let p4 = new MyStruct({Value: 90})
	$.assignStruct($.pointerValue<MyStruct>(p4), $.markAsStructValue($.pointerValue<MyStruct>(getStructPointer()).clone()))
	$.println($.pointerValue<MyStruct>(p4).Value)
}


if ($.isMainScript(import.meta)) {
	await main()
}

export function getStruct(): MyStruct {
	return $.markAsStructValue(new MyStruct({Value: 100}))
}

export function getStructPointer(): MyStruct | $.VarRef<MyStruct> | null {
	return new MyStruct({Value: 110})
}
