package main

import "time"

func main() {
	now := time.Now()
	setTime := time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC)
	if now.Sub(setTime) < time.Hour*24 {
		println("expected we are > 24 hrs past may 15, incorrect")
	}

	println("preset time", setTime.String())
	println("unix", setTime.Unix())
	println("unix micro", setTime.UnixMicro())
	println("unix nano", setTime.UnixNano())
	println("unix milli", setTime.UnixMilli())

	// day, month, etc.
	println("day", setTime.Day())
	println("month", setTime.Month())
	println("year", setTime.Year())
	println("hour", setTime.Hour())
	println("minute", setTime.Minute())
	println("second", setTime.Second())
	println("nanosecond", setTime.Nanosecond())

	// other functions on setTime
	println("weekday", setTime.Weekday().String())
	println("location", setTime.Location().String())
	println("utc", setTime.UTC().Format("2006-01-02T15:04:05Z07:00"))
	println("seconds", (1500 * time.Millisecond).Seconds())

	duration, durationErr := time.ParseDuration("1.5s")
	println("parsed duration", duration, durationErr == nil)
	_, badDurationErr := time.ParseDuration("not-a-duration")
	println("bad duration err", badDurationErr != nil)

	parsed, parseErr := time.Parse(time.RFC3339, "2025-05-15T01:10:42Z")
	println("parsed time", parsed.UTC().Format(time.RFC3339), parseErr == nil)
	_, badParseErr := time.Parse(time.RFC3339, "not-a-time")
	println("bad time err", badParseErr != nil)
}
