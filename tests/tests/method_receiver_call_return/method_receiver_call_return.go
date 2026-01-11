package main

type Thing struct {
	value int
}

func getFunc() func(*Thing, int) int {
	return func(t *Thing, x int) int {
		return t.value + x
	}
}

func (t *Thing) callIt(x int) int {
	return getFunc()(t, x)
}

func main() {
	thing := &Thing{value: 10}
	result := thing.callIt(32)
	println("Result:", result)
}
