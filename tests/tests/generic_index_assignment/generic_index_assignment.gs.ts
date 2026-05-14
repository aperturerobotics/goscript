// Generated file based on generic_index_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function modifyGenericSlice(__typeArgs: $.GenericTypeArgs | undefined, s: any, i: number, v: any): void {
	s[i] = v
}

export async function main(): Promise<void> {
	let slice = [1, 2, 3]
	modifyGenericSlice({S: { zero: () => null }, E: { zero: () => 0 }}, slice, 1, 42)
	$.println("slice[0]:", slice[0])
	$.println("slice[1]:", slice[1])
	$.println("slice[2]:", slice[2])
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
