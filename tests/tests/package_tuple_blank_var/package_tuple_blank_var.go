package main

type item struct {
	value int
}

func newItem(value int) (*item, error) {
	return &item{value: value}, nil
}

var (
	first, _  = newItem(11)
	second, _ = newItem(13)
)

func main() {
	println(first.value + second.value)
}
