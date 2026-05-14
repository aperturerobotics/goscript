// Generated file based on rune_const_reference.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/rune_const_reference/subpkg/index.ts"

export async function main(): Promise<void> {
	const separator: number = subpkg.Separator
	const newline: number = subpkg.Newline
	$.println("separator used in function:", useInFunction(separator))
	$.println("newline used in function:", useInFunction(newline))
}


if ($.isMainScript(import.meta)) {
	await main()
}

export function useInFunction(r: number): number {
	return r + 1
}
