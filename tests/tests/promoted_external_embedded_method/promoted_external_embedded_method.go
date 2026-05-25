package main

import "sync"

type raw struct {
	sync.Mutex
}

type outer struct {
	raw
}

type rawRW struct {
	sync.RWMutex
}

type outerRW struct {
	rawRW
}

func main() {
	var o outer
	o.Lock()
	o.Unlock()

	var rw outerRW
	rw.RLock()
	rw.RUnlock()
	locker := rw.RLocker()
	locker.Lock()
	locker.Unlock()

	println("ok")
}
