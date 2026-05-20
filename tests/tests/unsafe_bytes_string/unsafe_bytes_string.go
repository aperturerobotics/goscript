package main

import "unsafe"

func bytesAsString() string {
	b := []byte("123")
	return *(*string)(unsafe.Pointer(&b))
}

func main() {
	println(bytesAsString())
}
