// Generated file based on package_import_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

export async function main(): Promise<void> {
	let now = $.markAsStructValue($.cloneStructValue(time.Now()))
	let setTime = $.markAsStructValue($.cloneStructValue(time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC)))
	if ($.markAsStructValue($.cloneStructValue(now)).Sub($.markAsStructValue($.cloneStructValue(setTime))) < (time.Hour * 24)) {
		$.println("expected we are > 24 hrs past may 15, incorrect")
	}

	$.println("preset time", $.markAsStructValue($.cloneStructValue(setTime)).String())
	$.println("unix", $.markAsStructValue($.cloneStructValue(setTime)).Unix())
	$.println("unix micro", $.markAsStructValue($.cloneStructValue(setTime)).UnixMicro())
	$.println("unix nano", $.markAsStructValue($.cloneStructValue(setTime)).UnixNano())
	$.println("unix milli", $.markAsStructValue($.cloneStructValue(setTime)).UnixMilli())

	// day, month, etc.
	$.println("day", $.markAsStructValue($.cloneStructValue(setTime)).Day())
	$.println("month", $.markAsStructValue($.cloneStructValue(setTime)).Month())
	$.println("year", $.markAsStructValue($.cloneStructValue(setTime)).Year())
	$.println("hour", $.markAsStructValue($.cloneStructValue(setTime)).Hour())
	$.println("minute", $.markAsStructValue($.cloneStructValue(setTime)).Minute())
	$.println("second", $.markAsStructValue($.cloneStructValue(setTime)).Second())
	$.println("nanosecond", $.markAsStructValue($.cloneStructValue(setTime)).Nanosecond())
	let [year, month, day] = $.markAsStructValue($.cloneStructValue(setTime)).Date()
	$.println("date tuple", year, month, day)
	let [hour, minute, second] = $.markAsStructValue($.cloneStructValue(setTime)).Clock()
	$.println("clock tuple", hour, minute, second)
	let [zoneName, zoneOffset] = $.markAsStructValue($.cloneStructValue(setTime)).Zone()
	$.println("zone tuple", zoneName, zoneOffset)
	$.println("add date", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(setTime)).AddDate(1, 2, 3))).UTC())).Format(time.RFC3339))

	// other functions on setTime
	$.println("weekday", time.Weekday_String($.markAsStructValue($.cloneStructValue(setTime)).Weekday()))
	$.println("location", $.pointerValue<time.Location>($.markAsStructValue($.cloneStructValue(setTime)).Location()).String())
	$.println("utc", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(setTime)).UTC())).Format("2006-01-02T15:04:05Z07:00"))
	$.println("seconds", time.Duration_Seconds((1500 * time.Millisecond)))
	$.println("duration string", time.Duration_String((1500 * time.Millisecond)))

	let [duration, durationErr] = time.ParseDuration("1.5s")
	$.println("parsed duration", duration, durationErr == null)
	let [, badDurationErr] = time.ParseDuration("not-a-duration")
	$.println("bad duration err", badDurationErr != null)

	let [parsed, parseErr] = time.Parse(time.RFC3339, "2025-05-15T01:10:42Z")
	$.println("parsed time", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(parsed)).UTC())).Format(time.RFC3339), parseErr == null)
	$.println("parsed nano", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(parsed)).UTC())).Format(time.RFC3339Nano))
	let [, badParseErr] = time.Parse(time.RFC3339, "not-a-time")
	$.println("bad time err", badParseErr != null)
}


if ($.isMainScript(import.meta)) {
	await main()
}
