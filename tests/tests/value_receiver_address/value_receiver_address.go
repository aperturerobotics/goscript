package main

type Counter struct {
	value int
}

func (c *Counter) Value() int {
	return c.value
}

func (c Counter) PointerAfterIncrement() *Counter {
	c.value++
	return &c
}

func main() {
	original := Counter{value: 10}
	pointerFromValue := original.PointerAfterIncrement()

	println("Value receiver pointer value:", pointerFromValue.Value())
	println("Original after PointerAfterIncrement:", original.Value())
}
