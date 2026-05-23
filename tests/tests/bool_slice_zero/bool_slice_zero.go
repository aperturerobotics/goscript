package main

func main() {
	values := make([]bool, 3)
	println(values[0], values[1], values[2])
	values[1] = true
	println(values[0], values[1], values[2])
}
