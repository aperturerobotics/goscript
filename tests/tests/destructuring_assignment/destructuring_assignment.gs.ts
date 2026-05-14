// Generated file based on destructuring_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as fmt from "@goscript/fmt/index.ts"

export function multiReturn(): [number, number] {
	return [10, 20]
}

export function multiReturnThree(): [string, number, number] {
	return ["test", 100, 200]
}

export async function main(): Promise<void> {
	let [x, y] = multiReturn()
	fmt.Printf("x=%d, y=%d\n", x, y)
	let [name, line, col] = multiReturnThree()
	fmt.Printf("name=%s, line=%d, col=%d\n", name, line, col)
	let a: number = 0
	let b: number = 0
	let __goscriptTuple4670816 = multiReturn()
	a = __goscriptTuple4670816[0]
	b = __goscriptTuple4670816[1]
	fmt.Printf("a=%d, b=%d\n", a, b)
}


if ($.isMainScript(import.meta)) {
	await main()
}
