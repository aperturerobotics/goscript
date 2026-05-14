// Generated file based on multi_return_same_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function addSub(a: number, b: number): void {
	sum = a + b
	diff = a - b
	return
}

export function swap(a: number, b: number): void {
	return [b, a]
}

export function minmax(a: number, b: number): void {
	if (a < b) {
		return [a, b]
	}
	return [b, a]
}

export async function main(): Promise<void> {
	let [sum, diff] = addSub(17, 5)
	$.println("addSub(17, 5):", sum, diff)
	let [x, y] = swap(10, 20)
	$.println("swap(10, 20):", x, y)
	let [min, max] = minmax(7, 3)
	$.println("minmax(7, 3):", min, max)
}


if ($.isMainScript(import.meta)) {
	await main()
}
