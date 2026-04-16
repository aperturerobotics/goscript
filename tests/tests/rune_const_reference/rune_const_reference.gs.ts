// Generated file based on rune_const_reference.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/rune_const_reference/subpkg/index.ts"

export async function main(): Promise<void> {
	// Test importing rune constants from another package
	let separator: number = subpkg.Separator
	let newline: number = subpkg.Newline

	// This should use the variable name instead of evaluating to numeric literal
	$.println("separator used in function:", useInFunction(47))
	$.println("newline used in function:", useInFunction(10))
}

export function useInFunction(r: number): number {
	return r + 1
}

