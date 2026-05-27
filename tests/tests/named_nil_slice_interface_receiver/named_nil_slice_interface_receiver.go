package main

type sizer interface {
	Len() int
}

type bytesEncoder []byte

func (b bytesEncoder) Len() int {
	return len(b)
}

func main() {
	var b bytesEncoder
	var s sizer = b
	println(s.Len())
}
