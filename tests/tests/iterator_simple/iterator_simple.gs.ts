// Generated file based on iterator_simple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function simpleIterator(_yield: ((_p0: number) => boolean) | null): void {
	for (let i = 0; i < 3; i++) {
		if (!_yield!(i)) {
			return
		}
	}
}

export function keyValueIterator(_yield: ((_p0: number, _p1: string) => boolean) | null): void {
	let values = $.arrayToSlice<string>(["a", "b", "c"])
	for (let i = 0; i < $.len(values); i++) {
		let v = values![i]
		if (!_yield!(i, v)) {
			return
		}
	}
}

export async function main(): Promise<void> {
	$.println("Testing single value iterator:")
	let __goscriptRangeReturn331 = false
	;(() => {
		simpleIterator!((v) => {
			$.println("value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn331) {
		return
	}

	$.println("Testing key-value iterator:")
	let __goscriptRangeReturn431 = false
	;(() => {
		keyValueIterator!((k, v) => {
			$.println("key:", k, "value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn431) {
		return
	}

	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
