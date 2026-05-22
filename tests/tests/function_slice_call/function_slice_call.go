package main

func main() {
	var callbacks []func(int) int
	callbacks = append(callbacks, func(value int) int {
		return value + 1
	})
	value := callbacks[0](2)
	println("value:", value)
}
