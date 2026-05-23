// Generated file based on constant_shift_64.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let limit = (274877906944) - 64
	$.println(limit > 1024, limit)
}

if ($.isMainScript(import.meta)) {
	await main()
}
