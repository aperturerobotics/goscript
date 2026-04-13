package main

import "strings"

func main() {
	s := []int{10, 20, 30}
	sum := 0
	for _, v := range s {
		sum += v
		println(v)
	}
	println(sum)

	arr := [3]string{"a", "b", "c"}
	var concat strings.Builder
	for _, val := range arr {
		concat.WriteString(val)
		println(val)
	}
	println(concat.String())

	// Test with blank identifier for value (should still iterate)
	println("Ranging with blank identifier for value:")
	count := 0
	for range s { // Both key and value are blank identifiers
		count++
	}
	println(count) // Should be 3
}
