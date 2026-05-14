package main

type coder struct {
	ch chan int
}

type decoder coder

func (d *decoder) next() {
	<-d.ch
}

func (d *decoder) value(n int) {
	for range n {
		d.value(0)
	}

	d.next()
}

func main() {
	d := &decoder{ch: make(chan int, 2)}
	d.ch <- 1
	d.ch <- 2
	d.value(1)
	println("ok")
}
