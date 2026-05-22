// Generated file based on binary_precedence.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function valid(n1: number, n2: number, n3: number, n4: number): boolean {
	return (((n1 | n2) | n3) | n4) == 7
}

export async function main(): globalThis.Promise<void> {
	if (valid(1, 2, 4, 0)) {
		$.println("or equals")
	} else {
		$.println("or differs")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
