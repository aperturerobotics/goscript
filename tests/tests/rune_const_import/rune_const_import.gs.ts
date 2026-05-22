// Generated file based on rune_const_import.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/rune_const_import/subpkg/index.js"

export async function main(): globalThis.Promise<void> {
	// Test importing rune constants from another package
	const separator: number = 47
	const newline: number = 10
	const space: number = 32

	// Print the imported rune constants
	$.println("separator:", separator)
	$.println("newline:", newline)
	$.println("space:", space)

	// Use them in comparisons to ensure they're actually numbers
	if (separator == 47) {
		$.println("separator matches '/'")
	}
	if (newline == 10) {
		$.println("newline matches '\\n'")
	}
	if (space == 32) {
		$.println("space matches ' '")
	}

	// Test arithmetic operations (only works with numbers)
	$.println("separator + 1:", separator + 1)
	$.println("space - 1:", space - 1)
}


if ($.isMainScript(import.meta)) {
	await main()
}
