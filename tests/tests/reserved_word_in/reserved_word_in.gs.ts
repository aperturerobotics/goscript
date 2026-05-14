// Generated file based on reserved_word_in.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function double(_in: number): number {
	return _in * 2
}

export async function main(): Promise<void> {
	let _in: number = 3
	_in = _in + 1
	let result = double(_in)
	$.println(_in)
	$.println(result)
}


if ($.isMainScript(import.meta)) {
	await main()
}
