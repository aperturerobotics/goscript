// Generated file based on package_import_maps_nil_keys.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as maps from "@goscript/maps/index.js"

import * as iter from "@goscript/iter/index.js"

export async function main(): globalThis.Promise<void> {
	let m: Map<string, number> | null = null
	let count = 0
	let __goscriptRangeReturn3062395 = false
	;(() => {
		maps.Keys(m)!((__goscriptRange0_0) => {
			count++
			return true
		})
	})()
	if (__goscriptRangeReturn3062395) {
		return
	}
	$.println("keys:", count)
}

if ($.isMainScript(import.meta)) {
	await main()
}
