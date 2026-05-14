// Generated file based on package_import_slices.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as slices from "@goscript/slices/index.ts"

export async function main(): Promise<void> {
	let s = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	;(() => {
		slices.All(s)!((i, v) => {
			$.println("index:", i, "value:", v)
			return true
		})
	})()
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
