// Generated file based on array_equality.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Hash = Uint8Array

export function Hash_Valid(h: Hash): boolean {
	return !$.arrayEqual(h, new Uint8Array(4))
}

export async function main(): globalThis.Promise<void> {
	let zero: Hash = new Uint8Array(4)
	let one = new Uint8Array([0, $.uint(7, 8), 0, 0])
	let other = new Uint8Array([0, $.uint(7, 8), 0, 0])
	let different = new Uint8Array([0, 0, $.uint(7, 8), 0])

	$.println("zero valid:", Hash_Valid(zero))
	$.println("one valid:", Hash_Valid(one))
	$.println("same:", $.arrayEqual(one, other))
	$.println("different:", $.arrayEqual(one, different))
}

if ($.isMainScript(import.meta)) {
	await main()
}
