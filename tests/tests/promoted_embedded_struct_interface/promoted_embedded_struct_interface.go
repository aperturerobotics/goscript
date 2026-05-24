package main

type closer interface {
	Close() string
}

type stream struct {
	name string
}

func (s stream) Close() string {
	return "close:" + s.name
}

type stopStream struct {
	stream
}

func closeIt(c closer) {
	println(c.Close())
}

func main() {
	value := stopStream{stream: stream{name: "value"}}
	closeIt(value)

	ptr := &stopStream{stream: stream{name: "pointer"}}
	closeIt(ptr)
}
