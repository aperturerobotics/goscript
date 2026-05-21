package main

import "io"

type fixedReader struct {
	data []byte
}

func (r *fixedReader) Read(p []byte) (int, error) {
	n := copy(p, r.data)
	r.data = r.data[n:]
	return n, nil
}

func main() {
	buf := make([]byte, 2)
	n, err := io.ReadFull(&fixedReader{data: []byte("abc")}, buf)
	println("read:", n, string(buf), err == nil)
}
