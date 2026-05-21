// Generated file based on struct_pointer_marking.go
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
	$.println("=== Struct Pointer Marking Test ===")

	// Scenario 1: Address-of Composite Literal vs Value Variable
	$.println("\n--- Scenario 1: Composite Literal vs Value Variable ---")
	let s = $.markAsStructValue(new MyStruct({Value: 10}))
	let p: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({Value: 20})

	// Type assertions - struct value
	let i: any = $.interfaceValue<any>($.markAsStructValue((s).clone()), "main.MyStruct")
	let [, ok1] = $.typeAssertTuple<MyStruct>(i, "main.MyStruct")
	let [, ok2] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("struct value -> MyStruct assertion:", ok1)
	$.println("struct value -> *MyStruct assertion:", ok2)

	// Type assertions - struct pointer
	let j: any = $.interfaceValue<any>(p, "*main.MyStruct")
	let [, ok3] = $.typeAssertTuple<MyStruct>(j, "main.MyStruct")
	let [, ok4] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(j, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("struct pointer -> MyStruct assertion:", ok3)
	$.println("struct pointer -> *MyStruct assertion:", ok4)

	// Scenario 2: Variable Aliasing
	$.println("\n--- Scenario 2: Variable Aliasing ---")
	let original = $.varRef($.markAsStructValue(new MyStruct({Value: 30})))
	let pAlias: MyStruct | $.VarRef<MyStruct> | null = original

	let iOriginal: any = $.interfaceValue<any>($.markAsStructValue((original.value).clone()), "main.MyStruct")
	let jAlias: any = $.interfaceValue<any>(pAlias, "*main.MyStruct")

	let [, ok5] = $.typeAssertTuple<MyStruct>(iOriginal, "main.MyStruct")
	let [, ok6] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(iOriginal, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("original value -> MyStruct assertion:", ok5)
	$.println("original value -> *MyStruct assertion:", ok6)

	let [, ok7] = $.typeAssertTuple<MyStruct>(jAlias, "main.MyStruct")
	let [, ok8] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(jAlias, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("alias pointer -> MyStruct assertion:", ok7)
	$.println("alias pointer -> *MyStruct assertion:", ok8)

	// Scenario 3: Multiple Pointers to Same Variable
	$.println("\n--- Scenario 3: Multiple Pointers to Same Variable ---")
	let shared = $.varRef($.markAsStructValue(new MyStruct({Value: 40})))
	let p1: MyStruct | $.VarRef<MyStruct> | null = shared
	let p2: MyStruct | $.VarRef<MyStruct> | null = shared

	let i1: any = $.interfaceValue<any>(p1, "*main.MyStruct")
	let i2: any = $.interfaceValue<any>(p2, "*main.MyStruct")

	let [, ok9] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i1, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok10] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i2, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("first pointer -> *MyStruct assertion:", ok9)
	$.println("second pointer -> *MyStruct assertion:", ok10)

	// Verify they point to the same data
	{
		let __goscriptTuple0 = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i1, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
		let structPtr1: MyStruct | $.VarRef<MyStruct> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			{
				let __goscriptTuple1 = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i2, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
				let structPtr2: MyStruct | $.VarRef<MyStruct> | null = __goscriptTuple1[0]
				let ok = __goscriptTuple1[1]
				if (ok) {
					$.pointerValue<MyStruct>(structPtr1).Value = 99
					$.println("shared modification check:", $.pointerValue<MyStruct>(structPtr2).Value)
				}
			}
		}
	}

	// Scenario 4: Mixed Assignment Patterns
	$.println("\n--- Scenario 4: Mixed Assignment Patterns ---")
	let mixed = $.varRef($.markAsStructValue(new MyStruct({Value: 50})))
	let pVar: MyStruct | $.VarRef<MyStruct> | null = mixed
	let pLit: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({Value: 60})

	let iVar: any = $.interfaceValue<any>(pVar, "*main.MyStruct")
	let iLit: any = $.interfaceValue<any>(pLit, "*main.MyStruct")

	let [, ok11] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(iVar, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok12] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(iLit, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("variable pointer -> *MyStruct assertion:", ok11)
	$.println("literal pointer -> *MyStruct assertion:", ok12)

	// Scenario 5: Nested Type Assertions
	$.println("\n--- Scenario 5: Nested Type Assertions ---")
	let nested1: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({Value: 70})
	let nested2 = $.varRef($.markAsStructValue(new MyStruct({Value: 80})))

	// Array of interfaces containing both pointers and values
	let arr = $.arrayToSlice<any>([$.interfaceValue<any>(nested1, "*main.MyStruct"), $.interfaceValue<any>($.markAsStructValue((nested2.value).clone()), "main.MyStruct"), $.interfaceValue<any>(nested2, "*main.MyStruct")])

	for (let i = 0; i < $.len(arr); i++) {
		let item = arr![i]
		{
			let [val, ok] = $.typeAssertTuple<MyStruct>(item, "main.MyStruct")
			if (ok) {
				$.println("arr[", i, "] is MyStruct with value:", val.Value)
			} else {
				{
					let __goscriptTuple2 = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(item, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
					let ptr: MyStruct | $.VarRef<MyStruct> | null = __goscriptTuple2[0]
					let ok = __goscriptTuple2[1]
					if (ok) {
						$.println("arr[", i, "] is *MyStruct with value:", $.pointerValue<MyStruct>(ptr).Value)
					} else {
						$.println("arr[", i, "] is unknown type")
					}
				}
			}
		}
	}

	// Scenario 6: Type Switch with Mixed Types
	$.println("\n--- Scenario 6: Type Switch ---")
	let testItems = $.arrayToSlice<any>([$.interfaceValue<any>($.markAsStructValue(new MyStruct({Value: 100})), "main.MyStruct"), $.interfaceValue<any>(new MyStruct({Value: 200}), "*main.MyStruct"), 300, "string"])

	for (let i = 0; i < $.len(testItems); i++) {
		let item = testItems![i]
		{
			const __goscriptTypeSwitchValue = item
			switch (true) {
				case $.typeAssert<any>(__goscriptTypeSwitchValue, "main.MyStruct").ok:
					{
						let v = $.typeAssert<any>(__goscriptTypeSwitchValue, "main.MyStruct").value
						$.println("testItems[", i, "] is MyStruct value:", v.Value)
					}
					break
				case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" }).ok:
					{
						let v = $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" }).value
						$.println("testItems[", i, "] is *MyStruct pointer:", $.pointerValue<MyStruct>(v).Value)
					}
					break
				case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
					{
						let v = $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).value
						$.println("testItems[", i, "] is int:", v)
					}
					break
				case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).ok:
					{
						let v = $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).value
						$.println("testItems[", i, "] is string:", v)
					}
					break
				default:
					{
						let v = __goscriptTypeSwitchValue
						$.println("testItems[", i, "] is unknown type")
					}
					break
			}
		}
	}

	$.println("\n=== Test Complete ===")
}


if ($.isMainScript(import.meta)) {
	await main()
}
