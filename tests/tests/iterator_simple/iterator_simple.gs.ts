// Generated file based on iterator_simple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function simpleIterator(yield: (_p0: number) => boolean): void {
	for (let i = 0; i < 3; i++) {
		if (!yield(i)) {
			return
		}
	}
}

export function keyValueIterator(yield: (_p0: number, _p1: string) => boolean): void {
	let values = ["a", "b", "c"]
	for (let i = 0; i < $.len(values); i++) {
		let v = values[i]
		if (!yield(i, v)) {
			return
		}
	}
}

export async function main(): Promise<void> {
	$.println("Testing single value iterator:")
	for (let v = 0; v < $.len(simpleIterator); v++) {
		$.println("value:", v)
	}
	$.println("Testing key-value iterator:")
	for (let k = 0; k < $.len(keyValueIterator); k++) {
		let v = keyValueIterator[k]
		$.println("key:", k, "value:", v)
	}
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
