// Generated file based on package_import_runtime_debug.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as debug from "@goscript/runtime/debug/index.js"
import "@goscript/runtime/debug/index.js"

export async function main(): globalThis.Promise<void> {
	let stack: $.Slice<number> = debug.Stack()
	$.println("Stack nonempty:", $.len(stack) > 0)
}

if ($.isMainScript(import.meta)) {
	await main()
}
