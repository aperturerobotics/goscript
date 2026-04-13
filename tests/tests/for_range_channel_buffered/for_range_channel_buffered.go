package main

func main() {
	ch := make(chan string, 15)
	for i := range 10 {
		println("Hello", i)
		ch <- "testing"
	}
	close(ch)
	for val := range ch {
		println("from ch", val)
	}
}
