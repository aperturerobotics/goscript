package main

type Worker struct {
	ch chan int
}

func (w *Worker) lookup(network string) int {
	w.ch <- len(network)
	return <-w.ch
}

func callLookup(fn func(string) int, network string) int {
	return fn(network)
}

func syncLookup(network string) int {
	return len(network)
}

func chooseLookup(value any, worker *Worker) int {
	resolver := worker.lookup
	if alt, _ := value.(func(string) int); alt != nil {
		resolver = alt
	}
	_ = resolver
	return 2
}

func main() {
	worker := &Worker{ch: make(chan int, 1)}
	println("lookup:", chooseLookup(nil, worker))

	worker.ch <- 1
	<-worker.ch
	hook := func(fn func(string) int, network string) int {
		return fn(network)
	}
	println("hook:", hook(syncLookup, "ip"))
	close(worker.ch)
}
