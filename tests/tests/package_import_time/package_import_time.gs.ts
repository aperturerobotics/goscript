// Generated file based on package_import_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

export async function main(): Promise<void> {
	let now = $.markAsStructValue((time.Now()).clone())
	let setTime = $.markAsStructValue((time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC)).clone())
	if ($.markAsStructValue((now).clone()).Sub($.markAsStructValue((setTime).clone())) < (time.Hour * 24)) {
		$.println("expected we are > 24 hrs past may 15, incorrect")
	}

	$.println("preset time", $.markAsStructValue((setTime).clone()).String())
	$.println("unix", $.markAsStructValue((setTime).clone()).Unix())
	$.println("unix micro", $.markAsStructValue((setTime).clone()).UnixMicro())
	$.println("unix nano", $.markAsStructValue((setTime).clone()).UnixNano())
	$.println("unix milli", $.markAsStructValue((setTime).clone()).UnixMilli())

	// day, month, etc.
	$.println("day", $.markAsStructValue((setTime).clone()).Day())
	$.println("month", $.markAsStructValue((setTime).clone()).Month())
	$.println("year", $.markAsStructValue((setTime).clone()).Year())
	$.println("hour", $.markAsStructValue((setTime).clone()).Hour())
	$.println("minute", $.markAsStructValue((setTime).clone()).Minute())
	$.println("second", $.markAsStructValue((setTime).clone()).Second())
	$.println("nanosecond", $.markAsStructValue((setTime).clone()).Nanosecond())

	// other functions on setTime
	$.println("weekday", time.Weekday_String($.markAsStructValue((setTime).clone()).Weekday()))
	$.println("location", $.pointerValue<time.Location>($.markAsStructValue((setTime).clone()).Location()).String())
	$.println("utc", $.markAsStructValue(($.markAsStructValue((setTime).clone()).UTC()).clone()).Format("2006-01-02T15:04:05Z07:00"))
	$.println("seconds", time.Duration_Seconds((1500 * time.Millisecond)))

	let [duration, durationErr] = time.ParseDuration("1.5s")
	$.println("parsed duration", duration, durationErr == null)
	let [, badDurationErr] = time.ParseDuration("not-a-duration")
	$.println("bad duration err", badDurationErr != null)

	let [parsed, parseErr] = time.Parse(time.RFC3339, "2025-05-15T01:10:42Z")
	$.println("parsed time", $.markAsStructValue(($.markAsStructValue((parsed).clone()).UTC()).clone()).Format(time.RFC3339), parseErr == null)
	let [, badParseErr] = time.Parse(time.RFC3339, "not-a-time")
	$.println("bad time err", badParseErr != null)
}


if ($.isMainScript(import.meta)) {
	await main()
}
