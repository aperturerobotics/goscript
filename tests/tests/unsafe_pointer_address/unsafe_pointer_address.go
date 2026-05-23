package main

import "unsafe"

func anyOverlap(x, y []byte) bool {
	return len(x) > 0 && len(y) > 0 &&
		uintptr(unsafe.Pointer(&x[0])) <= uintptr(unsafe.Pointer(&y[len(y)-1])) &&
		uintptr(unsafe.Pointer(&y[0])) <= uintptr(unsafe.Pointer(&x[len(x)-1]))
}

func sameStart(x, y []byte) bool {
	return len(x) > 0 && len(y) > 0 && &x[0] == &y[0]
}

func parenIndexValue(x []byte, i int) byte {
	return *(&(x[i]))
}

func main() {
	buf := []byte{1, 2, 3, 4}
	left := buf[1:3]
	right := buf[2:4]
	other := []byte{8, 9}

	println("overlap:", anyOverlap(left, right))
	println("separate:", anyOverlap(left, other))
	println("same:", sameStart(left, buf[1:]))
	println("different:", sameStart(left, right))
	println("paren:", parenIndexValue(buf, 2))
}
