// Generated file based on rune_const_import.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/rune_const_import/subpkg/index.js"

export async function main(): Promise<void> {
	// Test importing rune constants from another package
	let separator: number = subpkg.Separator
	let newline: number = subpkg.Newline
	let space: number = subpkg.Space

	// Print the imported rune constants
	$.println("separator:", 47)
	$.println("newline:", 10)
	$.println("space:", 32)

	// Use them in comparisons to ensure they're actually numbers
	if (47 == 47) {
		$.println("separator matches '/'")
	}
	if (10 == 10) {
		$.println("newline matches '\\n'")
	}
	if (32 == 32) {
		$.println("space matches ' '")
	}

	// Test arithmetic operations (only works with numbers)
	$.println("separator + 1:", 47 + 1)
	$.println("space - 1:", 32 - 1)
}

