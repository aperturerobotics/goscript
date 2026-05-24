// Generated file based on slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// --- Original Tests ---
	$.println("--- Original Tests ---")
	// Create a slice of integers with length 5 and capacity 10
	let s: $.Slice<number> = $.makeSlice<number>(5, 10, "number")
	$.println($.len(s))
	$.println($.cap(s))

	// Create a slice of strings with length 3
	let s2: $.Slice<string> = $.makeSlice<string>(3, undefined, "string")
	$.println($.len(s2))
	$.println($.cap(s2))

	// Assign values
	s![0] = 10
	s![4] = 20
	s2![1] = "hello"

	$.println(s![0])
	$.println(s![4])
	$.println(s2![1])

	// --- New Tests ---
	$.println("--- New Tests ---")

	// Create slice from array literal
	let arrLit = [1, 2, 3, 4, 5]
	let sliceFromLit: $.Slice<number> = $.goSlice(arrLit, undefined, undefined)
	$.println($.len(sliceFromLit))
	$.println($.cap(sliceFromLit))
	$.println(sliceFromLit![0])
	$.println(sliceFromLit![4])

	// Create slice from array variable
	let arrVar = ["a", "b", "c", "d"]
	let sliceFromVar: $.Slice<string> = $.goSlice(arrVar, undefined, undefined)
	$.println($.len(sliceFromVar))
	$.println($.cap(sliceFromVar))
	$.println(sliceFromVar![0])
	$.println(sliceFromVar![3])

	// Create slice with specific indices
	let sliceIndices: $.Slice<string> = $.goSlice(arrVar, 1, 3)
	$.println($.len(sliceIndices))
	$.println($.cap(sliceIndices))
	$.println(sliceIndices![0])
	$.println(sliceIndices![1])

	// Create slice with 0 len/cap and append
	$.println("--- Zero len/cap append ---")
	let zeroSlice: $.Slice<number> = $.makeSlice<number>(0, 0, "number")
	$.println($.len(zeroSlice))
	$.println($.cap(zeroSlice))
	zeroSlice = $.append(zeroSlice, 100)
	$.println($.len(zeroSlice))
	$.println($.cap(zeroSlice))
	$.println(zeroSlice![0])
	zeroSlice = $.append(zeroSlice, 200)
	$.println($.len(zeroSlice))
	$.println($.cap(zeroSlice))
	$.println(zeroSlice![1])

	// Modify slice, check original array
	$.println("--- Modify slice, check array ---")
	let modArr = [10, 20, 30]
	let modSlice: $.Slice<number> = $.goSlice(modArr, undefined, undefined)
	modSlice![1] = 25
	$.println(modArr[1])
	$.println(modSlice![1])

	// Modify array, check slice
	$.println("--- Modify array, check slice ---")
	modArr[0] = 15
	$.println(modArr[0])
	$.println(modSlice![0])

	// Append to sub-slice within capacity
	$.println("--- Append sub-slice w/in capacity ---")
	let appendArr = [1, 2, 3, 4, 5]
	let appendSlice1: $.Slice<number> = $.goSlice(appendArr, 0, 2)
	$.println($.len(appendSlice1))
	$.println($.cap(appendSlice1))
	let appendSlice2: $.Slice<number> = $.append(appendSlice1, 99)
	$.println($.len(appendSlice2))
	$.println($.cap(appendSlice2))
	$.println(appendSlice2![2])
	$.println(appendArr[2])

	// Append to sub-slice exceeding capacity
	$.println("--- Append sub-slice exceed capacity ---")
	let appendSlice3: $.Slice<number> = $.goSlice(appendArr, 3, 5)
	$.println($.len(appendSlice3))
	$.println($.cap(appendSlice3))
	let appendSlice4: $.Slice<number> = $.append(appendSlice3, 101)
	$.println($.len(appendSlice4))
	$.println($.cap(appendSlice4))
	$.println(appendSlice4![0])
	$.println(appendSlice4![1])
	$.println(appendSlice4![2])
	// Original array should NOT be modified beyond its bounds by this append
	$.println(appendArr[0])
	$.println(appendArr[1])
	$.println(appendArr[2])
	$.println(appendArr[3])
	$.println(appendArr[4])

	// Slicing a slice
	$.println("--- Slicing a slice ---")
	let baseSlice: $.Slice<number> = $.arrayToSlice<number>([0, 10, 20, 30, 40, 50])
	let subSlice1: $.Slice<number> = $.goSlice(baseSlice, 1, 4)
	$.println($.len(subSlice1))
	$.println($.cap(subSlice1))
	$.println(subSlice1![0])
	let subSlice2: $.Slice<number> = $.goSlice(subSlice1, 1, 3)
	$.println($.len(subSlice2))
	$.println($.cap(subSlice2))
	$.println(subSlice2![0])
	$.println(subSlice2![1])
	subSlice2![0] = 22
	$.println(subSlice1![1])
	$.println(baseSlice![2])

	// Three-index slicing (if supported) - Check capacity
	$.println("--- Three-index slicing ---")
	let threeIndexArr = [0, 1, 2, 3, 4, 5]
	let threeIndexSlice: $.Slice<number> = $.goSlice(threeIndexArr, 1, 3, 4)
	$.println($.len(threeIndexSlice))
	$.println($.cap(threeIndexSlice))
	$.println(threeIndexSlice![0])
	$.println(threeIndexSlice![1])
	// Appending should modify original array up to new capacity limit
	threeIndexSlice = $.append(threeIndexSlice, 99)
	$.println($.len(threeIndexSlice))
	$.println($.cap(threeIndexSlice))
	$.println(threeIndexSlice![2])
	$.println(threeIndexArr[3])
	// Appending again should reallocate
	threeIndexSlice = $.append(threeIndexSlice, 101)
	$.println($.len(threeIndexSlice))
	$.println($.cap(threeIndexSlice))
	$.println(threeIndexSlice![3])
	$.println(threeIndexArr[4])

	// --- Additional Tests for Full Coverage ---
	$.println("--- Additional Tests ---")

	// Slice literal
	let sliceLiteral: $.Slice<number> = $.arrayToSlice<number>([10, 20, 30])
	$.println("Slice literal len:", $.len(sliceLiteral))
	$.println("Slice literal cap:", $.cap(sliceLiteral))
	$.println("Slice literal[1]:", sliceLiteral![1])

	// Nil slice
	let nilSlice: $.Slice<number> = null as $.Slice<number>
	$.println("Nil slice len:", $.len(nilSlice))
	$.println("Nil slice cap:", $.cap(nilSlice))
	nilSlice = $.append(nilSlice, 5)
	$.println("Append to nil slice len:", $.len(nilSlice))
	$.println("Append to nil slice cap:", $.cap(nilSlice))
	$.println("Append to nil slice[0]:", nilSlice![0])
	let spreadSource: $.Slice<number> = $.arrayToSlice<number>([7, 8])
	nilSlice = $.append(nilSlice, ...(spreadSource ?? []))
	$.println("Append spread slice len:", $.len(nilSlice))
	$.println("Append spread slice[1]:", nilSlice![1])
	$.println("Append spread slice[2]:", nilSlice![2])

	// Out-of-bounds indexing (should panic)
	// Note: Testing panics in compliance tests requires specific handling in the test runner.
	// For now, we'll add the code but expect it to fail if panics are not caught.
	// The runner should ideally catch these panics and verify the error type/message.

	// println("--- Testing out-of-bounds panic ---")
	// smallSlice := []int{1}
	// println(smallSlice[1]) // Index out of bounds (len 1, cap 1) - should panic
	// smallSlice[1] = 10     // Index out of bounds - should panic
	// println(smallSlice[-1]) // Negative index - should panic

	// --- Slices of Slices Tests ---
	$.println("--- Slices of Slices Tests ---")

	// Create a slice of slices of integers
	let sliceOfSlices: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1, 2, 3]), $.arrayToSlice<number>([4, 5]), $.arrayToSlice<number>([6, 7, 8, 9])])

	$.println("Length of sliceOfSlices:", $.len(sliceOfSlices))
	$.println("Capacity of sliceOfSlices:", $.cap(sliceOfSlices))

	// Access elements
	$.println("sliceOfSlices[0][1]:", sliceOfSlices![0]![1])
	$.println("sliceOfSlices[1][0]:", sliceOfSlices![1]![0])
	$.println("sliceOfSlices[2][3]:", sliceOfSlices![2]![3])

	// Append to inner slice (should modify the inner slice)
	$.println("--- Append to inner slice ---")
	let innerSlice: $.Slice<number> = sliceOfSlices![1]
	$.println("Length of innerSlice:", $.len(innerSlice))
	$.println("Capacity of innerSlice:", $.cap(innerSlice))

	innerSlice = $.append(innerSlice, 50)
	$.println("Length of innerSlice after append:", $.len(innerSlice))
	$.println("Capacity of innerSlice after append:", $.cap(innerSlice))
	$.println("innerSlice[2]:", innerSlice![2])

	// Check if the original slice of slices reflects the change (it should, as innerSlice is a view)
	// Note: Appending to innerSlice might reallocate its underlying array if capacity is exceeded.
	// If reallocated, the original sliceOfSlices will *not* see the change at that index.
	// This test case specifically checks the scenario where the append happens within the original capacity
	// or if the reallocation behavior is correctly handled by GoScript.
	// For this simple case, appending 50 to {4, 5} will likely cause reallocation.
	// Let's test appending within capacity first.

	// Create a slice of slices where inner slice has capacity for append
	let sliceOfSlicesWithCap: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1, 2, 3]), $.makeSlice<number>(2, 5, "number"), $.arrayToSlice<number>([6, 7, 8, 9])])
	sliceOfSlicesWithCap![1]![0] = 40
	sliceOfSlicesWithCap![1]![1] = 50

	$.println("--- Append to inner slice with capacity ---")
	let innerSliceWithCap: $.Slice<number> = sliceOfSlicesWithCap![1]
	$.println("Length of innerSliceWithCap:", $.len(innerSliceWithCap))
	$.println("Capacity of innerSliceWithCap:", $.cap(innerSliceWithCap))

	innerSliceWithCap = $.append(innerSliceWithCap, 60)
	$.println("Length of innerSliceWithCap after append:", $.len(innerSliceWithCap))
	$.println("Capacity of innerSliceWithCap after append:", $.cap(innerSliceWithCap))
	$.println("innerSliceWithCap[2]:", innerSliceWithCap![2])

	// Check if the original slice of slices reflects the change (it should, as append was within capacity)
	$.println("sliceOfSlicesWithCap[1][2]:", $.goSlice(sliceOfSlicesWithCap![1], undefined, 3)![2])

	// Append to inner slice exceeding capacity
	$.println("--- Append to inner slice exceeding capacity ---")
	let innerSliceExceedCap: $.Slice<number> = sliceOfSlices![0]
	$.println("Length of innerSliceExceedCap:", $.len(innerSliceExceedCap))
	$.println("Capacity of innerSliceExceedCap:", $.cap(innerSliceExceedCap))

	innerSliceExceedCap = $.append(innerSliceExceedCap, 10, 20)
	$.println("Length of innerSliceExceedCap after append:", $.len(innerSliceExceedCap))
	$.println("Capacity of innerSliceExceedCap after append:", $.cap(innerSliceExceedCap))
	$.println("innerSliceExceedCap[3]:", innerSliceExceedCap![3])
	$.println("innerSliceExceedCap[4]:", innerSliceExceedCap![4])

	// Check if the original slice of slices reflects the change (it should NOT, due to reallocation)
	// The original sliceOfSlices[0] should still be {1, 2, 3}
	$.println("Original sliceOfSlices[0] after inner append:", sliceOfSlices![0]![0], sliceOfSlices![0]![1], sliceOfSlices![0]![2])

	// Slicing a slice of slices
	$.println("--- Slicing a slice of slices ---")
	let subSliceOfSlices: $.Slice<$.Slice<number>> = $.goSlice(sliceOfSlices, 1, 3)
	$.println("Length of subSliceOfSlices:", $.len(subSliceOfSlices))
	$.println("Capacity of subSliceOfSlices:", $.cap(subSliceOfSlices))
	$.println("subSliceOfSlices[0][0]:", subSliceOfSlices![0]![0])
	$.println("subSliceOfSlices[1][2]:", subSliceOfSlices![1]![2])

	// Modify element in sub-slice of slices (should affect original)
	$.println("--- Modify element in sub-slice of slices ---")
	subSliceOfSlices![0]![1] = 55
	$.println("sliceOfSlices[1][1] after sub-slice modification:", sliceOfSlices![1]![1])

	// Append a new slice to the slice of slices
	$.println("--- Append a new slice to slice of slices ---")
	sliceOfSlices = $.append(sliceOfSlices, $.arrayToSlice<number>([100, 110]))
	$.println("Length of sliceOfSlices after append:", $.len(sliceOfSlices))
	$.println("Capacity of sliceOfSlices after append:", $.cap(sliceOfSlices))
	$.println("sliceOfSlices[3][0]:", sliceOfSlices![3]![0])

	// Append an existing slice to the slice of slices
	$.println("--- Append an existing slice to slice of slices ---")
	let existingSlice: $.Slice<number> = $.arrayToSlice<number>([200, 210])
	sliceOfSlices = $.append(sliceOfSlices, existingSlice)
	$.println("Length of sliceOfSlices after appending existing:", $.len(sliceOfSlices))
	$.println("Capacity of sliceOfSlices after appending existing:", $.cap(sliceOfSlices))
	$.println("sliceOfSlices[4][1]:", sliceOfSlices![4]![1])

	// Modify the appended existing slice (should NOT affect the slice in sliceOfSlices if it was copied)
	// Go's append copies the slice header, but the underlying array is shared unless reallocation occurs.
	// Modifying existingSlice *after* appending it should not affect the copy in sliceOfSlices
	// unless they still share the underlying array and the modification is within the shared capacity.
	// Let's test this carefully.
	$.println("--- Modify appended existing slice ---")
	existingSlice![0] = 205
	$.println("sliceOfSlices[4][0] after modifying existingSlice:", sliceOfSlices![4]![0])

	// If we modify an element in the slice within sliceOfSlices, it *should* affect the original existingSlice
	// if they share the underlying array.
	$.println("--- Modify slice within sliceOfSlices ---")
	sliceOfSlices![4]![1] = 215
	$.println("existingSlice[1] after modifying slice within sliceOfSlices:", existingSlice![1])

	// Create a slice of slices using make
	$.println("--- Make slice of slices ---")
	let makeSliceOfSlices: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>(2, 4)
	$.println("Length of makeSliceOfSlices:", $.len(makeSliceOfSlices))
	$.println("Capacity of makeSliceOfSlices:", $.cap(makeSliceOfSlices))

	// Initialize inner slices
	makeSliceOfSlices![0] = $.arrayToSlice<number>([1000, 2000])
	makeSliceOfSlices![1] = $.makeSlice<number>(1, 3, "number")
	makeSliceOfSlices![1]![0] = 3000

	$.println("makeSliceOfSlices[0][1]:", makeSliceOfSlices![0]![1])
	$.println("makeSliceOfSlices[1][0]:", makeSliceOfSlices![1]![0])

	// Append a new inner slice
	makeSliceOfSlices = $.append(makeSliceOfSlices, $.arrayToSlice<number>([4000, 5000]))
	$.println("Length of makeSliceOfSlices after append:", $.len(makeSliceOfSlices))
	$.println("Capacity of makeSliceOfSlices after append:", $.cap(makeSliceOfSlices))
	$.println("makeSliceOfSlices[2][1]:", makeSliceOfSlices![2]![1])

	// Append another new inner slice (should exceed capacity and reallocate outer slice)
	makeSliceOfSlices = $.append(makeSliceOfSlices, $.arrayToSlice<number>([6000]))
	$.println("Length of makeSliceOfSlices after second append:", $.len(makeSliceOfSlices))
	$.println("Capacity of makeSliceOfSlices after second append:", $.cap(makeSliceOfSlices))
	$.println("makeSliceOfSlices[3][0]:", makeSliceOfSlices![3]![0])

	// Nil slice of slices
	$.println("--- Nil slice of slices ---")
	let nilSliceOfSlices: $.Slice<$.Slice<number>> = null as $.Slice<$.Slice<number>>
	$.println("Nil slice of slices len:", $.len(nilSliceOfSlices))
	$.println("Nil slice of slices cap:", $.cap(nilSliceOfSlices))

	// Append to nil slice of slices
	nilSliceOfSlices = $.append(nilSliceOfSlices, $.arrayToSlice<number>([10000]))
	$.println("Length of nilSliceOfSlices after append:", $.len(nilSliceOfSlices))
	$.println("Capacity of nilSliceOfSlices after append:", $.cap(nilSliceOfSlices))
	$.println("nilSliceOfSlices[0][0]:", nilSliceOfSlices![0]![0])

	// Append another slice to the nil slice of slices
	nilSliceOfSlices = $.append(nilSliceOfSlices, $.arrayToSlice<number>([20000, 30000]))
	$.println("Length of nilSliceOfSlices after second append:", $.len(nilSliceOfSlices))
	$.println("Capacity of nilSliceOfSlices after second append:", $.cap(nilSliceOfSlices))
	$.println("nilSliceOfSlices[1][1]:", nilSliceOfSlices![1]![1])

	// Empty slice of slices (not nil)
	$.println("--- Empty slice of slices ---")
	let emptySliceOfSlices: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>(0)
	$.println("Empty slice of slices len:", $.len(emptySliceOfSlices))
	$.println("Empty slice of slices cap:", $.cap(emptySliceOfSlices))

	// Append to empty slice of slices
	emptySliceOfSlices = $.append(emptySliceOfSlices, $.arrayToSlice<number>([40000]))
	$.println("Length of emptySliceOfSlices after append:", $.len(emptySliceOfSlices))
	$.println("Capacity of emptySliceOfSlices after append:", $.cap(emptySliceOfSlices))
	$.println("emptySliceOfSlices[0][0]:", emptySliceOfSlices![0]![0])
}

if ($.isMainScript(import.meta)) {
	await main()
}
