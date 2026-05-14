// Generated file based on reserved_word_in.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function double(in: number): number {
	return in * 2
}

export async function main(): Promise<void> {
	let in: number = 3
	in = in + 1
	let result = double(in)
	$.println(in)
	$.println(result)
}


if ($.isMainScript(import.meta)) {
	await main()
}
