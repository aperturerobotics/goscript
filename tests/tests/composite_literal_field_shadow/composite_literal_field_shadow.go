package main

type buffer struct {
	buf []byte
}

func newBuffer(data []byte) *buffer {
	buf := &buffer{buf: data}
	return buf
}

func main() {
	buf := newBuffer([]byte{7})
	println(buf.buf[0])
}
