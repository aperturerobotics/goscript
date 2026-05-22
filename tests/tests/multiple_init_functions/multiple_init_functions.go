package main

var value int

func init() {
	value = 1
}

var increment = 2

func init() {
	value += increment
}

func main() {
	println("init value:", value)
}
