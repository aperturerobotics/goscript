// Generated file based on named_slice_wrapper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as os from "@goscript/os/index.ts"

export type ByName = $.Slice<FileInfo>

export function ByName_Len(a: ByName): number {
	return $.len(a)
}

export function ByName_Less(a: ByName, i: number, j: number): boolean {
	return a[i].Name() < a[j].Name()
}

export function ByName_Swap(a: ByName, i: number, j: number): void {
	let __goscriptAssign3839207_0 = a[j]
	let __goscriptAssign3839207_1 = a[i]
	a[i] = __goscriptAssign3839207_0
	a[j] = __goscriptAssign3839207_1
}

export async function main(): Promise<void> {
	let files: ByName = $.makeSlice<FileInfo>(2)
	$.println("Length:", ByName_Len(files))
	let slice: $.Slice<FileInfo> = files
	$.println("Slice length:", $.len(slice))
}


if ($.isMainScript(import.meta)) {
	await main()
}
