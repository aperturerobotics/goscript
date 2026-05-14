// Generated file based on map_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let i: any = null
	i = $.interfaceValue<any>(new Map<string, number>([["age", 30]]), "map[string]int")

	let [m, ok] = $.typeAssertTuple<Map<string, number> | null>(i, { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } })
	if (ok) {
		$.println("Age:", $.mapGet(m, "age", 0)[0])
	} else {
		$.println("Type assertion failed")
	}

	let [, ok2] = $.typeAssertTuple<Map<string, string> | null>(i, { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "string" } })
	if (ok2) {
		// This block should not be reached if the assertion fails as expected.
		// Depending on how Go handles failed assertions with incorrect types,
		// accessing n["key"] might panic if n is nil.
		// For safety and clarity, we'll just print a generic message if it passes unexpectedly.
		$.println("Unexpected success for map[string]string assertion")
	} else {
		$.println("Second type assertion (map[string]string) failed as expected")
	}

	let [, ok3] = $.typeAssertTuple<Map<number, number> | null>(i, { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "int" }, elemType: { kind: $.TypeKind.Basic, name: "int" } })
	if (ok3) {
		// Similar to the above, this block should not be reached.
		$.println("Unexpected success for map[int]int assertion")
	} else {
		$.println("Third type assertion (map[int]int) failed as expected")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
