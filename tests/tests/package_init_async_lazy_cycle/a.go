package main

type holder struct {
	n int
}

var seed = 7

func useFirst() int {
	return first.n
}

func main() {
	println("main:", useFirst())
}
