package main

type Map struct {
	values map[string]int
}

func main() {
	m := Map{values: map[string]int{"one": 1}}
	got, ok := m.values["one"]
	println(got, ok)
}
