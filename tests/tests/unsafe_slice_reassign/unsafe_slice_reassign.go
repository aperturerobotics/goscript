package main

import "unsafe"

func reslice(ptr *byte, n int) {
	s := unsafe.Slice(ptr, n)
	s = s[1:]
	_ = s
}

func main() {
	println("ok")
}
