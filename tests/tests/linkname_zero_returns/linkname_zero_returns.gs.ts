// Generated file based on linkname_zero_returns.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function externalVoid(): void {
}

export function externalInt(): number {
	return 0
}

export function externalPair(): [number, boolean] {
	return [0, false]
}

export async function main(): Promise<void> {
	externalVoid()
	let [n, ok] = externalPair()
	$.println("int:", externalInt())
	$.println("pair:", n, ok)
}


if ($.isMainScript(import.meta)) {
	await main()
}
