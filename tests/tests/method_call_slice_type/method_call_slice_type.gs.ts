// Generated file based on method_call_slice_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MySlice = $.Slice<number>

export function MySlice_Add(s: $.VarRef<MySlice> | null, val: number): void {
	s!.value = ($.append(($.pointerValue<MySlice>(s) as MySlice), val) as MySlice)
}

export async function main(): Promise<void> {
	let myList: $.VarRef<MySlice> = $.varRef(null)
	MySlice_Add(myList, 10)
	MySlice_Add(myList, 20)
	$.println("length:", $.len((myList.value as MySlice)))
	$.println("first:", myList.value![0])
	$.println("second:", myList.value![1])
}


if ($.isMainScript(import.meta)) {
	await main()
}
