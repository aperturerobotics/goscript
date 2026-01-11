// Generated file based on generics.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Pair<T extends any> {
	public get First(): T {
		return this._fields.First.value
	}
	public set First(value: T) {
		this._fields.First.value = value
	}

	public get Second(): T {
		return this._fields.Second.value
	}
	public set Second(value: T) {
		this._fields.Second.value = value
	}

	public _fields: {
		First: $.VarRef<T>;
		Second: $.VarRef<T>;
	}

	constructor(init?: Partial<{First?: T, Second?: T}>) {
		this._fields = {
			First: $.varRef(init?.First ?? null as any),
			Second: $.varRef(init?.Second ?? null as any)
		}
	}

	public clone(): Pair<T> {
		const cloned = new Pair<T>()
		cloned._fields = {
			First: $.varRef(this._fields.First.value),
			Second: $.varRef(this._fields.Second.value)
		}
		return cloned
	}

	public GetFirst(): T {
		const p = this
		return p.First
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Pair',
	  new Pair(),
	  [{ name: "GetFirst", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
	  Pair,
	  {"First": { kind: $.TypeKind.Interface, methods: [] }, "Second": { kind: $.TypeKind.Interface, methods: [] }}
	);
}

// Generic function with any constraint
export function printVal<T extends any>(val: T): void {
	$.println(val)
}

// Generic function with comparable constraint
export function equal<T extends $.Comparable>(a: T, b: T): boolean {
	return a == b
}

// Generic function with union constraint
export function getLength<S extends string | $.Bytes>(s: S): number {
	return $.len(s)
}

// Generic function returning a generic struct
export function makePair<T extends any>(a: T, b: T): Pair<T> {
	return $.markAsStructValue(new Pair<T>({First: a, Second: b}))
}

// Generic slice operations
export function append2<T extends any>(slice: $.Slice<T>, elem: T): $.Slice<T> {
	return $.append(slice, elem)
}

export async function main(): Promise<void> {
	// Test basic generic function
	$.println("=== Basic Generic Function ===")
	printVal(42)
	printVal("hello")
	printVal(true)

	// Test comparable constraint
	$.println("=== Comparable Constraint ===")
	$.println(equal(1, 1))
	$.println(equal(1, 2))
	$.println(equal("hello", "hello"))
	$.println(equal("hello", "world"))

	// Test union constraint with string
	$.println("=== Union Constraint ===")
	let str = "hello"
	$.println(getLength(str))

	// Test union constraint with []byte
	let bytes = $.stringToBytes("world")
	$.println(getLength(bytes))

	// Test generic struct
	$.println("=== Generic Struct ===")
	let intPair = $.markAsStructValue(makePair(10, 20).clone())
	$.println(intPair.GetFirst())
	$.println(intPair.First)
	$.println(intPair.Second)

	let stringPair = $.markAsStructValue(makePair("foo", "bar").clone())
	$.println(stringPair.GetFirst())
	$.println(stringPair.First)
	$.println(stringPair.Second)

	// Test generic slice operations
	$.println("=== Generic Slice Operations ===")
	let nums = $.arrayToSlice<number>([1, 2, 3])
	nums = append2(nums, 4)
	for (let _i = 0; _i < $.len(nums); _i++) {
		let n = nums![_i]
		{
			$.println(n)
		}
	}

	let words = $.arrayToSlice<string>(["a", "b"])
	words = append2(words, "c")
	for (let _i = 0; _i < $.len(words); _i++) {
		let w = words![_i]
		{
			$.println(w)
		}
	}

	// Test type inference
	$.println("=== Type Inference ===")
	let result = $.markAsStructValue(makePair(100, 200).clone())
	$.println(result.First)
	$.println(result.Second)
}

