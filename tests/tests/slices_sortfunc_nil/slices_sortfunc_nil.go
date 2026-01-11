package main

import "slices"

type field struct {
	name string
}

func main() {
	var fields []field
	println("fields before:", fields)

	slices.SortFunc(fields, func(a, b field) int {
		if a.name < b.name {
			return -1
		}
		if a.name > b.name {
			return 1
		}
		return 0
	})

	println("fields after:", fields)
}
