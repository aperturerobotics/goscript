package main

type Hash [4]byte

func (h Hash) Valid() bool {
	return h != Hash{}
}

func main() {
	var zero Hash
	one := Hash{1: 7}
	other := Hash{1: 7}
	different := Hash{2: 7}

	println("zero valid:", zero.Valid())
	println("one valid:", one.Valid())
	println("same:", one == other)
	println("different:", one == different)
}
