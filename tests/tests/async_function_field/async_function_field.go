package main

import "sync"

var cache sync.Map

type loader struct {
	load func(string) (any, bool)
}

func (l *loader) getLoad() func(string) (any, bool) {
	return l.load
}

var defaultLoader = &loader{
	load: func(key string) (any, bool) {
		return cache.Load(key)
	},
}

func lookup(key string) (any, bool) {
	return defaultLoader.load(key)
}

func lookupViaGetter(key string) (any, bool) {
	return defaultLoader.getLoad()(key)
}

func main() {
	cache.Store("answer", 42)
	value, ok := lookup("answer")
	if ok {
		println("value:", value.(int))
	}
	getterValue, getterOk := lookupViaGetter("answer")
	if getterOk {
		println("getter value:", getterValue.(int))
	}
}
