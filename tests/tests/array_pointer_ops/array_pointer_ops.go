package main

func fillArray(dst *[4]byte) {
	for i := range dst {
		dst[i] = byte(i + 1)
	}
}

func sumArray(src *[4]byte) int {
	sum := 0
	for _, v := range src {
		sum += int(v)
	}
	return sum
}

func main() {
	var buckets [2][3]uint64
	cache := &buckets[1]

	println("len:", len(cache))

	cache[0] = 5
	cache[1] = 7
	println("index:", cache[0], cache[1])

	for i, x := range cache {
		println("range:", i, x)
	}

	view := cache[:]
	println("slice:", len(view), view[2])

	buf := []byte{9, 0, 0, 0, 0}
	fillArray((*[4]byte)(buf[1:]))
	println("converted:", buf[0], buf[1], buf[2], buf[3], buf[4])
	println("converted sum:", sumArray((*[4]byte)(buf[1:])))
}
