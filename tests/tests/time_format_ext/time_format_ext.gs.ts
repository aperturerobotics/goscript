// Generated file based on time_format_ext.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

export async function main(): globalThis.Promise<void> {
	// Fixed time with a specific offset and nanoseconds
	let locPDT: time.Location | $.VarRef<time.Location> | null = time.FixedZone("PDT", (-7 * 60) * 60)
	let t1 = $.markAsStructValue($.cloneStructValue(time.Date(2025, time.May, 25, 17, 42, 56, 123456789, locPDT)))

	$.println("--- Specific Time (2025-05-25 17:42:56.123456789 -0700 PDT) ---")
	// Timezone patterns
	$.println("Layout Z07:00  -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("2006-01-02 15:04:05 Z07:00"))
	$.println("Layout -07:00  -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("2006-01-02 15:04:05 -07:00"))
	$.println("Layout -0700   -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("2006-01-02 15:04:05 -0700"))
	$.println("Layout -07     -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("2006-01-02 15:04:05 -07"))
	$.println("Layout Z       -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("2006-01-02 15:04:05 Z"))
	$.println("Layout MST     -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("2006-01-02 15:04:05 MST"))

	// Nanosecond patterns (fixed)
	$.println("Layout .000000000 -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("15:04:05.000000000"))
	$.println("Layout .000000   -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("15:04:05.000000"))
	$.println("Layout .000      -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("15:04:05.000"))

	// Nanosecond patterns (trimming)
	$.println("Layout .999999999 -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("15:04:05.999999999"))
	$.println("Layout .999999   -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("15:04:05.999999"))
	$.println("Layout .999      -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("15:04:05.999"))

	// Combined layout
	$.println("Layout Combined  -> " + $.markAsStructValue($.cloneStructValue(t1)).Format("Mon Jan _2 15:04:05.999999999 Z07:00 2006"))

	// Fixed time with zero nanoseconds for trimming tests
	let locPST: time.Location | $.VarRef<time.Location> | null = time.FixedZone("PST", (-8 * 60) * 60)
	let t2 = $.markAsStructValue($.cloneStructValue(time.Date(2025, time.May, 25, 17, 42, 56, 0, locPST)))
	$.println("--- Specific Time (2025-05-25 17:42:56.000 -0800 PST) ---")
	$.println("Layout .999 (zero ns) -> " + $.markAsStructValue($.cloneStructValue(t2)).Format("15:04:05.999"))
	$.println("Layout .000 (zero ns) -> " + $.markAsStructValue($.cloneStructValue(t2)).Format("15:04:05.000"))

	// Fixed UTC time for Z and Z07:00 patterns
	let t3 = $.markAsStructValue($.cloneStructValue(time.Date(2025, time.May, 25, 17, 42, 56, 123456789, time.UTC)))
	$.println("--- UTC Time (2025-05-25 17:42:56.123456789 Z) ---")
	$.println("Layout Z07:00 (UTC) -> " + $.markAsStructValue($.cloneStructValue(t3)).Format("2006-01-02 15:04:05 Z07:00"))
	$.println("Layout Z (UTC)      -> " + $.markAsStructValue($.cloneStructValue(t3)).Format("2006-01-02 15:04:05 Z"))
	$.println("Layout -07:00 (UTC) -> " + $.markAsStructValue($.cloneStructValue(t3)).Format("2006-01-02 15:04:05 -07:00"))
	$.println("Layout MST (UTC)    -> " + $.markAsStructValue($.cloneStructValue(t3)).Format("2006-01-02 15:04:05 MST"))
}


if ($.isMainScript(import.meta)) {
	await main()
}
