package main

import (
	"crypto/rand"
	"io"
)

func main() {
	buf := make([]byte, 32)
	n, err := rand.Read(buf)
	println("read len", n)
	println("read err nil", err == nil)
	println("read has data", hasData(buf))

	var r io.Reader = rand.Reader
	small := make([]byte, 4)
	n, err = r.Read(small)
	println("reader len", n)
	println("reader err nil", err == nil)
	println("reader has data", hasData(small))

	token := rand.Text()
	println("text len", len(token))
	println("text alphabet", isBase32(token))
}

func hasData(buf []byte) bool {
	for _, b := range buf {
		if b != 0 {
			return true
		}
	}
	return false
}

func isBase32(token string) bool {
	for i := 0; i < len(token); i++ {
		c := token[i]
		if !((c >= 65 && c <= 90) || (c >= 50 && c <= 55)) {
			return false
		}
	}
	return true
}
