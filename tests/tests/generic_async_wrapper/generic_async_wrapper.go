package main

func inner[T any](ch chan T) T {
	return <-ch
}

func outer[T any](ch chan T) T {
	return inner[T](ch)
}

func main() {
	ch := make(chan int, 1)
	ch <- 7
	println("value:", outer[int](ch))
}
