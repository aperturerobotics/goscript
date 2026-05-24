// Generated file based on package_import_maps_nil_keys.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as maps from "@goscript/maps/index.js"

import * as iter from "@goscript/iter/index.js"
import "@goscript/maps/index.js"
import "@goscript/iter/index.js"

export async function main(): globalThis.Promise<void> {
	let m: Map<string, number> | null = null as Map<string, number> | null
	let count = 0
	let __goscriptRangeReturn0 = false
	;await (async () => {
		await maps.Keys(m)!(async (__goscriptRange0_0) => {
			count++
			return true
		})
	})()
	if (__goscriptRangeReturn0) {
		return
	}
	$.println("keys:", count)
}

if ($.isMainScript(import.meta)) {
	await main()
}
