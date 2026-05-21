package main

func main() {
	type result struct {
		value int
	}

	ch := make(chan result, 1)
	ch <- result{value: 7}
	got := <-ch
	println(got.value)
}
