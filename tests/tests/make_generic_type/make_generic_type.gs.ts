// Generated file based on make_generic_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Ints = globalThis.Map<any, {}> | null

export async function main(): globalThis.Promise<void> {
	// This should trigger the unhandled make call error
	// Similar to: seen := make(set.Ints[int64])
	let seen: Ints = $.makeMap<bigint, {}>()

	// Test basic operations
	$.mapSet(seen, 42n, {})
	let [, exists] = $.mapGet<bigint, {}, {}>(seen, 42n, {})
	$.println("Value exists:", exists)

	// Test with string type parameter
	let stringSet: Ints = $.makeMap<string, {}>()
	$.mapSet(stringSet, "hello", {})
	let [, exists2] = $.mapGet<string, {}, {}>(stringSet, "hello", {})
	$.println("String exists:", exists2)
}

if ($.isMainScript(import.meta)) {
	await main()
}
