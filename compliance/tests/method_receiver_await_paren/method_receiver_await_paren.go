package main

type Thing struct {
	value int
}

func getFunc() func(*Thing, int) {
	return func(t *Thing, x int) {
		t.value += x
	}
}

func (t *Thing) callIt(x int) {
	done := make(chan func(*Thing, int))
	go func() {
		done <- getFunc()
		close(done)
	}()
	fn := <-done
	fn(t, x)
}

func main() {
	thing := &Thing{value: 10}
	thing.callIt(32)
	println("Result:", thing.value)
}
