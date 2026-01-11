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
	// Scenario 1: Composite literal pointers (should work correctly)
	let i1: null | any = new MyStruct({Value: 10})
	let { ok: ok1 } = $.typeAssert<MyStruct | null>(i1, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("Scenario 1 - Composite literal pointer assertion:", ok1)

	// Scenario 2: Variable aliasing (fixed by our change)
	let original = $.varRef($.markAsStructValue(new MyStruct({Value: 30})))
	let pAlias = original
	let i2: null | any = pAlias
	let { ok: ok2 } = $.typeAssert<MyStruct | null>(i2, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("Scenario 2 - Variable pointer assertion:", ok2)

	// Scenario 3: Multiple pointer variables
	let s1 = $.varRef($.markAsStructValue(new MyStruct({Value: 40})))
	let s2 = $.varRef($.markAsStructValue(new MyStruct({Value: 50})))
	let p1 = s1
	let p2 = s2
	let i3a: null | any = p1
	let i3b: null | any = p2
	let { ok: ok3a } = $.typeAssert<MyStruct | null>(i3a, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	let { ok: ok3b } = $.typeAssert<MyStruct | null>(i3b, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("Scenario 3a - Multiple pointer 1 assertion:", ok3a)
	$.println("Scenario 3b - Multiple pointer 2 assertion:", ok3b)

	// Scenario 4: Mixed patterns
	let s4 = $.varRef($.markAsStructValue(new MyStruct({Value: 60})))
	let p4 = s4
	// composite literal pointer
	let i4a: null | any = new MyStruct({Value: 70})
	// variable pointer
	let i4b: null | any = p4
	let { ok: ok4a } = $.typeAssert<MyStruct | null>(i4a, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	let { ok: ok4b } = $.typeAssert<MyStruct | null>(i4b, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("Scenario 4a - Mixed composite literal assertion:", ok4a)
	$.println("Scenario 4b - Mixed variable pointer assertion:", ok4b)

	// Scenario 5: Nested pointer assignment
	let s5 = $.varRef($.markAsStructValue(new MyStruct({Value: 80})))
	let p5a = s5
	let p5b = p5a // p5b points to same varref as p5a
	let i5: null | any = p5b
	let { ok: ok5 } = $.typeAssert<MyStruct | null>(i5, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("Scenario 5 - Nested pointer assignment assertion:", ok5)

	// Scenario 6: Struct value vs pointer distinction
	let s6 = $.varRef($.markAsStructValue(new MyStruct({Value: 90})))
	let p6 = s6
	let s6copy = $.markAsStructValue(s6!.value.clone()) // struct value copy
	// struct value (should fail pointer assertion)
	let i6a: null | any = $.markAsStructValue(s6copy.clone())
	// struct pointer (should succeed)
	let i6b: null | any = p6
	let { ok: ok6a } = $.typeAssert<MyStruct | null>(i6a, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	let { ok: ok6b } = $.typeAssert<MyStruct | null>(i6b, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	let { ok: ok6c } = $.typeAssert<MyStruct>(i6a, 'main.MyStruct')
	$.println("Scenario 6a - Struct value to pointer assertion (should be false):", ok6a)
	$.println("Scenario 6b - Struct pointer to pointer assertion (should be true):", ok6b)
	$.println("Scenario 6c - Struct value to value assertion (should be true):", ok6c)
}

