// Generated file based on package_import_maps.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as maps from "@goscript/maps/index.js"

import * as slices from "@goscript/slices/index.js"

import * as iter from "@goscript/iter/index.js"

export function getValue(): [string, number] {
	return ["test", 42]
}

export function simpleIterator(m: Map<string, number> | null): ((_p0: ((_p0: string, _p1: number) => boolean | globalThis.Promise<boolean>) | null) => void) | null {
	return $.functionValue((_yield: ((_p0: string, _p1: number) => boolean | globalThis.Promise<boolean>) | null): void => {
		for (const [k, v] of m?.entries() ?? []) {
			if (!_yield!(k, v)) {
				break
			}
		}
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] }], results: [] })
}

export async function main(): globalThis.Promise<void> {
	// Create a map to test with
	let m: Map<string, number> | null = new Map<string, number>([["a", 1], ["b", 2], ["c", 3]])

	// Collect results in a slice to ensure deterministic output
	let results: $.Slice<string> = null as $.Slice<string>

	// Test maps.All which returns an iterator function (this tests the maps package import)
	let __goscriptRangeReturn0 = false
	;(() => {
		maps.All(m)!((k, v) => {
			// Simple assignment that should trigger the error
			let [x, y] = getValue()
			let result = (k + x) + String.fromCodePoint($.int(v + y, 32))
			results = $.append(results, result)
			return true
		})
	})()
	if (__goscriptRangeReturn0) {
		return
	}

	// Also test simpleIterator to ensure our local iterator works
	let __goscriptRangeReturn1 = false
	;(() => {
		simpleIterator(m)!((k, v) => {
			let [x, y] = getValue()
			let result = ((k + x) + String.fromCodePoint($.int(v + y, 32))) + "_local"
			results = $.append(results, result)
			return true
		})
	})()
	if (__goscriptRangeReturn1) {
		return
	}

	// Sort results for deterministic output
	slices.Sort(results)

	// Print sorted results
	for (let __rangeIndex = 0; __rangeIndex < $.len(results); __rangeIndex++) {
		let result = results![__rangeIndex]
		$.println("Result:", result)
	}

	let dst: Map<string, number> | null = new Map<string, number>([["base", 1]])
	let src: Map<string, number> | null = new Map<string, number>([["copied", 2]])
	maps.Copy(dst, src)
	let nilSrc: Map<string, number> | null = null as Map<string, number> | null
	maps.Copy(dst, nilSrc)
	$.println("Copy result:", $.mapGet(dst, "base", 0)[0], $.mapGet(dst, "copied", 0)[0], $.len(dst))
	let cloned: Map<string, number> | null = maps.Clone(dst)
	let nilMap: Map<string, number> | null = null as Map<string, number> | null
	$.println("Clone result:", $.mapGet(cloned, "base", 0)[0], $.mapGet(cloned, "copied", 0)[0], maps.Clone(nilMap) == null)

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
