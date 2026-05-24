// Generated file based on selective_exports.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_utils from "./utils.gs.ts"
import "./utils.gs.ts"

export async function main(): globalThis.Promise<void> {
	$.println("=== Selective Exports Test ===")

	// Call exported function
	ExportedFunc()

	// Call unexported function from same file
	unexportedFunc()

	// Call exported function from another file
	__goscript_utils.ExportedFromUtils()

	// Call unexported function from another file (should work due to auto-imports)
	__goscript_utils.unexportedFromUtils()

	$.println("=== End Selective Exports Test ===")
}

export function ExportedFunc(): void {
	$.println("ExportedFunc called")
}

export function unexportedFunc(): void {
	$.println("unexportedFunc called")
}

if ($.isMainScript(import.meta)) {
	await main()
}
