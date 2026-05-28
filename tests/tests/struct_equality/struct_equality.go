package main

type ObjectID struct {
	hash   [4]byte
	format uint8
}

type Hash = ObjectID

func (s ObjectID) IsZero() bool {
	return s == ObjectID{}
}

func (s ObjectID) Valid() bool {
	return s != ObjectID{}
}

func main() {
	var zero Hash
	otherZero := Hash{}
	one := Hash{hash: [4]byte{1: 7}}
	otherOne := Hash{hash: [4]byte{1: 7}}
	different := Hash{hash: [4]byte{2: 7}}

	println("zero is zero:", zero.IsZero())
	println("zero valid:", zero.Valid())
	println("zero equals zero:", zero == otherZero)
	println("one valid:", one.Valid())
	println("one equals other one:", one == otherOne)
	println("one differs:", one != different)
}
