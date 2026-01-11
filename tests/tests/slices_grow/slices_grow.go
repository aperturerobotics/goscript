package main

import "slices"

func main() {
	s := []int{1, 2, 3}
	println("Before Grow: len=", len(s), "cap=", cap(s))
	s = slices.Grow(s, 5)
	println("After Grow: len=", len(s), "cap=", cap(s))
	println("slices.Grow test finished")
}
