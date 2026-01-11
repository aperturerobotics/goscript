// Generated file based on multi_return_same_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

// addSub returns sum and difference with named returns of same type
export function addSub(a: number, b: number): [number, number] {
	let sum: number = 0
	let diff: number = 0
	{
		sum = a + b
		diff = a - b
		return [sum, diff]
	}
}

// swap returns two values of the same type
export function swap(a: number, b: number): [number, number] {
	let x: number = 0
	let y: number = 0
	{
		return [b, a]
	}
}

// minmax returns min and max from two values
export function minmax(a: number, b: number): [number, number] {
	let min: number = 0
	let max: number = 0
	{
		if (a < b) {
			return [a, b]
		}
		return [b, a]
	}
}

export async function main(): Promise<void> {
	let [sum, diff] = addSub(17, 5)
	$.println("addSub(17, 5):", sum, diff) // 22, 12

	let [x, y] = swap(10, 20)
	$.println("swap(10, 20):", x, y) // 20, 10

	let [min, max] = minmax(7, 3)
	$.println("minmax(7, 3):", min, max) // 3, 7
}

