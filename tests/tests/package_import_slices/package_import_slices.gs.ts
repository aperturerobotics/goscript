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

	$.println("equal:", slices.Equal($.arrayToSlice<number>([1, 2]), $.arrayToSlice<number>([1, 2])), slices.Equal($.arrayToSlice<number>([1]), $.arrayToSlice<number>([2])))
	$.println("equal func:", slices.EqualFunc($.arrayToSlice<number>([1, 3]), $.arrayToSlice<number>([5, 7]), $.functionValue((a: number, b: number): boolean => {
		return (a % 2) == (b % 2)
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })))
	$.println("contains:", slices.Contains(s, 3), slices.ContainsFunc(s, $.functionValue((v: number): boolean => {
		return v > 4
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })))
	let inserted = slices.Insert($.arrayToSlice<number>([1, 4]), 1, 2, 3)
	$.println("insert:", inserted![0], inserted![1], inserted![2], inserted![3])
	slices.Reverse(inserted)
	$.println("reverse:", inserted![0], inserted![1], inserted![2], inserted![3])

	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
