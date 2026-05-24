// Generated file based on iterator_simple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function simpleIterator(_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> {
	for (let i = 0; i < 3; i++) {
		if (!await _yield!(i)) {
			return
		}
	}
}

export async function keyValueIterator(_yield: ((_p0: number, _p1: string) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> {
	let values: $.Slice<string> = $.arrayToSlice<string>(["a", "b", "c"])
	for (let __goscriptRangeTarget0 = values, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let v = __goscriptRangeTarget0![i]
		if (!await _yield!(i, v)) {
			return
		}
	}
}

export async function main(): globalThis.Promise<void> {
	$.println("Testing single value iterator:")
	let __goscriptRangeReturn0 = false
	;await (async () => {
		await simpleIterator!(async (v) => {
			$.println("value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn0) {
		return
	}

	$.println("Testing key-value iterator:")
	let __goscriptRangeReturn1 = false
	;await (async () => {
		await keyValueIterator!(async (k, v) => {
			$.println("key:", k, "value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn1) {
		return
	}

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
