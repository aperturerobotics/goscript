package main

type nistPoint[T any] interface {
	Add(T, T) T
}

type nistCurve[Point nistPoint[Point]] struct{}

func (curve *nistCurve[Point]) Add(p1, p2 Point) Point {
	return p1.Add(p1, p2)
}

func (curve *nistCurve[Point]) Zero() (p Point) {
	return p
}

type point struct {
	N int
}

func (p *point) Add(a, b *point) *point {
	return &point{N: a.N + b.N}
}

var curve = &nistCurve[*point]{}

func main() {
	p := curve.Add(&point{N: 2}, &point{N: 3})
	println("sum:", p.N)
	if curve.Zero() == nil {
		println("zero")
	}
}
