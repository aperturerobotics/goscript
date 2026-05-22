// Generated file based on method_value_primitive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type myInt = number

export function myInt_add(m: myInt, x: number): number {
	return $.int(m) + x
}

export function myInt_multiply(m: myInt, x: number, y: number): number {
	return ($.int(m) * x) * y
}

export async function main(): globalThis.Promise<void> {
	let n: myInt = 5

	// Method value: binding the receiver to create a function
	let addFn: ((x: number) => number | globalThis.Promise<number>) | null = ((__receiver) => (x: number) => myInt_add(__receiver, x))(n)
	$.println("addFn(3):", await addFn!(3))

	let mulFn: ((x: number, y: number) => number | globalThis.Promise<number>) | null = ((__receiver) => (x: number, y: number) => myInt_multiply(__receiver, x, y))(n)
	$.println("mulFn(2, 3):", await mulFn!(2, 3))

	// Test with different receiver value
	let m: myInt = 10
	let addFn2: ((x: number) => number | globalThis.Promise<number>) | null = ((__receiver) => (x: number) => myInt_add(__receiver, x))(m)
	$.println("addFn2(7):", await addFn2!(7))
}


if ($.isMainScript(import.meta)) {
	await main()
}
