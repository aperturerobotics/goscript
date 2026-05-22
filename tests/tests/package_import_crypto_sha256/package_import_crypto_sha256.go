package main

import (
	"crypto/sha256"
	"hash"
)

func main() {
	sum := sha256.Sum256([]byte("abc"))
	println("sum len", len(sum))
	println("sum first", sum[0])
	println("sum last", sum[31])

	var h hash.Hash = sha256.New()
	n, err := h.Write([]byte("a"))
	println("write a", n, err == nil)
	n, err = h.Write([]byte("bc"))
	println("write bc", n, err == nil)
	stream := h.Sum([]byte{1, 2})
	println("stream len", len(stream))
	println("stream prefix", stream[0], stream[1])
	println("stream digest", stream[2], stream[33])
}
