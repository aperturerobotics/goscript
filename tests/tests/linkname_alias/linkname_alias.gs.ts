// Generated file based on linkname_alias.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as target from "@goscript/github.com/aperturerobotics/goscript/tests/tests/linkname_alias/target/index.js"


export const greet: (name: string) => string = target.Greet

export const add: (a: number, b: number) => number = target.Add

export async function main(): Promise<void> {
	// Test using the linkname alias functions
	$.println(greet("World"))
	$.println(add(2, 3))

	// Also test calling the target package directly
	$.println(target.Greet("Direct"))
}

