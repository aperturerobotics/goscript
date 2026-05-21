// Generated file based on redeclaration_assign_multi_rhs.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let s = "abcdef"
	let name = $.sliceStringOrBytes(s, undefined, 2)
	s = $.sliceStringOrBytes(s, 2, undefined)

	$.println(name)
	$.println(s)
}


if ($.isMainScript(import.meta)) {
	await main()
}
