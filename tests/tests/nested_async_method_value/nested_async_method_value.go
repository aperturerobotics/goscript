package main

type Worker struct {
	ch chan int
}

type Spawner interface {
	Spawn() error
}

func (w *Worker) Spawn() error {
	go func() {
		<-w.ch
	}()
	return nil
}

func run(fn func() error) {
	err := fn()
	if err == nil {
		println("func value err: nil")
	} else {
		println("func value err: non-nil")
	}
}

func main() {
	w := &Worker{ch: make(chan int, 1)}
	run(w.Spawn)

	var s Spawner = w
	err := s.Spawn()
	if err == nil {
		println("iface err: nil")
	} else {
		println("iface err: non-nil")
	}
	w.ch <- 1
}
