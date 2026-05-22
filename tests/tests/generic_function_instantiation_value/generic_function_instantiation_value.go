package main

func identity[T any](value T) T {
	return value
}

func main() {
	fn := identity[int]
	println(fn(7))
}
