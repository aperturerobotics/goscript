// Generated file based on package_import_sort.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

import * as sort2 from "@goscript/sort/index.js"
import "@goscript/slices/index.js"
import "@goscript/sort/index.js"

export class descending {
	public get values(): $.Slice<number> {
		return this._fields.values.value
	}
	public set values(value: $.Slice<number>) {
		this._fields.values.value = value
	}

	public _fields: {
		values: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{values?: $.Slice<number>}>) {
		this._fields = {
			values: $.varRef(init?.values ?? (null as $.Slice<number>))
		}
	}

	public clone(): descending {
		const cloned = new descending()
		cloned._fields = {
			values: $.varRef(this._fields.values.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Len(): number {
		const d = this
		return $.len(d.values)
	}

	public Less(i: number, j: number): boolean {
		const d = this
		return $.arrayIndex(d.values!, i) > $.arrayIndex(d.values!, j)
	}

	public Swap(i: number, j: number): void {
		let d: descending = this
		let __goscriptAssign0_0: number = $.arrayIndex(d.values!, j)
		let __goscriptAssign0_1: number = $.arrayIndex(d.values!, i)
		d.values![i] = __goscriptAssign0_0
		d.values![j] = __goscriptAssign0_1
	}

	static __typeInfo = $.registerStructType(
		"main.descending",
		() => new descending(),
		[{ name: "Len", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Less", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Swap", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		descending,
		[{ name: "values", key: "values", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }]
	)
}

export type byFreq = $.Slice<number>

export async function byFreq_sort(s: $.VarRef<byFreq> | null, a: $.Slice<number>): globalThis.Promise<void> {
	s!.value = ((a as byFreq) as byFreq)
	await sort2.Sort($.pointerValueOrNil($.namedValueInterfaceValue<sort2.Interface | null>(s, "*main.byFreq", {Len: (receiver: any, ...args: any[]) => (byFreq_Len as any)($.pointerValue(receiver), ...args), Less: (receiver: any, ...args: any[]) => (byFreq_Less as any)($.pointerValue(receiver), ...args), Swap: (receiver: any, ...args: any[]) => (byFreq_Swap as any)($.pointerValue(receiver), ...args), sort: (receiver: any, ...args: any[]) => (byFreq_sort as any)(receiver, ...args)}, { kind: $.TypeKind.Pointer, elemType: "main.byFreq" }))!)
}

export function byFreq_Len(s: byFreq): number {
	return $.len((s as byFreq))
}

export function byFreq_Less(s: byFreq, i: number, j: number): boolean {
	return $.arrayIndex(s!, i) < $.arrayIndex(s!, j)
}

export function byFreq_Swap(s: byFreq, i: number, j: number): void {
	let __goscriptAssign1_0: number = $.arrayIndex(s!, j)
	let __goscriptAssign1_1: number = $.arrayIndex(s!, i)
	s![i] = __goscriptAssign1_0
	s![j] = __goscriptAssign1_1
}

export async function main(): globalThis.Promise<void> {
	// Test basic slice sorting
	let ints: $.Slice<number> = $.arrayToSlice<number>([3, 1, 4, 1, 5, 9])
	$.println("Original ints:", $.arrayIndex(ints!, 0), $.arrayIndex(ints!, 1), $.arrayIndex(ints!, 2), $.arrayIndex(ints!, 3), $.arrayIndex(ints!, 4), $.arrayIndex(ints!, 5))
	sort2.Ints(ints)
	$.println("Sorted ints:", $.arrayIndex(ints!, 0), $.arrayIndex(ints!, 1), $.arrayIndex(ints!, 2), $.arrayIndex(ints!, 3), $.arrayIndex(ints!, 4), $.arrayIndex(ints!, 5))

	// Test if sorted
	let isSorted = sort2.IntsAreSorted(ints)
	$.println("Ints are sorted:", isSorted)

	// Test string sorting
	let strings: $.Slice<string> = $.arrayToSlice<string>(["banana", "apple", "cherry"])
	$.println("Original strings:", $.arrayIndex(strings!, 0), $.arrayIndex(strings!, 1), $.arrayIndex(strings!, 2))
	sort2.Strings(strings)
	$.println("Sorted strings:", $.arrayIndex(strings!, 0), $.arrayIndex(strings!, 1), $.arrayIndex(strings!, 2))

	// Test if strings are sorted
	let stringSorted = sort2.StringsAreSorted(strings)
	$.println("Strings are sorted:", stringSorted)

	// Test float64 sorting
	let floats: $.Slice<number> = $.arrayToSlice<number>([3.14, 2.71, 1.41])
	$.println("Original floats:", $.arrayIndex(floats!, 0), $.arrayIndex(floats!, 1), $.arrayIndex(floats!, 2))
	sort2.Float64s(floats)
	$.println("Sorted floats:", $.arrayIndex(floats!, 0), $.arrayIndex(floats!, 1), $.arrayIndex(floats!, 2))

	// Test if floats are sorted
	let floatSorted = sort2.Float64sAreSorted(floats)
	$.println("Floats are sorted:", floatSorted)

	// Test search functions
	let intIndex = sort2.SearchInts(ints, 4)
	$.println("Index of 4 in sorted ints:", intIndex)

	let stringIndex = sort2.SearchStrings(strings, "banana")
	$.println("Index of 'banana' in sorted strings:", stringIndex)

	let floatIndex = sort2.SearchFloat64s(floats, 2.71)
	$.println("Index of 2.71 in sorted floats:", floatIndex)

	// Test generic Search function
	let searchResult = await sort2.Search($.len(ints), $.functionValue((i: number): boolean => {
		return $.arrayIndex(ints!, i) >= 5
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
	$.println("First index where value >= 5:", searchResult)

	// Test Slice function with custom comparator
	let testSlice: $.Slice<number> = $.arrayToSlice<number>([5, 2, 8, 1, 9])
	slices.Sort(testSlice)
	$.println("Custom sorted slice:", $.arrayIndex(testSlice!, 0), $.arrayIndex(testSlice!, 1), $.arrayIndex(testSlice!, 2), $.arrayIndex(testSlice!, 3), $.arrayIndex(testSlice!, 4))

	let asyncSlice: $.Slice<number> = $.arrayToSlice<number>([2, 1])
	let ready: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(ready, true)
	await sort2.Slice($.interfaceValue<any>(asyncSlice, "[]int"), $.functionValue(async (i: number, j: number): globalThis.Promise<boolean> => {
		await $.chanRecv(ready)
		return $.arrayIndex(asyncSlice!, i) < $.arrayIndex(asyncSlice!, j)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
	$.println("Async sorted slice:", $.arrayIndex(asyncSlice!, 0), $.arrayIndex(asyncSlice!, 1))

	// Test SliceIsSorted
	let isSliceSorted = await sort2.SliceIsSorted($.interfaceValue<any>(testSlice, "[]int"), $.functionValue((i: number, j: number): boolean => {
		return $.arrayIndex(testSlice!, i) < $.arrayIndex(testSlice!, j)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
	$.println("Custom slice is sorted:", isSliceSorted)

	// Test custom sort.Interface values.
	let custom = $.markAsStructValue(new descending({values: $.arrayToSlice<number>([1, 3, 2])}))
	await sort2.Sort($.interfaceValue<sort2.Interface | null>($.markAsStructValue($.cloneStructValue(custom)), "main.descending"))
	$.println("Custom interface sort:", $.arrayIndex(custom.values!, 0), $.arrayIndex(custom.values!, 1), $.arrayIndex(custom.values!, 2))

	let namedSlice: $.Slice<number> = $.arrayToSlice<number>([4, 1, 3])
	let namedSliceSorter: $.VarRef<byFreq> = $.varRef(null as byFreq)
	await byFreq_sort(namedSliceSorter, namedSlice)
	$.println("Named slice pointer sort:", $.arrayIndex(namedSlice!, 0), $.arrayIndex(namedSlice!, 1), $.arrayIndex(namedSlice!, 2))

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
