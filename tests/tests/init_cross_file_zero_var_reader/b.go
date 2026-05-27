package main

var registry = make(map[int]int)
var counter uint64
var shared int

func readTable() {
	counter++
	remoteCounter++
	shared = 7
	ptr := &shared
	println(len(table), len(registry), counter, remoteCounter, *ptr, stringType != nil)
}

func main() {}
