// Generated file based on named_results.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function pair(ok: boolean): [number, string] {
	let n: number = 0
	let label: string = ""
	n = 3
	if (ok) {
		label = "ok"
		return [n, label]
	}
	label = "fallback"
	return [n + 1, label]
}

export function single(): number {
	let value: number = 0
	value = 9
	return value
}

export async function main(): globalThis.Promise<void> {
	let [n, label] = pair(true)
	$.println("pair true:", n, label)

	let __goscriptTuple0: any = pair(false)
	n = __goscriptTuple0[0]
	label = __goscriptTuple0[1]
	$.println("pair false:", n, label)

	$.println("single:", single())
}

if ($.isMainScript(import.meta)) {
	await main()
}
