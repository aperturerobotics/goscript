// Generated file based on destructuring_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

export function multiReturn(): [number, number] {
	return [10, 20]
}

export function multiReturnThree(): [string, number, number] {
	return ["test", 100, 200]
}

export async function main(): Promise<void> {
	// Test simple destructuring that should work
	let [x, y] = multiReturn()
	fmt.Printf("x=%d, y=%d\n", x, y)

	// Test three-value destructuring
	let [name, line, col] = multiReturnThree()
	fmt.Printf("name=%s, line=%d, col=%d\n", name, line, col)

	// Test reassignment to existing variables
	let a: number = 0
	let b: number = 0
	;[a, b] = multiReturn()
	fmt.Printf("a=%d, b=%d\n", a, b)
}

