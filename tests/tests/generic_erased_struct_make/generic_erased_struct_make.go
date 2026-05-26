package main

type queue[T any] struct {
	buf []T
}

func newQueue[T any](capacity int) *queue[T] {
	return &queue[T]{buf: make([]T, capacity)}
}

func main() {
	q := newQueue[int](2)
	q.buf[0] = 7
	println(len(q.buf), q.buf[0])
}
