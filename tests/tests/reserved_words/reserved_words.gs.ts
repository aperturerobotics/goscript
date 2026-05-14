// Generated file based on reserved_words.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let new: number = 42
	let class: string = "test"
	let typeof: boolean = true
	$.println("new:", new)
	$.println("class:", class)
	$.println("typeof:", typeof)
	let result = testNamedReturn()
	$.println("named return result:", result)
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}

export function testNamedReturn(): number {
	new = 100
	return
}
