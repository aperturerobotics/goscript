package main

func main() {
	c := make(chan int, 1)
	c <- 0
	close(c)

	for x := range c {
		println(x)
	}

	// test with = instead of := within the for range
	c = make(chan int, 1)
	c <- 1
	close(c)

	var y int
	for y = range c {
		println(y)
	}
}
