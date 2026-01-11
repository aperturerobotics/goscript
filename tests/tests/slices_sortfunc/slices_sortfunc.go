package main

import "slices"

type Person struct {
	Name string
	Age  int
}

func main() {
	people := []Person{
		{Name: "Charlie", Age: 30},
		{Name: "Alice", Age: 25},
		{Name: "Bob", Age: 35},
	}

	slices.SortFunc(people, func(a, b Person) int {
		if a.Age < b.Age {
			return -1
		}
		if a.Age > b.Age {
			return 1
		}
		return 0
	})

	for _, p := range people {
		println(p.Name, p.Age)
	}
}
