package main

import (
	"sync"
	_ "unsafe"
)

type Setting struct {
	once sync.Once
}

func (s *Setting) Value() string {
	s.once.Do(func() {})
	return ""
}

//go:linkname setCallback runtime.goscriptSetCallback
func setCallback(callback func(string) func())

func newCallback(name string) func() {
	s := &Setting{}
	s.Value()
	return func() {
		println("callback:", name)
	}
}

func init() {
	setCallback(newCallback)
}

func main() {
	println("ok")
}
