// Generated file based on make_generic_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type Ints = Map<any, Record<string, unknown>> | null

export async function main(): Promise<void> {
	let seen = $.makeMap<number, Record<string, unknown>>()
	$.mapSet(seen, 42, {})
	let [, exists] = $.mapGet(seen, 42, {})
	$.println("Value exists:", exists)
	let stringSet = $.makeMap<string, Record<string, unknown>>()
	$.mapSet(stringSet, "hello", {})
	let [, exists2] = $.mapGet(stringSet, "hello", {})
	$.println("String exists:", exists2)
}


if ($.isMainScript(import.meta)) {
	await main()
}
