package main

type ref interface {
	Key() any
}

type valueHash [4]byte

func (h valueHash) Key() any {
	return h
}

func sameKey(a, b ref) bool {
	return a.Key() == b.Key()
}

func differentKey(a, b ref) bool {
	return a.Key() != b.Key()
}

func main() {
	a := valueHash{1: 7}
	b := valueHash{1: 7}
	c := valueHash{2: 7}

	println("same:", sameKey(a, b))
	println("different:", differentKey(a, c))
}
