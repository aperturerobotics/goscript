package main

import "unsafe"

var table = [4]byte{1, 2, 3, 4}

func acceptMatrix(*[2][2]byte) {
}

func main() {
	ptr := unsafe.Pointer(&table)
	bytes := (*[4]byte)(ptr)
	println((*bytes)[2])

	ptr = unsafe.Pointer(&table)
	acceptMatrix((*[2][2]byte)(ptr))
}
