package main

import (
	"reflect"
	"unsafe"
)

func stringBytes(s string) (b []byte) {
	strh := (*reflect.StringHeader)(unsafe.Pointer(&s))
	sh := (*reflect.SliceHeader)(unsafe.Pointer(&b))
	sh.Data = strh.Data
	sh.Len = strh.Len
	sh.Cap = strh.Len
	return b
}

func main() {
	b := stringBytes("abc")
	println(len(b), cap(b), b[0], b[1], b[2])
}
