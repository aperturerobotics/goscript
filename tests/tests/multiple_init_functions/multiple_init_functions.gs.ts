// Generated file based on multiple_init_functions.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let value: number = 0

function __goscriptInit0(): void {
	value = 1
}

export let increment: number = 2

function __goscriptInit1(): void {
	value += increment
}

export async function main(): globalThis.Promise<void> {
	$.println("init value:", value)
}

__goscriptInit0()

__goscriptInit1()

if ($.isMainScript(import.meta)) {
	await main()
}
