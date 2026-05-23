package main

import "unsafe"

func main() {
	buf := []byte{9, 1, 2, 3, 4}
	ptr := (*[4]byte)(unsafe.Pointer(&buf[1]))
	view := ptr[:]
	println(len(view), view[0], view[3])
	ptr[2] = 7
	println(buf[3])
}
