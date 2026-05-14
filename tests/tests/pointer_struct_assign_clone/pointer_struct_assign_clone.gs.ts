// Generated file based on pointer_struct_assign_clone.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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
	$.assignStruct($.pointerValue(p), $.markAsStructValue(s1.clone()))
	$.println($.pointerValue(p).Value)
	s1.Value = 30
	$.println($.pointerValue(p).Value)
	let s2 = new MyStruct({Value: 40})
	let p2 = new MyStruct({Value: 50})
	$.assignStruct($.pointerValue(p2), $.markAsStructValue($.pointerValue(s2).clone()))
	$.println($.pointerValue(p2).Value)
	$.pointerValue(s2).Value = 60
	$.println($.pointerValue(p2).Value)
	let s3 = $.markAsStructValue(new MyStruct({Value: 70}))
	let p3 = new MyStruct({Value: 80})
	$.assignStruct($.pointerValue(p3), $.markAsStructValue(getStruct().clone()))
	$.println($.pointerValue(p3).Value)
	$.println(s3.Value)
	let p4 = new MyStruct({Value: 90})
	$.assignStruct($.pointerValue(p4), $.markAsStructValue($.pointerValue(getStructPointer()).clone()))
	$.println($.pointerValue(p4).Value)
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
