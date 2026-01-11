package main

type Thing struct {
	value int
}

func getFunc() func(*Thing, int) {
	return func(t *Thing, x int) {
		t.value += x
	}
}

// Use channels to make this async
func (t *Thing) callIt(x int) {
	done := make(chan struct{})
	go func() {
		getFunc()(t, x)
		close(done)
	}()
	<-done
}

func main() {
	thing := &Thing{value: 10}
	thing.callIt(32)
	println("Result:", thing.value)
}
