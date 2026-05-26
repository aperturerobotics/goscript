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
			values: $.varRef(init?.values ?? null)
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
		return d.values![i] > d.values![j]
	}

	public Swap(i: number, j: number): void {
		let d: descending = this
		let __goscriptAssign0_0: number = d.values![j]
		let __goscriptAssign0_1: number = d.values![i]
		d.values![i] = __goscriptAssign0_0
		d.values![j] = __goscriptAssign0_1
	}

	static __typeInfo = $.registerStructType(
		"main.descending",
		() => new descending(),
		[{ name: "Len", args: [], returns: [] }, { name: "Less", args: [], returns: [] }, { name: "Swap", args: [], returns: [] }],
		descending,
		{"values": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export type byFreq = $.Slice<number>

export function byFreq_sort(s: $.VarRef<byFreq> | null, a: $.Slice<number>): void {
	s!.value = ((a as byFreq) as byFreq)
	sort2.Sort($.pointerValueOrNil($.namedValueInterfaceValue<sort2.Interface | null>(s, "*main.byFreq", {Len: (receiver: any, ...args: any[]) => (byFreq_Len as any)($.pointerValue(receiver), ...args), Less: (receiver: any, ...args: any[]) => (byFreq_Less as any)($.pointerValue(receiver), ...args), Swap: (receiver: any, ...args: any[]) => (byFreq_Swap as any)($.pointerValue(receiver), ...args), sort: (receiver: any, ...args: any[]) => (byFreq_sort as any)(receiver, ...args)}))!)
}

export function byFreq_Len(s: byFreq): number {
	return $.len((s as byFreq))
}

export function byFreq_Less(s: byFreq, i: number, j: number): boolean {
	return s![i] < s![j]
}

export function byFreq_Swap(s: byFreq, i: number, j: number): void {
	let __goscriptAssign1_0: number = s![j]
	let __goscriptAssign1_1: number = s![i]
	s![i] = __goscriptAssign1_0
	s![j] = __goscriptAssign1_1
}

export async function main(): globalThis.Promise<void> {
	// Test basic slice sorting
	let ints: $.Slice<number> = $.arrayToSlice<number>([3, 1, 4, 1, 5, 9])
	$.println("Original ints:", ints![0], ints![1], ints![2], ints![3], ints![4], ints![5])
	sort2.Ints(ints)
	$.println("Sorted ints:", ints![0], ints![1], ints![2], ints![3], ints![4], ints![5])

	// Test if sorted
	let isSorted = sort2.IntsAreSorted(ints)
	$.println("Ints are sorted:", isSorted)

	// Test string sorting
	let strings: $.Slice<string> = $.arrayToSlice<string>(["banana", "apple", "cherry"])
	$.println("Original strings:", strings![0], strings![1], strings![2])
	sort2.Strings(strings)
	$.println("Sorted strings:", strings![0], strings![1], strings![2])

	// Test if strings are sorted
	let stringSorted = sort2.StringsAreSorted(strings)
	$.println("Strings are sorted:", stringSorted)

	// Test float64 sorting
	let floats: $.Slice<number> = $.arrayToSlice<number>([3.14, 2.71, 1.41])
	$.println("Original floats:", floats![0], floats![1], floats![2])
	sort2.Float64s(floats)
	$.println("Sorted floats:", floats![0], floats![1], floats![2])

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
	let searchResult = sort2.Search($.len(ints), $.functionValue((i: number): boolean => {
		return ints![i] >= 5
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
	$.println("First index where value >= 5:", searchResult)

	// Test Slice function with custom comparator
	let testSlice: $.Slice<number> = $.arrayToSlice<number>([5, 2, 8, 1, 9])
	slices.Sort(testSlice)
	$.println("Custom sorted slice:", testSlice![0], testSlice![1], testSlice![2], testSlice![3], testSlice![4])

	let asyncSlice: $.Slice<number> = $.arrayToSlice<number>([2, 1])
	let ready = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(ready, true)
	await sort2.Slice($.interfaceValue<any>(asyncSlice, "[]int"), $.functionValue(async (i: number, j: number): globalThis.Promise<boolean> => {
		await $.chanRecv(ready)
		return asyncSlice![i] < asyncSlice![j]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
	$.println("Async sorted slice:", asyncSlice![0], asyncSlice![1])

	// Test SliceIsSorted
	let isSliceSorted = await sort2.SliceIsSorted($.interfaceValue<any>(testSlice, "[]int"), $.functionValue((i: number, j: number): boolean => {
		return testSlice![i] < testSlice![j]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
	$.println("Custom slice is sorted:", isSliceSorted)

	// Test custom sort.Interface values.
	let custom = $.markAsStructValue(new descending({values: $.arrayToSlice<number>([1, 3, 2])}))
	sort2.Sort($.interfaceValue<sort2.Interface | null>($.markAsStructValue($.cloneStructValue(custom)), "main.descending"))
	$.println("Custom interface sort:", custom.values![0], custom.values![1], custom.values![2])

	let namedSlice: $.Slice<number> = $.arrayToSlice<number>([4, 1, 3])
	let namedSliceSorter: $.VarRef<byFreq> = $.varRef(null as byFreq)
	byFreq_sort(namedSliceSorter, namedSlice)
	$.println("Named slice pointer sort:", namedSlice![0], namedSlice![1], namedSlice![2])

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
