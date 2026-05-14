// Generated file based on map_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let i: any = null
	i = new Map<string, number>([["age", 30]])
	let [m, ok] = $.typeAssertTuple<Map<string, number> | null>(i, { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } })
	if (ok) {
		$.println("Age:", $.mapGet(m, "age", 0)[0])
	} else {
		$.println("Type assertion failed")
	}
	let [, ok2] = $.typeAssertTuple<Map<string, string> | null>(i, { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "string" } })
	if (ok2) {
		$.println("Unexpected success for map[string]string assertion")
	} else {
		$.println("Second type assertion (map[string]string) failed as expected")
	}
	let [, ok3] = $.typeAssertTuple<Map<number, number> | null>(i, { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "int" }, elemType: { kind: $.TypeKind.Basic, name: "int" } })
	if (ok3) {
		$.println("Unexpected success for map[int]int assertion")
	} else {
		$.println("Third type assertion (map[int]int) failed as expected")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
