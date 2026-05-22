package main

import (
	"maps"
	"slices"
)

func getValue() (string, int) {
	return "test", 42
}

// Simple iterator function that mimics maps.All behavior
func simpleIterator(m map[string]int) func(func(string, int) bool) {
	return func(yield func(string, int) bool) {
		for k, v := range m {
			if !yield(k, v) {
				break
			}
		}
	}
}

func main() {
	// Create a map to test with
	m := map[string]int{
		"a": 1,
		"b": 2,
		"c": 3,
	}

	// Collect results in a slice to ensure deterministic output
	var results []string

	// Test maps.All which returns an iterator function (this tests the maps package import)
	for k, v := range maps.All(m) {
		// Simple assignment that should trigger the error
		x, y := getValue()
		result := k + x + string(rune(v+y))
		results = append(results, result)
	}

	// Also test simpleIterator to ensure our local iterator works
	for k, v := range simpleIterator(m) {
		x, y := getValue()
		result := k + x + string(rune(v+y)) + "_local"
		results = append(results, result)
	}

	// Sort results for deterministic output
	slices.Sort(results)

	// Print sorted results
	for _, result := range results {
		println("Result:", result)
	}

	dst := map[string]int{"base": 1}
	src := map[string]int{"copied": 2}
	maps.Copy(dst, src)
	var nilSrc map[string]int
	maps.Copy(dst, nilSrc)
	println("Copy result:", dst["base"], dst["copied"], len(dst))
	cloned := maps.Clone(dst)
	var nilMap map[string]int
	println("Clone result:", cloned["base"], cloned["copied"], maps.Clone(nilMap) == nil)

	println("test finished")
}
