// Generated file based on generic_index_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function modifyGenericSlice(__typeArgs: $.GenericTypeArgs | undefined, s: any, i: number, v: any): void {
	// This line causes the issue: s[i] = v
	// For generic slice types, the compiler should generate proper assignment
	// But currently it may generate: $.indexStringOrBytes(s, i) = v
	// which is invalid TypeScript syntax
	s![i] = v
}

export async function main(): Promise<void> {
	let slice = $.arrayToSlice<number>([1, 2, 3])
	modifyGenericSlice({S: { type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, zero: () => null }, E: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, slice, 1, 42)

	$.println("slice[0]:", slice![0])
	$.println("slice[1]:", slice![1])
	$.println("slice[2]:", slice![2])
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
