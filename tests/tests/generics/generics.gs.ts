// Generated file based on generics.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function printVal(__typeArgs: $.GenericTypeArgs | undefined, val: any): void {
	$.println(val)
}

export function equal(__typeArgs: $.GenericTypeArgs | undefined, a: any, b: any): boolean {
	return a == b
}

export function getLength(__typeArgs: $.GenericTypeArgs | undefined, s: any): number {
	return $.len(s)
}

export class Pair {
	public get First(): any {
		return this._fields.First.value
	}
	public set First(value: any) {
		this._fields.First.value = value
	}

	public get Second(): any {
		return this._fields.Second.value
	}
	public set Second(value: any) {
		this._fields.Second.value = value
	}

	public _fields: {
		First: $.VarRef<any>
		Second: $.VarRef<any>
	}

	constructor(init?: Partial<{First?: any, Second?: any}>) {
		this._fields = {
			First: $.varRef(init?.First ?? null),
			Second: $.varRef(init?.Second ?? null)
		}
	}

	public clone(): Pair {
		const cloned = new Pair()
		cloned._fields = {
			First: $.varRef(this._fields.First.value),
			Second: $.varRef(this._fields.Second.value)
		}
		return $.markAsStructValue(cloned)
	}

	public GetFirst(): any {
		const p = this
		return p.First
	}

	static __typeInfo = $.registerStructType(
		"main.Pair",
		new Pair(),
		[{ name: "GetFirst", args: [], returns: [] }],
		Pair,
		{"First": { kind: $.TypeKind.Interface, methods: [] }, "Second": { kind: $.TypeKind.Interface, methods: [] }}
	)
}

export function makePair(__typeArgs: $.GenericTypeArgs | undefined, a: any, b: any): Pair {
	return $.markAsStructValue(new Pair({First: a, Second: b}))
}

export function append2(__typeArgs: $.GenericTypeArgs | undefined, slice: $.Slice<any>, elem: any): $.Slice<any> {
	return $.append(slice, elem)
}

export async function main(): Promise<void> {
	$.println("=== Basic Generic Function ===")
	printVal({T: { zero: () => 0 }}, 42)
	printVal({T: { zero: () => "" }}, "hello")
	printVal({T: { zero: () => false }}, true)
	$.println("=== Comparable Constraint ===")
	$.println(equal({T: { zero: () => 0 }}, 1, 1))
	$.println(equal({T: { zero: () => 0 }}, 1, 2))
	$.println(equal({T: { zero: () => "" }}, "hello", "hello"))
	$.println(equal({T: { zero: () => "" }}, "hello", "world"))
	$.println("=== Union Constraint ===")
	let str = "hello"
	$.println(getLength({S: { zero: () => "" }}, str))
	let bytes = $.stringToBytes("world")
	$.println(getLength({S: { zero: () => null }}, bytes))
	$.println("=== Generic Struct ===")
	let intPair = $.markAsStructValue(makePair({T: { zero: () => 0 }}, 10, 20).clone())
	$.println($.markAsStructValue(intPair.clone()).GetFirst())
	$.println(intPair.First)
	$.println(intPair.Second)
	let stringPair = $.markAsStructValue(makePair({T: { zero: () => "" }}, "foo", "bar").clone())
	$.println($.markAsStructValue(stringPair.clone()).GetFirst())
	$.println(stringPair.First)
	$.println(stringPair.Second)
	$.println("=== Generic Slice Operations ===")
	let nums = $.arrayToSlice<number>([1, 2, 3])
	nums = append2({T: { zero: () => 0 }}, nums, 4)
	for (let __rangeIndex = 0; __rangeIndex < $.len(nums); __rangeIndex++) {
		let n = nums![__rangeIndex]
		$.println(n)
	}
	let words = $.arrayToSlice<string>(["a", "b"])
	words = append2({T: { zero: () => "" }}, words, "c")
	for (let __rangeIndex = 0; __rangeIndex < $.len(words); __rangeIndex++) {
		let w = words![__rangeIndex]
		$.println(w)
	}
	$.println("=== Type Inference ===")
	let result = $.markAsStructValue(makePair({T: { zero: () => 0 }}, 100, 200).clone())
	$.println(result.First)
	$.println(result.Second)
}


if ($.isMainScript(import.meta)) {
	await main()
}
