package main

import (
	"reflect"
	"unsafe"
)

func main() {
	buf := []byte{1, 2, 3, 4}
	bytes := reflect.SliceAt(reflect.TypeFor[byte](), unsafe.Pointer(&buf[1]), 2)
	println("bytes:", bytes.Len(), bytes.Cap(), bytes.Index(0).Uint(), bytes.Index(1).Uint())
	bytes.Index(0).SetUint(9)
	bytes.Index(1).SetUint(8)
	println("buf:", buf[0], buf[1], buf[2], buf[3])

	ints := []int{10, 20, 30, 40}
	intSlice := reflect.SliceAt(reflect.TypeFor[int](), unsafe.Pointer(&ints[1]), 2)
	intSlice.Index(1).SetInt(77)
	println("ints:", ints[0], ints[1], ints[2], ints[3], intSlice.Len(), intSlice.Cap())

	empty := reflect.SliceAt(reflect.TypeFor[int](), unsafe.Pointer((*int)(nil)), 0)
	println("empty:", empty.IsNil(), empty.Len(), empty.Cap())

	println("reflect_slice_at test finished")
}
