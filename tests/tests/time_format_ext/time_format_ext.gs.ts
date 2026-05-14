// Generated file based on time_format_ext.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as time from "@goscript/time/index.ts"

export async function main(): Promise<void> {
	let locPDT = time.FixedZone("PDT", -7 * 60 * 60)
	let t1 = $.markAsStructValue(time.Date(2025, time.May, 25, 17, 42, 56, 123456789, locPDT).clone())
	$.println("--- Specific Time (2025-05-25 17:42:56.123456789 -0700 PDT) ---")
	$.println("Layout Z07:00  -> " + $.markAsStructValue(t1.clone()).Format("2006-01-02 15:04:05 Z07:00"))
	$.println("Layout -07:00  -> " + $.markAsStructValue(t1.clone()).Format("2006-01-02 15:04:05 -07:00"))
	$.println("Layout -0700   -> " + $.markAsStructValue(t1.clone()).Format("2006-01-02 15:04:05 -0700"))
	$.println("Layout -07     -> " + $.markAsStructValue(t1.clone()).Format("2006-01-02 15:04:05 -07"))
	$.println("Layout Z       -> " + $.markAsStructValue(t1.clone()).Format("2006-01-02 15:04:05 Z"))
	$.println("Layout MST     -> " + $.markAsStructValue(t1.clone()).Format("2006-01-02 15:04:05 MST"))
	$.println("Layout .000000000 -> " + $.markAsStructValue(t1.clone()).Format("15:04:05.000000000"))
	$.println("Layout .000000   -> " + $.markAsStructValue(t1.clone()).Format("15:04:05.000000"))
	$.println("Layout .000      -> " + $.markAsStructValue(t1.clone()).Format("15:04:05.000"))
	$.println("Layout .999999999 -> " + $.markAsStructValue(t1.clone()).Format("15:04:05.999999999"))
	$.println("Layout .999999   -> " + $.markAsStructValue(t1.clone()).Format("15:04:05.999999"))
	$.println("Layout .999      -> " + $.markAsStructValue(t1.clone()).Format("15:04:05.999"))
	$.println("Layout Combined  -> " + $.markAsStructValue(t1.clone()).Format("Mon Jan _2 15:04:05.999999999 Z07:00 2006"))
	let locPST = time.FixedZone("PST", -8 * 60 * 60)
	let t2 = $.markAsStructValue(time.Date(2025, time.May, 25, 17, 42, 56, 0, locPST).clone())
	$.println("--- Specific Time (2025-05-25 17:42:56.000 -0800 PST) ---")
	$.println("Layout .999 (zero ns) -> " + $.markAsStructValue(t2.clone()).Format("15:04:05.999"))
	$.println("Layout .000 (zero ns) -> " + $.markAsStructValue(t2.clone()).Format("15:04:05.000"))
	let t3 = $.markAsStructValue(time.Date(2025, time.May, 25, 17, 42, 56, 123456789, time.UTC).clone())
	$.println("--- UTC Time (2025-05-25 17:42:56.123456789 Z) ---")
	$.println("Layout Z07:00 (UTC) -> " + $.markAsStructValue(t3.clone()).Format("2006-01-02 15:04:05 Z07:00"))
	$.println("Layout Z (UTC)      -> " + $.markAsStructValue(t3.clone()).Format("2006-01-02 15:04:05 Z"))
	$.println("Layout -07:00 (UTC) -> " + $.markAsStructValue(t3.clone()).Format("2006-01-02 15:04:05 -07:00"))
	$.println("Layout MST (UTC)    -> " + $.markAsStructValue(t3.clone()).Format("2006-01-02 15:04:05 MST"))
}


if ($.isMainScript(import.meta)) {
	await main()
}
