// Generated file based on method_value_primitive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type myInt = number;

export function myInt_add(m: myInt, x: number): number {
	return m + x
}

export function myInt_multiply(m: myInt, x: number, y: number): number {
	return m * x * y
}


export async function main(): Promise<void> {
	let n: myInt = 5

	// Method value: binding the receiver to create a function
	let addFn = ((_p0: number) => myInt_add(n, _p0))
	$.println("addFn(3):", addFn!(3)) // Should print 8

	let mulFn = ((_p0: number, _p1: number) => myInt_multiply(n, _p0, _p1))
	$.println("mulFn(2, 3):", mulFn!(2, 3)) // Should print 30

	// Test with different receiver value
	let m: myInt = 10
	let addFn2 = ((_p0: number) => myInt_add(m, _p0))
	$.println("addFn2(7):", addFn2!(7)) // Should print 17
}

