package main

type Writer interface {
	Write([]byte) (int, error)
}

type Buffer struct {
	data []byte
}

func (b *Buffer) Write(p []byte) (int, error) {
	b.data = append(b.data, p...)
	return len(p), nil
}

func use(w Writer) {
	_, _ = w.Write([]byte("x"))
}

func main() {
	var b Buffer
	use(&b)
	println(string(b.data))
}
