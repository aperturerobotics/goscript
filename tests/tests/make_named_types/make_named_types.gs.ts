// Generated file based on make_named_types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Test make() calls with named types as the first argument
	// This tests the compiler's ability to handle make() with type aliases/named types
	// rather than direct type expressions like []int or map[string]int

	type MySlice = $.Slice<number>
	let s: MySlice = ($.makeSlice<number>(5, undefined, "number") as MySlice)
	$.println("Length:", $.len((s as MySlice)))

	// Test make() with named map type
	type MyMap = globalThis.Map<string, number> | null
	let m: MyMap = $.makeMap<string, number>()
	$.mapSet(m, "test", 42)
	$.println("Value:", $.mapGet<string, number, number>(m, "test", 0)[0])
}

if ($.isMainScript(import.meta)) {
	await main()
}
