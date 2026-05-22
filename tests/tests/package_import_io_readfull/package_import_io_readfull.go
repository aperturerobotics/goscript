package main

import (
	"bytes"
	"io"
)

type fixedReader struct {
	data []byte
	size int
}

func (r *fixedReader) Read(p []byte) (int, error) {
	if len(r.data) == 0 {
		return 0, io.EOF
	}
	if r.size > 0 && len(p) > r.size {
		p = p[:r.size]
	}
	n := copy(p, r.data)
	r.data = r.data[n:]
	return n, nil
}

func main() {
	buf := make([]byte, 2)
	n, err := io.ReadFull(&fixedReader{data: []byte("abc")}, buf)
	println("read:", n, string(buf), err == nil)
	n, err = io.ReadFull(bytes.NewReader(nil), buf)
	println("empty:", n, err == io.EOF)
	n, err = io.ReadFull(bytes.NewReader([]byte("x")), buf)
	println("short:", n, string(buf[:1]), err == io.ErrUnexpectedEOF)
	all, err := io.ReadAll(&fixedReader{data: []byte("abcDEFghi"), size: 3})
	println("readall:", string(all), err == nil)
}
