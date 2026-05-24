package main

import "unsafe"

type shadow [4]byte

func main() {
	buf := []byte{9, 1, 2, 3, 4}
	ptr := (*[4]byte)(unsafe.Pointer(&buf[1]))
	view := ptr[:]
	println(len(view), view[0], view[3])
	ptr[2] = 7
	println(buf[3])

	var shadow [4]byte
	fill(&shadow)
	shadowView := shadow[:]
	println(len(shadowView), shadowView[0], shadowView[3])
}

func fill(out *[4]byte) {
	out[0] = 5
	out[3] = 8
}
