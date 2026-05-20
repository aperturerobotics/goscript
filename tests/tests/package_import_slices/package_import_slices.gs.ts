// Generated file based on package_import_slices.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

export async function main(): Promise<void> {
	let s = $.arrayToSlice<number>([1, 2, 3, 4, 5])

	// This should trigger the interface range issue
	// slices.All returns an iterator interface that can be ranged over
	let __goscriptRangeReturn3110826 = false
	;(() => {
		slices.All(s)!((i, v) => {
			$.println("index:", i, "value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn3110826) {
		return
	}

	let cloned = slices.Clone(s)
	cloned![0] = 99
	$.println("clone first:", cloned![0], "original first:", s![0], "same len:", $.len(cloned) == $.len(s))
	let nilSlice: $.Slice<number> = null
	$.println("nil clone:", slices.Clone(nilSlice) == null)

	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
