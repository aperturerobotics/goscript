package main

import "slices"

func main() {
	s := []int{1, 2, 3, 4, 5}

	// This should trigger the interface range issue
	// slices.All returns an iterator interface that can be ranged over
	for i, v := range slices.All(s) {
		println("index:", i, "value:", v)
	}

	cloned := slices.Clone(s)
	cloned[0] = 99
	println("clone first:", cloned[0], "original first:", s[0], "same len:", len(cloned) == len(s))
	var nilSlice []int
	println("nil clone:", slices.Clone(nilSlice) == nil)

	println("test finished")
}
