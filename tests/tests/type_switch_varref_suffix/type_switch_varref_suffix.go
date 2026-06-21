package main

type node interface {
	value() int
}

type branch struct {
	n int
}

func (b *branch) value() int {
	return b.n
}

func accept(b *branch) int {
	return b.n
}

func main() {
	var v node = &branch{n: 3}
	switch e := v.(type) {
	case *branch:
		imprecise := 0
		ptr := &imprecise
		*ptr = 4
		println("branch", accept(e), imprecise)
	default:
		println("other")
	}
}
