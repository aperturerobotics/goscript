// Generated file based on string_range_runes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	for (const [i, r] of $.rangeString("a¢€")) {
		$.println(i, r)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
