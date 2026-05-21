package main

import "sync"

var cache sync.Map

type loader struct {
	load func(string) (any, bool)
}

var defaultLoader = &loader{
	load: func(key string) (any, bool) {
		return cache.Load(key)
	},
}

func lookup(key string) (any, bool) {
	return defaultLoader.load(key)
}

func main() {
	cache.Store("answer", 42)
	value, ok := lookup("answer")
	if ok {
		println("value:", value.(int))
	}
}
