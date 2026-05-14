// Generated file based on for_init_value_ok.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let m = $.makeMap<string, number>()
	$.mapSet(m, "key1", 10)
	$.mapSet(m, "key2", 20)
	for (let [value, ok] = $.mapGet(m, "key1", 0); ok; ) {
		$.println("value:", value)
		break
	}
	for (let [v, exists] = $.mapGet(m, "key2", 0); exists && v > 0; ) {
		$.println("v:", v)
		break
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
