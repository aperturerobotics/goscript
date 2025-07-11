package main

func main() {
	c := make(chan int, 1)
	c <- 0
	close(c)

	for x := range c {
		println(x)
	}
}
