package main

func main() {
	ch := make(chan string, 15)
	for i := 0; i < 10; i++ {
		println("Hello", i)
		ch <- "testing"
	}
	close(ch)
	for val := range ch {
		println("from ch", val)
	}
}
