// Generated file based on package_import_maps.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as maps from "@goscript/maps/index.ts"

import * as slices from "@goscript/slices/index.ts"

export function getValue(): [string, number] {
	return ["test", 42]
}

export function simpleIterator(m: Map<string, number> | null): (_p0: (_p0: string, _p1: number) => boolean) => void {
	return $.functionValue((_yield: (_p0: string, _p1: number) => boolean): void => {
	for (const [k, v] of m?.entries() ?? []) {
		if (!_yield(k, v)) {
			break
		}
	}
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] }], results: [] })
}

export async function main(): Promise<void> {
	let m = new Map<string, number>([["a", 1], ["b", 2], ["c", 3]])
	let results: $.Slice<string> = null
	;(() => {
		maps.All(m)!((k, v) => {
			let [x, y] = getValue()
			let result = k + x + String.fromCodePoint($.int(v + y))
			results = $.append(results, result)
			return true
		})
	})()
	;(() => {
		simpleIterator(m)!((k, v) => {
			let [x, y] = getValue()
			let result = k + x + String.fromCodePoint($.int(v + y)) + "_local"
			results = $.append(results, result)
			return true
		})
	})()
	slices.Sort(results)
	for (let __rangeIndex = 0; __rangeIndex < $.len(results); __rangeIndex++) {
		let result = results![__rangeIndex]
		$.println("Result:", result)
	}
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
