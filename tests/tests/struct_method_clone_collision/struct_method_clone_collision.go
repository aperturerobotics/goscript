package main

type Box struct {
	Value int
}

func (b *Box) clone() *Box {
	return &Box{Value: b.Value + 1}
}

func copyBox(b Box) Box {
	return b
}

func main() {
	original := Box{Value: 1}
	copied := copyBox(original)
	original.Value = 3
	methodCopy := (&original).clone()
	println("copied:", copied.Value)
	println("method:", methodCopy.Value)
}
