// Generated file based on cross_file_address_var.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_table from "./table.gs.ts"

export async function main(): globalThis.Promise<void> {
	let p = __goscript_table.table
	$.println(($.pointerValue<number[]>(p))[1])
}

if ($.isMainScript(import.meta)) {
	await main()
}
