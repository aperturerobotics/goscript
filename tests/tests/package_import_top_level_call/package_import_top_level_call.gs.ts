// Generated file based on package_import_top_level_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_top_level_call/subpkg/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_top_level_call/subpkg/index.js"

export let cached: number = await subpkg.Next()

export function __goscript_set_cached(__goscriptValue: number): void {
	cached = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	$.println("cached:", cached)
}

if ($.isMainScript(import.meta)) {
	await main()
}
