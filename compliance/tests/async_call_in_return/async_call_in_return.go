package main

import (
	"sync"
)

var cache sync.Map

func getFromCache(key string) (interface{}, bool) {
	val, ok := cache.Load(key)
	return val, ok
}

func getFromCacheInline(key string) (interface{}, bool) {
	return cache.Load(key)
}

func main() {
	cache.Store("test", 42)

	val1, ok1 := getFromCache("test")
	if ok1 {
		println("getFromCache found:", val1.(int))
	}

	val2, ok2 := getFromCacheInline("test")
	if ok2 {
		println("getFromCacheInline found:", val2.(int))
	}

	_, ok3 := getFromCache("missing")
	if !ok3 {
		println("Not found as expected")
	}
}
