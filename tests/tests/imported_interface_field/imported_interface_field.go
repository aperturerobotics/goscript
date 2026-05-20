package main

import "io"

type holder struct {
	w io.Writer
}

func newHolder(w io.Writer) *holder {
	return &holder{w: w}
}

func main() {
	h := newHolder(nil)
	if h.w == nil {
		println("nil writer")
		return
	}
	println("writer present")
}
