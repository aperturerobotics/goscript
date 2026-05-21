package main

type Value interface {
	Value() int
}

type box struct {
	value int
}

func (b *box) Value() int {
	return b.value
}

func asyncBox() *box {
	ch := make(chan int, 1)
	ch <- 7
	return &box{value: <-ch}
}

func unwrap(v Value) Value {
	return v
}

func wrapNew[T Value](newValue func() T) func() Value {
	return func() Value {
		return unwrap(newValue())
	}
}

func main() {
	fn := wrapNew(asyncBox)
	println(fn().Value())
}
