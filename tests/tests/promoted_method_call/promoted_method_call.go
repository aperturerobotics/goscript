package main

type base struct {
	value int
}

func (b *base) Add(n int) int {
	return b.value + n
}

type wrapper struct {
	base
}

func main() {
	w := &wrapper{base: base{value: 3}}
	println(w.Add(4))

	add := w.Add
	println(add(5))
}
