// Generated file based on rune_const_import.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/rune_const_import/subpkg/index.ts"

export async function main(): Promise<void> {
	const separator: number = subpkg.Separator
	const newline: number = subpkg.Newline
	const space: number = subpkg.Space
	$.println("separator:", separator)
	$.println("newline:", newline)
	$.println("space:", space)
	if (separator == 47) {
		$.println("separator matches '/'")
	}
	if (newline == 10) {
		$.println("newline matches '\\n'")
	}
	if (space == 32) {
		$.println("space matches ' '")
	}
	$.println("separator + 1:", separator + 1)
	$.println("space - 1:", space - 1)
}


if ($.isMainScript(import.meta)) {
	await main()
}
