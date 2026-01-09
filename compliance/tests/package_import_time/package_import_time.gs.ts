// Generated file based on package_import_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

export async function main(): Promise<void> {
	let now = $.markAsStructValue(time.Now().clone())
	let setTime = $.markAsStructValue(time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC).clone())
	if (now.Sub(setTime) < time.Hour * 24) {
		$.println("expected we are > 24 hrs past may 15, incorrect")
	}

	$.println("preset time", setTime.String())
	$.println("unix", setTime.Unix())
	$.println("unix micro", setTime.UnixMicro())
	$.println("unix nano", setTime.UnixNano())
	$.println("unix milli", setTime.UnixMilli())

	// day, month, etc.
	$.println("day", setTime.Day())
	$.println("month", setTime.Month())
	$.println("year", setTime.Year())
	$.println("hour", setTime.Hour())
	$.println("minute", setTime.Minute())
	$.println("second", setTime.Second())
	$.println("nanosecond", setTime.Nanosecond())

	// other functions on setTime
	$.println("weekday", time.Weekday_String(setTime.Weekday()))
	$.println("location", setTime.Location()!.String())
}

