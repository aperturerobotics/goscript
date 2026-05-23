package main

func wrap(fn func()) func() {
	return func() {
		fn()
		println("wrapped")
	}
}

func main() {
	ch := make(chan struct{})
	go func() {
		ch <- struct{}{}
	}()
	wrapped := wrap(func() {
		<-ch
		println("fn")
	})
	wrapped()
	println("done")
}
