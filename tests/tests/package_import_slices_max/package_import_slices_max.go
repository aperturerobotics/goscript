package main

import "slices"

func main() {
	println("max int:", slices.Max([]int{3, 1, 4, 2}))
	println("max string:", slices.Max([]string{"beta", "alpha", "gamma"}))
}
