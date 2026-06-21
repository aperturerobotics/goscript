// Generated file based on linkname_alias.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as target from "@goscript/github.com/s4wave/goscript/tests/tests/linkname_alias/target/index.ts"

export function greet(name: string): string {
}

export function add(a: number, b: number): number {
}

export async function main(): Promise<void> {
	$.println(greet("World"))
	$.println(add(2, 3))
	$.println(target.Greet("Direct"))
}


if ($.isMainScript(import.meta)) {
	await main()
}
