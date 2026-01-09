// Generated file based on make_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	$.println("--- Testing make() with slices ---")

	// Test 1: Basic make with length only
	$.println("--- Basic make with length only ---")
	let s1 = $.makeSlice<number>(5, undefined, 'number')
	$.println("len(s1):", $.len(s1)) // 5
	$.println("cap(s1):", $.cap(s1)) // 5

	// Test 2: Make with length and capacity
	$.println("--- Make with length and capacity ---")
	let s2 = $.makeSlice<number>(3, 10, 'number')
	$.println("len(s2):", $.len(s2)) // 3
	$.println("cap(s2):", $.cap(s2)) // 10

	// Test 3: Make bytes with zero length, large capacity
	$.println("--- Make bytes with zero length, large capacity ---")
	let b1 = $.makeSlice<number>(0, 100000, 'byte')
	$.println("len(b1):", $.len(b1)) // 0
	$.println("cap(b1):", $.cap(b1)) // 100000

	// Test 4: Make bytes with length and capacity
	$.println("--- Make bytes with length and capacity ---")
	let b2 = $.makeSlice<number>(10, 50, 'byte')
	$.println("len(b2):", $.len(b2)) // 10
	$.println("cap(b2):", $.cap(b2)) // 50

	// Test 5: Make with zero capacity
	$.println("--- Make with zero capacity ---")
	let s3 = $.makeSlice<number>(0, 0, 'number')
	$.println("len(s3):", $.len(s3)) // 0
	$.println("cap(s3):", $.cap(s3)) // 0

	// Test 6: Make with equal length and capacity
	$.println("--- Make with equal length and capacity ---")
	let s4 = $.makeSlice<string>(7, 7, 'string')
	$.println("len(s4):", $.len(s4)) // 7
	$.println("cap(s4):", $.cap(s4)) // 7

	// Test 7: Append to slice with extra capacity
	$.println("--- Append to slice with extra capacity ---")
	let s5 = $.makeSlice<number>(2, 5, 'number')
	s5![0] = 10
	s5![1] = 20
	$.println("Before append - len:", $.len(s5), "cap:", $.cap(s5)) // len: 2, cap: 5
	s5 = $.append(s5, 30)
	$.println("After append - len:", $.len(s5), "cap:", $.cap(s5)) // len: 3, cap: 5
	$.println("s5[2]:", s5![2]) // 30

	// Test 8: Append to bytes with extra capacity
	$.println("--- Append to bytes with extra capacity ---")
	let b3 = $.makeSlice<number>(1, 10, 'byte')
	b3![0] = 65 // 'A'
	$.println("Before append - len:", $.len(b3), "cap:", $.cap(b3)) // len: 1, cap: 10
	b3 = $.append(b3, 66) // 'B'
	$.println("After append - len:", $.len(b3), "cap:", $.cap(b3)) // len: 2, cap: 10
	$.println("b3[0]:", b3![0]) // 65
	$.println("b3[1]:", b3![1]) // 66

	// Test 9: Large capacity slice
	$.println("--- Large capacity slice ---")
	let large = $.makeSlice<number>(5, 1000000, 'number')
	$.println("len(large):", $.len(large)) // 5
	$.println("cap(large):", $.cap(large)) // 1000000

	// Test 10: Zero length, various capacities
	$.println("--- Zero length, various capacities ---")
	let z1 = $.makeSlice<number>(0, 1, 'byte')
	let z2 = $.makeSlice<number>(0, 100, 'byte')
	let z3 = $.makeSlice<number>(0, 10000, 'byte')
	$.println("z1 - len:", $.len(z1), "cap:", $.cap(z1)) // len: 0, cap: 1
	$.println("z2 - len:", $.len(z2), "cap:", $.cap(z2)) // len: 0, cap: 100
	$.println("z3 - len:", $.len(z3), "cap:", $.cap(z3)) // len: 0, cap: 10000

	// Test 11: Slice operations on made slices
	$.println("--- Slice operations on made slices ---")
	let s6 = $.makeSlice<number>(10, 20, 'number')
	for (let i = 0; i < 10; i++) {
		s6![i] = i * 10
	}
	let sub = $.goSlice(s6, 2, 5) // Should have len=3, cap=18 (20-2)
	$.println("sub - len:", $.len(sub), "cap:", $.cap(sub)) // len: 3, cap: 18
	$.println("sub[0]:", sub![0]) // 20
	$.println("sub[2]:", sub![2]) // 40

	// Test 12: String slices with capacity
	$.println("--- String slices with capacity ---")
	let str = $.makeSlice<string>(3, 8, 'string')
	str![0] = "hello"
	str![1] = "world"
	str![2] = "test"
	$.println("str - len:", $.len(str), "cap:", $.cap(str)) // len: 3, cap: 8
	$.println("str[1]:", str![1]) // world

	$.println("--- All tests completed ---")
}

