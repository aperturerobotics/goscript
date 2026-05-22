package main

type item struct {
	n int
}

func (s item) dec() item {
	if s.n > 0 {
		s = item{n: s.n - 1}
	}
	return s
}

func main() {
	original := item{n: 2}
	out := original.dec()
	println("original:", original.n)
	println("out:", out.n)
}
