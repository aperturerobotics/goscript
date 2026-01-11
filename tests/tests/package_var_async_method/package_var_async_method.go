package main

import (
	"sync"
)

var cache sync.Map

// This function calls an async method on a package-level variable
func getValueFromCache(key string) (interface{}, bool) {
	return cache.Load(key)
}

func main() {
	cache.Store("hello", "world")

	val, ok := getValueFromCache("hello")
	if ok {
		println("Found:", val.(string))
	}
}
