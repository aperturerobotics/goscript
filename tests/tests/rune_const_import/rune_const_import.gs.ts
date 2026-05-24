// Generated file based on rune_const_import.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/rune_const_import/subpkg/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/rune_const_import/subpkg/index.js"

export async function main(): globalThis.Promise<void> {
	// Test importing rune constants from another package
	const separator: number = 47
	const newline: number = 10
	const space: number = 32

	// Print the imported rune constants
	$.println("separator:", $.int(separator, 32))
	$.println("newline:", $.int(newline, 32))
	$.println("space:", $.int(space, 32))

	// Use them in comparisons to ensure they're actually numbers
	if ((separator as number) == 47) {
		$.println("separator matches '/'")
	}
	if ((newline as number) == 10) {
		$.println("newline matches '\\n'")
	}
	if ((space as number) == 32) {
		$.println("space matches ' '")
	}

	// Test arithmetic operations (only works with numbers)
	$.println("separator + 1:", $.int(separator + 1, 32))
	$.println("space - 1:", $.int(space - 1, 32))
}

if ($.isMainScript(import.meta)) {
	await main()
}
