package main

type Thing struct {
	value int
}

func getValue() func(*Thing) int {
	return func(t *Thing) int {
		return t.value
	}
}

func (t *Thing) callFunc() int {
	return getValue()(t)
}

func main() {
	t := &Thing{value: 42}
	result := t.callFunc()
	println("Result:", result)
}
