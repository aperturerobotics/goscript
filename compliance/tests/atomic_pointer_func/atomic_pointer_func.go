package main

import "sync/atomic"

func getLock() (func(), error) {
	return func() {
		println("lock released")
	}, nil
}

func main() {
	var rel atomic.Pointer[func()]
	release, _ := getLock()
	rel.Store(&release)
	
	loaded := rel.Load()
	if loaded != nil {
		(*loaded)()
	}
	println("done")
}
