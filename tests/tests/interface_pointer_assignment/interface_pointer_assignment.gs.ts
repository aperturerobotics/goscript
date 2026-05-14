// Generated file based on interface_pointer_assignment.go
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
	let i1: any = new MyStruct({Value: 10})
	let [, ok1] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i1, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 1 - Composite literal pointer assertion:", ok1)
	let original = $.varRef($.markAsStructValue(new MyStruct({Value: 30})))
	let pAlias = original
	let i2: any = pAlias
	let [, ok2] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i2, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 2 - Variable pointer assertion:", ok2)
	let s1 = $.varRef($.markAsStructValue(new MyStruct({Value: 40})))
	let s2 = $.varRef($.markAsStructValue(new MyStruct({Value: 50})))
	let p1 = s1
	let p2 = s2
	let i3a: any = p1
	let i3b: any = p2
	let [, ok3a] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i3a, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok3b] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i3b, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 3a - Multiple pointer 1 assertion:", ok3a)
	$.println("Scenario 3b - Multiple pointer 2 assertion:", ok3b)
	let s4 = $.varRef($.markAsStructValue(new MyStruct({Value: 60})))
	let p4 = s4
	let i4a: any = new MyStruct({Value: 70})
	let i4b: any = p4
	let [, ok4a] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i4a, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok4b] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i4b, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 4a - Mixed composite literal assertion:", ok4a)
	$.println("Scenario 4b - Mixed variable pointer assertion:", ok4b)
	let s5 = $.varRef($.markAsStructValue(new MyStruct({Value: 80})))
	let p5a = s5
	let p5b = p5a
	let i5: any = p5b
	let [, ok5] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i5, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 5 - Nested pointer assignment assertion:", ok5)
	let s6 = $.varRef($.markAsStructValue(new MyStruct({Value: 90})))
	let p6 = s6
	let s6copy = $.markAsStructValue(s6.value.clone())
	let i6a: any = $.markAsStructValue(s6copy.clone())
	let i6b: any = p6
	let [, ok6a] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i6a, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok6b] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i6b, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok6c] = $.typeAssertTuple<MyStruct>(i6a, "main.MyStruct")
	$.println("Scenario 6a - Struct value to pointer assertion (should be false):", ok6a)
	$.println("Scenario 6b - Struct pointer to pointer assertion (should be true):", ok6b)
	$.println("Scenario 6c - Struct value to value assertion (should be true):", ok6c)
}


if ($.isMainScript(import.meta)) {
	await main()
}
