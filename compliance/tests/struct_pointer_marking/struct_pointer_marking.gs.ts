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
		Value: $.VarRef<number>;
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
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyStruct',
	  new MyStruct(),
	  [],
	  MyStruct,
	  {"Value": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export async function main(): Promise<void> {
	$.println("=== Struct Pointer Marking Test ===")

	// Scenario 1: Address-of Composite Literal vs Value Variable
	$.println("\n--- Scenario 1: Composite Literal vs Value Variable ---")
	let s = $.markAsStructValue(new MyStruct({Value: 10})) // struct value
	let p = new MyStruct({Value: 20}) // pointer to struct (should be marked)

	// Type assertions - struct value
	let i: null | any = $.markAsStructValue(s.clone())
	let { ok: ok1 } = $.typeAssert<MyStruct>(i, 'main.MyStruct')
	let { ok: ok2 } = $.typeAssert<MyStruct | null>(i, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("struct value -> MyStruct assertion:", ok1) // Expected: true
	$.println("struct value -> *MyStruct assertion:", ok2) // Expected: false

	// Type assertions - struct pointer
	let j: null | any = p
	let { ok: ok3 } = $.typeAssert<MyStruct>(j, 'main.MyStruct')
	let { ok: ok4 } = $.typeAssert<MyStruct | null>(j, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("struct pointer -> MyStruct assertion:", ok3) // Expected: false
	$.println("struct pointer -> *MyStruct assertion:", ok4) // Expected: true

	// Scenario 2: Variable Aliasing
	$.println("\n--- Scenario 2: Variable Aliasing ---")
	let original = $.varRef($.markAsStructValue(new MyStruct({Value: 30})))
	let pAlias = original // pointer to existing variable

	// struct value in interface
	let iOriginal: null | any = $.markAsStructValue(original!.value.clone())
	// struct pointer in interface
	let jAlias: null | any = pAlias

	let { ok: ok5 } = $.typeAssert<MyStruct>(iOriginal, 'main.MyStruct')
	let { ok: ok6 } = $.typeAssert<MyStruct | null>(iOriginal, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("original value -> MyStruct assertion:", ok5) // Expected: true
	$.println("original value -> *MyStruct assertion:", ok6) // Expected: false

	let { ok: ok7 } = $.typeAssert<MyStruct>(jAlias, 'main.MyStruct')
	let { ok: ok8 } = $.typeAssert<MyStruct | null>(jAlias, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("alias pointer -> MyStruct assertion:", ok7) // Expected: false
	$.println("alias pointer -> *MyStruct assertion:", ok8) // Expected: true

	// Scenario 3: Multiple Pointers to Same Variable
	$.println("\n--- Scenario 3: Multiple Pointers to Same Variable ---")
	let shared = $.varRef($.markAsStructValue(new MyStruct({Value: 40})))
	let p1 = shared
	let p2 = shared

	let i1: null | any = p1
	let i2: null | any = p2

	let { ok: ok9 } = $.typeAssert<MyStruct | null>(i1, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	let { ok: ok10 } = $.typeAssert<MyStruct | null>(i2, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("first pointer -> *MyStruct assertion:", ok9) // Expected: true
	$.println("second pointer -> *MyStruct assertion:", ok10) // Expected: true

	// Verify they point to the same data

	// Expected: 99
	{
		let { value: structPtr1, ok: ok } = $.typeAssert<MyStruct | null>(i1, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
		if (ok) {

			// Expected: 99
			{
				let { value: structPtr2, ok: ok } = $.typeAssert<MyStruct | null>(i2, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
				if (ok) {
					structPtr1!.Value = 99
					$.println("shared modification check:", structPtr2!.Value) // Expected: 99
				}
			}
		}
	}

	// Scenario 4: Mixed Assignment Patterns
	$.println("\n--- Scenario 4: Mixed Assignment Patterns ---")
	let mixed = $.varRef($.markAsStructValue(new MyStruct({Value: 50})))
	let pVar = mixed // pointer to variable
	let pLit = new MyStruct({Value: 60}) // pointer to composite literal

	// VarRef in interface
	let iVar: null | any = pVar
	// marked struct in interface
	let iLit: null | any = pLit

	let { ok: ok11 } = $.typeAssert<MyStruct | null>(iVar, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	let { ok: ok12 } = $.typeAssert<MyStruct | null>(iLit, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("variable pointer -> *MyStruct assertion:", ok11) // Expected: true
	$.println("literal pointer -> *MyStruct assertion:", ok12) // Expected: true

	// Scenario 5: Nested Type Assertions
	$.println("\n--- Scenario 5: Nested Type Assertions ---")
	let nested1 = new MyStruct({Value: 70})
	let nested2 = $.varRef($.markAsStructValue(new MyStruct({Value: 80})))

	// Array of interfaces containing both pointers and values
	let arr = $.arrayToSlice<null | any>([nested1, nested2!.value, nested2])

	for (let i = 0; i < $.len(arr); i++) {
		let item = arr![i]
		{
			{
				let { value: val, ok: ok } = $.typeAssert<MyStruct>(item, 'main.MyStruct')
				if (ok) {
					$.println("arr[", i, "] is MyStruct with value:", val.Value)
				} else {
					let { value: ptr, ok: ok } = $.typeAssert<MyStruct | null>(item, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
					if (ok) {
						$.println("arr[", i, "] is *MyStruct with value:", ptr!.Value)
					} else {
						$.println("arr[", i, "] is unknown type")
					}
				}
			}
		}
	}

	// Scenario 6: Type Switch with Mixed Types
	$.println("\n--- Scenario 6: Type Switch ---")
	let testItems = $.arrayToSlice<null | any>([$.markAsStructValue(new MyStruct({Value: 100})), new MyStruct({Value: 200}), 300, "string"])

	for (let i = 0; i < $.len(testItems); i++) {
		let item = testItems![i]
		{
			$.typeSwitch(item, [{ types: ['main.MyStruct'], body: (v) => {
				$.println("testItems[", i, "] is MyStruct value:", v.Value)
			}},
			{ types: [{kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'}], body: (v) => {
				$.println("testItems[", i, "] is *MyStruct pointer:", v!.Value)
			}},
			{ types: [{kind: $.TypeKind.Basic, name: 'number'}], body: (v) => {
				$.println("testItems[", i, "] is int:", v)
			}},
			{ types: [{kind: $.TypeKind.Basic, name: 'string'}], body: (v) => {
				$.println("testItems[", i, "] is string:", v)
			}}], () => {
				$.println("testItems[", i, "] is unknown type")
			})
		}
	}

	$.println("\n=== Test Complete ===")
}

