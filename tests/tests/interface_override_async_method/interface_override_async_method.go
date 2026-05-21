package main

import "io"

type asyncReader struct {
	ch chan int
}

func (r asyncReader) Read(b []byte) (int, error) {
	r.ch <- len(b)
	return <-r.ch, nil
}

var Reader io.Reader = asyncReader{ch: make(chan int, 1)}

func main() {
	if Reader == nil {
		println(0)
		return
	}
	println(3)
}
