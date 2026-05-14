// Generated file based on pointers.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class MyStruct {
	public get Val(): number {
		return this._fields.Val.value
	}
	public set Val(value: number) {
		this._fields.Val.value = value
	}

	public _fields: {
		Val: $.VarRef<number>
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
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[],
		MyStruct,
		{"Val": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let s1 = $.varRef($.markAsStructValue(new MyStruct({Val: 1})))
	let s2 = $.varRef($.markAsStructValue(new MyStruct({Val: 2})))
	let p1 = $.varRef(s1)
	let p2 = $.varRef(s1)
	let p3 = $.varRef(s2)
	let p4 = s1
	p4
	let pp1 = $.varRef(p1)
	let pp2 = p2
	let pp3 = p3
	let ppp1 = pp1
	$.println("--- Initial Values ---")
	$.println("s1.Val:", s1.value.Val)
	$.println("s2.Val:", s2.value.Val)
	$.println("p1==p2:", p1.value == p2.value)
	$.println("p1==p3:", p1.value == p3.value)
	$.println("\n--- Pointer Comparisons ---")
	$.println("pp1==pp2:", pp1.value == pp2)
	$.println("pp1==pp3:", pp1.value == pp3)
	$.println("*pp1==*pp2:", $.pointerValue(pp1.value) == $.pointerValue(pp2))
	$.println("*pp1==*pp3:", $.pointerValue(pp1.value) == $.pointerValue(pp3))
	$.println("(**pp1).Val == (**pp2).Val:", ($.pointerValue($.pointerValue(pp1.value))).Val == ($.pointerValue($.pointerValue(pp2))).Val)
	$.println("(**pp1).Val == (**pp3).Val:", ($.pointerValue($.pointerValue(pp1.value))).Val == ($.pointerValue($.pointerValue(pp3))).Val)
	$.println("ppp1==ppp1:", ppp1 == ppp1)
	$.println("*ppp1==pp1:", $.pointerValue(ppp1) == pp1.value)
	$.println("**ppp1==p1:", $.pointerValue($.pointerValue(ppp1)) == p1.value)
	$.println("(***ppp1).Val == s1.Val:", ($.pointerValue($.pointerValue($.pointerValue(ppp1)))).Val == s1.value.Val)
	$.println("\n--- Modifications ---")
	$.assignStruct($.pointerValue(p1.value), $.markAsStructValue(new MyStruct({Val: 10})))
	$.println("After *p1 = {Val: 10}:")
	$.println("  s1.Val:", s1.value.Val)
	$.println("  (*p2).Val:", ($.pointerValue(p2.value)).Val)
	$.println("  (**pp1).Val:", ($.pointerValue($.pointerValue(pp1.value))).Val)
	$.println("  (***ppp1).Val:", ($.pointerValue($.pointerValue($.pointerValue(ppp1)))).Val)
	$.println("  s2.Val:", s2.value.Val)
	$.assignStruct($.pointerValue($.pointerValue(pp3)), $.markAsStructValue(new MyStruct({Val: 20})))
	$.println("After **pp3 = {Val: 20}:")
	$.println("  s2.Val:", s2.value.Val)
	$.println("  (*p3).Val:", ($.pointerValue(p3.value)).Val)
	$.println("  s1.Val:", s1.value.Val)
	$.println("\n--- Nil Pointers ---")
	let np: $.VarRef<MyStruct | $.VarRef<MyStruct> | null> = $.varRef(null)
	let npp: $.VarRef<MyStruct | $.VarRef<MyStruct> | null> | null = null
	let nppp: $.VarRef<$.VarRef<MyStruct | $.VarRef<MyStruct> | null> | null> | null = null
	$.println("np == nil:", np.value == null)
	$.println("npp == nil:", npp == null)
	$.println("nppp == nil:", nppp == null)
	npp = np
	$.println("After npp = &np:")
	$.println("  npp == nil:", npp == null)
	$.println("  *npp == nil:", $.pointerValue(npp) == null)
}


if ($.isMainScript(import.meta)) {
	await main()
}
