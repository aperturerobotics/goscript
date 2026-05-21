package main

import "unsafe"

var linkinfo struct {
	Magic [2]byte
	Self  uintptr
	Sects [1]struct {
		Start unsafe.Pointer
		End   unsafe.Pointer
	}
}

func main() {
	println("magic len:", len(linkinfo.Magic))
	println("magic zero:", linkinfo.Magic[0])
	println("sects len:", len(linkinfo.Sects))
	println("pointer diff:", uintptr(linkinfo.Sects[0].End)-uintptr(linkinfo.Sects[0].Start))
	println("start nil:", linkinfo.Sects[0].Start == nil)
}
