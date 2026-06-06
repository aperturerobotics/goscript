// Generated file based on interface_pointer_assignment.go
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

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[],
		MyStruct,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Scenario 1: Composite literal pointers (should work correctly)
	let i1: any = $.interfaceValue<any>(new MyStruct({Value: 10}), "*main.MyStruct")
	let [, ok1] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i1, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 1 - Composite literal pointer assertion:", ok1)

	// Scenario 2: Variable aliasing (fixed by our change)
	let original = $.varRef($.markAsStructValue(new MyStruct({Value: 30})))
	let pAlias: MyStruct | $.VarRef<MyStruct> | null = original
	let i2: any = $.interfaceValue<any>(pAlias, "*main.MyStruct")
	let [, ok2] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i2, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 2 - Variable pointer assertion:", ok2)

	// Scenario 3: Multiple pointer variables
	let s1 = $.varRef($.markAsStructValue(new MyStruct({Value: 40})))
	let s2 = $.varRef($.markAsStructValue(new MyStruct({Value: 50})))
	let p1: MyStruct | $.VarRef<MyStruct> | null = s1
	let p2: MyStruct | $.VarRef<MyStruct> | null = s2
	let i3a: any = $.interfaceValue<any>(p1, "*main.MyStruct")
	let i3b: any = $.interfaceValue<any>(p2, "*main.MyStruct")
	let [, ok3a] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i3a, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok3b] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i3b, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 3a - Multiple pointer 1 assertion:", ok3a)
	$.println("Scenario 3b - Multiple pointer 2 assertion:", ok3b)

	// Scenario 4: Mixed patterns
	let s4 = $.varRef($.markAsStructValue(new MyStruct({Value: 60})))
	let p4: MyStruct | $.VarRef<MyStruct> | null = s4
	let i4a: any = $.interfaceValue<any>(new MyStruct({Value: 70}), "*main.MyStruct")
	let i4b: any = $.interfaceValue<any>(p4, "*main.MyStruct")
	let [, ok4a] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i4a, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok4b] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i4b, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 4a - Mixed composite literal assertion:", ok4a)
	$.println("Scenario 4b - Mixed variable pointer assertion:", ok4b)

	// Scenario 5: Nested pointer assignment
	let s5 = $.varRef($.markAsStructValue(new MyStruct({Value: 80})))
	let p5a: MyStruct | $.VarRef<MyStruct> | null = s5
	let p5b: MyStruct | $.VarRef<MyStruct> | null = p5a
	let i5: any = $.interfaceValue<any>(p5b, "*main.MyStruct")
	let [, ok5] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i5, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("Scenario 5 - Nested pointer assignment assertion:", ok5)

	// Scenario 6: Struct value vs pointer distinction
	let s6 = $.varRef($.markAsStructValue(new MyStruct({Value: 90})))
	let p6: MyStruct | $.VarRef<MyStruct> | null = s6
	let s6copy = $.markAsStructValue($.cloneStructValue(s6.value))
	let i6a: any = $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(s6copy)), "main.MyStruct")
	let i6b: any = $.interfaceValue<any>(p6, "*main.MyStruct")
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
