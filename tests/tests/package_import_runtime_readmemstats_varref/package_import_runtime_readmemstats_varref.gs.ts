// Generated file based on package_import_runtime_readmemstats_varref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"
import "@goscript/runtime/index.js"

export async function main(): globalThis.Promise<void> {
	let stats: $.VarRef<runtime.MemStats> = $.varRef($.markAsStructValue(new runtime.MemStats()))
	runtime.ReadMemStats(stats)
	$.println(stats.value.Alloc >= 0n)
}

if ($.isMainScript(import.meta)) {
	await main()
}
