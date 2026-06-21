// Generated file based on make_selector_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Test make() with a map type
	// This verifies that our fix for selector expressions in make() calls works
	// The original issue was "unhandled make call" when using selector expressions

	let mfs: globalThis.Map<string, $.Slice<number>> | null = $.makeMap<string, $.Slice<number>>()
	$.mapSet(mfs, "test.txt", new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]))
	$.println("Created map:", $.len(mfs))
	$.println("Content:", $.bytesToString($.mapGet<string, $.Slice<number>, $.Slice<number>>(mfs, "test.txt", null)[0]))
}

if ($.isMainScript(import.meta)) {
	await main()
}
