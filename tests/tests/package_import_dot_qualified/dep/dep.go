package dep

var Value = 5

type Box struct {
	N int
}

func Double(v int) int {
	return v * 2
}

func NewBox(n int) Box {
	return Box{N: n}
}
