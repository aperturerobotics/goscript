package main

type Buffer struct {
	data []byte
}

func (b *Buffer) Write(p []byte) (int, error) {
	b.data = append(b.data, p...)
	return len(p), nil
}

func main() {
	var b Buffer
	Use(&b)
	println(string(b.data))
}
