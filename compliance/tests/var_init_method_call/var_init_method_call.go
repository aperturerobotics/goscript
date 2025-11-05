package main

type T struct {
	val int
}

func NewT(v int) *T {
	return &T{val: v}
}

func (t *T) WithDelta(delta int) *T {
	return &T{val: t.val + delta}
}

var (
	Base    = NewT(10)
	Derived = Base.WithDelta(5)
)

func main() {
	println("Base:", Base.val)
	println("Derived:", Derived.val)
}
