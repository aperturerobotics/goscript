package main

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
}
