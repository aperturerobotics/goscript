// Generated file based on reserved_word_in.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function double(_in: number): number {
	return _in * 2
}

export async function main(): Promise<void> {
	// Test simple variable named 'in'
	let _in: number = 3
	_in = _in + 1

	// Test function parameter named 'in'
	let result = double(_in)

	$.println(_in) // 4
	$.println(result) // 8
}

