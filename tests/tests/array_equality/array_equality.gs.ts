// Generated file based on array_equality.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Hash = number[]

export function Hash_Valid(h: Hash): boolean {
	return !$.arrayEqual(h, [0, 0, 0, 0])
}

export async function main(): Promise<void> {
	let zero: Hash = Array.from({ length: 4 }, () => 0)
	let one = [0, 7, 0, 0]
	let other = [0, 7, 0, 0]
	let different = [0, 0, 7, 0]

	$.println("zero valid:", Hash_Valid(zero))
	$.println("one valid:", Hash_Valid(one))
	$.println("same:", $.arrayEqual(one, other))
	$.println("different:", $.arrayEqual(one, different))
}


if ($.isMainScript(import.meta)) {
	await main()
}
