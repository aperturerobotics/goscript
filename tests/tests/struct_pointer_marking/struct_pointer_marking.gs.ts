// Generated file based on struct_pointer_marking.go
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
	$.println("=== Struct Pointer Marking Test ===")
	$.println("\n--- Scenario 1: Composite Literal vs Value Variable ---")
	let s = $.markAsStructValue(new MyStruct({Value: 10}))
	let p = new MyStruct({Value: 20})
	let i: any = $.markAsStructValue(s.clone())
	let [, ok1] = $.typeAssertTuple<MyStruct>(i, "main.MyStruct")
	let [, ok2] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("struct value -> MyStruct assertion:", ok1)
	$.println("struct value -> *MyStruct assertion:", ok2)
	let j: any = p
	let [, ok3] = $.typeAssertTuple<MyStruct>(j, "main.MyStruct")
	let [, ok4] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(j, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("struct pointer -> MyStruct assertion:", ok3)
	$.println("struct pointer -> *MyStruct assertion:", ok4)
	$.println("\n--- Scenario 2: Variable Aliasing ---")
	let original = $.varRef($.markAsStructValue(new MyStruct({Value: 30})))
	let pAlias = original
	let iOriginal: any = $.markAsStructValue(original.value.clone())
	let jAlias: any = pAlias
	let [, ok5] = $.typeAssertTuple<MyStruct>(iOriginal, "main.MyStruct")
	let [, ok6] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(iOriginal, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("original value -> MyStruct assertion:", ok5)
	$.println("original value -> *MyStruct assertion:", ok6)
	let [, ok7] = $.typeAssertTuple<MyStruct>(jAlias, "main.MyStruct")
	let [, ok8] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(jAlias, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("alias pointer -> MyStruct assertion:", ok7)
	$.println("alias pointer -> *MyStruct assertion:", ok8)
	$.println("\n--- Scenario 3: Multiple Pointers to Same Variable ---")
	let shared = $.varRef($.markAsStructValue(new MyStruct({Value: 40})))
	let p1 = shared
	let p2 = shared
	let i1: any = p1
	let i2: any = p2
	let [, ok9] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i1, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok10] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i2, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("first pointer -> *MyStruct assertion:", ok9)
	$.println("second pointer -> *MyStruct assertion:", ok10)
	{
		let [structPtr1, ok] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i1, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
		if (ok) {
			{
				let [structPtr2, ok] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(i2, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
				if (ok) {
					$.pointerValue(structPtr1).Value = 99
					$.println("shared modification check:", $.pointerValue(structPtr2).Value)
				}
			}
		}
	}
	$.println("\n--- Scenario 4: Mixed Assignment Patterns ---")
	let mixed = $.varRef($.markAsStructValue(new MyStruct({Value: 50})))
	let pVar = mixed
	let pLit = new MyStruct({Value: 60})
	let iVar: any = pVar
	let iLit: any = pLit
	let [, ok11] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(iVar, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	let [, ok12] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(iLit, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
	$.println("variable pointer -> *MyStruct assertion:", ok11)
	$.println("literal pointer -> *MyStruct assertion:", ok12)
	$.println("\n--- Scenario 5: Nested Type Assertions ---")
	let nested1 = new MyStruct({Value: 70})
	let nested2 = $.varRef($.markAsStructValue(new MyStruct({Value: 80})))
	let arr = [nested1, $.markAsStructValue(nested2.value.clone()), nested2]
	for (let i = 0; i < $.len(arr); i++) {
		let item = arr[i]
		{
			let [val, ok] = $.typeAssertTuple<MyStruct>(item, "main.MyStruct")
			if (ok) {
				$.println("arr[", i, "] is MyStruct with value:", val.Value)
			} else {
				{
					let [ptr, ok] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(item, { kind: $.TypeKind.Pointer, elemType: "main.MyStruct" })
					if (ok) {
						$.println("arr[", i, "] is *MyStruct with value:", $.pointerValue(ptr).Value)
					} else {
						$.println("arr[", i, "] is unknown type")
					}
				}
			}
		}
	}
	$.println("\n--- Scenario 6: Type Switch ---")
	let testItems = [$.markAsStructValue($.markAsStructValue(new MyStruct({Value: 100})).clone()), new MyStruct({Value: 200}), 300, "string"]
	for (let i = 0; i < $.len(testItems); i++) {
		let item = testItems[i]
		$.typeSwitch(
			item,
			[
				{
					types: ["main.MyStruct"],
					body: (v) => {
						$.println("testItems[", i, "] is MyStruct value:", v.Value)
					}
				},
				{
					types: [{ kind: $.TypeKind.Pointer, elemType: "main.MyStruct" }],
					body: (v) => {
						$.println("testItems[", i, "] is *MyStruct pointer:", $.pointerValue(v).Value)
					}
				},
				{
					types: [{ kind: $.TypeKind.Basic, name: "int" }],
					body: (v) => {
						$.println("testItems[", i, "] is int:", v)
					}
				},
				{
					types: [{ kind: $.TypeKind.Basic, name: "string" }],
					body: (v) => {
						$.println("testItems[", i, "] is string:", v)
					}
				}
			],
			() => {
				let v = item
				$.println("testItems[", i, "] is unknown type")
			}
		)
	}
	$.println("\n=== Test Complete ===")
}


if ($.isMainScript(import.meta)) {
	await main()
}
