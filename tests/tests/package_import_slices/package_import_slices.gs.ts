// Generated file based on package_import_slices.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as slices from "@goscript/slices/index.ts"

export async function main(): Promise<void> {
	let s = [1, 2, 3, 4, 5]
	for (let i = 0; i < $.len(slices.All(s)); i++) {
		let v = slices.All(s)[i]
		$.println("index:", i, "value:", v)
	}
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
