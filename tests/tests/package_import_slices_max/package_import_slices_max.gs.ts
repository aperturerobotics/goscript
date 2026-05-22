// Generated file based on package_import_slices_max.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

export async function main(): globalThis.Promise<void> {
	$.println("max int:", slices.Max($.arrayToSlice<number>([3, 1, 4, 2])))
	$.println("max string:", slices.Max($.arrayToSlice<string>(["beta", "alpha", "gamma"])))
}

if ($.isMainScript(import.meta)) {
	await main()
}
