// Generated file based on pointers.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public get Val(): number {
		return this._fields.Val.value
	}
	public set Val(value: number) {
		this._fields.Val.value = value
	}

	public _fields: {
		Val: $.VarRef<number>;
	}

	constructor(init?: Partial<{Val?: number}>) {
		this._fields = {
			Val: $.varRef(init?.Val ?? 0)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Val: $.varRef(this._fields.Val.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyStruct',
	  new MyStruct(),
	  [],
	  MyStruct,
	  {"Val": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export async function main(): Promise<void> {
	let s1 = $.varRef($.markAsStructValue(new MyStruct({Val: 1}))) // p1 takes the address of s1, so s1 is varrefed
	let s2 = $.varRef($.markAsStructValue(new MyStruct({Val: 2}))) // p2 takes the address of s2, so s2 is varrefed

	let p1 = $.varRef(s1) // *MyStruct, points to s1, pp1 takes the address of p1, so p1 is varrefed
	let p2 = $.varRef(s1) // *MyStruct, points to s1, pp2 takes the address of p2, so p2 is varrefed
	let p3 = $.varRef(s2) // *MyStruct, points to s2, pp3 takes the address of p3, so p3 is varrefed

	let p4 = s1 // *MyStruct, points to s1, nothing takes the address of p4, so p4 is not varrefed
	/* _ = */ p4!.value

	let pp1 = $.varRef(p1) // **MyStruct, points to p1
	let pp2 = p2 // **MyStruct, points to p2
	let pp3 = p3 // **MyStruct, points to p3

	let ppp1 = pp1 // ***MyStruct, points to pp1, not varrefed as nothing takes address of ppp1

	$.println("--- Initial Values ---")
	$.println("s1.Val:", s1!.value.Val) // 1
	$.println("s2.Val:", s2!.value.Val) // 2
	$.println("p1==p2:", (p1!.value === p2!.value)) // true
	$.println("p1==p3:", (p1!.value === p3!.value)) // false

	// --- Pointer Comparisons ---
	$.println("\n--- Pointer Comparisons ---")
	$.println("pp1==pp2:", (pp1!.value === pp2)) // false
	$.println("pp1==pp3:", (pp1!.value === pp3)) // false
	$.println("*pp1==*pp2:", (pp1!.value!.value === pp2!.value)) // true
	$.println("*pp1==*pp3:", (pp1!.value!.value === pp3!.value)) // false
	$.println("(**pp1).Val == (**pp2).Val:", pp1!.value!.value!!.value.Val == pp2!.value!!.value.Val) // true
	$.println("(**pp1).Val == (**pp3).Val:", pp1!.value!.value!!.value.Val == pp3!.value!!.value.Val) // false

	// Triple pointer comparisons
	$.println("ppp1==ppp1:", (ppp1 === ppp1)) // true
	$.println("*ppp1==pp1:", (ppp1!.value === pp1!.value)) // true
	$.println("**ppp1==p1:", (ppp1!.value!.value === p1!.value)) // true
	$.println("(***ppp1).Val == s1.Val:", ppp1!.value!.value!!.value.Val == s1!.value.Val) // true

	// --- Modifications through Pointers ---
	$.println("\n--- Modifications ---")
	p1!.value!.value = $.markAsStructValue(new MyStruct({Val: 10})) // Modify s1 via p1
	$.println("After *p1 = {Val: 10}:")
	$.println("  s1.Val:", s1!.value.Val) // 10
	$.println("  (*p2).Val:", p2!.value!!.value.Val) // 10
	$.println("  (**pp1).Val:", pp1!.value!.value!!.value.Val) // 10
	$.println("  (***ppp1).Val:", ppp1!.value!.value!!.value.Val) // 10
	$.println("  s2.Val:", s2!.value.Val) // 2 (unmodified)

	pp3!.value!.value = $.markAsStructValue(new MyStruct({Val: 20})) // Modify s2 via pp3 -> p3
	$.println("After **pp3 = {Val: 20}:")
	$.println("  s2.Val:", s2!.value.Val) // 20
	$.println("  (*p3).Val:", p3!.value!!.value.Val) // 20
	$.println("  s1.Val:", s1!.value.Val) // 10 (unmodified)

	// --- Nil Pointers ---
	$.println("\n--- Nil Pointers ---")
	let np: $.VarRef<MyStruct | null> = $.varRef(null)
	let npp: $.VarRef<MyStruct | null> | null = null
	let nppp: $.VarRef<$.VarRef<MyStruct | null> | null> | null = null

	$.println("np == nil:", np!.value == null) // true
	$.println("npp == nil:", npp == null) // true
	$.println("nppp == nil:", nppp == null) // true

	npp = np // npp now points to np (which is nil)
	$.println("After npp = &np:")
	$.println("  npp == nil:", npp == null) // false
	$.println("  *npp == nil:", npp!.value == null) // true
}

