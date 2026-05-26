package main

import (
	"reflect"
	"unsafe"
)

type localSliceHeader struct {
	s   string
	cap int
}

func stringBytes(s string) (b []byte) {
	strh := (*reflect.StringHeader)(unsafe.Pointer(&s))
	sh := (*reflect.SliceHeader)(unsafe.Pointer(&b))
	sh.Data = strh.Data
	sh.Len = strh.Len
	sh.Cap = strh.Len
	return b
}

func localStringBytes(s string) []byte {
	return *(*[]byte)(unsafe.Pointer(&localSliceHeader{s, len(s)}))
}

func main() {
	b := stringBytes("abc")
	println(len(b), cap(b), b[0], b[1], b[2])
	local := localStringBytes("wxyz")
	println(len(local), cap(local), local[0], local[3])
}
