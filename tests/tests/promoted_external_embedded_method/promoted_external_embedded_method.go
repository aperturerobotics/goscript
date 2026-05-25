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

type runner interface {
	Run() string
}

type rawRunner struct {
	runner
}

type outerRunner struct {
	rawRunner
}

type runnable struct{}

func (runnable) Run() string {
	return "runner"
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

	or := outerRunner{rawRunner: rawRunner{runner: runnable{}}}
	println(or.Run())
	println("ok")
}
