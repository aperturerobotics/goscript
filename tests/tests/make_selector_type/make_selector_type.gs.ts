// Generated file based on make_selector_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let mfs = $.makeMap<string, $.Slice<number>>()
	$.mapSet(mfs, "test.txt", $.stringToBytes("hello world"))
	$.println("Created map:", $.len(mfs))
	$.println("Content:", $.bytesToString($.mapGet(mfs, "test.txt", null)[0]))
}


if ($.isMainScript(import.meta)) {
	await main()
}
