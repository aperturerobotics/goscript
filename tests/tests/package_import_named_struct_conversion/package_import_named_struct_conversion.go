package main

import "time"

type LocalTime time.Time

func asTime(t LocalTime) time.Time {
	return time.Time(t)
}

func asLocal(t time.Time) LocalTime {
	return LocalTime(t)
}

func main() {
	first := LocalTime(time.Unix(11, 0).UTC())
	println("as time:", asTime(first).Unix())

	second := asLocal(time.Unix(22, 0).UTC())
	println("as local:", time.Time(second).Unix())
}
