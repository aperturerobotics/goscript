package main

type entry struct {
	value int
}

func (e *entry) add(value int) {
	e.value += value
}

var box struct {
	table [2]entry
}

func entries() *[2]entry {
	return &box.table
}

func main() {
	table := entries()
	table[0].add(5)
	println(table[0].value)
}
