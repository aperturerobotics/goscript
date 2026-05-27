package main

import (
	"crypto/sha1"
	"hash"
)

func main() {
	sum := sha1.Sum([]byte("abc"))
	println("sum len", len(sum))
	println("sum first", sum[0])
	println("sum last", sum[19])

	var h hash.Hash = sha1.New()
	n, err := h.Write([]byte("a"))
	println("write a", n, err == nil)
	n, err = h.Write([]byte("bc"))
	println("write bc", n, err == nil)
	stream := h.Sum([]byte{1, 2})
	println("stream len", len(stream))
	println("stream prefix", stream[0], stream[1])
	println("stream digest", stream[2], stream[21])
}
