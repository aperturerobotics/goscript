package main

import "runtime"

func main() {
	var stats runtime.MemStats
	runtime.ReadMemStats(&stats)
	println(stats.Alloc >= 0)
}
