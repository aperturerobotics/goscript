// Generated file based on package_import_sort.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sort from "@goscript/sort/index.js"

export async function main(): Promise<void> {
	// Test basic slice sorting
	let ints = $.arrayToSlice<number>([3, 1, 4, 1, 5, 9])
	$.println("Original ints:", ints![0], ints![1], ints![2], ints![3], ints![4], ints![5])
	sort.Ints(ints)
	$.println("Sorted ints:", ints![0], ints![1], ints![2], ints![3], ints![4], ints![5])

	// Test if sorted
	let isSorted = sort.IntsAreSorted(ints)
	$.println("Ints are sorted:", isSorted)

	// Test string sorting
	let strings = $.arrayToSlice<string>(["banana", "apple", "cherry"])
	$.println("Original strings:", strings![0], strings![1], strings![2])
	sort.Strings(strings)
	$.println("Sorted strings:", strings![0], strings![1], strings![2])

	// Test if strings are sorted
	let stringSorted = sort.StringsAreSorted(strings)
	$.println("Strings are sorted:", stringSorted)

	// Test float64 sorting
	let floats = $.arrayToSlice<number>([3.14, 2.71, 1.41])
	$.println("Original floats:", floats![0], floats![1], floats![2])
	sort.Float64s(floats)
	$.println("Sorted floats:", floats![0], floats![1], floats![2])

	// Test if floats are sorted
	let floatSorted = sort.Float64sAreSorted(floats)
	$.println("Floats are sorted:", floatSorted)

	// Test search functions
	let intIndex = sort.SearchInts(ints, 4)
	$.println("Index of 4 in sorted ints:", intIndex)

	let stringIndex = sort.SearchStrings(strings, "banana")
	$.println("Index of 'banana' in sorted strings:", stringIndex)

	let floatIndex = sort.SearchFloat64s(floats, 2.71)
	$.println("Index of 2.71 in sorted floats:", floatIndex)

	// Test generic Search function
	let searchResult = sort.Search($.len(ints), (i: number): boolean => {
		return ints![i] >= 5
	})
	$.println("First index where value >= 5:", searchResult)

	// Test Slice function with custom comparator
	let testSlice = $.arrayToSlice<number>([5, 2, 8, 1, 9])
	sort.Slice(testSlice, (i: number, j: number): boolean => {
		return testSlice![i] < testSlice![j]
	})
	$.println("Custom sorted slice:", testSlice![0], testSlice![1], testSlice![2], testSlice![3], testSlice![4])

	// Test SliceIsSorted
	let isSliceSorted = sort.SliceIsSorted(testSlice, (i: number, j: number): boolean => {
		return testSlice![i] < testSlice![j]
	})
	$.println("Custom slice is sorted:", isSliceSorted)

	$.println("test finished")
}

