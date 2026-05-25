package main

func wrap(fn func() int, ch chan int) func() int {
	return func() int {
		return <-ch
	}
}

func main() {
	ch := make(chan int, 1)
	fn := func() int {
		return 1
	}
	fn = wrap(fn, ch)
	ch <- 9
	println(fn())
}
