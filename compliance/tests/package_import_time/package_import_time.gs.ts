// Generated file based on package_import_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js";

import * as time from "@goscript/time/index.js"

export async function main(): Promise<void> {
	let now = $.markAsStructValue(time.Now().clone())
	let setTime = $.markAsStructValue(time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC).clone())
	if (now.Sub(setTime) < time.Hour * 24) {
		console.log("expected we are > 24 hrs past may 15, incorrect")
	}

	console.log("preset time", setTime.String())
	console.log("unix", setTime.Unix())
	console.log("unix micro", setTime.UnixMicro())
	console.log("unix nano", setTime.UnixNano())
	console.log("unix milli", setTime.UnixMilli())

	// day, month, etc.
	console.log("day", setTime.Day())
	console.log("month", setTime.Month())
	console.log("year", setTime.Year())
	console.log("hour", setTime.Hour())
	console.log("minute", setTime.Minute())
	console.log("second", setTime.Second())
	console.log("nanosecond", setTime.Nanosecond())

	// other functions on setTime
	console.log("weekday", time.Weekday_String(setTime.Weekday()))
	console.log("location", setTime.Location()!.String())
}

