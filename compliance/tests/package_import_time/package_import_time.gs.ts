// Generated file based on package_import_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

export async function main(): Promise<void> {
	let now = $.markAsStructValue(time.Now().clone())
	let setTime = $.markAsStructValue(await time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC).clone())
	if (now.Sub(setTime) < time.Hour * 24) {
		console.log("expected we are > 24 hrs past may 15, incorrect")
	}

	console.log("preset time", await setTime.String())
	console.log("unix", setTime.Unix())
	console.log("unix micro", setTime.UnixMicro())
	console.log("unix nano", setTime.UnixNano())
	console.log("unix milli", setTime.UnixMilli())

	// day, month, etc.
	console.log("day", await setTime.Day())
	console.log("month", await setTime.Month())
	console.log("year", await setTime.Year())
	console.log("hour", await setTime.Hour())
	console.log("minute", await setTime.Minute())
	console.log("second", await setTime.Second())
	console.log("nanosecond", setTime.Nanosecond())

	// other functions on setTime
	console.log("weekday", time.Weekday_String(await setTime.Weekday()))
	console.log("location", setTime.Location()!.String())
}

