// Generated file based on package_import_time_in.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/time/index.js"

export async function main(): globalThis.Promise<void> {
	let utc = $.markAsStructValue($.cloneStructValue(time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC)))
	let pdt: time.Location | $.VarRef<time.Location> | null = time.FixedZone("PDT", (-7 * 60) * 60)

	$.println("in pdt:", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(utc)).In(pdt))).Format(time.RFC3339))
}

if ($.isMainScript(import.meta)) {
	await main()
}
