// Generated file based on package_import_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/math/index.js"
import "@goscript/time/index.js"

export async function main(): globalThis.Promise<void> {
	let now = $.markAsStructValue($.cloneStructValue(time.Now()))
	let setTime = $.markAsStructValue($.cloneStructValue(time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC)))
	if ($.markAsStructValue($.cloneStructValue(now)).Sub($.markAsStructValue($.cloneStructValue(setTime))) < ($.int64Mul(time.Hour, 24))) {
		$.println("expected we are > 24 hrs past may 15, incorrect")
	}

	$.println("preset time", $.markAsStructValue($.cloneStructValue(setTime)).String())
	$.println("unix", $.int($.markAsStructValue($.cloneStructValue(setTime)).Unix()))
	$.println("unix micro", $.int($.markAsStructValue($.cloneStructValue(setTime)).UnixMicro()))
	$.println("unix nano", $.int($.markAsStructValue($.cloneStructValue(setTime)).UnixNano()))
	$.println("unix milli", $.int($.markAsStructValue($.cloneStructValue(setTime)).UnixMilli()))

	// day, month, etc.
	$.println("day", $.markAsStructValue($.cloneStructValue(setTime)).Day())
	$.println("month", $.markAsStructValue($.cloneStructValue(setTime)).Month())
	$.println("january", time.January)
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
	$.println("location", time.Location.prototype.String.call($.pointerValue<time.Location>($.markAsStructValue($.cloneStructValue(setTime)).Location())))
	$.println("utc", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(setTime)).UTC())).Format("2006-01-02T15:04:05Z07:00"))
	$.println("seconds", time.Duration_Seconds(($.int64Mul(1500, time.Millisecond))))
	$.println("duration string", time.Duration_String(($.int64Mul(1500, time.Millisecond))))
	$.println("negative duration before", $.markAsStructValue($.cloneStructValue(time.Now())).After($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add($.int64Mul(-60, time.Second))))))

	let [duration, durationErr] = time.ParseDuration("1.5s")
	$.println("parsed duration", duration, durationErr == null)
	let [, badDurationErr] = time.ParseDuration("not-a-duration")
	$.println("bad duration err", badDurationErr != null)

	let timer: time.Timer | $.VarRef<time.Timer> | null = time.AfterFunc($.int("9223372036854775807", 64), $.functionValue((): void => {
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	$.println("max duration timer stopped", time.Timer.prototype.Stop.call($.pointerValue<time.Timer>(timer)))
	let maxDuration = $.int("9223372036854775807", 64)
	$.println("max duration converted", maxDuration > 0)

	let [parsed, parseErr] = time.Parse(time.RFC3339, "2025-05-15T01:10:42Z")
	$.println("parsed time", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(parsed)).UTC())).Format(time.RFC3339), parseErr == null)
	$.println("parsed nano", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(parsed)).UTC())).Format(time.RFC3339Nano))
	let [, badParseErr] = time.Parse(time.RFC3339, "not-a-time")
	$.println("bad time err", badParseErr != null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
