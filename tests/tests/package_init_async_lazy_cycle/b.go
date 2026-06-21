package main

import "sync"

var lock sync.Mutex
var first = makeFirst()

func makeFirst() holder {
	lock.Lock()
	defer lock.Unlock()
	return holder{n: seed}
}
