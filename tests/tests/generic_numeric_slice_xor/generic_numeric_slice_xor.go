package main

func xorLoop[T byte | uintptr](dst, x, y []T) {
	x = x[:len(dst)]
	y = y[:len(dst)]
	for i := range dst {
		dst[i] = x[i] ^ y[i]
	}
}

func main() {
	dst := []byte{0, 0}
	xorLoop(dst, []byte{1, 3}, []byte{2, 1})
	println(dst[0], dst[1])
}
