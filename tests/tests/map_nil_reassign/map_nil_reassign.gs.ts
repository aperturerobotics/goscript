// Generated file based on map_nil_reassign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let values: globalThis.Map<string, number> | null = $.makeMap<string, number>()
	$.mapSet(values, "one", 1)
	$.println("before nil:", $.mapGet(values, "one", 0)[0])
	values = null
	$.println("is nil:", values == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
