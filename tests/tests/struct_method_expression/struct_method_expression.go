package main

type worker struct {
	base int
}

func (w *worker) add(v int) int {
	return w.base + v
}

func main() {
	fn := (*worker).add
	println("method expr:", fn(&worker{base: 5}, 7))
}
