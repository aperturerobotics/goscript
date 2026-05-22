package main

import "maps"

func main() {
	var m map[string]int
	count := 0
	for range maps.Keys(m) {
		count++
	}
	println("keys:", count)
}
