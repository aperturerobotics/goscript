package main

func (b box) total() int {
	return b.base() + 1
}

func main() {
	println(box(3).total())
}
