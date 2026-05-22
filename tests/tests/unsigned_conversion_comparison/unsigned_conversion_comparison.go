package main

func beforeStart(pos int, length int) bool {
	return uint(pos-1) < uint(length)
}

func byteWrap(v int) uint8 {
	return uint8(v)
}

func main() {
	println("uint(-1) below length:", beforeStart(0, 3))
	println("uint(0) below length:", beforeStart(1, 3))
	println("uint8(-1):", byteWrap(-1))
}
