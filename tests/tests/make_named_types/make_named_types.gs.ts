// Generated file based on make_named_types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	type MySlice = $.Slice<number>
	let s: MySlice = $.makeSlice<number>(5, undefined, "number")
	$.println("Length:", $.len(s))
	type MyMap = Map<string, number> | null
	let m: MyMap = $.makeMap<string, number>()
	$.mapSet(m, "test", 42)
	$.println("Value:", $.mapGet(m, "test", 0)[0])
}


if ($.isMainScript(import.meta)) {
	await main()
}
