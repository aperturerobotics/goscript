// Generated file based on method_call_slice_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MySlice = $.Slice<number>;

export function MySlice_Add(s: $.VarRef<MySlice>, val: number): void {
	s!.value = $.append(s!.value, val)
}


export async function main(): Promise<void> {
	let myList: MySlice = null
	MySlice_Add(myList, 10)
	MySlice_Add(myList, 20)
	console.log("length:", $.len(myList))
	console.log("first:", myList![0])
	console.log("second:", myList![1])
}

