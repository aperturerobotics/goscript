package main

import "unsafe"

type sourceStruct struct {
	flag bool
	data []uint
}

type viewStruct struct {
	flag bool
	data []uint
}

func noescape(p unsafe.Pointer) unsafe.Pointer {
	x := uintptr(p)
	return unsafe.Pointer(x ^ 0)
}

func inlineSlice(values []uint) []uint {
	return (*[2]uint)(noescape(unsafe.Pointer(&values[0])))[:]
}

func markThroughView(src *sourceStruct) bool {
	(*viewStruct)(unsafe.Pointer(src)).flag = true
	return (*viewStruct)(unsafe.Pointer(src)).flag
}

func main() {
	values := []uint{1, 2}
	p := unsafe.Pointer(&values[1])
	q := noescape(p)

	println("same:", q == p)
	println("nil:", q == nil)

	inline := inlineSlice(values)
	println("inline:", inline[0], inline[1])
	inline[0] = 9
	println("updated:", values[0])

	var src sourceStruct
	println("struct:", markThroughView(&src), src.flag)
}
