// Generated file based on method_call_slice_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MySlice = $.Slice<number>

export function MySlice_Add(s: $.VarRef<MySlice> | null, val: number): void {
	s!.value = ($.append(($.pointerValue<MySlice>(s) as MySlice), val) as MySlice)
}

export function MySlice_Sum(s: MySlice): number {
	let total = 0
	for (let __goscriptRangeTarget0 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let v = __goscriptRangeTarget0![__rangeIndex]
		total += v
	}
	return total
}

export async function main(): globalThis.Promise<void> {
	let myList: $.VarRef<MySlice> = $.varRef(null as MySlice)
	MySlice_Add(myList, 10)
	MySlice_Add(myList, 20)
	let ptr: $.VarRef<MySlice> | null = myList
	$.println("length:", $.len((myList.value as MySlice)))
	$.println("first:", myList.value![0])
	$.println("second:", myList.value![1])
	$.println("sum:", MySlice_Sum($.pointerValue<MySlice>(ptr)))
}

if ($.isMainScript(import.meta)) {
	await main()
}
