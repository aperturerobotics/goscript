package main

func main() {
	var value int64 = 3
	delta := -5
	value += int64(delta)
	println("int64-add", value)

	value -= int64(-2)
	println("int64-sub", value)

	value *= int64(-3)
	println("int64-mul", value)
}
