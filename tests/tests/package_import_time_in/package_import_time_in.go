package main

import "time"

func main() {
	utc := time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC)
	pdt := time.FixedZone("PDT", -7*60*60)

	println("in pdt:", utc.In(pdt).Format(time.RFC3339))
}
