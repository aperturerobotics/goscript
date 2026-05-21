package main

import "unsafe"

func writeBytes(words []uint64, bytes []byte) {
	for i, b := range bytes {
		*(*uint8)(unsafe.Pointer(uintptr(unsafe.Pointer(&words[0])) + uintptr(i))) = b
	}
}

func main() {
	println("unsafe pointer storage compiles")
}
