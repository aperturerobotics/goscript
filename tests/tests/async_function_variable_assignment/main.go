package main

func main() {
	type result struct {
		value int
	}

	ch := make(chan result, 1)
	var fn func() result
	fn = func() result {
		return <-ch
	}
	ch <- result{value: 8}
	got := fn()
	println(got.value)
}
