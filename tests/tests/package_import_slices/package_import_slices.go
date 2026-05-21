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

	println("equal:", slices.Equal([]int{1, 2}, []int{1, 2}), slices.Equal([]int{1}, []int{2}))
	println("equal func:", slices.EqualFunc([]int{1, 3}, []int{5, 7}, func(a, b int) bool {
		return a%2 == b%2
	}))
	println("contains:", slices.Contains(s, 3), slices.ContainsFunc(s, func(v int) bool {
		return v > 4
	}))
	inserted := slices.Insert([]int{1, 4}, 1, 2, 3)
	println("insert:", inserted[0], inserted[1], inserted[2], inserted[3])
	slices.Reverse(inserted)
	println("reverse:", inserted[0], inserted[1], inserted[2], inserted[3])

	type item struct {
		group int
		label string
	}
	stable := []item{{2, "a"}, {1, "b"}, {2, "c"}, {1, "d"}}
	slices.SortStableFunc(stable, func(a, b item) int {
		return a.group - b.group
	})
	println("stable:", stable[0].label, stable[1].label, stable[2].label, stable[3].label)

	filtered := slices.DeleteFunc([]int{1, 2, 3, 4, 5}, func(v int) bool {
		return v%2 == 0
	})
	println("delete func:", filtered[0], filtered[1], filtered[2], len(filtered))

	println("test finished")
}
