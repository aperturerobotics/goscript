package main

type Adder interface {
	Add(value int) int
}

type Box struct {
	Adder
}

type Counter struct {
	base int
}

func (c *Counter) Add(value int) int {
	return c.base + value
}

func call(adder Adder) int {
	return adder.Add(4)
}

func main() {
	box := &Box{Adder: &Counter{base: 3}}
	println(box.Add(5))
	println(call(box))
}
