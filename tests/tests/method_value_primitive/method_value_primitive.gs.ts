// Generated file based on method_value_primitive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type myInt = number

export function myInt_add(m: myInt, x: number): number {
	return $.int(m) + x
}

export function myInt_multiply(m: myInt, x: number, y: number): number {
	return $.int(m) * x * y
}

export async function main(): Promise<void> {
	let n: myInt = 5
	let addFn = ((__receiver) => (x: number) => myInt_add(__receiver, x))(n)
	$.println("addFn(3):", addFn(3))
	let mulFn = ((__receiver) => (x: number, y: number) => myInt_multiply(__receiver, x, y))(n)
	$.println("mulFn(2, 3):", mulFn(2, 3))
	let m: myInt = 10
	let addFn2 = ((__receiver) => (x: number) => myInt_add(__receiver, x))(m)
	$.println("addFn2(7):", addFn2(7))
}


if ($.isMainScript(import.meta)) {
	await main()
}
