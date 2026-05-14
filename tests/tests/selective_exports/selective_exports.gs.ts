// Generated file based on selective_exports.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as __goscript_utils from "./utils.gs.ts"

export async function main(): Promise<void> {
	$.println("=== Selective Exports Test ===")
	ExportedFunc()
	unexportedFunc()
	__goscript_utils.ExportedFromUtils()
	__goscript_utils.unexportedFromUtils()
	$.println("=== End Selective Exports Test ===")
}


if ($.isMainScript(import.meta)) {
	await main()
}

export function ExportedFunc(): void {
	$.println("ExportedFunc called")
}

export function unexportedFunc(): void {
	$.println("unexportedFunc called")
}
